import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useTestDatabase } from "./testdb";
import { GET, POST } from "../../app/api/auth/register/route";
import { TestFactory } from "./testfactory";
import { useTestRequest } from "@/backend/test/mock-request";

async function mockRegisterRequest(data) {
  const { mockGet, mockPost } = useTestRequest();
  const captchaResponse = await GET(mockGet("@/api/auth/register"));
  const { question, token } = await captchaResponse.json();
  const operands = question.match(/(\d+) \+ (\d+)/);

  return mockPost("@/api/auth/register", {
    ...data,
    captchaToken: token,
    captchaAnswer: String(Number(operands[1]) + Number(operands[2])),
  });
}

describe("POST /register", () => {
  useTestDatabase();

  it("should reject a registration without a valid captcha", async () => {
    const { mockPost } = useTestRequest();
    const request = mockPost("@/api/auth/register", {
      email: "captcha-test@email.com",
      password: "goodpassword123",
      username: "captchauser",
      captchaToken: "invalid-token",
      captchaAnswer: "10",
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(422);
    expect(result.error).toBe("Bitte lösen Sie die CAPTCHA-Aufgabe korrekt.");
  });

  it("should cool down an IP after repeated invalid captcha answers", async () => {
    const { mockPost } = useTestRequest();

    for (let attempt = 0; attempt < 20; attempt += 1) {
      const request = mockPost("@/api/auth/register", {
        email: "captcha-test@email.com",
        password: "goodpassword123",
        username: "captchauser",
        captchaToken: "invalid-token",
        captchaAnswer: "10",
      });
      request.headers.set("x-forwarded-for", "203.0.113.10");

      const response = await POST(request);
      expect(response.status).toBe(attempt === 19 ? 429 : 422);
    }

    const blockedRequest = mockPost("@/api/auth/register", {
      email: "another-user@email.com",
      password: "goodpassword123",
      username: "anotheruser",
      captchaToken: "invalid-token",
      captchaAnswer: "10",
    });
    blockedRequest.headers.set("x-forwarded-for", "203.0.113.10");

    const blockedResponse = await POST(blockedRequest);
    expect(blockedResponse.status).toBe(429);
    expect(Number(blockedResponse.headers.get("Retry-After"))).toBeGreaterThan(
      0
    );
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
