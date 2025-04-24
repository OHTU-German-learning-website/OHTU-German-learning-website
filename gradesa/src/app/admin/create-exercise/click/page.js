"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRequest } from "@/shared/hooks/useRequest";
import { Container } from "@/components/ui/layout/container";
import { Column } from "@/components/ui/layout/container";
import { Button } from "@/components/ui/button";
import "./click.css";
import WordSelectionExercise from "@/components/ui/click/click.js";

export default function CreateExercise() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [targetCategory, setTargetCategory] = useState("");
  const [allWordsText, setAllWordsText] = useState("");
  const [selectedWords, setSelectedWords] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const makeRequest = useRequest();

  // Process all words into an array
  const allWords = allWordsText
    .split(" ")
    .map((word) => word.trim())
    .filter((word) => word !== "");

  const handlePreview = (e) => {
    e.preventDefault();
    setPreviewMode(true);
  };

  const handleSaveExercise = async () => {
    try {
      const response = await makeRequest("/admin/exercises/click", {
        title,
        targetCategory,
        targetWords: selectedWords,
        allWords,
      });
      setSubmitted(true);
      setTimeout(() => {
        router.push(`/grammar/exercises/click/${response.data.id}`);
      }, 2000);
    } catch (error) {
      setError(error.message);
      setSubmitted(false);
    }
  };

  const successMessage = () => {
    return (
      <div className="success-message">
        <p>Übung erfolgreich erstellt.</p>
      </div>
    );
  };

  const errorMessage = () => {
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  };

  const handleEditAgain = () => {
    setPreviewMode(false);
  };

  return (
    <div>
      <h1>Wortauswahl-Übung erstellen</h1>
      {submitted ? (
        successMessage() // Show only the success message if submitted
      ) : !previewMode ? (
        <form onSubmit={handlePreview}>
          <Column gap="md">
            <Container className="exercise-click">
              <label>Übungstitel</label>
              <input
                className="click-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Z. B. Verben identifizieren"
                required
              />
            </Container>

            <Container className="exercise-click">
              <label>Zielkategorie</label>
              <input
                className="click-input"
                type="text"
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value)}
                placeholder="Z. B. Verben, Substantive, Adjektive, etc."
                required
              />
            </Container>

            <Container className="exercise-click">
              <label>Übungstext</label>
              <textarea
                className="click-input"
                value={allWordsText}
                onChange={(e) => setAllWordsText(e.target.value)}
                placeholder="Z. B. Ich mag laufen und schwimmen."
                rows={4}
                required
              />
            </Container>
          </Column>
          <Button size="md" type="submit">
            Zielwörter auswählen
          </Button>
        </form>
      ) : (
        <div>
          <p>
            Klicken Sie auf die Wörter, um die richtigen auszuwählen (
            {targetCategory}).
          </p>
          <h2>Die Übung wird so aussehen:</h2>
          <Container>
            <WordSelectionExercise
              title={title}
              targetCategory={targetCategory}
              targetWords={selectedWords}
              allWords={allWords}
              isPreviewMode={true}
              onSelectionChange={(updatedSelectedWords) =>
                setSelectedWords(updatedSelectedWords)
              }
            />
          </Container>
          <Container>
            <Button size="sm" variant="secondary" onClick={handleEditAgain}>
              Übung bearbeiten
            </Button>
            <Button size="sm" onClick={handleSaveExercise}>
              Übung speichern
            </Button>
          </Container>
          {!!error && errorMessage()}
        </div>
      )}
    </div>
  );
}
