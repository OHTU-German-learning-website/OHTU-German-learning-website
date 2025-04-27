"use client";

import Link from "next/link";
import { Container } from "@/components/ui/layout/container";
import { useRequest } from "@/shared/hooks/useRequest";
import useQuery from "@/shared/hooks/useQuery";

export default function MultichoiceExercisesPage() {
  const makeRequest = useRequest();

  const {
    data: exercises,
    isLoading,
    error,
  } = useQuery("/exercises/multichoice");

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
          <Link
            key={exercise.multichoice_exercise_id}
            href={`/grammar/exercises/multichoice/${exercise.multichoice_exercise_id}`}
          >
            <Container
              p="md"
              b={`1px solid var(--bg6)`}
              br="md"
              boxShadow="0 1px 2px 0 rgba(0, 0, 0, 0.05)"
              _hover={{
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
              transition="box-shadow 0.3s"
              bg="var(--bg2)"
            >
              <Container
                mb="sm"
                fontWeight="600"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                {exercise.title.length > 30
                  ? `${exercise.title.substring(0, 30)}...`
                  : exercise.title}
              </Container>
              <Container fontSize="sm" color="var(--fg5)">
                Erstellt: {new Date(exercise.created_at).toLocaleDateString()}
              </Container>
            </Container>
          </Link>
        ))}
      </Container>

      <Container mt="lg">
        <Link href="/grammar/exercises">Zurück zu allen Übungen</Link>
      </Container>
    </Container>
  );
}
