import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "@/app/api/edit_password/route";
import { useTestDatabase } from "@/backend/test/testdb";

vi.mock("@/backend/auth/hash", () => ({
  verifyPassword: vi.fn(),
  hashPassword: vi.fn(),
}));

vi.mock("@/backend/auth/session", () => ({
  checkSession: vi.fn(),
}));

import { verifyPassword, hashPassword } from "@/backend/auth/hash";
import { DB } from "@/backend/db";
import { checkSession } from "@/backend/auth/session";

const mockRequest = (data) => ({
  json: () => Promise.resolve(data),
});

const createTestUser = async ({
  id,
  email = `user${id}@test.com`,
  password_hash = "mock_hash",
  salt = "mock_salt",
}) => {
  const db = await DB.get();
  await db.query(
    `
    INSERT INTO users (id, email, password_hash, salt)
    VALUES ($1, $2, $3, $4)
    `,
    [id, email, password_hash, salt]
  );
};

describe("POST /api/edit_password", () => {
  useTestDatabase();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(async () => {
    const db = await DB.get();
    await db.query("DELETE FROM users WHERE email LIKE $1", ["user%"]);
  });

  it("returns 401 if user is not authenticated", async () => {
    checkSession.mockResolvedValue(null);

    const res = await POST(
      mockRequest({ currentPassword: "123", newPassword: "456" })
    );
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.message).toBe("Unauthorized");
  });

  it("returns 500 if user is missing or password_hash is invalid", async () => {
    const userId = 1;

    await createTestUser({ id: userId, password_hash: "", salt: "" });

    checkSession.mockResolvedValue({ id: userId });

    const res = await POST(
      mockRequest({ currentPassword: "123", newPassword: "456" })
    );
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.message).toBe("Invalid user data");
  });

  it("returns 400 if current password is incorrect", async () => {
    const userId = 2;
    await createTestUser({
      id: userId,
      password_hash: "stored_hash",
      salt: "stored_salt",
    });

    checkSession.mockResolvedValue({ id: userId });
    verifyPassword.mockResolvedValue(false);

    const res = await POST(
      mockRequest({ currentPassword: "wrong", newPassword: "456" })
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.message).toBe("Incorrect current password");
  });

  it("updates password and returns 200 on success", async () => {
    const userId = 3;
    await createTestUser({
      id: userId,
      password_hash: "stored_hash",
      salt: "stored_salt",
    });

    checkSession.mockResolvedValue({ id: userId });
    verifyPassword.mockResolvedValue(true);
    hashPassword.mockResolvedValue({
      salt: "new_salt",
      hashedPassword: "new_hashed",
    });

    const res = await POST(
      mockRequest({ currentPassword: "correct", newPassword: "newpass" })
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toBe("Password updated");

    const db = await DB.get();
    const result = await db.query(
      `SELECT password_hash, salt FROM users WHERE id = $1`,
      [userId]
    );
    expect(result.rows[0]).toEqual({
      password_hash: "new_hashed",
      salt: "new_salt",
    });
  });
});
