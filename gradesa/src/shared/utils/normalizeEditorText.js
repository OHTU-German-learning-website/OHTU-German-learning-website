const BLOCK_BREAK_TAGS = new Set([
  "p",
  "div",
  "br",
  "li",
  "ul",
  "ol",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "tr",
  "table",
]);

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function stripTagsToText(html) {
  if (!html) {
    return "";
  }

  const withBreaks = html.replace(
    /<(\/?)([a-z0-9-]+)(?:\s[^>]*)?>/gi,
    (match, slash, tagName) => {
      const lowerTag = String(tagName).toLowerCase();
      if (slash === "/") {
        return BLOCK_BREAK_TAGS.has(lowerTag) ? "\n" : "";
      }
      return BLOCK_BREAK_TAGS.has(lowerTag) ? "\n" : "";
    }
  );

  return withBreaks.replace(/<[^>]+>/g, "");
}

export function normalizePlainText(value) {
  return String(value || "")
    .replace(/\r\n?/g, "\n")
    .replace(/[\t\f\v]+/g, " ")
    .replace(/[ \u00A0]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .replace(/ *\n */g, "\n")
    .trim();
}

export function htmlToPlainText(html) {
  const withoutTags = stripTagsToText(String(html || ""));
  const decoded = decodeEntities(withoutTags);
  return normalizePlainText(decoded);
}
