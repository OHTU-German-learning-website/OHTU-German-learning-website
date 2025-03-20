"use client";

import { useState } from "react";
import SentenceWithGaps from "./sentencewithgaps";
import { Row } from "../layout/container";
import "./fillinthegap.css";

export default function FillInTheGapGame() {
  const sentenceTemplate = [
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
    "___",
    "beiden",
    "größten",
    "Flugplätze",
    "sind",
    "in",
    "Leipzig",
    "und",
    "in",
    "Dresden.",
    "Alle",
    "kennen",
    "natürlich",
    "___",
    "Leipziger",
    "Messe",
    "und",
    "___",
    "barocken",
    "Sehenswürdigkeiten",
    "___",
    "Stadt",
    "Dresden.",
  ];
  const correctAnswers = [
    "das",
    "der",
    "dem",
    "dem",
    "Die",
    "die",
    "die",
    "der",
  ];

  const [userAnswers, setUserAnswers] = useState(
    Array(correctAnswers.length).fill("")
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [checkedAnswers, setCheckedAnswers] = useState(
    Array(correctAnswers.length).fill(false)
  );

  const handleChange = (index, value) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setCheckedAnswers(
      userAnswers.map(
        (answer, index) =>
          answer.trim().toLowerCase() === correctAnswers[index].toLowerCase()
      )
    );
  };

  const handleReset = () => {
    setUserAnswers(Array(correctAnswers.length).fill(""));
    setIsSubmitted(false);
    setCheckedAnswers(Array(correctAnswers.length).fill(false));
  };

  const allCorrect = isSubmitted && checkedAnswers.every(Boolean);

  return (
    <div className="game-container">
      <h2 className="task-title">Fülle die Lücken aus</h2>

      {isSubmitted && allCorrect && <div className="wunderbar">wunderbar!</div>}

      <SentenceWithGaps
        sentenceTemplate={sentenceTemplate}
        userAnswers={userAnswers}
        correctAnswers={correctAnswers}
        isSubmitted={isSubmitted}
        checkedAnswers={checkedAnswers}
        handleChange={handleChange}
      />

      <Row gap="8px" align="center">
        <button onClick={handleReset}>zurücksetzen</button>
        <button onClick={handleSubmit}>überprüfen</button>
      </Row>
    </div>
  );
}
