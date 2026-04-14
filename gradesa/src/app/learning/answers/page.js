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
