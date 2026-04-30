"use client";

import { Column } from "@/components/ui/layout/container";
import "./create-exercise.css";

import { LinkButton } from "@/components/ui/linkbutton";

export default function CreateExercise() {
  return (
    <Column gap="md">
      <h2>Übungen erstellen</h2>
      <LinkButton href="/admin/create-exercise/free-form">
        Freie Übung
      </LinkButton>
      <LinkButton href="/admin/create-exercise/click">Klick Übung</LinkButton>
      <LinkButton href="/admin/create-exercise/multichoice">
        Multiple choice
      </LinkButton>
      <LinkButton href="/admin/create-exercise/dragdrop">
        Sortieren/Gruppieren
      </LinkButton>
      <LinkButton href="/admin/create-exercise/fillinthegap">
        Lückentext
      </LinkButton>
    </Column>
  );
}
