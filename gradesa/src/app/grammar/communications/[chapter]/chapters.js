import { Column } from "@/components/ui/layout/container";

export const chapters = [
  {
    id: "1",
    title: "1. Über Vergangenes sprechen",
    content: Chapter1,
    link: "/grammar/communications/1",
  },
  {
    id: "2",
    title: "2. Anleitungen formulieren",
    content: Chapter2,
    link: "/grammar/communications/2",
  },
  {
    id: "3",
    title: "3. Offizielle Mitteilungen (Nachrichten usw.) formulieren",
    content: Chapter3,
    link: "/grammar/communications/3",
  },
  {
    id: "4",
    title:
      "4. Höflich mit anderen Menschen umgehen (Sich vorstellen, Gäste empfangen und betreuen, Small Talk)",
    content: Chapter4,
    link: "/grammar/communications/4",
  },
  {
    id: "5",
    title: "5. Menschen beschreiben / Ich und meine Familie",
    content: Chapter5,
    link: "/grammar/communications/5",
  },
  {
    id: "6",
    title: "6. Über Hobbys und Freizeit sprechen",
    content: Chapter6,
    link: "/grammar/communications/6",
  },
  {
    id: "7",
    title: "7. Über Beruf und Arbeitsplatz sprechen",
    content: Chapter7,
    link: "/grammar/communications/7",
  },
  {
    id: "8",
    title: "8. Firmen und Produkte beschreiben",
    content: Chapter8,
    link: "/grammar/communications/8",
  },
  {
    id: "9",
    title: "9. Werbung machen",
    content: Chapter9,
    link: "/grammar/communications/9",
  },
  {
    id: "10",
    title: "10. Einkaufen privat und geschäftlich",
    content: Chapter10,
    link: "/grammar/communications/10",
  },
  {
    id: "11",
    title: "11. Räume beschreiben",
    content: Chapter11,
    link: "/grammar/communications/11",
  },
  {
    id: "12",
    title: "12. Über historische Ereignisse sprechen",
    content: Chapter12,
    link: "/grammar/communications/12",
  },
  {
    id: "13",
    title: "13. Pläne machen",
    content: Chapter13,
    link: "/grammar/communications/13",
  },
  {
    id: "14",
    title:
      "14. an Versammlungen und Geschäftstreffen teilnehmen und sie leiten",
    content: Chapter14,
    link: "/grammar/communications/14",
  },
  {
    id: "15",
    title: "15. Jemandem gratulieren",
    content: Chapter15,
    link: "/grammar/communications/15",
  },
  {
    id: "16",
    title: "16. Sich beschweren / etw. reklamieren",
    content: Chapter16,
    link: "/grammar/communications/16",
  },
];

function Chapter1() {
  return (
    <Column className="chapter-content">
      <ul>
        <li>Perfekt</li>
        <li>Präteritum</li>
        <li>Plusquamperfekt</li>
        <li>Saltzklammer</li>
      </ul>
    </Column>
  );
}

function Chapter2() {
  return (
    <Column className="chapter-content">
      <ul>
        <li>Passiv</li>
        <li>Infinitivkonstruktionen</li>
        <li>Finalsätze u. a.</li>
      </ul>
    </Column>
  );
}

function Chapter3() {
  return (
    <Column className="chapter-content">
      <ul>
        <li>Konjunktiv I bei indirekten Zitaten</li>
        <li>indirekte Frage- und Aussagesätze</li>
        <li>subjektive Modalität</li>
        <li>Futur II u. a. Vermutungen</li>
      </ul>
    </Column>
  );
}

function Chapter4() {
  return (
    <Column className="chapter-content">
      <ul>
        <li>Konjunktiv II als Höflichkeitsform</li>
        <li>Das Pronomen es (z. B. bei Witterungsverben)</li>
        <li>Dativ-Verben (geben, schenken usw.)</li>
      </ul>
    </Column>
  );
}

function Chapter5() {
  return (
    <Column className="chapter-content">
      <ul>
        <li>Vergleiche (wie und als)</li>
        <li>Adjektivdeklination</li>
      </ul>
    </Column>
  );
}

function Chapter6() {
  return (
    <Column className="chapter-content">
      <ul>
        <li>Adjektivdeklination</li>
        <li>Temporalangaben, -adverbien, -sätze</li>
      </ul>
    </Column>
  );
}

function Chapter7() {
  return (
    <Column className="chapter-content">
      <ul>
        <li>Hilfsverben</li>
        <li>Artikelverwendung</li>
      </ul>
    </Column>
  );
}

function Chapter8() {
  return (
    <Column className="chapter-content">
      <ul>
        <li>Adjektivdeklination</li>
        <li>Lokalangaben, -adverbien, -sätze</li>
        <li>Passiv</li>
        <li>
          Adverbien zur Darstellung von Chronologie in Prozessbeschreibungen
        </li>
      </ul>
    </Column>
  );
}

function Chapter9() {
  return (
    <Column className="chapter-content">
      <ul>
        <li>Adjektivdeklination</li>
        <li>Vergleiche</li>
        <li>Präpositionen bei der Beschreibung von Leistungen und Produkten</li>
      </ul>
    </Column>
  );
}

function Chapter10() {
  return (
    <Column className="chapter-content">
      <ul>
        <li>Genuszuordnung</li>
        <li>Formen der Artikel</li>
        <li>Gebrauch der Artikel</li>
        <li>andere Artikelwörter</li>
        <li>Akkusativ Bildung und Verwendung</li>
      </ul>
    </Column>
  );
}

function Chapter11() {
  return (
    <Column className="chapter-content">
      <ul>
        <li>
          Lokalpräpositionen (Wechsel- und ausgewählte lokale
          Akk/Dat-Präpositionen)
        </li>
        <li>Lokaladverbien (insb. Verwendung im Satz)</li>
      </ul>
    </Column>
  );
}

function Chapter12() {
  return (
    <Column className="chapter-content">
      <ul>
        <li>Vergangenheitstempora, auch (hyster.) Präsens</li>
        <li>Temporaladverbien</li>
      </ul>
    </Column>
  );
}

function Chapter13() {
  return (
    <Column className="chapter-content">
      <ul>
        <li>Präsens + Temporaladverbien</li>
        <li>Temporalangaben und -sätze</li>
        <li>Konditionalsätze (real/irreal mit Konjunktiv II und würde)</li>
        <li>Futur I</li>
      </ul>
    </Column>
  );
}

function Chapter14() {
  return (
    <Column className="chapter-content">
      <ul>
        <li>Temporaladverbien</li>
        <li>Versch. Konjunktionalsätze</li>
        <li>Uneingeleitete Nebensätze</li>
      </ul>
    </Column>
  );
}

function Chapter15() {
  return (
    <Column className="chapter-content">
      <ul>
        <li>Komparation der Adjektive</li>
        <li>Anrede (du/Sie)</li>
        <li>Perfekt / Präteritum</li>
      </ul>
    </Column>
  );
}

function Chapter16() {
  return (
    <Column className="chapter-content">
      <ul>
        <li>Konjunktiv</li>
        <li>Imperativ</li>
        <li>Rektion der Verben</li>
      </ul>
    </Column>
  );
}
