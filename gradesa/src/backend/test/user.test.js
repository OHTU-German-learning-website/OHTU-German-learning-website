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

    const user2 = await TestFactory.user({
      email: "test2@test.com",
    });
    expect(user2).toBeDefined();
    expect(user2.email).toBe("test2@test.com");
    expect(user2.password_hash).toBeDefined();
    expect(user2.id).toBe("2");
  });
});
