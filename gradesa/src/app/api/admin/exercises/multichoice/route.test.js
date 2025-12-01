import { describe, it, expect } from "vitest";
import { POST } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { TestFactory } from "@/backend/test/testfactory";
import { DB } from "@/backend/db";
describe("POST /api/admin/exercises/multichoice", () => {
  useTestDatabase();

  it("should create a multichoice exercise with valid input", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const validInput = {
      title: "Where is Paris located?",
      description: "Geography question",
      content: [
        {
          type: "text",
          value: "Select the country where Paris is located",
        },
        {
          type: "multichoice",
          value: null,
          correct: "France",
          options: ["France", "Germany", "Spain", "Italy"],
        },
      ],
    };

    const response = await POST(
      mockPost("/api/admin/exercises/multichoice", validInput)
    );

    expect(response.status).toBe(201);
    const { exerciseId } = await response.json();

    const exerciseResult = await DB.pool(
      "SELECT * FROM exercises WHERE id = $1",
      [exerciseId]
    );
    expect(exerciseResult.rows.length).toBe(1);

    const multichoiceExerciseResult = await DB.pool(
      "SELECT * FROM multichoice_exercises WHERE exercise_id = $1",
      [exerciseId]
    );
    expect(multichoiceExerciseResult.rows.length).toBe(1);

    const content = await DB.pool(
      "SELECT * FROM multichoice_content WHERE multichoice_exercise_id = $1",
      [multichoiceExerciseResult.rows[0].id]
    );
    expect(content.rows.length).toBe(2);

    const multichoiceContent = content.rows.find(
      (row) => row.content_type === "multichoice"
    );
    expect(multichoiceContent).toBeDefined();
    expect(multichoiceContent.content_type).toBe("multichoice");

    const options = await DB.pool(
      "SELECT * FROM multichoice_options WHERE multichoice_content_id = $1",
      [multichoiceContent.id]
    );
    expect(options.rows.length).toBe(4);
  });
});
