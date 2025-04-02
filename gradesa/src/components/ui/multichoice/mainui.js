"use client";

import { useState } from "react";
import RenderText from "./textrender";
import { Row } from "../layout/container";
import "./multichoice.css";
import { Button } from "@/components/ui/button";

const EXERCISE_DATA = [
  { type: "text", value: "Wenn man in" },
  {
    type: "multichoice",
    value: "___",
    options: ["das", "die", "der"],
    correct_answer: "das",
  },
  { type: "text", value: "Land Sachsen kommt, dann kommt man entweder mit" },
  {
    type: "multichoice",
    value: "___",
    options: ["der", "die", "das"],
    correct_answer: "der",
  },
  { type: "text", value: "Bahn, mit" },
  {
    type: "multichoice",
    value: "___",
    options: ["dem", "den", "die"],
    correct_answer: "dem",
  },
  { type: "text", value: "Auto oder mit" },
  {
    type: "multichoice",
    value: "___",
    options: ["dem", "den", "die"],
    correct_answer: "dem",
  },
  { type: "text", value: "Flugzeug." },
];

export default function MainUI() {
  const [userAnswers, setUserAnswers] = useState(
    EXERCISE_DATA.map((item) => (item.type === "multichoice" ? "" : null))
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [checkedAnswers, setCheckedAnswers] = useState(
    EXERCISE_DATA.map(() => false)
  );
  const [hasErrors, setHasErrors] = useState(false); // Unanswered or incorrect answers

  const handleChange = (index, value) => {
    setUserAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[index] = value;
      return newAnswers;
    });

    // Clear error state when user makes changes after submission
    if (isSubmitted) {
      setHasErrors(false);
    }
  };

  const handleSubmit = () => {
    const hasMissingAnswers = userAnswers.some((answer) => answer === "");
    const newCheckedAnswers = EXERCISE_DATA.map((item, index) => {
      if (item.type === "multichoice") {
        return (
          userAnswers[index]?.trim().toLowerCase() ===
          item.correct_answer.toLowerCase()
        );
      }
      return true;
    });
    const hasIncorrectAnswers = newCheckedAnswers.some(
      (isCorrect) => !isCorrect
    );

    // Set error state if there are missing or incorrect answers
    setHasErrors(hasMissingAnswers || hasIncorrectAnswers);
    setCheckedAnswers(newCheckedAnswers);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setUserAnswers(
      EXERCISE_DATA.map((item) => (item.type === "multichoice" ? "" : null))
    );
    setIsSubmitted(false);
    setCheckedAnswers(EXERCISE_DATA.map(() => false));
    setHasErrors(false);
  };

  // Check if all answers are correct
  const allCorrect = isSubmitted && checkedAnswers.every(Boolean);

  return (
    <div className="exercise-container">
      <h2 className="task-title">Wähle die richtigen Wörter aus</h2>

      <RenderText
        exerciseData={EXERCISE_DATA}
        userAnswers={userAnswers}
        isSubmitted={isSubmitted}
        checkedAnswers={checkedAnswers}
        handleChange={handleChange}
      />

      <Row className="row">
        <Button className="button" onClick={handleReset}>
          Zurücksetzen
        </Button>
        <Button className="button" onClick={handleSubmit}>
          Überprüfen
        </Button>
      </Row>

      {isSubmitted && allCorrect && (
        <div className="success-message">Wunderbar!</div>
      )}

      {isSubmitted && hasErrors && (
        <div className="error-message">
          Einige Antworten waren falsch oder fehlen. Bitte versuche es noch
          einmal.
        </div>
      )}
    </div>
  );
}
