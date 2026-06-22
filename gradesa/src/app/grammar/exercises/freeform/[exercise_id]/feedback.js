"use client";

import { useState } from "react";
import { Container } from "@/components/ui/layout/container";
import { Button } from "@/components/ui/button";

export default function FreeformFeedback({
  currentQuestion = null,
  currentQuestionIndex = 0,
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
            ? "Richtige Antworten ausblenden"
            : "Alle richtigen Antworten anzeigen"}
        </Button>
      </Container>

      {showAllFeedback && (
        <Container p="md" bg="var(--bg2)" br="md" mb="md">
          <h2>Richtige Antworten</h2>

          {!currentQuestion && (
            <Container>Für diese Übung sind keine Fragen verfügbar.</Container>
          )}

          {currentQuestion && (
            <Container
              key={currentQuestion.id}
              p="sm"
              mb="sm"
              bg="var(--bg1)"
              br="md"
            >
              <div>
                <strong>Frage {currentQuestionIndex + 1}:</strong>{" "}
                {currentQuestion.question}
              </div>
              <Container mt="sm">
                {(currentQuestion.correct_answers || []).length > 0 ? (
                  (currentQuestion.correct_answers || []).map(
                    (answer, answerIndex) => (
                      <div key={`${currentQuestion.id}-${answerIndex}`}>
                        {answerIndex + 1}. {answer}
                      </div>
                    )
                  )
                ) : (
                  <div>
                    Für diese Frage sind keine richtigen Antworten hinterlegt.
                  </div>
                )}
              </Container>
            </Container>
          )}
        </Container>
      )}
    </Container>
  );
}
