import { describe, it, expect, vi, beforeEach } from "vitest";
import { withAuth } from "./withAuth";
import { NextResponse } from "next/server";
import { checkSession } from "@/backend/auth/session";

// Mock the checkSession function from the session module
vi.mock("@/backend/auth/session", () => ({
  checkSession: vi.fn(),
}));

describe("withAuth middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 Unauthorized if no session exists and requireAuth is true", async () => {
    // Simulate no active session
    checkSession.mockResolvedValue(null);

    // Dummy callback that should not be invoked
    const callback = vi.fn();
    const handler = withAuth(callback);

    // Create a fake request object
    const request = {};

    const response = await handler(request);

    // Expect unauthorized response
    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json).toEqual({ error: "Unauthorized" });

    // Ensure that the callback was not called
    expect(callback).not.toHaveBeenCalled();
  });

  it("should call the callback and attach user to request if session exists", async () => {
    // Simulate an active user session
    const fakeUser = { id: 1, username: "user1", is_admin: false };
    checkSession.mockResolvedValue(fakeUser);

    const callback = vi.fn().mockResolvedValue({ message: "Success" });
    const handler = withAuth(callback);
    const request = {};

    const response = await handler(request, "extraArg");

    // Check that callback was called with the correct parameters
    expect(callback).toHaveBeenCalledWith(request, "extraArg");

    // Confirm that the user was attached to the request object
    expect(request.user).toEqual(fakeUser);
    expect(response).toEqual({ message: "Success" });
  });

  it("should return 401 Unauthorized if requireAdmin is true and user is not an admin", async () => {
    // Simulate a logged-in user who is not an admin
    const fakeUser = { id: 1, username: "user1", is_admin: false };
    checkSession.mockResolvedValue(fakeUser);

    const callback = vi.fn();
    const handler = withAuth(callback, { requireAdmin: true });
    const request = {};

    const response = await handler(request);

    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json).toEqual({ error: "Unauthorized" });

    // Callback should not be executed when admin is required but user is not an admin
    expect(callback).not.toHaveBeenCalled();
  });

  it("should call the callback if requireAdmin is true and user is an admin", async () => {
    // Simulate an admin user session
    const fakeAdminUser = { id: 2, username: "admin", is_admin: true };
    checkSession.mockResolvedValue(fakeAdminUser);

    const callback = vi
      .fn()
      .mockResolvedValue({ message: "Admin route success" });
    const handler = withAuth(callback, { requireAdmin: true });
    const request = {};

    const response = await handler(request);

    // Confirm that the user is attached and callback is executed
    expect(request.user).toEqual(fakeAdminUser);
    expect(callback).toHaveBeenCalledWith(request);
    expect(response).toEqual({ message: "Admin route success" });
  });
});
