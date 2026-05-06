"use client";

import { memo, useCallback, useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { MatchCard } from "./MatchCard";
import { MatchSlot } from "./MatchSlot";
import { Button } from "@/components/ui/button";
import "./dnd-match.css";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const MatchAreaInner = ({ exercise, exerciseId }) => {
  const [slots, setSlots] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [allRightItems, setAllRightItems] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (!exercise) return;
    const s = (exercise.leftItems || []).map((item) => ({
      leftPairId: Number(item.id),
      label: item.text,
      droppedItem: null,
    }));
    const right = (exercise.rightItems || []).map((item) => ({
      id: Number(item.id),
      text: item.text,
    }));
    setSlots(s);
    setRightItems(right);
    setAllRightItems(right);
    setIsSubmitted(false);
    setSubmitResult(null);
    setSubmitError(null);
  }, [exercise]);

  const allFilled =
    slots.length > 0 && slots.every((s) => s.droppedItem !== null);

  // When a card is dropped onto a slot:
  // - Place the card in the slot
  // - If the slot was occupied, return the old card to the right pool
  // - Remove the dropped card from the right pool
  const handleDrop = useCallback(
    (slotId, item) => {
      const evicted =
        slots.find((s) => s.leftPairId === slotId)?.droppedItem ?? null;

      setSlots((prev) =>
        prev.map((s) =>
          s.leftPairId === slotId
            ? { ...s, droppedItem: { id: item.id, text: item.text } }
            : s
        )
      );

      setRightItems((prev) => {
        const filtered = prev.filter((r) => r.id !== item.id);
        if (evicted && !filtered.some((r) => r.id === evicted.id)) {
          return [...filtered, evicted];
        }
        return filtered;
      });
    },
    [slots]
  );

  // Return a card from a slot back to the right pool
  const handleRemove = useCallback(
    (slotId) => {
      const removed =
        slots.find((s) => s.leftPairId === slotId)?.droppedItem ?? null;

      setSlots((prev) =>
        prev.map((s) =>
          s.leftPairId === slotId ? { ...s, droppedItem: null } : s
        )
      );

      if (removed) {
        setRightItems((prev) =>
          prev.some((r) => r.id === removed.id) ? prev : [...prev, removed]
        );
      }
    },
    [slots]
  );

  const handleSubmit = async () => {
    if (!allFilled || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const answers = slots.map((s) => ({
        leftPairId: s.leftPairId,
        selectedRightPairId: s.droppedItem.id,
      }));

      const res = await fetch(
        `/api/exercises/dnd-match/${exerciseId}/answers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler beim Einreichen.");

      setSubmitResult(data);
      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    const s = (exercise.leftItems || []).map((item) => ({
      leftPairId: Number(item.id),
      label: item.text,
      droppedItem: null,
    }));
    setSlots(s);
    setRightItems(shuffle(allRightItems));
    setIsSubmitted(false);
    setSubmitResult(null);
    setSubmitError(null);
  };

  const correctnessById = submitResult
    ? new Map(
        submitResult.results.map((r) => [Number(r.leftPairId), r.isCorrect])
      )
    : new Map();

  return (
    <div>
      {isSubmitted && submitResult && (
        <div
          className={`dnd-match-result ${
            submitResult.allCorrect
              ? "dnd-match-result--success"
              : "dnd-match-result--fail"
          }`}
        >
          {submitResult.allCorrect
            ? "Super! Alle Antworten sind richtig!"
            : `${submitResult.correctCount} von ${submitResult.total} Antworten richtig.`}
        </div>
      )}

      {submitError && (
        <p
          role="alert"
          style={{ color: "var(--red)", marginTop: "var(--u-md)" }}
        >
          {submitError}
        </p>
      )}

      <div className="dnd-match-layout">
        {/* Left column — ordered drop slots */}
        <div>
          <div className="dnd-match-column__title">Geordnete Liste</div>
          {slots.map((slot) => (
            <MatchSlot
              key={slot.leftPairId}
              slotId={slot.leftPairId}
              label={slot.label}
              droppedItem={slot.droppedItem}
              isSubmitted={isSubmitted}
              isCorrect={correctnessById.get(slot.leftPairId) ?? false}
              onDrop={handleDrop}
              onRemove={handleRemove}
            />
          ))}
        </div>

        {/* Right column — shuffled draggable cards */}
        <div>
          <div className="dnd-match-column__title">Zuordnen</div>
          {rightItems.length === 0 && !isSubmitted && (
            <p style={{ color: "var(--fg4)", fontStyle: "italic" }}>
              Alle Elemente wurden zugeordnet.
            </p>
          )}
          {rightItems.map((item) => (
            <MatchCard key={item.id} id={item.id} text={item.text} />
          ))}
        </div>
      </div>

      <div className="dnd-match-actions">
        {!isSubmitted && (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!allFilled || isSubmitting}
          >
            {isSubmitting ? "Wird eingereicht…" : "Antworten einreichen"}
          </Button>
        )}
        <Button variant="secondary" onClick={handleReset}>
          Erneut versuchen
        </Button>
      </div>
    </div>
  );
};

const MatchArea = ({ exercise, exerciseId }) => (
  <DndProvider backend={HTML5Backend}>
    <MatchAreaInner exercise={exercise} exerciseId={exerciseId} />
  </DndProvider>
);

export default memo(MatchArea);
