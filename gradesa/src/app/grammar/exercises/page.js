"use client";
import LessonsLayout from "./layout";
import Link from "next/link";
import { Column, Row } from "@/components/ui/layout/container";
import "./exercises.css";

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
  // Add other exercise types here
];

export default function ExercisePage({}) {
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
      </Column>
    </LessonsLayout>
  );
}
