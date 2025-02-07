import { useTestDatabase } from "./testdb";
import { TestFactory } from "./testfactory";
import { describe, it, expect } from "vitest";

describe("User", () => {
  useTestDatabase();
  it("should create a user", async () => {
    const user = await TestFactory.user();
    expect(user).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.password_hash).toBeDefined();
    expect(user.id).toBe("1");
  });
});
