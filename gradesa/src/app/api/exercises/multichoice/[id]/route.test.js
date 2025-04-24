import { describe, it, expect, beforeEach } from "vitest";
import { GET } from "./route";
import { useTestRequest } from "@/backend/test/mock-request";
import { useTestDatabase } from "@/backend/test/testdb";
import { DB } from "@/backend/db";
import { TestFactory } from "@/backend/test/testfactory";

describe("GET /api/exercises/multichoice/:id", () => {
  useTestDatabase();

  let exercise;

  async function setupExercise() {
    // Create a base exercise entry
    const baseExercise = await TestFactory.exercise({
      category: "multichoice",
    });

    // Create a multichoice exercise linked to the base exercise
    const multichoiceExercise = await TestFactory.multichoiceExercise({
      exercise_id: baseExercise.id,
    });

    // Add content to the multichoice exercise
    const content1 = await TestFactory.multichoiceContent({
      multichoice_exercise_id: multichoiceExercise.id,
      content_type: "text",
      content_value: "This is a test sentence.",
      content_order: 1,
    });

    const content2 = await TestFactory.multichoiceContent({
      multichoice_exercise_id: multichoiceExercise.id,
      content_type: "multichoice",
      content_value: "___",
      content_order: 2,
      correct_answer: "correct answer",
    });

    // Add options for the multichoice content
    await TestFactory.multichoiceOption({
      multichoice_content_id: content2.id,
      option_value: "correct answer",
    });
    await TestFactory.multichoiceOption({
      multichoice_content_id: content2.id,
      option_value: "wrong answer 1",
    });
    await TestFactory.multichoiceOption({
      multichoice_content_id: content2.id,
      option_value: "wrong answer 2",
    });

    return multichoiceExercise;
  }

  beforeEach(async () => {
    // Set up the exercise and store it for use in tests
    exercise = await setupExercise();
  });

  const getRequest = async (id) => {
    const { mockGet } = useTestRequest();
    const request = mockGet(`/api/exercises/multichoice/${id}`);
    const response = await GET(request, { params: { id } });
    const result = await response.json();
    return { status: response.status, ...result };
  };

  it("should return the exercise with its content and options", async () => {
    const result = await getRequest(exercise.id);

    expect(result.status).toBe(200);
    expect(result.content).toBeInstanceOf(Array);
    expect(result.content.length).toBeGreaterThan(0);

    const multichoiceContent = result.content.find(
      (item) => item.content_type === "multichoice"
    );
    expect(multichoiceContent).toBeDefined();
    expect(multichoiceContent.options).toBeInstanceOf(Array);
    expect(multichoiceContent.options.length).toBe(3);
  });

  it("should return 400 for an invalid exercise ID", async () => {
    const result = await getRequest("invalid-id");

    expect(result.status).toBe(400);
    expect(result.message).toBe("Invalid exercise ID.");
  });

  it("should return 404 for a non-existent exercise", async () => {
    const result = await getRequest(-1); // ID -1 does not exist

    expect(result.status).toBe(404);
    expect(result.message).toBe("Exercise not found.");
  });

  it("should return 500 if a database error occurs", async () => {
    // Simulate a database error by mocking the DB.pool method
    const originalPool = DB.pool;
    DB.pool = async () => {
      throw new Error("Simulated database error");
    };

    const result = await getRequest(exercise.id);

    expect(result.status).toBe(500);
    expect(result.message).toBe("Internal Server Error.");

    // Restore the original DB.pool method
    DB.pool = originalPool;
  });
});
