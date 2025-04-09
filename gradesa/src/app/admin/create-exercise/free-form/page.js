"use client";
import { Button } from "@/components/ui/button";
import { Column, Row } from "@/components/ui/layout/container";
import { useState } from "react";
import { useRequest } from "@/shared/hooks/useRequest";
import { useRouter } from "next/navigation";

export default function CreateFreeFormExercise() {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [errors, setErrors] = useState([]);
  const makeRequest = useRequest();
  const router = useRouter();
  const handleQuestionChange = (e) => {
    const val = e.target.value;
    setQuestion(val);
  };

  const handleAnswersChange = (key, value, index) =>
    setAnswers((prev) =>
      prev.map((ans, i) => (i !== index ? ans : { ...ans, [key]: value }))
    );

  const handleAddAnswer = (is_correct = true) => {
    setAnswers((prev) => [
      ...prev,
      {
        answer: "",
        feedback: "",
        is_correct,
      },
    ]);
  };

  const handleRemoveAnswer = (i) => {
    setAnswers((prev) => prev.filter((_, j) => i !== j));
  };

  const handleSubmit = async () => {
    try {
      setErrors([]);
      const res = await makeRequest("/admin/exercises/free-form", {
        method: "POST",
        body: { question, answers },
      });

      if (res.status === 200) {
        router.push("/admin/exercises");
      }
    } catch (e) {
      setErrors((prev) => [...prev, e.response.data.error]);
    }
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
      {errors?.length > 0 && <p className="error">{errors.join(", ")}</p>}
      <label>
        Frage
        <textarea value={question} onChange={handleQuestionChange} />
      </label>
      <Column mt="xl">
        <Answers
          answers={answers}
          onRemoveAnswer={handleRemoveAnswer}
          onAddAnswer={handleAddAnswer}
          onAnswersChange={handleAnswersChange}
        />
        <Row justify={"end"} mt={"xl"} mb={"xl"}>
          <Button variant="primary" onClick={handleSubmit}>
            Absenden
          </Button>
        </Row>
      </Column>
    </Column>
  );
}

function Answers({ answers, onAnswersChange, onAddAnswer, onRemoveAnswer }) {
  const renderAnswers = () =>
    answers.map((ans, i) => (
      <AnswerItem
        key={i}
        answer={ans}
        onRemoveAnswer={() => onRemoveAnswer(i)}
        onAnswerChange={(key, value) => onAnswersChange(key, value, i)}
      />
    ));

  return (
    <Column gap="xl">
      {renderAnswers()}
      <Row gap="md">
        <Button onClick={() => onAddAnswer(true)}>
          Richtige Antwort hinzufügen
        </Button>
        <Button onClick={() => onAddAnswer(false)}>
          Falsche Antwort hinzufügen
        </Button>
      </Row>
    </Column>
  );
}

function AnswerItem({ answer, onAnswerChange, onRemoveAnswer }) {
  const handleValidAnswerChange = (e) => {
    const val = e.target.value;
    onAnswerChange("answer", val);
  };

  const handleFeedbackChange = (e) => {
    const val = e.target.value;
    onAnswerChange("feedback", val);
  };

  return (
    <Column gap="lg" b="2px solid var(--primary6)" p="md" r="md">
      <Row justify={"space-between"}>
        <span>
          {answer.is_correct ? "Richtige Antwort" : "Falsche Antwort"}
        </span>
        <Button size="sm" onClick={onRemoveAnswer}>
          Entfernen
        </Button>
      </Row>
      <label>
        <span>Auslösende Antwort</span>
        <textarea value={answer.answer} onChange={handleValidAnswerChange} />
      </label>
      <label>
        Feedback
        <textarea value={answer.feedback} onChange={handleFeedbackChange} />
      </label>
    </Column>
  );
}
