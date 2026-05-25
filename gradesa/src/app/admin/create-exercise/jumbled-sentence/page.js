"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Column, Row } from "@/components/ui/layout/container";
import { jumbledSentenceExerciseSchema } from "@/shared/schemas/jumbled-sentence.schemas";
import { withBasePath } from "@/shared/utils/basePath";
import useQuery from "@/shared/hooks/useQuery";
import styles from "./jumbled-sentence.module.css";

function toWordPerLine(value) {
  if (typeof value !== "string") return "";
  return value.trim().split(/\s+/).filter(Boolean).join("\n");
}

export default function CreateJumbledSentenceExercise() {
  const router = useRouter();
  const { exercise_id } = useParams();
  const isEditMode = Boolean(exercise_id);
  const [title, setTitle] = useState("");
  const [sentences, setSentences] = useState([
    {
      sentence: "",
      alternates: [""],
      alternateFeedbacks: [""],
      correctSentenceFeedback: "",
      incorrectAlternates: [""],
      incorrectFeedbacks: [""],
    },
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
            sentence: toWordPerLine(item.sentence || ""),
            alternates:
              item.alternates && item.alternates.length > 0
                ? item.alternates
                : [""],
            alternateFeedbacks:
              item.alternateFeedbacks &&
              item.alternateFeedbacks.length === item.alternates?.length
                ? item.alternateFeedbacks
                : new Array(
                    item.alternates && item.alternates.length > 0
                      ? item.alternates.length
                      : 1
                  ).fill(""),
            correctSentenceFeedback: item.correctSentenceFeedback || "",
            incorrectAlternates:
              item.incorrectAlternates && item.incorrectAlternates.length > 0
                ? item.incorrectAlternates
                : [""],
            incorrectFeedbacks:
              item.incorrectFeedbacks &&
              item.incorrectFeedbacks.length ===
                (item.incorrectAlternates?.length || 0)
                ? item.incorrectFeedbacks
                : new Array(
                    item.incorrectAlternates &&
                    item.incorrectAlternates.length > 0
                      ? item.incorrectAlternates.length
                      : 1
                  ).fill(""),
          }))
        : [
            {
              sentence: "",
              alternates: [""],
              alternateFeedbacks: [""],
              correctSentenceFeedback: "",
              incorrectAlternates: [""],
              incorrectFeedbacks: [""],
            },
          ]
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

  const handleAlternateFeedbackChange = (idx, altIdx, value) => {
    const updated = [...sentences];
    updated[idx].alternateFeedbacks[altIdx] = value;
    setSentences(updated);
  };

  const handleCorrectFeedbackChange = (idx, value) => {
    const updated = [...sentences];
    updated[idx].correctSentenceFeedback = value;
    setSentences(updated);
  };

  const handleIncorrectFeedbackChange = (idx, fbIdx, value) => {
    const updated = [...sentences];
    updated[idx].incorrectFeedbacks[fbIdx] = value;
    setSentences(updated);
  };

  const handleIncorrectAlternateChange = (idx, altIdx, value) => {
    const updated = [...sentences];
    updated[idx].incorrectAlternates[altIdx] = value;
    setSentences(updated);
  };

  const addSentence = () => {
    setSentences([
      ...sentences,
      {
        sentence: "",
        alternates: [""],
        alternateFeedbacks: [""],
        correctSentenceFeedback: "",
        incorrectAlternates: [""],
        incorrectFeedbacks: [""],
      },
    ]);
  };

  const addAlternate = (idx) => {
    const updated = [...sentences];
    updated[idx].alternates.push("");
    updated[idx].alternateFeedbacks.push("");
    setSentences(updated);
  };

  const addIncorrectFeedback = (idx) => {
    const updated = [...sentences];
    updated[idx].incorrectAlternates.push("");
    updated[idx].incorrectFeedbacks.push("");
    setSentences(updated);
  };

  const addIncorrectAlternate = (idx) => {
    const updated = [...sentences];
    updated[idx].incorrectAlternates.push("");
    updated[idx].incorrectFeedbacks.push("");
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
    updated[idx].alternateFeedbacks = updated[idx].alternateFeedbacks.filter(
      (_, i) => i !== altIdx
    );
    if (updated[idx].alternates.length === 0) {
      updated[idx].alternates = [""];
      updated[idx].alternateFeedbacks = [""];
    }
    setSentences(updated);
  };

  const removeIncorrectAlternate = (idx, altIdx) => {
    const updated = [...sentences];
    updated[idx].incorrectAlternates = updated[idx].incorrectAlternates.filter(
      (_, i) => i !== altIdx
    );
    updated[idx].incorrectFeedbacks = updated[idx].incorrectFeedbacks.filter(
      (_, i) => i !== altIdx
    );
    if (updated[idx].incorrectAlternates.length === 0) {
      updated[idx].incorrectAlternates = [""];
      updated[idx].incorrectFeedbacks = [""];
    }
    setSentences(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const normalizedSentences = sentences.map((item) => ({
      ...item,
      sentence: toWordPerLine(item.sentence),
      alternates: item.alternates
        .map((alt, index) => ({
          alt: typeof alt === "string" ? alt.trim() : "",
          feedback:
            typeof item.alternateFeedbacks?.[index] === "string"
              ? item.alternateFeedbacks[index].trim()
              : "",
        }))
        .filter((entry) => entry.alt.length > 0)
        .map((entry) => entry.alt),
      alternateFeedbacks: item.alternates
        .map((alt, index) => ({
          alt: typeof alt === "string" ? alt.trim() : "",
          feedback:
            typeof item.alternateFeedbacks?.[index] === "string"
              ? item.alternateFeedbacks[index].trim()
              : "",
        }))
        .filter((entry) => entry.alt.length > 0)
        .map((entry) => entry.feedback),
      correctSentenceFeedback:
        typeof item.correctSentenceFeedback === "string"
          ? item.correctSentenceFeedback.trim()
          : "",
      incorrectAlternates: (item.incorrectAlternates || [])
        .map((alt, index) => ({
          alt: typeof alt === "string" ? alt.trim() : "",
          feedback:
            typeof item.incorrectFeedbacks?.[index] === "string"
              ? item.incorrectFeedbacks[index].trim()
              : "",
        }))
        .filter((entry) => entry.alt.length > 0)
        .map((entry) => entry.alt),
      incorrectFeedbacks: (item.incorrectAlternates || [])
        .map((alt, index) => ({
          alt: typeof alt === "string" ? alt.trim() : "",
          feedback:
            typeof item.incorrectFeedbacks?.[index] === "string"
              ? item.incorrectFeedbacks[index].trim()
              : "",
        }))
        .filter((entry) => entry.alt.length > 0)
        .map((entry) => entry.feedback),
    }));

    const parsed = jumbledSentenceExerciseSchema.safeParse({
      title,
      sentences: normalizedSentences,
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
        body: JSON.stringify({ title, sentences: normalizedSentences }),
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
          {isEditMode ? "Satzmix-Übung bearbeiten" : "Satzmix-Übung erstellen"}
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
          Geben Sie den Satz in der richtigen Reihenfolge und optional in
          alternativen Reihenfolgen <br></br> mit denselben Elementen ein. Die
          Elemente werden den Lernenden anschließend in zufälliger <br></br>
          Reihenfolge angezeigt.
        </p>
        {sentences.map((s, idx) => (
          <div key={idx} className={styles.sentenceCard}>
            <label className={styles.fieldLabel}>
              Satz (korrekt):
              <span className={styles.sentenceHint}>
                Schreiben Sie jedes Element in eine neue Zeile.
              </span>
              <textarea
                value={s.sentence}
                onChange={(e) => handleSentenceChange(idx, e.target.value)}
                className={`${styles.fieldInput} ${styles.sentenceTextarea}`}
                rows={6}
                placeholder={"Ich\nlerne\njeden\nTag\nDeutsch"}
                required
              />
            </label>
            <label className={styles.fieldLabel}>
              Feedback für korrekten Satz (optional):
              <input
                value={s.correctSentenceFeedback}
                onChange={(e) =>
                  handleCorrectFeedbackChange(idx, e.target.value)
                }
                className={styles.fieldInput}
                placeholder="Sehr gut!"
              />
            </label>
            <div>
              <div className={styles.sectionTitle}>Alternativ-Sätze:</div>
              {s.alternates.map((alt, altIdx) => (
                <div key={altIdx} className={styles.alternateGroup}>
                  <div className={styles.alternateRow}>
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
                  <input
                    value={s.alternateFeedbacks[altIdx] || ""}
                    onChange={(e) =>
                      handleAlternateFeedbackChange(idx, altIdx, e.target.value)
                    }
                    className={styles.fieldInput}
                    placeholder="Feedback für diese Alternative (optional)"
                  />
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
                  className={styles.fitContentButton}
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
            <div className={styles.feedbackSection}>
              <div className={styles.sectionTitle}>
                Alternativ-Sätze (Falsche):
              </div>
              {s.incorrectAlternates.map((alt, altIdx) => (
                <div key={altIdx} className={styles.alternateGroup}>
                  <div className={styles.alternateRowNoGapTop}>
                    <input
                      value={alt}
                      onChange={(e) =>
                        handleIncorrectAlternateChange(
                          idx,
                          altIdx,
                          e.target.value
                        )
                      }
                      className={`${styles.fieldInput} ${styles.alternateInput}`}
                      placeholder="Falsche Alternative (optional)"
                    />
                    <Button
                      type="button"
                      onClick={() => removeIncorrectAlternate(idx, altIdx)}
                      disabled={s.incorrectAlternates.length === 1}
                      variant="none"
                      width="fit"
                      className={styles.alternateDeleteButton}
                      style={{ color: "#c62828" }}
                      aria-label="Falsche Alternative entfernen"
                    >
                      X
                    </Button>
                  </div>
                  <input
                    value={s.incorrectFeedbacks[altIdx] || ""}
                    onChange={(e) =>
                      handleIncorrectFeedbackChange(idx, altIdx, e.target.value)
                    }
                    className={styles.fieldInput}
                    placeholder="Feedback für diese falsche Alternative (optional)"
                  />
                </div>
              ))}
              <Button
                type="button"
                onClick={() => addIncorrectAlternate(idx)}
                className={styles.fitContentButton}
              >
                Alternative hinzufügen (Falsche)
              </Button>
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
