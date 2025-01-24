import { DB } from "../db";
import { describe, it, expect } from 'vitest';
import { useTestDatabase } from "./testdb";
describe('database', () => {
  useTestDatabase();

  it('should connect to the database', async () => {
    const db = new DB();
    expect(db).toBeDefined();
    expect(await db.get()).toBeDefined();
  });
});

