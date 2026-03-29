"use client";
import { useState } from "react";
import { LinkButton } from "@/components/ui/linkbutton";
import Link from "next/link";
import { grammarTopics } from "./topics";

export default function ThemesPage() {
  const [grammar, setGrammar] = useState(grammarTopics.map(() => false));

  const toggleShowMore = (event, index) => {
    setGrammar(grammar.map((show, i) => (i === index ? !show : show)));
  };

  return (
    <div className="themes-title">
      <LinkButton href="/grammar/alphabetical">
        Grammatik in alphabetischer Reihenfolge
      </LinkButton>
      <h1>Themen der Grammatik</h1>

      <div className="lessons-container">
        {grammarTopics.map((topic, i) => (
          <div className="flex-parent-element" key={`${topic.title}-${i}`}>
            <div className="flex-child-element">
              <h2>{topic.title}</h2>
              <ul>
                {topic.subtopics
                  .filter((_, j) => {
                    return grammar[i] || j < 3;
                  })
                  .map((subtopic, subIndex) => (
                    <li key={`${i}-subtopic-${subIndex}`}>
                      <Link href={`${subtopic.link}?view=topics`}>
                        {subtopic.name}
                      </Link>
                    </li>
                  ))}
              </ul>
              <div className="show-list">
                {topic.subtopics.length > 3 && (
                  <button
                    className="show-more-link"
                    onClick={(e) => toggleShowMore(e, i)}
                  >
                    {grammar[i] ? "weniger anzeigen" : "mehr anzeigen"}{" "}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
