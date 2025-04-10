"use client";
import { useState } from "react";
import LessonsLayout from "./layout";
import Link from "next/link";

const exerciseTypes = [
  {
    title: "Free Form Exercises",
    description: "Practice with open-ended questions",
    link: "/grammar/exercises/freeform",
    image: "📝",
  },
  // Add other exercise types here
];

const initialGrammarTopics = [
  {
    title: "Grammatik 1",
    exercises: ["Übung 1", "Übung 2", "Übung 3", "Übung 4", "Übung 5"],
  },
];

export default function ExercisePage({}) {
  const [grammar, setgrammar] = useState(initialGrammarTopics.map(() => false));

  return (
    <LessonsLayout>
      <div className="lessons-container">
        <h1 className="text-2xl font-bold mb-6">Exercise Types</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10">
          {exerciseTypes.map((type, index) => (
            <Link
              key={index}
              href={type.link}
              className="block p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{type.image}</div>
              <h2 className="text-xl font-semibold mb-2">{type.title}</h2>
              <p className="text-gray-600">{type.description}</p>
            </Link>
          ))}
        </div>

        <h1>Grammatik 1</h1>
        <div className="flex-parent-element">
          <ul className="exercise-list">
            {initialGrammarTopics[0].exercises.map((exercise, exIndex) => (
              <li key={`exercise-${exIndex}`}>
                <Link href={`/lessons/exercises`}>
                  <button className="exercise-link">{exercise}</button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Link href="/lessons">
        <button className="back-button">Zurück zu den Übungen</button>
      </Link>
    </LessonsLayout>
  );
}
