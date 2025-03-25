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

  it("should delete session", async () => {
    const response = await POST();
    const setCookieHeader = response.headers.get("Set-Cookie");

    expect(deleteSession).toHaveBeenCalled();
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
    expect(setCookieHeader).toContain("session=; Max-Age=0");
  });
});
