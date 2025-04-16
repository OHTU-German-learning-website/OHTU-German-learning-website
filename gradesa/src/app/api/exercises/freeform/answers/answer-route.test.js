import { describe, it, expect } from "vitest";
import {
  POST,
  normalizeText,
  findLongestCommonSubsequence,
  calculatePositionSimilarity,
} from "./route";
import { useTestDatabase } from "@/backend/test/testdb";
import { useTestRequest } from "@/backend/test/mock-request";
import { DB } from "@/backend/db";
import { TestFactory } from "@/backend/test/testfactory";

describe("freeform answers", () => {
  useTestDatabase();

  async function setupExercise() {
    const exercise = await TestFactory.exercise({
      category: "freeform",
    });
    const exerciseId = exercise.id;
    const freeFormExercise = await TestFactory.freeFormExercise({
      exercise_id: exerciseId,
      question: "Test Question",
    });

    // Add possible answers
    await TestFactory.freeFormAnswer({
      free_form_exercise_id: freeFormExercise.id,
      answer: "This is the correct answer",
      is_correct: true,
      feedback: "Great job!",
    });

    await TestFactory.freeFormAnswer({
      free_form_exercise_id: freeFormExercise.id,
      answer: "This is another correct answer",
      is_correct: true,
      feedback: "Well done!",
    });

    await TestFactory.freeFormAnswer({
      free_form_exercise_id: freeFormExercise.id,
      answer: "This is an incorrect answer",
      is_correct: false,
      feedback: "Try again",
    });

    return freeFormExercise.id;
  }

  it("should evaluate exact match answers correctly", async () => {
    const user = await TestFactory.user();
    const { mockPost } = useTestRequest(user);
    const exerciseId = await setupExercise();

    const response = await POST(
      mockPost("/api/exercises/freeform/answers", {
        freeFormExerciseId: exerciseId,
        answer: "This is the correct answer",
      })
    );

    expect(response.status).toBe(200);
    const result = await response.json();

    expect(result.is_correct).toBe(true);
    expect(result.similarity).toBe(1);
    expect(result.perfectAnswer).toBe(true);
    expect(result.feedback).toBe("Great job!");
  });

  it("should evaluate similar but not exact answers", async () => {
    const user = await TestFactory.user();
    const { mockPost } = useTestRequest(user);
    const exerciseId = await setupExercise();

    const response = await POST(
      mockPost("/api/exercises/freeform/answers", {
        freeFormExerciseId: exerciseId,
        answer: "This is the correct answer word",
      })
    );

    expect(response.status).toBe(200);
    const result = await response.json();

    expect(result.is_correct).toBe(true);
    expect(result.similarity).toBeGreaterThan(0.7);
    expect(result.similarity).toBeLessThan(1);
    expect(result.perfectAnswer).toBe(false);
    expect(result.comparisonDetails).toBeDefined();
  });

  it("should reject completely incorrect answers", async () => {
    const user = await TestFactory.user();
    const { mockPost } = useTestRequest(user);
    const exerciseId = await setupExercise();

    const response = await POST(
      mockPost("/api/exercises/freeform/answers", {
        freeFormExerciseId: exerciseId,
        answer: "Something totally different",
      })
    );

    expect(response.status).toBe(200);
    const result = await response.json();

    expect(result.is_correct).toBe(false);
    expect(result.similarity).toBeLessThan(0.7);
  });

  it("should return 400 for missing required fields", async () => {
    const user = await TestFactory.user();
    const { mockPost } = useTestRequest(user);

    const response = await POST(
      mockPost("/api/exercises/freeform/answers", {
        freeFormExerciseId: "some-id",
        // missing answer field
      })
    );

    expect(response.status).toBe(422);
  });

  it("should return 404 for non-existent exercise", async () => {
    const user = await TestFactory.user();
    const { mockPost } = useTestRequest(user);

    const response = await POST(
      mockPost("/api/exercises/freeform/answers", {
        freeFormExerciseId: "-1",
        answer: "Some answer",
      })
    );

    expect(response.status).toBe(404);
  });

  it("should record user answers in the database", async () => {
    const user = await TestFactory.user();
    const { mockPost } = useTestRequest(user);
    const exerciseId = await setupExercise();

    await POST(
      mockPost("/api/exercises/freeform/answers", {
        freeFormExerciseId: exerciseId,
        answer: "This is the correct answer",
      })
    );

    const result = await DB.pool(
      `SELECT * FROM free_form_user_answers`
      //  WHERE user_id = $1 AND free_form_exercise_id = $2`,
      // [user.id, exerciseId]
    );
    expect(result.rows.length).toBe(1);
    expect(result.rows[0].answer).toBe("This is the correct answer");
    expect(result.rows[0].is_correct).toBe(true);
  });
});

describe("text processing utility functions", () => {
  describe("normalizeText", () => {
    it("should convert text to lowercase", () => {
      expect(normalizeText("THIS IS A TEST")).toBe("this is a test");
    });

    it("should remove punctuation", () => {
      expect(normalizeText("Hello, world!")).toBe("hello world");
      expect(normalizeText("test.with.dots")).toBe("test with dots");
      expect(normalizeText("complex-punctuation;:{}=")).toBe(
        "complex punctuation"
      );
    });

    it("should trim whitespace", () => {
      expect(normalizeText("  leading and trailing spaces  ")).toBe(
        "leading and trailing spaces"
      );
    });

    it("should normalize multiple spaces", () => {
      expect(normalizeText("too    many     spaces")).toBe("too many spaces");
    });
  });

  describe("findLongestCommonSubsequence", () => {
    it("should find the correct LCS length for identical sequences", () => {
      const seq1 = ["a", "b", "c", "d"];
      const seq2 = ["a", "b", "c", "d"];
      expect(findLongestCommonSubsequence(seq1, seq2)).toBe(4);
    });

    it("should return 0 for completely different sequences", () => {
      const seq1 = ["a", "b", "c"];
      const seq2 = ["x", "y", "z"];
      expect(findLongestCommonSubsequence(seq1, seq2)).toBe(0);
    });

    it("should find the correct LCS length for partially overlapping sequences", () => {
      const seq1 = ["a", "b", "c", "d", "e"];
      const seq2 = ["b", "c", "x", "e"];
      expect(findLongestCommonSubsequence(seq1, seq2)).toBe(3);
    });

    it("should handle empty sequences", () => {
      expect(findLongestCommonSubsequence([], ["a", "b"])).toBe(0);
      expect(findLongestCommonSubsequence(["a", "b"], [])).toBe(0);
      expect(findLongestCommonSubsequence([], [])).toBe(0);
    });

    it("should find LCS with sequences out of order", () => {
      const seq1 = ["this", "is", "a", "test"];
      const seq2 = ["a", "test", "this", "is"];
      // The LCS should be ["this", "is"] or ["a", "test"] (both length 2)
      expect(findLongestCommonSubsequence(seq1, seq2)).toBe(2);
    });
  });

  describe("calculatePositionSimilarity", () => {
    it("should return 1.0 for identical word arrays", () => {
      const words1 = ["this", "is", "a", "test"];
      const words2 = ["this", "is", "a", "test"];
      expect(calculatePositionSimilarity(words1, words2)).toBe(1);
    });

    it("should return lower score for same words in different positions", () => {
      const words1 = ["this", "is", "a", "test"];
      const words2 = ["test", "a", "is", "this"];
      // Each word is in the wrong position, so similarity should be lower
      expect(calculatePositionSimilarity(words1, words2)).toBeLessThan(1);
    });

    it("should handle partially overlapping arrays", () => {
      const words1 = ["this", "is", "a", "test"];
      const words2 = ["this", "is", "not", "same"];
      // Only "this" and "is" match and are in the same position
      const result = calculatePositionSimilarity(words1, words2);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(1);
    });

    it("should handle empty arrays", () => {
      expect(calculatePositionSimilarity([], [])).toBe(1);
      expect(calculatePositionSimilarity([], ["test"])).toBe(0);
      expect(calculatePositionSimilarity(["test"], [])).toBe(0);
    });
  });
});
