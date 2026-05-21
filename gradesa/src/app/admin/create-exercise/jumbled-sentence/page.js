"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Column, Row } from "@/components/ui/layout/container";
import { jumbledSentenceExerciseSchema } from "@/shared/schemas/jumbled-sentence.schemas";
import { withBasePath } from "@/shared/utils/basePath";
import useQuery from "@/shared/hooks/useQuery";
import styles from "./jumbled-sentence.module.css";

export default function CreateJumbledSentenceExercise() {
  const router = useRouter();
  const { exercise_id } = useParams();
  const isEditMode = Boolean(exercise_id);
  const [title, setTitle] = useState("");
  const [sentences, setSentences] = useState([
    { sentence: "", alternates: [""] },
  ]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data,
    isLoading,
    error: loadError,
  } = useQuery(`/admin/exercises/jumbled-sentence/${exercise_id || ""}`, null, {
    enabled: isEditMode,
  });

  useEffect(() => {
    if (!isEditMode || !data?.exercise) {
      return;
    }

    const loadedExercise = data.exercise;
    setTitle(loadedExercise.title || "");
    setSentences(
      (loadedExercise.sentences || []).length
        ? loadedExercise.sentences.map((item) => ({
            sentence: item.sentence || "",
            alternates:
              item.alternates && item.alternates.length > 0
                ? item.alternates
                : [""],
          }))
        : [{ sentence: "", alternates: [""] }]
    );
  }, [isEditMode, data]);

  const handleSentenceChange = (idx, value) => {
    const updated = [...sentences];
    updated[idx].sentence = value;
    setSentences(updated);
  };

  const handleAlternateChange = (idx, altIdx, value) => {
    const updated = [...sentences];
    updated[idx].alternates[altIdx] = value;
    setSentences(updated);
  };

  const addSentence = () => {
    setSentences([...sentences, { sentence: "", alternates: [""] }]);
  };

  const addAlternate = (idx) => {
    const updated = [...sentences];
    updated[idx].alternates.push("");
    setSentences(updated);
  };

  const removeSentence = (idx) => {
    setSentences(sentences.filter((_, i) => i !== idx));
  };

  const removeAlternate = (idx, altIdx) => {
    const updated = [...sentences];
    updated[idx].alternates = updated[idx].alternates.filter(
      (_, i) => i !== altIdx
    );
    setSentences(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const parsed = jumbledSentenceExerciseSchema.safeParse({
      title,
      sentences,
    });
    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ||
          "Bitte alle Felder korrekt ausfüllen."
      );
      return;
    }
    setIsSubmitting(true);
    try {
      const endpoint = isEditMode
        ? withBasePath(`/api/admin/exercises/jumbled-sentence/${exercise_id}`)
        : withBasePath("/api/admin/exercises/jumbled-sentence");

      const res = await fetch(endpoint, {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, sentences }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Fehler beim Speichern.");
      router.push(
        isEditMode
          ? "/grammar/exercises/jumbled-sentence"
          : `/grammar/exercises/jumbled-sentence/${data.id}`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditMode && isLoading) {
    return <div>Lädt...</div>;
  }

  if (isEditMode && loadError) {
    return <div>Fehler: {loadError.message || "Etwas ist schiefgelaufen"}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Column gap="md">
        <h2>
          {isEditMode
            ? "Jumbled Sentence Übung bearbeiten"
            : "Jumbled Sentence Übung erstellen"}
        </h2>
        <label className={styles.fieldLabel}>
          Titel:
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.fieldInput}
            required
          />
        </label>
        <p className={styles.exerciseDescription}>
          Trage den Satz in der richtigen Reihenfolge ein und optional
          alternative Reihenfolgen mit <br></br> denselben Wörtern. Für die
          Lernenden werden die Wörter anschließend gemischt angezeigt.
        </p>
        {sentences.map((s, idx) => (
          <div key={idx} className={styles.sentenceCard}>
            <label className={styles.fieldLabel}>
              Satz (korrekt):
              <input
                value={s.sentence}
                onChange={(e) => handleSentenceChange(idx, e.target.value)}
                className={styles.fieldInput}
                required
              />
            </label>
            <div>
              Alternativ-Sätze:
              {s.alternates.map((alt, altIdx) => (
                <div key={altIdx} className={styles.alternateRow}>
                  <input
                    value={alt}
                    onChange={(e) =>
                      handleAlternateChange(idx, altIdx, e.target.value)
                    }
                    className={`${styles.fieldInput} ${styles.alternateInput}`}
                  />
                  <Button
                    type="button"
                    onClick={() => removeAlternate(idx, altIdx)}
                    disabled={s.alternates.length === 1}
                    variant="none"
                    width="fit"
                    className={styles.alternateDeleteButton}
                    style={{ color: "#c62828" }}
                    aria-label="Alternative entfernen"
                  >
                    X
                  </Button>
                </div>
              ))}
              <Row
                justify="space-between"
                align="center"
                className={styles.inlineActionsRow}
              >
                <Button
                  type="button"
                  onClick={() => addAlternate(idx)}
                  className={styles.addAlternateButton}
                >
                  Alternative hinzufügen
                </Button>
                <Button
                  type="button"
                  onClick={() => removeSentence(idx)}
                  disabled={sentences.length === 1}
                  className={styles.removeSentenceButton}
                  style={{
                    backgroundColor: "#f8d7da",
                    borderColor: "#f5c2c7",
                    color: "#842029",
                  }}
                >
                  Satz entfernen
                </Button>
              </Row>
            </div>
          </div>
        ))}
        {error && <div className={styles.errorText}>{error}</div>}
        <Row
          justify="space-between"
          align="center"
          className={styles.inlineActionsRow}
        >
          <Button type="button" onClick={addSentence}>
            Satz hinzufügen
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className={styles.saveButton}
            style={{
              backgroundColor: "#d1e7dd",
              borderColor: "#badbcc",
              color: "#0f5132",
            }}
          >
            {isSubmitting ? "Speichern..." : "Speichern"}
          </Button>
        </Row>
      </Column>
    </form>
  );
}
