// Single source of truth for click-exercise word tokenization. Targets are stored as
// positional slot keys (w-0, w-1, ...), so the tokenizer must be identical in the admin
// editor and the student view, and must stay fixed per exercise (token_version).
//   v1: words are letters only (legacy exercises)
//   v2: words are letters and digits, so numbers such as "1848" are clickable

export const CLICK_TOKEN_VERSION_LEGACY = 1;
export const CLICK_TOKEN_VERSION_LATEST = 2;

const GROUP_DELIMITER = "::";

const WORD_PATTERNS = {
  1: "\\p{L}+(?:['’-]\\p{L}+)*",
  2: "[\\p{L}\\p{N}]+(?:['’-][\\p{L}\\p{N}]+)*",
};

export function normalizeTokenVersion(version) {
  const parsed = Number(version);
  return Number.isInteger(parsed) && WORD_PATTERNS[parsed]
    ? parsed
    : CLICK_TOKEN_VERSION_LEGACY;
}

export function createWordRegex(version) {
  return new RegExp(WORD_PATTERNS[normalizeTokenVersion(version)], "gu");
}

export function findWordMatches(text, version) {
  return [...String(text || "").matchAll(createWordRegex(version))].map(
    (match) => ({
      word: match[0],
      start: match.index,
      end: match.index + match[0].length,
    })
  );
}

// Text of every DOM text node in document order. Slot keys are numbered across these.
export function getTextNodeValues(html) {
  if (!html || typeof window === "undefined") {
    return [];
  }

  const doc = new window.DOMParser().parseFromString(
    `<div id="click-root">${html}</div>`,
    "text/html"
  );
  const root = doc.getElementById("click-root");
  if (!root) {
    return [];
  }

  const walker = doc.createTreeWalker(root, window.NodeFilter.SHOW_TEXT);
  const values = [];
  let current;
  while ((current = walker.nextNode())) {
    values.push(current.nodeValue || "");
  }
  return values;
}

function collectSlots(textNodeValues, version) {
  const slots = [];
  textNodeValues.forEach((text, nodeIndex) => {
    findWordMatches(text, version).forEach((match) => {
      slots.push({ ...match, nodeIndex });
    });
  });
  return slots;
}

// Maps every w-N key of one tokenizer version to the key of the word that contains it
// in another version, so stored targets keep pointing at the same text.
export function buildSlotKeyMap(textNodeValues, fromVersion, toVersion) {
  const fromSlots = collectSlots(textNodeValues, fromVersion);
  const toSlots = collectSlots(textNodeValues, toVersion);
  const map = new Map();

  fromSlots.forEach((from, fromIndex) => {
    const toIndex = toSlots.findIndex(
      (to) =>
        to.nodeIndex === from.nodeIndex &&
        to.start <= from.start &&
        to.end >= from.end
    );
    if (toIndex >= 0) {
      map.set(`w-${fromIndex}`, `w-${toIndex}`);
    }
  });

  return map;
}

// Remaps target entries ("w-3" or "group-1::w-3"). Keys that are not slot keys are kept.
export function remapTargetEntries(entries, keyMap) {
  const remapKey = (key) => keyMap.get(key) ?? key;
  const result = [];
  const seen = new Set();

  (Array.isArray(entries) ? entries : []).forEach((entry) => {
    if (typeof entry !== "string" || !entry) {
      return;
    }

    const delimiterIndex = entry.indexOf(GROUP_DELIMITER);
    const next =
      delimiterIndex > 0
        ? `${entry.slice(0, delimiterIndex)}${GROUP_DELIMITER}${remapKey(
            entry.slice(delimiterIndex + GROUP_DELIMITER.length)
          )}`
        : remapKey(entry);

    if (!seen.has(next)) {
      seen.add(next);
      result.push(next);
    }
  });

  return result;
}
