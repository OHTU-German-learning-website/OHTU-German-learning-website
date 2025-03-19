"use client";

import Link from "next/link";

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
          <Link href="/learning" className="cta-button">
            Entdecke deine Lernstrategien{" "}
          </Link>
        </section>

        <div className="features">
          <div className="feature-card">
            <h3>Lernplan</h3>
            <p>Finde die für dich passende Lernstrategie</p>
            <Link href="/learning" className="cta-button">
              Entdecke deine Lernstrategien{" "}
            </Link>
          </div>

          <div className="feature-card">
            <h3>Grammatik</h3>
            <p>
              Üben Sie alltägliche Gespräche und verbessern Sie Ihre
              Sprechfähigkeiten mit interaktiven Lektionen.
            </p>
            <Link href="/grammar" className="cta-button">
              Grammatik{" "}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
