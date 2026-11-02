"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Column, Container, Row } from "@/components/ui/layout/container";
import Editor from "@/components/ui/editor";
import { useRequest } from "@/shared/hooks/useRequest";
import useQuery from "@/shared/hooks/useQuery";
import { htmlToPlainText } from "@/shared/utils/normalizeEditorText";
import { remapGapsToWords, tokenizeWords } from "@/shared/utils/gapTokens";
import AdminLastModified from "@/components/ui/admin-last-modified";
import "./fillinthegap.css";

function createDefaultAnswers() {
  return [
    { answer: "", feedback: "", isCorrect: true },
    { answer: "", feedback: "", isCorrect: false },
  ];
}

function remapGapsToTokens(existingGaps, nextTokens) {
  return remapGapsToWords(existingGaps, nextTokens).gaps;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default function CreateFillInTheGapExercisePage() {
  const router = useRouter();
  const { exercise_id } = useParams();
  const makeRequest = useRequest();
  const isEditMode = Boolean(exercise_id);

  const [title, setTitle] = useState("");
  const [instructionText, setInstructionText] = useState("");
  const [textHtml, setTextHtml] = useState("");
  const [text, setText] = useState("");
  const [step, setStep] = useState("select");
  const [gaps, setGaps] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const {
    data: exerciseData,
    isLoading: isExerciseLoading,
    error: exerciseLoadError,
  } = useQuery(`/admin/exercises/fillinthegap/${exercise_id || ""}`, null, {
    enabled: isEditMode,
  });

  const tokens = useMemo(() => tokenizeWords(text), [text]);
  const selectedIndices = useMemo(
    () => gaps.map((gap) => gap.tokenIndex),
    [gaps]
  );
  const gapsRef = useRef(gaps);
  const textRef = useRef(text);
  const hasLoadedExerciseRef = useRef(false);
  gapsRef.current = gaps;

  useEffect(() => {
    // Load once: a background refetch must not overwrite what the admin is editing.
    if (!isEditMode || !exerciseData || hasLoadedExerciseRef.current) {
      return;
    }
    hasLoadedExerciseRef.current = true;

    setTitle(exerciseData.title || "");
    setInstructionText(exerciseData.instruction_text || "");
    const sourceText = exerciseData.source_text || "";
    const html =
      exerciseData.source_html ||
      (sourceText ? `<p>${escapeHtml(sourceText)}</p>` : "");
    const plainText = htmlToPlainText(html);
    textRef.current = plainText;
    setText(plainText);
    setTextHtml(html);

    const mappedGaps = (exerciseData.gaps || []).map((gap) => ({
      tokenIndex: Number(gap.token_index),
      tokenText: gap.token_text || "",
      answers: (gap.answers || []).map((answer) => ({
        answer: answer.answer || "",
        feedback: answer.feedback || "",
        isCorrect: Boolean(answer.is_correct),
      })),
    }));

    // Exercises saved with older indexing are re-anchored to their words here.
    const healedGaps = remapGapsToTokens(mappedGaps, tokenizeWords(plainText));
    gapsRef.current = healedGaps;
    setGaps(healedGaps);
    setStep("configure");
  }, [exerciseData, isEditMode]);

  const handleEditorContentChange = (html) => {
    const normalizedText = htmlToPlainText(html);

    if (normalizedText === textRef.current) {
      setTextHtml(html);
      return;
    }

    const remappedGaps = remapGapsToTokens(
      gapsRef.current,
      tokenizeWords(normalizedText)
    );

    textRef.current = normalizedText;
    gapsRef.current = remappedGaps;
    setTextHtml(html);
    setText(normalizedText);
    setGaps(remappedGaps);
    if (step === "configure" && remappedGaps.length === 0) {
      setStep("select");
    }
  };

  const toggleGapIndex = (index) => {
    setGaps((current) => {
      if (current.some((gap) => gap.tokenIndex === index)) {
        return current.filter((gap) => gap.tokenIndex !== index);
      }

      return [
        ...current,
        {
          tokenIndex: index,
          tokenText: tokens[index]?.word || "",
          answers: createDefaultAnswers(),
        },
      ].sort((a, b) => a.tokenIndex - b.tokenIndex);
    });
  };

  const moveToGapConfiguration = () => {
    setError("");
    if (!title.trim()) {
      setError("Bitte gib einen Titel ein.");
      return;
    }
    if (!text.trim()) {
      setError("Bitte gib einen Übungstext ein.");
      return;
    }
    if (selectedIndices.length === 0) {
      setError("Bitte wähle mindestens ein Lückenwort aus.");
      return;
    }

    setStep("configure");
  };

  const updateGapAnswer = (gapIndex, answerIndex, field, value) => {
    setGaps((current) => {
      const next = [...current];
      const nextGap = { ...next[gapIndex] };
      const nextAnswers = [...nextGap.answers];
      const nextAnswer = { ...nextAnswers[answerIndex] };

      nextAnswer[field] = value;
      nextAnswers[answerIndex] = nextAnswer;
      nextGap.answers = nextAnswers;
      next[gapIndex] = nextGap;

      return next;
    });
  };

  const addAnswerOption = (gapIndex) => {
    setGaps((current) => {
      const next = [...current];
      next[gapIndex] = {
        ...next[gapIndex],
        answers: [
          ...next[gapIndex].answers,
          { answer: "", feedback: "", isCorrect: false },
        ],
      };
      return next;
    });
  };

  const removeAnswerOption = (gapIndex, answerIndex) => {
    setGaps((current) => {
      const next = [...current];
      const nextAnswers = next[gapIndex].answers.filter(
        (_, index) => index !== answerIndex
      );
      next[gapIndex] = {
        ...next[gapIndex],
        answers: nextAnswers,
      };
      return next;
    });
  };

  const removeGap = (tokenIndex) => {
    setGaps((current) =>
      current.filter((gap) => gap.tokenIndex !== tokenIndex)
    );
  };

  const validateConfiguration = () => {
    if (gaps.length === 0) {
      return "Bitte wähle mindestens eine Lücke aus.";
    }

    for (const gap of gaps) {
      const hasCorrect = gap.answers.some((answer) => answer.isCorrect);
      const hasIncorrect = gap.answers.some((answer) => !answer.isCorrect);

      if (!hasCorrect || !hasIncorrect) {
        return `Die Lücke \"${gap.tokenText}\" braucht mindestens eine richtige und eine falsche Antwort.`;
      }

      for (const answer of gap.answers) {
        if (!answer.answer.trim()) {
          return `Bitte fülle alle Antwortfelder für \"${gap.tokenText}\" aus.`;
        }
        if (!answer.feedback.trim()) {
          return `Bitte fülle alle Feedbackfelder für \"${gap.tokenText}\" aus.`;
        }
      }
    }

    return "";
  };

  const handleSave = async () => {
    const validationError = validateConfiguration();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");

    try {
      // Re-derive token_index from the current tokenization on every save so legacy
      // exercises self-heal instead of persisting stale indices from older tokenizers.
      const healedGaps = remapGapsToTokens(gaps, tokens);

      const payload = {
        title,
        instructionText,
        text,
        textHtml,
        gaps: healedGaps,
      };

      if (isEditMode) {
        await makeRequest(
          `/admin/exercises/fillinthegap/${exercise_id}`,
          payload,
          {
            method: "PUT",
          }
        );
      } else {
        await makeRequest("/admin/exercises/fillinthegap", payload);
      }

      router.push("/grammar/exercises/fillinthegap");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  if (isEditMode && isExerciseLoading) {
    return (
      <Column gap="md" className="fitg-admin-page">
        Lädt...
      </Column>
    );
  }

  if (isEditMode && exerciseLoadError) {
    return (
      <Column gap="md" className="fitg-admin-page">
        Fehler:{" "}
        {exerciseLoadError.error || exerciseLoadError.message || "Unbekannt"}
      </Column>
    );
  }

  return (
    <Column gap="md" className="fitg-admin-page">
      <h1>
        {isEditMode
          ? "Lückentext-Übung bearbeiten"
          : "Lückentext-Übung erstellen"}
      </h1>
      {isEditMode && (
        <AdminLastModified
          updatedAt={exerciseData?.last_modified_at}
          updatedBy={exerciseData?.last_modified_by}
        />
      )}

      <Container className="fitg-block">
        <label htmlFor="fitg-title">Titel</label>
        <input
          id="fitg-title"
          className="fitg-input"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Z.B. Präpositionen im Kontext"
        />
      </Container>

      <Container className="fitg-block">
        <label htmlFor="fitg-instruction">Anweisung</label>
        <input
          id="fitg-instruction"
          className="fitg-input"
          value={instructionText}
          onChange={(event) => setInstructionText(event.target.value)}
          placeholder="Optional: Hinweise für die Lernenden"
        />
      </Container>

      <Container className="fitg-block">
        <label>Übungstext</label>
        <Editor
          defaultContent={textHtml}
          updateEditorContent={handleEditorContentChange}
        />
      </Container>

      {tokens.length > 0 && (
        <Container className="fitg-block">
          <h3>
            {step === "configure"
              ? "Wörter anklicken, um Lücken hinzuzufügen/zu entfernen"
              : "Wörter anklicken, die als Lücken markiert werden sollen"}
          </h3>
          <p className="fitg-help-text">Ausgewählt: {selectedIndices.length}</p>
          <div className="fitg-token-grid">
            {tokens.map((token, index) => {
              if (!token.word) {
                return null;
              }

              const selected = selectedIndices.includes(index);
              return (
                <button
                  key={`${index}-${token.word}`}
                  type="button"
                  className={`fitg-token ${selected ? "selected" : ""}`}
                  onClick={() => toggleGapIndex(index)}
                >
                  {token.word}
                </button>
              );
            })}
          </div>
        </Container>
      )}

      {step === "configure" && (
        <Container className="fitg-block">
          <h3>Lücken konfigurieren</h3>
          <p className="fitg-help-text">
            Für jede Lücke mehrere richtige oder falsche Antworten mit Feedback
            eintragen.
          </p>

          <Column gap="lg">
            {gaps.map((gap, gapIndex) => (
              <Container
                key={`${gap.tokenIndex}-${gap.tokenText}`}
                className="fitg-gap-card"
              >
                <Row justify="space-between" align="center" wrap="wrap">
                  <h4>
                    Lücke {gapIndex + 1}: "{gap.tokenText}"
                  </h4>
                  <button
                    type="button"
                    className="fitg-gap-remove"
                    onClick={() => removeGap(gap.tokenIndex)}
                    aria-label={`Lücke ${gapIndex + 1} entfernen`}
                    title="Lücke entfernen"
                  >
                    x
                  </button>
                </Row>

                <Column gap="md">
                  {gap.answers.map((answer, answerIndex) => (
                    <Container key={answerIndex} className="fitg-answer-row">
                      <Row gap="md" align="end" wrap="wrap">
                        <Container grow={1} minW="220px">
                          <label>Antwort</label>
                          <input
                            className="fitg-input"
                            value={answer.answer}
                            onChange={(event) =>
                              updateGapAnswer(
                                gapIndex,
                                answerIndex,
                                "answer",
                                event.target.value
                              )
                            }
                          />
                        </Container>

                        <Container grow={1} minW="220px">
                          <label>Feedback</label>
                          <input
                            className="fitg-input"
                            value={answer.feedback}
                            onChange={(event) =>
                              updateGapAnswer(
                                gapIndex,
                                answerIndex,
                                "feedback",
                                event.target.value
                              )
                            }
                          />
                        </Container>

                        <Container>
                          <label>Typ</label>
                          <select
                            className="fitg-input"
                            value={answer.isCorrect ? "correct" : "wrong"}
                            onChange={(event) =>
                              updateGapAnswer(
                                gapIndex,
                                answerIndex,
                                "isCorrect",
                                event.target.value === "correct"
                              )
                            }
                          >
                            <option value="correct">Richtig</option>
                            <option value="wrong">Falsch</option>
                          </select>
                        </Container>

                        {gap.answers.length > 2 && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              removeAnswerOption(gapIndex, answerIndex)
                            }
                          >
                            Entfernen
                          </Button>
                        )}
                      </Row>
                    </Container>
                  ))}
                </Column>

                <Container mt="sm">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => addAnswerOption(gapIndex)}
                  >
                    Antwort hinzufügen
                  </Button>
                </Container>
              </Container>
            ))}
          </Column>
        </Container>
      )}

      {!!error && <Container className="fitg-error">{error}</Container>}

      <Row gap="md" wrap="wrap">
        {step === "select" && (
          <Button type="button" onClick={moveToGapConfiguration}>
            Lücken konfigurieren
          </Button>
        )}

        {step === "configure" && (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep("select")}
            >
              Wörter auswählen/ändern
            </Button>
            <Button type="button" onClick={handleSave} disabled={saving}>
              {saving
                ? "Speichern..."
                : isEditMode
                  ? "Änderungen speichern"
                  : "Übung speichern"}
            </Button>
          </>
        )}
      </Row>
    </Column>
  );
}
