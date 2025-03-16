import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "./route";
import { useTestRequest } from "@/backend/test/mock-request";
import { useTestDatabase } from "@/backend/test/testdb";
import { TestFactory } from "@/backend/test/testfactory";
import { hashPassword } from "@/backend/auth/hash";

describe("POST /login", () => {
  useTestDatabase();

  const plainPassword = "Demonstration1";
  let user;

  // create user with hashed password and salt before each test
  beforeEach(async () => {
    const { salt, hashedPassword } = await hashPassword(plainPassword);
    user = await TestFactory.user({
      password_hash: hashedPassword,
      salt: salt,
    });
  });

  // helper function to send login request
  const loginRequest = async (id, psw) => {
    const { mockPost } = useTestRequest();
    const request = mockPost("/api/auth/login", {
      identifier: id,
      password: psw,
    });
    const response = await POST(request);
    const result = await response.json();
    return { status: response.status, ...result };
  };

  it("should return success message for valid email credentials", async () => {
    const result = await loginRequest(user.email, plainPassword);
    expect(result.status).toBe(200);
    expect(result.message).toBe("Login successful");
  });

  it("should return success message for valid username credentials", async () => {
    const result = await loginRequest(user.username, plainPassword);
    expect(result.status).toBe(200);
    expect(result.message).toBe("Login successful");
  });

  it("should return error message for invalid identifier", async () => {
    const result = await loginRequest("wrongidentifier", plainPassword);
    expect(result.status).toBe(401);
    expect(result.error).toBe(
      "Ungültige Benutzername/E-Mail-Adresse oder Passwort"
    );
  });

  it("should return error message for invalid password", async () => {
    const result = await loginRequest(user.email, "wrongpassword");
    expect(result.status).toBe(401);
    expect(result.error).toBe(
      "Ungültige Benutzername/E-Mail-Adresse oder Passwort"
    );
  });
});
