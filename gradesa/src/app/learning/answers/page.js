"use client";
import useQuery from "@/shared/hooks/useQuery";
import styles from "./learning-answers.module.css";
import { FORM_LANGUAGE_OPTIONS } from "../page";
import { useState } from "react";
import {
  getLanguageField,
  getLanguageTitle,
} from "@/components/ui/learning-form";
import { Dropdown } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import layout from "@/shared/styles/layout.module.css";
import { useRouter } from "next/navigation";

export default function LearningAnswersPage() {
  const { data: answers } = useQuery("/forms/learning_type/answer");
  const { data: form } = useQuery("/forms/learning_type");
  const router = useRouter();
  const [language, setLanguage] = useState(FORM_LANGUAGE_OPTIONS[0]);
  const renderAverages = () => {
    return form?.parts.map((part, index) => {
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
    return form?.parts
      .filter((part) => part.advice_threshold < answers?.[part.id])
      .map((part, index) => {
        return (
          <LearningAdvice key={part.id} part={part} language={language.value} />
        );
      });
  };

  return (
    <div className={layout.view}>
      <div className={styles.learningAnswersHeader}>
        <Dropdown options={FORM_LANGUAGE_OPTIONS} onSelect={setLanguage}>
          <Button>{language.label}</Button>
        </Dropdown>
        <Button onClick={() => router.push("/learning")}>Retake Test</Button>
      </div>
      <div className={styles.learningAnswers}>{renderAverages()}</div>
      <div className={styles.learningAdvices}>{renderAdvices()}</div>
    </div>
  );
}

function LearningAdvice({ part, language }) {
  return (
    <div className={styles.learningAdvice}>
      <span className={styles.learningAdviceTitle}>
        Advice {part.step_label}
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
