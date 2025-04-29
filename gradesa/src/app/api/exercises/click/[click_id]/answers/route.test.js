import { describe, it, expect } from "vitest";
import { POST } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { DB } from "@/backend/db";
import { TestFactory } from "@/backend/test/testfactory";

describe("click_answers API", () => {
  useTestDatabase();

  it("should save answers successfully", async () => {
    const user = await TestFactory.user();
    const { mockPost, mockParams } = useTestRequest(user);

    // Insert a test exercise into the database
    const exercise = await DB.pool(
      `INSERT INTO click_exercises (title, category, target_words, all_words)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        "Verben identifizieren",
        "Verben",
        ["laufen", "springen", "schwimmen"],
        ["Die", "Kinder", "laufen", "springen", "schwimmen"],
      ]
    );

    const requestBody = {
      selected_words: ["laufen", "springen"],
      target_words: ["laufen", "springen", "schwimmen"],
    };

    const response = await POST(
      mockPost(
        `/api/exercises/click/${exercise.rows[0].id}/answers`,
        requestBody
      ),
      mockParams({ click_id: exercise.rows[0].id })
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(201);
    const json = await response.json();
    expect(json.message).toBe("Antworten erfolgreich gespeichert.");

    // Verify the answers were saved in the database
    const savedAnswers = await DB.pool(
      `SELECT * FROM click_answers WHERE user_id = $1 AND click_exercise_id = $2`,
      [user.id, exercise.rows[0].id]
    );
    expect(savedAnswers.rows).toHaveLength(1);
    expect(savedAnswers.rows[0].answer).toEqual(["laufen", "springen"]);
    expect(savedAnswers.rows[0].target_words).toEqual([
      "laufen",
      "springen",
      "schwimmen",
    ]);
  });

  it("should update answers if they already exist", async () => {
    const user = await TestFactory.user();
    const { mockPost, mockParams } = useTestRequest(user);

    // Insert a test exercise into the database
    const exercise = await DB.pool(
      `INSERT INTO click_exercises (title, category, target_words, all_words)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        "Verben identifizieren",
        "Verben",
        ["laufen", "springen", "schwimmen"],
        ["Die", "Kinder", "laufen", "springen", "schwimmen"],
      ]
    );

    // Insert initial answers into the database
    await DB.pool(
      `INSERT INTO click_answers (user_id, click_exercise_id, answer, target_words)
       VALUES ($1, $2, $3, $4)`,
      [
        user.id,
        exercise.rows[0].id,
        ["laufen"],
        ["laufen", "springen", "schwimmen"],
      ]
    );

    const updatedRequestBody = {
      selected_words: ["springen", "schwimmen"],
      target_words: ["laufen", "springen", "schwimmen"],
    };

    const response = await POST(
      mockPost(
        `/api/exercises/click/${exercise.rows[0].id}/answers`,
        updatedRequestBody
      ),
      mockParams({ click_id: exercise.rows[0].id })
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(201);
    const json = await response.json();
    expect(json.message).toBe("Antworten erfolgreich gespeichert.");

    // Verify the answers were updated in the database
    const updatedAnswers = await DB.pool(
      `SELECT * FROM click_answers WHERE user_id = $1 AND click_exercise_id = $2`,
      [user.id, exercise.rows[0].id]
    );
    expect(updatedAnswers.rows).toHaveLength(1);
    expect(updatedAnswers.rows[0].answer).toEqual(["springen", "schwimmen"]);
    expect(updatedAnswers.rows[0].target_words).toEqual([
      "laufen",
      "springen",
      "schwimmen",
    ]);
  });

  it("should return 400 if required fields are missing", async () => {
    const user = await TestFactory.user();
    const { mockPost, mockParams } = useTestRequest(user);

    const response = await POST(
      mockPost(`/api/exercises/click/1/answers`, {}), // Missing required fields
      mockParams({ click_id: 1 })
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toBe("Fehlende erforderliche Felder.");
  });

  it("should return 500 if there is a database error", async () => {
    const user = await TestFactory.user();
    const { mockPost, mockParams } = useTestRequest(user);

    // Simulate a database error by passing invalid data
    const invalidRequestBody = {
      selected_words: ["laufen", "springen"],
      target_words: ["laufen", "springen", "schwimmen"],
    };

    const response = await POST(
      mockPost(`/api/exercises/click/invalid_id/answers`, invalidRequestBody),
      mockParams({ click_id: "invalid_id" }) // Invalid click_id
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json.error).toBe("Interner Serverfehler.");
  });
});
