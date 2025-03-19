"use client";
import { useState } from "react";
import GrammarLayout from "./layout";
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
    <GrammarLayout>
      <div className="grammar-container">
        <h1>Grammatik 1</h1>
        <div className="flex-parent-element">
          <ul className="exercise-list">
            {initialGrammarTopics[0].exercises.map((exercise, exIndex) => (
              <li key={`exercise-${exIndex}`}>
                <Link href={`/grammar/exercises`}>
                  <button className="exercise-link">{exercise}</button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Link href="/grammar">
        <button className="back-button">Zurück zu den Übungen</button>
      </Link>
    </GrammarLayout>
  );
}
