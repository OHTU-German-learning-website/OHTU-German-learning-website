"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import WordSelectionExercise from "@/components/ui/click/click.js";
import { Button } from "@/components/ui/button";
import useQuery from "@/shared/hooks/useQuery";

export default function StudentExercisePage() {
  const params = useParams();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exercise, setExercise] = useState(null);
  const { click_id } = params;

  const response = useQuery(`/exercises/click/${click_id}`);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!exercise) {
        setError("Keine Übung gefunden.");
        setLoading(false);
      }
    }, 10000);

    if (response.error == "Request failed with status code 400") {
      setError("Ungültige Übungs-ID");
      setLoading(false);
      clearTimeout(timer);
    } else if (response.data && response.data.length > 0) {
      setExercise(response.data[0]);
      setLoading(false);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [response]);

  if (loading) {
    return <div>Übung wird geladen...</div>;
  }

  if (error) {
    return <div>{error}</div>;
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
          onClick={() => router.push("/grammar/themes")}
        >
          Zurück zum Dashboard
        </Button>
      </div>
    </div>
  );
}
