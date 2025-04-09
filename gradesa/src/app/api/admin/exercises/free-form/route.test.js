import { describe, it, expect } from "vitest";
import { POST } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { TestFactory } from "@/backend/test/testfactory";
import { DB } from "@/backend/db";
describe("POST /api/auth/admin/exercises/free-form", () => {
  useTestDatabase();

  it("should create a free form exercise with valid input", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const validInput = {
      question: "What is the capital of France?",
      answers: [
        {
          answer: "Paris",
          feedback: "Excellent work!",
          is_correct: true,
        },
      ],
    };

    const response = await POST(
      mockPost("/api/auth/admin/exercises/free-form", validInput)
    );

    expect(response.status).toBe(200);
    const { exercise_id } = await response.json();

    // Verify that an entry in the exercises table was created
    const exerciseResult = await DB.pool(
      "SELECT * FROM exercises WHERE id = $1",
      [exercise_id]
    );
    expect(exerciseResult.rows.length).toBe(1);

    // Verify that the free_form_exercises table received a record
    const freeFormExerciseResult = await DB.pool(
      "SELECT * FROM free_form_exercises WHERE exercise_id = $1",
      [exercise_id]
    );
    expect(freeFormExerciseResult.rows.length).toBe(1);
    expect(freeFormExerciseResult.rows[0].question).toBe(validInput.question);

    // Verify that the free_form_answers were inserted
    const freeFormAnswersResult = await DB.pool(
      "SELECT * FROM free_form_answers WHERE free_form_exercise_id = $1",
      [freeFormExerciseResult.rows[0].id]
    );
    expect(freeFormAnswersResult.rows.length).toBe(validInput.answers.length);
  });

  it("should return a 422 error for invalid input (missing question)", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const invalidInput = {
      answers: [
        {
          answer: "Paris",
          feedback: [{ feedback: "Excellent work!" }],
        },
      ],
    };

    const response = await POST(
      mockPost("/api/auth/admin/exercises/free-form", invalidInput)
    );

    expect(response.status).toBe(422);
    const json = await response.json();
    expect(json.error).toContain("Required");
  });
});
