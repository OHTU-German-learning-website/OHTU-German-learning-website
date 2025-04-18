import Link from "next/link";
import { Container } from "@/components/ui/layout/container";
import "../lessons.css";

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
          Sprachwissenschaft (Linguistik) wird statt des Begriffs{" "}
          <span className="italic">Zeitform</span> auch der Ausdruck{" "}
          <span className="italic">Tempus</span> oder{" "}
          <span className="italic">Tempusform</span> verwendet.
        </p>
        <p>
          Das Perfekt setzt sich aus einem Hilfsverb (
          <span className="italic">haben</span> oder{" "}
          <span className="italic">sein</span> ) und dem Partizip II des
          eigentlichen Verbs, auch <span className="italic">Vollverb</span>{" "}
          genannt, zusammen. Das <span className="green">Hilfsverb</span> wird
          nach dem Subjekt des Satzes konjugiert, das{" "}
          <span className="blue">Partizip II</span> ist immer gleich.
        </p>
        <Container bg="var(--bg7)">
          <p>Beispiele: </p>
          <p>
            ich <span className="green">habe</span>{" "}
            <span className="blue">geredet</span>
          </p>
          <p>
            er <span className="green">ist</span>{" "}
            <span className="blue">gekommen</span>
          </p>
        </Container>
        <p>
          <Link href="#">Hier</Link> kannst du lernen oder wiederholen, auch
          üben, wie die Hilfsverben im Deutschen konjugiert werden. (no page
          yet)
        </p>
        <p>
          <Link href="/grammar/themes/partizip_ii">Hier</Link> findest du die
          Regeln zur Bildung des Partizip II. Das ist eine wichtige Form, denn
          im Deutschen wird auch das Plusquamperfekt und das Passiv damit
          gebildet.
        </p>
        <p>
          Im Folgenden lernst du, wann man das Hilfsverb{" "}
          <span className="italic">sein</span> benutzen muss und wann{" "}
          <span className="italic">haben</span> .
        </p>
        <p>
          <Link href="#">Hier</Link> sind einige Übungen, wo du das Perfekt
          trainieren kannst. Am besten gehst du sie der Reihe nach durch.
        </p>
      </div>
    </>
  );
}
