"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Column, Row } from "@/components/ui/layout/container";
import AdminVisibleLastModified from "@/components/ui/admin-visible-last-modified";
import { withBasePath } from "@/shared/utils/basePath";

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function JumbledSentenceExercisePage() {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [bankWords, setBankWords] = useState([]);
  const [answerWords, setAnswerWords] = useState([]);
  const [sentenceResults, setSentenceResults] = useState([]);
  const [sentenceFeedbacks, setSentenceFeedbacks] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);

  const stripIgnoredPunctuation = (token) =>
    token.replace(/[\p{P}]/gu, (character) =>
      character === "'" || character === "’" ? character : ""
    );

  const cleanTokenForComparison = (token) =>
    stripIgnoredPunctuation(token).toLowerCase();

  const splitElements = (value) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) return [];

    if (trimmedValue.includes("\n")) {
      return trimmedValue
        .split(/\r?\n/)
        .map((element) => element.trim())
        .filter(Boolean);
    }

    return trimmedValue.split(/\s+/).filter(Boolean);
  };

  const tokenizeSentenceForDisplay = (value) =>
    splitElements(value).map(stripIgnoredPunctuation).filter(Boolean);

  const normalizeSentence = (value) =>
    tokenizeSentenceForDisplay(value)
      .map(cleanTokenForComparison)
      .filter(Boolean)
      .join(" ");

  const initializeExerciseState = (exerciseData) => {
    const sentenceTokenSets = (exerciseData?.sentences || []).map(
      (sentence) => {
        const tokens = tokenizeSentenceForDisplay(sentence.sentence).map(
          (text, index) => ({
            id: `${index}-${text}`,
            text,
          })
        );
        return shuffle(tokens);
      }
    );

    setBankWords(sentenceTokenSets);
    setAnswerWords(
      sentenceTokenSets.map((tokens) => Array(tokens.length).fill(null))
    );
    setSentenceResults(sentenceTokenSets.map(() => null));
    setSentenceFeedbacks(sentenceTokenSets.map(() => ""));
    setFeedback("");
  };

  const clearSentenceResult = (sentenceIdx) => {
    setSentenceResults((prev) => {
      if (!prev.length || prev[sentenceIdx] === null) return prev;
      const next = [...prev];
      next[sentenceIdx] = null;
      return next;
    });

    setSentenceFeedbacks((prev) => {
      if (!prev.length || !prev[sentenceIdx]) return prev;
      const next = [...prev];
      next[sentenceIdx] = "";
      return next;
    });
  };

  useEffect(() => {
    async function fetchExercise() {
      setLoading(true);
      const res = await fetch(
        withBasePath(`/api/exercises/jumbled-sentence/${id}`)
      );
      const data = await res.json();
      setExercise(data.exercise || null);
      initializeExerciseState(data.exercise);
      setLoading(false);
    }
    fetchExercise();
  }, [id]);

  const moveTokenToSlot = (sentenceIdx, sourceType, sourceIndex, slotIndex) => {
    if (answerWords[sentenceIdx]?.[slotIndex]) {
      return;
    }

    const nextBankWords = bankWords.map((words) => [...words]);
    const nextAnswerWords = answerWords.map((slots) => [...slots]);

    let token = null;

    if (sourceType === "bank") {
      token = nextBankWords[sentenceIdx][sourceIndex];
      if (!token) return;
      nextBankWords[sentenceIdx].splice(sourceIndex, 1);
    } else {
      token = nextAnswerWords[sentenceIdx][sourceIndex];
      if (!token) return;
      nextAnswerWords[sentenceIdx][sourceIndex] = null;
    }

    nextAnswerWords[sentenceIdx][slotIndex] = token;
    setBankWords(nextBankWords);
    setAnswerWords(nextAnswerWords);
    clearSentenceResult(sentenceIdx);
    setFeedback("");
  };

  const moveTokenBackToBank = (sentenceIdx, slotIndex) => {
    const nextBankWords = bankWords.map((words) => [...words]);
    const nextAnswerWords = answerWords.map((slots) => [...slots]);
    const token = nextAnswerWords[sentenceIdx][slotIndex];

    if (!token) return;

    nextAnswerWords[sentenceIdx][slotIndex] = null;
    nextBankWords[sentenceIdx].push(token);

    setBankWords(nextBankWords);
    setAnswerWords(nextAnswerWords);
    clearSentenceResult(sentenceIdx);
    setFeedback("");
  };

  const handleDragStart = (event, sentenceIdx, sourceType, sourceIndex) => {
    event.dataTransfer.setData(
      "application/json",
      JSON.stringify({ sentenceIdx, sourceType, sourceIndex })
    );
  };

  const handleDropOnSlot = (event, sentenceIdx, slotIndex) => {
    event.preventDefault();
    const payload = event.dataTransfer.getData("application/json");
    if (!payload) return;

    const dragged = JSON.parse(payload);
    if (dragged.sentenceIdx !== sentenceIdx) return;

    moveTokenToSlot(
      sentenceIdx,
      dragged.sourceType,
      dragged.sourceIndex,
      slotIndex
    );
  };

  const handleDropOnBank = (event, sentenceIdx) => {
    event.preventDefault();
    const payload = event.dataTransfer.getData("application/json");
    if (!payload) return;

    const dragged = JSON.parse(payload);
    if (
      dragged.sentenceIdx !== sentenceIdx ||
      dragged.sourceType !== "answer"
    ) {
      return;
    }

    moveTokenBackToBank(sentenceIdx, dragged.sourceIndex);
  };

  const handleTokenClick = (sentenceIdx, sourceType, index) => {
    if (sourceType === "answer") {
      moveTokenBackToBank(sentenceIdx, index);
      return;
    }

    const firstEmptySlot = answerWords[sentenceIdx].findIndex(
      (slot) => slot === null
    );
    if (firstEmptySlot === -1) return;

    moveTokenToSlot(sentenceIdx, "bank", index, firstEmptySlot);
  };

  const resetExercise = () => {
    initializeExerciseState(exercise);
  };

  const checkAnswers = () => {
    if (!exercise) return;
    const evaluation = exercise.sentences.map((sentence, sentenceIdx) => {
      if (answerWords[sentenceIdx].some((slot) => slot === null)) {
        return {
          isCorrect: false,
          feedbackText: "",
        };
      }

      const normalizedMainSentence = normalizeSentence(sentence.sentence);
      const normalizedAlternates = (sentence.alternates || []).map((value) =>
        normalizeSentence(value)
      );
      const normalizedAlternateFeedbacks = sentence.alternateFeedbacks || [];
      const normalizedIncorrectAlternates = (
        sentence.incorrectAlternates || []
      ).map((value) => normalizeSentence(value));
      const normalizedIncorrectFeedbacks = sentence.incorrectFeedbacks || [];

      const userAnswer = normalizeSentence(
        answerWords[sentenceIdx].map((token) => token?.text || "").join(" ")
      );

      if (userAnswer === normalizedMainSentence) {
        return {
          isCorrect: true,
          feedbackText: sentence.correctSentenceFeedback || "",
        };
      }

      const alternateIndex = normalizedAlternates.findIndex(
        (candidate) => candidate === userAnswer
      );

      if (alternateIndex !== -1) {
        return {
          isCorrect: true,
          feedbackText: normalizedAlternateFeedbacks[alternateIndex] || "",
        };
      }

      const incorrectAlternateIndex = normalizedIncorrectAlternates.findIndex(
        (candidate) => candidate === userAnswer
      );

      if (incorrectAlternateIndex !== -1) {
        return {
          isCorrect: false,
          feedbackText:
            normalizedIncorrectFeedbacks[incorrectAlternateIndex] || "",
        };
      }

      return {
        isCorrect: false,
        feedbackText: "",
      };
    });

    const results = evaluation.map((entry) => entry.isCorrect);
    const perSentenceFeedbacks = evaluation.map((entry) => entry.feedbackText);

    setSentenceResults(results);
    setSentenceFeedbacks(perSentenceFeedbacks);

    const allCorrect = results.every(Boolean);

    setFeedback(allCorrect ? "Alle Sätze sind richtig." : "");
  };

  if (loading) return <div>Lädt...</div>;
  if (!exercise) return <div>Übung nicht gefunden.</div>;

  return (
    <Column gap="lg">
      <h2>{exercise.title}</h2>
      <AdminVisibleLastModified
        endpoint={`/admin/exercises/jumbled-sentence/${id}`}
      />

      {exercise.sentences.map((_, sentenceIdx) => (
        <Column
          key={sentenceIdx}
          gap="sm"
          style={{ marginBottom: "var(--u-lg)" }}
        >
          <Row align="center" gap="sm">
            <div>Ordnen Sie die Elemente richtig an:</div>
            {sentenceResults[sentenceIdx] === true && (
              <span style={{ color: "#1f9d55", fontWeight: 700 }}>Richtig</span>
            )}
            {sentenceResults[sentenceIdx] === false && (
              <span style={{ color: "#d64545", fontWeight: 700 }}>Falsch</span>
            )}
          </Row>

          {sentenceFeedbacks[sentenceIdx] && (
            <div
              style={{
                color:
                  sentenceResults[sentenceIdx] === true ? "#1f9d55" : "#d64545",
                fontWeight: 600,
              }}
            >
              {sentenceFeedbacks[sentenceIdx]}
            </div>
          )}

          <Row
            gap="sm"
            style={{
              flexWrap: "wrap",
              minHeight: 52,
              padding: "var(--u-sm)",
              border: "1px dashed var(--fg4)",
              borderRadius: "var(--radius-md)",
              color: "var(--fg1)",
            }}
            onDrop={(event) => handleDropOnBank(event, sentenceIdx)}
            onDragOver={(event) => event.preventDefault()}
          >
            {bankWords[sentenceIdx]?.map((token, tokenIndex) => (
              <button
                key={token.id}
                type="button"
                draggable
                onDragStart={(event) =>
                  handleDragStart(event, sentenceIdx, "bank", tokenIndex)
                }
                onClick={() =>
                  handleTokenClick(sentenceIdx, "bank", tokenIndex)
                }
                style={{
                  padding: "8px 12px",
                  border: "1px solid var(--fg4)",
                  borderRadius: 8,
                  background: "var(--bg2)",
                  color: "var(--fg1)",
                  cursor: "grab",
                }}
              >
                {token.text}
              </button>
            ))}
          </Row>

          <Row gap="sm" style={{ flexWrap: "wrap" }}>
            {answerWords[sentenceIdx]?.map((token, slotIndex) => (
              <div
                key={`${sentenceIdx}-slot-${slotIndex}`}
                onDrop={(event) =>
                  handleDropOnSlot(event, sentenceIdx, slotIndex)
                }
                onDragOver={(event) => event.preventDefault()}
                style={{
                  minWidth: 110,
                  minHeight: 42,
                  padding: "6px",
                  border: "1px solid var(--fg4)",
                  borderRadius: 8,
                  background: token ? "var(--bg2)" : "var(--bg1)",
                  color: "var(--fg1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {token ? (
                  <button
                    type="button"
                    draggable
                    onDragStart={(event) =>
                      handleDragStart(event, sentenceIdx, "answer", slotIndex)
                    }
                    onClick={() =>
                      handleTokenClick(sentenceIdx, "answer", slotIndex)
                    }
                    style={{
                      padding: "6px 10px",
                      border: "1px solid var(--fg4)",
                      borderRadius: 8,
                      background: "var(--bg2)",
                      color: "var(--fg1)",
                      cursor: "grab",
                    }}
                  >
                    {token.text}
                  </button>
                ) : (
                  <span style={{ color: "var(--fg4)", fontSize: "0.9rem" }}>
                    Leer
                  </span>
                )}
              </div>
            ))}
          </Row>
        </Column>
      ))}

      <Row gap="sm">
        <Button onClick={checkAnswers}>Antwort prüfen</Button>
        <Button variant="secondary" onClick={resetExercise}>
          Neu mischen
        </Button>
      </Row>

      {feedback && <div style={{ color: "#1f9d55" }}>{feedback}</div>}
    </Column>
  );
}
