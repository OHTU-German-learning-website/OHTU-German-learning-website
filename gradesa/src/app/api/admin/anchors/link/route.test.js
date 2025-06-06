import { describe, it, expect } from "vitest";
import { POST } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { TestFactory } from "@/backend/test/testfactory";
import { DB } from "@/backend/db";

describe("POST /api/admin/anchors/link", () => {
  useTestDatabase();

  it("should link an exercise to a new anchor", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const exercise = await TestFactory.exercise();

    const validInput = {
      anchor_id: "test-anchor-id",
      exercise_id: Number(exercise.id),
      position: 1,
    };

    const response = await POST(
      mockPost("/api/admin/anchors/link", validInput)
    );

    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);

    const anchorResult = await DB.pool(
      "SELECT * FROM anchors WHERE anchor_id = $1",
      [validInput.anchor_id]
    );
    expect(anchorResult.rows.length).toBe(1);

    const linkResult = await DB.pool(
      "SELECT * FROM exercise_anchors WHERE exercise_id = $1 AND anchor_id = $2",
      [exercise.id, anchorResult.rows[0].id]
    );
    expect(linkResult.rows.length).toBe(1);
    expect(linkResult.rows[0].position).toBe(validInput.position);
  });

  it("should link an exercise to an existing anchor", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const exercise = await TestFactory.exercise();

    const anchor = await TestFactory.anchor({ anchor_id: "existing-anchor" });

    const validInput = {
      anchor_id: "existing-anchor",
      exercise_id: Number(exercise.id),
      position: 2,
    };

    const response = await POST(
      mockPost("/api/admin/anchors/link", validInput)
    );

    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);

    const linkResult = await DB.pool(
      "SELECT * FROM exercise_anchors WHERE exercise_id = $1 AND anchor_id = $2",
      [exercise.id, anchor.id]
    );
    expect(linkResult.rows.length).toBe(1);
    expect(linkResult.rows[0].position).toBe(validInput.position);
  });

  it("should update position for an already linked exercise", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const exercise = await TestFactory.exercise();

    const anchor = await TestFactory.anchor({ anchor_id: "update-anchor" });

    await TestFactory.exerciseAnchor({
      exercise_id: exercise.id,
      anchor_id: anchor.id,
      position: 1,
    });

    const updateInput = {
      anchor_id: "update-anchor",
      exercise_id: Number(exercise.id),
      position: 3,
    };

    const response = await POST(
      mockPost("/api/admin/anchors/link", updateInput)
    );

    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);

    const linkResult = await DB.pool(
      "SELECT * FROM exercise_anchors WHERE exercise_id = $1 AND anchor_id = $2",
      [exercise.id, anchor.id]
    );
    expect(linkResult.rows.length).toBe(1);
    expect(linkResult.rows[0].position).toBe(updateInput.position);
  });

  it("should return 404 for non-existent exercise", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const invalidInput = {
      anchor_id: "test-anchor",
      exercise_id: 999999,
    };

    const response = await POST(
      mockPost("/api/admin/anchors/link", invalidInput)
    );

    expect(response.status).toBe(404);
    const json = await response.json();
    expect(json.error).toBe("Exercise not found");
  });

  it("should return 422 for invalid input", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const invalidInput = {
      exercise_id: 123,
    };

    const response = await POST(
      mockPost("/api/admin/anchors/link", invalidInput)
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
      mockPost("/api/admin/anchors/link", validInput)
    );

    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json.error).toBe("Unauthorized");
  });
});
