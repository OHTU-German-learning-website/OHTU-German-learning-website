"use client";

import { Column, Container, Row } from "@/components/ui/layout/container";
import Link from "next/link";
import "./chapters.css";
import layout from "@/shared/styles/layout.module.css";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Chapters() {
  const { chapter } = useParams();
  const router = useRouter();

  const Chapter = chapters.find((c) => c.id === chapter);
  if (!Chapter) {
    router.replace("/resources");
  }

  const previousChapter = chapters.find(
    (c) => parseInt(c.id) === parseInt(chapter) - 1
  );
  const nextChapter = chapters.find(
    (c) => parseInt(c.id) === parseInt(chapter) + 1
  );

  return (
    <Column className={layout.viewContent}>
      {Chapter && (
        <>
          <h1>{Chapter.title}</h1>
          <Chapter.content />
        </>
      )}
      <Row justify="space-between" pb="xl">
        {!!previousChapter && (
          <Container mr="auto">
            <Link href={previousChapter.link}>
              <Button>Zurück</Button>
            </Link>
          </Container>
        )}
        {!!nextChapter ? (
          <Container ml="auto">
            <Link href={nextChapter.link}>
              <Button>Weiter</Button>
            </Link>
          </Container>
        ) : (
          <Link href="/learning">
            <Button>Starte den Test</Button>
          </Link>
        )}
      </Row>
    </Column>
  );
}

export const chapters = [
  {
    id: "1",
    linkLabel: "Kapitel 1",
    title: "1. Über das Lernen",
    content: Chapter1,
    link: "/resources/1",
  },
  {
    id: "2",
    linkLabel: "Kapitel 2",
    title: "2. Die Arten des Wissens",
    content: Chapter2,
    link: "/resources/2",
  },
  {
    id: "3",
    linkLabel: "Kapitel 3",
    title:
      "3. Was sind die Unterschiede zwischen Lernen im Klassenraum und allein lernen?",
    content: Chapter3,
    link: "/resources/3",
  },
  {
    id: "4",
    linkLabel: "Kapitel 4",
    title: "4. Was für ein Lerntyp bin ich?",
    content: Chapter4,
    link: "/resources/4",
  },
  {
    id: "5",
    linkLabel: "Kapitel 5",
    title: "5.Freiwilliger Selbst-Test zu Lernstrategien",
    content: Chapter5,
    link: "/resources/5",
  },
];

function Chapter1() {
  return (
    <Column className="chapter-content">
      <p>
        Dieses Lernangebot ist als eine Ergänzung zum normalen Sprachlernen
        gedacht. Wenn du also die deutsche Grammatik lernen willst, um richtig
        zu sprechen oder wenn du sie lernen musst, weil du zum Beispiel
        Germanistik studierst, dann ist dieses Material genau richtig für dich.
      </p>
      <p>
        Bevor man mit dem Lernen beginnt, ist es hilfreich, sich Gedanken zu
        machen, wie das Lernen funktioniert. Wie wir lernen, hängt natürlich von
        unserer Person selbst ab, aber es gibt auch viele äußere Faktoren, die
        das Lernen beeinflussen. Dazu gehören der Ort, wo du lernst, die Zeit,
        wann du lernst, und auch das Material, mit dem du lernst. Hier hast du
        es also mit einem Online-Angebot zu tun, bei dem du diese Faktoren im
        Wesentlichen selbst bestimmen kannst. Du solltest dich in diesem
        Abschnitt über das selbstständige Lernen informieren, aber du kannst
        auch mit deiner Deutsch-Lehrkraft in Kontakt sein, welche Materialien du
        bearbeiten solltest.
      </p>
      <p>
        Wir lernen eigentlich das ganze Leben lang, daher spricht man auch von
        lebenslangem Lernen. Aber dies passiert auf verschiedene Weise. Manche
        Dinge lernen wir ganz gezielt (explizit), das heißt, wir wählen sie,
        weil wir sie zum Beispiel bei der Arbeit brauchen. Auf dieser Plattform
        kannst du grammatische Phänomene explizit lernen. Dafür suchen wir auch
        immer Kommunikationssituationen, wo diese gebraucht werden.
      </p>
      <p>
        Eine andere Art des Lernens ist das beiläufige (implizite) Lernen. Dabei
        sehen wir Dinge auf der Straße, in den Medien oder in einem Sprachkurs,
        an die wir uns später erinnern und die wir mit dem verbinden, was wir
        schon wissen.
      </p>
      <p>
        Wann, wo, mit wem und wie lernen wir am besten? Auch das hängt von
        persönlichen Interessen und Vorlieben ab. Aber hier sind einige
        Hinweise:
      </p>
      <p>Wann?</p>
      <p>
        Du solltest dir klar sein, zu welchen Tageszeiten du lernen kannst oder
        willst und wieviel Zeit du dafür verwenden möchtest. Für das Sprechen
        ist eine ganz korrekte Grammatik vielleicht nicht notwendig, für ein
        linguistisches Studium aber schon. Das hat natürlich einen Einfluss
        darauf, wie du welche Dinge lernst, und welche Ziele du selbst hast.
      </p>
      <p>Wo?</p>
      <p>
        Natürlich lernst du hier in diesem Online-Kurs, aber wo dein Computer
        steht oder dein Handy sich befindet, ist individuell ganz verschieden.
        Du solltest dir einen ruhigen Ort suchen, wenn du Dinge lernen willst,
        du solltest dich auch mit anderen Leuten treffen, wenn du diese Dinge
        praktisch ausprobieren willst.
      </p>
      <p>Mit wem?</p>
      <p>
        Im klassischen Modell lernt man mit anderen Lernenden und einer
        Lehrkraft. In diesem Kontext wird es keine Lehrkraft geben, die jeden
        Lernschritt beobachten kann. Du kannst aber über unsere
        Kommunikationskanäle jederzeit uns oder auch deine eigene
        Deutschlehrkraft erreichen, wenn du das möchtest. Auch solltest du
        versuchen, die gelernten Dinge mit Mitlernern auszuprobieren und zu
        verwenden. Gut ist auch, wenn man mit Menschen spricht, die Deutsch als
        Muttersprache haben (Muttersprachler). Dann bittest du am besten darum,
        dass diese Personen dich korrigieren.
      </p>
    </Column>
  );
}

function Chapter2() {
  return (
    <Column className="chapter-content">
      <p>
        Sicherlich ist dir schon aufgefallen, dass du manche Dinge einfach weißt
        und benutzen kannst, ohne viel darüber nachzudenken. Du hast dir also
        das Wissen verinnerlicht, man nennt das auch implizites Wissen. Bis du
        aber implizites Wissen aufgebaut hast, musst du den Lernprozess vom
        expliziten zum impliziten Wissen gehen. Explizites Wissen sind Dinge,
        die du ganz konkret und vielleicht mechanisch lernst. Sie müssen aber
        erst durch vielfältige Übungsformen und Anwendungsszenarien in
        implizites Wissen verwandelt werden, damit du die Dinge sozusagen
        automatisch anwenden kannst.
      </p>
      <p>
        Es ist wichtig, beim Lernen verschiedene Sinne anzusprechen, also
        mehrere Sinneskanäle zu verwenden. Dabei spielen zum Beispiel die
        Aktivitäten Hören, Sehen, Assoziieren oder Bewegung eine große Rolle. Du
        sollst also nicht nur an deinem IT-Gerät Elemente anklicken oder
        antippen und dann auf eine Reaktion des Computers warten. Gut ist es,
        die Dinge woanders nachzulesen oder wiederzufinden, weitere
        Informationen zu suchen und sehen, in welchem Verhältnis sie zu den
        anderen Dingen stehen. Dabei helfen auch folgende Wissenstipps:
      </p>
      <ul>
        <li>
          <p>
            Häufiges Wiederholen und Üben der Themen – eine Übung kann mehrmals
            gemacht werden, man kann auch Übungen auf anderen Webseiten oder in
            Lehrbüchern machen.
          </p>
        </li>
        <li>
          <p>
            Markieren der Dinge mit Farbe, z. B. Substantive:&nbsp;
            <span className="masculine">Maskulina (Artikel der)</span>,&nbsp;
            <span className="neutral">Neutra (Artikel das)</span>&nbsp;und&nbsp;
            <span className="feminine">Feminina (Artikel die)</span>.
          </p>
        </li>
        <li>
          <p>
            Verbinden von Bild – Wort – Aussprache und anderen Kanälen, also das
            Wort oder die Konstruktion sehen, hören, nachsprechen.
          </p>
        </li>
        <li>
          <p>
            Ein Vergleich zwischen verschiedenen Sprachen, die du sprichst, kann
            auch sehr hilfreich sein, um sich an grammatische Dinge zu erinnern.
            Was ist gleich und was sind Unterschiede? Werden im Englischen nicht
            auch Artikel verwendet (the, that, this – a, an)? Dabei gibt es
            Parallelen, wie man unbestimmte und bestimmte oder
            Demonstrativartikel Artikel verwendet (the, that, this – a, an)?
            Dabei gibt es Parallelen, wie man unbestimmte und bestimmte oder
            Demonstrativartikel benutzt, z. B. There is a car. – Da ist ein
            Auto. / The car ist green. – Das Auto ist grün. / That car is
            broken. – Dieses Auto ist kaputt.
          </p>
        </li>
        <li>
          <p>
            Versuche die neuen grammatischen Dinge in deiner Sprache aktiv zu
            verwenden. Schreibe eigene kleine Texte und lass sie von einer
            kompetenten Person korrigieren, sprich viel in der Fremdsprache.
          </p>
        </li>
        <li>
          <p>
            Bleib täglich in Kontakt mit der Sprache: Schau dir Filme auf
            Deutsch an, lies die täglichen Nachrichten auf Deutsch oder auch ein
            gutes Buch auf Deutsch, chatte auf Deutsch usw.
          </p>
        </li>
      </ul>
    </Column>
  );
}

function Chapter3() {
  return (
    <Column className="chapter-content">
      <h3>Welche Rolle spielt eine Lehrperson beim selbstständigen Lernen?</h3>
      <p>
        In der Schule oder an der Universität leiten die Lehrkräfte traditionell
        den Unterricht, indem sie den neuen Stoff präsentieren und erklären, die
        Lernenden ihn dann auf vielfältige Weise und mit vielen verschiedenen
        Materialien üben, z. B. mithilfe von Lehrbuchaufgaben, Experimenten oder
        Simulationen.
      </p>
      <p>
        Wenn du allein lernst, egal ob mit einem traditionellen Buch oder eben
        in einem Online-Kurs, fehlt die Lehrkraft. Du kannst sie zwar
        kontaktieren, aber z. B. die Kommunikation via E-Mail braucht Zeit. Die
        Lehrkraft fungiert also primär als Mentor oder Tutor. Sie kann dir
        Empfehlungen geben, wo du mit dem Lernen beginnen kannst und wie du
        weiter vorgehen solltest. Diese Hilfe solltest du zumindest am Anfang
        unbedingt nutzen. Du kannst auch kleine Tests und Prüfungen mit ihr
        organisieren, damit du deinen Fortschritt überprüfen kannst.
      </p>
      <p>
        Besondere Hilfe brauchst du, wenn du nicht weiterweißt oder etwas nicht
        verstehst. Dann musst du dir Hilfe suchen. Hilfe bekommt man am besten,
        wenn man darum bittet! Frage also uns als Autoren dieser Seiten oder
        deine Lehrkraft. Dafür findest du auf der Seite
        Kommunikations-Formulare. Stelle nur sicher, dass du eine
        Kontaktmöglichkeit (E-Mail, Telefon) angibst, damit wir dir antworten
        können. Besonders gute Fragen werden wir in einer Liste von häufig
        gestellten Fragen (FAQ) zusammenstellen. Als Helfer in der Not können
        aber auch Mitlerner (so genannte Peers), Freunde und Familienmitglieder
        dienen. Vielleicht haben sie Erfahrung mit Deutsch und können dir
        helfen.
      </p>
      <h3>Verantwortung für das eigene Lernen übernehmen</h3>
      <p>
        Wenn du also ganz allein lernen möchtest, solltest du dir selbst einige
        Fragen beantworten.
      </p>
      <h3>Was will ich lernen?</h3>
      <p>
        Bei der Auswahl der Themen, die du lernen möchtest, spielen die Ziele
        und auch dein persönliches Interesse eine große Rolle. Es ist besser,
        wenn du dich danach richtest, was du sagen willst. Auf diesen Seiten
        findest du dann die grammatischen Dinge, die du dafür brauchst. Wir
        stellen sie auch graphisch so dar, dass man sehen kann, welche anderen
        Phänomene man beherrschen muss, also was damit verbundene Lerninhalte
        sind.
      </p>
      <h3>Warum möchte ich gerade das lernen? Wofür brauche ich es?</h3>
      <p>
        Hier geht es um die Frage der Zielstellungen. Stelle dir ein Lernziel,
        z. B. Ich möchte lernen, wie man auf Deutsch über vergangene Ereignisse
        spricht. Das kann ein zentrales Ziel sein. Damit du damit nicht
        überfordert wirst und dann vielleicht das Interesse oder den Überblick
        verlierst, solltest du dieses zentrale Ziel in kleinere Teilziele
        aufteilen, die du in einer kurzen Zeit, vielleicht in einer
        Übungsstunde, erlernen kannst, z. B. Heute möchte ich lernen, welche
        Zeitformen im Deutschen Vergangenes bezeichnen und wie man sie
        verwendet, später vielleicht die Frage Wie bildet man das Perfekt? oder
        Welche Form hat das Partizip? oder Wann benutzt man beim Perfekt sein
        und wann haben? Diese Teilziele kannst du auch in den graphischen
        Darstellungen mit den verbundenen Phänomenen erkennen, z. B.:
      </p>
      <Column w={"100%"}>
        <Image
          src="/das_perfekt.png"
          alt="Das Perfekt"
          width={842}
          height={375}
        />
      </Column>

      <h3>Wie möchte ich vorgehen, um das zu lernen?</h3>
      <p>
        Auch hier können dir die Grafiken mit den verbundenen Phänomenen helfen,
        indem du sie der Reihe nach bearbeitest. Dabei ist es gut, wenn du dir
        eine Reihenfolge von Arbeitsschritten überlegst, die zu deinem
        Lernmuster passt. Folgende Vorgehensweise hat sich bewährt:
      </p>
      <ul>
        <li>
          <p>
            Erkennen: Sieh dir das Material an und finde die Struktur, die du
            lernen willst. Du kannst sie markieren, herausschreiben oder auch
            laut vorlesen. Dazu gibt es Übungen auf den Seiten.
          </p>
        </li>
        <li>
          <p>
            Suchen: Versuche in weiteren Texten oder  Korpora, die du selbst
            auswählen kannst, die Struktur, die du lernen willst, in der
            „normalen“ deutschen Sprache zu finden. Wie oft kommt sie vor?
          </p>
        </li>
        <li>
          <p>
            Schlussfolgern: Wann, in welchen Kommunikationssituationen wird die
            Struktur verwendet?
          </p>
        </li>
        <li>
          <p>
            Ausprobieren: Versuche nun, die Struktur mit eigenen Wörtern oder
            Sätzen zu bilden. Dabei können dir auf dieser Seite auch einfache
            Übungen helfen. Gut ist es, wenn du ein System erkennst, wie diese
            Struktur im Allgemeinen gebildet wird. Dann wirst du auch die
            Elemente finden, die schwieriger zu erlernen sind. Auf diese
            solltest du dich dann in deinen folgenden Übungen konzentrieren.
          </p>
        </li>
        <li>
          <p>
            In einen Kommunikationskontext setzen: Wenn du die Struktur bilden
            kannst, sieh und hör dir in einem Korpus oder einem Text, einem
            Video oder einem anderen Medium an, wie Muttersprachler die Struktur
            verwenden. Auf dieser Seite gibt es auch Übungen, die
            Kommunikationssituationen vorgeben. Dann solltest du dir zuerst die
            Wörter ansehen, damit du sie verstehst.
          </p>
        </li>
        <li>
          <p>
            Nach dem Üben: Beobachte dein deutschsprachiges Umfeld, also deine
            Peers, deutschsprachige Medien (gut sind Bücher, die du schon in
            deiner Muttersprache gelesen hast), Filme und andere. Wenn du sehr
            aufmerksam bist, dann stellst du fest, dass die Struktur vielleicht
            sehr häufig vorkommt – dann solltest du sie regelmäßig üben und
            wiederholen – oder eher selten – dann ist es nicht so problematisch,
            wenn du damit noch Schwierigkeiten hast.
          </p>
        </li>
        <li>
          <p>
            Regelmäßig wiederholen: Dazu kannst du die Übungen auf dieser Seite
            verwenden; auch wenn du eine Übung schon einmal gemacht hast, kannst
            du sie wiederholen. So festigt sich dein Wissen, und aus explizitem
            Wissen wird langsam implizites, und du brauchst nicht mehr so viel
            nachzudenken, wenn du die Struktur benutzt.
          </p>
        </li>
      </ul>
      <p>
        All dies hängt natürlich von deinen eigenen Lernstrategien ab, d. h. wie
        du am besten lernst. Das ist bei jedem Menschen anders.
      </p>
      <h3>Welche Materialien möchte ich zum Lernen verwenden?</h3>
      <p>
        Auf dieser Seite findest du viele verschiedene Übungen, die sich an
        unterschiedliche „Lernertypen“ richten. Das ist das Grundmaterial. Auf
        jeden Fall solltest du andere Materialien benutzen, z. B. solche, die in
        deinem Deutschkurs verwendet werden, also Lehr- und Übungsbücher,
        Material von deiner Deutschlehrkraft usw. Mit diesem Online-Kurs kannst
        du das Material ergänzen. Auch Medien aller Art geben dir viel zum Lesen
        oder Hören. Das hat zugleich einen positiven Effekt auf deine
        praktischen Fertigkeiten wie Sprechen oder Schreiben. Benutze jeden Tag
        etwas die deutsche Sprache.
      </p>
      <h3>Möchte ich allein oder mit anderen zusammen lernen?</h3>
      <p>
        Zuerst muss man sagen: Mit anderen lernen ist die beste Methode! Wenn du
        nur online lernen willst, dann solltest du wenigstens soziale Medien
        oder Kommunikations-Apps verwenden, um mit anderen Menschen über das
        Lernen von Fremdsprachen zu reden. Dabei können folgende Fragen
        interessant sein:
      </p>
      <ul>
        <li>
          <p>
            Wie lernen deine Gesprächspartner Deutsch (oder andere
            Fremdsprachen)?
          </p>
        </li>
        <li>
          <p>
            Welche Strukturen und grammatische Phänomene finden sie im Deutschen
            am schwierigsten?
          </p>
        </li>
        <li>
          <p>Wie lösen sie auftretende Probleme beim Lernen?</p>
        </li>
      </ul>
      <p>
        Natürlich kannst du auf Deutsch auch über ganz andere Sachen sprechen.
        Oder wie wäre eine künstliche Intelligenz (KI) als Gesprächspartner?
        Wenn du sie bittest, dich zu korrigieren, kannst du eine KI als
        Lernpartner benutzen.
      </p>
      <p>
        Ab und zu musst du dich aber von der Technik entfernen und dich mit
        Leuten treffen, die auch Deutsch lernen oder die Muttersprachler sind.
        Da bietet sich das Klassenzimmer an. Ein Online-Kurs bringt die besten
        Ergebnisse, wenn man ihn als Zusatzmaterial neben einem Deutschkurs
        verwendet. In der Klasse kann man die Dinge gleich mal ausprobieren,
        ohne schon in einer „realen“ Situation zu sein – und deine Lehrkraft
        kann dich korrigieren. Noch besser ist es, sich gegenseitig („peer to
        peer“) zu korrigieren und die Lehrkraft nur dann zu fragen, wenn alle
        nicht wissen, wie es richtig ist.
      </p>
      <h3>Welche Hilfsmittel gibt es und wie werden sie verwendet?</h3>
      <p>
        Diese Seiten bieten dir neben Erklärungen und Übungen – also klassischem
        Lernmaterial – auch viele andere Werkzeuge, mit denen du deinen
        Lernerfolg verbessern kannst. Hier sind einige erklärt.
      </p>
      <ul>
        <li>
          <p>
            <strong>Wörterbücher und Übersetzungswerkzeuge:</strong>Wir bemühen
            uns um eine einfache Sprache bei den Erklärungen und auch bei diesem
            Text. Aber manchmal versteht man etwas nicht. Dann kann es beim
            Lernen helfen, Wörterbücher oder andere Übersetzungshilfen zu
            verwenden. Es gibt viele, auch KI, z. B. DeepL, Google Translate, MS
            Copilot usw. Benutze sie aber nur dann, wenn du gar keine Ahnung
            hast, was der Text sagt. Versuche zu interpolieren, d. h. unbekannte
            Wörter aus dem Kontext zu erraten! Man wird richtig gut, wenn man
            das immer tut.
          </p>
        </li>
        <li>
          <p>
            <strong>Andere Grammatiken:</strong>Unsere Erklärungen sind für dich
            nicht so gut? Dann kannst du auf diesen Seiten Links zu weiteren
            Grammatik-Seiten und Büchern finden. Vielleicht gelingt es anderen
            Sprachlehrern, das gesuchte Phänomen für dich besser oder einfacher
            zu erklären. Probiere es aus, oft gibt es auch weitere Übungen dort!
          </p>
        </li>
        <li>
          <p>
            <strong>Korpora:</strong> Ein Korpus ist eine Sammlung von Texten
            aus der realen Welt, also keine von einer Deutschlehrkraft oder
            einer KI erfundenen Texte zum Deutschlernen. Diese authentischen
            Texte kommen z. B. aus Zeitungen oder Fachzeitschriften, aus der
            Literatur, manchmal sind es auch Texte von anderen Deutschlernern.
            Auf diesen Seiten gibt es einige Links zu Korpora. Mit einem Korpus
            kannst du nicht nur sehen, wie die Struktur von Journalisten oder
            Wissenschaftlern und Schriftstellern verwendet wird. Durch „Surfen"
            kannst du auch Gesetzmäßigkeiten der Sprache erkennen. Viele Korpora
            enthalten zusätzlich grammatische Informationen (→ Rektion),
            lexikalische (→ Genus) oder phonetische Angaben (Aussprache), die
            dir beim Lernen helfen können.
          </p>
        </li>
        <li>
          <p>
            <strong>Talk-Back-Kanäle:</strong> Das sind Wege, über die du uns
            oder deine eigene, gewohnte Lehrkraft erreichen kannst, wenn es
            Fragen gibt. Bei uns gibt es keine automatischen Antworten, d. h.
            jede Frage wird von uns einzeln, individuell und konkret
            beantwortet. Wir werden aber Fragen, die oft gestellt werden in
            einer Liste der häufigsten Fragen (FAQ) zusammenstellen. Alternativ
            kannst du also deine Lehrkraft kontaktieren, auch dazu gibt es auf
            der Seite ein Formular. Vergiss nur nicht, deine E-Mail-Adresse oder
            eine andere Kontaktmöglichkeit anzugeben, damit du die Antwort
            erhalten kannst.
          </p>
        </li>
      </ul>
      <h3>Wie kann ich kontrollieren, ob ich erfolgreich gelernt habe?</h3>
      <p>
        Wenn du selbstständig lernst, musst du auch überprüfen, ob und wie gut
        du die Dinge gelernt hast. Wir helfen dir dabei, indem wir am Ende von
        manchen Seiten oder Kapiteln mehrere Selbst-Tests zu der betreffenden
        grammatischen Struktur anbieten. Hier kannst du sogar vor dem Üben
        nachsehen, wie gut du die Sache jetzt schon kannst. Dann kannst du
        entscheiden, ob du sie jetzt weiter lernen willst. Nach dem Üben benutzt
        du dann einfach einen anderen Kontrolltest.
      </p>
      <p>
        Bei der Einschätzung deiner Kenntnisse und Fertigkeiten
        (Selbstevaluation) kannst du auch andere Werkzeuge verwenden. Das beste
        Zeichen, dass du gut gelernt hast, ist das subjektive Gefühl der
        Verbesserung bei der Kommunikation: du sprichst fließender, du musst
        nicht so oft nach Wörtern suchen oder Hilfsmittel verwenden, deine
        Konzentration liegt mehr auf der Sache als auf der Grammatik. Du
        solltest dich auch über kleine Fortschritte freuen. Sprachenlernen
        braucht viel Zeit und Wiederholung. Rom wurde auch nicht an einem Tag
        erbaut, sagt man gerne auf Deutsch.
      </p>
    </Column>
  );
}

function Chapter4() {
  return (
    <Column className="chapter-content">
      <h3>Was ist ein „Lerntyp"?</h3>
      <p>
        Die Bezeichnung „Lerntyp" bezieht sich eigentlich darauf, mit welchen
        Aktivitäten man am besten lernt. Darum nennt man sie vielleicht besser
        Lernmuster. Manche Menschen möchten neue Dinge lesen, in graphischen
        Darstellungen sehen, sie erinnern sich zum Beispiel an eine Seite im
        Lehrbuch – man erkennt hier <strong>visuelle Lernmuster</strong>. Andere
        wollen neue Wörter hören und laut lesen, sie mögen
        Hörverständnisaufgaben und erinnern sich später gut an gehörte Sprache.
        Dann spricht man von einem
        <strong>auditiven Lernmuster</strong>. Wieder andere Menschen wollen die
        Dinge berühren oder vielleicht bewegen, sie lernen durch aktive
        Tätigkeit. Dann kann man von einem{" "}
        <strong>taktil-haptischen Lernmuster</strong>
        sprechen. Und dann gibt es noch die Lerner, die nicht stillsitzen
        können. noch die Lerner, die nicht stillsitzen können. Sie lernen neue
        Dinge durch Bewegung, Tanz, Schauspielen oder andere körperliche
        Bewegungen. Man nennt dies <strong>kinästhetisches Lernmuster</strong>.
      </p>
      <p>
        Sicherlich hast du dich bereits in einem der Lernmuster selbst entdeckt.
        Wir wissen meistens, wie wir am besten lernen wollen. Natürlich treten
        diese Lernmuster in der Realität nicht so schön geordnet und getrennt
        auf. Wir können mehrere Lernmuster verwenden. Oft ist die Kombination
        mehrerer Kanäle und das Anregen mehrerer Sinne beim Lernen sehr
        hilfreich.
      </p>
      <p>
        Beim selbstständigen Lernen mit Online-Material ist dieses Wissen
        doppelt wichtig, weil ja keine Lehrkraft da ist, die uns Übungen gibt,
        sondern wir müssen sie selbst wählen. Traditionelle Grammatik-Übungen
        sind Lückentexte (z. B. Setzen Sie die Verben in die Sätze ein.),
        Multiple-Choice- Aufgaben (z. B. Was ist hier richtig/falsch?) oder
        Umformungsaufgaben (z. B. Schreiben Sie die Sätze im Perfekt.). Bei
        Online-Übungsformen findet man häufig solche Übungen, die leicht mit dem
        Computer zu erstellen sind: Multiple-Choice-Übungen, Zuordnungs-
        (Matching)-Übungen, verschiedene Quizformen oder Spiele. Dabei werden
        die Möglichkeiten des Computers benutzt, man kann
        Drag-and-Drop-Varianten finden oder auch Abenteuer- oder andere Spiele.
        Auf diesen Seiten versuchen wir Grammatik-Übungen für alle Lernmuster
        anzubieten.
      </p>
      <p>
        Menschen mit visuellem Lernmuster machen vielleicht gern Übungen, bei
        denen sie graphisch etwas ergänzen sollen, oder sie profitieren von der
        graphischen Darstellung der grammatischen Strukturen in Diagrammen und
        Schaubildern – oder es macht ihnen Spaß, selbst welche zu erstellen. Um
        auch auditive Lernmuster zu unterstützen, haben wir hier auch Lese- und
        (Nach-) Sprechübungen eingefügt. Das taktil-haptische Lernmuster kann
        man bei Online-Übungen zum Beispiel durch so genannte
        Drag-and-Drop-Übungen realisieren, dazu gehören Zuordnungsübungen oder
        solche, wo Sätze oder Wörter, vielleicht auch Dialog-Repliken, in die
        richtige Reihenfolge gebracht werden sollen. Man muss im Rahmen der
        Lernsituation an Computer oder Handy physisch aktiv etwas machen. Um
        mehrere Kanäle anzusprechen, ist es sicher gut, verschiedene Typen von
        Übungen auszuprobieren. Dabei kann man sich auch neue Lernmuster
        aneignen.
      </p>
      <p>
        Wenn du nicht sicher bist, was für ein Lernmuster du bevorzugst, dann
        kannst du im Internet viele Ressourcen finden, um es herauszufinden,
        hier eine kleine Liste (Stand: 24.2.2025):
      </p>
      <Container bg="var(--bg4)" r="md" p="md">
        <ul>
          <li>
            Hamburger Fernhochschule&nbsp;
            <a
              href="https://www.hfh-fernstudium.de/blog/welcher-lerntyp-bist-du"
              target="_blank"
              rel="noopener noreferrer"
            >
              Erklärung der Lerntypen
            </a>
          </li>
          <li>
            Geolino&nbsp;
            <a
              href="https://www.geo.de/geolino/mensch/5849-rtkl-lernen-welcher-lerntyp-bist-du"
              target="_blank"
              rel="noopener noreferrer"
            >
              Erklärungen zu den Lerntypen
            </a>
          </li>
          <li>
            iQ Lingua&nbsp;
            <a
              href="https://www.iq-lingua.de/typ-checks/welcher-lerntyp-bin-ich/#c42954"
              target="_blank"
              rel="noopener noreferrer"
            >
              Welcher Lerntyp bin ich?
            </a>
            &nbsp;mit direkter Auswertung.
          </li>
          <li>
            Kapiert.de&nbsp;
            <a
              href="https://www.kapiert.de/lerntypentest/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Welcher Lerntyp bin ich?
            </a>
            &nbsp;mit direkter Auswertung.
          </li>
        </ul>
      </Container>

      <h3>Lernstrategien beim selbstständigen Lernen</h3>
      <p>
        Eng mit den Lernmustern verbunden sind Lernstrategien mit konkreten
        Lerntechniken. Dabei kann man die folgenden Lernstrategien
        unterscheiden:
      </p>
      <p>
        <strong>Erinnerungsstrategien:</strong> Wie kann ich mich besser an
        gelernte Dinge erinnern? Dazu kann man folgende Lerntechniken anwenden:
      </p>
      <ul>
        <li>
          Elemente in Gruppen sammeln, gleichartige Elemente gruppieren, z. B.
          Sortieren Sie die Wörter, die zusammenpassen, in 2 Gruppen: die
          Lektüre, das Hörspiel, das Buch, das Radio, lesen, zuhören, der
          Podcast.
        </li>
        <li>
          Assoziieren, neue Wörter in einen Zusammenhang bringen, um sie sich
          besser zu merken. Das können Wortfamilien sein, also unterschiedliche
          Wortarten mit dem gleichen Stamm: sich interessieren, das Interesse,
          interessant, interessiert sein. Vielleicht auch Assoziationen: das
          Radio – die Musik – hören – das Hörspiel – nostalgisch – das Autoradio
          – gemütlich.
        </li>
        <li>
          Bilder, Töne/Laute, Bild-Ton Kombinationen, Handlungen usw. benutzen,
          um sich neue Ausdrücke besser zu merken. Man kann sich zum Beispiel
          Bilder oder Videos zu bestimmten Lektionen anschauen, neue Wörter
          hören, laut lesen. Manchmal eignet sich auch das mimische, gestische
          oder dramatische Nachspielen von Wörtern.
        </li>
        <li>
          Beim Erinnern hilft auch strukturiertes Arbeiten, zum Beispiel immer
          nach einem bestimmten Plan vorgehen, in einer bestimmten Reihenfolge,
          vom Leichten zum Schweren, vom Erkennen zum Verwenden. Das hängt ganz
          von dir selbst ab. Eine wichtige Technik ist auch die Wiederholung
          älterer Materialien. Wenn du eine Übung gemacht hast, dann solltest du
          nach einiger Zeit zurückgehen und die Übung noch einmal machen.
        </li>
      </ul>

      <h3>Welche Lerntechniken helfen mir beim Lernen und Wiederholen?</h3>
      <p>
        Das Wiederholen gelernter Dinge sollte für dich ganz normal sein. Aber
        auch beim Lernen neuer Sachen kann man effektiv sein, indem man zum
        Beispiel folgende Lerntechniken erlernt und anwendet. Auf dieser
        Webseite wird es Übungen mit diesen Lerntechniken geben.
      </p>
      <ul>
        <li>
          Laute und Schrift üben – Wörter oder grammatische Regeln aufschreiben.
        </li>
        <li>
          Formeln und Tabellen benutzen – Wörter oder grammatische Regeln in
          Tabellen zusammenfassen, aus Tabellen lernen, Tabellen ergänzen usw.
        </li>
        <li>
          Vertraute Elemente auf neue und unterschiedliche Weise kombinieren.
        </li>
        <li>
          Die Fremdsprache in verschiedenen authentischen Situationen benutzen –
          dabei hören, lesen, sprechen und schreiben.
        </li>
        <li>
          Schnelles Lesen, um die Hauptaussage eines Textes zu erfassen.
          Schnelles Lesen muss man üben, dann wird man immer besser.
        </li>
        <li>
          Nachschlagewerke benutzen. Für das Deutsche gibt es den Duden und
          andere deutschsprachige Wörterbücher (Langenscheidt, Wahrig,
          Brockhaus) mit ihren Online- Ressourcen, dazu das Digitale Wörterbuch
          der deutschen Sprache (
          <a href="https://www.dwds.de" target="_blank">
            DWDS
          </a>
          ), einige weitere Sprachkorpora und viele mehrsprachige Wörterbücher.
          Auch die Wikipedia ist sehr gut, da sie zum gleichen Thema Texte in
          verschiedenen Sprachen anbietet, so genannte Paralleltexte. Bei
          Online-Quellen immer kritisch sein!
        </li>
        <li>Notizen machen und Gehörtes oder Gelesenes zusammenfassen.</li>
        <li>
          Deduktiv denken – von einer Regel ausgehen und nach Beispielen in der
          Sprache suchen. Dazu kannst du Korpora verwenden, in ihnen werden
          viele Sprachbeispiele gesammelt. Beispiele für Korpora:{" "}
          <a href="https://www.dwds.de" target="_blank">
            www.dwds.de
          </a>{" "}
          oder{" "}
          <a href="https://wortschatz.uni-leipzig.de" target="_blank">
            wortschatz.uni-leipzig.de
          </a>
          .
        </li>
        <li>Ausdrücke analysieren; Sprachen kontrastiv analysieren.</li>
        <li>
          Vorsichtig sein bei wörtlicher Übersetzung und bei direkten
          Übertragungen von einer Sprache zur anderen. Manchmal gibt es „falsche
          Freunde", d. h. Wörter, die die gleiche oder eine ähnliche Form, aber
          eine andere Bedeutung haben.
        </li>
      </ul>

      <h3>
        Was kann ich tun, wenn ich bei einer Aufgabe oder einem Gespräch nicht
        weiterweiß?
      </h3>
      <p>
        Jeder kennt die Situation, dass man ein Wort nicht weiß oder dass es
        einem in diesem Moment nicht einfällt. Dann muss man sehen, dass man die
        Situation irgendwie löst. Dabei können vielleicht die folgenden
        Lerntechniken helfen.
      </p>
      <ul>
        <li>
          Man kann aus dem Kontext Indizien benutzen, um die Bedeutung
          fremdsprachlicher Ausdrücke zu erraten. Ebenso wie beim schnellen
          Lesen kann man auch das Erraten unbekannter Ausdrücke aus dem Kontext
          lernen! Wichtig: Erst raten, dann später nachschlagen.
        </li>
        <li>
          Global statt jedes Detail verstehen. Wenn du ein unbekanntes Wort
          findest, lies erst einmal weiter, um das große Thema des Textes zu
          verstehen. Vielleicht wird dir dann klar, was das unbekannte Wort
          bedeutet. Später kannst du immer noch nachschlagen. Also bleib nicht
          an einem unbekannten Wort hängen – in der mündlichen Konversation geht
          das auch nicht.
        </li>
        <li>
          Bei der sprachlichen Kommunikation kann es auch helfen, Mittel zu
          finden, um die gesprochene oder geschriebene Hauptaussage trotz der
          begrenzten Sprachkenntnisse zu verstehen. Beim Sprechen kannst du zum
          Beispiel Bewegungen oder Gesten benutzen, quasi „mit Händen und Füßen
          sprechen". Manchmal ist es auch möglich, kurz in deine Muttersprache
          zu wechseln (Code Switching). Eine gute Technik ist die Verwendung von
          Synonymen oder Umschreibungen (paraphrasieren) unbekannter Wörter –
          finde einen Weg! Nachschlagen kannst du dann wieder später.
          Unterhaltsam und lustig kann es auch sein, das fehlende Wort einfach
          zu „erfinden".
        </li>
      </ul>

      <h3>Wie kann ich am besten lernen?</h3>
      <p>
        Dieses Thema haben wir schon in Kapitel 3 angesprochen. Das Lernen ist
        ein sehr individueller Prozess, aber einige Lerntechniken kannst du als
        Hilfe beim Organisieren deines eigenen Lernprozesses einsetzen.
      </p>
      <ul>
        <li>
          Du solltest einen „Master-Plan", einen Überblick über das eigene
          Lernen haben. Dabei spielen die Fragen aus Kapitel 3 eine wichtige
          Rolle. Es ist gut, den Plan aufzuschreiben und immer wieder
          nachzulesen, was du machen wolltest. So kannst du dich besser an
          deinen Plan halten.
        </li>
        <li>
          Aus früheren Sprachkursen hast du vielleicht bekannte Lernmaterialien
          (Lehrbücher, Videos oder eigene Lernhefte). Die kannst du prima in den
          eigenen Lernplan einsetzen. Wenn man mit bekannten Materialien lernt,
          fällt einem Manches leichter.
        </li>
        <li>
          Zu deinem Lernplan gehört auch die Frage, wie genau du die Dinge
          lernen willst. Du kannst dich entscheiden, ob du auf Details oder auf
          das Ganze (globales Verstehen) achten willst.
        </li>
        <li>
          Hilfreich ist es auch herauszufinden, wie das persönliche
          Fremdsprachenlernen funktioniert. Mit dem freiwilligen Fragebogen auf
          dieser Seite kannst du herausfinden, welche Strategien du
          normalerweise benutzt. So lernst du dich und dein Lernen ein bisschen
          besser kennen und du kannst bewusst bestimmte Übungen auswählen.
        </li>
        <li>
          In Kapitel 3 haben wir schon gesagt, dass man sich beim Lernen
          organisieren muss. Dazu gehören Dinge wie ein Zeitplan, die Umgebung,
          ein Heft oder lieber ein Tablet/ein Computer usw.
        </li>
        <li>
          Setz dir realistische Ziele beim Lernen. Denk daran, dass auch kleine
          Schritte zum Ziel führen.
        </li>
        <li>
          Wenn du eine Übung in der Fremdsprache machen willst, versuche das
          Ziel dieser Aufgabe zu identifizieren. Was soll ich mit dieser Übung
          lernen? Wenn du das verstehst, lernst du besser. Du kannst dann auch
          andere Übungen dieser Art machen oder sogar selbst erfinden.
        </li>
        <li>
          Das Lösen einer Aufgabe in der Fremdsprache kann man planen. Finde
          deine eigene Schrittfolge. Hier ist ein Vorschlag:
          <ul>
            <li>Erst einmal alles durchlesen,</li>
            <li>dann die Instruktionen und Beispiele lesen,</li>
            <li>danach unbekannte Wörter erraten oder nachschlagen,</li>
            <li>als nächstes die Lösung versuchen und überprüfen.</li>
          </ul>
        </li>
        <li>
          Gelegenheiten zum Üben gibt es viele, nicht nur den Unterricht oder
          deine Online-Session. Du kannst in deiner eigenen Lebensumgebung viele
          Situationen finden, in denen du lernen kannst. Zum Beispiel beim
          Einkaufen kannst du dir die Frage stellen, wie die Produkte auf
          Deutsch heißen. Zu Hause kannst du dann deinen Erfolg überprüfen.
        </li>
        <li>
          Aus Fehlern kann man lernen. Das ist ein Hauptprinzip beim Lernen
          einer Fremdsprache. Manchmal ist es aber schwierig, die eigenen Fehler
          zu bemerken. Es geht immer besser, je mehr man schon gelernt hat, aber
          du sollst auch schon am Anfang selbstkritisch deine Sprachproduktion
          betrachten und versuchen deine eigenen Fehler zu finden. Nur dann
          kannst du von ihnen lernen. In den Übungen auf dieser Seite hilft dir
          das Feedback dabei. Auch Muttersprachler können dir dabei helfen, wenn
          du sie bittest, dass sie dich im Gespräch korrigieren.
        </li>
        <li>
          Sieh dir deinen Lernplan an und schätze dich selbst ein, welche
          Fortschritte du schon gemacht hast. Einige Fragen, die du dir selbst
          stellen kannst, können sein: Wie gut kann ich die Dinge, die ich
          lernen wollte? Habe ich alle Dinge geübt, die ich geplant hatte?
          Spreche ich nun fließender? Muss ich weniger nachdenken?
        </li>
      </ul>

      <h3>Was kann ich gegen Angst vor Fehlern tun?</h3>
      <p>
        Beim Lernen spielen auch Gefühle und Emotionen eine große Rolle.
        Negative Emotionen haben einen schlechten Einfluss auf die
        Lernmotivation. Es ist also wichtig, dass du lernst, deine Gefühle im
        Zusammenhang mit dem Deutschlernen zu „managen". Diese Techniken können
        dabei hilfreich sein:
      </p>
      <ul>
        <li>
          Angst verringern. Es gibt keinen Grund, bei der Verwendung einer
          Fremdsprache Angst zu haben. Wovor sollte man denn Angst haben?
          <ul>
            <li>
              Angst vor Fehlern? – Fehler sind eine Quelle von Wissen, also mach
              deine Fehler selbstbewusst. Das Feedback des Computers ist immer
              gleich nett, deine Lehrkraft und auch Muttersprachler, die du um
              Korrekturen bittest, helfen dir gerne!
            </li>
            <li>
              Angst vor den Mitlernern? – Es gibt Situationen, in denen du
              vielleicht denkst, dass deine Peers viel besser sind als du
              selbst. Bedenke dies: Manche Sprachlerner sprechen sehr viel, sie
              machen aber auch viele Fehler. Du bekommst vielleicht ein falsches
              Bild von den Fähigkeiten deiner Mitlerner. Nicht so konstruktiv
              ist der Weg, wenig zu sprechen, genau über jedes einzelne Wort und
              jedes grammatische Phänomen nachzudenken. Das behindert die
              Kommunikation. Also auch hier gilt: Mach deine Fehler
              selbstbewusst und lerne aus ihnen! So machst du die besten
              Fortschritte.
            </li>
          </ul>
        </li>
        <li>
          So entwickelst du auch ein positives Denken, mit dem du dir immer Mut
          machen kannst. Kleine Schritte führen auch zum Ziel. Du schaffst es!
          Hab Geduld!
        </li>
        <li>
          Manchmal solltest du auch kleine Risiken eingehen, um neu gelernte
          Dinge auszuprobieren. Natürlich geht das nicht immer gut, aber es
          können daraus interessante Gespräche entstehen, du lernst etwas Neues
          – oder es ist einfach nur lustig. Dann solltest du mitlachen! Solche
          kleinen Missgeschicke passieren jedem!
        </li>
        <li>
          Nach der Arbeit steht der Lohn, also belohne dich, wenn du etwas gut
          gelernt hast! Du hast es dir durch eigene Arbeit verdient! Mach etwas,
          was dir guttut! Es muss nichts mit der deutschen Sprache zu tun haben!
          Jeder Mensch braucht Erholungspausen. Dein Gehirn „sortiert" dann die
          Dinge, die du gelernt hast.
        </li>
        <li>
          Wenn du, besonders in der Konversation, auf dich selbst achtest, dann
          kannst du vielleicht bemerken, dass du ein wenig gestresst und
          angespannt bist. Wenn du die eigene Anspannung wahrnehmen kannst, ist
          es auch leichter, etwas dagegen zu tun, z. B. Entspannungstechniken
          anzuwenden. Zum Beispiel ein paarmal tief ein- und auszuatmen und sich
          nur auf dieses Atmen zu konzentrieren hilft dann schon viel.
        </li>
        <li>
          Vielen Lernern hilft es auch, ein Tagebuch zu führen. Da schreibst du
          hinein, wann du wie lange und was gelernt hast. Auch welche Übungen du
          gemacht hast. Diese Seiten werden dir ein bisschen dabei helfen. Wenn
          du dich bei diesen Seiten zum Üben anmeldest, informiert dich der
          Computer über die Teile, die du schon gemacht hast. Das ist auch der
          einzige Grund, warum du dich zum Üben anmelden musst. Wenn du ein
          Lerntagebuch in einem Heft führst, dann kannst du auch deine Gedanken
          und Gefühle aufschreiben, die du beim Lernen hast. Das hilft dir
          später beim Lernen.
        </li>
        <li>
          Über die eigenen Gefühle und Einstellungen gegenüber dem
          Sprachenlernen kannst du natürlich auch mit anderen Menschen (Familie,
          Freunde, Kollegen, Lehrer usw.) sprechen. Das ist der beste Weg,
          Gefühle und Emotionen zu „managen".
        </li>
      </ul>

      <h3>Wie kann ich von anderen Personen beim Lernen profitieren?</h3>
      <p>
        Auch am Computer oder am Handy in einem Online-Lernangebot ist man kein
        isolierter Lerner. Hier gilt dasselbe wie beim Lernen in der Klasse:
        Lerne von anderen! Einige Techniken haben wir schon genannt, aber hier
        sind weitere Lerntechniken, die man beim Lernen mit und von anderen
        Menschen anwenden kann.
      </p>
      <ul>
        <li>
          Fragen stellen, um Erklärungen zu bekommen. Wer nicht fragt, bekommt
          keine Antworten, also frag deine Lehrkraft, frag uns oder andere
          deutsche Muttersprachler. „Es gibt keine dummen Fragen."
        </li>
        <li>
          Bitte andere Personen darum, deine Sprache zu verbessern. Überprüfe
          auch und frage nach, warum sie dich an dieser Stelle verbessert haben.
        </li>
        <li>
          Bei der gemeinsamen Arbeit an kleinen Projekten mit anderen Lernenden
          oder mit anderen kompetenten Sprechern der Fremdsprache kann man viel
          lernen. Das gilt besonders auch in der linguistischen Forschung. Auf
          diesen Seiten gibt es einige „Forschungsaufträge", die du gemeinsam
          mit deinen Kolleginnen und Kollegen bearbeiten kannst.
        </li>
        <li>
          Durch häufigen Kontakt mit Muttersprachlern, deutschsprachigen Medien
          und durch Reisen kannst du ein (inter)kulturelles Bewusstsein
          entwickeln: In Deutschland/Österreich/in der Schweiz macht man das so.
          Das darf man in den deutschsprachigen Ländern niemals tun. Auch das
          Kennenlernen deutschsprachiger Kulturpersönlichkeiten kann dir dabei
          helfen, also lies neben deutschsprachigen Zeitungen und
          Fachzeitschriften auch ruhig mal einen Roman auf Deutsch, den du schon
          in deiner Muttersprache gelesen hast.
        </li>
        <li>
          Sich der Gedanken und Gefühle anderer bewusst werden. Denk auch
          manchmal darüber nach, wie sich andere Deutschlerner beim Lernen
          fühlen, oder Muttersprachler, wenn sie dich korrigieren oder ihre
          Sprache vereinfachen, damit du sie verstehst. Du kannst sie auch
          danach fragen. So entsteht eine Atmosphäre der Offenheit und ihr könnt
          euch besser kennenlernen.
        </li>
      </ul>
    </Column>
  );
}

function Chapter5() {
  return (
    <Column className="chapter-content">
      <p>
        Hier findest du einen Fragebogen, der von Fremdsprach-Didaktikern
        entwickelt wurde. Den kannst du auf Deutsch oder Englisch ausfüllen. Er
        soll dir zeigen, welche Lernstrategien du oP und gern verwendest. Dazu
        rechnet der Computer die DurchschniOswerte der einzelnen Teile aus. Je
        höher der Wert ist, desto mehr bevorzugst du Lernstrategien dieser
        Bereiche. Dann kannst du für dich geeignete Übungen auswählen.
      </p>
    </Column>
  );
}
