import { describe, it, expect } from "vitest";
import { GET } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { DB } from "@/backend/db";
import { TestFactory } from "@/backend/test/testfactory";

describe("click_exercises API", () => {
  useTestDatabase();

  it("should return an exercise and userAnswers if they exist", async () => {
    const user = await TestFactory.user();
    const { mockGet, mockParams } = useTestRequest(user);

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

    // Insert a user answer for the exercise
    await DB.pool(
      `INSERT INTO click_answers (user_id, click_exercise_id, answer, target_words)
       VALUES ($1, $2, $3, $4)`,
      [
        user.id,
        exercise.rows[0].id,
        ["laufen", "springen"],
        ["laufen", "springen", "schwimmen"],
      ]
    );

    const response = await GET(
      mockGet(`/api/exercises/click/${exercise.rows[0].id}`),
      mockParams({ click_id: exercise.rows[0].id })
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toBeDefined();
    expect(json.exercise.title).toBe("Verben identifizieren");
    expect(json.exercise.category).toBe("Verben");
    expect(json.exercise.target_words).toEqual([
      "laufen",
      "springen",
      "schwimmen",
    ]);
    expect(json.exercise.all_words).toEqual([
      "Die",
      "Kinder",
      "laufen",
      "springen",
      "schwimmen",
    ]);
    expect(json.userAnswers).toBeDefined();
    expect(json.userAnswers.answer).toEqual(["laufen", "springen"]);
  });

  it("should return an exercise with null userAnswers if no answers exist", async () => {
    const user = await TestFactory.user();
    const { mockGet, mockParams } = useTestRequest(user);

    // Insert a test exercise into the database
    const exercise = await DB.pool(
      `INSERT INTO click_exercises (title, category, target_words, all_words)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        "Adjektive erkennen",
        "Adjektive",
        ["schnell", "langsam"],
        ["Der", "Hund", "ist", "schnell", "und", "langsam"],
      ]
    );

    const response = await GET(
      mockGet(`/api/exercises/click/${exercise.rows[0].id}`),
      mockParams({ click_id: exercise.rows[0].id })
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toBeDefined();
    expect(json.exercise.title).toBe("Adjektive erkennen");
    expect(json.exercise.category).toBe("Adjektive");
    expect(json.exercise.target_words).toEqual(["schnell", "langsam"]);
    expect(json.exercise.all_words).toEqual([
      "Der",
      "Hund",
      "ist",
      "schnell",
      "und",
      "langsam",
    ]);
    expect(json.userAnswers).toBeNull(); // No user answers exist
  });

  it("should return 404 for non-existent click_id", async () => {
    const user = await TestFactory.user();
    const { mockGet, mockParams } = useTestRequest(user);

    const response = await GET(
      mockGet(`/api/exercises/click/9999`),
      mockParams({ click_id: 9999 }) // Non-existent ID
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(404);
    const json = await response.json();
    expect(json.message).toBe("Keine Übung gefunden.");
  });

  it("should handle invalid click_id", async () => {
    const user = await TestFactory.user();
    const { mockGet, mockParams } = useTestRequest(user);

    const response = await GET(
      mockGet(`/api/exercises/click/invalid`),
      mockParams({ click_id: "invalid" }) // Invalid ID
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.message).toBe("Ungültige Übungs-ID.");
  });
});
