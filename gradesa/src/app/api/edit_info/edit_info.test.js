import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";
import { useTestRequest } from "@/backend/test/mock-request";
import { useTestDatabase } from "@/backend/test/testdb";
import { TestFactory } from "@/backend/test/testfactory";
import { checkSession } from "@/backend/auth/session";

vi.mock("@/backend/auth/session", () => ({
  checkSession: vi.fn(),
}));

describe("POST /api/edit_info", () => {
  useTestDatabase();

  let user;
  beforeEach(async () => {
    user = await TestFactory.user();
    vi.clearAllMocks();
  });

  const getRequest = async (authUser) => {
    const { mockGet } = useTestRequest();
    const request = mockGet("/api/edit_info", null, authUser);

    checkSession.mockImplementation(() =>
      Promise.resolve(
        authUser ? { id: authUser.id, email: authUser.email } : null
      )
    );

    return GET(request);
  };

  it("should return user data when authenticated", async () => {
    const response = await getRequest(user);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.user.id).toBe(user.id);
    expect(result.user.email).toBe(user.email);
    expect(checkSession).toHaveBeenCalled();
  });

  it("should return 401 if user is not authenticated", async () => {
    const response = await getRequest(null);

    expect(response.status).toBe(401);
    expect(await response.text()).toBe("Unauthorized");
    expect(checkSession).toHaveBeenCalled();
  });
});
