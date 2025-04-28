"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import WordSelectionExercise from "@/components/ui/click/click.js";
import { Button } from "@/components/ui/button";
import useQuery from "@/shared/hooks/useQuery";
import { useRequest } from "@/shared/hooks/useRequest";

export default function StudentExercisePage() {
  const params = useParams();
  const router = useRouter();
  const { click_id } = params;
  const makeRequest = useRequest();

  const {
    data: exercise,
    error,
    isLoading,
  } = useQuery(`/exercises/click/${click_id}`);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSaveAnswers = async (selectedWords, targetWords) => {
    try {
      await makeRequest(`/exercises/click/${click_id}/answers`, {
        selected_words: selectedWords,
        target_words: targetWords,
      });
      console.log("Answers saved successfully!");
    } catch (error) {
      console.error("Error saving answers:", error);
    }
  };

  const handleSubmit = async (selectedWords, score, feedbackMessage) => {
    setFeedback(feedbackMessage);
    setIsSubmitted(true);

    // Save answers to the database
    await handleSaveAnswers(selectedWords, exercise.target_words);
  };

  if (isLoading) {
    return <div>Übung wird geladen...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!exercise) {
    return <div>Übung wird geladen...</div>;
  }

  return (
    <div>
      <WordSelectionExercise
        title={exercise.title}
        targetCategory={exercise.category}
        targetWords={exercise.target_words}
        allWords={exercise.all_words}
        isPreviewMode={false}
        onSubmit={handleSubmit} // Pass the submit handler as a prop
        isSubmitted={isSubmitted} // Pass submission state as a prop
        feedback={feedback} // Pass feedback as a prop
      />

      <br />
      <div>
        <Button
          size="sm"
          width="fit"
          variant="secondary"
          onClick={() => router.push("/grammar/exercises/click")}
        >
          Zurück zum Dashboard
        </Button>
      </div>
    </div>
  );
}
