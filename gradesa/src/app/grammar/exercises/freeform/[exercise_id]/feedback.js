"use client";

import { useState } from "react";
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
      <Container mb="md">
        <Button variant="outline" onClick={toggleFeedback}>
          {showAllFeedback
            ? "Feedback ausblenden"
            : "Richtige Antworten anzeigen"}
        </Button>
      </Container>

      {showAllFeedback && (
        <>
          {isLoading && (
            <Container p="md" bg="var(--bg2)" br="md" mb="md">
              Feedback wird geladen...
            </Container>
          )}

          {error && (
            <Container p="md" bg="var(--tertiary1)" br="md" mb="md">
              Fehler: {error}
              <Button onClick={refetch} variant="secondary" size="sm" mt="sm">
                Erneut versuchen
              </Button>
            </Container>
          )}

          {!isLoading && !error && feedback && (
            <Container p="md" bg="var(--bg2)" br="md" mb="md">
              <h2>Feedback</h2>

              {feedback.userAnswers && feedback.userAnswers.length > 0 ? (
                <Container mt="md">
                  <h3>Ihre Antwort</h3>
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
                        <strong>Antwort: {answer.answer}</strong>
                        {answer.is_correct ? "Richtig" : "Falsch"}
                      </Row>
                      <div>
                        <strong>Versucht:</strong>{" "}
                        {new Date(answer.updated_at).toLocaleString()}
                      </div>
                    </Container>
                  ))}
                </Container>
              ) : null}

              {feedback.possibleAnswers &&
              feedback.possibleAnswers.length > 0 ? (
                <Container mt="md">
                  <h3>Mögliche Antworten</h3>
                  {feedback.possibleAnswers
                    .filter((answer) => answer.is_correct)
                    .map((answer, index) => (
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
                          <strong>Antwort {index + 1}:</strong> {answer.answer}
                        </div>
                        <div>
                          <strong>Feedback:</strong>{" "}
                          {answer.feedback ||
                            (answer.is_correct ? "Richtig" : "Falsch")}
                        </div>
                      </Container>
                    ))}
                </Container>
              ) : null}

              {(!feedback.possibleAnswers ||
                !feedback.possibleAnswers.length) &&
                (!feedback.userAnswers || !feedback.userAnswers.length) && (
                  <Container>
                    Für diese Übung ist kein Feedback verfügbar.
                  </Container>
                )}
            </Container>
          )}
        </>
      )}
    </Container>
  );
}
