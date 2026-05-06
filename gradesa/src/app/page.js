"use client";

import { LinkButton } from "@/components/ui/linkbutton";
import styles from "./page.module.css";

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
            <h3>Lerntechniken</h3>
            <p>Wie lernst du online am besten?</p>
            <p>Finde den passenden Übungstyp für dich!</p>
            <div className="feature-card">
              <LinkButton href="/pages/resources/1" size="md">
                Effektiv online lernen
              </LinkButton>
              <LinkButton href="/learning" size="md">
                Entdecke deine Lernstrategien
              </LinkButton>
            </div>
          </div>

          <div className="feature-card">
            <h3>Grammatik</h3>
            <p>Selbständig Grammatik lernen mit kommunikativen Situationen!</p>
            <div className="feature-card">
              <LinkButton href="/pages/communications" size="md">
                Kommunikationssituationen
              </LinkButton>
              <LinkButton href="/grammar/themes" size="md">
                Themen der Grammatik
              </LinkButton>
              <LinkButton href="/grammar/exercises" size="md">
                Alle Übungen anzeigen
              </LinkButton>
            </div>
          </div>
        </div>

        <div className="container">
          <section className={styles.creditsSection}>
            <LinkButton href="/credits" size="md">
              Credits
            </LinkButton>
          </section>
        </div>
      </div>
    </>
  );
}
