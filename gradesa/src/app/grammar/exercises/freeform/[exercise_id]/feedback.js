"use client";

import { useState } from "react";
import { Container, Row } from "@/components/ui/layout/container";
import { Button } from "@/components/ui/button";

export default function FreeformFeedback({
  questions = [],
  submissionsByQuestionId = {},
}) {
  const [showAllFeedback, setShowAllFeedback] = useState(false);

  const toggleFeedback = () => {
    setShowAllFeedback(!showAllFeedback);
  };

  return (
    <Container mt="0">
      <Container mb={showAllFeedback ? "md" : "0"}>
        <Button variant="outline" onClick={toggleFeedback}>
          {showAllFeedback
            ? "Meine Antworten ausblenden"
            : "Meine Antworten anzeigen"}
        </Button>
      </Container>

      {showAllFeedback && (
        <Container p="md" bg="var(--bg2)" br="md" mb="md">
          <h2>Meine Antworten</h2>

          {questions.length === 0 && (
            <Container>Für diese Übung sind keine Fragen verfügbar.</Container>
          )}

          {questions.map((question, index) => {
            const submission = submissionsByQuestionId[question.id];

            if (!submission) {
              return (
                <Container
                  key={question.id}
                  p="sm"
                  mb="sm"
                  bg="var(--bg1)"
                  br="md"
                >
                  <div>
                    <strong>Frage {index + 1}:</strong> {question.question}
                  </div>
                  <div>Noch nicht beantwortet.</div>
                </Container>
              );
            }

            const fallbackFeedback = submission.is_correct
              ? "Richtig"
              : "Falsch";

            return (
              <Container
                key={question.id}
                p="sm"
                mb="sm"
                bg={
                  submission.is_correct ? "var(--green1)" : "var(--tertiary1)"
                }
                br="md"
              >
                <Row justify="space-between" w="100%">
                  <strong>Antwort: {submission.answer}</strong>
                  {submission.is_correct ? "Richtig" : "Falsch"}
                </Row>
                <div>
                  <strong>Feedback:</strong>{" "}
                  {submission.feedback || fallbackFeedback}
                </div>
              </Container>
            );
          })}
        </Container>
      )}
    </Container>
  );
}
