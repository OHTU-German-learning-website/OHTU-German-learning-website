import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextResponse } from "next/server";
import { POST } from "./route";
import { deleteSession } from "../../../lib/session";
import { getConfig } from "../../../../backend/config";

vi.mock("../../../lib/session", () => ({
  deleteSession: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../../../backend/config", () => ({
  getConfig: vi.fn().mockReturnValue({
    host: "http://localhost:3000",
  }),
}));

describe("POST /api/auth/logout", () => {
  beforeEach(() => {
    // Clear mock calls between tests
    vi.clearAllMocks();
  });

  it("should delete session and redirect to login page", async () => {
    const response = await POST();

    expect(deleteSession).toHaveBeenCalled();
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get("Location")).toBe(
      "http://localhost:3000/auth/login"
    );
    expect(response.status).toBe(307);
  });
});
