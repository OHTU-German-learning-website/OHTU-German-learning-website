"use client";

import { Column } from "@/components/ui/layout/container";
import "./create-exercise.css";

import { LinkButton } from "@/components/ui/linkbutton";

export default function CreateExercise() {
  return (
    <Column gap="md">
      <h2>Create exercises</h2>
      <LinkButton href="/admin/create-exercise/free-form">Free form</LinkButton>
      <LinkButton href="/admin/create-exercise/click">Klick Übung</LinkButton>
      <LinkButton href="/admin/create-exercise/dragdrop">
        Drag und drop
      </LinkButton>
    </Column>
  );
}
