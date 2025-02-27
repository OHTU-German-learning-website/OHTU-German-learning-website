import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useTestDatabase } from "./testdb";
import { POST } from "../../app/api/auth/register/route";
import { DB } from "../db";
import { TestFactory } from "./testfactory";
import { useTestRequest } from "@/backend/test/mock-request";

describe("POST /register", () => {
  useTestDatabase();
  it("should return 409 if account already exists", async () => {
    const user = await TestFactory.user();
    const { mockPost } = useTestRequest();
    const request = mockPost("@/api/auth/register", {
      email: user.email,
      password: user.password_hash,
    });

    const response = await POST(request);
    const result = await response.json();
    expect(response.status).toBe(409);
    expect(result.error).toBe("Konto ist bereits vorhanden.");
  });

  it("should return 400 if email and password are empty", async () => {
    const email = "";
    const password = "";
    const { mockPost } = useTestRequest();

    const request = mockPost("@/api/auth/register", {
      email,
      password,
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.error).toBe("E-Mail und Passwort sind erforderlich.");
  });

  it("should return 422 if email is invalid", async () => {
    const email = "invalidemail";
    const password = "goodpassword123";
    const { mockPost } = useTestRequest();

    const request = mockPost("@/api/auth/register", {
      email,
      password,
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(422);
    expect(result.error).toBe("Ungültige E-Mail-Adresse.");
  });

  it("should return 422 if password is too short", async () => {
    const email = "validemail@email.com";
    const password = "short";
    const { mockPost } = useTestRequest();

    const request = mockPost("@/api/auth/register", {
      email,
      password,
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
    const { mockPost } = useTestRequest();

    const request = mockPost("@/api/auth/register", {
      email,
      password,
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
    const { mockPost } = useTestRequest();

    const request = mockPost("@/api/auth/register", {
      email,
      password,
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.message).toBe("Account created.");
  });
});
