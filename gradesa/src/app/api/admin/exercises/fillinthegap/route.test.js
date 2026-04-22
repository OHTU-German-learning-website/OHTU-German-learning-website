import { describe, it, expect } from "vitest";
import { POST } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { TestFactory } from "@/backend/test/testfactory";
import { DB } from "@/backend/db";

describe("POST /api/admin/exercises/fillinthegap", () => {
  useTestDatabase();

  it("creates fillinthegap exercise with gaps and answer options", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const payload = {
      title: "Artikel im Kontext",
      text: "Ich gehe in die Schule und fahre mit dem Bus.",
      gaps: [
        {
          tokenIndex: 3,
          tokenText: "die",
          answers: [
            { answer: "die", feedback: "Richtig!", isCorrect: true },
            {
              answer: "der",
              feedback: "Hier passt nicht der.",
              isCorrect: false,
            },
          ],
        },
      ],
    };

    const response = await POST(
      mockPost("/api/admin/exercises/fillinthegap", payload)
    );

    expect(response.status).toBe(201);
    const json = await response.json();
    expect(json.id).toBeDefined();

    const exerciseRows = await DB.pool(
      "SELECT * FROM fill_gap_exercises WHERE id = $1",
      [json.id]
    );
    expect(exerciseRows.rows.length).toBe(1);
    expect(exerciseRows.rows[0].title).toBe(payload.title);

    const gapRows = await DB.pool(
      "SELECT * FROM fill_gap_gaps WHERE fill_gap_exercise_id = $1",
      [json.id]
    );
    expect(gapRows.rows.length).toBe(1);

    const answerRows = await DB.pool(
      "SELECT * FROM fill_gap_answers WHERE fill_gap_gap_id = $1",
      [gapRows.rows[0].id]
    );
    expect(answerRows.rows.length).toBe(2);
  });

  it("returns 422 when no gaps are provided", async () => {
    const admin = await TestFactory.user({ is_admin: true });
    const { mockPost } = useTestRequest(admin);

    const payload = {
      title: "Artikel im Kontext",
      text: "Ich gehe in die Schule.",
      gaps: [],
    };

    const response = await POST(
      mockPost("/api/admin/exercises/fillinthegap", payload)
    );

    expect(response.status).toBe(422);
  });
});
