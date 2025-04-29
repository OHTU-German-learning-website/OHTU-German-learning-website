"use client";

import CreateFillInTheGap from "@/components/ui/fillinthegap/createfillinthegap";

export default function CreatePage() {
  const handleSave = (exercise) => {
    console.log("Tallennettu tehtävä:", exercise);
  };

  return (
    <div>
      <CreateFillInTheGap onSave={handleSave} />
    </div>
  );
}
