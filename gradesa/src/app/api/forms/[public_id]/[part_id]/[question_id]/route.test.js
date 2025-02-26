import { describe, it, expect } from "vitest";
import { useTestDatabase } from "@/backend/test/testdb";

import { DB } from "@/backend/db";
import { getUtils } from "@/app/api/forms/formTestUtils";

describe("answers", () => {
  useTestDatabase();

  it("should create a new question answer", async () => {
    const { submitAnswer, getForm } = await getUtils();
    const form = await getForm("learning_type");
    const part = form.parts[0];
    const question = part.questions[0];

    const response = await submitAnswer(form, part, question);
    expect(response.status).toBe(200);
  });
  it("should return 404 if the question is not found", async () => {
    const { submitAnswer, getForm } = await getUtils();
    const form = await getForm("learning_type");
    const part = form.parts[0];
    const question = part.questions[0];
    const response = await submitAnswer("nonexistent", part, question);
    expect(response.status).toBe(404);
  });
  it("should correctly calculate the average answer for a part", async () => {
    const { submitAnswer, getForm } = await getUtils();
    const form = await getForm("learning_type");
    const part1 = form.parts[0];
    const question1_1 = part1.questions[0];
    const question1_2 = part1.questions[1];
    const question1_3 = part1.questions[2];
    const part2 = form.parts[1];
    const question2_1 = part2.questions[0];
    const question2_2 = part2.questions[1];
    const u = await DB.pool(`select * from users`);
    for (const user of u.rows) {
      console.log(user);
    }
    const response1_1 = await submitAnswer(form, part1, question1_1, 1);
    const response1_1x2 = await submitAnswer(form, part1, question1_1, 2);
    expect(response1_1.status).toBe(200);
    expect(response1_1x2.status).toBe(200);
    const response1_2 = await submitAnswer(form, part1, question1_2, 2);
    expect(response1_2.status).toBe(200);

    await submitAnswer(form, part1, question1_3, 4);

    const response2_1 = await submitAnswer(form, part2, question2_1, 3);
    expect(response2_1.status).toBe(200);

    const response2_2 = await submitAnswer(form, part2, question2_2, 1);
    expect(response2_2.status).toBe(200);

    const updatedForm = await getForm("learning_type");

    const part1_q1 = updatedForm.parts[0].questions[0];
    const part1_q2 = updatedForm.parts[0].questions[1];
    const part2_q1 = updatedForm.parts[1].questions[0];
    const part2_q2 = updatedForm.parts[1].questions[1];

    expect(part1_q1.answer).toBe(2);
    expect(part1_q2.answer).toBe(2);
    expect(part2_q1.answer).toBe(3);
    expect(part2_q2.answer).toBe(1);
  });
});
