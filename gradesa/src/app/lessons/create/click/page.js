"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import WordSelectionExercise from "@/components/ui/click/click.js";

export default function CreateExercise() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [targetCategory, setTargetCategory] = useState("verbs");
  const [targetWordsText, setTargetWordsText] = useState("");
  const [allWordsText, setAllWordsText] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  // Process word lists into arrays
  const targetWords = targetWordsText
    .split(",")
    .map((word) => word.trim())
    .filter((word) => word !== "");

  const allWords = previewMode
    ? [
        ...new Set([
          ...targetWords,
          ...allWordsText
            .split(",")
            .map((word) => word.trim())
            .filter((word) => word !== ""),
        ]),
      ]
    : [];

  // Shuffle the words for the exercise
  const shuffledWords = [...allWords].sort(() => Math.random() - 0.5);

  const handlePreview = (e) => {
    e.preventDefault();
    setPreviewMode(true);
  };

  const handleSaveExercise = () => {
    // Here you would typically save the exercise to a database
    // For this example, we'll just show an alert
    alert("Exercise saved successfully!");
    // You could redirect to a list of exercises or clear the form
  };

  const handleEditAgain = () => {
    setPreviewMode(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Create Word Selection Exercise
      </h1>

      {!previewMode ? (
        <form onSubmit={handlePreview} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">Exercise Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="E.g., Identifying Verbs"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="E.g., Click on all the verbs in the list."
              rows={3}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Target Category</label>
            <input
              type="text"
              value={targetCategory}
              onChange={(e) => setTargetCategory(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="E.g., verbs, nouns, adjectives, etc."
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Target Words ({targetCategory})
            </label>
            <textarea
              value={targetWordsText}
              onChange={(e) => setTargetWordsText(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter words separated by commas (e.g., run, jump, swim)"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Additional Words (Non-{targetCategory})
            </label>
            <textarea
              value={allWordsText}
              onChange={(e) => setAllWordsText(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter additional words separated by commas (e.g., table, happy, quickly)"
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Preview Exercise
          </button>
        </form>
      ) : (
        <div>
          <div className="mb-8">
            <WordSelectionExercise
              title={title}
              instructions={instructions}
              targetCategory={targetCategory}
              targetWords={targetWords}
              allWords={shuffledWords}
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleEditAgain}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Edit Exercise
            </button>
            <button
              onClick={handleSaveExercise}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save Exercise
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
