import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import RenderHTML from "./render-html";
import { transformHtmlToGlossaryTags } from "@/backend/html-transform";

// Mock the GlossaryText components
vi.mock("@/components/ui/glossary/GlossaryText", () => ({
  default: function GlossaryText({ children }) {
    return <span data-testid="glossary-text">{children}</span>;
  },
  GlossaryParagraph: function GlossaryParagraph({ children, ...props }) {
    if (typeof children === "string") {
      return (
        <p data-testid="glossary-paragraph" {...props}>
          <span data-testid="glossary-text">{children}</span>
        </p>
      );
    }
    return (
      <p data-testid="glossary-paragraph" {...props}>
        {children}
      </p>
    );
  },
  GlossaryListItem: function GlossaryListItem({ children, ...props }) {
    if (typeof children === "string") {
      return (
        <li data-testid="glossary-listitem" {...props}>
          <span data-testid="glossary-text">{children}</span>
        </li>
      );
    }
    return (
      <li data-testid="glossary-listitem" {...props}>
        {children}
      </li>
    );
  },
}));

describe("RenderHTML Component", () => {
  it("should render null when data is null or undefined", () => {
    const { container: container1 } = render(<RenderHTML data={null} />);
    expect(container1.firstChild).toBeNull();

    const { container: container2 } = render(<RenderHTML data={undefined} />);
    expect(container2.firstChild).toBeNull();
  });

  it("should render simple HTML", () => {
    const html = "<p>Hello World</p>";
    render(<RenderHTML data={html} />);
    expect(screen.getByText("Hello World")).toBeTruthy();
  });

  it("should render transformed glossary paragraph tags", () => {
    const html = "<glossaryparagraph>Test paragraph</glossaryparagraph>";
    render(<RenderHTML data={html} />);
    expect(screen.getByTestId("glossary-paragraph")).toBeTruthy();
    expect(screen.getByText("Test paragraph")).toBeTruthy();
  });

  it("should render transformed glossary list item tags", () => {
    const html = "<ul><glossarylistitem>Test item</glossarylistitem></ul>";
    render(<RenderHTML data={html} />);
    expect(screen.getByTestId("glossary-listitem")).toBeTruthy();
    expect(screen.getByText("Test item")).toBeTruthy();
  });

  it("should preserve attributes when rendering glossary tags", () => {
    const html =
      '<glossaryparagraph class="test-class" id="test-id">Content</glossaryparagraph>';
    const { container } = render(<RenderHTML data={html} />);
    const paragraph = container.querySelector("p");
    expect(paragraph.className).toBe("test-class");
    expect(paragraph.id).toBe("test-id");
  });

  describe("Integration with html-transform", () => {
    it("should handle transformed paragraphs with plain text", () => {
      const originalHtml = "<p>Simple paragraph</p>";
      const transformed = transformHtmlToGlossaryTags(originalHtml);
      const { container } = render(<RenderHTML data={transformed} />);
      const paragraph = container.querySelector(
        '[data-testid="glossary-paragraph"]'
      );
      expect(paragraph).toBeTruthy();
      expect(paragraph.textContent).toContain("Simple paragraph");
    });

    it("should handle transformed paragraphs with nested bold tags", () => {
      const originalHtml = "<p>Text with <strong>bold</strong> word</p>";
      const transformed = transformHtmlToGlossaryTags(originalHtml);
      const { container } = render(<RenderHTML data={transformed} />);

      // Current behavior: GlossaryParagraph receives React element array,
      // so it renders children as-is WITHOUT wrapping text nodes in GlossaryText
      const paragraph = container.querySelector(
        '[data-testid="glossary-paragraph"]'
      );
      expect(paragraph).toBeTruthy();

      const strong = container.querySelector("strong");
      expect(strong).toBeTruthy();
      expect(strong.textContent).toBe("bold");

      // This test passes but reveals the issue: text nodes like "Text with "
      // and " word" are NOT wrapped in GlossaryText when there are nested elements
      // Expected: All text nodes should be wrapped in <span data-testid="glossary-text">
      // Actual: Only string children are wrapped, array children are rendered as-is
    });

    it("should handle transformed paragraphs with nested emphasis tags", () => {
      const originalHtml = "<p>Text with <em>emphasis</em> here</p>";
      const transformed = transformHtmlToGlossaryTags(originalHtml);
      const { container } = render(<RenderHTML data={transformed} />);

      const em = container.querySelector("em");
      expect(em).toBeTruthy();
      expect(em.textContent).toBe("emphasis");
    });

    it("should handle transformed paragraphs with links", () => {
      const originalHtml = '<p>Check <a href="/test">this link</a> out</p>';
      const transformed = transformHtmlToGlossaryTags(originalHtml);
      const { container } = render(<RenderHTML data={transformed} />);

      const link = container.querySelector("a");
      expect(link).toBeTruthy();
      expect(link.href).toContain("/test");
      expect(link.textContent).toBe("this link");
    });

    it("should handle complex nested HTML in paragraphs", () => {
      const originalHtml =
        '<p>The <strong>German</strong> word for <a href="#">example</a> is <em>Beispiel</em></p>';
      const transformed = transformHtmlToGlossaryTags(originalHtml);
      const { container } = render(<RenderHTML data={transformed} />);

      expect(container.querySelector("strong")).toBeTruthy();
      expect(container.querySelector("a")).toBeTruthy();
      expect(container.querySelector("em")).toBeTruthy();
      expect(container.textContent).toContain("German");
      expect(container.textContent).toContain("example");
      expect(container.textContent).toContain("Beispiel");

      // IMPORTANT: This test reveals the core issue!
      // The text "The ", " word for ", and " is " are NOT wrapped in GlossaryText
      // because GlossaryParagraph receives an array of React elements from domToReact,
      // not a plain string. Therefore, glossary word detection won't work on these texts.
    });

    it("should handle transformed list items with nested HTML", () => {
      const originalHtml =
        "<ul><li>Item with <strong>bold</strong> text</li></ul>";
      const transformed = transformHtmlToGlossaryTags(originalHtml);
      const { container } = render(<RenderHTML data={transformed} />);

      const listItem = container.querySelector(
        '[data-testid="glossary-listitem"]'
      );
      expect(listItem).toBeTruthy();

      const strong = container.querySelector("strong");
      expect(strong).toBeTruthy();
      expect(strong.textContent).toBe("bold");
    });

    it("should handle multiple transformed paragraphs with nested content", () => {
      const originalHtml = `
        <p>First <strong>paragraph</strong></p>
        <p>Second <em>paragraph</em></p>
      `;
      const transformed = transformHtmlToGlossaryTags(originalHtml);
      const { container } = render(<RenderHTML data={transformed} />);

      const paragraphs = container.querySelectorAll(
        '[data-testid="glossary-paragraph"]'
      );
      expect(paragraphs.length).toBe(2);
      expect(container.querySelector("strong")).toBeTruthy();
      expect(container.querySelector("em")).toBeTruthy();
    });

    it("should handle deeply nested structures", () => {
      const originalHtml =
        "<p>Text <span>with <strong>deeply <em>nested</em> tags</strong></span> here</p>";
      const transformed = transformHtmlToGlossaryTags(originalHtml);
      const { container } = render(<RenderHTML data={transformed} />);

      expect(container.querySelector("span")).toBeTruthy();
      expect(container.querySelector("strong")).toBeTruthy();
      expect(container.querySelector("em")).toBeTruthy();
      expect(container.textContent).toContain("nested");
    });

    it("should preserve text nodes at different nesting levels", () => {
      const originalHtml =
        "<p>Start <span>middle <strong>end</strong></span> finish</p>";
      const transformed = transformHtmlToGlossaryTags(originalHtml);
      const { container } = render(<RenderHTML data={transformed} />);

      expect(container.textContent).toContain("Start");
      expect(container.textContent).toContain("middle");
      expect(container.textContent).toContain("end");
      expect(container.textContent).toContain("finish");
    });
  });

  describe("Edge cases", () => {
    it("should handle empty glossary tags", () => {
      const html = "<glossaryparagraph></glossaryparagraph>";
      const { container } = render(<RenderHTML data={html} />);
      const paragraph = container.querySelector("p");
      expect(paragraph).toBeTruthy();
    });

    it("should handle mixed regular and glossary tags", () => {
      const html = `
        <div>
          <p>Regular paragraph</p>
          <glossaryparagraph>Glossary paragraph</glossaryparagraph>
        </div>
      `;
      render(<RenderHTML data={html} />);
      expect(screen.getByText("Regular paragraph")).toBeTruthy();
      expect(screen.getByText("Glossary paragraph")).toBeTruthy();
    });

    it("should handle self-closing tags in glossary content", () => {
      const html =
        "<glossaryparagraph>Line one<br/>Line two</glossaryparagraph>";
      render(<RenderHTML data={html} />);
      expect(screen.getByText(/Line one/)).toBeTruthy();
      expect(screen.getByText(/Line two/)).toBeTruthy();
    });

    it("should handle code tags in glossary content", () => {
      const html =
        "<glossaryparagraph>Use <code>console.log()</code> function</glossaryparagraph>";
      const { container } = render(<RenderHTML data={html} />);
      const code = container.querySelector("code");
      expect(code).toBeTruthy();
      expect(code.textContent).toBe("console.log()");
    });
  });

  describe("Performance scenarios", () => {
    it("should handle many glossary paragraphs efficiently", () => {
      const paragraphs = Array.from(
        { length: 50 },
        (_, i) => `<glossaryparagraph>Paragraph ${i}</glossaryparagraph>`
      ).join("");
      const { container } = render(<RenderHTML data={paragraphs} />);
      const renderedParagraphs = container.querySelectorAll(
        '[data-testid="glossary-paragraph"]'
      );
      expect(renderedParagraphs.length).toBe(50);
    });

    it("should handle long content with nested elements", () => {
      const longText = "Word ".repeat(200);
      const html = `<glossaryparagraph>${longText}<strong>important</strong>${longText}</glossaryparagraph>`;
      const { container } = render(<RenderHTML data={html} />);
      const strong = container.querySelector("strong");
      expect(strong).toBeTruthy();
      expect(strong.textContent).toBe("important");
    });
  });
});
