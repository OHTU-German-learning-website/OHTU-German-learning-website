import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { useTestRequest } from "@/backend/test/mock-request";
import { useTestDatabase } from "@/backend/test/testdb";
import { TestFactory } from "@/backend/test/testfactory";
import { checkSession } from "@/backend/auth/session";
import { DB } from "@/backend/db";

vi.mock("@/backend/auth/session", () => ({
  checkSession: vi.fn(),
}));

describe("GET /api/add-admin", () => {
  useTestDatabase();

  let adminUser;
  let normalUser;

  beforeEach(async () => {
    adminUser = await TestFactory.user({ is_admin: true });
    normalUser = await TestFactory.user({ is_admin: false });

    vi.clearAllMocks();
  });

  const postRequest = async (email, authUser) => {
    const { mockPost } = useTestRequest();
    const request = mockPost("/api/add-admin", { email }, authUser);

    checkSession.mockImplementation(() =>
      Promise.resolve(
        authUser
          ? {
              id: authUser.id,
              email: authUser.email,
              is_admin: authUser.is_admin,
            }
          : null
      )
    );

    return POST(request);
  };

  it("should allow an admin to promote a user to admin", async () => {
    const response = await postRequest(normalUser.email, adminUser);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.success).toBe(true);
    expect(result.message).toBe(
      "Benutzer erfolgreich als administrator hinzugefügt"
    );

    const dbUser = await DB.pool(`SELECT is_admin FROM users WHERE id = $1`, [
      normalUser.id,
    ]);
    expect(dbUser.rows[0].is_admin).toBe(true);
  });

  it("should return 404 if user with email does not exist", async () => {
    const response = await postRequest("notfound@example.com", adminUser);
    const result = await response.json();

    expect(response.status).toBe(404);
    expect(result.error).toBe(
      "Ein Benutzer mit dieser E-Mail-Adresse existiert nicht."
    );
  });

  it("should require authentication", async () => {
    const response = await postRequest(normalUser.email, null);
    expect(response.status).toBe(401);
    expect(checkSession).toHaveBeenCalled();
  });

  it("should throw on database errors", async () => {
    const originalPool = DB.pool;
    DB.pool = vi.fn().mockRejectedValueOnce(new Error("DB failure"));

    await expect(postRequest(normalUser.email, adminUser)).rejects.toThrow(
      "DB failure"
    );

    DB.pool = originalPool;
  });
});
