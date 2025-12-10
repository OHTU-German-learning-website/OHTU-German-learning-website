"use client";

import { LinkButton } from "@/components/ui/linkbutton";

export default function Home() {
  return (
    <>
      <div className="container">
        <section className="hero">
          <h1>Gradesa 2.0</h1>
          <p>
            Grammatik Deutsch selbständig und autonom <br /> Lerne und übe die
            deutsche Grammatik mit kommunikativen Situationen!
          </p>
        </section>

        <div className="features">
          <div className="feature-card">
            <h3>Lernplan</h3>
            <p>Wie lernst du online am besten?</p>
            <LinkButton href="/learning">
              Entdecke deine Lernstrategien
            </LinkButton>
          </div>

          <div className="feature-card">
            <h3>Grammatik</h3>
            <p>Selbständig Grammatik lernen mit kommunikativen Situationen!</p>
            <LinkButton href="/pages/communications" size="md">
              Kommunikationssituationen
            </LinkButton>
            <LinkButton href="/grammar/themes" size="md">
              Themen der Grammatik
            </LinkButton>
            <LinkButton href="/grammar/exercises" size="md">
              Übungen
            </LinkButton>
          </div>
        </div>
      </div>
    </>
  );
}
