import { describe, it, expect } from "vitest";
import { GET } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { DB } from "@/backend/db";
import { TestFactory } from "@/backend/test/testfactory";

describe("redirect exercises API", () => {
  useTestDatabase();

  it("should redirect to the correct click exercise URL", async () => {
    const user = await TestFactory.user();
    const { mockGet, mockParams } = useTestRequest(user);

    // Insert a test exercise into the database
    const clickExercise = await DB.pool(
      `INSERT INTO click_exercises (title, category, target_words, all_words, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id`,
      [
        "Verben identifizieren",
        "Verben",
        ["laufen", "springen", "schwimmen"],
        ["Die", "Kinder", "laufen", "springen", "schwimmen"],
      ]
    );

    const exercise = await DB.pool(
      `SELECT id FROM exercises WHERE category = $1`,
      ["click"]
    );

    const response = await GET(
      mockGet(`/api/redirect/exercises/${exercise.rows[0].id}`),
      mockParams({ exercise_id: exercise.rows[0].id })
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(
      `http://localhost:3000/grammar/exercises/click/${clickExercise.rows[0].id}`
    );
  });

  it("should redirect to the correct freeform exercise URL", async () => {
    const user = await TestFactory.user();
    const { mockGet, mockParams } = useTestRequest(user);

    // Insert a test exercise into the database
    const exercise = await DB.pool(
      `INSERT INTO exercises (category, created_at, updated_at)
       VALUES ($1, NOW(), NOW()) RETURNING id`,
      ["freeform"]
    );

    const freeFormExercise = await DB.pool(
      `INSERT INTO free_form_exercises (exercise_id, question, created_at, updated_at)
         VALUES ($1, $2, NOW(), NOW()) RETURNING id`,
      [exercise.rows[0].id, "Was ist dein Lieblingssport?"]
    );

    const response = await GET(
      mockGet(`/api/redirect/exercises/${exercise.rows[0].id}`),
      mockParams({ exercise_id: exercise.rows[0].id })
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(
      `http://localhost:3000/grammar/exercises/freeform/${freeFormExercise.rows[0].id}`
    );
  });

  it("should return 404 if the exercise does not exist", async () => {
    const user = await TestFactory.user();
    const { mockGet, mockParams } = useTestRequest(user);

    const response = await GET(
      mockGet(`/api/redirect/exercises/9999`),
      mockParams({ exercise_id: 9999 }) // Non-existent ID
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(404);
    const json = await response.json();
    expect(json.message).toBe("Keine Übung gefunden.");
  });

  it("should return 400 if the exercise_id is invalid", async () => {
    const user = await TestFactory.user();
    const { mockGet, mockParams } = useTestRequest(user);

    const response = await GET(
      mockGet(`/api/redirect/exercises/invalid`),
      mockParams({ exercise_id: "invalid" }) // Invalid ID
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.message).toBe("Ungültige Übungs-ID.");
  });
});
