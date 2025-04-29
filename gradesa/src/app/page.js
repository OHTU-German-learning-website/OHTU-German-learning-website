"use client";

import { LinkButton } from "@/components/ui/linkbutton";

export default function Home() {
  return (
    <>
      <div className="container">
        <section className="hero">
          <h1>Deutsch lerner</h1>
          <p>
            Beherrschen Sie die Grundlagen der deutschen Grammatik,
            einschließlich Artikel, Verbkonjugationen und grundlegender
            Satzstruktur.
          </p>
          <LinkButton href="/learning" variant="primary" size="lg">
            Entdecke deine Lernstrategien
          </LinkButton>
        </section>

        <div className="features">
          <div className="feature-card">
            <h3>Lernplan</h3>
            <p>Finde die für dich passende Lernstrategie</p>
            <LinkButton href="/learning">
              Entdecke deine Lernstrategien
            </LinkButton>
          </div>

          <div className="feature-card">
            <h3>Grammatik</h3>
            <p>
              Üben Sie alltägliche Gespräche und verbessern Sie Ihre
              Sprechfähigkeiten mit interaktiven Lektionen.
            </p>
            <LinkButton href="/grammar/communications" size="md">
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
