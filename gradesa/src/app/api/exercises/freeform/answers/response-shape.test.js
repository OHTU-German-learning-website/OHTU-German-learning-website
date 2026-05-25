import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

vi.mock("@/backend/auth/session", () => ({
  checkSession: vi.fn(),
}));

vi.mock("@/backend/db", () => ({
  DB: {
    pool: vi.fn(),
  },
}));

import { checkSession } from "@/backend/auth/session";
import { DB } from "@/backend/db";

function createRequest(body) {
  return {
    url: "http://localhost/api/exercises/freeform/answers",
    headers: new Headers({ "content-type": "application/json" }),
    method: "POST",
    cache: "default",
    credentials: "same-origin",
    integrity: "",
    mode: "cors",
    redirect: "follow",
    json: async () => body,
  };
}

describe("freeform answer response shape", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not echo the canonical answer", async () => {
    checkSession.mockResolvedValue({ id: 7, is_admin: false });
    DB.pool
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            answer: "This is the correct answer",
            is_correct: true,
            feedback: "Great job!",
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] });

    const response = await POST(
      createRequest({
        freeFormExerciseId: "12",
        freeFormQuestionId: "34",
        answer: "This is the correct answer",
      })
    );

    expect(response.status).toBe(200);

    const result = await response.json();
    expect(result.answer).toBeUndefined();
    expect(result.is_correct).toBe(true);
    expect(result.perfectAnswer).toBe(true);
  });
});
