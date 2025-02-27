import { describe, it, expect } from "vitest";
import { GET } from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { DB } from "@/backend/db";
import { TestFactory } from "@/backend/test/testfactory";

describe("forms", () => {
  useTestDatabase();
  it("should return a form", async () => {
    const user = await TestFactory.user();
    const { mockGet, mockParams } = useTestRequest(user);

    const form = await GET(
      mockGet("/api/forms/learning_type"),
      mockParams({ public_id: "learning_type" })
    );
    expect(form).toBeDefined();
    expect(form.status).toBe(200);
    const json = await form.json();
    expect(json.parts).toHaveLength(6);
    expect(json.parts[0].questions).toHaveLength(9);
    expect(json.parts.map((p) => p.step_label)).toEqual([
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
    ]);
  });
  it("should return a form with answers", async () => {
    const user = await TestFactory.user();
    const { mockGet, mockParams } = useTestRequest(user);

    const form = await GET(
      mockGet("/api/forms/learning_type"),
      mockParams({ public_id: "learning_type" })
    );
    const formJson = await form.json();
    await DB.pool(
      `insert into user_question_answers (user_id, part_question_id, answer) values ($1, $2, $3)`,
      [user.id, formJson.parts[0].questions[0].id, 1]
    );
    const result = await DB.pool(`SELECT * FROM user_question_answers`);

    const formWithAnswers = await GET(
      mockGet("/api/forms/learning_type"),
      mockParams({ public_id: "learning_type" })
    );
    expect(formWithAnswers).toBeDefined();
    expect(formWithAnswers.status).toBe(200);
    const json = await formWithAnswers.json();
    expect(json.parts).toHaveLength(6);
    expect(json.parts[0].questions[0].answer).toBe(1);
  });
});
