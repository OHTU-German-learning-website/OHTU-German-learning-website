"use client";

import Link from "next/link";
import { Column } from "@/components/ui/layout/container";
import { LinkButton } from "@/components/ui/linkbutton";

export const chapters = [
  {
    id: "1",
    title: "Adjektivdeklination",
    link: "/grammar/themes/adjektivdeklination", //this is supposed to link to the grammar article page
  },
  {
    id: "2",
    title: "Adjektivkomparation",
    link: "/grammar/themes/adjektivkomparation",
  },
  {
    id: "3",
    title: "Akkusativ",
    link: "/grammar/themes/akkusativ",
  },
  {
    id: "4",
    title: "Artikelverwendung",
    link: "/grammar/themes/artikelverwendung",
  },
  {
    id: "5",
    title: "Artikelwörter",
    link: "/grammar/themes/artikelwörter",
  },
  {
    id: "6",
    title: "Dativ",
    link: "/grammar/themes/dativ",
  },
  {
    id: "7",
    title: "Dativ-Verben",
    link: "/grammar/themes/dativ-verben",
  },
  {
    id: "8",
    title: "Funktionsverbgefüge",
    link: "/grammar/themes/funktionsverbgefüge",
  },
  {
    id: "9",
    title: "Futur",
    link: "/grammar/themes/futur",
  },
  {
    id: "10",
    title: "Genitiv",
    link: "/grammar/themes/genitiv",
  },
  {
    id: "11",
    title: "Genuszuordnung",
    link: "/grammar/themes/genuszuordnung",
  },
  {
    id: "12",
    title: "Hilfsverben (Konjugation Präsens und Präteritum)",
    link: "/grammar/themes/hilfsverben",
  },
  {
    id: "13",
    title: "Indirekte Fragesätze",
    link: "/grammar/themes/indirekte-fragesatze",
  },
  {
    id: "14",
    title: "Infinitivkonstruktionen",
    link: "/grammar/themes/infinitivkonstruktionen",
  },
  {
    id: "15",
    title: "Kategorien des Verbs",
    link: "/grammar/themes/kategorien-des-verbs",
  },
  {
    id: "16",
    title: "Kausalsätze",
    link: "/grammar/themes/kausalsatze",
  },
  {
    id: "17",
    title: "Konditionalsätze (real/irreal mit Konjunktiv II und würde)",
    link: "/grammar/themes/konditionalsatze",
  },
  {
    id: "18",
    title: "Konjunktiv I Bildung",
    link: "/grammar/themes/konjunktiv-i-bildung",
  },
  {
    id: "19",
    title: "Konjunktiv II Bildung",
    link: "/grammar/themes/konjunktiv-ii-bildung",
  },
  {
    id: "20",
    title: "Konjunktionalsätze",
    link: "/grammar/themes/konjunktionalsatze",
  },
  {
    id: "21",
    title: "Konsekutivsätze",
    link: "/grammar/themes/konsekutivsatze",
  },
  {
    id: "22",
    title: "Konzessivsätze",
    link: "/grammar/themes/konzessivsatze",
  },
  {
    id: "23",
    title: "Lokalpräpositionen",
    link: "/grammar/themes/lokalprapositionen",
  },
  {
    id: "24",
    title: "Lokalsätze",
    link: "/grammar/themes/lokalsatze",
  },
  {
    id: "25",
    title: "Modalverben und subjektive Modalität",
    link: "/grammar/themes/modalverben",
  },
  {
    id: "26",
    title: "Nebensätze (mit uneingeleiteten)",
    link: "/grammar/themes/nebensatze",
  },
  {
    id: "27",
    title: "Nominativ (mit Kopulaverben)",
    link: "/grammar/themes/nominativ",
  },
  {
    id: "28",
    title: "Passiv",
    link: "/grammar/themes/passiv",
  },
  {
    id: "29",
    title: "Perfekt",
    link: "/grammar/themes/perfekt",
  },
  {
    id: "30",
    title: "Pluralbildung der Substantive",
    link: "/grammar/themes/pluralbildung-der-substantive",
  },
  {
    id: "31",
    title: "PQ",
    link: "/grammar/themes/pq",
  },
  {
    id: "32",
    title: "Präpositionen (Rektion)",
    link: "/grammar/themes/prapositionen",
  },
  {
    id: "33",
    title: "Präsens",
    link: "/grammar/themes/prasens",
  },
  {
    id: "34",
    title: "Präteritum",
    link: "/grammar/themes/prateritum",
  },
  {
    id: "35",
    title: "Pronomen es",
    link: "/grammar/themes/pronomen-es",
  },
  {
    id: "36",
    title: "Pronomina",
    link: "/grammar/themes/pronomina",
  },
  {
    id: "37",
    title: "Reflexive Verben",
    link: "/grammar/themes/reflexive-verben",
  },
  {
    id: "38",
    title: "Rektion der Verben",
    link: "/grammar/themes/rektion-der-verben",
  },
  {
    id: "39",
    title: "Relativsätze",
    link: "/grammar/themes/relativsatze",
  },
  {
    id: "40",
    title: "Satzklammer",
    link: "/grammar/themes/satzklammer",
  },
  {
    id: "41",
    title: "Temporalsätze (mit Chronologie in Prozessbeschreibungen)",
    link: "/grammar/themes/temporalsatze",
  },
  {
    id: "42",
    title: "Vergleiche",
    link: "/grammar/themes/vergleiche",
  },
  {
    id: "43",
    title: "Zusammengesetzte Verben (trennbar/untrennbar)",
    link: "/grammar/themes/zusammengesetzte-verben",
  },
];

export default function Chapter() {
  return (
    <Column gap="md">
      <LinkButton href="/grammar/themes">Themen der Grammatik</LinkButton>
      <h1>Grammatik in alphabetischer Reihenfolge</h1>

      {chapters.map((chapter) => (
        <Link key={chapter.id} href={chapter.link}>
          {chapter.title}
        </Link>
      ))}
    </Column>
  );
}
