"use client";
import useQuery from "@/shared/hooks/useQuery";
import styles from "./learning-answers.module.css";
import { FORM_LANGUAGE_OPTIONS } from "../page";
import {
  getLanguageField,
  getLanguageTitle,
} from "@/components/ui/learning-form";
import { Button } from "@/components/ui/button";
import layout from "@/shared/styles/layout.module.css";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/shared/utils/useLocalStorage";

export default function LearningAnswersPage() {
  const { data: answers } = useQuery("/forms/learning_type/answer");
  const { data: form } = useQuery("/forms/learning_type");
  const router = useRouter();
  const [language, setLanguage] = useLocalStorage(
    "language",
    FORM_LANGUAGE_OPTIONS[0]
  );

  const getPartScore = (part) => {
    const scoreFromApi = Number(answers?.[part.id]);
    if (Number.isFinite(scoreFromApi)) {
      return scoreFromApi;
    }

    const questions = part?.questions || [];
    if (!questions.length) return 0;

    const total = questions.reduce(
      (sum, question) => sum + Number(question.answer || 0),
      0
    );
    return Math.round((total / questions.length) * 100) / 100;
  };

  const partsByHighestScore = [...(form?.parts || [])].sort((partA, partB) => {
    const scoreA = getPartScore(partA);
    const scoreB = getPartScore(partB);

    return scoreB - scoreA;
  });

  const partsByGrade = [...(form?.parts || [])].sort((partA, partB) => {
    const gradeA = partA.step_label || "";
    const gradeB = partB.step_label || "";

    const parsedA = gradeA.match(/^([A-F])(\d+)?$/i);
    const parsedB = gradeB.match(/^([A-F])(\d+)?$/i);

    if (parsedA && parsedB) {
      const letterOrder =
        parsedA[1].toUpperCase().charCodeAt(0) -
        parsedB[1].toUpperCase().charCodeAt(0);

      if (letterOrder !== 0) return letterOrder;

      const levelA = Number(parsedA[2] || 0);
      const levelB = Number(parsedB[2] || 0);

      return levelA - levelB;
    }

    return gradeA.localeCompare(gradeB, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  const renderAverages = () => {
    return partsByGrade.map((part) => {
      const average = getPartScore(part);
      return (
        <LearningAverage
          key={part.id}
          average={average}
          part={part}
          language={language.value}
        />
      );
    });
  };

  const renderAdvices = () => {
    return partsByHighestScore.map((part) => {
      return (
        <LearningAdvice
          key={part.id}
          part={part}
          language={language.value}
          highlight={part.advice_threshold < getPartScore(part)}
        />
      );
    });
  };

  const introText =
    language.value === "de" ? DE_RESULTS_INTRO_TEXT : EN_RESULTS_INTRO_TEXT;

  return (
    <div className={layout.view}>
      <div className={styles.learningAnswersHeader}>
        <div className={styles.languageToggleWrap}>
          <span className={styles.languageLabel}>Language / Sprache</span>
          <div
            className={styles.languageToggle}
            role="group"
            aria-label="Choose language"
          >
            {FORM_LANGUAGE_OPTIONS.map((option) => {
              const isActive = language.value === option.value;

              return (
                <Button
                  key={option.value}
                  type="button"
                  size="sm"
                  variant={isActive ? "primary" : "outline"}
                  className={styles.languageButton}
                  onClick={() => setLanguage(option)}
                  aria-pressed={isActive}
                >
                  {option.label}
                </Button>
              );
            })}
          </div>
        </div>
        <Button onClick={() => router.push("/learning")}>
          {language.value === "de" ? "Test neu machen" : "Retake Test"}
        </Button>
      </div>
      <div className={styles.learningAnswers}>{renderAverages()}</div>
      <p className={styles.learningIntro}>{introText}</p>
      <div className={styles.learningAdvices}>{renderAdvices()}</div>
    </div>
  );
}

function LearningAdvice({ part, language, highlight }) {
  const adviceText = getLanguageField(part, "advice", language);

  return (
    <div
      className={[
        styles.learningAdvice,
        highlight && styles.learningAdviceHighlight,
      ].join(" ")}
    >
      <span className={styles.learningAdviceTitle}>
        {language === "de" ? "Lerntipp" : "Learning Tip"} {part.step_label}
      </span>
      <div className={styles.learningAdviceBody}>
        {renderRichPlainText(adviceText)}
      </div>
    </div>
  );
}

function LearningAverage({ average, part, language }) {
  const renderBar = () => {
    return (
      <div className={styles.learningAnswerBar}>
        <div
          className={styles.learningAnswerBarFill}
          style={{ width: `${(average / 5) * 100}%` }}
        ></div>
      </div>
    );
  };
  return (
    <div className={styles.learningAnswersItem}>
      <span className={styles.learningAnswerTitle}>
        {getLanguageTitle(part, language)}
      </span>
      <div>
        <span className={styles.learningAnswerAverage}>{average}</span>
      </div>
      {renderBar()}
    </div>
  );
}

const EN_RESULTS_INTRO_TEXT = `Here you can see the average scores for each section of the test. The study tips are
sorted according to these scores. The first tip is the one with the highest average
score. Read all six tips to find out how you can further improve your language
learning.`;

const DE_RESULTS_INTRO_TEXT = `Hier siehst du die Mittelwerte der einzelnen Sektionen des Tests. Die Hinweis-Texte
zum Lernen sind nach diesen Werten sortiert. Der erste Text ist der mit dem
höchsten Mittelwert. Lies alle 6 Texte, so kannst du herausfinden, wie du dein
Sprachenlernen noch verbessern kannst.`;

function renderRichPlainText(text) {
  const blocks = normalizeTextBlocks(text);

  return blocks.map((block, index) => {
    if (block.type === "list") {
      return (
        <ul key={`list-${index}`} className={styles.learningAdviceList}>
          {block.items.map((item, itemIndex) => (
            <li key={`item-${index}-${itemIndex}`}>
              {renderAdviceInlineFormatting(item, `item-${index}-${itemIndex}`)}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={`paragraph-${index}`}>
        {renderAdviceInlineFormatting(block.text, `paragraph-${index}`)}
      </p>
    );
  });
}

function renderAdviceInlineFormatting(text, keyPrefix) {
  if (!text) return text;

  const wordsRegex = /(Gitarre|sitzen|saß|gesessen)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let counter = 0;

  while ((match = wordsRegex.exec(text)) !== null) {
    const [word] = match;
    const start = match.index;

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    parts.push(
      <span key={`${keyPrefix}-word-${counter}`}>
        {renderHighlightedWord(word, `${keyPrefix}-letters-${counter}`)}
      </span>
    );

    lastIndex = start + word.length;
    counter += 1;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length ? parts : text;
}

function renderHighlightedWord(word, keyPrefix) {
  const highlightByWord = {
    Gitarre: new Set([1, 3, 6]),
    sitzen: new Set([1]),
    saß: new Set([1]),
    gesessen: new Set([3]),
  };

  const highlights = highlightByWord[word];
  if (!highlights) return word;

  return [...word].map((char, index) => {
    if (!highlights.has(index)) {
      return char;
    }

    return (
      <span
        key={`${keyPrefix}-${index}`}
        className={styles.learningAdviceRedLetter}
      >
        {char}
      </span>
    );
  });
}

function normalizeTextBlocks(text) {
  if (!text || typeof text !== "string") return [];

  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let paragraph = "";
  let listItems = [];

  const pushParagraph = () => {
    const cleaned = paragraph.trim();
    if (cleaned) blocks.push({ type: "paragraph", text: cleaned });
    paragraph = "";
  };

  const pushList = () => {
    if (listItems.length) blocks.push({ type: "list", items: [...listItems] });
    listItems = [];
  };

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      pushParagraph();
      pushList();
      continue;
    }

    const bulletMatch = trimmedLine.match(/^[•-]\s*(.*)$/);
    if (bulletMatch) {
      pushParagraph();
      const bulletText = bulletMatch[1].trim();
      if (bulletText) listItems.push(bulletText);
      continue;
    }

    if (listItems.length) {
      if (isListToParagraphBoundary(trimmedLine)) {
        pushList();
        paragraph = trimmedLine;
        continue;
      }

      const lastIndex = listItems.length - 1;
      listItems[lastIndex] = `${listItems[lastIndex]} ${trimmedLine}`;
      continue;
    }

    if (paragraph && paragraph.endsWith(":")) {
      pushParagraph();
      paragraph = trimmedLine;
      continue;
    }

    paragraph = paragraph ? `${paragraph} ${trimmedLine}` : trimmedLine;
  }

  pushParagraph();
  pushList();

  return blocks;
}

function isListToParagraphBoundary(line) {
  return /^(If\b|Wenn\b|Lernen\b)/i.test(line);
}
