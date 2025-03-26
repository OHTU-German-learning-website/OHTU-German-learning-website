"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const initialGrammarTopics = [
  {
    title: "Das Adjektiv",
    subtopics: [
      "prädikative und adverbiale Adjektive",
      "attributive Adjektive",
      "Deklinationsarten",
      "Vergleiche, Komparation und Graduierung",
      "die Rektion der Adjektive",
      "die Wortbildung der Adjektive",
    ],
  },
  {
    title: "Das Adverb",
    subtopics: [
      "hin und her",
      "Pronominaladverbien",
      "Konjunktionaladverbien",
      "die Unterscheidung zu anderen Wortarten (Konjunktion, prädikatives Attribut, Modalwort, Partikel)",
    ],
  },
  {
    title: "Das Artikelwort",
    subtopics: [
      "Formen von Artikelwörtern",
      "der Gebrauch von bestimmtem, unbestimmtem und Nullartikel",
      "der Gebrauch anderer Artikelwörter",
    ],
  },
  {
    title: "Das Pronomen",
    subtopics: [
      "das Personalpronomen",
      "das Demonstrativpronomen",
      "das Possessivpronomen",
      "das Relativpronomen",
      "das Pronomen es",
    ],
  },
  {
    title: "Das Substantiv",
    subtopics: [
      "Genuszuordnung",
      "Pluralbildung",
      "die Kasusformen und ihre Bildung: Nominativ, Akkusativ, Dativ, Genitiv",
      "besondere Namen (geographische, Nationalitäten usw.)",
      "Homonyme",
    ],
  },
  {
    title: "Das Verb",
    subtopics: [
      "Die Tempora",
      "das Präsens",
      "das Perfekt",
      "das Präteritum",
      "das Plusquamperfekt",
      "das Futur I und II",
      "Der Numerus",
      "die Konjugation",
      "schwache Verben",
      "starke und unregelmäßige Verben",
      "Hilfsverben",
      "die Kategorien des Verbs",
      "die Formenbildung",
      "trennbare Verben",
      "Modalverben",
      "objektive Modalität",
      "subjektive Modalität",
      "reflexive Verben",
      "der Modus",
      "der Konjunktiv I (=Konjunktiv Präsens)",
      "der Konjunktiv II (=Konjunktiv Präteritum)",
      "die würde-Form",
      "der Imperativ",
      "das Genus Verbi",
      "das Passiv",
      "Passiv-Ersatzformen (Paraphrasen)",
      "die Rektion der Verben",
      "mit reinem Kasus: Verben mit dem Dativ, Verben mit dem Akkusativ, Verben mit dem Genitiv, Verben mit dem Nominativ",
      "mit Präpositionalkasus",
      "Infinitivformen",
      "das Funktionsverbgefüge",
    ],
  },
  {
    title: "Die Präposition",
    subtopics: [
      "mit Nominativ",
      "mit Akkusativ",
      "mit Dativ",
      "mit Genitiv",
      "Wechselpräpositionen",
      "Lokalpräpositionen",
    ],
  },
  {
    title: "Die Syntax",
    subtopics: [
      "Konjunktionalsätze",
      "Konditionalsätze (real/irreal mit Konjunktiv II und würde)",
      "Kausalsätze",
      "Konsekutivsätze",
      "Konzessivsätze",
      "Lokalsätze",
      "Temporalsätze (mit Chronologie in Prozessbeschreibungen)",
      "indirekte Fragesätze",
      "Relativsätze",
      "die Satzklammer",
      "uneingeleitete Nebensätze",
      "Infinitivkonstruktionen",
      "Konjunktionen und Konjunktionaladverbien",
      "die Satzperiode",
    ],
  },
];

export default function LessonsPage() {
  const [grammar, setGrammar] = useState(initialGrammarTopics.map(() => false));

  const toggleShowMore = (event, index) => {
    setGrammar(grammar.map((show, i) => (i === index ? !show : show)));
  };

  return (
    <div className="lessons-title">
      <h1>Themen der Grammatik</h1>
      <Button>
        <Link href="/grammar/alphabetical">
          Grammatik in alphabetischer Reihenfolge
        </Link>
      </Button>

      <div className="lessons-container">
        {initialGrammarTopics.map((topic, i) => (
          <div className="flex-parent-element" key={`${topic.title}-${i}`}>
            <div className="flex-child-element">
              <h2>{topic.title}</h2>
              <ul>
                {/* The topics should link to the respective pages (WIP) */}
                {topic.subtopics
                  .filter((_, j) => {
                    console.log(grammar[i] || j < 3);
                    return grammar[i] || j < 3;
                  })
                  .map((subtopic, subIndex) => (
                    <li key={`${i}-subtopic-${subIndex}`}>{subtopic}</li>
                  ))}
              </ul>
              <div className="show-list">
                {/* This button should not be visible if there are 3 or less subtopics */}
                <button
                  className="show-more-link"
                  onClick={(e) => toggleShowMore(e, i)}
                >
                  {grammar[i] ? "weniger anzeigen" : "mehr anzeigen"}{" "}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
