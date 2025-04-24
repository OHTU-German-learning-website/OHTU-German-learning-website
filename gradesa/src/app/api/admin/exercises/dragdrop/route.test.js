import { describe, it, expect } from "vitest";
import { POST } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { DB } from "@/backend/db";
import { TestFactory } from "@/backend/test/testfactory";

describe("create dnd_exercises API", () => {
  useTestDatabase();

  it("should create a new dnd_exercise with valid details", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const testData = {
      title: "Substantiv",
      fields: [
        { color: "red", category: "die", content: "Zeit, Schule" },
        { color: "blue", category: "der", content: "Elefant" },
        { color: "green", category: "das", content: "Auto" },
      ],
    };

    const response = await POST(
      mockPost("api/admin/create-exercise/dragdrop", testData)
    );

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.exerciseId).toBeDefined();

    // Check main exercises table first
    const exercise = await DB.pool(`SELECT * FROM exercises WHERE id = $1`, [
      json.exerciseId,
    ]);
    expect(exercise.rows.length).toBe(1);
    expect(exercise.rows[0].category).toBe("dnd");

    // Then check dnd_exercises table
    const dndExercise = await DB.pool(
      `SELECT * FROM dnd_exercises WHERE exercise_id = $1`,
      [json.exerciseId]
    );
    expect(dndExercise.rows.length).toBe(1);
    expect(dndExercise.rows[0].title).toBe("Substantiv");

    // Check words
    const words = await DB.pool(
      `SELECT w.word 
       FROM draggable_words w
       JOIN word_category_mappings m ON w.id = m.word_id
       WHERE m.exercise_id = $1`,
      [json.exerciseId]
    );
    expect(words.rows.length).toBe(4); // Zeit, Schule, Elefant, Auto
  });
});
