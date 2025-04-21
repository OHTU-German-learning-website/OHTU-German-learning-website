"use client";
import { useState } from "react";
import { LinkButton } from "@/components/ui/linkbutton";
import Link from "next/link";

const initialGrammarTopics = [
  {
    title: "Das Adjektiv",
    subtopics: [
      {
        name: "prädikative und adverbiale Adjektive",
        link: "/grammar/themes/pradikative-adverbiale-adjektive",
      },
      {
        name: "attributive Adjektive",
        link: "/grammar/themes/attributive-adjektive",
      },
      {
        name: "Deklinationsarten",
        link: "/grammar/themes/adjektivdeklination",
      },
      {
        name: "Vergleiche, Komparation und Graduierung",
        link: "/grammar/themes/adjektivkomparation",
      },
      {
        name: "die Rektion der Adjektive",
        link: "/grammar/themes/rektion-der-adjektive",
      },
      {
        name: "die Wortbildung der Adjektive",
        link: "/grammar/themes/wortbildung-der-adjektive",
      },
    ],
  },
  {
    title: "Das Adverb",
    subtopics: [
      {
        name: "hin und her",
        link: "/grammar/themes/hin-und-her",
      },
      {
        name: "Pronominaladverbien",
        link: "/grammar/themes/pronominaladverbien",
      },
      {
        name: "Konjunktionaladverbien",
        link: "/grammar/themes/konjunktionaladverbien",
      },
      {
        name: "die Unterscheidung zu anderen Wortarten (Konjunktion, prädikatives Attribut, Modalwort, Partikel)",
        link: "/grammar/themes/unterscheidung-zu-anderen-wortarten",
      },
    ],
  },
  {
    title: "Das Artikelwort",
    subtopics: [
      {
        name: "Formen von Artikelwörtern",
        link: "/grammar/themes/artikelwörter",
      },
      {
        name: "der Gebrauch von bestimmtem, unbestimmtem und Nullartikel",
        link: "/grammar/themes/gebrauch-von-bestimmtem-unbestimmtem-und-nullartikel",
      },
      {
        name: "der Gebrauch anderer Artikelwörter",
        link: "/grammar/themes/gebrauch-anderer-artikelwörter",
      },
    ],
  },
  {
    title: "Das Pronomen",
    subtopics: [
      {
        name: "das Personalpronomen",
        link: "/grammar/themes/personalpronomen",
      },
      {
        name: "das Demonstrativpronomen",
        link: "/grammar/themes/demonstrativpronomen",
      },
      {
        name: "das Possessivpronomen",
        link: "/grammar/themes/possessivpronomen",
      },
      {
        name: "das Relativpronomen",
        link: "/grammar/themes/relativpronomen",
      },
      {
        name: "das Pronomen es",
        link: "/grammar/themes/pronomen-es",
      },
    ],
  },
  {
    title: "Das Substantiv",
    subtopics: [
      {
        name: "Genuszuordnung",
        link: "/grammar/themes/genuszuordnung",
      },
      {
        name: "Pluralbildung",
        link: "/grammar/themes/pluralbildung-der-substantive",
      },
      {
        name: "die Kasusformen und ihre Bildung: Nominativ, Akkusativ, Dativ, Genitiv",
        link: "/grammar/themes/kasusformen-und-ihre-bildung",
      },
      {
        name: "besondere Namen (geographische, Nationalitäten usw.)",
        link: "/grammar/themes/besondere-namen",
      },
      {
        name: "Homonyme",
        link: "/grammar/themes/homonyme",
      },
    ],
  },
  {
    title: "Das Verb",
    subtopics: [
      { name: "das Perfekt", link: "/grammar/themes/perfekt" },
      { name: "Partizip II", link: "/grammar/themes/partizip_ii" },
      { name: "die Tempora", link: "/grammar/themes/tempora" },
      { name: "das Präsens", link: "/grammar/themes/prasens" },
      { name: "das Präteritum", link: "/grammar/themes/prateritum" },
      { name: "das Plusquamperfekt", link: "/grammar/themes/plusquamperfekt" },
      { name: "das Futur I und II", link: "/grammar/themes/futur" },
      { name: "der Numerus", link: "/grammar/themes/numerus" },
      { name: "die Konjugation", link: "/grammar/themes/konjugation" },
      { name: "schwache Verben", link: "/grammar/themes/schwache-verben" },
      {
        name: "starke und unregelmäßige Verben",
        link: "/grammar/themes/starke-und-unregelmasige-verben",
      },
      { name: "Hilfsverben", link: "/grammar/themes/hilfsverben" },
      {
        name: "die Kategorien des Verbs",
        link: "/grammar/themes/kategorien-des-verbs",
      },
      { name: "die Formenbildung", link: "/grammar/themes/formenbildung" },
      {
        name: "trennbare Verben",
        link: "/grammar/themes/zusammengesetzte-verben",
      },
      {
        name: "Modalverben und subjektive Modalität",
        link: "/grammar/themes/modalverben-und-subjektive-modalitat",
      },
      {
        name: "objektive Modalität",
        link: "/grammar/themes/objektive-modalitat",
      },
      { name: "reflexive Verben", link: "/grammar/themes/reflexive-verben" },
      { name: "der Modus", link: "/grammar/themes/modus" },
      {
        name: "der Konjunktiv I (=Konjunktiv Präsens)",
        link: "/grammar/themes/konjunktiv_i",
      },
      {
        name: "der Konjunktiv II (=Konjunktiv Präteritum)",
        link: "/grammar/themes/konjunktiv_ii",
      },
      { name: "die würde-Form", link: "/grammar/themes/konditionalsatze" },
      { name: "der Imperativ", link: "/grammar/themes/imperativ" },
      { name: "das Genus Verbi", link: "/grammar/themes/genus-verbi" },
      { name: "das Passiv", link: "/grammar/themes/passiv" },
      {
        name: "Passiv-Ersatzformen (Paraphrasen)",
        link: "/grammar/themes/passiv-ersatzformen",
      },
      {
        name: "die Rektion der Verben",
        link: "/grammar/themes/rektion-der-verben",
      },
      {
        name: "mit reinem Kasus: Verben mit dem Dativ, Verben mit dem Akkusativ, Verben mit dem Genitiv, Verben mit dem Nominativ",
        link: "/grammar/themes/mit-reinem-kasus",
      },
      {
        name: "mit Präpositionalkasus",
        link: "/grammar/themes/mit-prapositionalkasus",
      },
      { name: "Infinitivformen", link: "/grammar/themes/infinitivformen" },
      {
        name: "das Funktionsverbgefüge",
        link: "/grammar/themes/funktionsverbgefüge",
      },
    ],
  },
  {
    title: "Die Präposition",
    subtopics: [
      { name: "mit Nominativ", link: "/grammar/themes/nominativ" },
      { name: "mit Akkusativ", link: "/grammar/themes/akkusativ" },
      { name: "mit Dativ", link: "/grammar/themes/dativ" },
      { name: "mit Genitiv", link: "/grammar/themes/genitiv" },
      { name: "Wechselpräpositionen", link: "/grammar/themes/prapositionen" },
      {
        name: "Lokalpräpositionen",
        link: "/grammar/themes/lokalprapositionen",
      },
    ],
  },
  {
    title: "Die Syntax",
    subtopics: [
      {
        name: "Konjunktionalsätze",
        link: "/grammar/themes/konjunktionalsatze",
      },
      {
        name: "Konditionalsätze (real/irreal mit Konjunktiv II und würde)",
        link: "/grammar/themes/konditionalsatze",
      },
      { name: "Kausalsätze", link: "/grammar/themes/kausalsatze" },
      { name: "Konsekutivsätze", link: "/grammar/themes/konsekutivsatze" },
      { name: "Konzessivsätze", link: "/grammar/themes/konzessivsatze" },
      { name: "Lokalsätze", link: "/grammar/themes/lokalsatze" },
      {
        name: "Temporalsätze (mit Chronologie in Prozessbeschreibungen)",
        link: "/grammar/themes/temporalsatze",
      },
      {
        name: "indirekte Fragesätze",
        link: "/grammar/themes/indirekte-fragesatze",
      },
      { name: "Relativsätze", link: "/grammar/themes/relativsatze" },
      { name: "die Satzklammer", link: "/grammar/themes/satzklammer" },
      { name: "uneingeleitete Nebensätze", link: "/grammar/themes/nebensatze" },
      {
        name: "Infinitivkonstruktionen",
        link: "/grammar/themes/infinitivkonstruktionen",
      },
      {
        name: "Konjunktionen und Konjunktionaladverbien",
        link: "/grammar/themes/konjunktionalsatze",
      },
      { name: "die Satzperiode", link: "/grammar/themes/satzperiode" },
    ],
  },
];

export default function ThemesPage() {
  const [grammar, setGrammar] = useState(initialGrammarTopics.map(() => false));

  const toggleShowMore = (event, index) => {
    setGrammar(grammar.map((show, i) => (i === index ? !show : show)));
  };

  return (
    <div className="themes-title">
      <LinkButton href="/grammar/alphabetical">
        Grammatik in alphabetischer Reihenfolge
      </LinkButton>
      <h1>Themen der Grammatik</h1>

      <div className="lessons-container">
        {initialGrammarTopics.map((topic, i) => (
          <div className="flex-parent-element" key={`${topic.title}-${i}`}>
            <div className="flex-child-element">
              <h2>{topic.title}</h2>
              <ul>
                {topic.subtopics
                  .filter((_, j) => {
                    return grammar[i] || j < 3;
                  })
                  .map((subtopic, subIndex) => (
                    <li key={`${i}-subtopic-${subIndex}`}>
                      <Link href={subtopic.link}>{subtopic.name}</Link>
                    </li>
                  ))}
              </ul>
              <div className="show-list">
                {topic.subtopics.length > 3 && (
                  <button
                    className="show-more-link"
                    onClick={(e) => toggleShowMore(e, i)}
                  >
                    {grammar[i] ? "weniger anzeigen" : "mehr anzeigen"}{" "}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
