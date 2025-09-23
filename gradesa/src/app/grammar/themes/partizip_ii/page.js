import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Container, Row } from "@/components/ui/layout/container";
import "../lessons.css";

export default function Partizip() {
  return (
    <>
      <div>
        <h1>Das Partizip II</h1>
        <p>
          Auf dieser Seite lernst du, wie man das Partizip II bei verschiedenen
          Verben bildet.
        </p>
        <h2>Was ist das und wofür brauchen wir es?</h2>
        <p>
          Wenn wir <ArrowRightIcon /> das Perfekt benutzen wollen, brauchen wir
          eine <ArrowRightIcon /> infinite Verbform: das Partizip II. Manchmal
          nennt man es auch Perfekt-Partizip. Das ist aber nicht ganz korrekt,
          weil man es auch für <ArrowRightIcon /> das Plusquamperfekt und{" "}
          <ArrowRightIcon /> das Passiv braucht. Partizip-II-Formen können auch
          als Attribute oder Infinitivkonstruktionen auftreten.
        </p>
        <Container bg="var(--bg4)">
          <p>Beispiele: </p>
          <p>
            <span className="italic">
              Ich habe einen Computer <strong>gekauft</strong>.
            </span>{" "}
            (Perfekt)
          </p>
          <p>
            <span className="italic">
              Paul hatte sich im letzten Jahr bei der Firma Meier AG{" "}
              <strong>beworben</strong>.
            </span>{" "}
            (Plusquamperfekt)
          </p>
          <p>
            <span className="italic">
              Briefe werden meistens mit dem Computer{" "}
              <strong>geschrieben</strong>.
            </span>{" "}
            (Passiv)
          </p>
          <p>
            <span className="italic">
              Paul ist <strong>studierter</strong> Betriebswirt.
            </span>{" "}
            (Partizip II als Attribut)
          </p>
          <p>
            <span className="italic">
              Er behauptet, das Buch schon <strong>gelesen</strong> zu haben.
            </span>{" "}
            (Partizip in einer Infinitivkonstruktion)
          </p>
        </Container>
        <h2>Die Bildung des Partizip II</h2>
        <p>Bei der Bildung des Partizip II spielen mehrere Dinge eine Rolle.</p>
        <ul>
          <li>Die Form des Verbs</li>
          <ul>
            <li>
              Ist es ein einfaches Verb (<span className="italic">kaufen</span>)
              oder ein zusammengesetztes Verb (
              <span className="italic">einkaufen, verkaufen</span>)?
            </li>
            <li>
              Ist ein zusammengesetztes Verb trennbar (empfangen) oder nicht
              trennbar (<span className="italic">besprechen</span>)?
            </li>
            <li>
              Gibt es Besonderheiten bei diesem Verb, zum Beispiel eine Endung (
              <span className="italic">studieren</span>)?
            </li>
          </ul>
          <li>Die grammatischen Eigenschaften des Verbs</li>
          <ul>
            <li>
              Ist es ein <ArrowRightIcon /> schwaches Verb (
              <span className="italic">kaufen</span>), ein starkes Verb (
              <span className="italic">lesen</span>) oder ein unregelmäßiges
              Verb (<span className="italic">denken</span>)?
            </li>
          </ul>
        </ul>
        <h2>Einfache Verben</h2>
        <p>
          die Form: Wenn es kein Präfix gibt, ist es ein einfaches Verb. Wichtig
          ist, dass du den <strong>Wortstamm</strong> erkennst. Den erhältst du,
          wenn du vom Infinitiv die Endung <span className="italic">-en</span>{" "}
          oder <span className="italic">-n</span> wegnimmst.
        </p>
        <p>
          Beispiele:{" "}
          <span className="italic">
            <strong>mach</strong>-en, <strong>kauf</strong>-en
          </span>
        </p>
        <h2>Schwache Verben</h2>
        <p>
          Das Partizip 2 wird sehr oft mit dem Element{" "}
          <span className="italic">
            <strong>ge</strong>
          </span>{" "}
          gebildet. Als generelle Formel kann dienen:{" "}
          <span className="italic">
            <strong>ge</strong>
          </span>{" "}
          am Anfang und{" "}
          <span className="italic">
            <strong>t</strong>
          </span>{" "}
          am Ende, der Wortstamm steht in der Mitte.
        </p>
        <p>
          <span className="italic">machen – ge-mach-t, kaufen – ge-kauf-t</span>
        </p>
        <Container bg="var(--bg4)">
          <p>Weitere Beispiele:</p>
          <p>
            <span className="italic">
              brauchen – gebraucht, sagen – gesagt, wohnen – gewohnt, fragen –
              gefragt{" "}
            </span>
          </p>
        </Container>
        <Container bg="var(--green)">
          <p>
            Übung 1a basic: Gap exercise + 1 b as drag and drop matching
            exercise
          </p>
        </Container>
        <h2>Starke Verben</h2>
        <p>
          Bei starken Verben verändert sich der Vokal im Wortstamm. Oft kann man
          das auch im Partizip II sehen. Darum muss man starke Verben lernen.
          Dazu gibt es in vielen Lehrbüchern Tabellen.
        </p>
        <p>
          Die Formel zur Bildung des Partizips bleibt gleich:{" "}
          <span className="italic">
            <strong>ge</strong>
          </span>{" "}
          am Anfang, aber am Ende kommt das Suffix{" "}
          <span className="italic">
            <strong>-en,</strong>
          </span>{" "}
          der Wortstamm mit oft verändertem Vokal steht in der Mitte.
        </p>
        <Container bg="var(--bg4)">
          <p>Beispiele:</p>
          <p>
            <span className="italic">
              lesen – gelesen, kommen – gekommen, fliegen – gefl
              <span className="red">o</span>gen, werden - gew
              <span className="red">o</span>rden
            </span>
          </p>
        </Container>
        <Container bg="var(--green)">
          Übung 2a basic gap; 2 b d&d matching (as above)
        </Container>
        <h2>Unregelmäßige Verben</h2>
        <p>
          Bei unregelmäßigen Verben gibt es Merkmale von schwachen und starken
          Verben, die manchmal gemeinsam auftreten. Es kann sein, dass sich der
          Vokal verändert, das Partizip II aber die Endung <strong>t</strong>{" "}
          hat.
        </p>
        <Container bg="var(--bg4)">
          <p>
            Beispiele:{" "}
            <span className="italic">
              kennen – gekannt, nennen – genannt, rennen – gerannt
            </span>
          </p>
        </Container>
        <p>
          Es kann auch sein, dass andere Buchstaben hinzukommen und eine andere
          („unlogische“) Form entsteht.
        </p>
        <Container bg="var(--bg4)">
          <p>
            Beispiele:{" "}
            <span className="italic">
              denken – gedacht, bringen – gebracht, mögen – gemocht, essen -
              gegessen
            </span>
          </p>
        </Container>
        <p>
          Es ist auch möglich, dass das Partizip II eine komplett andere Form
          hat.
        </p>
        <Container bg="var(--bg4)">
          <p>
            Beispiel: <span className="italic">sein – gewesen</span>
          </p>
        </Container>
        <Container bg="var(--green)">
          Übung 3 a basic gap; 3 b d&d matching (as above)
        </Container>
        <Container bg="var(--red)">
          Übung 4 medium mix all the verbs/participles from above (you find them
          in the screenshot below) and turn it into a memory game
        </Container>
        <Container bg="var(--red)">
          Übung 5 medium use all the verbs/participles from above (you find them
          in the screenshot below) and turn it into a crossword.
        </Container>
        <h2>Zusammengesetzte Verben</h2>
        <p>
          Bei zusammengesetzten Verben gibt es ein Präfix, z. B.{" "}
          <span className="italic">
            <strong>ver-, ab-, be-</strong>
          </span>
          . Das Präfix entscheidet darüber, ob es ein trennbares oder ein
          untrennbares Verb ist. Präfixe können zu fast jedem Verb hinzugefügt
          werden. Dann entsteht ein neues Verb mit einer neuen Bedeutung.
        </p>
        <Container bg="var(--bg4)">
          <p>Beispiele:</p>
          <p>arbeiten: mitarbeiten, durcharbeiten, bearbeiten</p>
          <p>sehen: ansehen, zusehen, wegsehen, hinsehen</p>
        </Container>
        <p>
          Das Partizip II wird genauso gebildet wie sonst auch, wenn das Verb
          kein Präfix hat. Es gibt nur Unterschiede bei der Silbe{" "}
          <span className="italic">
            <strong>ge.</strong>
          </span>
        </p>
        <Container bg="var(--bg4)">
          <p>Beispiele:</p>
        </Container>
        <Row bg="var(--bg4)" gap="20px">
          <p>
            arbeiten – <strong>gearbeitet</strong> <br />
            mitarbeiten – mit<strong>gearbeitet</strong> <br />
            durcharbeiten – durch<strong>gearbeitet</strong> <br />
            bearbeiten – be<strong>arbeitet</strong> <br />
            <br />
            laden – <strong>geladen</strong> <br />
            herunterladen – herunter<strong>geladen</strong> <br />
            <br />
            gehen – <strong>gegangen</strong> <br />
            weggehen - weg<strong>gegangen</strong>
          </p>
          <p>
            sehen – <strong>gesehen</strong> <br />
            ansehen – an<strong>gesehen</strong> <br />
            zusehen – zu<strong>gesehen</strong> <br />
            wegsehen – weg<strong>gesehen</strong> <br />
            hinsehen – hin<strong>gesehen</strong> <br />
            besehen – be<strong>sehen</strong>
          </p>
          <p>
            heben – <strong>gehoben</strong> <br />
            abheben - ab<strong>gehoben</strong> <br />
            beheben – be<strong>hoben</strong> <br />
            hochheben – hoch<strong>gehoben</strong> <br />
            <br />
            lernen – <strong>gelernt</strong> <br />
            kennenlernen - kennen<strong>gelernt</strong>
          </p>
        </Row>
        <p>
          Schau dir die Beispiele genau an! Welche Unterschiede kannst du in den
          Partizipien bei der Silbe{" "}
          <span className="italic">
            <strong>ge</strong>
          </span>{" "}
          erkennen? Wo steht sie? Ist sie immer da?
        </p>
        <h2>Trennbare Verben</h2>
        <p>
          Die meisten zusammengesetzten Verben im Deutschen sind trennbar. Das
          heißt, das Präfix und das Verb werden in einem Satz immer getrennt.
        </p>
        <Container bg="var(--bg4)">
          <p>Beispiel: mitarbeiten</p>
          <p>
            Präsens: Peter <strong>arbeitet</strong> an dem neuen Projekt{" "}
            <strong>mit</strong>.
          </p>
          <p>
            Perfekt: Peter hat an dem neuen Projekt <strong>mit</strong>ge
            <strong>arbeitet</strong>.
          </p>
        </Container>
        <p>
          Solche trennbaren Präfixe sind oft andere Wortarten:{" "}
          <strong>Präpositionen</strong> (an –{" "}
          <span className="italic">ansehen, anschauen, ankaufen</span>),{" "}
          <strong>Adverbien</strong> (weg -{" "}
          <span className="italic">weggehen, weglaufen, wegnehmen</span>) oder
          auch <strong>Verben</strong> (
          <span className="italic">stehenbleiben, kennenlernen</span>).
        </p>
        <p>
          Bei der Bildung des Partizip II wird das Verb durch die Silbe{" "}
          <span className="italic">
            <strong>ge</strong>
          </span>{" "}
          getrennt, z. B. mit
          <span className="italic">
            <strong>ge</strong>
          </span>
          arbeitet. Man kann auch sagen, das Präfix kommt vor das Partizip II,
          also{" "}
          <span className="italic">
            <strong>mit</strong>
          </span>
          gearbeitet.
        </p>
        <Container bg="var(--bg4)">
          <p>Beispiele:</p>
          <p>
            <span className="italic">
              absprechen – ab<strong>gesprochen</strong>
            </span>
          </p>
          <p>
            <span className="italic">
              hochheben – hoch<strong>gehoben</strong>
            </span>
          </p>
          <p>
            <span className="italic">
              zusammenbringen – zusammen<strong>gebracht</strong>
            </span>
          </p>
          <p>
            <span className="italic">
              fallenlassen – fallen<strong>gelassen</strong>
            </span>
          </p>
        </Container>
        <p>Am Partizip II ändert sich also nichts.</p>
        <h2>Untrennbare Verben</h2>
        <p>
          Es gibt auch eine Gruppe von Präfixen, die keine eigene Bedeutung
          haben. Das sind zum Beispiel{" "}
          <strong>be-, emp-, ent-, er-, ge-, ver-</strong> und{" "}
          <strong>zer-</strong>
          wenn ein Verb so ein Präfix bekommt, verändert sich die Bedeutung.
        </p>
        <p>
          Bei der Bildung des Partizip II gibt es{" "}
          <span className="underline">
            kein{" "}
            <span className="italic">
              <strong>ge</strong>
            </span>
          </span>
          !
        </p>
        <p>
          Das Partizip II wird aber ansonsten genauso gebildet wie sonst auch.
        </p>
        <Container bg="var(--bg4)">
          <p>Beispiele:</p>
          <p>
            <span className="italic">
              heben – ge<strong>hoben</strong>; beheben – be
              <strong>hoben</strong> <br />
              gehen – ge<strong>gangen</strong>; begehen – be
              <strong>gangen</strong> <br />
              arbeiten – <strong>gearbeitet</strong>; verarbeiten – ver
              <strong>arbeitet</strong> <br />
              kennen – <strong>gekannt</strong>; erkennen - er
              <strong>kannt</strong>
            </span>
          </p>
        </Container>
        <h2>
          Weitere Verben mit Partizipien ohne{" "}
          <span className="italic">
            <strong>-ge-</strong>
          </span>
        </h2>
        <p>
          Verben mit der Endung <span className="italic">-ieren</span> haben im
          Partizip II ebenfalls{" "}
          <span className="underline">
            kein{" "}
            <span className="italic">
              <strong>ge</strong>
            </span>
          </span>
          . Das sind Verben, die aus anderen Sprachen kommen, also Fremdwörter.
          Man kennt den Wortstamm häufig aus anderen Sprachen. Das Partizip II
          hat die Endung <strong>-t</strong>.
        </p>
        <Container bg="var(--bg4)">
          <p>Beispiele:</p>
          <p>
            <span className="italic">
              fotografieren – <strong>fotografiert</strong> <br />
              modernisieren – <strong>modernisiert</strong> <br />
              studieren – <strong>studiert</strong> <br />
              polieren - <strong>poliert</strong>
            </span>
          </p>
        </Container>
        <p>
          Wenn es ein Präfix gibt, wird das Partizip II gebildet wie sonst auch.
          Es kommt aber auch hier{" "}
          <span className="underline">
            kein{" "}
            <span className="italic">
              <strong>ge</strong>
            </span>
          </span>{" "}
          zwischen Präfix und Wortstamm.
        </p>
        <Container bg="var(--bg4)">
          <p>Beispiele:</p>
          <p>
            <span className="italic">
              ausprobieren – <strong>ausprobiert</strong> <br />
              hyperventilieren – <strong>hyperventiliert</strong> <br />
              entlangspazieren – <strong>entlangspaziert</strong> <br />
              entmagnetisieren - <strong>entmagnetisiert</strong>
            </span>
          </p>
        </Container>
        <Container bg="var(--red)">Übung 6 medium (crosswords)</Container>
      </div>
    </>
  );
}
