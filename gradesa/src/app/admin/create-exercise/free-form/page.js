"use client";
import { Button } from "@/components/ui/button";
import { Column, Row } from "@/components/ui/layout/container";
import { useState } from "react";
import { useRequest } from "@/shared/hooks/useRequest";
import { useRouter } from "next/navigation";
import { zodErrorToFormErrors } from "@/shared/schemas/schema-utils";

const defaultFormErrors = {
  question: "",
  answers: [],
};
export default function CreateFreeFormExercise() {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [generalError, setGeneralError] = useState("");
  const [formErrors, setFormErrors] = useState(defaultFormErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const makeRequest = useRequest();
  const router = useRouter();

  const handleQuestionChange = (e) => {
    const val = e.target.value;
    setQuestion(val);

    // Clear question error when user starts typing
    if (formErrors.question) {
      setFormErrors((prev) => ({ ...prev, question: "" }));
    }
  };

  const handleAnswersChange = (key, value, index) => {
    setAnswers((prev) =>
      prev.map((ans, i) => (i !== index ? ans : { ...ans, [key]: value }))
    );

    // Clear specific answer field error
    if (formErrors.answers[index]?.[key]) {
      setFormErrors((prev) => {
        const newAnswerErrors = [...prev.answers];
        if (!newAnswerErrors[index]) {
          newAnswerErrors[index] = {};
        }
        newAnswerErrors[index] = { ...newAnswerErrors[index], [key]: "" };
        return { ...prev, answers: newAnswerErrors };
      });
    }
  };

  const handleAddAnswer = (is_correct = true) => {
    setAnswers((prev) => [
      ...prev,
      {
        answer: "",
        feedback: "",
        is_correct,
      },
    ]);

    // Add empty error slot for new answer
    setFormErrors((prev) => ({
      ...prev,
      answers: [...prev.answers, { answer: "", feedback: "" }],
    }));
  };

  const handleRemoveAnswer = (i) => {
    setAnswers((prev) => prev.filter((_, j) => i !== j));

    // Remove errors for this answer
    setFormErrors((prev) => {
      const newAnswerErrors = prev.answers.filter((_, j) => j !== i);
      return { ...prev, answers: newAnswerErrors };
    });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setGeneralError("");
      setFormErrors(defaultFormErrors);

      const res = await makeRequest("/admin/exercises/free-form", {
        method: "POST",
        body: { question, answers },
      });

      if (res.status === 200) {
        router.push("/admin/exercises");
      }
    } catch (e) {
      console.error("Submission error:", e);

      // Set general error
      if (e.response?.data?.error) {
        setGeneralError(e.response.data.error);
      } else {
        setGeneralError("Ein Fehler ist aufgetreten");
      }

      // Handle validation errors with simplified format
      if (e.response?.status === 422) {
        try {
          // Initialize error structure to match input structure

          const zodErrors = e.response?.data?.zodError;

          const newErrors = zodErrorToFormErrors(zodErrors, formErrors);

          setFormErrors(newErrors);
        } catch (parseError) {
          console.error("Error parsing validation results:", parseError);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/exercises");
  };

  return (
    <Column gap="md">
      <h2>Freitextübung erstellen</h2>
      <p>
        Um eine neue Freitextübung zu erstellen, fügen Sie eine Frage hinzu und
        geben Sie einige mögliche richtige Antworten an. <br />
        Wenn Sie den Schülern Feedback zu möglichen falschen Antworten geben
        möchten, können Sie dies tun, indem Sie Rückmeldungen hinzufügen.
      </p>
      {generalError && (
        <p className="error" role="alert">
          {generalError}
        </p>
      )}
      <label>
        Frage
        <textarea
          value={question}
          onChange={handleQuestionChange}
          placeholder="Geben Sie hier Ihre Frage ein"
          className={formErrors.question ? "error-input" : ""}
        />
        {formErrors.question && <p className="error">{formErrors.question}</p>}
      </label>
      <Column mt="xl">
        <Answers
          answers={answers}
          onRemoveAnswer={handleRemoveAnswer}
          onAddAnswer={handleAddAnswer}
          onAnswersChange={handleAnswersChange}
          errors={formErrors.answers}
        />
        <Row justify={"space-between"} gap="md" mt={"xl"} mb={"xl"}>
          <Button variant="outline" onClick={handleCancel}>
            Abbrechen
          </Button>
          <Button
            variant="secondary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Wird gesendet..." : "Absenden"}
          </Button>
        </Row>
      </Column>
    </Column>
  );
}

function Answers({
  answers,
  onAnswersChange,
  onAddAnswer,
  onRemoveAnswer,
  errors,
}) {
  const renderAnswers = () =>
    answers.map((ans, i) => (
      <AnswerItem
        key={i}
        index={i}
        answer={ans}
        onRemoveAnswer={() => onRemoveAnswer(i)}
        onAnswerChange={(key, value) => onAnswersChange(key, value, i)}
        errors={errors[i] || {}}
      />
    ));

  return (
    <Column gap="xl">
      <h3>Antworten {answers.length > 0 ? `(${answers.length})` : ""}</h3>
      {renderAnswers()}
      <Row gap="md">
        <Button width={"fit"} onClick={() => onAddAnswer(true)}>
          Richtige Antwort hinzufügen
        </Button>
        <Button width={"fit"} onClick={() => onAddAnswer(false)}>
          Falsche Antwort hinzufügen
        </Button>
      </Row>
    </Column>
  );
}

function AnswerItem({ answer, onAnswerChange, onRemoveAnswer, index, errors }) {
  const handleValidAnswerChange = (e) => {
    const val = e.target.value;
    onAnswerChange("answer", val);
  };

  const handleFeedbackChange = (e) => {
    const val = e.target.value;
    onAnswerChange("feedback", val);
  };

  const confirmRemove = () => {
    if (
      answer.answer.trim() === "" ||
      confirm("Möchten Sie diese Antwort wirklich entfernen?")
    ) {
      onRemoveAnswer();
    }
  };

  return (
    <Column gap="lg" b="2px solid var(--primary6)" p="md" r="md">
      <Row justify={"space-between"} align={"center"}>
        <span>
          <strong>#{index + 1}:</strong>{" "}
          {answer.is_correct ? "Richtige Antwort" : "Falsche Antwort"}
        </span>
        <Button size="sm" onClick={confirmRemove}>
          Entfernen
        </Button>
      </Row>
      <label>
        <span>Auslösende Antwort</span>
        <textarea
          value={answer.answer}
          onChange={handleValidAnswerChange}
          placeholder="Geben Sie hier die auslösende Antwort ein"
          className={errors.answer ? "error-input" : ""}
        />
        {errors.answer && <p className="error">{errors.answer}</p>}
      </label>
      <label>
        Feedback
        <textarea
          value={answer.feedback}
          onChange={handleFeedbackChange}
          placeholder="Optionales Feedback für diese Antwort"
          className={errors.feedback ? "error-input" : ""}
        />
        {errors.feedback && <p className="error-text">{errors.feedback}</p>}
      </label>
    </Column>
  );
}
