import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useTestDatabase } from "./testdb";
import { POST } from "../../app/api/auth/register/route";
import { TestFactory } from "./testfactory";
import { useTestRequest } from "@/backend/test/mock-request";
import { createHmac } from "node:crypto";
import { getConfig } from "@/backend/config";
import { DB } from "@/backend/db";

async function mockRegisterRequest(data) {
  const { mockPost } = useTestRequest();
  return mockPost("@/api/auth/register", { website: "", ...data });
}

describe("POST /register", () => {
  useTestDatabase();

  it("should silently ignore submissions that fill the honeypot", async () => {
    const { mockPost } = useTestRequest();
    const request = mockPost("@/api/auth/register", {
      email: "captcha-test@email.com",
      password: "goodpassword123",
      username: "captchauser",
      website: "https://spam.example",
    });

    const response = await POST(request);
    const result = await response.json();
    const createdUsers = await DB.pool(
      "SELECT id FROM users WHERE email = $1",
      ["captcha-test@email.com"]
    );

    expect(response.status).toBe(200);
    expect(result.message).toBe("Account created.");
    expect(createdUsers.rows).toHaveLength(0);
  });

  it("should count repeated honeypot submissions without affecting the response", async () => {
    const { mockPost } = useTestRequest();

    for (let attempt = 0; attempt < 20; attempt += 1) {
      const request = mockPost("@/api/auth/register", {
        email: "captcha-test@email.com",
        password: "goodpassword123",
        username: "captchauser",
        website: "https://spam.example",
      });
      request.headers.set("x-forwarded-for", "203.0.113.10");

      const response = await POST(request);
      expect(response.status).toBe(200);
    }

    const ipHash = createHmac("sha256", getConfig().sessionSecret)
      .update("203.0.113.10")
      .digest("hex");
    const attempts = await DB.pool(
      "SELECT failed_attempts, blocked_until FROM registration_honeypot_attempts WHERE ip_hash = $1",
      [ipHash]
    );

    expect(attempts.rows[0].failed_attempts).toBe(20);
    expect(attempts.rows[0].blocked_until).not.toBeNull();
  });

  it("should return 409 if account already exists", async () => {
    const user = await TestFactory.user();
    const request = await mockRegisterRequest({
      email: user.email,
      password: user.password_hash,
      username: user.username,
    });

    const response = await POST(request);
    const result = await response.json();
    expect(response.status).toBe(409);
    expect(result.error).toBe("Konto ist bereits vorhanden.");
  });

  it("should return 400 if email, password and username are empty", async () => {
    const email = "";
    const password = "";
    const username = "";
    const request = await mockRegisterRequest({
      email,
      password,
      username,
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.error).toBe(
      "E-Mail, Benutzername und Passwort sind erforderlich."
    );
  });

  it("should return 422 if email is invalid", async () => {
    const email = "invalidemail";
    const password = "goodpassword123";
    const username = "goodusername";
    const request = await mockRegisterRequest({
      email,
      password,
      username,
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(422);
    expect(result.error).toBe("Ungültige E-Mail-Adresse.");
  });

  it("should return 422 if password is too short", async () => {
    const email = "validemail@email.com";
    const password = "short";
    const username = "goodusername";
    const request = await mockRegisterRequest({
      email,
      password,
      username,
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(422);
    expect(result.error).toBe(
      "Das Passwort muss mindestens 8 Zeichen lang sein."
    );
  });

  it("should return 422 if password is too long", async () => {
    const email = "anothervalidemail@email.com";
    const password =
      "thispasswordiswaytoolongandshouldnotbeacceptedbecauseitexceedsthemaximumlengthallowed";
    const username = "goodusername";
    const request = await mockRegisterRequest({
      email,
      password,
      username,
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(422);
    expect(result.error).toBe(
      "Das Passwort muss mindestens 8 Zeichen lang sein."
    );
  });

  it("should return 200 if account is created", async () => {
    const email = "validanduniqueemail@email.com";
    const password = "goodpassword123";
    const username = "goodusername";
    const request = await mockRegisterRequest({
      email,
      password,
      username,
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.message).toBe("Account created.");
  });

  it("should return 422 if username is too short", async () => {
    const email = "validanduniqueemail@email.com";
    const password = "goodpassword123";
    const username = "ab";
    const request = await mockRegisterRequest({
      email,
      password,
      username,
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(422);
    expect(result.error).toBe(
      "Der Benutzername muss zwischen 3 und 20 Zeichen lang sein."
    );
  });
});
