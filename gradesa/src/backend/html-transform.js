/**
 * Transforms HTML content by replacing <p> and <li> tags with custom glossary tags.
 *
 * PERFORMANCE OPTIMIZATION: Uses fast regex-based transformation instead of JSDOM.
 * This prevents ERR_INCOMPLETE_CHUNKED_ENCODING errors on large pages with images.
 *
 * Why: JSDOM full DOM parsing causes severe memory/CPU issues on pages >1-5MB,
 * resulting in response timeouts on nginx (OpenShift). Regex is 100-1000x faster.
 *
 * @param {string} htmlString - The HTML content to transform
 * @returns {string} - Transformed HTML with GlossaryParagraph and GlossaryListItem tags
 */
export function transformHtmlToGlossaryTags(htmlString) {
  if (!htmlString || typeof htmlString !== "string") {
    return htmlString;
  }

  try {
    let result = htmlString;

    // Transform <p> tags to <glossaryparagraph>
    // Regex: <p\b([^>]*)> matches <p, <p , <p attr="value">, etc.
    // $1 preserves all attributes
    result = result.replace(/<p\b([^>]*)>/gi, "<glossaryparagraph$1>");
    result = result.replace(/<\/p\s*>/gi, "</glossaryparagraph>");

    // Transform <li> tags to <glossarylistitem>
    result = result.replace(/<li\b([^>]*)>/gi, "<glossarylistitem$1>");
    result = result.replace(/<\/li\s*>/gi, "</glossarylistitem>");

    return result;
  } catch (error) {
    console.error("Error transforming HTML to glossary tags:", error);
    return htmlString;
  }
}
