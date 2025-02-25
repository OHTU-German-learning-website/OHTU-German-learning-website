import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useTestDatabase } from "./testdb";
import { POST } from "../../app/api/auth/register/route";
import { DB } from "../db";

describe("POST /register", () => {
  useTestDatabase();
  it("should return 409 if account already exists", async () => {
    await DB.pool(
      "INSERT INTO users (email, password_hash, salt) VALUES ($1, $2, $3)",
      ["existinguser@example.com", "password123", "salt"]
    );

    const request = {
      json: async () => ({
        email: "existinguser@example.com",
        password: "password123",
      }),
    };

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(409);
    expect(result.message).toBe("Account already exists.");
  });

  it("should return 400 if email and password are empty", async () => {
    const request = {
      json: async () => ({
        email: "",
        password: "",
      }),
    };

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.message).toBe("Email and password are required.");
  });

  it("should return 422 if email is invalid", async () => {
    const request = {
      json: async () => ({
        email: "invalidemail",
        password: "password123",
      }),
    };

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(422);
    expect(result.message).toBe("Invalid email address.");
  });

  it("should return 422 if password is too short", async () => {
    const request = {
      json: async () => ({
        email: "validemail@email.com",
        password: "short",
      }),
    };

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(422);
    expect(result.message).toBe("Password must be at least 8 characters long.");
  });

  it("should return 422 if password is too long", async () => {
    const request = {
      json: async () => ({
        email: "anothervalidemail@email.com",
        password:
          "thispasswordiswaytoolongandshouldnotbeacceptedbecauseitexceedsthemaximumlengthallowed",
      }),
    };

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(422);
    expect(result.message).toBe("Password must be at least 8 characters long.");
  });

  it("should return 200 if account is created", async () => {
    const request = {
      json: async () => ({
        email: "validanduniqueemail@email.com",
        password: "goodpassword123",
      }),
    };

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.message).toBe("Account created.");
  });
});
