"use client";
import { useState } from "react";
import Link from "next/link";

const initialGrammarTopics = [
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
  const [grammar, setGrammar] = useState(
    initialGrammarTopics.map(() => false)
  );

  const toggleShowMore = (event, index) => {
    event.preventDefault();
    setGrammar(grammar.map((show, i) => (i === index ? !show : show)));
  };

  return (
      <div className="lessons-container">
        <h1>Übungen</h1>
        {initialGrammarTopics.map((topic, index) => (
          <div className="flex-parent-element" key={`${topic.title}-${index}`}>
            <div className="flex-child-element">
              <h2>{topic.title}</h2>
              <ul>
                {topic.exercises.slice(0, 3).map((exercise, exIndex) => (
                  <li key={`${index}-exercise-${exIndex}`}>
                    <Link href={`/lessons/exercises`}> 
                    {/* At the moment, all the Übung-links goes to the same page. */}
                      <button className="exercise-link">{exercise}</button>
                    </Link>
                  </li>
                ))}
                {grammar[index] &&
                  topic.exercises.slice(3).map((exercise, exIndex) => (
                    <li key={`${index}-more-${exIndex}`} className="more">
                      <Link href={`/lessons/exercises`}>
                        <button className="exercise-link">{exercise}</button>
                      </Link>{" "}
                    </li>
                  ))}
              </ul>
              <div className="show-list">
                <button
                  className="show-more-link"
                  onClick={(e) => toggleShowMore(e, index)}
                >
                  {grammar[index] ? "weniger anzeigen" : "mehr anzeigen"}{" "}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
  );
}
