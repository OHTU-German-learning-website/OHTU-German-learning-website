"use client";

import { Suspense } from "react";
import AnchoredExercises from "@/components/ui/anchor/AnchoredExercises";

export default function Anchor({ id }) {
  return (
    <Suspense fallback={<div>Lädt...</div>}>
      <AnchoredExercises id={id} />
    </Suspense>
  );
}
