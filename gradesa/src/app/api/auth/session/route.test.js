import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextResponse } from "next/server";
import { GET } from "./route";
import { checkSession } from "@/backend/auth/session";

vi.mock("@/backend/auth/session", () => ({
  checkSession: vi.fn(),
}));

describe("GET /api/auth/session", () => {
  beforeEach(() => {
    // Clear mock calls between tests
    vi.clearAllMocks();
  });

  it("should return loggedIn: true and userId when session is valid", async () => {
    const mockUserId = "12345";
    checkSession.mockResolvedValue(mockUserId);

    const response = await GET();
    const result = await response.json();

    expect(checkSession).toHaveBeenCalled();
    expect(response).toBeInstanceOf(NextResponse);
    expect(result).toEqual({ loggedIn: true, userId: mockUserId });
  });

  it("should return loggedIn: false when session is invalid", async () => {
    checkSession.mockResolvedValue(null);

    const response = await GET();
    const result = await response.json();

    expect(checkSession).toHaveBeenCalled();
    expect(response).toBeInstanceOf(NextResponse);
    expect(result).toEqual({ loggedIn: false });
  });
});
