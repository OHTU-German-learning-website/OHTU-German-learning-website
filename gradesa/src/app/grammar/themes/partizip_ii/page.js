"use client";
import Link from "next/link";
import { Container } from "@/components/ui/layout/container";

export default function Perfekt() {
  return (
    <>
      <div>
        <h1>Das Perfekt</h1>
        <p>
          Wenn wir über die Vergangenheit sprechen, benutzen wir im Deutschen
          das Perfekt oder das Präteritum, seltener das Plusquamperfekt. Aber am
          meisten kommt in der gesprochenen Sprache das Perfekt vor. Das Perfekt
          ist eine sogenannte zusammengesetzte Zeitform. In der
          Sprachwissenschaft (Linguistik) wird statt des Begriffs Zeitform auch
          der Ausdruck Tempus oder Tempusform verwendet
        </p>
        <p>
          {/* Hilsverb should be in green, Partizip II should be in blue */}
          Das Perfekt setzt sich aus einem Hilfsverb (haben oder sein) und dem
          Partizip II des eigentlichen Verbs, auch Vollverb genannt, zusammen.
          Das Hilfsverb wird nach dem Subjekt des Satzes konjugiert, das
          Partizip II ist immer gleich.
        </p>
        <Container bg="var(--bg9)">
          <p>Beispiele: </p>

          {/* habe and ist should be in green, geredet and gekommen should be in blue */}
          <p>ich habe geredet</p>
          <p>er ist gekommen</p>
        </Container>
        <p>
          <Link href="#">Hier</Link> kannst du lernen oder wiederholen, auch
          üben, wie die Hilfsverben im Deutschen konjugiert werden. (no page
          yet)
        </p>
        <p>
          <Link href="#">Hier</Link> findest du die Regeln zur Bildung des
          Partizip II. Das ist eine wichtige Form, denn im Deutschen wird auch
          das Plusquamperfekt und das Passiv damit gebildet.
        </p>
      </div>
    </>
  );
}
