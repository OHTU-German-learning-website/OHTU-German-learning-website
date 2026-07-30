"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import WordSelectionExercise from "@/components/ui/click/click.js";
import { Button } from "@/components/ui/button";
import AdminVisibleLastModified from "@/components/ui/admin-visible-last-modified";
import useQuery from "@/shared/hooks/useQuery";
import { useRequest } from "@/shared/hooks/useRequest";
import "./page.css";

export default function StudentExercisePage() {
  const params = useParams();
  const router = useRouter();
  const { click_id } = params;
  const makeRequest = useRequest();

  const {
    data: data,
    error,
    isLoading,
  } = useQuery(`/exercises/click/${click_id}`);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [falseWordFeedbacks, setFalseWordFeedbacks] = useState([]);

  useEffect(() => {
    if (!isSubmitted) {
      setFeedback("");
      setFalseWordFeedbacks([]);
    }
  }, [isSubmitted]);

  const exercise = data?.exercise || null;

  const handleSaveAnswers = async (selectedWords) => {
    try {
      await makeRequest(`/exercises/click/${click_id}/answers`, {
        selected_words: selectedWords,
      });
    } catch (error) {
      console.error("Error saving answers:", error);
    }
  };

  const handleSubmit = async (
    selectedWords,
    score,
    feedbackMessage,
    selectedFalseWordFeedbacks = []
  ) => {
    setFeedback(feedbackMessage);
    setFalseWordFeedbacks(selectedFalseWordFeedbacks);
    setIsSubmitted(true);

    // Save answers to the database
    await handleSaveAnswers(selectedWords);
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
      <AdminVisibleLastModified
        endpoint={`/admin/exercises/click/${click_id}`}
      />
      <WordSelectionExercise
        title={exercise.title}
        targetCategory={exercise.category}
        targetWords={exercise.target_words}
        allWords={exercise.all_words}
        sourceHtml={exercise.source_html}
        falseWordFeedbacks={data.falseWordFeedbacks || []}
        previousAnswers={data.userAnswers?.answer || []}
        isPreviewMode={false}
        onSubmit={handleSubmit} // Pass the submit handler as a prop
        isSubmitted={isSubmitted} // Pass submission state as a prop
        setIsSubmitted={setIsSubmitted} // Function to set submission state
        feedback={feedback} // Pass feedback as a prop
      />

      {falseWordFeedbacks.length > 0 && (
        <div className="false-word-feedback-panel">
          <h3 className="false-word-feedback-heading">
            Feedback zu falschen Wörtern
          </h3>
          <div className="false-word-feedback-grid">
            {falseWordFeedbacks.map((entry) => (
              <div
                key={`${entry.slotKey}-${entry.feedback}`}
                className="false-word-feedback-item"
              >
                <div className="false-word-feedback-item-word">
                  {entry.wordText || "Wort"}
                </div>
                <div className="false-word-feedback-item-text">
                  {entry.feedback}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
