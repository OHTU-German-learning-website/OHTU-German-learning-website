import { getConfig } from "../config";
import { Migrator } from "./migrator";
import { beforeEach, afterEach } from "vitest";
import { DB } from "../db";
import { createHash, randomBytes } from "crypto";
const TestUser = "pgtdbuser";
const TestPassword = "pgtdbpass";

export function useTestDatabase({
  conf = getConfig().db,
  migrator = new Migrator(),
  verbose = false,
  dropWhenDone = true,
} = {}) {
  let testDB;
  let baseDB;
  let testDBConfig;

  beforeEach(async () => {
    try {
      baseDB = new DB();
    } catch (e) {
      throw new Error(
        `Failed to connect to test database, is docker-compose running? : ${e}`
      );
    }

    await ensureUser(baseDB);

    const template = await getOrCreateTemplate(baseDB, conf, migrator);
    console.log(template);
    testDBConfig = await createInstance(baseDB, template);

    testDB = new DB();
    await testDB.set({ max: 1, ...testDBConfig });
  });

  afterEach(async () => {
    if (testDB !== undefined) {
      await testDB.destroy();
    }
    // Remove the testdb from the server
    if (baseDB !== undefined) {
      await baseDB.query(`DROP DATABASE IF EXISTS ${testDBConfig.database}`, []);
      await baseDB.destroy();
    }

    await baseDB.reset();

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

  await withLock(db, dbName, async (db) => {
    await ensureTemplate(db, migrator, newTemplate);
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
  await withLock(db, 'testdb-user', async (db) => {
    const roleExists = (
      await db.query(`SELECT EXISTS (SELECT from pg_catalog.pg_roles WHERE rolname = $1)`, [TestUser])
    ).rows[0];

    if (roleExists.exists) {
      return;
    }

    await db.query(`CREATE ROLE ${TestUser}`, []);
    await db.query(`ALTER ROLE ${TestUser} WITH LOGIN PASSWORD '${TestPassword}' NOSUPERUSER NOCREATEDB NOCREATEROLE`, []);
  });
}

async function createInstance(
  db,
  template
) {
  const testConf = { ...template.conf };
  testConf.database = `testdb_tpl_${template.hash}_inst_${randomID()}`;
  await db.query(`CREATE DATABASE ${testConf.database} WITH TEMPLATE ${template.conf.database} OWNER ${testConf.user}`);

  return testConf;
}


async function ensureTemplate(
  db,
  migrator,
  state
) {
  // If the template database already exists, and is marked as a template,
  // there is no more work to be done.
  const templateExists = await db.query(`SELECT EXISTS (SELECT FROM pg_database WHERE datname = $1 AND datistemplate = true)`, [state.conf.database]);
  if (templateExists.rows[0].exists) {
    return;
  }

  // If the template database already exists, but it is not marked as a
  // template, there was a failure at some point during the creation process
  // so it needs to be deleted.
  await db.query(`DROP DATABASE IF EXISTS ${state.conf.database}`, []);

  await db.query(`CREATE DATABASE ${state.conf.database} OWNER ${state.conf.user}`, []);

  await migrator.migrate(state.conf);

  // Finalize the creation of the template by marking it as a
  // template.
  await db.query(`UPDATE pg_database SET datistemplate = true WHERE datname=$1`, [state.conf.database]);
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

  await db.transaction(async (db) => {
    try {
      await db.query(`SELECT pg_advisory_lock(${lockID})`, []);
      await cb(db);
    } finally {
      await db.query(`SELECT pg_advisory_unlock(${lockID})`, []);
    }
  });
}


function randomID() {
  const hash = createHash("md5");
  hash.update(randomBytes(4));
  return hash.digest("hex");
}