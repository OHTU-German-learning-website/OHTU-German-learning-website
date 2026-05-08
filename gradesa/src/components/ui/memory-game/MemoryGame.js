"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import "./memory-game.css";

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

export function MemoryGame({ pairs, onComplete, onReset }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState(new Set());
  const [selectedIds, setSelectedIds] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [feedback, setFeedback] = useState("");
  const completionSentRef = useRef(false);
  const lastFlippedRef = useRef(null);

  const deck = useMemo(() => {
    return shuffle(
      pairs.flatMap((pair, index) => [
        {
          id: `left-${index}`,
          pairIndex: index,
          side: "left",
          text: pair.left_item,
        },
        {
          id: `right-${index}`,
          pairIndex: index,
          side: "right",
          text: pair.right_item,
        },
      ])
    );
  }, [pairs]);

  useEffect(() => {
    setCards(deck);
    setFlipped(new Set());
    setSelectedIds([]);
    setMatchedPairs([]);
    setFeedback("");
    completionSentRef.current = false;
    lastFlippedRef.current = null;
  }, [deck]);

  const handleCardClick = (card) => {
    if (
      flipped.has(card.id) ||
      matchedPairs.includes(card.pairIndex) ||
      selectedIds.length === 2
    ) {
      return;
    }

    const newFlipped = new Set(flipped);
    newFlipped.add(card.id);
    setFlipped(newFlipped);
    setSelectedIds((prev) => [...prev, card.id]);

    if (lastFlippedRef.current === null) {
      lastFlippedRef.current = card;
      setFeedback("");
      return;
    }

    const firstCard = lastFlippedRef.current;

    if (
      firstCard.pairIndex === card.pairIndex &&
      firstCard.side !== card.side
    ) {
      setMatchedPairs((prev) => [...prev, firstCard.pairIndex]);
      setSelectedIds([]);
      setFeedback("Richtig! Weiter so.");
      lastFlippedRef.current = null;
      return;
    }

    setFeedback("Nicht korrekt. Versuch es noch einmal.");
    setTimeout(() => {
      setFlipped((prev) => {
        const next = new Set(prev);
        next.delete(firstCard.id);
        next.delete(card.id);
        return next;
      });
      setSelectedIds([]);
      lastFlippedRef.current = null;
    }, 1200);
  };

  useEffect(() => {
    if (
      matchedPairs.length === pairs.length &&
      pairs.length > 0 &&
      !completionSentRef.current
    ) {
      completionSentRef.current = true;
      onComplete?.(
        pairs.map((pair) => ({
          left_item: pair.left_item,
          right_item: pair.right_item,
        }))
      );
      setFeedback("Alle Paare gefunden!");
    }
  }, [matchedPairs, onComplete, pairs]);

  const resetGame = () => {
    setCards(shuffle(deck));
    setFlipped(new Set());
    setSelectedIds([]);
    setMatchedPairs([]);
    setFeedback("");
    completionSentRef.current = false;
    lastFlippedRef.current = null;
    onReset?.();
  };

  return (
    <div className="memory-game-shell">
      <div className="memory-game-header">
        <div>{pairs.length} Paare</div>
        <Button variant="outline" size="sm" onClick={resetGame}>
          Neu starten
        </Button>
      </div>
      <div className="memory-game-grid">
        {cards.map((card) => {
          const isFlipped = flipped.has(card.id);
          const isMatched = matchedPairs.includes(card.pairIndex);

          return (
            <button
              key={card.id}
              type="button"
              className={`memory-card ${isFlipped ? "flipped" : ""} ${
                isMatched ? "matched" : ""
              }`}
              onClick={() => handleCardClick(card)}
              disabled={
                isMatched ||
                selectedIds.includes(card.id) ||
                selectedIds.length === 2
              }
            >
              {isFlipped || isMatched ? (
                <span className="memory-card__text">{card.text}</span>
              ) : (
                <span className="memory-card__back">?</span>
              )}
            </button>
          );
        })}
      </div>
      <div className="memory-game-footer">{feedback}</div>
    </div>
  );
}
