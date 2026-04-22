import { describe, it, expect } from "vitest";
import { POST } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { DB } from "@/backend/db";
import { TestFactory } from "@/backend/test/testfactory";

describe("fillinthegap answers API", () => {
  useTestDatabase();

  async function setupExercise() {
    const exercise = await TestFactory.exercise({ category: "fillinthegap" });

    const fillGapExercise = await DB.pool(
      `INSERT INTO fill_gap_exercises (exercise_id, title, source_text)
       VALUES ($1, $2, $3) RETURNING *`,
      [exercise.id, "Artikel", "Ich gehe in die Schule."]
    );

    const gap = await DB.pool(
      `INSERT INTO fill_gap_gaps (fill_gap_exercise_id, token_index, token_text, gap_order)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [fillGapExercise.rows[0].id, 3, "die", 1]
    );

    await DB.pool(
      `INSERT INTO fill_gap_answers (fill_gap_gap_id, answer, is_correct, feedback)
       VALUES ($1, $2, $3, $4), ($1, $5, $6, $7)`,
      [
        gap.rows[0].id,
        "die",
        true,
        "Richtig!",
        "der",
        false,
        "Hier passt nicht der.",
      ]
    );

    return {
      exerciseId: fillGapExercise.rows[0].id,
      gapId: gap.rows[0].id,
    };
  }

  it("evaluates answers and stores the user answer", async () => {
    const user = await TestFactory.user();
    const { mockPost, mockParams } = useTestRequest(user);
    const { exerciseId, gapId } = await setupExercise();

    const response = await POST(
      mockPost(`/api/exercises/fillinthegap/${exerciseId}/answers`, {
        answers: [{ gapId, answer: "die" }],
      }),
      mockParams({ exercise_id: exerciseId })
    );

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.correctCount).toBe(1);
    expect(json.results[0].isCorrect).toBe(true);

    const savedRows = await DB.pool(
      `SELECT * FROM fill_gap_user_answers WHERE user_id = $1 AND fill_gap_gap_id = $2`,
      [user.id, gapId]
    );
    expect(savedRows.rows.length).toBe(1);
    expect(savedRows.rows[0].is_correct).toBe(true);
  });

  it("returns incorrect when no answer option matches", async () => {
    const user = await TestFactory.user();
    const { mockPost, mockParams } = useTestRequest(user);
    const { exerciseId, gapId } = await setupExercise();

    const response = await POST(
      mockPost(`/api/exercises/fillinthegap/${exerciseId}/answers`, {
        answers: [{ gapId, answer: "das" }],
      }),
      mockParams({ exercise_id: exerciseId })
    );

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.correctCount).toBe(0);
    expect(json.results[0].isCorrect).toBe(false);
  });
});
