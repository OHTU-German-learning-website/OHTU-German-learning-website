"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRequest } from "@/shared/hooks/useRequest";
import { Container } from "@/components/ui/layout/container";
import { Column } from "@/components/ui/layout/container";
import { Button } from "@/components/ui/button";
import useQuery from "@/shared/hooks/useQuery";
import "./click.css";
import WordSelectionExercise from "@/components/ui/click/click.js";
import Editor from "@/components/ui/editor";
import { htmlToPlainText } from "@/shared/utils/normalizeEditorText";

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default function CreateExercise() {
  const router = useRouter();
  const { click_id } = useParams();
  const isEditMode = Boolean(click_id);

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [targetCategory, setTargetCategory] = useState("");
  const [allWordsHtml, setAllWordsHtml] = useState("");
  const [allWordsText, setAllWordsText] = useState("");
  const [selectedWords, setSelectedWords] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const makeRequest = useRequest();

  const {
    data: exerciseData,
    isLoading: isExerciseLoading,
    error: exerciseError,
  } = useQuery(`/admin/exercises/click/${click_id || ""}`, null, {
    enabled: isEditMode,
  });

  useEffect(() => {
    if (!isEditMode || !exerciseData) return;

    const storedWords = Array.isArray(exerciseData.all_words)
      ? exerciseData.all_words
      : [];

    const hasExplicitSpacing = storedWords.some(
      (token) => token === "\n" || /^[^\S\n]+$/u.test(token)
    );

    const text = hasExplicitSpacing
      ? storedWords.join("")
      : storedWords.join(" ");
    const sourceHtml =
      typeof exerciseData.source_html === "string"
        ? exerciseData.source_html
        : text
          ? `<p>${escapeHtml(text)}</p>`
          : "";

    setTitle(exerciseData.title || "");
    setTargetCategory(exerciseData.category || "");
    setAllWordsHtml(sourceHtml);
    setAllWordsText(text);
    setSelectedWords(
      Array.isArray(exerciseData.target_words) ? exerciseData.target_words : []
    );
  }, [exerciseData, isEditMode]);

  const handleEditorContentChange = (html) => {
    setAllWordsHtml(html);
    setAllWordsText(htmlToPlainText(html));
  };

  // Preserve user-entered spacing and line breaks so preview and saved exercise match.
  const allWords =
    allWordsText.replace(/\r\n/g, "\n").match(/[^\S\n]+|\n|[^\s]+/g) ?? [];

  const handlePreview = (e) => {
    e.preventDefault();
    setPreviewMode(true);
  };

  const handleSaveExercise = async () => {
    try {
      if (isEditMode) {
        const response = await fetch(`/api/admin/exercises/click/${click_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            targetCategory,
            targetWords: selectedWords,
            allWords,
            sourceHtml: allWordsHtml,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Fehler beim Speichern der Übung.");
        }
      } else {
        const response = await makeRequest("/admin/exercises/click", {
          title,
          targetCategory,
          targetWords: selectedWords,
          allWords,
          sourceHtml: allWordsHtml,
        });

        setSubmitted(true);
        setTimeout(() => {
          router.push(`/grammar/exercises/click/${response.data.id}`);
        }, 2000);
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        router.push(`/grammar/exercises/click/${click_id}`);
      }, 2000);
    } catch (error) {
      setError(error.message);
      setSubmitted(false);
    }
  };

  const successMessage = () => {
    return (
      <div className="success-message">
        <p>
          {isEditMode
            ? "Übung erfolgreich aktualisiert."
            : "Übung erfolgreich erstellt."}
        </p>
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

  if (isEditMode && isExerciseLoading) {
    return <div>Übung wird geladen...</div>;
  }

  if (isEditMode && exerciseError) {
    return <div>{exerciseError.message || "Fehler beim Laden der Übung."}</div>;
  }

  return (
    <div className="click-admin-page">
      <h1>
        {isEditMode
          ? "Wortauswahl-Übung bearbeiten"
          : "Wortauswahl-Übung erstellen"}
      </h1>
      {submitted ? (
        successMessage() // Show only the success message if submitted
      ) : !previewMode ? (
        <form onSubmit={handlePreview} className="click-form">
          <Column gap="md">
            <Container className="exercise-click click-block">
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

            <Container className="exercise-click click-block">
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

            <Container className="exercise-click click-block">
              <label>Übungstext</label>
              <Editor
                key="click-editor"
                defaultContent={allWordsHtml}
                updateEditorContent={handleEditorContentChange}
              />
            </Container>
          </Column>
          <Container className="click-form-actions">
            <Button size="md" type="submit">
              Zielwörter auswählen
            </Button>
          </Container>
        </form>
      ) : (
        <div>
          <p>
            Klicken Sie auf die Wörter, um die richtigen auszuwählen (
            {targetCategory}).
          </p>
          <br />
          <br />
          <h2>Die Übung wird so aussehen:</h2>
          <Container>
            <WordSelectionExercise
              title={title}
              targetCategory={targetCategory}
              targetWords={selectedWords}
              allWords={allWords}
              sourceHtml={allWordsHtml}
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
