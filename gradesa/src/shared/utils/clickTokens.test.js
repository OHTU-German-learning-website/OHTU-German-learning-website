// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import {
  buildSlotKeyMap,
  findWordMatches,
  getTextNodeValues,
  normalizeTokenVersion,
  remapTargetEntries,
} from "./clickTokens";

const words = (text, version) =>
  findWordMatches(text, version).map((m) => m.word);

describe("clickTokens", () => {
  it("legacy tokenizer ignores digits, latest one includes them", () => {
    const text = "Im Jahr 1848 war abc123 und 3,5 Mio.";
    expect(words(text, 1)).toEqual(["Im", "Jahr", "war", "abc", "und", "Mio"]);
    expect(words(text, 2)).toEqual([
      "Im",
      "Jahr",
      "1848",
      "war",
      "abc123",
      "und",
      "3",
      "5",
      "Mio",
    ]);
  });

  it("keeps inner apostrophes and hyphens in words", () => {
    expect(words("geht's Baden-Württemberg 1914-1918", 2)).toEqual([
      "geht's",
      "Baden-Württemberg",
      "1914-1918",
    ]);
  });

  it("falls back to legacy for unknown versions", () => {
    expect(normalizeTokenVersion(undefined)).toBe(1);
    expect(normalizeTokenVersion("2")).toBe(2);
    expect(normalizeTokenVersion(99)).toBe(1);
  });

  it("remaps legacy slot keys to the latest numbering", () => {
    const html = "<p>Im Jahr 1848 begann <b>die</b> Revolution</p>";
    const nodes = getTextNodeValues(html);
    const map = buildSlotKeyMap(nodes, 1, 2);

    // legacy: Im=0 Jahr=1 begann=2 die=3 Revolution=4
    // latest: Im=0 Jahr=1 1848=2 begann=3 die=4 Revolution=5
    expect(map.get("w-2")).toBe("w-3");
    expect(map.get("w-4")).toBe("w-5");
    expect(
      remapTargetEntries(["w-2", "g1::w-3", "g1::w-4", "foo"], map)
    ).toEqual(["w-3", "g1::w-4", "g1::w-5", "foo"]);
  });

  it("collapses duplicates when two legacy words share one latest word", () => {
    const map = buildSlotKeyMap(["a1b"], 1, 2);
    expect(remapTargetEntries(["w-0", "w-1"], map)).toEqual(["w-0"]);
  });
});
