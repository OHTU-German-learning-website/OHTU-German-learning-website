import parse, { domToReact, Element } from "html-react-parser";
import {
  GlossaryParagraph,
  GlossaryListItem,
} from "@/components/ui/glossary/GlossaryText";

// Korvataan allaolevat custom-tagit vastaavilla HTML-tageilla jotta console errorit saadaan pois:
const tagMapToHtml = {
  container: "div",
  column: "div",
  anchor: "a",
};

export default function RenderHTML({ data }) {
  if (!data) return null;

  const parsedContent = parse(data, {
    replace: (domNode) => {
      if (domNode.type !== "tag") return;

      const name = domNode.name?.toLowerCase();

      if (name === "glossaryparagraph") {
        const children = domNode.children ? domToReact(domNode.children) : null;
        return (
          <GlossaryParagraph {...domNode.attribs}>{children}</GlossaryParagraph>
        );
      }

      if (name === "glossarylistitem") {
        const children = domNode.children ? domToReact(domNode.children) : null;
        return (
          <GlossaryListItem {...domNode.attribs}>{children}</GlossaryListItem>
        );
      }

      // Muut custom-tagit -> standardi HTML
      if (name in tagMapToHtml) {
        const HtmlTag = tagMapToHtml[name];
        const children = domNode.children ? domToReact(domNode.children) : null;
        return <HtmlTag {...domNode.attribs}>{children}</HtmlTag>;
      }

      // Jos joku tuntematon tagi, normalisoidaan se diviksi
      if (
        !/^(div|span|p|li|ul|ol|a|strong|em|h[1-6]|img|br|hr|table|thead|tbody|tr|td|th|code|pre|blockquote)$/.test(
          name
        )
      ) {
        const children = domNode.children ? domToReact(domNode.children) : null;
        return <div {...domNode.attribs}>{children}</div>;
      }
      return;
    },
  });

  return <div>{parsedContent}</div>;
}
