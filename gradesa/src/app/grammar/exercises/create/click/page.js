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
      const response = await makeRequest("/exercises/create/click", {
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
      <h1>Create Word Selection Exercise</h1>
      {submitted ? (
        successMessage() // Show only the success message if submitted
      ) : !previewMode ? (
        <form onSubmit={handlePreview}>
          <Column gap="md">
            <Container className="exercise-click">
              <label>Exercise Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., Identifying Verbs"
                required
              />
            </Container>

            <Container className="exercise-click">
              <label>Target Category</label>
              <input
                type="text"
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value)}
                placeholder="E.g., verbs, nouns, adjectives, etc."
                required
              />
            </Container>

            <Container className="exercise-click">
              <label>The whole text</label>
              <textarea
                value={allWordsText}
                onChange={(e) => setAllWordsText(e.target.value)}
                placeholder="Enter all words separated by commas (e.g., run, jump, swim, table, happy, quickly)"
                rows={4}
                required
              />
            </Container>
          </Column>
          <Button size="sm" type="submit">
            Select Target Words
          </Button>
        </form>
      ) : (
        <div>
          <p>
            Click on the words to select the correct ones ({targetCategory}).
          </p>
          <h2>The exercise will look like this:</h2>
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
              Edit Exercise
            </Button>
            <Button size="sm" onClick={handleSaveExercise}>
              Save Exercise
            </Button>
          </Container>
          {!!error && errorMessage()}
        </div>
      )}
    </div>
  );
}
