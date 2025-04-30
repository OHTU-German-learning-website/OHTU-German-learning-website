"use client";
import { useGlossary } from "@/context/glossary.context";
import GlossaryTooltip from "./GlossaryTooltip";
import { useMemo } from "react";

//Component that automatically detects glossary words in text and wraps them with tooltips
//Usage: <GlossaryText>Some text containing glossary words</GlossaryText>

export default function GlossaryText({ children, excludeWords = [] }) {
  const { wordMap, isLoading } = useGlossary();

  const excludeSet = useMemo(
    () => new Set(excludeWords.map((word) => word.toLowerCase())),
    [excludeWords]
  );

  if (isLoading || !children || typeof children !== "string") {
    return <>{children}</>;
  }

  const processText = (text) => {
    if (!text || typeof text !== "string") return text;

    // Get all glossary words sorted by length (longest first)
    // This ensures we match longer phrases before shorter ones
    const glossaryWords = Object.keys(wordMap)
      .filter((word) => !excludeSet.has(word))
      .sort((a, b) => b.length - a.length);

    if (glossaryWords.length === 0) return text;

    const glossaryRegex = new RegExp(
      `\\b(${glossaryWords.join("|")})\\b`,
      "gi"
    );

    const parts = text.split(glossaryRegex);

    if (parts.length <= 1) return text;

    const result = [];
    for (let i = 0; i < parts.length; i++) {
      if (parts[i]) result.push(parts[i]);

      if (
        i < parts.length - 1 &&
        glossaryWords.some((word) => parts[i + 1].toLowerCase() === word)
      ) {
        const matchedWord = parts[i + 1];
        result.push(
          <GlossaryTooltip key={`glossary-${i}`} word={matchedWord}>
            {matchedWord}
          </GlossaryTooltip>
        );
        i++;
      }
    }

    return result;
  };

  return <>{processText(children)}</>;
}

export function GlossaryParagraph({ children }) {
  if (typeof children !== "string") return <p>{children}</p>;
  return (
    <p>
      <GlossaryText>{children}</GlossaryText>
    </p>
  );
}

export function GlossaryListItem({ children }) {
  if (typeof children !== "string") return <li>{children}</li>;
  return (
    <li>
      <GlossaryText>{children}</GlossaryText>
    </li>
  );
}
