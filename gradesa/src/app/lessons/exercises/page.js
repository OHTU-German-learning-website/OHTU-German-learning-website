"use client";
import { useState } from "react";
import LessonsLayout from "./layout";
import Link from "next/link";

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
        <button className="back-button">Back to lessons</button>
      </Link>
    </LessonsLayout>
  );
}
