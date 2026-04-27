"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Column, Container, Row } from "@/components/ui/layout/container";
import Editor from "@/components/ui/editor";
import { useRequest } from "@/shared/hooks/useRequest";
import useQuery from "@/shared/hooks/useQuery";
import { htmlToPlainText } from "@/shared/utils/normalizeEditorText";
import "./fillinthegap.css";

function tokenizeText(text) {
  return text
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map((raw) => {
      const match = raw.match(
        /^([^\p{L}\p{N}]*)((?:[\p{L}\p{N}][\p{L}\p{N}'-]*)?)([^\p{L}\p{N}]*)$/u
      );
      const word = match?.[2] || "";

      return {
        raw,
        word,
      };
    });
}

function createDefaultAnswers() {
  return [
    { answer: "", feedback: "", isCorrect: true },
    { answer: "", feedback: "", isCorrect: false },
  ];
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
  const [textHtml, setTextHtml] = useState("");
  const [text, setText] = useState("");
  const [selectedIndices, setSelectedIndices] = useState([]);
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

  const tokens = useMemo(() => tokenizeText(text), [text]);

  useEffect(() => {
    if (!isEditMode || !exerciseData) {
      return;
    }

    setTitle(exerciseData.title || "");
    const sourceText = exerciseData.source_text || "";
    setText(sourceText);
    setTextHtml(
      exerciseData.source_html ||
        (sourceText ? `<p>${escapeHtml(sourceText)}</p>` : "")
    );

    const mappedGaps = (exerciseData.gaps || []).map((gap) => ({
      tokenIndex: Number(gap.token_index),
      tokenText: gap.token_text || "",
      answers: (gap.answers || []).map((answer) => ({
        answer: answer.answer || "",
        feedback: answer.feedback || "",
        isCorrect: Boolean(answer.is_correct),
      })),
    }));

    setSelectedIndices(mappedGaps.map((gap) => gap.tokenIndex));
    setGaps(mappedGaps);
    setStep("configure");
  }, [exerciseData, isEditMode]);

  const handleEditorContentChange = (html) => {
    const normalizedText = htmlToPlainText(html);

    if (normalizedText === text) {
      setTextHtml(html);
      return;
    }

    setTextHtml(html);
    setText(normalizedText);
    setSelectedIndices([]);
    if (step === "configure") {
      setStep("select");
      setGaps([]);
    }
  };

  const toggleGapIndex = (index) => {
    setSelectedIndices((current) => {
      if (current.includes(index)) {
        return current.filter((item) => item !== index);
      }
      return [...current, index].sort((a, b) => a - b);
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

    const mappedGaps = selectedIndices.map((tokenIndex) => ({
      tokenIndex,
      tokenText: tokens[tokenIndex]?.word || tokens[tokenIndex]?.raw || "",
      answers: createDefaultAnswers(),
    }));

    setGaps(mappedGaps);
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
      const payload = {
        title,
        text,
        textHtml,
        gaps,
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
        <label>Übungstext</label>
        <Editor
          defaultContent={textHtml}
          updateEditorContent={handleEditorContentChange}
        />
      </Container>

      {tokens.length > 0 && step === "select" && (
        <Container className="fitg-block">
          <h3>Wörter anklicken, die als Lücken markiert werden sollen</h3>
          <p className="fitg-help-text">Ausgewählt: {selectedIndices.length}</p>
          <div className="fitg-token-grid">
            {tokens.map((token, index) => {
              if (!token.word) {
                return null;
              }

              const selected = selectedIndices.includes(index);
              return (
                <button
                  key={`${index}-${token.raw}`}
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
                <h4>
                  Lücke {gapIndex + 1}: "{gap.tokenText}"
                </h4>

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
              Zurück zur Lückenauswahl
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
