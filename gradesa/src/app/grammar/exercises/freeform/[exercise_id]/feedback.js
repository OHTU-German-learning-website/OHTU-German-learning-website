"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Container, Row } from "@/components/ui/layout/container";
import { Button } from "@/components/ui/button";
import useQuery from "@/shared/hooks/useQuery";

export default function FreeformFeedback() {
  const { exercise_id } = useParams();
  const [showAllFeedback, setShowAllFeedback] = useState(false);

  const {
    data: feedback,
    isLoading,
    error,
    refetch,
  } = useQuery(`/exercises/freeform/answers/${exercise_id}`, undefined, {
    enabled: showAllFeedback,
  });

  const toggleFeedback = () => {
    setShowAllFeedback(!showAllFeedback);
    if (!showAllFeedback) {
      refetch();
    }
  };

  return (
    <Container mt="xl">
      <Container textAlign="center" mb="md">
        <Button variant="outline" onClick={toggleFeedback}>
          {showAllFeedback ? "Hide Feedback" : "Show All Feedback"}
        </Button>
      </Container>

      {showAllFeedback && (
        <>
          {isLoading && (
            <Container p="md" bg="var(--bg2)" br="md" mb="md">
              Loading feedback...
            </Container>
          )}

          {error && (
            <Container p="md" bg="var(--tertiary1)" br="md" mb="md">
              Error: {error}
              <Button onClick={refetch} variant="secondary" size="sm" mt="sm">
                Try Again
              </Button>
            </Container>
          )}

          {!isLoading && !error && feedback && (
            <Container p="md" bg="var(--bg2)" br="md" mb="md">
              <h2>Feedback</h2>

              {feedback.userAnswers && feedback.userAnswers.length > 0 ? (
                <Container mt="md">
                  <h3>Your Answers</h3>
                  {feedback.userAnswers.map((answer, index) => (
                    <Container
                      key={index}
                      p="sm"
                      mb="sm"
                      bg={
                        answer.is_correct ? "var(--green1)" : "var(--tertiary1)"
                      }
                      br="md"
                    >
                      <Row justify="space-between" w="100%">
                        <strong>Answer: {answer.answer}</strong>
                        {answer.is_correct ? "Correct" : "Incorrect"}
                      </Row>
                      <div>
                        <strong>Attempted:</strong>{" "}
                        {new Date(answer.updated_at).toLocaleString()}
                      </div>
                    </Container>
                  ))}
                </Container>
              ) : null}

              {feedback.possibleAnswers &&
              feedback.possibleAnswers.length > 0 ? (
                <Container mt="md">
                  <h3>Possible Answers</h3>
                  {feedback.possibleAnswers
                    .filter((answer) => answer.is_correct)
                    .map((answer) => (
                      <Container
                        key={answer.id}
                        p="sm"
                        mb="sm"
                        bg={
                          answer.is_correct
                            ? "var(--green1)"
                            : "var(--tertiary1)"
                        }
                        br="md"
                      >
                        <div>
                          <strong>Answer:</strong> {answer.answer}
                        </div>
                        <div>
                          <strong>Feedback:</strong>{" "}
                          {answer.feedback ||
                            (answer.is_correct ? "Correct" : "Incorrect")}
                        </div>
                      </Container>
                    ))}
                </Container>
              ) : null}

              {(!feedback.possibleAnswers ||
                !feedback.possibleAnswers.length) &&
                (!feedback.userAnswers || !feedback.userAnswers.length) && (
                  <Container>
                    No feedback available for this exercise.
                  </Container>
                )}
            </Container>
          )}
        </>
      )}
    </Container>
  );
}
