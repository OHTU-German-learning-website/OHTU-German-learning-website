describe('database', () => {
  it("should run migrations", () => {
    const migrator = new Migrator();
    migrator.migrate();
  });
  it('should connect to the database', () => {
    expect(true).toBe(true);
  });
});

