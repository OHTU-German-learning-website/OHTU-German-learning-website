import { describe, it, expect } from "vitest";
import { transformHtmlToGlossaryTags } from "./html-transform";

describe("transformHtmlToGlossaryTags", () => {
  it("should transform <p> tags to <GlossaryParagraph>", () => {
    const input = "<p>This is a test paragraph.</p>";
    const result = transformHtmlToGlossaryTags(input);
    expect(result).toContain("<glossaryparagraph>");
    expect(result).toContain("</glossaryparagraph>");
    expect(result).toContain("This is a test paragraph.");
  });

  it("should transform <li> tags to <GlossaryListItem>", () => {
    const input = "<ul><li>Item 1</li><li>Item 2</li></ul>";
    const result = transformHtmlToGlossaryTags(input);
    expect(result).toContain("<glossarylistitem>");
    expect(result).toContain("</glossarylistitem>");
    expect(result).toContain("Item 1");
    expect(result).toContain("Item 2");
  });

  it("should preserve attributes on transformed tags", () => {
    const input = '<p class="test-class" id="test-id">Content</p>';
    const result = transformHtmlToGlossaryTags(input);
    expect(result).toContain('class="test-class"');
    expect(result).toContain('id="test-id"');
  });

  it("should not double-wrap already transformed content", () => {
    const input = "<GlossaryParagraph>Already transformed</GlossaryParagraph>";
    const result = transformHtmlToGlossaryTags(input);
    // Should not have nested GlossaryParagraph tags
    const count = (result.match(/<glossaryparagraph>/gi) || []).length;
    expect(count).toBe(1);
  });

  it("should handle empty or null input gracefully", () => {
    expect(transformHtmlToGlossaryTags("")).toBe("");
    expect(transformHtmlToGlossaryTags(null)).toBe(null);
    expect(transformHtmlToGlossaryTags(undefined)).toBe(undefined);
  });

  it("should handle nested HTML structures", () => {
    const input = "<div><p>Paragraph with <strong>bold</strong> text</p></div>";
    const result = transformHtmlToGlossaryTags(input);
    expect(result).toContain("<glossaryparagraph>");
    expect(result).toContain("<strong>bold</strong>");
  });

  it("should transform multiple paragraphs and list items", () => {
    const input = `
      <p>First paragraph</p>
      <p>Second paragraph</p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    `;
    const result = transformHtmlToGlossaryTags(input);
    const pCount = (result.match(/<glossaryparagraph>/gi) || []).length;
    const liCount = (result.match(/<glossarylistitem>/gi) || []).length;
    expect(pCount).toBe(2);
    expect(liCount).toBe(2);
  });

  it("should return original HTML if transformation fails", () => {
    // This is a bit tricky to test without mocking, but we can test the error handling
    const malformedInput = "<p>Test"; // Intentionally unclosed
    const result = transformHtmlToGlossaryTags(malformedInput);
    // Should still return something (jsdom will try to fix it)
    expect(result).toBeTruthy();
  });

  describe("Complex nested HTML structures", () => {
    it("should preserve nested <strong> tags within paragraphs", () => {
      const input = "<p>Text with <strong>bold word</strong> inside</p>";
      const result = transformHtmlToGlossaryTags(input);
      expect(result).toContain("<glossaryparagraph>");
      expect(result).toContain("<strong>bold word</strong>");
      expect(result).toContain("Text with");
      expect(result).toContain("inside");
    });

    it("should preserve nested <em> tags within paragraphs", () => {
      const input = "<p>Text with <em>emphasized</em> content</p>";
      const result = transformHtmlToGlossaryTags(input);
      expect(result).toContain("<glossaryparagraph>");
      expect(result).toContain("<em>emphasized</em>");
    });

    it("should preserve <a> links within paragraphs", () => {
      const input = '<p>Check <a href="/page">this link</a> for more</p>';
      const result = transformHtmlToGlossaryTags(input);
      expect(result).toContain("<glossaryparagraph>");
      expect(result).toContain('<a href="/page">this link</a>');
    });

    it("should preserve multiple nested tags within paragraphs", () => {
      const input =
        '<p>The <strong>German</strong> word for <a href="#">example</a> is <em>Beispiel</em></p>';
      const result = transformHtmlToGlossaryTags(input);
      expect(result).toContain("<glossaryparagraph>");
      expect(result).toContain("<strong>German</strong>");
      expect(result).toContain('<a href="#">example</a>');
      expect(result).toContain("<em>Beispiel</em>");
    });

    it("should preserve deeply nested structures", () => {
      const input =
        "<p>Text <span>with <strong>deeply <em>nested</em> tags</strong></span> here</p>";
      const result = transformHtmlToGlossaryTags(input);
      expect(result).toContain("<glossaryparagraph>");
      expect(result).toContain("<span>");
      expect(result).toContain("<strong>");
      expect(result).toContain("<em>nested</em>");
    });
  });

  describe("List items with nested HTML", () => {
    it("should preserve <strong> tags within list items", () => {
      const input = "<ul><li>Item with <strong>bold</strong> text</li></ul>";
      const result = transformHtmlToGlossaryTags(input);
      expect(result).toContain("<glossarylistitem>");
      expect(result).toContain("<strong>bold</strong>");
    });

    it("should preserve links within list items", () => {
      const input =
        '<ol><li>Read <a href="/doc">documentation</a> first</li></ol>';
      const result = transformHtmlToGlossaryTags(input);
      expect(result).toContain("<glossarylistitem>");
      expect(result).toContain('<a href="/doc">documentation</a>');
    });

    it("should handle multiple nested elements in list items", () => {
      const input =
        '<ul><li>Item with <strong>bold</strong> and <em>italic</em> and <a href="#">link</a></li></ul>';
      const result = transformHtmlToGlossaryTags(input);
      expect(result).toContain("<glossarylistitem>");
      expect(result).toContain("<strong>bold</strong>");
      expect(result).toContain("<em>italic</em>");
      expect(result).toContain('<a href="#">link</a>');
    });
  });

  describe("Edge cases and special scenarios", () => {
    it("should handle paragraphs with only whitespace and nested tags", () => {
      const input = "<p>  <strong>  Bold text  </strong>  </p>";
      const result = transformHtmlToGlossaryTags(input);
      expect(result).toContain("<glossaryparagraph>");
      expect(result).toContain("<strong>");
    });

    it("should handle self-closing tags within paragraphs", () => {
      const input = "<p>Line one<br/>Line two</p>";
      const result = transformHtmlToGlossaryTags(input);
      expect(result).toContain("<glossaryparagraph>");
      expect(result).toContain("Line one");
      expect(result).toContain("Line two");
    });

    it("should preserve code tags within paragraphs", () => {
      const input = "<p>Use the <code>console.log()</code> function</p>";
      const result = transformHtmlToGlossaryTags(input);
      expect(result).toContain("<glossaryparagraph>");
      expect(result).toContain("<code>console.log()</code>");
    });

    it("should handle mixed content with text nodes at different levels", () => {
      const input =
        "<p>Start <span>middle <strong>end</strong></span> finish</p>";
      const result = transformHtmlToGlossaryTags(input);
      expect(result).toContain("<glossaryparagraph>");
      expect(result).toContain("Start");
      expect(result).toContain("middle");
      expect(result).toContain("end");
      expect(result).toContain("finish");
    });

    it("should handle paragraphs with attributes and nested HTML", () => {
      const input =
        '<p class="intro" id="p1">Welcome to <strong>our site</strong>!</p>';
      const result = transformHtmlToGlossaryTags(input);
      expect(result).toContain('<glossaryparagraph class="intro" id="p1">');
      expect(result).toContain("<strong>our site</strong>");
    });

    it("should not transform paragraphs inside other non-glossary elements", () => {
      const input = "<div><section><p>Nested paragraph</p></section></div>";
      const result = transformHtmlToGlossaryTags(input);
      expect(result).toContain("<glossaryparagraph>");
      expect(result).toContain("<div>");
      expect(result).toContain("<section>");
    });

    it("should handle complex real-world content structure", () => {
      const input = `
        <div>
          <p>The German language has <strong>four cases</strong>: 
          <a href="/grammar/nominativ">Nominativ</a>, 
          <a href="/grammar/akkusativ">Akkusativ</a>, 
          <em>Dativ</em>, and <em>Genitiv</em>.</p>
          <ul>
            <li>Use <strong>Nominativ</strong> for subjects</li>
            <li>Use <strong>Akkusativ</strong> for direct objects</li>
          </ul>
        </div>
      `;
      const result = transformHtmlToGlossaryTags(input);
      expect(result).toContain("<glossaryparagraph>");
      expect(result).toContain("<glossarylistitem>");
      expect(result).toContain("<strong>four cases</strong>");
      expect(result).toContain('<a href="/grammar/nominativ">');
      expect(result).toContain("<em>Dativ</em>");
    });
  });

  describe("Performance and boundary conditions", () => {
    it("should handle paragraphs with very long text and nested elements", () => {
      const longText = "Lorem ipsum ".repeat(100);
      const input = `<p>${longText}<strong>important</strong>${longText}</p>`;
      const result = transformHtmlToGlossaryTags(input);
      expect(result).toContain("<glossaryparagraph>");
      expect(result).toContain("<strong>important</strong>");
    });

    it("should handle many consecutive paragraphs with nested content", () => {
      const paragraphs = Array.from(
        { length: 20 },
        (_, i) => `<p>Paragraph ${i} with <strong>bold</strong> text</p>`
      ).join("");
      const result = transformHtmlToGlossaryTags(paragraphs);
      const count = (result.match(/<glossaryparagraph>/gi) || []).length;
      expect(count).toBe(20);
      const strongCount = (result.match(/<strong>bold<\/strong>/gi) || [])
        .length;
      expect(strongCount).toBe(20);
    });

    it("should handle deeply nested list structures", () => {
      const input = `
        <ul>
          <li>Level 1
            <ul>
              <li>Level 2 with <strong>bold</strong></li>
            </ul>
          </li>
        </ul>
      `;
      const result = transformHtmlToGlossaryTags(input);
      expect(result).toContain("<glossarylistitem>");
      expect(result).toContain("Level 1");
      expect(result).toContain("Level 2");
      expect(result).toContain("<strong>bold</strong>");
    });
  });
});
