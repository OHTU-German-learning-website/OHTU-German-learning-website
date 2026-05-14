"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import useQuery from "@/shared/hooks/useQuery";
import { Column, Container, Row } from "@/components/ui/layout/container";
import { Button } from "@/components/ui/button";
import { MemoryGame } from "@/components/ui/memory-game/MemoryGame";
import { withBasePath } from "@/shared/utils/basePath";

export default function MemoryGamePlayerPage() {
  const { memory_game_id } = useParams();
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

  const {
    data: exercise,
    isLoading,
    error,
    refetch,
  } = useQuery(`/exercises/memory-game/${memory_game_id}`);

  const handleComplete = useCallback(
    async (pairs) => {
      setIsSubmitting(true);
      setResult(null);

      try {
        const response = await fetch(
          withBasePath(`/api/exercises/memory-game/${memory_game_id}/answers`),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ matches: pairs }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Fehler beim Absenden der Ergebnisse.");
        }

        setResult(data);
      } catch (submitError) {
        console.error(submitError);
        setResult({ error: submitError.message });
      } finally {
        setIsSubmitting(false);
      }
    },
    [memory_game_id]
  );

  if (isLoading) {
    return (
      <Container display="flex" justify="center" align="center" h="200px">
        Lädt...
      </Container>
    );
  }

  if (error) {
    return (
      <Container p="md" bg="var(--tertiary1)" mb="md" br="md">
        Fehler: {error.message || error.error}
      </Container>
    );
  }

  if (!exercise) {
    return (
      <Container p="md" bg="var(--tertiary1)" mb="md" br="md">
        Übung wurde nicht gefunden.
      </Container>
    );
  }

  return (
    <Container maxW="1000px" m="0 auto" p="md">
      <Container mb="lg">
        <h1>{exercise.title}</h1>
        <p>{exercise.description}</p>
      </Container>

      <MemoryGame
        pairs={exercise.pairs || []}
        onComplete={handleComplete}
        onReset={() => setResult(null)}
        resetSignal={resetSignal}
      />

      {isSubmitting && <p>Ergebnisse werden gespeichert...</p>}
      {result && (
        <Container mt="lg" p="md" bg="var(--bg2)" br="md">
          {result.error ? (
            <p>Fehler: {result.error}</p>
          ) : (
            <>
              <p>
                Richtig: {result.correctCount}/{result.total}
              </p>
              <p>Punktzahl: {result.score}%</p>
              {result.perfect && <p>Perfekt! Gut gemacht.</p>}
            </>
          )}
        </Container>
      )}

      <Row gap="md" mt="lg">
        <Link href="/grammar/exercises/memory-game">
          <Button variant="outline">Zurück zur Liste</Button>
        </Link>
        <Button
          type="button"
          onClick={() => {
            setResult(null);
            setResetSignal((prev) => prev + 1);
            refetch();
          }}
        >
          Übung neu laden
        </Button>
      </Row>
    </Container>
  );
}
