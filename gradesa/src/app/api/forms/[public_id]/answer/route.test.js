import { describe, it, expect } from "vitest";
import { useTestDatabase } from "@/backend/test/testdb";
import { getUtils } from "@/app/api/forms/formTestUtils";
import { GET } from "@/app/api/forms/[public_id]/answer/route";
describe("answers", () => {
  useTestDatabase();
  it("should return the average answer for a part", async () => {
    const { submitAnswer, getForm, getAverages } = await getUtils();
    const form = await getForm("learning_type");
    const part1 = form.parts[0];
    const question1_1 = part1.questions[0];
    const question1_2 = part1.questions[1];
    const question1_3 = part1.questions[2];
    const part2 = form.parts[1];
    const question2_1 = part2.questions[0];
    const question2_2 = part2.questions[1];

    await submitAnswer(form, part1, question1_1, 1);
    await submitAnswer(form, part1, question1_1, 2);
    await submitAnswer(form, part1, question1_2, 2);
    await submitAnswer(form, part1, question1_3, 4);
    await submitAnswer(form, part2, question2_1, 3);
    await submitAnswer(form, part2, question2_2, 1);

    const averages = await getAverages("learning_type");
    expect(averages).toEqual({
      [part1.id]: 2.67,
      [part2.id]: 2.0,
    });
  });
});
