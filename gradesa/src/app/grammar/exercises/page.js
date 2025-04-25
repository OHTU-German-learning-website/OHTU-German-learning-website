"use client";
import { useState } from "react";
import LessonsLayout from "./layout";
import Link from "next/link";
import { Column, Row } from "@/components/ui/layout/container";
import "./exercises.css";
import { Button } from "@/components/ui/button";
const exerciseTypes = [
  {
    title: "Freie Übungen",
    description: "Üben mit offenen Fragen",
    link: "/grammar/exercises/freeform",
    image: "📝",
  },
  {
    title: "Klick-Übungen",
    description: "Üben mit Klick-Interaktionen",
    link: "/grammar/exercises/click",
    image: "🖱️",
  },
  {
    title: "Multiple-Choice-Übungen",
    description: "Üben mit Multiple-Choice-Fragen",
    link: "/grammar/exercises/multichoice",
    image: "📋",
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
      <Column>
        <h1>Übungstypen</h1>

        <Column gap="md">
          {exerciseTypes.map((type, index) => (
            <Link href={type.link} key={index}>
              <Row
                className="exercise-type-card"
                align="center"
                p="lg"
                mb="md"
                br="md"
                bg="var(--bg2)"
                transition="all 0.3s ease"
              >
                <Row pl="xl" className="exercise-icon">
                  {type.image}
                </Row>
                <Column align="start" justify="center">
                  <h4 className="exercise-title">{type.title}</h4>
                  <span className="exercise-description">
                    {type.description}
                  </span>
                </Column>
              </Row>
            </Link>
          ))}
        </Column>

        <h1>Grammatik 1</h1>
        <Column gap="md">
          {initialGrammarTopics[0].exercises.map((exercise, exIndex) => (
            <Row key={`exercise-${exIndex}`}>
              <Link href={`/lessons/exercises`}>
                <button className="exercise-link">{exercise}</button>
              </Link>
            </Row>
          ))}
        </Column>
      </Column>
      <Link href="/lessons">
        <Button width="fit" size="lg">
          Zurück zu den Übungen
        </Button>
      </Link>
    </LessonsLayout>
  );
}
