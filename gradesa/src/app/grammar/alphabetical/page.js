"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Column } from "@/components/ui/layout/container";
import { Button } from "@/components/ui/button";

export const chapters = [
  {
    id: "1",
    title: "Adjektivdeklination",
    link: "/grammar/lessons/adjektivdeklination", //this is supposed to link to the grammar article page
  },
  {
    id: "2",
    title: "Adjektivkomparation",
    link: "/grammar/lessons/adjektivkomparation",
  },
  {
    id: "3",
    title: "Akkusativ",
    link: "/grammar/lessons/akkusativ",
  },
  {
    id: "4",
    title: "Artikelverwendung",
    link: "/grammar/lessons/artikelverwendung",
  },
  {
    id: "5",
    title: "Artikelwörter",
    link: "/grammar/lessons/artikelwörter",
  },
  {
    id: "6",
    title: "Dativ",
    link: "/grammar/lessons/dativ",
  },
  {
    id: "7",
    title: "Dativ-Verben",
    link: "/grammar/lessons/dativ-verben",
  },
  {
    id: "8",
    title: "Funktionsverbgefüge",
    link: "/grammar/lessons/funktionsverbgefüge",
  },
  {
    id: "9",
    title: "Futur",
    link: "/grammar/lessons/futur",
  },
  {
    id: "10",
    title: "Genitiv",
    link: "/grammar/lessons/genitiv",
  },
  {
    id: "11",
    title: "Genuszuordnung",
    link: "/grammar/lessons/genuszuordnung",
  },
  {
    id: "12",
    title: "Hilfsverben (Konjugation Präsens und Präteritum)",
    link: "/grammar/lessons/hilfsverben",
  },
  {
    id: "13",
    title: "Indirekte Fragesätze",
    link: "/grammar/lessons/indirekte-fragesatze",
  },
  {
    id: "14",
    title: "Infinitivkonstruktionen",
    link: "/grammar/lessons/infinitivkonstruktionen",
  },
  {
    id: "15",
    title: "Kategorien des Verbs",
    link: "/grammar/lessons/kategorien-des-verbs",
  },
  {
    id: "16",
    title: "Kausalsätze",
    link: "/grammar/lessons/kausalsatze",
  },
  {
    id: "17",
    title: "Konditionalsätze (real/irreal mit Konjunktiv II und würde)",
    link: "/grammar/lessons/konditionalsatze",
  },
  {
    id: "18",
    title: "Konjunktiv I Bildung",
    link: "/grammar/lessons/konjunktiv-i-bildung",
  },
  {
    id: "19",
    title: "Konjunktiv II Bildung",
    link: "/grammar/lessons/konjunktiv-ii-bildung",
  },
  {
    id: "20",
    title: "Konjunktionalsätze",
    link: "/grammar/lessons/konjunktionalsatze",
  },
  {
    id: "21",
    title: "Konsekutivsätze",
    link: "/grammar/lessons/konsekutivsatze",
  },
  {
    id: "22",
    title: "Konzessivsätze",
    link: "/grammar/lessons/konzessivsatze",
  },
  {
    id: "23",
    title: "Lokalpräpositionen",
    link: "/grammar/lessons/lokalprapositionen",
  },
  {
    id: "24",
    title: "Lokalsätze",
    link: "/grammar/lessons/lokalsatze",
  },
  {
    id: "25",
    title: "Modalverben und subjektive Modalität",
    link: "/grammar/lessons/modalverben",
  },
  {
    id: "26",
    title: "Nebensätze (mit uneingeleiteten)",
    link: "/grammar/lessons/nebensatze",
  },
  {
    id: "27",
    title: "Nominativ (mit Kopulaverben)",
    link: "/grammar/lessons/nominativ",
  },
  {
    id: "28",
    title: "Passiv",
    link: "/grammar/lessons/passiv",
  },
  {
    id: "29",
    title: "Perfekt",
    link: "/grammar/lessons/perfekt",
  },
  {
    id: "30",
    title: "Pluralbildung der Substantive",
    link: "/grammar/lessons/pluralbildung-der-substantive",
  },
  {
    id: "31",
    title: "PQ",
    link: "/grammar/lessons/pq",
  },
  {
    id: "32",
    title: "Präpositionen (Rektion)",
    link: "/grammar/lessons/prapositionen",
  },
  {
    id: "33",
    title: "Präsens",
    link: "/grammar/lessons/prasens",
  },
  {
    id: "34",
    title: "Präteritum",
    link: "/grammar/lessons/prateritum",
  },
  {
    id: "35",
    title: "Pronomen es",
    link: "/grammar/lessons/pronomen-es",
  },
  {
    id: "36",
    title: "Pronomina",
    link: "/grammar/lessons/pronomina",
  },
  {
    id: "37",
    title: "Reflexive Verben",
    link: "/grammar/lessons/reflexive-verben",
  },
  {
    id: "38",
    title: "Rektion der Verben",
    link: "/grammar/lessons/rektion-der-verben",
  },
  {
    id: "39",
    title: "Relativsätze",
    link: "/grammar/lessons/relativsatze",
  },
  {
    id: "40",
    title: "Satzklammer",
    link: "/grammar/lessons/satzklammer",
  },
  {
    id: "41",
    title: "Temporalsätze (mit Chronologie in Prozessbeschreibungen)",
    link: "/grammar/lessons/temporalsatze",
  },
  {
    id: "42",
    title: "Vergleiche",
    link: "/grammar/lessons/vergleiche",
  },
  {
    id: "43",
    title: "Zusammengesetzte Verben (trennbar/untrennbar)",
    link: "/grammar/lessons/zusammengesetzte-verben",
  },
];

export default function Chapter() {
  return (
    <Column gap="md">
      <Button>
        <Link href="/grammar/lessons">Themen der Grammatik</Link>
      </Button>
      <h1>Grammatik in alphabetischer Reihenfolge</h1>

      {chapters.map((chapter) => (
        <Link key={chapter.id} href={chapter.link}>
          {chapter.title}
        </Link>
      ))}
    </Column>
  );
}
