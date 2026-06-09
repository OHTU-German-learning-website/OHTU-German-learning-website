"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../../../../page.module.css";
import DragdropLayout from "../../layout";
import { MemoizedArea as Area } from "@/components/ui/dragdrop/area";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../../../../globals.css";
import useQuery from "@/shared/hooks/useQuery";
import { LinkButton } from "@/components/ui/linkbutton";
import AdminVisibleLastModified from "@/components/ui/admin-visible-last-modified";

export default function Dragdrop({}) {
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

  if (!exercise || !exercise.title) {
    return <div>Übung wird geladen...</div>;
  }

  return (
    <div>
      <DragdropLayout>
        <div className={styles.page}>
          <div className="exercise-container">
            <h2>{exercise.title}</h2>
            <AdminVisibleLastModified
              endpoint={`/admin/exercises/dragdrop/${dnd_id}`}
            />
            {!!exercise.description && <p>{exercise.description}</p>}
            <DndProvider backend={HTML5Backend}>
              <Area exerciseID={dnd_id} />
            </DndProvider>
          </div>
        </div>
      </DragdropLayout>

      <br />
      <div>
        <LinkButton
          size="sm"
          variant="secondary"
          href="/grammar/exercises/dragdrop"
        >
          Zurück zu allen Sortieren/Gruppieren-Übungen
        </LinkButton>
      </div>
    </div>
  );
}
