import { describe, it, expect } from "vitest";
import { DELETE } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { TestFactory } from "@/backend/test/testfactory";
import { DB } from "@/backend/db";

describe("DELETE /api/admin/users", () => {
  useTestDatabase();

  it("should delete an existing user", async () => {
    const superadmin = await TestFactory.user({
      is_admin: true,
      is_superadmin: true,
    });
    const user = await TestFactory.user();
    const { mockDelete } = useTestRequest(superadmin);

    const response = await DELETE(mockDelete(`/api/admin/users?id=${user.id}`));

    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(String(json.user.id)).toBe(String(user.id));

    const result = await DB.pool("SELECT id FROM users WHERE id = $1", [
      user.id,
    ]);
    expect(result.rowCount).toBe(0);
  });

  it("should clear created_by before deleting the user", async () => {
    const superadmin = await TestFactory.user({
      is_admin: true,
      is_superadmin: true,
    });
    const author = await TestFactory.user();
    const exercise = await TestFactory.exercise({
      category: "freeform",
      created_by: author.id,
    });
    const { mockDelete } = useTestRequest(superadmin);

    const response = await DELETE(
      mockDelete(`/api/admin/users?id=${author.id}`)
    );

    expect(response.status).toBe(200);

    const exerciseResult = await DB.pool(
      "SELECT created_by FROM exercises WHERE id = $1",
      [exercise.id]
    );
    expect(exerciseResult.rows[0].created_by).toBeNull();
  });

  it("should reject deleting the current superadmin account", async () => {
    const superadmin = await TestFactory.user({
      is_admin: true,
      is_superadmin: true,
    });
    const { mockDelete } = useTestRequest(superadmin);

    const response = await DELETE(
      mockDelete(`/api/admin/users?id=${superadmin.id}`)
    );

    expect(response.status).toBe(400);

    const json = await response.json();
    expect(json.error).toBe("You cannot delete your own account");
  });

  it("should return 401 for non-superadmin users", async () => {
    const admin = await TestFactory.user({
      is_admin: true,
      is_superadmin: false,
    });
    const user = await TestFactory.user();
    const { mockDelete } = useTestRequest(admin);

    const response = await DELETE(mockDelete(`/api/admin/users?id=${user.id}`));

    expect(response.status).toBe(401);
  });
});
