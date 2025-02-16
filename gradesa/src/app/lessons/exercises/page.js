"use client";
import { useState } from "react";
import LessonsLayout from "./layout";
import Link from "next/link";

const initialGrammatikTopics = [
  {
    title: "Grammatik 1",
    exercises: ["Übung 1", "Übung 2", "Übung 3", "Übung 4", "Übung 5"],
  },
];

export default function LessonsPage() {
  const [grammatik, setGrammatik] = useState(
    initialGrammatikTopics.map(() => false)
  );

  const toggleShowMore = (event, index) => {
    event.preventDefault();
    setGrammatik(grammatik.map((show, i) => (i === index ? !show : show)));
  };

  return (
    <LessonsLayout>
      <div className="lessons-container">
        <h1>Grammatik 1</h1>
        <div className="flex-parent-element">
          <ul className="exercise-list">
            {initialGrammatikTopics[0].exercises.map((exercise, exIndex) => (
              <li key={`exercise-${exIndex}`}>
                <Link href={`/lessons/exercises`}>
                  <button className="exercise-link">{exercise}</button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <br></br>
      <Link href="/lessons">
        <button className="back-button">Back to lessons</button>
      </Link>
    </LessonsLayout>
  );
}
