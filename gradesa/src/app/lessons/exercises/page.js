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
        {initialGrammatikTopics.map((topic, index) => (
          <div className="flex-parent-element" key={`${topic.title}-${index}`}>
            <div className="flex-child-element">
              <h2>{topic.title}</h2>
              <ul>
                {topic.exercises.slice(0, 3).map((exercise, exIndex) => (
                  <li key={`${index}-exercise-${exIndex}`}>
                    <button className="exercise-link">{exercise}</button>
                  </li>
                ))}
                {grammatik[index] &&
                  topic.exercises.slice(3).map((exercise, exIndex) => (
                    <li key={`${index}-more-${exIndex}`} className="more">
                      <button className="exercise-link">{exercise}</button>
                    </li>
                  ))}
              </ul>
              <div className="show-list">
                <button
                  className="show-more-link"
                  onClick={(e) => toggleShowMore(e, index)}
                >
                  {grammatik[index] ? "weniger anzeigen" : "mehr anzeigen"}{" "}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link href="/lessons">
        <button className="back-button">Back to lessons</button>
      </Link>
    </LessonsLayout>
  );
}
