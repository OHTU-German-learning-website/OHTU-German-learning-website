import { describe, expect, it } from "vitest";
import {
  alignGapsToSource,
  remapGapsToWords,
  tokenizeWords,
} from "./gapTokens";

describe("tokenizeWords", () => {
  it("ignores numbering, dashes and punctuation-only tokens", () => {
    const words = tokenizeWords("1. Ich – gehe / (a) nach Hause, ja!");
    expect(words.map((w) => w.word)).toEqual([
      "1",
      "Ich",
      "gehe",
      "a",
      "nach",
      "Hause",
      "ja",
    ]);
  });

  it("splits words joined by punctuation", () => {
    expect(tokenizeWords("und/oder Haus,Garten").map((w) => w.word)).toEqual([
      "und",
      "oder",
      "Haus",
      "Garten",
    ]);
  });
});

describe("remapGapsToWords", () => {
  const gap = (tokenIndex, tokenText) => ({ tokenIndex, tokenText });

  it("keeps gaps that are already on their word", () => {
    const words = tokenizeWords("a b a b");
    const { gaps } = remapGapsToWords([gap(2, "a")], words);
    expect(gaps.map((g) => g.tokenIndex)).toEqual([2]);
  });

  it("moves a shifted gap to the nearest identical word", () => {
    const words = tokenizeWords("x muss gehen und muss bleiben");
    const { gaps } = remapGapsToWords([gap(5, "muss")], words);
    expect(gaps[0].tokenIndex).toBe(4);
  });

  it("does not give two gaps the same word and reports missing words", () => {
    const words = tokenizeWords("kann kann");
    const { gaps, dropped } = remapGapsToWords(
      [gap(0, "kann"), gap(0, "kann"), gap(1, "soll")],
      words
    );
    expect(gaps.map((g) => g.tokenIndex)).toEqual([0, 1]);
    expect(dropped.map((g) => g.tokenText)).toEqual(["soll"]);
  });
});

describe("table cells", () => {
  it("keeps words in neighbouring cells separate", () => {
    const html =
      "<table><tbody><tr><td>Ich</td><td>muss</td><td>gehen</td></tr></tbody></table>";
    const result = alignGapsToSource({
      text: "",
      sourceHtml: html,
      gaps: [{ tokenIndex: 1, tokenText: "muss" }],
    });
    expect(result.error).toBeUndefined();
    expect(result.gaps[0].tokenIndex).toBe(1);
  });
});

describe("alignGapsToSource", () => {
  it("indexes by the rendered html and rejects missing words", () => {
    const html = "<p>1. Er <strong>muss</strong> gehen.</p><p>Sie kann.</p>";
    const ok = alignGapsToSource({
      text: "",
      sourceHtml: html,
      gaps: [{ tokenIndex: 4, tokenText: "kann" }],
    });
    expect(ok.gaps[0].tokenIndex).toBe(5);

    const bad = alignGapsToSource({
      text: "",
      sourceHtml: html,
      gaps: [{ tokenIndex: 0, tokenText: "soll" }],
    });
    expect(bad.error).toBeTruthy();
  });
});
