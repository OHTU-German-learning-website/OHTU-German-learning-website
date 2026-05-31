import { describe, it, expect } from "vitest";
import { GET, POST } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { TestFactory } from "@/backend/test/testfactory";
import { DB } from "@/backend/db";

describe("admin jumbled sentence exercises API", () => {
  useTestDatabase();

  it("creates a jumbled sentence exercise with valid input", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const payload = {
      title: "Satzreihenfolge A1",
      sentences: [
        {
          sentence: "Ich\nlerne jeden Tag\nDeutsch",
          alternates: ["lerne jeden Tag\nIch\nDeutsch"],
          alternateFeedbacks: ["Auch richtig."],
          correctSentenceFeedback: "Perfekt!",
          incorrectAlternates: ["Deutsch\nIch\nlerne jeden Tag"],
          incorrectFeedbacks: ["Subjekt und Verb bitte prüfen."],
        },
      ],
    };

    const response = await POST(
      mockPost("/api/admin/exercises/jumbled-sentence", payload)
    );

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.id).toBeDefined();

    const createdExercise = await DB.pool(
      "SELECT id, exercise_id, title, created_by FROM jumbled_sentence_exercises WHERE id = $1",
      [json.id]
    );
    expect(createdExercise.rows.length).toBe(1);
    expect(createdExercise.rows[0].title).toBe(payload.title);
    expect(createdExercise.rows[0].created_by).toBe(admin.id);

    const linkedExercise = await DB.pool(
      "SELECT id, category, created_by FROM exercises WHERE id = $1",
      [createdExercise.rows[0].exercise_id]
    );
    expect(linkedExercise.rows.length).toBe(1);
    expect(linkedExercise.rows[0].category).toBe("jumbled-sentence");
    expect(linkedExercise.rows[0].created_by).toBe(admin.id);

    const sentences = await DB.pool(
      "SELECT sentence, alternates, alternate_feedbacks, correct_feedback, incorrect_alternates, incorrect_feedbacks FROM jumbled_sentence_sentences WHERE jumbled_exercise_id = $1",
      [json.id]
    );
    expect(sentences.rows.length).toBe(1);
    expect(sentences.rows[0].sentence).toBe(payload.sentences[0].sentence);
    expect(sentences.rows[0].alternates).toEqual(
      payload.sentences[0].alternates
    );
    expect(sentences.rows[0].alternate_feedbacks).toEqual(
      payload.sentences[0].alternateFeedbacks
    );
    expect(sentences.rows[0].correct_feedback).toBe(
      payload.sentences[0].correctSentenceFeedback
    );
    expect(sentences.rows[0].incorrect_alternates).toEqual(
      payload.sentences[0].incorrectAlternates
    );
    expect(sentences.rows[0].incorrect_feedbacks).toEqual(
      payload.sentences[0].incorrectFeedbacks
    );
  });

  it("returns 400 for invalid payload", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const response = await POST(
      mockPost("/api/admin/exercises/jumbled-sentence", {
        title: "ab",
        sentences: [],
      })
    );

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toBeDefined();
    expect(Array.isArray(json.issues)).toBe(true);
    expect(json.issues.length).toBeGreaterThan(0);
  });

  it("lists existing jumbled sentence exercises", async () => {
    const admin = await TestFactory.user({ is_admin: true });

    const baseExerciseA = await DB.pool(
      "INSERT INTO exercises (created_at, updated_at, category, created_by) VALUES (NOW(), NOW(), $1, $2) RETURNING id",
      ["jumbled-sentence", admin.id]
    );
    const baseExerciseB = await DB.pool(
      "INSERT INTO exercises (created_at, updated_at, category, created_by) VALUES (NOW(), NOW(), $1, $2) RETURNING id",
      ["jumbled-sentence", admin.id]
    );

    await DB.pool(
      "INSERT INTO jumbled_sentence_exercises (created_at, updated_at, exercise_id, created_by, title) VALUES (NOW(), NOW(), $1, $2, $3), (NOW(), NOW(), $4, $5, $6)",
      [
        baseExerciseA.rows[0].id,
        admin.id,
        "Titel Eins",
        baseExerciseB.rows[0].id,
        admin.id,
        "Titel Zwei",
      ]
    );

    const { mockGet } = useTestRequest(admin);
    const response = await GET(
      mockGet("/api/admin/exercises/jumbled-sentence")
    );

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(Array.isArray(json.exercises)).toBe(true);
    expect(json.exercises.length).toBeGreaterThanOrEqual(2);

    const titles = json.exercises.map((item) => item.title);
    expect(titles).toContain("Titel Eins");
    expect(titles).toContain("Titel Zwei");
  });
});
