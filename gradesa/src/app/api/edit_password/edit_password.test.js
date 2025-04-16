import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/edit_password/route";
import { useTestDatabase } from "@/backend/test/testdb";
import { TestFactory } from "@/backend/test/testfactory";
import { useTestRequest } from "@/backend/test/mock-request";
import crypto from "crypto";
import { hashPassword } from "@/backend/auth/hash";
import { DB } from "@/backend/db";

describe("POST /api/edit_password", () => {
  useTestDatabase();

  const createUserWithHashedPassword = async (password) => {
    const salt = crypto.randomBytes(16).toString("hex");
    const { hashedPassword } = await hashPassword(password, salt);
    return {
      user: await TestFactory.user({
        password_hash: hashedPassword,
        salt: salt,
      }),
      salt: salt,
      hashed: hashedPassword,
      plain: password,
    };
  };

  it("returns 401 if user is not authenticated", async () => {
    const { mockPost } = useTestRequest(null);

    const res = await POST(
      mockPost("/api/edit_password", {
        currentPassword: "123",
        newPassword: "456",
      })
    );
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.message).toBe(undefined);
  });

  it("returns 500 if user is missing or password_hash is invalid", async () => {
    const testUser = await TestFactory.user({ password_hash: "", salt: "" });
    const { mockPost } = useTestRequest(testUser);

    const res = await POST(
      mockPost("/api/edit_password", {
        currentPassword: "123",
        newPassword: "456",
      })
    );
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.message).toBe("Invalid user data");
  });

  it("returns 400 if current password is incorrect", async () => {
    const { user: testUser } = await createUserWithHashedPassword("correct");

    const { mockPost } = useTestRequest(testUser);

    const res = await POST(
      mockPost("/api/edit_password", {
        currentPassword: "wrong",
        newPassword: "456",
      })
    );
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.message).toBe("Incorrect current password");
  });

  it("updates password and returns 200 on success", async () => {
    const { user: testUser, plain } =
      await createUserWithHashedPassword("correct");

    const { mockPost } = useTestRequest(testUser);
    const newPassword = "newpass";
    const res = await POST(
      mockPost("/api/edit_password", {
        currentPassword: plain,
        newPassword: newPassword,
      })
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toBe("Password updated");

    const db = await DB.get();
    const result = await db.query(
      `SELECT password_hash, salt FROM users WHERE id = $1`,
      [testUser.id]
    );
    const { salt: newSalt, password_hash: newHashed } = result.rows[0];

    expect(result.rows[0]).toEqual({
      password_hash: newHashed,
      salt: newSalt,
    });
  });
});
