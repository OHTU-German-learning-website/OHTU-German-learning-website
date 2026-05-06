"use client";

import { useParams } from "next/navigation";
import DndMatchLayout from "../layout";
import MatchArea from "@/components/ui/dnd-match/MatchArea";
import { LinkButton } from "@/components/ui/linkbutton";
import { Container } from "@/components/ui/layout/container";
import useQuery from "@/shared/hooks/useQuery";

export default function DndMatchExercisePage() {
  const { match_id } = useParams();

  const {
    data: exercise,
    error,
    isLoading,
  } = useQuery(`/exercises/dnd-match/${match_id}`);

  if (isLoading) return <div>Übung wird geladen…</div>;
  if (error) return <div>{error.message}</div>;
  if (!exercise) return <div>Übung wird geladen…</div>;

  return (
    <DndMatchLayout>
      <Container p="md">
        <h1>{exercise.title}</h1>
        {exercise.description && (
          <p style={{ color: "var(--fg2)", marginBottom: "var(--u-lg)" }}>
            {exercise.description}
          </p>
        )}

        <MatchArea exercise={exercise} exerciseId={match_id} />

        <Container mt="xl">
          <LinkButton
            size="sm"
            variant="secondary"
            href="/grammar/exercises/dnd-match"
          >
            Zurück zu allen Zuordnungs-Übungen
          </LinkButton>
        </Container>
      </Container>
    </DndMatchLayout>
  );
}
