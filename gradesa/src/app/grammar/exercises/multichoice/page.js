"use client";

import Link from "next/link";
import { Container, Column, Row } from "@/components/ui/layout/container";
import useQuery from "@/shared/hooks/useQuery";
import { ExerciseLinkButton } from "@/components/ui/button/exercise-link-button";
import { Button } from "@/components/ui/button";

export default function MultichoiceExercisesPage() {
  const {
    data: exercises,
    isLoading,
    error,
    refetch,
  } = useQuery("/exercises/multichoice");

  const handleDelete = async (exerciseId) => {
    const confirmed = confirm("Möchten Sie diese Übung wirklich löschen?");

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/admin/exercises/multichoice/${exerciseId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Fehler beim Löschen der Übung.");
      }

      refetch();
    } catch (deleteError) {
      console.error("Error deleting exercise:", deleteError);
      alert("Fehler beim Löschen der Übung.");
    }
  };

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
        Fehler: {error.message}
      </Container>
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <Container maxW="800px" m="0 auto" p="md">
        <Container mb="lg">
          <h1>Multichoice Übungen</h1>
        </Container>
        <Container color="var(--fg4)">
          Zurzeit sind keine Übungen verfügbar.
        </Container>
        <Container mt="lg">
          <Link href="/grammar/exercises">Zurück zu allen Übungen</Link>
        </Container>
      </Container>
    );
  }

  return (
    <Container maxW="800px" m="0 auto" p="md">
      <Container mb="lg">
        <h1>Multiple-Choice-Übungen</h1>
      </Container>

      <Container
        display="grid"
        gap="md"
        templateColumns={{
          base: "1fr",
          md: "1fr 1fr",
          lg: "1fr 1fr 1fr",
        }}
        mb="lg"
      >
        {exercises.map((exercise) => (
          <Row
            key={exercise.multichoice_exercise_id}
            p="md"
            b={`1px solid var(--bg3)`}
            br="md"
            justify="space-between"
            align="center"
            boxShadow="0 1px 2px 0 rgba(0, 0, 0, 0.05)"
            bg="var(--bg2)"
            gap="md"
          >
            <Column flex="1">
              <Container
                mb="sm"
                fontWeight="600"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                <Link
                  href={`/grammar/exercises/multichoice/${exercise.multichoice_exercise_id}`}
                  style={{ fontSize: "var(--font-lg)" }}
                >
                  {exercise.title.length > 30
                    ? `${exercise.title.substring(0, 30)}...`
                    : exercise.title}
                </Link>
              </Container>
              <Container fontSize="sm" color="var(--fg4)">
                Erstellt: {new Date(exercise.created_at).toLocaleDateString()}
              </Container>
            </Column>
            <Column gap="sm" align="flex-end">
              <ExerciseLinkButton
                href={`/grammar/exercises/multichoice/${exercise.multichoice_exercise_id}`}
                size="sm"
              >
                Link kopieren
              </ExerciseLinkButton>

              <Link
                href={`/admin/create-exercise/multichoice/${exercise.multichoice_exercise_id}/edit`}
              >
                <Button type="button" variant="outline" size="sm">
                  Bearbeiten
                </Button>
              </Link>

              <Button
                type="button"
                variant="outline"
                size="sm"
                style={{
                  color: "#fff5f5",
                  borderColor: "#d85a5a",
                  backgroundColor: "#d85a5a",
                }}
                onClick={() => handleDelete(exercise.multichoice_exercise_id)}
              >
                Löschen
              </Button>
            </Column>
          </Row>
        ))}
      </Container>

      <Container mt="lg">
        <Link href="/grammar/exercises">Zurück zu allen Übungen</Link>
      </Container>
    </Container>
  );
}
