import parse, { domToReact } from "html-react-parser";
import {
  GlossaryParagraph,
  GlossaryListItem,
} from "@/components/ui/glossary/GlossaryText";

// ?NOTE The <container> tag still throws an error, but for now I've chosen not to go down that rabbit hole
// ?It seems slightly too complicated for this last sprint.

/**
 * Normalize HTML attributes for use in React elements.
 *
 * Converts common HTML attribute names to their React equivalents (for
 * example `class` -> `className`) and returns a shallow copy so the
 * original attribute object is not mutated.
 *
 * @param {Object} attributes - Raw attributes from the HTML parser.
 * @returns {Object} A normalized attributes object safe to spread on React elements.
 */
const normalizeAttribs = (attributes = {}) => {
  if (!attributes) return {};
  const normalized = { ...attributes };
  // Map common HTML attribute names to React prop names.
  // Some HTML parsers produce `class`, others produce `classname` (lowercase).
  // Ensure we normalize both to `className` and remove the original keys so
  // invalid DOM props (like `classname`) are not spread onto React elements.
  if (normalized.classname && !normalized.className) {
    normalized.className = normalized.classname;
    delete normalized.classname;
  }
  if (normalized.class && !normalized.className) {
    normalized.className = normalized.class;
    delete normalized.class;
  }
  return normalized;
};

/**
 * RenderHTML
 *
 * Safely parses HTML produced by the Quill editor (or other sources) and
 * replaces a small set of custom tags with React components or safer
 * equivalents. Uses `html-react-parser` under the hood and processes
 * nested content via a recursive replacer.
 *
 * Supported tag replacements:
 * - `glossaryparagraph` -> `GlossaryParagraph` (React component)
 * - `glossarylistitem` -> `GlossaryListItem` (React component)
 * - `anchor` -> `span.glossary-anchor[data-href=...]` (avoids nested <a> issues)
 *
 * @param {{data: string}} props - Component props containing raw HTML string.
 * @returns {JSX.Element|null} Parsed React nodes wrapped in a `div`, or `null`.
 */
export default function RenderHTML({ data }) {
  if (!data) return null;

  // Handlers for specific custom tags. Each handler receives normalized
  // attributes and the already-converted children (as React nodes).
  const handlers = {
    glossaryparagraph: (attributes, children) => (
      <GlossaryParagraph {...attributes}>{children}</GlossaryParagraph>
    ),
    glossarylistitem: (attributes, children) => (
      <GlossaryListItem {...attributes}>{children}</GlossaryListItem>
    ),
    column: (attributes, children) => {
      const safeAttribs = { ...attributes };
      safeAttribs.className = [safeAttribs.className, "glossary-column"]
        .filter(Boolean)
        .join(" ");
      return <div {...safeAttribs}>{children}</div>; // This replacement should maybe use <Column> if it exists
    },
    anchor: (attributes, children) => {
      const safeAttribs = { ...attributes };
      const href = safeAttribs.href || safeAttribs["data-href"];
      if (href) {
        safeAttribs["data-href"] = href;
        delete safeAttribs.href;
      }
      safeAttribs.className = [safeAttribs.className, "glossary-anchor"]
        .filter(Boolean)
        .join(" ");
      return <span {...safeAttribs}>{children}</span>; // This replacement logic should maybe use <Anchor> if it exists
    },
  };

  const replacer = (domNode) => {
    if (domNode.type !== "tag") return;
    const name = domNode.name;
    const normalizedAttributes = normalizeAttribs(domNode.attribs || {});
    const children = domNode.children
      ? domToReact(domNode.children, { replace: replacer })
      : null;
    const handler = handlers[name];
    return handler ? handler(normalizedAttributes, children) : undefined;
  };

  const parsedContent = parse(data, { replace: replacer });
  return <div>{parsedContent}</div>;
}
