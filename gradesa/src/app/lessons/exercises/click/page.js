"use client";
import React from "react";
import { useRouter } from "next/navigation";
import WordSelectionExercise from "@/components/ui/click/click.js";
import { Button } from "@/components/ui/button";

// This would typically come from an API or database
const getDummyExercise = (id) => {
  // Example exercise data
  return {
    id: 1,
    title: "Verben identifizieren",
    targetCategory: "Verben",
    targetWords: [
      "laufen",
      "springen",
      "schwimmen",
      "schreiben",
      "lesen",
      "essen",
      "singen",
      "tanzen",
      "sind.",
    ],
    allWords: [
      "Die",
      "Kinder",
      "laufen",
      "und",
      "springen",
      "im",
      "Park.",
      "Sie",
      "schwimmen",
      "im",
      "See",
      "und",
      "schreiben",
      "Geschichten",
      "über",
      "ihre",
      "Abenteuer.",
      "Am",
      "Abend",
      "lesen",
      "sie",
      "Bücher",
      "und",
      "essen",
      "gemeinsam",
      "Abendessen.",
      "Manchmal",
      "singen",
      "sie",
      "Lieder",
      "und",
      "tanzen",
      "bis",
      "sie",
      "müde",
      "sind.",
    ],
  };
};

export default function StudentExercisePage() {
  const router = useRouter();
  const id = router.query;

  // In a real application, you would fetch the exercise data from an API
  const exercise = getDummyExercise(id);

  if (!exercise) {
    return <div>Übung wird geladen...</div>;
  }

  return (
    <div>
      <WordSelectionExercise
        title={exercise.title}
        targetCategory={exercise.targetCategory}
        targetWords={exercise.targetWords}
        allWords={exercise.allWords}
      />

      <br />
      <div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => router.push("/lessons/exercises")}
        >
          Zurück zum Dashboard
        </Button>
      </div>
    </div>
  );
}
