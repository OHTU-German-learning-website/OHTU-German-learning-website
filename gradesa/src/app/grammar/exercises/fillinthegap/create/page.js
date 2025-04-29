"use client";

import CreateFillInTheGap from "@/components/ui/fillinthegap/createfillinthegap";

export default function CreatePage() {
  const handleSave = (exercise) => {
    console.log("Gespeicherte Aufgabe:", exercise);
  };

  return (
    <div>
      <CreateFillInTheGap onSave={handleSave} />
    </div>
  );
}
