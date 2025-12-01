import parse, { domToReact } from "html-react-parser";
import {
  GlossaryParagraph,
  GlossaryListItem,
} from "@/components/ui/glossary/GlossaryText";

export default function RenderHTML({ data }) {
  if (!data) {
    return null;
  }

  // Parse HTML and replace custom glossary tags with React components
  const parsedContent = parse(data, {
    replace: (domNode) => {
      // Only process element nodes, not text or comment nodes
      if (domNode.type !== "tag") {
        return;
      }

      // Handle GlossaryParagraph custom tags
      if (domNode.name === "glossaryparagraph") {
        // Extract and convert child nodes to React, preserving HTML structure
        const children = domNode.children ? domToReact(domNode.children) : null;
        return (
          <GlossaryParagraph {...domNode.attribs}>{children}</GlossaryParagraph>
        );
      }

      // Handle GlossaryListItem custom tags
      if (domNode.name === "glossarylistitem") {
        // Extract and convert child nodes to React, preserving HTML structure
        const children = domNode.children ? domToReact(domNode.children) : null;
        return (
          <GlossaryListItem {...domNode.attribs}>{children}</GlossaryListItem>
        );
      }
    },
  });

  return <div>{parsedContent}</div>;
}
