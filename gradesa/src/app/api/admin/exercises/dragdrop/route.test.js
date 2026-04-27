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
    expect(responseData.success).toBe(true);
    expect(Number.isFinite(Number(responseData.exerciseId))).toBe(true);
    expect(Number.isFinite(Number(responseData.dndId))).toBe(true);
    const exerciseId = Number(responseData.exerciseId);
    const dndId = Number(responseData.dndId);

    // Verify the created exercise row by returned id.
    const exerciseResult = await DB.pool(
      "SELECT * FROM exercises WHERE id = $1",
      [exerciseId]
    );

    expect(exerciseResult.rows.length).toBe(1);
    const createdExercise = exerciseResult.rows[0];
    expect(Number(createdExercise.id)).toBe(exerciseId);
    expect(createdExercise.category).toBe("dnd");

    // Verify the dnd_exercises row links to the created exercise and payload title.
    const dndExercise = await DB.pool(
      "SELECT * FROM dnd_exercises WHERE id = $1",
      [dndId]
    );

    expect(dndExercise.rows.length).toBe(1);
    expect(Number(dndExercise.rows[0].id)).toBe(dndId);
    expect(Number(dndExercise.rows[0].exercise_id)).toBe(exerciseId);
    expect(dndExercise.rows[0].title).toBe("Substantiv");

    // Verify categories were created for each provided field.
    const categories = await DB.pool(
      `SELECT category, color FROM dnd_categories
       WHERE (category = $1 AND color = $2)
          OR (category = $3 AND color = $4)
          OR (category = $5 AND color = $6)`,
      ["die", "red", "der", "blue", "das", "green"]
    );
    expect(categories.rows.length).toBe(3);

    // Verify draggable words were stored and linked to this specific dnd exercise.
    const mappings = await DB.pool(
      `SELECT dw.word, dc.category
       FROM word_category_mappings wcm
       JOIN draggable_words dw ON dw.id = wcm.word_id
       JOIN dnd_categories dc ON dc.id = wcm.category_id
       WHERE wcm.exercise_id = $1`,
      [dndId]
    );

    expect(mappings.rows.length).toBe(4);
    const mappedWords = mappings.rows.map((row) => row.word).sort();
    const mappedCategories = mappings.rows.map((row) => row.category);
    expect(mappedWords).toEqual(["Auto", "Elefant", "Schule", "Zeit"]);
    expect(mappedCategories).toContain("die");
    expect(mappedCategories).toContain("der");
    expect(mappedCategories).toContain("das");
  });

  it("should return 400 when fields are missing", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const response = await POST(
      mockPost("/api/auth/admin/exercises/dragdrop", {
        title: "Ungültige Übung",
      })
    );

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toBe("No fields provided");
  });
});
