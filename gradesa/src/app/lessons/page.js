"use client";
import { useState } from "react";
import LessonsLayout from "./layout";

const initialGrammatikTopics = [
  {
    title: "Grammatik 1",
    exercises: ["Übung 1", "Übung 2", "Übung 3", "Übung 4", "Übung 5"],
  },
  {
    title: "Grammatik 2",
    exercises: ["Übung 1", "Übung 2", "Übung 3", "Übung 4", "Übung 5"],
  },
  {
    title: "Grammatik 3",
    exercises: ["Übung 1", "Übung 2", "Übung 3", "Übung 4", "Übung 5"],
  },
  {
    title: "Grammatik 4",
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
      <div>
        <h1>Übungen</h1>
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
    </LessonsLayout>
  );
}
