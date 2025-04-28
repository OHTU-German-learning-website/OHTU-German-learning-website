import React, { useState } from "react";
import { Button } from "../button";
import { Container } from "../layout/container";
import { Column } from "@/components/ui/layout/container";

const WordSelectionExercise = ({
  title,
  targetCategory,
  targetWords,
  allWords,
  onSelectionChange,
  onSubmit, // Callback to handle submission
  isPreviewMode = false,
  isSubmitted, // Submission state passed from parent
  feedback, // Feedback passed from parent
}) => {
  const [selectedWords, setSelectedWords] = useState([]);

  const handleWordClick = (word) => {
    if (isSubmitted && !isPreviewMode) return;

    let updatedSelectedWords;
    if (selectedWords.includes(word)) {
      updatedSelectedWords = selectedWords.filter((w) => w !== word);
    } else {
      updatedSelectedWords = [...selectedWords, word];
    }

    setSelectedWords(updatedSelectedWords);

    if (isPreviewMode && onSelectionChange) {
      onSelectionChange(updatedSelectedWords);
    }
  };

  const checkAnswers = () => {
    if (isPreviewMode) return;

    const correctAnswers = targetWords;
    const incorrectSelections = selectedWords.filter(
      (word) => !correctAnswers.includes(word)
    );
    const missedCorrectAnswers = correctAnswers.filter(
      (word) => !selectedWords.includes(word)
    );

    const score = Math.round(
      ((correctAnswers.length -
        missedCorrectAnswers.length -
        incorrectSelections.length) /
        correctAnswers.length) *
        100
    );

    let feedbackMessage = "";
    if (score === 100) {
      feedbackMessage =
        "Perfekt! Du hast alle " + targetCategory + " korrekt identifiziert!";
    } else if (score >= 90) {
      feedbackMessage = "Fast Perfekt! Punktzahl: " + score + "%";
    } else if (score >= 50) {
      feedbackMessage = "Gut gemacht! Punktzahl: " + score + "%";
    } else {
      feedbackMessage = "Weiter üben! Punktzahl: " + score + "%";
    }

    // Call the onSubmit callback with the selected words, score, and feedback
    onSubmit(selectedWords, score, feedbackMessage);
  };

  const resetExercise = () => {
    setSelectedWords([]);
  };

  const textColor = (word) => {
    if (selectedWords.includes(word)) {
      if (isSubmitted && !isPreviewMode) {
        return targetWords.includes(word)
          ? { backgroundColor: "var(--green)" } // green
          : { backgroundColor: "var(--red)" }; // red
      } else {
        return { backgroundColor: "var(--blue)" }; // blue
      }
    } else {
      if (isSubmitted && targetWords.includes(word) && !isPreviewMode) {
        return {
          backgroundColor: "var(--yellow)",
          border: "1px solid var(--yellow-border)",
        }; // yellow with border
      }
    }
  };

  return (
    <Column gap="md">
      <h1>{title}</h1>
      <i>{`Wähle alle ${targetCategory} aus dem untenstehenden Text aus.`}</i>
      <Container>
        {allWords?.map((word, index) => (
          <Button
            key={index}
            onClick={() => handleWordClick(word)}
            variant="click"
            style={textColor(word)}
          >
            {word}
          </Button>
        ))}
      </Container>
      {feedback && !isPreviewMode && (
        <>
          <div>{feedback}</div>
          <br />
        </>
      )}

      <div>
        {!isSubmitted && !isPreviewMode ? (
          <Button size="sm" width="fit" onClick={checkAnswers}>
            Antworten überprüfen
          </Button>
        ) : (
          !isPreviewMode && (
            <Button size="sm" onClick={resetExercise}>
              Erneut versuchen
            </Button>
          )
        )}
      </div>
    </Column>
  );
};

export default WordSelectionExercise;
