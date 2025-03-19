"use client";
import { useState } from "react";
import Link from "next/link";
import { Container } from "../../components/ui/layout/container";

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

export default function GrammarPage() {
  const [grammar, setGrammar] = useState(initialGrammarTopics.map(() => false));

  const toggleShowMore = (event, index) => {
    setGrammar(grammar.map((show, i) => (i === index ? !show : show)));
  };

  return (
    <div>
      <h1>Übungen</h1>
      <Container p={["8px", "12px", "16px"]}>
        {initialGrammarTopics.map((topic, i) => (
          <div className="flex-parent-element" key={`${topic.title}-${i}`}>
            <div className="flex-child-element">
              <h2>{topic.title}</h2>
              <ul>
                {topic.exercises
                  .filter((_, j) => {
                    console.log(grammar[i] || j < 3);
                    return grammar[i] || j < 3;
                  })
                  .map((exercise, exIndex) => (
                    <li key={`${i}-exercise-${exIndex}`}>
                      {/* All links go to the same page -> WIP (need DB) */}
                      <Link href={`/grammar/exercises`}>
                        <button className="exercise-link">{exercise}</button>
                      </Link>
                    </li>
                  ))}
              </ul>
              <div className="show-list">
                <button
                  className="show-more-link"
                  onClick={(e) => toggleShowMore(e, i)}
                >
                  {grammar[i] ? "weniger anzeigen" : "mehr anzeigen"}{" "}
                </button>
              </div>
            </div>
          </div>
        ))}
      </Container>
    </div>
  );
}
