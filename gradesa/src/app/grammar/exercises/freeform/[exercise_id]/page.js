"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, Column, Row } from "@/components/ui/layout/container";
import { useQuery } from "@tanstack/react-query";
import { useRequest } from "@/context/request.context";

export default function FreeFormExercisePage() {
  const { exercise_id } = useParams();
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [error, setError] = useState(null);
  const makeRequest = useRequest();

  const { data: exercise, isLoading } = useQuery({
    queryKey: ["exercise", exercise_id],
    queryFn: () => makeRequest(`/api/exercises/freeform/${exercise_id}`),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await makeRequest("/exercises/freeform/answers", {
        body: {
          freeFormExerciseId: exercise_id,
          answer,
        },
      });

      setIsCorrect(response.isCorrect);
      setFeedback(response.feedback);
    } catch (error) {
      setError(error.message);
    }
  };

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
        Error: {error}
        <Container mt="md">
          <Link href="/grammar/exercises">Back to exercises</Link>
        </Container>
      </Container>
    );
  }

  if (!exercise) {
    return (
      <Container p="md" bg="var(--yellow)" mb="md" br="md">
        Exercise not found.
        <Container mt="md">
          <Link href="/grammar/exercises">Back to exercises</Link>
        </Container>
      </Container>
    );
  }

  return (
    <Container maxW="800px" m="0 auto" p="md">
      <Container mb="lg">
        <h1>Free Form Exercise</h1>
      </Container>

      <Container mb="xl" p="md" bg="var(--bg2)" br="md">
        <Container mb="sm">
          <h2>Question:</h2>
        </Container>
        <Container>
          <p>{exercise.question}</p>
        </Container>
      </Container>

      <form onSubmit={handleSubmit}>
        <Column gap="lg">
          <Container>
            <label className="block text-sm font-medium mb-1">
              Your Answer:
              <textarea
                id="answer"
                rows="4"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                required
              />
            </label>
          </Container>
          <Button type="submit" variant="secondary">
            Submit Answer
          </Button>
        </Column>
      </form>

      {feedback && (
        <Container
          p="md"
          br="md"
          mb="md"
          mt="lg"
          bg={isCorrect ? "var(--green1)" : "var(--tertiary1)"}
        >
          <Container mb="sm" fontWeight="600">
            {isCorrect ? "Correct!" : "Incorrect"}
          </Container>
          <Container>{feedback}</Container>
        </Container>
      )}

      <Container mt="xl">
        <Link href="/grammar/exercises">Back to exercises</Link>
      </Container>
    </Container>
  );
}
