import { getConfig } from "../config";
import { Migrator } from "./migrator";
import { beforeEach, afterEach, afterAll } from "vitest";
import { DB } from "../db";
import { createHash, randomBytes } from "crypto";
const TestUser = "pgtdbuser";
const TestPassword = "pgtdbpass";

export function useTestDatabase({
  conf = getConfig().db,
  migrator = new Migrator(),
} = {}) {
  let testDB;
  let baseDB;
  let testDBConfig;

  beforeEach(async () => {
    try {
      // Init new DB
      baseDB = new DB();
    } catch (e) {
      throw new Error(
        `Failed to connect to test database, is docker-compose running? : ${e}`
      );
    }

    // Setup test database
    // 1. Create user
    await ensureUser(baseDB);

    // 2. Create template
    const template = await getOrCreateTemplate(baseDB, conf, migrator);

    // 3. Create instance
    testDBConfig = await createInstance(baseDB, template);

    // 4. Create testDB
    testDB = new DB();
    await testDB.set({ max: 1, ...testDBConfig }).catch(err => console.error('Error setting testDB', err));
  });

  afterEach(async () => {
    // After each test, destroy the testDB, releasing the pool
    if (testDB !== undefined) {
      await testDB.destroy();
    }

    // Remove the testdb from the server
    if (baseDB !== undefined) {
      await baseDB.pool(`DROP DATABASE IF EXISTS ${testDBConfig.database}`);
      await baseDB.destroy();
    }

    await baseDB.reset();
  });
  afterAll(async () => {
    await baseDB.destroy();
  });
}

let template;

async function getOrCreateTemplate(
  db,
  conf,
  migrator
) {
  const hash = await migrator.hash();

  if (template !== undefined) {
    if (template.hash !== hash) {
      // Migrations shouldn't change during a single test run
      throw new Error("migrator hash changed, this should not happen");
    }
    return template;
  }

  const dbName = `testdb_tpl_${hash}`;
  const newTemplate = {
    conf: {
      host: conf.host,
      port: conf.port,
      user: TestUser,
      password: TestPassword,
      database: dbName,
    },
    hash: hash,
  };
  template = newTemplate;

  await withLock(db, dbName, async (client) => {
    await ensureTemplate(client, migrator, newTemplate);
  });

  return newTemplate;
}

// ensureUserCalled is used to guarantee that the testdb user/role is only get-or-created at
// most once per process.
let ensureUserCalled = false;

async function ensureUser(db) {
  if (ensureUserCalled) {
    return;
  }

  ensureUserCalled = true;
  await withLock(db, 'testdb-user', async (client) => {
    const roleExists = (
      await client.query(`SELECT EXISTS (SELECT from pg_catalog.pg_roles WHERE rolname = '${TestUser}')`)
    ).rows[0];

    if (roleExists.exists) {
      return;
    }

    await client.query(`CREATE ROLE ${TestUser}`);
    await client.query(`ALTER ROLE ${TestUser} WITH LOGIN PASSWORD '${TestPassword}' NOSUPERUSER NOCREATEDB NOCREATEROLE`);
  });
}

async function createInstance(
  db,
  template
) {
  const testConf = { ...template.conf };
  testConf.database = `testdb_tpl_${template.hash}_inst_${randomID()}`;
  await db.pool(`CREATE DATABASE ${testConf.database} WITH TEMPLATE ${template.conf.database} OWNER ${testConf.user}`);

  return testConf;
}


async function ensureTemplate(
  client,
  migrator,
  state
) {
  // If the template database already exists, and is marked as a template,
  // there is no more work to be done.
  const templateExists = await client.query(`SELECT EXISTS (SELECT FROM pg_database WHERE datname = $1 AND datistemplate = true)`, [state.conf.database]);
  if (templateExists.rows[0].exists) {
    return;
  }
  console.log('template does not exist', { state });
  // If the template database already exists, but it is not marked as a
  // template, there was a failure at some point during the creation process
  // so it needs to be deleted.
  try {
    await client.query(`DROP DATABASE IF EXISTS ${state.conf.database}`);
  } catch (e) {
    console.log('failed to drop', e);
  }
  console.log('dropped');
  await client.query(`CREATE DATABASE ${state.conf.database} OWNER ${state.conf.user}`).catch(e => {
    console.log('failed to create', e);
  });
  console.log('migrating');

  await migrator.migrate(state.conf).catch(e => {
    console.log('failed to migrate', e);
  });
  console.log('migrated');

  // Finalize the creation of the template by marking it as a
  // template.
  await client.query(`UPDATE pg_database SET datistemplate = true WHERE datname=$1`, [state.conf.database]);
}

const idPrefix = "sessionlock-";

function id(name) {
  const hash = createHash("md5");
  hash.update(idPrefix + name);
  const hexString = hash.digest("hex");

  const hexInt = parseInt(hexString, 16);
  return hexInt | 0; // Convert to 32-bit integer
}


async function withLock(
  db,
  lockName,
  cb
) {
  const lockID = id(lockName);

  const client = await db.getClient();
  try {
    await client.query(`SELECT pg_advisory_lock(${lockID})`, []);
    await cb(client);
  } catch (e) {
    console.log('failed to lock', e);
  } finally {
    await client.query(`SELECT pg_advisory_unlock(${lockID})`, []);
    await client.release();
  }
}



function randomID() {
  const hash = createHash("md5");
  hash.update(randomBytes(4));
  return hash.digest("hex");
}