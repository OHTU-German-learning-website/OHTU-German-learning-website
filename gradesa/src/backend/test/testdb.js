import { Migrator } from "./migrator";

export function useTestDatabase({
  conf = {
    database: "postgres",
    host: "localhost",
    user: "postgres",
    password: "password",
    port: 6542,
  },
  migrator = new Migrator(),
  verbose = false,
  dropWhenDone = true,
} = {}) {
  let testDB;
  let baseDB;
  let testDBConfig;

  beforeEach(async () => {
    try {
      baseDB = ;
    } catch (e) {
      throw new Error(
        `Failed to connect to test database, is docker-compose running? : ${e}`
      );
    }

    await ensureUser(baseDB);

    const template = await getOrCreateTemplate(baseDB, conf, migrator);

    testDBConfig = await createInstance(baseDB, template);

    // migrator.verify is a bit slow so we skip it. If we see
    // consistency issues (we shouldn't) we can re-enable it.
    // await migrator.verify(testDBConfig);

    testDB = connectToDB({ max: 1, ...testDBConfig }, logger, verbose);
    Realm.set(testDB);
  });

  afterEach(async () => {
    if (testDB !== undefined) {
      await testDB.destroy();
    }
    // Remove the testdb from the server
    // TODO: keep around if test failed. However, for some reason
    // there's no smart way to check this in jest
    if (baseDB !== undefined) {
      if (dropWhenDone) {
        await sql`DROP DATABASE IF EXISTS ${sql.id(
          testDBConfig.database
        )};`.execute(baseDB);
      } else {
        const c = testDBConfig;
        console.log(
          `Testdatabase URL: postgres://${c.user}:${c.password}@${c.host}:${c.port}/${c.database}`
        );
      }
      baseDB.destroy();
    }

    await Realm.reset();
    await Queue.close();
    Object.getOwnPropertyNames(attributeValues).forEach(function (prop) {
      delete attributeValues[prop];
    });
  });

  afterAll(async () => {
    await Threadpool.terminate();
  });
}
// ensureUserCalled is used to guarantee that the testdb user/role is only get-or-created at
// most once per process. get-or-creating it multiple times is fine (due to the lock), but
// unnecessary.
let ensureUserCalled = false;

async function ensureUser(db) {
  if (ensureUserCalled) {
    return;
  }
  ensureUserCalled = true;

  await withLock(db, "testdb-user", async (db) => {
    const roleExists = (
      await sql`SELECT EXISTS (SELECT from pg_catalog.pg_roles WHERE rolname = ${TestUser})`.execute(
        db
      )
    ).rows[0];

    if (roleExists.exists) {
      return;
    }

    await sql`CREATE ROLE ${sql.id(TestUser)}`.execute(db);
    await sql`ALTER ROLE ${sql.id(TestUser)} WITH LOGIN PASSWORD '${sql.raw(
      TestPassword
    )}' NOSUPERUSER NOCREATEDB NOCREATEROLE`.execute(db);
  });
}