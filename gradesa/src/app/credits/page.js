"use client";

import styles from "../page.module.css";

export default function Credits() {
  return (
    <div className="container">
      <section className={styles.creditsSection}>
        <h1>Credits</h1>
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
  );
}
