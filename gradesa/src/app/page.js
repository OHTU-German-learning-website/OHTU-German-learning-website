"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function home() {
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
          <Button variant="outline" width="fit">
            <Link href="/learning">Entdecke deine Lernstrategien</Link>
          </Button>
        </section>

        <div className="features">
          <div className="feature-card">
            <h3>Lernplan</h3>
            <p>Finde die für dich passende Lernstrategie</p>
            <Button variant="outline" width="fit">
              <Link href="/learning">Entdecke deine Lernstrategien </Link>
            </Button>
          </div>

          <div className="feature-card">
            <h3>Grammatik</h3>
            <p>
              Üben Sie alltägliche Gespräche und verbessern Sie Ihre
              Sprechfähigkeiten mit interaktiven Lektionen.
            </p>
            <Button variant="outline" width="fit">
              <Link href="/lessons">Übungen </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
