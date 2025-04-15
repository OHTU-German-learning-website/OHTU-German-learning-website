"use client";

import React, { useState } from "react";
import { Button } from "../button";
import { Column } from "@/components/ui/layout/container";
import { Container } from "../layout/container";

const CreateFillInTheGap = () => {
  const [sentenceTemplate, setSentenceTemplate] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  const getGapsCount = () =>
    sentenceTemplate.split(" ").filter((w) => w === "___").length;

  const handleSentenceChange = (e) => {
    const text = e.target.value;
    const gaps = text.split(" ").filter((w) => w === "___").length;

    setSentenceTemplate(text);
    setCorrectAnswers((prev) => {
      const newAnswers = [...prev];
      while (newAnswers.length < gaps) newAnswers.push("");
      return newAnswers.slice(0, gaps);
    });
  };

  const handleAnswerChange = (index, value) => {
    const updated = [...correctAnswers];
    updated[index] = value;
    setCorrectAnswers(updated);
  };

  const saveExercise = async () => {
    const templateWords = sentenceTemplate.trim().split(" ");
    const gaps = getGapsCount();

    if (
      !sentenceTemplate ||
      correctAnswers.length !== gaps ||
      correctAnswers.some((a) => !a)
    ) {
      setFeedback(
        "Bitte füllen Sie alle Lücken und richtigen Antworten aus, bevor Sie speichern."
      );
      return;
    }

    const exercise = {
      sentence_template: templateWords,
      correct_answers: correctAnswers,
    };

    try {
      const response = await fetch("/api/exercises/fillinthegap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exercise),
      });

      if (!response.ok) {
        setFeedback("Fehler beim Speichern der Aufgabe.");
      } else {
        setFeedback("Aufgabe erfolgreich gespeichert!");
        setSentenceTemplate("");
        setCorrectAnswers([]);
      }
    } catch (err) {
      console.error(err);
      setFeedback("Ein Fehler ist beim Speichern aufgetreten.");
    }
  };

  return (
    <Column gap="md">
      <h2>Neue Lückentext-Aufgabe erstellen</h2>
      <textarea
        value={sentenceTemplate}
        onChange={handleSentenceChange}
        placeholder="Schreiben Sie einen Satz und verwenden Sie '___' für die Lücken"
        rows={4}
        style={{ width: "100%", padding: "8px" }}
      />

      <Container>
        {correctAnswers.map((answer, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Richtige Antwort für Lücke ${i + 1}`}
            value={answer}
            onChange={(e) => handleAnswerChange(i, e.target.value)}
            style={{ marginBottom: "8px", width: "100%", padding: "4px" }}
          />
        ))}
      </Container>

      <Button size="sm" onClick={() => setPreviewMode(!previewMode)}>
        {previewMode ? "Vorschau ausblenden" : "Vorschau anzeigen"}
      </Button>
      <Button size="sm" onClick={saveExercise}>
        Aufgabe speichern
      </Button>

      {feedback && (
        <div style={{ color: "red", marginTop: "1rem" }}>{feedback}</div>
      )}

      {previewMode && (
        <div style={{ marginTop: "16px" }}>
          <h3>Vorschau</h3>
          <p>
            {sentenceTemplate
              .split(" ")
              .map((word, i) =>
                word === "___" ? (
                  <input
                    key={i}
                    type="text"
                    disabled
                    placeholder="___"
                    style={{ margin: "0 4px" }}
                  />
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
          </p>
        </div>
      )}
    </Column>
  );
};

export default CreateFillInTheGap;
