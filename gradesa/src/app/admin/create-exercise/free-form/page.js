"use client";
import { Button } from "@/components/ui/button";
import { Column, Row } from "@/components/ui/layout/container";
import { useState } from "react";

export default function CreateFreeFormExercise() {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);

  const handleQuestionChange = (e) => {
    const val = e.target.value;
    setQuestion(val);
  };

  const handleAnswersChange = (key, value, index) =>
    setAnswers((prev) =>
      prev.map((ans, i) => (i !== index ? ans : { ...ans, [key]: value }))
    );

  const handleAddAnswer = () => {
    setAnswers((prev) => [
      ...prev,
      {
        answer: "",
        feedbacks: [],
      },
    ]);
  };

  const handleRemoveAnswer = (i) => {
    console.log("removing", i);
    setAnswers((prev) => prev.filter((_, j) => i !== j));
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
      <Button onClick={onAddAnswer}>Add answer</Button>
    </Column>
  );
}

function AnswerItem({ answer, onAnswerChange, onRemoveAnswer }) {
  const handleFeedbacksChange = (key, value, index) =>
    onAnswerChange(
      "feedbacks",
      answer.feedbacks.map((fb, i) =>
        i !== index ? fb : { ...fb, [key]: value }
      )
    );

  const handleAddFeedback = () => {
    onAnswerChange("feedbacks", [
      ...answer.feedbacks,
      {
        answer: "",
        feedback: "",
      },
    ]);
  };

  const handleRemoveFeedback = (i) => {
    onAnswerChange(
      "feedbacks",
      answer.feedbacks.filter((_, j) => i !== j)
    );
  };

  const handleValidAnswerChange = (e) => {
    const val = e.target.value;
    onAnswerChange("answer", val);
  };

  return (
    <Column gap="lg" b="2px solid var(--primary6)" p="md" r="md">
      <label>
        <Row gap={"md"} justify={"space-between"}>
          <span>Valid answer</span>
          <Button size="sm" onClick={onRemoveAnswer}>
            Remove answer
          </Button>
        </Row>
        <textarea value={answer.answer} onChange={handleValidAnswerChange} />
      </label>
      <Column mt="lg">
        <span>Feedbacks</span>
        <Feedbacks
          feedbacks={answer.feedbacks}
          onAddFeedback={handleAddFeedback}
          onRemoveFeedback={handleRemoveFeedback}
          onFeedbackChange={handleFeedbacksChange}
        />
      </Column>
    </Column>
  );
}

function Feedbacks({
  feedbacks,
  onFeedbacksChange,
  onAddFeedback,
  onRemoveFeedback,
}) {
  const renderFeedbacks = () =>
    feedbacks?.map((fb, i) => (
      <FeedbackItem
        feedback={fb}
        key={i}
        onRemoveFeedback={() => onRemoveFeedback(i)}
        onFeedbackChange={(key, val) => onFeedbacksChange(key, val, i)}
      />
    ));

  return (
    <Column gap="md">
      {renderFeedbacks()}
      <Button onClick={onAddFeedback}>Add feedback</Button>
    </Column>
  );
}

function FeedbackItem({ feedback, onFeedbackChange, onRemoveFeedback }) {
  const handleTriggerAnswerChange = (e) => {
    const val = e.target.value;
    onFeedbackChange("answer", val);
  };

  const handleFeedbackChange = (e) => {
    const val = e.target.value;
    onFeedbackChange("feedback", val);
  };

  return (
    <Row gap="xl" w="100%" align="end">
      <label>
        Trigger answer
        <textarea
          value={feedback.answer}
          onChange={handleTriggerAnswerChange}
        />
      </label>
      <label>
        Feedback
        <textarea value={feedback.feedback} onChange={handleFeedbackChange} />
      </label>
      <Column align="end" ml={"auto"}>
        <Button size="sm" onClick={onRemoveFeedback}>
          Remove
        </Button>
      </Column>
    </Row>
  );
}
