"use client";

import { useState, useEffect } from "react";
import RenderText from "./textrender";
import { Row } from "../layout/container";
import "./multichoice.css";
import { Button } from "@/components/ui/button";
import useQuery from "@/shared/hooks/useQuery";

export default function MultichoicePage({ exerciseId }) {
  // Fetch exercise data using the useQuery hook
  const {
    data: exerciseData,
    isLoading,
    error,
  } = useQuery(`/exercises/multichoice/${exerciseId}`);

  const [userAnswers, setUserAnswers] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [checkedAnswers, setCheckedAnswers] = useState([]);
  const [hasErrors, setHasErrors] = useState(false); // Unanswered or incorrect answers

  // Update state when exerciseData is loaded
  useEffect(() => {
    if (exerciseData) {
      setUserAnswers(
        exerciseData.content.map((item) =>
          item.content_type === "multichoice" ? "" : null
        )
      );
      setCheckedAnswers(exerciseData.content.map(() => false));
    }
  }, [exerciseData]);

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
    const newCheckedAnswers = exerciseData.content.map((item, index) => {
      if (item.content_type === "multichoice") {
        return (
          userAnswers[index]?.trim().toLowerCase() ===
          item.correct_answer.toLowerCase()
        );
      }
      return true;
    });

    const hasIncorrectAnswers = newCheckedAnswers.some(
      (isCorrect, index) =>
        exerciseData.content[index].content_type === "multichoice" && !isCorrect
    );

    // Set error state if there are missing or incorrect answers
    setHasErrors(hasMissingAnswers || hasIncorrectAnswers);
    setCheckedAnswers(newCheckedAnswers);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setUserAnswers(
      exerciseData.content.map((item) =>
        item.content_type === "multichoice" ? "" : null
      )
    );
    setIsSubmitted(false);
    setCheckedAnswers(exerciseData.content.map(() => false));
    setHasErrors(false);
  };

  if (isLoading) return <div>Laden...</div>;
  if (error) return <div>Fehler: {error}</div>;
  if (!exerciseData) return <div>Keine Übungsdaten verfügbar.</div>; // Handle null data

  // Check if all answers are correct
  const allCorrect = isSubmitted && checkedAnswers.every(Boolean);

  return (
    <div className="exercise-container">
      <h2 className="task-title">{exerciseData.title}</h2>

      <RenderText
        exerciseData={exerciseData.content}
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
