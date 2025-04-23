"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import WordSelectionExercise from "@/components/ui/click/click.js";
import { Button } from "@/components/ui/button";
import useQuery from "@/shared/hooks/useQuery";

export default function StudentExercisePage() {
  const params = useParams();
  const router = useRouter();
  const { click_id } = params;

  const {
    data: exercise,
    error,
    isLoading,
  } = useQuery(`/exercises/click/${click_id}`);

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
