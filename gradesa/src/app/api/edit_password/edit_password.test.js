import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/edit_password/route";

vi.mock("@/backend/auth/hash", () => ({
  verifyPassword: vi.fn(),
  hashPassword: vi.fn(),
}));

vi.mock("@/backend/db", () => ({
  DB: {
    pool: vi.fn(),
  },
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

describe("POST /api/edit_password", () => {
  beforeEach(() => {
    vi.resetAllMocks();
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

  it("returns 500 if user is missing or password_hash is null", async () => {
    checkSession.mockResolvedValue({ id: 1 });

    DB.pool.mockResolvedValue({
      rows: [{ id: 1, password_hash: null, salt: null }],
    });

    const res = await POST(
      mockRequest({ currentPassword: "123", newPassword: "456" })
    );
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.message).toBe("Invalid user data");
  });

  it("returns 400 if current password is incorrect", async () => {
    checkSession.mockResolvedValue({ id: 1 });

    DB.pool.mockResolvedValue({
      rows: [{ id: 1, password_hash: "stored_hash", salt: "stored_salt" }],
    });

    verifyPassword.mockResolvedValue(false);

    const res = await POST(
      mockRequest({ currentPassword: "wrong", newPassword: "456" })
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.message).toBe("Incorrect current password");
  });

  it("updates password and returns 200 on success", async () => {
    checkSession.mockResolvedValue({ id: 1 });

    DB.pool.mockImplementation((query, params) => {
      if (query.startsWith("SELECT")) {
        return Promise.resolve({
          rows: [{ id: 1, password_hash: "stored_hash", salt: "stored_salt" }],
        });
      }
      if (query.startsWith("UPDATE")) {
        expect(params).toEqual(["new_hashed", "new_salt", 1]);
        return Promise.resolve();
      }
    });

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
  });
});
