import { describe, it, expect } from "vitest";
import { POST } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { DB } from "@/backend/db";
import { TestFactory } from "@/backend/test/testfactory";

describe("POST /api/auth/admin/exercises/dragdrop", () => {
  useTestDatabase();

  it("should create a new dnd_exercise with valid details", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const validInput = {
      title: "Substantiv",
      fields: [
        { color: "red", category: "die", content: "Zeit, Schule" },
        { color: "blue", category: "der", content: "Elefant" },
        { color: "green", category: "das", content: "Auto" },
      ],
    };

    const response = await POST(
      mockPost("/api/auth/admin/exercises/dragdrop", validInput)
    );
    const responseData = await response.json();

    expect(response.status).toBe(200);
    const { exercise_id } = responseData;

    // Check main exercises table first
    const exerciseResult = await DB.pool(
      "SELECT * FROM exercises WHERE category = 'dnd' ORDER BY id DESC LIMIT 1"
    );

    expect(exerciseResult.rows.length).toBe(1);
    const createdExercise = exerciseResult.rows[0];
    expect(createdExercise.category).toBe("dnd");

    // Then check dnd_exercises table
    const dndExercise = await DB.pool(
      "SELECT * FROM dnd_exercises WHERE exercise_id = $1",
      [createdExercise.id]
    );

    expect(dndExercise.rows.length).toBe(1);
    expect(dndExercise.rows[0].title).toBe("Substantiv");
  });
});
