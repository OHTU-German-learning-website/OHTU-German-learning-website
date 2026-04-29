"use client";
import { Button } from "@/components/ui/button";
import { Column, Row } from "@/components/ui/layout/container";
import { useEffect, useRef, useState } from "react";
import { useRequest } from "@/shared/hooks/useRequest";
import { useRouter } from "next/navigation";
import { zodErrorToFormErrors } from "@/shared/schemas/schema-utils";
import "../multichoice/multichoice.css";

const defaultFormErrors = {
  title: "",
  questions: [],
};

export default function CreateFreeFormExercise() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      answers: [],
    },
  ]);
  const [generalError, setGeneralError] = useState("");
  const [formErrors, setFormErrors] = useState(defaultFormErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const successDialogRef = useRef(null);
  const makeRequest = useRequest();
  const router = useRouter();

  const handleQuestionChange = (questionIndex, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i !== questionIndex ? q : { ...q, question: value }))
    );

    if (formErrors.questions[questionIndex]?.question) {
      setFormErrors((prev) => {
        const newQuestions = [...(prev.questions || [])];
        if (!newQuestions[questionIndex]) return prev;

        newQuestions[questionIndex] = {
          ...newQuestions[questionIndex],
          question: "",
        };
        return { ...prev, questions: newQuestions };
      });
    }
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
    setQuestions((prev) => prev.filter((_, j) => j !== questionIndex));
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
      setFormErrors(defaultFormErrors);

      const res = await makeRequest("/admin/exercises/free-form", {
        method: "POST",
        body: { title, questions },
      });

      if (res.status === 200) {
        setShowSuccessDialog(true);
      }
    } catch (e) {
      console.error("Submission error:", e);
      if (e.response?.data?.error) {
        setGeneralError(e.response.data.error);
      } else {
        setGeneralError("Ein Fehler ist aufgetreten");
      }

      if (e.response?.status === 422) {
        try {
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
    router.push("/admin/create-exercise");
  };

  const handleSuccessOk = () => {
    setShowSuccessDialog(false);
    setTitle("");
    setQuestions([
      {
        question: "",
        answers: [],
      },
    ]);
    setGeneralError("");
    setFormErrors(defaultFormErrors);
  };

  const handleSuccessView = () => {
    router.push("/grammar/exercises/freeform");
  };

  useEffect(() => {
    if (showSuccessDialog && successDialogRef.current) {
      successDialogRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [showSuccessDialog]);

  return (
    <Column gap="md">
      <h2>Freitextübung erstellen</h2>
      <p>
        Um eine neue Freitextübung zu erstellen, fügen Sie eine Frage hinzu und
        geben Sie einige mögliche richtige und mindestens eine falsche Antwort
        an. <br />
        Wenn Sie den Schülern Feedback zu möglichen falschen Antworten geben
        möchten, können Sie dies tun, indem Sie Rückmeldungen hinzufügen.
      </p>
      {generalError && (
        <p className="error" role="alert">
          {generalError}
        </p>
      )}
      <div className="form-group">
        <label>Titel</label>
        <input
          className={`form-input${formErrors.title ? " input-error" : ""}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titel der Übung"
        />
        {formErrors.title && (
          <span className="field-error-hint">{formErrors.title}</span>
        )}
      </div>
      {questions.map((q, questionIndex) => (
        <Column
          key={questionIndex}
          gap="md"
          p="lg"
          b="2px solid var(--primary3)"
          br="md"
        >
          <Row justify={"space-between"} align={"center"}>
            <h3>Frage #{questionIndex + 1}</h3>
            {questions.length > 1 && (
              <Button
                type="button"
                size="sm"
                variant="outline"
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
              //   className={formErrors.question ? "error-input" : ""}
              // />
              // {formErrors.question && <p className="error">{formErrors.question}</p>}
            />
          </label>

          <Answers
            questionIndex={questionIndex}
            answers={q.answers}
            onRemoveAnswer={handleRemoveAnswer}
            onAddAnswer={handleAddAnswer}
            onAnswersChange={handleAnswersChange}
            errors={formErrors.questions?.[questionIndex]?.answers || []}
          />
        </Column>
      ))}

      <Row mt="md">
        <Button type="button" onClick={handleAddQuestion}>
          Weitere Frage hinzufügen
        </Button>
      </Row>

      <Row justify={"space-between"} gap="md" mt={"xl"} mb={"xl"}>
        <Button type="button" variant="outline" onClick={handleCancel}>
          Abbrechen
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Wird gesendet..." : "Absenden"}
        </Button>
      </Row>

      {showSuccessDialog && (
        <div ref={successDialogRef}>
          <Column
            gap="md"
            p="lg"
            mt="lg"
            b="2px solid var(--green)"
            br="md"
            bg="var(--green1)"
          >
            <h3>Übung wurde erfolgreich erstellt.</h3>

            <Row gap="md">
              <Button type="button" variant="outline" onClick={handleSuccessOk}>
                OK
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleSuccessView}
              >
                Zur Liste
              </Button>
            </Row>
          </Column>
        </div>
      )}
    </Column>
  );
}

function Answers({
  questionIndex,
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
        onRemoveAnswer={() => onRemoveAnswer(questionIndex, i)}
        onAnswerChange={(key, value) =>
          onAnswersChange(questionIndex, i, key, value)
        }
        errors={errors[i] || {}}
      />
    ));

  return (
    <Column gap="xl">
      <h3>Antworten {answers.length > 0 ? `(${answers.length})` : ""}</h3>
      {renderAnswers()}
      <Row gap="md">
        <Button
          type="button"
          width={"fit"}
          onClick={() => onAddAnswer(questionIndex, true)}
        >
          Richtige Antwort hinzufügen
        </Button>
        <Button
          type="button"
          width={"fit"}
          onClick={() => onAddAnswer(questionIndex, false)}
        >
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
    <Column gap="lg" b="2px solid var(--primary3)" p="md" r="md">
      <Row justify={"space-between"} align={"center"}>
        <span>
          <strong>#{index + 1}:</strong>{" "}
          {answer.is_correct ? "Richtige Antwort" : "Falsche Antwort"}
        </span>
        <Button type="button" size="sm" onClick={confirmRemove}>
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
