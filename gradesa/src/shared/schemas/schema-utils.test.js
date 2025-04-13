import { describe, it, expect } from "vitest";
import { z } from "zod";
import { zodErrorToFormErrors } from "./schema-utils";

describe("zodErrorToFormErrors", () => {
  it("should return the initial structure when no errors are provided", () => {
    const initialStructure = { name: "", email: "" };
    const result = zodErrorToFormErrors(null, initialStructure);
    expect(result).toEqual(initialStructure);
  });

  it("should return the initial structure when an empty array is provided", () => {
    const initialStructure = { name: "", email: "" };
    const result = zodErrorToFormErrors([], initialStructure);
    expect(result).toEqual(initialStructure);
  });

  it("should populate top-level field errors", () => {
    const initialStructure = { name: "", email: "" };
    const zodErrors = [{ path: ["name"], message: "Name is required" }];

    const result = zodErrorToFormErrors(zodErrors, initialStructure);

    expect(result).toEqual({
      name: "Name is required",
      email: "",
    });
  });

  it("should handle nested object errors", () => {
    const initialStructure = {
      user: { name: "", contact: { email: "" } },
    };

    const zodErrors = [
      { path: ["user", "name"], message: "Name is required" },
      { path: ["user", "contact", "email"], message: "Invalid email" },
    ];

    const result = zodErrorToFormErrors(zodErrors, initialStructure);

    expect(result).toEqual({
      user: {
        name: "Name is required",
        contact: {
          email: "Invalid email",
        },
      },
    });
  });

  it("should handle array errors", () => {
    const initialStructure = {
      question: "",
      answers: [],
    };

    const zodErrors = [
      { path: ["answers", 0, "text"], message: "Answer text is required" },
      { path: ["answers", 1, "text"], message: "Answer text is too short" },
    ];

    const result = zodErrorToFormErrors(zodErrors, initialStructure);

    expect(result).toEqual({
      question: "",
      answers: [
        { text: "Answer text is required" },
        { text: "Answer text is too short" },
      ],
    });
  });

  it("should handle real-world validation scenario with a schema", () => {
    const answerSchema = z.object({
      answer: z.string().min(1, { message: "Answer is required" }),
      feedback: z.string().optional(),
      is_correct: z.boolean(),
    });

    const exerciseSchema = z.object({
      question: z.string().min(1, { message: "Question is required" }),
      answers: z
        .array(answerSchema)
        .min(1, { message: "At least one answer is required" }),
    });

    const invalidData = {
      question: "",
      answers: [{ answer: "", feedback: "Good job!", is_correct: true }],
    };

    let zodError;
    try {
      exerciseSchema.parse(invalidData);
    } catch (error) {
      zodError = error.errors;
    }

    const initialStructure = {
      question: "",
      answers: [],
    };

    const result = zodErrorToFormErrors(zodError, initialStructure);

    expect(result).toEqual({
      question: "Question is required",
      answers: [{ answer: "Answer is required" }],
    });
  });

  it("should ignore errors without paths", () => {
    const initialStructure = { name: "" };
    const zodErrors = [
      { message: "Some general error" }, // No path
      { path: ["name"], message: "Name is required" },
    ];

    const result = zodErrorToFormErrors(zodErrors, initialStructure);

    expect(result).toEqual({
      name: "Name is required",
    });
  });
});
