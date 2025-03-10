"use client";
import React from "react";
import { useRouter } from "next/navigation";
import WordSelectionExercise from "@/components/ui/click/click.js";

// This would typically come from an API or database
const getDummyExercise = (id) => {
  // Example exercise data
  return {
    id: 1,
    title: "Identifying Verbs",
    instructions: "Select all the verbs from the list below.",
    targetCategory: "verbs",
    targetWords: [
      "run",
      "jump",
      "swim",
      "write",
      "read",
      "eat",
      "sing",
      "dance",
    ],
    allWords: [
      "run",
      "table",
      "jump",
      "happy",
      "swim",
      "quickly",
      "write",
      "blue",
      "read",
      "mountain",
      "eat",
      "beautiful",
      "sing",
      "tomorrow",
      "dance",
      "computer",
    ],
  };
};

export default function StudentExercisePage() {
  const router = useRouter();
  const id = router.query;

  // In a real application, you would fetch the exercise data from an API
  const exercise = getDummyExercise(id);

  if (!exercise) {
    return <div className="p-6">Loading exercise...</div>;
  }

  return (
    <div>
      <h1>Student Exercise</h1>

      <WordSelectionExercise
        title={exercise.title}
        instructions={exercise.instructions}
        targetCategory={exercise.targetCategory}
        targetWords={exercise.targetWords}
        allWords={exercise.allWords}
      />

      <div>
        <button onClick={() => router.push("/lessons/exercises")}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
