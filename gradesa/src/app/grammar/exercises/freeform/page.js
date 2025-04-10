"use client";

import { useState } from "react";
import Link from "next/link";
import { Container, Row, Column } from "@/components/ui/layout/container";
import { useQuery } from "@tanstack/react-query";
import { useRequest } from "@/context/request.context";

export default function FreeFormExercisesPage() {
  const makeRequest = useRequest();

  const {
    data: exercises,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["freeform-exercises"],
    queryFn: () => makeRequest("/api/exercises/freeform"),
  });

  if (isLoading) {
    return (
      <Container display="flex" justify="center" align="center" h="200px">
        Loading...
      </Container>
    );
  }

  if (error) {
    return (
      <Container p="md" bg="var(--tertiary1)" mb="md" br="md">
        Error: {error.message}
      </Container>
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <Container maxW="800px" m="0 auto" p="md">
        <Container mb="lg">
          <h1>Free Form Exercises</h1>
        </Container>
        <Container color="var(--fg4)">
          No exercises available at the moment.
        </Container>
        <Container mt="lg">
          <Link href="/grammar/exercises">Back to all exercises</Link>
        </Container>
      </Container>
    );
  }

  return (
    <Container maxW="800px" m="0 auto" p="md">
      <Container mb="lg">
        <h1>Free Form Exercises</h1>
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
            key={exercise.id}
            href={`/grammar/exercises/freeform/${exercise.id}`}
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
                {exercise.question.length > 30
                  ? `${exercise.question.substring(0, 30)}...`
                  : exercise.question}
              </Container>
              <Container fontSize="sm" color="var(--fg5)">
                Created: {new Date(exercise.created_at).toLocaleDateString()}
              </Container>
            </Container>
          </Link>
        ))}
      </Container>

      <Container mt="lg">
        <Link href="/grammar/exercises">Back to all exercises</Link>
      </Container>
    </Container>
  );
}
