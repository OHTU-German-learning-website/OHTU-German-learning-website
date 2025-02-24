import { describe, it, expect } from "vitest";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { PUT } from "@/app/api/forms/[public_id]/[part_id]/[question_id]/route";
import { GET } from "@/app/api/forms/[public_id]/route";
import { TestFactory } from "@/backend/test/testfactory";
import { DB } from "@/backend/db";
describe("answers", () => {
  useTestDatabase();
  let user = undefined;

  async function getUtils() {
    return {
      submitAnswer: _submitAnswer,
      getForm: _getForm,
    };
  }

  async function getUser() {
    if (user) {
      return user;
    }
    user = await TestFactory.user();
    return user;
  }

  async function _submitAnswer(form, part, question, answer = 1) {
    const user = await getUser();
    const { mockPut, mockParams } = useTestRequest(user);

    const response = await PUT(
      mockPut(`/api/forms/${form.public_id}/${part.id}/${question.id}`, {
        answer,
      }),
      mockParams({
        public_id: form.public_id,
        part_id: part.id,
        question_id: question.id,
      })
    );
    return response;
  }

  async function _getForm(public_id) {
    const user = await getUser();
    const { mockGet, mockParams } = useTestRequest(user);
    const formResponse = await GET(
      mockGet(`/api/forms/${public_id}`),
      mockParams({
        public_id,
      })
    );
    return formResponse.json();
  }

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
    expect(response1_1.status).toBe(200);

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
    const part1_avg = updatedForm.parts[0].average_answer;
    const part2_avg = updatedForm.parts[1].average_answer;
    const form_avg = updatedForm.average_answer;
    expect(part1_q1.answer).toBe(1.0);
    expect(part1_q2.answer).toBe(2.0);
    expect(part2_q1.answer).toBe(3.0);
    expect(part2_q2.answer).toBe(1.0);
    expect(part1_avg).toBe(2.3);
    expect(part2_avg).toBe(2);
    expect(form_avg).toBe(2.2);
  });
});
