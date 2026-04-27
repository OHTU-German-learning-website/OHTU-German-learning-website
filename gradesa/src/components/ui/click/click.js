import React, { useMemo, useState } from "react";
import { Button } from "../button";
import { Container } from "../layout/container";
import { Column } from "@/components/ui/layout/container";
import "./click.css";

const WORD_REGEX = /\p{L}+(?:['’-]\p{L}+)*/gu;

// Split one raw token into parts. All word parts become clickable, punctuation/text does not.
const splitTokenToParts = (token) => {
  const matches = [...token.matchAll(WORD_REGEX)];
  if (matches.length === 0) {
    return [{ type: "text", value: token }];
  }

  const parts = [];
  let cursor = 0;

  matches.forEach((match) => {
    const start = match.index;
    const word = match[0];
    const end = start + word.length;

    if (start > cursor) {
      parts.push({ type: "text", value: token.slice(cursor, start) });
    }

    parts.push({ type: "word", value: word });
    cursor = end;
  });

  if (cursor < token.length) {
    parts.push({ type: "text", value: token.slice(cursor) });
  }

  return parts;
};

const isWhitespaceToken = (token) => /^[^\S\n]+$/u.test(token);

const WordSelectionExercise = ({
  title,
  targetCategory,
  targetWords,
  allWords,
  previousAnswers,
  onSelectionChange,
  onSubmit,
  isPreviewMode = false,
  isSubmitted,
  setIsSubmitted,
  feedback,
}) => {
  // Track selected word segments so each occurrence is independent,
  // even when one token contains multiple words.
  const [selectedSlotKeys, setSelectedSlotKeys] = useState([]);
  const [message, setMessage] = useState("");

  const wordSlots = useMemo(() => {
    const slots = [];

    allWords?.forEach((token, tokenIndex) => {
      if (token === "\n" || isWhitespaceToken(token)) return;

      const parts = splitTokenToParts(token);
      parts.forEach((part, partIndex) => {
        if (part.type !== "word") return;

        slots.push({
          slotKey: `${tokenIndex}-${partIndex}`,
          word: part.value,
        });
      });
    });

    return slots;
  }, [allWords]);

  const slotToWord = useMemo(
    () => Object.fromEntries(wordSlots.map(({ slotKey, word }) => [slotKey, word])),
    [wordSlots]
  );

  const handleWordClick = (slotKey) => {
    if (isSubmitted && !isPreviewMode) return;

    let updatedKeys;
    if (selectedSlotKeys.includes(slotKey)) {
      updatedKeys = selectedSlotKeys.filter((key) => key !== slotKey);
    } else {
      updatedKeys = [...selectedSlotKeys, slotKey];
    }

    setSelectedSlotKeys(updatedKeys);

    if (isPreviewMode && onSelectionChange) {
      onSelectionChange(updatedKeys.map((key) => slotToWord[key]).filter(Boolean));
    }
  };

  const checkAnswers = () => {
    if (isPreviewMode) return;

    const selectedWordValues = selectedSlotKeys
      .map((key) => slotToWord[key])
      .filter(Boolean);
    const correctAnswers = targetWords;
    const incorrectSelections = selectedWordValues.filter(
      (word) => !correctAnswers.includes(word)
    );
    const missedCorrectAnswers = correctAnswers.filter(
      (word) => !selectedWordValues.includes(word)
    );

    const score = Math.round(
      ((correctAnswers.length -
        missedCorrectAnswers.length -
        incorrectSelections.length) /
        correctAnswers.length) *
      100
    );

    let feedbackMessage = "";
    if (score === 100) {
      feedbackMessage =
        "Perfekt! Du hast alle " + targetCategory + " korrekt identifiziert!";
    } else if (score >= 90) {
      feedbackMessage = "Fast Perfekt! Punktzahl: " + score + "%";
    } else if (score >= 50) {
      feedbackMessage = "Gut gemacht! Punktzahl: " + score + "%";
    } else {
      feedbackMessage = "Weiter üben! Punktzahl: " + score + "%";
    }

    onSubmit(selectedWordValues, score, feedbackMessage);
  };

  const resetExercise = () => {
    setSelectedSlotKeys([]);
    setIsSubmitted(false);
    setMessage("");
  };

  const restorePreviousAnswers = () => {
    if (!previousAnswers || previousAnswers.length === 0) {
      setMessage("Keine vorherigen Antworten vorhanden.");
      return;
    }

    const needed = {};
    previousAnswers.forEach((w) => {
      needed[w] = (needed[w] || 0) + 1;
    });

    const used = {};
    const restoredKeys = [];

    wordSlots.forEach(({ slotKey, word }) => {
      const remaining = (needed[word] || 0) - (used[word] || 0);
      if (remaining > 0) {
        restoredKeys.push(slotKey);
        used[word] = (used[word] || 0) + 1;
      }
    });

    setSelectedSlotKeys(restoredKeys);
  };

  const getTokenStyle = (word, slotKey) => {
    if (selectedSlotKeys.includes(slotKey)) {
      if (isSubmitted && !isPreviewMode) {
        return targetWords.includes(word)
          ? { backgroundColor: "var(--green)" }
          : { backgroundColor: "var(--red)" };
      }
      return { backgroundColor: "var(--click-selected-bg, var(--blue))" };
    } else {
      if (isSubmitted && targetWords.includes(word) && !isPreviewMode) {
        return {
          backgroundColor: "var(--click-missed-bg, var(--yellow))",
          border: "1px solid var(--click-missed-border, var(--yellow-border))",
        };
      }
    }
  };

  const renderToken = (token, tokenIndex) => {
    if (token === "\n") {
      return <span key={`${tokenIndex}-nl`} className="word-line-break" />;
    }

    if (isWhitespaceToken(token)) {
      return (
        <span key={`${tokenIndex}-ws`} className="word-space">
          {token}
        </span>
      );
    }

    const parts = splitTokenToParts(token);

    return parts.map((part, partIndex) => {
      const slotKey = `${tokenIndex}-${partIndex}`;

      if (part.type === "word") {
        return (
          <Button
            key={slotKey}
            onClick={() => handleWordClick(slotKey)}
            variant="click"
            style={getTokenStyle(part.value, slotKey)}
          >
            {part.value}
          </Button>
        );
      }

      return (
        <span key={slotKey} className="word-punct">
          {part.value}
        </span>
      );
    });
  };

  return (
    <Column gap="md">
      <h1>{title}</h1>
      <i>{`Wähle alle ${targetCategory} aus dem untenstehenden Text aus.`}</i>
      <Container className="word-container">
        {allWords?.map((token, index) => (
          <React.Fragment key={index}>{renderToken(token, index)}</React.Fragment>
        ))}
      </Container>
      {feedback && !isPreviewMode && (
        <>
          <div>{feedback}</div>
          <br />
        </>
      )}

      <Container className="message">
        {message && (
          <div style={{ backgroundColor: "var(--blue)" }}>{message}</div>
        )}
      </Container>

      <div>
        {!isSubmitted && !isPreviewMode ? (
          <Button size="sm" width="fit" onClick={checkAnswers}>
            Antworten überprüfen
          </Button>
        ) : (
          !isPreviewMode && (
            <Button size="sm" onClick={resetExercise}>
              Erneut versuchen
            </Button>
          )
        )}
      </div>

      <div>
        {!isPreviewMode && (
          <Button size="sm" width="fit" onClick={restorePreviousAnswers}>
            Vorherige Antworten ansehen/bearbeiten
          </Button>
        )}
      </div>
    </Column>
  );
};

export default WordSelectionExercise;
