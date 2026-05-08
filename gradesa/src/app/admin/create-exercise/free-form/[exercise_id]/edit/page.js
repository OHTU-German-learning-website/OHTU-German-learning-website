"use client";

import { Button } from "@/components/ui/button";
import { Column, Row } from "@/components/ui/layout/container";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import useQuery from "@/shared/hooks/useQuery";
import "../../../multichoice/multichoice.css";

export default function EditFreeFormExercisePage() {
  const router = useRouter();
  const { exercise_id } = useParams();

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, error } = useQuery(
    `/admin/exercises/free-form/${exercise_id}`
  );

  useEffect(() => {
    if (data) {
      if (data.title) {
        setTitle(data.title);
      }
      if (data.questions) {
        console.log("Fetched questions:", data.questions);
        console.log("Loaded full data for edit:", data);
        setQuestions(
          data.questions.map((q) => ({
            question: q.question,
            answers: q.answers.map((a) => ({
              answer: a.answer,
              feedback: a.feedback || "",
              is_correct: a.is_correct,
            })),
          }))
        );
      }
    }
  }, [data]);

  const handleQuestionChange = (questionIndex, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === questionIndex ? { ...q, question: value } : q))
    );
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        answers: [],
      },
    ]);
  };

  const handleRemoveQuestion = (questionIndex) => {
    setQuestions((prev) => prev.filter((_, i) => i !== questionIndex));
  };

  const handleAnswersChange = (questionIndex, answerIndex, key, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i !== questionIndex
          ? q
          : {
              ...q,
              answers: q.answers.map((ans, j) =>
                j !== answerIndex ? ans : { ...ans, [key]: value }
              ),
            }
      )
    );
  };

  const handleAddAnswer = (questionIndex, is_correct = true) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i !== questionIndex
          ? q
          : {
              ...q,
              answers: [
                ...q.answers,
                {
                  answer: "",
                  feedback: "",
                  is_correct,
                },
              ],
            }
      )
    );
  };

  const handleRemoveAnswer = (questionIndex, answerIndex) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i !== questionIndex
          ? q
          : {
              ...q,
              answers: q.answers.filter((_, j) => j !== answerIndex),
            }
      )
    );
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setGeneralError("");

      const hasValidAnswerBalance = questions.every(
        (q) =>
          q.answers.some((a) => a.is_correct) &&
          q.answers.some((a) => !a.is_correct)
      );

      if (!hasValidAnswerBalance) {
        setGeneralError(
          "Jede Frage muss mindestens eine richtige und eine falsche Antwort haben."
        );
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(
        `/api/admin/exercises/free-form/${exercise_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, questions }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Ein Fehler ist aufgetreten");
      }

      router.push("/grammar/exercises/freeform");
    } catch (error) {
      console.error("Update error:", error);
      setGeneralError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/grammar/exercises/freeform");
  };

  if (isLoading) {
    return <div>Lädt...</div>;
  }

  if (error) {
    return <div>Fehler: {error.message || "Etwas ist schiefgelaufen"}</div>;
  }

  return (
    <Column gap="md">
      <h2>Freitextübung bearbeiten</h2>
      <p>Geladene Fragen: {questions.length}</p>

      {generalError && (
        <p className="error" role="alert">
          {generalError}
        </p>
      )}

      <div className="form-group">
        <label>Titel</label>
        <input
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titel der Übung"
        />
      </div>

      {questions.map((q, questionIndex) => (
        <Column
          key={questionIndex}
          gap="md"
          p="lg"
          b="2px solid var(--primary3)"
          br="md"
        >
          <Row justify="space-between" align="center">
            <h3>Frage #{questionIndex + 1}</h3>
            {questions.length > 1 && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                style={{
                  backgroundColor: "#d85a5a",
                  borderColor: "#d85a5a",
                  color: "#fff5f5",
                }}
                onClick={() => handleRemoveQuestion(questionIndex)}
              >
                Frage entfernen
              </Button>
            )}
          </Row>

          <label>
            Frage
            <textarea
              value={q.question}
              onChange={(e) =>
                handleQuestionChange(questionIndex, e.target.value)
              }
              placeholder="Geben Sie hier Ihre Frage ein"
            />
          </label>

          <Answers
            questionIndex={questionIndex}
            answers={q.answers}
            onRemoveAnswer={handleRemoveAnswer}
            onAddAnswer={handleAddAnswer}
            onAnswersChange={handleAnswersChange}
          />
        </Column>
      ))}

      <Row mt="md">
        <Button type="button" width="fit" onClick={handleAddQuestion}>
          Frage hinzufügen
        </Button>
      </Row>

      <Row justify="space-between" gap="md" mt="xl" mb="xl">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Abbrechen
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Wird gespeichert..." : "Änderungen speichern"}
        </Button>
      </Row>
    </Column>
  );
}

function Answers({
  questionIndex,
  answers,
  onAnswersChange,
  onAddAnswer,
  onRemoveAnswer,
}) {
  return (
    <Column gap="xl">
      <h4>Antworten {answers.length > 0 ? `(${answers.length})` : ""}</h4>

      {answers.map((ans, i) => (
        <AnswerItem
          key={i}
          index={i}
          answer={ans}
          onRemoveAnswer={() => onRemoveAnswer(questionIndex, i)}
          onAnswerChange={(key, value) =>
            onAnswersChange(questionIndex, i, key, value)
          }
        />
      ))}

      <Row gap="md">
        <Button
          type="button"
          width="fit"
          onClick={() => onAddAnswer(questionIndex, true)}
        >
          Richtige Antwort hinzufügen
        </Button>
        <Button
          type="button"
          width="fit"
          onClick={() => onAddAnswer(questionIndex, false)}
        >
          Falsche Antwort hinzufügen
        </Button>
      </Row>
    </Column>
  );
}

function AnswerItem({ answer, onAnswerChange, onRemoveAnswer, index }) {
  return (
    <Column gap="lg" b="2px solid var(--primary3)" p="md" r="md">
      <Row justify="space-between" align="center">
        <span>
          <strong>#{index + 1}:</strong>{" "}
          {answer.is_correct ? "Richtige Antwort" : "Falsche Antwort"}
        </span>
        <Button type="button" size="sm" onClick={onRemoveAnswer}>
          Entfernen
        </Button>
      </Row>

      <label>
        <span>Auslösende Antwort</span>
        <textarea
          value={answer.answer}
          onChange={(e) => onAnswerChange("answer", e.target.value)}
          placeholder="Geben Sie hier die auslösende Antwort ein"
        />
      </label>

      <label>
        Feedback
        <textarea
          value={answer.feedback}
          onChange={(e) => onAnswerChange("feedback", e.target.value)}
          placeholder="Optionales Feedback für diese Antwort"
        />
      </label>
    </Column>
  );
}
