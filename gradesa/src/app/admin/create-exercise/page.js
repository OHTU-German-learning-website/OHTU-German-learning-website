"use client";

import { Column } from "@/components/ui/layout/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import "./create-exercise.css";

export default function CreateExercise() {
  return (
    <Column className="choose-exercise">
      <h2>Übungen erstellen</h2>
      <Link href="/admin/create-exercise/free-form">
        <Button>Freie Übung</Button>
      </Link>
      <Link href="/admin/create-exercise/click">
        <Button>Klick-Übung</Button>
      </Link>
    </Column>
  );
}
