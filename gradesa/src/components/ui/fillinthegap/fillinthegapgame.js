"use client";

import { useState, useEffect } from "react";
import SentenceWithGaps from "./sentencewithgaps";
import { Row } from "../layout/container";
import { Button } from "@radix-ui/themes";
import "./fillinthegap.css";

export default function FillInTheGapGame() {
  const [exercise, setExercise] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [checkedAnswers, setCheckedAnswers] = useState([]);
  const [currentExerciseId, setCurrentExerciseId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fetchExercise = async (exerciseId = null) => {
    try {
      const url = exerciseId
        ? `/api/exercises/fillinthegap?exerciseId=${exerciseId}`
        : "/api/exercises/fillinthegap";

      const response = await fetch(url);
      if (!response.ok) {
        console.error("Fehler beim Abrufen der Aufgabe:", response.status);
        return;
      }
      const data = await response.json();

      setExercise(data);
      setUserAnswers(Array(data.correct_answers.length).fill(""));
      setCheckedAnswers(Array(data.correct_answers.length).fill(false));
      setCurrentExerciseId(parseInt(data.exercise_id, 10));
      setFeedback("");
      setIsSubmitted(false);
    } catch (error) {
      console.error("Fehler beim Abrufen der Aufgabe:", error);
    }
  };

  useEffect(() => {
    fetchExercise();
  }, []);

  const handleNextExercise = async () => {
    if (!currentExerciseId) {
      console.error("Die aktuelle Aufgaben-ID ist nicht gesetzt.");
      return;
    }

    try {
      const nextExerciseId = currentExerciseId + 1;
      const response = await fetch(
        `/api/exercises/fillinthegap?exerciseId=${nextExerciseId}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          setExercise(null);
          setFeedback("Alle Aufgaben abgeschlossen!");
        } else {
          console.error(
            "Fehler beim Abrufen der nächsten Aufgabe:",
            response.status
          );
        }
        return;
      }
      const data = await response.json();

      setExercise(data);
      setUserAnswers(Array(data.correct_answers.length).fill(""));
      setCheckedAnswers(Array(data.correct_answers.length).fill(false));
      setCurrentExerciseId(parseInt(data.exercise_id, 10));
      setFeedback("");
      setIsSubmitted(false);
    } catch (error) {
      console.error("Fehler beim Abrufen der nächsten Aufgabe:", error);
    }
  };

  const handleSubmit = () => {
    const newCheckedAnswers = userAnswers.map((answer, index) => {
      if (!answer) return false;
      return (
        answer.trim().toLowerCase() ===
        exercise.correct_answers[index].toLowerCase()
      );
    });

    setCheckedAnswers(newCheckedAnswers);
    setIsSubmitted(true);

    if (newCheckedAnswers.every((isCorrect) => isCorrect)) {
      setFeedback("Wunderbar!");
    } else {
      setFeedback("");
    }
  };

  const handleReset = () => {
    if (!exercise) return;
    setUserAnswers(Array(exercise.correct_answers.length).fill(""));
    setCheckedAnswers(Array(exercise.correct_answers.length).fill(false));
    setIsSubmitted(false);
  };

  if (!exercise) {
    return (
      <div className="game-container">
        {feedback ? (
          <h2>{feedback}</h2>
        ) : (
          <div>Es gibt noch keine Aufgaben</div>
        )}
      </div>
    );
  }

  return (
    <div className="game-container">
      <h2 className="task-title">Fülle die Lücken aus</h2>
      {feedback && <div className="wunderbar">{feedback}</div>}{" "}
      <SentenceWithGaps
        sentenceTemplate={exercise.sentence_template}
        userAnswers={userAnswers}
        correctAnswers={exercise.correct_answers}
        checkedAnswers={checkedAnswers}
        isSubmitted={isSubmitted}
        handleChange={(index, value) => {
          const newAnswers = [...userAnswers];
          newAnswers[index] = value;
          setUserAnswers(newAnswers);
        }}
      />
      <Row gap="8px" align="center">
        <Button onClick={handleReset}>Zurücksetzen</Button>
        <Button onClick={handleSubmit}>Überprüfen</Button>
        {feedback === "Wunderbar!" && (
          <Button onClick={handleNextExercise}>Nächste Aufgabe</Button>
        )}
      </Row>
    </div>
  );
}
