"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import WordSelectionExercise from "@/components/ui/click/click.js";
import { Button } from "@/components/ui/button";
import useQuery from "@/shared/hooks/useQuery";

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
  const [error, setError] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    const fetchId = async () => {
      if (!router.isReady) return;

      const { id } = router.query;
      console.log(id);
      setId(id);
    };

    fetchId();
  }, [router.isReady, router.query]);

  const response = useQuery(`/exercises/click/${id}`);

  (async () => {
    const exercise = await response.data[0];
    setExercise(exercise);
  })();

  if (error) {
    return <div>{error}</div>;
  }

  if (!exercise) {
    return <div>Keine Übung gefunden.</div>;
  }
  return (
    <div>
      <WordSelectionExercise
        title={exercise.title}
        targetCategory={exercise.category}
        targetWords={exercise.target_words}
        allWords={exercise.all_words}
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
