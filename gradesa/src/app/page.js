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
          <Link href="/learning">
            <Button variant="primary" size="lg" width="fit">
              Entdecke deine Lernstrategien
            </Button>
          </Link>
        </section>

        <div className="features">
          <div className="feature-card">
            <h3>Lernplan</h3>
            <p>Finde die für dich passende Lernstrategie</p>
            <Link href="/learning">
              <Button variant="outline" width="fit">
                Entdecke deine Lernstrategien
              </Button>
            </Link>
          </div>

          <div className="feature-card">
            <h3>Grammatik</h3>
            <p>
              Üben Sie alltägliche Gespräche und verbessern Sie Ihre
              Sprechfähigkeiten mit interaktiven Lektionen.
            </p>
            <Link href="/grammar">
              <Button variant="outline" width="fit">
                Grammatik lernen
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
