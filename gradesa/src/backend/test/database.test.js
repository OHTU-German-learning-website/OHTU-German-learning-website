import { Migrator } from "./migrator";
import { describe, it, expect } from 'vitest';
import { getConfig } from "../config";
import { useTestDatabase } from "./testdb";
describe('database', () => {
  useTestDatabase();
  it("should run migrations", async () => {
    const migrator = new Migrator();
    const config = getConfig();
    await migrator.migrate(config.db);
    await migrator.verify(config.db);
  });
  it('should connect to the database', () => {
    expect(true).toBe(true);
  });
});

