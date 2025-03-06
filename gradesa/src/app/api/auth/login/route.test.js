import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { createSession } from "@/backend/auth/session";
import { useTestRequest } from "@/backend/test/mock-request";
import { DB } from "@/backend/db";

vi.mock("@/backend/auth/session", () => ({
  createSession: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/backend/db", () => ({
  DB: {
    pool: vi.fn(),
  },
}));

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    // Clear mock calls between tests
    vi.clearAllMocks();
  });

  // it("should return success message for valid credentials", async () => {
  //   const { mockPost } = useTestRequest();
  //   const request = mockPost("/api/auth/login", {
  //     email: "user@example.com",
  //     password: "Demonstration1",
  //   });

  //   const response = await POST(request);
  //   const responseData = await response.json();

  //   expect(responseData).toEqual({ message: "Login successful" });
  //   expect(response.status).toBe(200);
  //   expect(createSession).toHaveBeenCalledWith(1);
  // });

  it("should return error message for invalid email", async () => {
    const { mockPost } = useTestRequest();
    const request = mockPost("/api/auth/login", {
      email: "wrong@example.com",
      password: "Demonstration1",
    });

    // Mock the database response for an invalid user
    DB.pool.mockResolvedValue({
      rowCount: 0,
      rows: [],
    });

    const response = await POST(request);
    const responseData = await response.json();

    expect(responseData).toEqual({
      error: "Ungültige Benutzername/E-Mail-Adresse oder Passwort",
    });
    expect(response.status).toBe(401);
    expect(createSession).not.toHaveBeenCalled();
  });

  //   it("should return error message for invalid password", async () => {
  //     const { mockPost } = useTestRequest();
  //     const request = mockPost("/api/auth/login", {
  //       email: "user@example.com",
  //       password: "wrongpassword",
  //     });

  //     const response = await POST(request);
  //     const responseData = await response.json();

  //     expect(responseData).toEqual({
  //       error: "Ungültige E-Mail-Adresse oder Passwort",
  //     });
  //     expect(response.status).toBe(401);
  //     expect(createSession).not.toHaveBeenCalled();
  //   });
});
