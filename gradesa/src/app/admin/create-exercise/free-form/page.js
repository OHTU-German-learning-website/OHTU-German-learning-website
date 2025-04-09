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
      <h2>Create free form exercise</h2>
      <p>
        To create a new free form exercise, add a question, give it some
        possible correct answers. <br />
        If you'd like to give feedback to the student on possible incorrect
        answers, you can do so by adding feedbacks.
      </p>
      {errors?.length > 0 && <p className="error">{errors.join(", ")}</p>}
      <label>
        Question
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
            Submit
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
        <Button onClick={() => onAddAnswer(true)}>Add valid answer</Button>
        <Button onClick={() => onAddAnswer(false)}>Add incorrect answer</Button>
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
        <span>{answer.is_correct ? "Valid answer" : "Incorrect answer"}</span>
        <Button size="sm" onClick={onRemoveAnswer}>
          Remove
        </Button>
      </Row>
      <label>
        <span>Trigger answer</span>
        <textarea value={answer.answer} onChange={handleValidAnswerChange} />
      </label>
      <label>
        Feedback
        <textarea value={answer.feedback} onChange={handleFeedbackChange} />
      </label>
    </Column>
  );
}
