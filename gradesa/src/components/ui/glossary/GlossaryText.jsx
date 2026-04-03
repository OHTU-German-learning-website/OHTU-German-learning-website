"use client";
import React, { cloneElement, isValidElement, useMemo } from "react";
import { useGlossary } from "@/context/glossary.context";
import GlossaryTooltip from "./GlossaryTooltip";

/**  Component that automatically detects glossary words in plain text
 * and wraps matching terms with tooltip components.
 * Usage: <GlossaryText>Some text containing glossary words</GlossaryText> */
export default function GlossaryText({ children, excludeWords = [] }) {
  const { wordMap, isLoading } = useGlossary();

  const excludeSet = useMemo(
    () => new Set(excludeWords.map((word) => word.toLowerCase())),
    [excludeWords]
  );

  /** Glossary matching only works on plain string content.
   *   If the glossary is still loading, or children is not a string,
   *   render the content unchanged. */
  if (isLoading || !children || typeof children !== "string") {
    return <>{children}</>;
  }

  /** Sort glossary words by length so longer phrases are matched first. */
  const glossaryWords = Object.keys(wordMap)
    .filter((word) => !excludeSet.has(word.toLowerCase()))
    .sort((a, b) => b.length - a.length);

  if (glossaryWords.length === 0) return <>{children}</>;

  /**  Escape special regex characters before building the matching pattern. */
  const escapedWords = glossaryWords.map((word) =>
    word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );

  const glossaryRegex = new RegExp(`\\b(${escapedWords.join("|")})\\b`, "gi");
  const parts = children.split(glossaryRegex);

  if (parts.length <= 1) return <>{children}</>;

  return (
    <>
      {parts.map((part, index) => {
        const matchedWord = glossaryWords.find(
          (word) => word.toLowerCase() === part.toLowerCase()
        );

        if (matchedWord) {
          return (
            <GlossaryTooltip key={`glossary-${index}`} word={part}>
              {part}
            </GlossaryTooltip>
          );
        }

        return <React.Fragment key={`text-${index}`}>{part}</React.Fragment>;
      })}
    </>
  );
}

/**
 * Recursively processes parsed HTML children and applies glossary detection
 * only to string text nodes, while preserving nested React elements such as
 * <strong>, <em>, <br>, and other inline markup produced by html-react-parser.
 */
function processGlossaryChildren(children) {
  return React.Children.map(children, (child) => {
    if (typeof child === "string") {
      return <GlossaryText>{child}</GlossaryText>;
    }

    if (!isValidElement(child)) {
      return child;
    }

    if (!child.props?.children) {
      return child;
    }

    return cloneElement(
      child,
      { ...child.props },
      processGlossaryChildren(child.props.children)
    );
  });
}

/**
 * Glossary-aware paragraph renderer.
 *
 * Applies glossary processing to text nodes inside the paragraph while keeping
 * nested markup intact. This is especially useful for HTML parsed from the
 * editor, where children may be a mix of strings and React elements.
 */
export function GlossaryParagraph({ children, ...props }) {
  return <p {...props}>{processGlossaryChildren(children)}</p>;
}

/**
 * Glossary-aware list item renderer.
 *
 * Works like GlossaryParagraph, but for <li> elements. Text nodes are scanned
 * for glossary terms and wrapped with tooltips without flattening nested markup.
 */
export function GlossaryListItem({ children, ...props }) {
  return <li {...props}>{processGlossaryChildren(children)}</li>;
}
