"use client";

import { useState } from "react";
import RenderText from "./textrender";
import { Row } from "../layout/container";

export default function MainUI() {
  const EXERCISE_DATA = {
    text: [
      "Wenn",
      "man",
      "in",
      "___",
      "Land",
      "Sachsen",
      "kommt,",
      "dann",
      "kommt",
      "man",
      "entweder",
      "mit",
      "___",
      "Bahn,",
      "mit",
      "___",
      "Auto",
      "oder",
      "mit",
      "___",
      "Flugzeug.",
    ],
    options: [
      ["das", "die", "der"], // Options for the first gap
      ["der", "die", "das"], // Options for the second gap
      ["dem", "den", "die"], // Options for the third gap
      ["dem", "den", "die"], // Options for the fourth gap
    ],
    answers: ["das", "der", "dem", "dem"],
  };

  const [userAnswers, setUserAnswers] = useState(
    Array(EXERCISE_DATA.answers.length).fill("")
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [checkedAnswers, setCheckedAnswers] = useState(
    Array(EXERCISE_DATA.answers.length).fill(false)
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
    const newCheckedAnswers = userAnswers.map(
      (answer, index) =>
        answer.trim().toLowerCase() ===
        EXERCISE_DATA.answers[index].toLowerCase()
    );
    const hasIncorrectAnswers = newCheckedAnswers.some(
      (isCorrect) => !isCorrect
    );
    // Set error state if there are missing or incorrect answers
    setHasErrors(hasMissingAnswers || hasIncorrectAnswers);
    setCheckedAnswers(newCheckedAnswers);
    // Clear incorrect answers
    setUserAnswers((prev) =>
      prev.map((answer, index) => (newCheckedAnswers[index] ? answer : ""))
    );
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setUserAnswers(Array(EXERCISE_DATA.answers.length).fill(""));
    setIsSubmitted(false);
    setCheckedAnswers(Array(EXERCISE_DATA.answers.length).fill(false));
    setHasErrors(false);
  };

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

      <Row gap="8px" align="center">
        <button onClick={handleReset}>Zurücksetzen</button>
        <button onClick={handleSubmit}>Überprüfen</button>
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
