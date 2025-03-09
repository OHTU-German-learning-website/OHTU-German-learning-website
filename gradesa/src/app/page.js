"use client";

import Link from "next/link";

export default function home() {
  return (
    <>
      <div className="container">
        <section className="hero">
          <h1>Deutch lerner</h1>
          <p>
            Master the German language with our comprehensive learning platform.
            From basics to fluency, we're here to guide you every step of the
            way.
          </p>
          <Link href="/learning" className="cta-button">
            Entdecke deine Lernstrategien{" "}
          </Link>
        </section>

        <div className="features">
          <div className="feature-card">
            <span className="level-indicator beginner">Beginner</span>
            <h3>Basic Grammar</h3>
            <p>
              Master the fundamentals of German grammar, including articles,
              verb conjugations, and basic sentence structure.
            </p>
            <Link href="/learning" className="cta-button">
              Learning{" "}
            </Link>
          </div>

          <div className="feature-card">
            <span className="level-indicator intermediate">Intermediate</span>
            <h3>Conversation Skills</h3>
            <p>
              Practice everyday conversations and improve your speaking skills
              with interactive lessons.
            </p>
            <Link href="/lessons" className="cta-button">
              Lessons{" "}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
