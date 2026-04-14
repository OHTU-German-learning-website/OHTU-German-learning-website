"use client";

import { useState } from "react";
import Link from "next/link";

export default function TopicsList({ topics }) {
  const [expandedTopics, setExpandedTopics] = useState(topics.map(() => false));

  const toggleShowMore = (index) => {
    setExpandedTopics((current) =>
      current.map((show, currentIndex) =>
        currentIndex === index ? !show : show
      )
    );
  };

  return (
    <div className="lessons-container">
      {topics.map((topic, index) => (
        <div className="flex-parent-element" key={topic.id}>
          <div className="flex-child-element">
            <h2>{topic.name}</h2>
            <ul>
              {topic.subtopics
                .filter((_, subIndex) => expandedTopics[index] || subIndex < 3)
                .map((subtopic) => (
                  <li key={subtopic.slug}>
                    <Link
                      href={`/grammar/themes/${encodeURIComponent(subtopic.slug)}?view=topics`}
                    >
                      {subtopic.title}
                    </Link>
                  </li>
                ))}
            </ul>
            <div className="show-list">
              {topic.subtopics.length > 3 && (
                <button
                  className="show-more-link"
                  onClick={() => toggleShowMore(index)}
                >
                  {expandedTopics[index]
                    ? "weniger anzeigen"
                    : "mehr anzeigen"}{" "}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
