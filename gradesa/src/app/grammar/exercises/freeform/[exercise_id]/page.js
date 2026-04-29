"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, Column, Row } from "@/components/ui/layout/container";
import useQuery from "@/shared/hooks/useQuery";
import { useRequest } from "@/shared/hooks/useRequest";
import FreeformFeedback from "./feedback";
import { LinkButton } from "@/components/ui/linkbutton";

const styles = {
  errorWord: {
    color: "var(--purple)",
    textDecoration: "line-through",
    marginRight: "4px",
  },
  similarWord: {
    color: "var(--red)",
    textDecoration: "underline",
    marginRight: "4px",
  },
  matchWord: {
    marginRight: "4px",
  },
  wrongPosition: {
    color: "var(--blue)",
    textDecoration: "underline wavy",
    marginRight: "4px",
  },
  missingWord: {
    color: "var(--green)",
    marginRight: "4px",
  },
};

// Aktualisierte AnswerComparison-Komponente
const AnswerComparison = ({ comparisonDetails }) => {
  if (!comparisonDetails) return null;

  return (
    <Container mt="md" mb="md">
      <h3>Deine Antwort:</h3>
      <Container p="sm" bg="var(--bg2)" br="md">
        {comparisonDetails.studentWords.map((word, index) => {
          let wordStyle;
          let title = "";

          if (word.status === "error") {
            wordStyle = styles.errorWord;
          } else if (word.status === "similar") {
            wordStyle = styles.similarWord;
            title = `Meintest du: ${word.suggestion}`;
          } else if (word.status === "match" && word.position === "wrong") {
            wordStyle = styles.wrongPosition;
            title = `Dieses Wort sollte an Position ${word.correctPosition + 1} stehen`;
          } else {
            wordStyle = styles.matchWord;
          }

          return (
            <span key={index} style={wordStyle} title={title}>
              {word.word}
            </span>
          );
        })}
      </Container>

      {comparisonDetails.missingWords.length > 0 && (
        <Container mt="sm">
          <h4>Fehlende Wörter:</h4>
          <Container p="sm" bg="var(--bg2)" br="md">
            {comparisonDetails.missingWords.map((word, index) => (
              <span
                key={index}
                style={styles.missingWord}
                title={`Dieses Wort sollte an Position ${word.position + 1} stehen`}
              >
                {word.word}
              </span>
            ))}
          </Container>
        </Container>
      )}

      <Container mt="sm">
        <h4>Richtige Antwort:</h4>
        <Container p="sm" bg="var(--bg2)" br="md">
          {comparisonDetails.missingWords
            .concat(
              comparisonDetails.studentWords
                .filter((word) => word.status === "match")
                .map((word) => ({
                  word: word.correctWord,
                  position:
                    word.correctPosition ||
                    comparisonDetails.studentWords.indexOf(word),
                }))
            )
            .sort((a, b) => a.position - b.position)
            .map((word, index) => (
              <span key={index} style={{ marginRight: "4px" }}>
                {word.word}
              </span>
            ))}
        </Container>
      </Container>

      <Container mt="sm" fontSize="sm">
        <div>
          <span style={styles.errorWord}>Rot/durchgestrichen</span>: Falsche
          Wörter
        </div>
        <div>
          <span style={styles.similarWord}>Gelb/unterstrichen</span>: Fast
          richtige Wörter
        </div>
        <div>
          <span style={styles.wrongPosition}>Blau/wellig unterstrichen</span>:
          Richtiges Wort an falscher Position
        </div>
        <div>
          <span style={styles.missingWord}>Grün</span>: Fehlende Wörter
        </div>
      </Container>
    </Container>
  );
};

export default function FreeFormExercisePage() {
  const { exercise_id } = useParams();
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);
  const makeRequest = useRequest();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { data: exercise, isLoading } = useQuery(
    `/exercises/freeform/${exercise_id}`
  );

  const { data: allExercises } = useQuery("/exercises/freeform");

  const currentExerciseIndex = allExercises?.findIndex(
    (ex) => String(ex.id) === String(exercise_id)
  );

  const nextExercise =
    currentExerciseIndex !== undefined &&
    currentExerciseIndex !== -1 &&
    allExercises?.[currentExerciseIndex + 1];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await makeRequest("/exercises/freeform/answers", {
        freeFormExerciseId: exercise_id,
        freeFormQuestionId: exercise.questions[currentQuestionIndex].id,
        answer,
      });
      const data = response.data;
      if (data) {
        setFeedback(data);
      }
    } catch (error) {
      setError(error.message);
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
        Fehler: {error}
        <Container mt="md">
          <Link href="/grammar/exercises">Zurück zu den Übungen</Link>
        </Container>
      </Container>
    );
  }

  if (!exercise) {
    return null;
  }

  return (
    <Container maxW="800px" m="0 auto" p="md">
      <Container mb="lg">
        <h1>{exercise.title}</h1>
      </Container>

      <Container mb="xl" p="md" bg="var(--bg2)" br="md">
        <Container mb="xs" fontSize="sm" color="var(--fg4)">
          Frage {currentQuestionIndex + 1} von {exercise.questions.length}
        </Container>
        <Container>
          <h2 style={{ fontSize: "2rem", lineHeight: "1.3", margin: 0 }}>
            {exercise.questions[currentQuestionIndex]?.question}
          </h2>
        </Container>
      </Container>

      <form onSubmit={handleSubmit}>
        <Column gap="lg">
          <Container>
            <label>
              Deine Antwort:
              <textarea
                id="answer"
                rows="4"
                className="w-full p-2 mt-1 border rounded"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Gib deine Antwort hier ein..."
                required
              />
            </label>
          </Container>

          <Row justify="center">
            <Button type="submit" variant="secondary" width="fit">
              Antwort abschicken
            </Button>
          </Row>
        </Column>
      </form>

      <Row justify="space-between" align="center" mt="lg" mb="md">
        <FreeformFeedback />
        <Row justify="end" gap="md">
          {currentQuestionIndex > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCurrentQuestionIndex((prev) => prev - 1);
                setAnswer("");
                setFeedback(null);
              }}
            >
              Vorherige
            </Button>
          )}
          {currentQuestionIndex < exercise.questions.length - 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCurrentQuestionIndex((prev) => prev + 1);
                setAnswer("");
                setFeedback(null);
              }}
            >
              Nächste
            </Button>
          )}
        </Row>
      </Row>

      {feedback && (
        <Row
          p="md"
          br="md"
          mb="md"
          mt="lg"
          justify="space-between"
          bg={feedback.is_correct ? "var(--green1)" : "var(--tertiary1)"}
        >
          <Column>
            <span>Feedback des Lehrers:</span>
            {feedback.feedback}
          </Column>
          <Container mb="sm" fontWeight="600">
            {feedback.is_correct ? "Richtig!" : "Falsch"}
          </Container>
        </Row>
      )}

      {feedback && feedback.comparisonDetails && (
        <AnswerComparison comparisonDetails={feedback.comparisonDetails} />
      )}

      <Row gap="md" mt="xl" justify="space-between">
        <LinkButton href="/grammar/exercises">Zurück zu den Übungen</LinkButton>

        {feedback?.is_correct && nextExercise && (
          <LinkButton
            variant="secondary"
            href={`/grammar/exercises/freeform/${nextExercise.id}`}
          >
            Nächste Übung
          </LinkButton>
        )}
      </Row>
    </Container>
  );
}
