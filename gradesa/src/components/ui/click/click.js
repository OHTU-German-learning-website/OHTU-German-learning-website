import React, { useState } from "react";
import { Button } from "../button";
import { Container } from "../layout/container";
import { Column } from "@/components/ui/layout/container";

const WordSelectionExercise = ({
  title,
  targetCategory,
  targetWords,
  allWords,
}) => {
  const [selectedWords, setSelectedWords] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleWordClick = (word) => {
    if (isSubmitted) return;

    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const checkAnswers = () => {
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
    } else if (score >= 70) {
      feedbackMessage = "Gut gemacht! Punktzahl: " + score + "%";
    } else {
      feedbackMessage = "Weiter üben! Punktzahl: " + score + "%";
    }

    setFeedback(feedbackMessage);
    setIsSubmitted(true);
  };

  const resetExercise = () => {
    setSelectedWords([]);
    setIsSubmitted(false);
    setFeedback("");
  };

  const textColor = (word) => {
    if (selectedWords.includes(word)) {
      if (isSubmitted) {
        return targetWords.includes(word)
          ? { backgroundColor: "var(--green3)" } // green
          : { backgroundColor: "var(--red)" }; // red
      } else {
        return { backgroundColor: "var(--blue)" }; // blue
      }
    } else {
      if (isSubmitted && targetWords.includes(word)) {
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
      {feedback && (
        <>
          <div>{feedback}</div>
          <br />
        </>
      )}

      <div>
        {!isSubmitted ? (
          <Button size="sm" onClick={checkAnswers}>
            Antworten überprüfen
          </Button>
        ) : (
          <Button size="sm" onClick={resetExercise}>
            Erneut versuchen
          </Button>
        )}
      </div>
    </Column>
  );
};

export default WordSelectionExercise;
