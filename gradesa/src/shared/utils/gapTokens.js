// Single source of truth for fill-in-the-gap word indexing. The admin editor, the
// student page and the API routes must all count words with these helpers so that a
// stored token_index always points at the same word everywhere.

import {
  htmlToPlainText,
  normalizePlainText,
} from "@/shared/utils/normalizeEditorText";

const WORD_PATTERN = "[\\p{L}\\p{N}][\\p{L}\\p{N}'’-]*";

export function createWordRegex() {
  return new RegExp(WORD_PATTERN, "gu");
}

// Returns every word (letters/digits, with inner ' or -) in order. Punctuation,
// numbering marks and dashes never count, so only real words get an index.
export function tokenizeWords(text) {
  const words = [];
  for (const match of String(text || "").matchAll(createWordRegex())) {
    words.push({
      word: match[0],
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  return words;
}

export function normalizeWordKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function takeClosestIndex(indices, targetIndex) {
  if (!indices.length) {
    return undefined;
  }

  let bestArrayIndex = 0;
  let bestDistance = Math.abs(indices[0] - targetIndex);

  for (let i = 1; i < indices.length; i++) {
    const distance = Math.abs(indices[i] - targetIndex);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestArrayIndex = i;
    }
  }

  const [chosen] = indices.splice(bestArrayIndex, 1);
  return chosen;
}

// Server-side guard: the rendered HTML (when present) is what students see, so it is the
// reference for word indices. Returns { sourceText, gaps } or { error }.
export function alignGapsToSource({ text, sourceHtml, gaps }) {
  const sourceText = sourceHtml
    ? htmlToPlainText(sourceHtml)
    : normalizePlainText(text);
  const words = tokenizeWords(sourceText);
  const { gaps: aligned, dropped } = remapGapsToWords(gaps, words);

  if (dropped.length > 0) {
    return {
      error: `Das Lückenwort "${dropped[0].tokenText}" kommt im Text nicht (mehr) vor.`,
    };
  }

  return { sourceText, gaps: aligned };
}

// Re-anchors gaps to the given words. A gap whose stored word still sits at its index
// is kept as is; the others are moved to the nearest unused identical word. Gaps whose
// word no longer exists are returned in `dropped`.
export function remapGapsToWords(existingGaps, words) {
  const indicesByWord = new Map();
  words.forEach((token, index) => {
    const key = normalizeWordKey(token.word);
    if (!indicesByWord.has(key)) {
      indicesByWord.set(key, []);
    }
    indicesByWord.get(key).push(index);
  });

  const ordered = [...existingGaps].sort((a, b) => a.tokenIndex - b.tokenIndex);
  const used = new Set();
  const placed = new Map();
  const pending = [];

  // First pass: gaps that are already on the right word claim it.
  for (const gap of ordered) {
    const key = normalizeWordKey(gap.tokenText);
    if (
      Number.isInteger(gap.tokenIndex) &&
      words[gap.tokenIndex] &&
      normalizeWordKey(words[gap.tokenIndex].word) === key &&
      !used.has(gap.tokenIndex)
    ) {
      used.add(gap.tokenIndex);
      placed.set(gap, gap.tokenIndex);
    } else {
      pending.push(gap);
    }
  }

  const remapped = [];
  const dropped = [];

  for (const gap of pending) {
    const key = normalizeWordKey(gap.tokenText);
    const candidates = (indicesByWord.get(key) || []).filter(
      (index) => !used.has(index)
    );
    const nextIndex = takeClosestIndex(candidates, gap.tokenIndex);

    if (nextIndex === undefined) {
      dropped.push(gap);
      continue;
    }

    used.add(nextIndex);
    placed.set(gap, nextIndex);
  }

  for (const gap of ordered) {
    if (!placed.has(gap)) {
      continue;
    }
    const tokenIndex = placed.get(gap);
    remapped.push({
      ...gap,
      tokenIndex,
      tokenText: words[tokenIndex].word,
    });
  }

  remapped.sort((a, b) => a.tokenIndex - b.tokenIndex);
  return { gaps: remapped, dropped };
}
