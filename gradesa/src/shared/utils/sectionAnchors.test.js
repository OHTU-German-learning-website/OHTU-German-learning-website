import { describe, expect, it } from "vitest";
import { createSectionBookmarkId, getSectionAnchors } from "./sectionAnchors";

describe("getSectionAnchors", () => {
  it("creates unique bookmark ids that do not collide with existing targets", () => {
    expect(
      createSectionBookmarkId("Important detail", ["bookmark-important-detail"])
    ).toBe("bookmark-important-detail-2");
  });

  it("creates readable, unique ids from heading text", () => {
    const headings = getSectionAnchors([
      { text: "Grüße aus Deutschland" },
      { text: "Grüße aus Deutschland" },
      { text: "!" },
    ]);

    expect(headings.map(({ id }) => id)).toEqual([
      "section-gruesse-aus-deutschland",
      "section-gruesse-aus-deutschland-2",
      "section-heading",
    ]);
  });

  it("preserves existing ids and avoids collisions with them", () => {
    const headings = getSectionAnchors(
      [
        { text: "Introduction" },
        { text: "Custom section", id: "section-introduction" },
      ],
      ["section-introduction"]
    );

    expect(headings.map(({ id }) => id)).toEqual([
      "section-introduction-2",
      "section-introduction",
    ]);
  });
});
