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
            <div className={styles.creditsList}>
              <p className={styles.creditsItem}>
                Diese Webseiten entstanden in einem Autorenkollektiv der
                Universitäten Helsinki, Oulu und Turku unter der Leitung von{" "}
                <a href="mailto:michi@dlc.fi" className={styles.creditsLink}>
                  Dr. Michael Möbius
                </a>
                .
              </p>
              <br></br>
              <p className={styles.creditsItem}>
                Die Entwicklung wurde gefördert durch die{" "}
                <a
                  href="https://foundationhollo.fi/"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.creditsLink}
                >
                  Stiftung Erkki J. Hollo
                </a>
                .
              </p>
              <p className={styles.creditsItem}>
                Programmierung durch IT-Studierende der Universität Helsinki
              </p>
              <p className={styles.creditsItem}>
                Technischer Support und Hosting: Universität Helsinki
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
