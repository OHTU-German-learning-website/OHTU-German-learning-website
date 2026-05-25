import { describe, it, expect, vi } from "vitest";
import { checkSession } from "@/backend/auth/session";
import { GET as getClick } from "./click/route";
import { GET as getDragdrop } from "./dragdrop/[dnd_id]/route";
import { GET as getMultichoiceList } from "./multichoice/route";
import { GET as getMultichoiceDetail } from "./multichoice/[id]/route";
import { GET as getMemoryGame } from "./memory-game/[id]/route";
import {
  GET as getJumbledSentence,
  PUT as putJumbledSentence,
  DELETE as deleteJumbledSentence,
} from "./jumbled-sentence/[id]/route";

vi.mock("@/backend/auth/session", () => ({
  checkSession: vi.fn(),
}));

describe("exercise API auth guards", () => {
  it("rejects unauthenticated access to answer-bearing routes", async () => {
    checkSession.mockResolvedValue(null);

    const cases = [
      [getClick, {}],
      [getDragdrop, { params: Promise.resolve({ dnd_id: "1" }) }],
      [getMultichoiceList, {}],
      [getMultichoiceDetail, { params: Promise.resolve({ id: "1" }) }],
      [getMemoryGame, { params: Promise.resolve({ id: "1" }) }],
      [getJumbledSentence, { params: Promise.resolve({ id: "1" }) }],
      [putJumbledSentence, { params: Promise.resolve({ id: "1" }) }],
      [deleteJumbledSentence, { params: Promise.resolve({ id: "1" }) }],
    ];

    for (const [handler, context] of cases) {
      const response = await handler({}, context);
      expect(response.status).toBe(401);
    }
  });
});
