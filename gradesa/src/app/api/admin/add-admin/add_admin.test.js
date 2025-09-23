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

describe("GET /api/add-admin", () => {
  useTestDatabase();

  let user;

  beforeEach(async () => {
    user = await TestFactory.user();
    vi.clearAllMocks();
  });

  const getRequest = async (authUser) => {
    const { mockGet } = useTestRequest();
    const request = mockGet("/api/add-admin", null, authUser);

    checkSession.mockImplementation(() =>
      Promise.resolve(
        authUser ? { id: authUser.id, email: authUser.email } : null
      )
    );

    return GET(request);
  };
});
