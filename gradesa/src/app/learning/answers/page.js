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

  const partsByHighestScore = [...(form?.parts || [])].sort((partA, partB) => {
    const scoreA = answers?.[partA.id] ?? 0;
    const scoreB = answers?.[partB.id] ?? 0;

    return scoreB - scoreA;
  });

  const renderAverages = () => {
    return partsByHighestScore.map((part) => {
      const average = answers?.[part.id];
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
    return [...(form?.parts || [])]
      .sort(
        (a, b) =>
          (b.advice_threshold < answers?.[b.id]) -
          (a.advice_threshold < answers?.[a.id])
      )
      .map((part) => {
        return (
          <LearningAdvice
            key={part.id}
            part={part}
            language={language.value}
            highlight={part.advice_threshold < answers?.[part.id]}
          />
        );
      });
  };

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
      <div className={styles.learningAdvices}>{renderAdvices()}</div>
    </div>
  );
}

function LearningAdvice({ part, language, highlight }) {
  return (
    <div
      className={[
        styles.learningAdvice,
        highlight && styles.learningAdviceHighlight,
      ].join(" ")}
    >
      <span className={styles.learningAdviceTitle}>
        {language === "de" ? "Ratschlag" : "Advice"} {part.step_label}
      </span>
      <p>{getLanguageField(part, "advice", language)}</p>
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
