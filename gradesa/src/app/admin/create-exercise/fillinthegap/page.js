"use client";

import { Button } from "@/components/ui/button";
import { Column, Row } from "@/components/ui/layout/container";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateFillInTheGapExercise() {
  const [sentenceTemplate, setSentenceTemplate] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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
    setCorrectAnswers((prev) =>
      prev.map((ans, i) => (i === index ? value : ans))
    );
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setGeneralError("");
      setSuccessMessage("");

      const gaps = sentenceTemplate
        .split(" ")
        .filter((w) => w === "___").length;

      if (!sentenceTemplate || correctAnswers.length !== gaps) {
        setGeneralError(
          "Bitte füllen Sie alle Lücken und richtigen Antworten aus."
        );
        return;
      }

      const exercise = {
        sentence_template: sentenceTemplate.split(" "),
        correct_answers: correctAnswers,
      };

      const response = await fetch("/api/exercises/fillinthegap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exercise),
      });

      if (!response.ok) {
        setGeneralError("Fehler beim Speichern der Aufgabe.");
      } else {
        setSuccessMessage("Aufgabe erstellt!");
        setSentenceTemplate("");
        setCorrectAnswers([]);
      }
    } catch (err) {
      console.error("Submission error:", err);
      setGeneralError("Ein Fehler ist aufgetreten.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/create-exercise");
  };

  return (
    <Column gap="md">
      <h2>Lückentext-Übung erstellen</h2>
      <p>
        Schreiben Sie einen Satz und verwenden Sie "___" für die Lücken. Geben
        Sie dann die richtigen Antworten für jede Lücke an.
      </p>
      {generalError && (
        <p className="error" role="alert">
          {generalError}
        </p>
      )}
      {successMessage && (
        <p className="success" role="alert">
          {successMessage}
        </p>
      )}
      <label>
        Satz
        <textarea
          value={sentenceTemplate}
          onChange={handleSentenceChange}
          placeholder="Schreiben Sie hier Ihren Satz mit '___' für die Lücken"
          rows={4}
          className="input"
        />
      </label>
      <Column>
        {correctAnswers.map((answer, i) => (
          <label key={i}>
            Richtige Antwort für Lücke {i + 1}
            <input
              type="text"
              value={answer}
              onChange={(e) => handleAnswerChange(i, e.target.value)}
              placeholder={`Antwort für Lücke ${i + 1}`}
              className="input"
            />
          </label>
        ))}
      </Column>
      <Row justify="space-between" gap="md">
        <Button variant="outline" onClick={handleCancel}>
          Abbrechen
        </Button>
        <Button
          variant="secondary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Wird gesendet..." : "Absenden"}
        </Button>
      </Row>
    </Column>
  );
}
