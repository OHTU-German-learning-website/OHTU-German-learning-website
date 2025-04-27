import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import { useTestRequest } from "@/backend/test/mock-request";
import { useTestDatabase } from "@/backend/test/testdb";
import { TestFactory } from "@/backend/test/testfactory";
import {
  deleteSession,
  createSession,
  checkSession,
} from "@/backend/auth/session";
import { DB } from "@/backend/db";

vi.mock("@/backend/auth/session", () => ({
  deleteSession: vi.fn(() => Promise.resolve()),
  createSession: vi.fn(() => Promise.resolve()),
  checkSession: vi.fn(),
}));

describe("GET /api/edit_email", () => {
  useTestDatabase();

  let user;

  beforeEach(async () => {
    user = await TestFactory.user();
    vi.clearAllMocks();
  });

  const getRequest = async (authUser) => {
    const { mockGet } = useTestRequest();
    const request = mockGet("/api/edit_email", null, authUser);

    checkSession.mockImplementation(() =>
      Promise.resolve(
        authUser ? { id: authUser.id, email: authUser.email } : null
      )
    );

    return GET(request);
  };

  it("should return current user data", async () => {
    const response = await getRequest(user);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.id).toBe(user.id);
    expect(result.email).toBe(user.email);
    expect(checkSession).toHaveBeenCalled();
  });

  it("should require authentication", async () => {
    const response = await getRequest(null);
    expect(response.status).toBe(401);
    expect(checkSession).toHaveBeenCalled();
  });
});

describe("POST /api/edit_email", () => {
  useTestDatabase();

  let user;
  const newEmail = "new.email@example.com";

  beforeEach(async () => {
    user = await TestFactory.user();
    vi.clearAllMocks();
  });

  const postRequest = async (newEmail, authUser) => {
    const { mockPost } = useTestRequest();
    const request = mockPost("/api/edit_email", { newEmail }, authUser);

    checkSession.mockImplementation(() =>
      Promise.resolve(
        authUser ? { id: authUser.id, email: authUser.email } : null
      )
    );

    return POST(request);
  };

  it("should successfully update email and refresh session", async () => {
    const response = await postRequest(newEmail, user);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.message).toBe("Email updated successfully");
    expect(checkSession).toHaveBeenCalled();
    expect(deleteSession).toHaveBeenCalled();
    expect(createSession).toHaveBeenCalledWith(
      expect.objectContaining({
        email: newEmail,
        id: user.id,
      })
    );
  });

  it("should reject invalid email format", async () => {
    const invalidEmails = ["invalid", "missing@domain", "invalid@.com"];

    for (const email of invalidEmails) {
      const response = await postRequest(email, user);
      const result = await response.json();

      expect(response.status).toBe(400);
      expect(result.message).toBe("Please provide a valid email address");
    }
  });

  it("should reject if email is same as current", async () => {
    const response = await postRequest(user.email, user);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.message).toBe(
      "New email must be different from current email"
    );
  });

  it("should reject if email is already in use", async () => {
    const otherUser = await TestFactory.user({ email: "existing@example.com" });
    const response = await postRequest(otherUser.email, user);
    const result = await response.json();

    expect(response.status).toBe(409);
    expect(result.message).toBe(
      "This email is already in use by another account"
    );
  });

  it("should require authentication", async () => {
    const response = await postRequest(newEmail, null);
    expect(response.status).toBe(401);
  });

  it("should handle database errors", async () => {
    const originalPool = DB.pool;
    DB.pool = vi
      .fn()
      .mockImplementationOnce(originalPool)
      .mockImplementationOnce(() =>
        Promise.reject(new Error("Database error"))
      );

    const response = await postRequest(newEmail, user);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result.message).toBe("Failed to update email");

    DB.pool = originalPool;
  });
});
