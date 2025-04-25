import { describe, it, expect } from "vitest";
import { POST } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { TestFactory } from "@/backend/test/testfactory";
import { DB } from "@/backend/db";

describe("unlink", () => {
  useTestDatabase();

  it("should unlink an exercise from an anchor", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const exercise = await TestFactory.exercise();

    const anchor = await TestFactory.anchor({
      anchor_id: "test-unlink-anchor",
    });

    await TestFactory.exerciseAnchor({
      exercise_id: exercise.id,
      anchor_id: anchor.id,
      position: 1,
    });

    const unlinkInput = {
      anchor_id: "test-unlink-anchor",
      exercise_id: Number(exercise.id),
    };

    const response = await POST(
      mockPost("/api/admin/anchors/unlink", unlinkInput)
    );

    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);

    // Verify that the link was removed
    const linkResult = await DB.pool(
      "SELECT * FROM exercise_anchors WHERE exercise_id = $1 AND anchor_id = $2",
      [exercise.id, anchor.id]
    );
    expect(linkResult.rows.length).toBe(0);
  });

  it("should return 404 for non-existent anchor", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const exercise = await TestFactory.exercise();

    const unlinkInput = {
      anchor_id: "non-existent-anchor",
      exercise_id: Number(exercise.id),
    };

    const response = await POST(
      mockPost("/api/admin/anchors/unlink", unlinkInput)
    );

    expect(response.status).toBe(404);
    const json = await response.json();
    expect(json.error).toBe("Anchor not found");
  });

  it("should return 404 for non-existent link", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const exercise = await TestFactory.exercise();

    const anchor = await TestFactory.anchor({ anchor_id: "unlinked-anchor" });

    const unlinkInput = {
      anchor_id: "unlinked-anchor",
      exercise_id: Number(exercise.id),
    };

    const response = await POST(
      mockPost("/api/admin/anchors/unlink", unlinkInput)
    );

    expect(response.status).toBe(404);
    const json = await response.json();
    expect(json.error).toBe("Link not found or already removed");
  });

  it("should return 422 for invalid input", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const invalidInput = {
      anchor_id: "test-anchor",
    };

    const response = await POST(
      mockPost("/api/admin/anchors/unlink", invalidInput)
    );

    expect(response.status).toBe(422);
    const json = await response.json();
    expect(json.error).toContain("Required");
  });

  it("should return 401 for non-admin user", async () => {
    const regularUser = await TestFactory.user({ is_admin: false });
    const { mockPost } = useTestRequest(regularUser);

    const validInput = {
      anchor_id: "test-anchor",
      exercise_id: 123,
    };

    const response = await POST(
      mockPost("/api/admin/anchors/unlink", validInput)
    );

    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json.error).toBe("Unauthorized");
  });
});
