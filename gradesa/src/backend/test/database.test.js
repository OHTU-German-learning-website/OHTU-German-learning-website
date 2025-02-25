import { DB } from "../db";
import { describe, it, expect } from "vitest";
import { useTestDatabase } from "@/backend/test/testdb";
describe("database", () => {
  useTestDatabase();

  it("Should allow for creation of tables", async () => {
    const db = await DB.get();
    await db.query("CREATE TABLE TEST (id SERIAL PRIMARY KEY, value TEXT)");
    await db.query("INSERT INTO TEST (value) VALUES ('test')");
    const result = await db.query("SELECT * FROM TEST");
    expect(result).toBeDefined();
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].value).toBe("test");
  });
  it("should not carry over changes between tests", async () => {
    const db = await DB.get();
    expect(async () => await db.query("SELECT * FROM TEST")).rejects.toThrow(
      'relation "test" does not exist'
    );
  });
  it("should get a database instance", async () => {
    const db = await DB.get();
    expect(db).toBeDefined();
  });
  it("should do transactions correctly", async () => {
    const res = await DB.transaction(async (client) => {
      await client.query(
        "CREATE table TEST (id SERIAL PRIMARY KEY, value TEXT)"
      );
      await client.query("INSERT INTO TEST (value) VALUES ('test')");
      return await client.query("SELECT * FROM TEST");
    });

    expect(res).toBeDefined();
    expect(res.rows[0].value).toBe("test");

    const result = await DB.pool("SELECT * FROM TEST");
    expect(result).toBeDefined();
    expect(result.rows.length).toBe(1);

    const res2 = await DB.transaction(async (client) => {
      await client.query(
        "INSERT INTO TEST (value) VALUES ('should not be inserted')"
      );
      await client.query("INSERT INTO TEST (value) VALUES (ERROR)"); // Invalid query
      return "success";
    }).catch(() => "error");

    expect(res2).toBe("error");

    const result2 = await DB.pool("SELECT * FROM TEST");
    expect(result2).toBeDefined();
    expect(result2.rows.length).toBe(1);
    expect(result2.rows[0].value).toBe("test");
  });
});
