import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextResponse } from "next/server";
import { POST } from "./route";
import { deleteSession } from "@/backend/auth/session";

vi.mock("@/backend/auth/session", () => ({
  deleteSession: vi.fn().mockResolvedValue(undefined),
}));

describe("POST /api/auth/logout", () => {
  beforeEach(() => {
    // Clear mock calls between tests
    vi.clearAllMocks();
  });

  it("should delete session and redirect to login page", async () => {
    const response = await POST();
    const setCookieHeader = response.headers.get("Set-Cookie");

    expect(deleteSession).toHaveBeenCalled();
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get("Location")).toBe(
      "http://localhost:3000/auth/login"
    );
    expect(response.status).toBe(307);
    expect(setCookieHeader).toContain("session=; Max-Age=0");
  });
});
