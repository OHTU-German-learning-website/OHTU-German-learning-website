import { describe, expect, it } from "vitest";
import { sortNewsArticles } from "./news";

describe("sortNewsArticles", () => {
  it("places pinned news first and keeps newest-first order within each group", () => {
    const articles = [
      { id: 1, created_at: "2026-11-03T00:00:00Z", is_pinned: false },
      { id: 2, created_at: "2026-11-01T00:00:00Z", is_pinned: true },
      { id: 3, created_at: "2026-11-02T00:00:00Z", is_pinned: true },
      { id: 4, created_at: "2026-11-04T00:00:00Z", is_pinned: false },
    ];

    expect(sortNewsArticles(articles).map(({ id }) => id)).toEqual([
      3, 2, 4, 1,
    ]);
  });
});
