"use client";

import { Column } from "@/components/ui/layout/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function CreateExercise() {
  return (
    <Column>
      <h2>Create exercises</h2>
      <Link href="/admin/create-exercise/free-form">
        <Button>Free form</Button>
      </Link>
    </Column>
  );
}
