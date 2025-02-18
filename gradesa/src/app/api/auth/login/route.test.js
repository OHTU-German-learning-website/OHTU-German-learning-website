import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { createSession } from "../../../lib/session";

vi.mock("../../../lib/session", () => ({
  createSession: vi.fn().mockResolvedValue(undefined),
}));

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    // Clear mock calls between tests
    vi.clearAllMocks();
  });

  it("should return success message for valid credentials", async () => {
    const request = {
      json: async () => ({
        email: "user@example.com",
        password: "Demonstration1",
      }),
    };

    const response = await POST(request);
    const responseData = await response.json();

    expect(responseData).toEqual({ message: "Login successful" });
    expect(response.status).toBe(200);
    expect(createSession).toHaveBeenCalledWith(1);
  });

  it("should return error message for invalid email", async () => {
    const request = {
      json: async () => ({
        email: "wrong@example.com",
        password: "Demonstration1",
      }),
    };

    const response = await POST(request);
    const responseData = await response.json();

    expect(responseData).toEqual({
      error: "Ungültige E-Mail-Adresse oder Passwort",
    });
    expect(response.status).toBe(401);
    expect(createSession).not.toHaveBeenCalled();
  });

  it("should return error message for invalid password", async () => {
    const request = {
      json: async () => ({
        email: "user@example.com",
        password: "wrongpassword",
      }),
    };

    const response = await POST(request);
    const responseData = await response.json();

    expect(responseData).toEqual({
      error: "Ungültige E-Mail-Adresse oder Passwort",
    });
    expect(response.status).toBe(401);
    expect(createSession).not.toHaveBeenCalled();
  });
});
