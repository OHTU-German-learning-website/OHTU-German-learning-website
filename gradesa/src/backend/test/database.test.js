import { DB } from "../db";
import { describe, it, expect } from 'vitest';
import { useTestDatabase } from "./testdb";
describe('database', () => {
  useTestDatabase();

  it("Should allow for creation of tables", async () => {
    const instance = new DB();
    const db = await instance.get();
    await db.query("CREATE TABLE TEST (id SERIAL PRIMARY KEY, value TEXT)");
    await db.query("INSERT INTO TEST (value) VALUES ('test')");
    const result = await db.query("SELECT * FROM TEST");
    expect(result).toBeDefined();
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].value).toBe("test");
  });
  it("should not carry over changes between tests", async () => {
    const instance = new DB();
    const db = await instance.get();
    expect(async () => await db.query("SELECT * FROM TEST")).rejects.toThrow();
  });
});
describe("db wrapper", () => {
  it("should create a new database instance", async () => {
    const db = new DB();
    expect(db).toBeDefined();
    expect(await db.get()).toBeDefined();
  });
  it("should drop connections", async () => {
    const instance = new DB();
    const db = await instance.get();
    const now = await db.query("SELECT NOW()");
    expect(now).toBeDefined();

    await instance.destroy();

    // The old connection should be dropped
    expect(async () => await db.query("SELECT NOW()")).rejects.toThrow();

    // Instance.pool should get a new connection pool if the old one is destroyed
    const now2 = await instance.pool("SELECT NOW()");
    expect(now2).toBeDefined();
  });
  it("should do transactions correctly", async () => {
    const db = new DB();
    const res = await db.transaction(async (client) => {
      await client.query("CREATE table TEST (id SERIAL PRIMARY KEY, value TEXT)");
      await client.query("INSERT INTO TEST (value) VALUES ('test')");
      return await client.query("SELECT * FROM TEST");
    });

    expect(res).toBeDefined();
    expect(res.rows[0].value).toBe("test");


    const result = await db.query("SELECT * FROM TEST");
    expect(result).toBeDefined();
    expect(result.rows.length).toBe(1);

    const res2 = await db.transaction(async (client) => {
      await client.query("INSERT INTO TEST (value) VALUES ('should not be inserted')");
      await client.query("INSERT INTO TEST (value) VALUES (ERROR)"); // Invalid query
    });

    expect(res2).toBeUndefined();

    const result2 = await db.query("SELECT * FROM TEST");
    expect(result2).toBeDefined();
    expect(result2.rows.length).toBe(1);
    expect(result2.rows[0].value).toBe("test");
  });
});

