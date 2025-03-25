import React, { useState } from "react";
import { Button } from "../button";
import { Container } from "../layout/container";

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
          ? { backgroundColor: "#38a169", color: "#fff" } // green
          : { backgroundColor: "#e53e3e", color: "#fff" }; // red
      } else {
        return { backgroundColor: "hsl(240, 40%, 92%)" }; // blue
      }
    } else {
      if (isSubmitted && targetWords.includes(word)) {
        return {
          backgroundColor: "#faf089",
          border: "1px solid #d69e2e",
        }; // yellow with border
      }
    }
  };

  return (
    <div>
      <h1>{title}</h1>

      <br />

      <i>{`Wähle alle ${targetCategory} aus dem untenstehenden Text aus.`}</i>

      <br />
      <br />

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

      <br />

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
    </div>
  );
};

export default WordSelectionExercise;
