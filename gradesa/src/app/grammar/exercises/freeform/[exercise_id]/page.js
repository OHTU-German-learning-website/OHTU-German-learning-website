"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, Column, Row } from "@/components/ui/layout/container";
import useQuery from "@/shared/hooks/useQuery";
import { useRequest } from "@/shared/hooks/useRequest";
import FreeformFeedback from "./feedback";

// Add these styles to the top of the file
const styles = {
  errorWord: {
    color: "var(--tertiary2)",
    textDecoration: "line-through",
    marginRight: "4px",
  },
  similarWord: {
    color: "var(--yellow)",
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
    color: "var(--green1)",
    marginRight: "4px",
  },
};

// Updated AnswerComparison component
const AnswerComparison = ({ comparisonDetails }) => {
  if (!comparisonDetails) return null;

  return (
    <Container mt="md" mb="md">
      <h3>Your Answer:</h3>
      <Container p="sm" bg="var(--bg2)" br="md">
        {comparisonDetails.studentWords.map((word, index) => {
          let wordStyle;
          let title = "";

          if (word.status === "error") {
            wordStyle = styles.errorWord;
          } else if (word.status === "similar") {
            wordStyle = styles.similarWord;
            title = `Did you mean: ${word.suggestion}`;
          } else if (word.status === "match" && word.position === "wrong") {
            wordStyle = styles.wrongPosition;
            title = `This word should be in position ${word.correctPosition + 1}`;
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
          <h4>Missing Words:</h4>
          <Container p="sm" bg="var(--bg2)" br="md">
            {comparisonDetails.missingWords.map((word, index) => (
              <span
                key={index}
                style={styles.missingWord}
                title={`This word should be at position ${word.position + 1}`}
              >
                {word.word}
              </span>
            ))}
          </Container>
        </Container>
      )}

      <Container mt="sm">
        <h4>Correct Answer:</h4>
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
          <span style={styles.errorWord}>Red/strikethrough</span>: Incorrect
          words
        </div>
        <div>
          <span style={styles.similarWord}>Yellow/underlined</span>: Almost
          correct words
        </div>
        <div>
          <span style={styles.wrongPosition}>Blue/wavy underline</span>: Correct
          word in wrong position
        </div>
        <div>
          <span style={styles.missingWord}>Green</span>: Missing words
        </div>
      </Container>
    </Container>
  );
};

export default function FreeFormExercisePage() {
  const { exercise_id } = useParams();
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [error, setError] = useState(null);
  const makeRequest = useRequest();

  const { data: exercise, isLoading } = useQuery(
    `/exercises/freeform/${exercise_id}`
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await makeRequest("/exercises/freeform/answers", {
        freeFormExerciseId: exercise_id,
        answer,
      });
      const data = response.data;
      if (data) {
        setIsCorrect(data.is_correct);
        setFeedback(data);
      }
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
            <label>
              Your Answer:
              <textarea
                id="answer"
                rows="4"
                className="w-full p-2 mt-1 border rounded"
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
        <Row
          p="md"
          br="md"
          mb="md"
          mt="lg"
          justify="space-between"
          bg={feedback.is_correct ? "var(--green1)" : "var(--tertiary1)"}
        >
          <Column>
            <span>Teacher's Feedback:</span>
            {feedback.feedback}
          </Column>
          <Container mb="sm" fontWeight="600">
            {feedback.is_correct ? "Correct!" : "Incorrect"}
          </Container>
        </Row>
      )}

      {feedback && feedback.comparisonDetails && (
        <AnswerComparison comparisonDetails={feedback.comparisonDetails} />
      )}

      <FreeformFeedback />

      <Container mt="xl">
        <Link href="/grammar/exercises">Back to exercises</Link>
      </Container>
    </Container>
  );
}
