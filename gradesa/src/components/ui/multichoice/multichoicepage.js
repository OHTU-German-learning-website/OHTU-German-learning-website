"use client";

import { useState, useEffect } from "react";
import RenderText from "./textrender";
import { Row } from "../layout/container";
import "./multichoice.css";
import { Button } from "@/components/ui/button";
import useQuery from "@/shared/hooks/useQuery";

function shuffleOptions(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

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
  const [shuffledExerciseData, setShuffledExerciseData] = useState(null);
  const [dropdownSubmittedStates, setDropdownSubmittedStates] = useState([]);

  // Update state when exerciseData is loaded
  useEffect(() => {
    if (exerciseData) {
      // Shuffle options for each multichoice item
      const shuffledData = {
        ...exerciseData,
        content: exerciseData.content.map((item) => {
          if (item.content_type === "multichoice") {
            return {
              ...item,
              options: shuffleOptions(item.options),
            };
          }
          return item;
        }),
      };
      setShuffledExerciseData(shuffledData);

      // Initialize user answers and checked answers
      setUserAnswers(
        shuffledData.content.map((item) =>
          item.content_type === "multichoice" ? "" : null
        )
      );
      setCheckedAnswers(shuffledData.content.map(() => false));
    }
  }, [exerciseData]);

  const handleChange = (index, value) => {
    setUserAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[index] = value;
      return newAnswers;
    });

    // Reset the isSubmitted state for the specific dropdown
    setDropdownSubmittedStates((prev) => {
      const newStates = [...prev];
      newStates[index] = false; // Reset only the dropdown user interacts with
      return newStates;
    });
  };

  const handleSubmit = () => {
    const hasMissingAnswers = userAnswers.some((answer) => answer === "");
    const newCheckedAnswers = shuffledExerciseData.content.map(
      (item, index) => {
        if (item.content_type === "multichoice") {
          return (
            userAnswers[index]?.trim().toLowerCase() ===
            item.correct_answer.toLowerCase()
          );
        }
        return true;
      }
    );

    const hasIncorrectAnswers = newCheckedAnswers.some(
      (isCorrect, index) =>
        shuffledExerciseData.content[index].content_type === "multichoice" &&
        !isCorrect
    );

    // Set error state if there are missing or incorrect answers
    setHasErrors(hasMissingAnswers || hasIncorrectAnswers);
    setCheckedAnswers(newCheckedAnswers);
    setIsSubmitted(true);

    // Mark all dropdowns as submitted
    setDropdownSubmittedStates(newCheckedAnswers.map(() => true));
  };

  const handleReset = () => {
    setUserAnswers(
      shuffledExerciseData.content.map((item) =>
        item.content_type === "multichoice" ? "" : null
      )
    );
    setIsSubmitted(false);
    setCheckedAnswers(shuffledExerciseData.content.map(() => false));
    setHasErrors(false);
    setDropdownSubmittedStates(shuffledExerciseData.content.map(() => false));
  };

  if (isLoading) return <div>Laden...</div>;
  if (error) return <div>Fehler: {error}</div>;
  if (!shuffledExerciseData) return null;

  // Check if all answers are correct
  const allCorrect = isSubmitted && checkedAnswers.every(Boolean);

  return (
    <div className="exercise-container">
      <h2 className="task-title">{shuffledExerciseData.title}</h2>
      <p className="task-description">
        {shuffledExerciseData.exercise_description}
      </p>

      <RenderText
        exerciseData={shuffledExerciseData.content}
        userAnswers={userAnswers}
        isSubmitted={isSubmitted}
        dropdownSubmittedStates={dropdownSubmittedStates}
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
