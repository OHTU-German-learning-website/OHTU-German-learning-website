"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../../../../page.module.css";
import DragdropLayout from "../../layout";
import { Area } from "@/components/ui/dragdrop/area";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../../../../globals.css";
import { Button } from "@/components/ui/button";
import useQuery from "@/shared/hooks/useQuery";

export default function StudentExercisePage() {
  const params = useParams();
  const router = useRouter();
  const { dnd_id } = params;

  const {
    data: exercise,
    error,
    isLoading,
  } = useQuery(`/exercises/dragdrop/${dnd_id}`);

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
      <DragdropLayout>
        <div className={styles.page}>
          <div className="exercise-container">
            <h1>{exercise.title}</h1>
            <DndProvider backend={HTML5Backend}>
              <Area
                initialDustbins={exercise.categories}
                allWords={exercise.draggable_words}
              />
            </DndProvider>
          </div>
        </div>
      </DragdropLayout>

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
