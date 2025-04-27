import Link from "next/link";
import { Container } from "@/components/ui/layout/container";
import "../lessons.css";
import { ArrowRightIcon } from "@radix-ui/react-icons";

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
            <span className="blue">geredet</span> <br />
            er <span className="green">ist</span>{" "}
            <span className="blue">gekommen</span> <br />
            Peter <span className="green">hat</span> das Auto in die Garage{" "}
            <span className="blue">gefahren</span>. <br />
            Irene <span className="green">hat</span> ihren Hund in den Urlaub{" "}
            <span className="blue">mitgenommen</span>. <br />
            Peter repariert die Maschine, nachdem er sie{" "}
            <span className="blue">gereinigt</span>{" "}
            <span className="green">hat</span>.
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
        <h2>Perfekt mit "haben"</h2>
        <h3>1. Transitive Verben</h3>
        <p>
          Transitive Verben nennen wir solche Verben, die im Satz mit einem
          Akkusativobjekt auftreten müssen oder können. Es gibt eine große Menge
          von transitiven Verben in der deutschen Sprache. Wenn du dir nicht
          sicher bist, ob ein Verb transitiv ist, dann kannst du versuchen,
          einen Satz ohne Akkusativobjekt zu bilden – dann merkst du vielleicht,
          dass es bei manchen Verben unmöglich ist, einen Satz ohne Objekt zu
          bilden. Meistens fehlt dann eine Information, die auf die Frage{" "}
          <span className="italic">was</span>? (bei Personen{" "}
          <span className="italic">wen</span>) antwortet. (z.B. kaufen, stellen)
        </p>
        <Container bg="var(--bg7)">
          <p>Beispiele: </p>
          <p>
            Ich möchte. <span className="italic">Was?</span> <ArrowRightIcon />{" "}
            <span className="green">Akkusativ</span>! - Ich möchte{" "}
            <span className="green">einen Hamburger</span>. <br />
            Peter schenkt. <span className="italic">Was?</span>{" "}
            <ArrowRightIcon /> <span className="green">Akkusativ</span>! - Peter
            schenkt (Klaus) <span className="green">eine neue Uhr</span>.
          </p>
        </Container>
        <p>
          Von den meisten transitiven Verben kann man auch ein{" "}
          <ArrowRightIcon />
          Passiv bilden. Dann wird aus dem{" "}
          <span className="green">Akkusativobjekt</span> ein{" "}
          <span className="blue">Subjekt</span>.
        </p>
        <Container bg="var(--bg7)">
          <p>Beispiele: </p>
          <p>
            Aktiv: Peter kauft{" "}
            <span className="green">einen neuen Computer</span>.
          </p>
          <p>
            Passiv: <span className="blue">Ein neuer Computer</span> wird (von
            Peter) gekauft.
          </p>
        </Container>
        <p>
          Extra: Das funktioniert nicht bei allen transitiven Verben. Eine Reihe
          von Verben haben zwar Akkusativobjekte bei sich, können jedoch kein
          Passiv bilden, z. B.:{" "}
          <span className="italic">bekommen, enthalten, kosten</span>. Sätze wie{" "}
          <span className="italic">Ich habe das Buch bekommen</span> oder{" "}
          <span className="italic">Das Päckchen enthält ein Buch</span> können
          nicht ins Passiv transformiert werden (*{" "}
          <span className="italic">Das Buch wird von mir bekommen</span>. oder *
          <span className="italic">
            Das Buch wird von dem Päckchen enthalten
          </span>
          ). Solche Verben werden in manchen Grammatiken als <ArrowRightIcon />
          <strong>Mittelverben</strong> bezeichnet.
        </p>
        <p>
          Transitive Verben bilden das Perfekt immer mit dem Hilfsverb{" "}
          <span className="italic green">haben</span>, auch wenn es Verben der
          Bewegung oder Veränderung sind, die das Perfekt normalerweise mit dem
          Hilfsverb <span className="italic red">sein</span> bilden.
        </p>
        <Container bg="var(--bg7)">
          <p>Beispiele: </p>
          <p>
            Peter <span className="red">ist</span> von Helsinki nach Berlin mit
            dem Auto <span className="blue">gefahren</span>. <br />
            Peter <span className="green">hat</span> das Auto in die Garage{" "}
            <span className="blue">gefahren</span>.
          </p>
        </Container>
        <p>
          Auch <span className="underline italic">reflexive Verben</span> (z. B.{" "}
          <span className="italic">sich waschen, sich verabreden,</span>{" "}
          sich...) bilden das Perfekt mit <span className="italic">haben</span>.
          Dabei steht das Reflexivpronomen <span className="italic">sich</span>{" "}
          nach dem Hilfsverb <span className="italic">haben</span>. So genannte{" "}
          <span className="underline">durative Verben</span>, die die Dauer oder
          den Verlauf eines Vorganges anzeigen (arbeiten, blühen, fahren,
          liegen, malen, wohnen) und{" "}
          <span className="underline">unpersönliche Verben</span>, die nur mit
          dem Subjekt es stehen (z. B. Witterungsverben{" "}
          <span className="italic">regnen, schneien</span>) bilden das Perfekt
          ebenfalls mit sein. Das Pronomen <span className="italic">es</span>{" "}
          bei den Witterungsverben steht direkt nach den Hilfsverb sein.
        </p>
        <Container bg="var(--bg7)">
          <p>Beispiele: </p>
          <p>
            Paul <span className="green">hat</span> <strong>sich</strong> die
            Haare <span className="blue">gewaschen</span>. <br />
            Armin <span className="green">hat</span> <strong>sich</strong> im
            Internet über die neuesten Computer{" "}
            <span className="blue">informiert</span>.
          </p>
          <p>
            Hanna <span className="green">hat</span> diese Woche 54 Stunden{" "}
            <span className="blue">gearbeitet</span>. <br />
            Katharina <span className="green">hat</span> acht Stunden{" "}
            <span className="blue">geschlafen</span>.
          </p>
          <p>
            Im letzten Winter <span className="green">hat</span> es fast gar
            nicht <span className="blue">geschneit</span>. <br />
            In unserem Urlaub <span className="green">hat</span> es pausenlos{" "}
            <span className="blue">geregnet</span>.
          </p>
        </Container>
        <h2>Perfekt mit "sein"</h2>
        <p>
          Verben, die eine Ortsveränderung ausdrücken (z. B.{" "}
          <span className="italic">fahren, gehen, fliegen</span>) bilden ihr
          Perfekt mit dem Hilfsverb <span className="italic">sein</span>. Auch
          andere Veränderungen wie die Veränderung der Position oder der Lage
          (z. B. <span className="italic">aufstehen</span> [sitzen {">"}{" "}
          stehen], <span className="italic">fallen</span> [stehen {">"} liegen])
          oder eine Zustandsveränderung (z. B.{" "}
          <span className="italic">sterben</span> [lebendig {">"} tot],{" "}
          <span className="italic">wachsen</span> [klein {">"} groß]), bilden
          das Perfekt mit <span className="italic">sein</span>.
        </p>
        <Container bg="var(--bg7)">
          <p>Beispiele: </p>
          <p>
            Hannes <span className="red">ist</span> mit dem Auto nach Flensburg{" "}
            <span className="blue">gefahren</span>. <br />
            Bis nach Hamburg <span className="red">sind</span> wir{" "}
            <span className="blue">geflogen</span>, danach{" "}
            <span className="red">sind</span> wir mit dem Zug{" "}
            <span className="blue">weitergefahren</span>.
          </p>
          <p>
            Gestern Abend <span className="red">bin</span> ich sehr spät{" "}
            <span className="blue">eingeschlafen</span>, trotzdem{" "}
            <span className="red">bin</span> ich heute schon um sechs Uhr{" "}
            <span className="blue">aufgestanden</span>.
          </p>
          <p>
            In diesem Jahr regnet es zu wenig, alle Blumen im Garten{" "}
            <span className="red">sind</span> leider schon{" "}
            <span className="blue">verwelkt</span>. <br />
            Beethoven <span className="red">ist</span> im Jahre 1827{" "}
            <span className="blue">gestorben</span>.
          </p>
        </Container>
        <p>
          <Link href="#">Hier</Link> sind einige Übungen, wo du das Perfekt
          trainieren kannst. Am besten gehst du sie der Reihe nach durch.
        </p>
        <Container bg="var(--green)">
          <p>Übung 1.</p>
        </Container>
      </div>
    </>
  );
}
