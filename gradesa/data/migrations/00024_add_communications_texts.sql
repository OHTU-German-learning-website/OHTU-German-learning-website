INSERT INTO communications_pages_html (id, content)
VALUES (1, '<Container className="chapter-content">
      <ul>
        <li>
          <Link href="/grammar/themes/perfekt">Perfekt</Link>
        </li>
        <li>Präteritum</li>
        <li>Plusquamperfekt</li>
        <li>Saltzklammer</li>
      </ul>
      <h2>
        Hier lernst du, wie du auf Deutsch über Ereignisse sprichst, die in der
        Vergangenheit liegen.
      </h2>
      <h3>Wie geht das?</h3>
      <GlossaryParagraph>
        Sieh dir die drei Textbeispiele an, die über das letzte Wochenende
        erzählen. Schau dir besonders die <strong>Verbformen</strong> an.
      </GlossaryParagraph>
      <p>1.</p>
      <GlossaryParagraph>
        Letztes Wochenende <strong>habe</strong>ich viel{" "}
        <strong>unternommen</strong>. Am Samstagmorgen <strong>bin</strong> ich
        früh <strong>aufgestanden</strong> und <strong>habe</strong> zuerst
        ausgiebig <strong>gefrühstückt</strong>. Danach <strong>habe</strong>{" "}
        ich meine Freunde <strong>getroffen</strong> und wir{" "}
        <strong>haben</strong> zusammen einen Ausflug in den Park{" "}
        <strong>gemacht</strong>. Dort <strong>haben</strong> wir Fußball{" "}
        <strong>gespielt</strong> und anschließend ein Picknick{" "}
        <strong>gemacht</strong>. Am Nachmittag <strong>bin</strong> ich nach
        Hause <strong>gegangen</strong> und <strong>habe</strong> einen Film{" "}
        <strong>geschaut</strong>. Abends <strong>habe</strong> ich mit meiner
        Familie <strong>gekocht</strong> und wir <strong>haben</strong>{" "}
        gemeinsam <strong>gegessen</strong>.
      </GlossaryParagraph>
      <GlossaryParagraph>
        Sonntag <strong>habe</strong> ich lange <strong>geschlafen</strong> und{" "}
        <strong>bin</strong> erst gegen Mittag <strong>aufgestanden</strong>.
        Ich <strong>habe</strong> ein paar Besorgungen <strong>gemacht</strong>{" "}
        und dann meine Wohnung <strong>aufgeräumt</strong>. Am Abend{" "}
        <strong>sind</strong> wir in einen Klub <strong>gefahren</strong> und{" "}
        <strong>haben getanzt</strong>. Insgesamt <strong>war</strong> es ein
        schönes und erholsames Wochenende.
      </GlossaryParagraph>
      <p>2.</p>
      <GlossaryParagraph>
        Letztes Wochenende <strong>war</strong> abwechslungsreich und
        entspannend. Am Samstag
        <strong>wachte</strong> ich früh <strong>auf</strong> und{" "}
        <strong>frühstückte</strong> in Ruhe. Danach <strong>erledigte</strong>{" "}
        ich einige Einkäufe und <strong>traf</strong> mich mit Freunden im Café.
        Wir <strong>plauderten</strong> lange und <strong>genossen</strong> den
        sonnigen Tag.
      </GlossaryParagraph>
      <GlossaryParagraph>
        Am Abend <strong>schaute</strong> ich einen Film und{" "}
        <strong>ließ</strong> den Tag gemütlich ausklingen. Am Sonntag{" "}
        <strong>schlief</strong> ich <strong>aus</strong> und{" "}
        <strong>machte</strong> einen langen Spaziergang im Park. Die frische
        Luft <strong>tat</strong> gut. Nachmittags <strong>backte</strong> ich
        einen Kuchen und <strong>las</strong> ein Buch.
      </GlossaryParagraph>
      <GlossaryParagraph>
        Am Abend <strong>bereitete</strong> ich mich auf die neue Woche{" "}
        <strong>vor</strong> und <strong>entspannte</strong> mich mit Musik. Es{" "}
        <strong>war</strong> ein gelungenes Wochenende.
      </GlossaryParagraph>
      <p>3.</p>
      <GlossaryParagraph>
        Letztes Wochenende <strong>war</strong> erholsam und schön. Am Samstag{" "}
        <strong>wachte</strong> ich früh <strong>auf</strong>, weil ich am Abend
        zuvor früh schlafen <strong>gegangen war</strong>. Nach dem Frühstück{" "}
        <strong>ging</strong> ich einkaufen, denn ich <strong>hatte</strong> am
        Freitag <strong>vergessen</strong>, einige Dinge zu besorgen. Am
        Nachmittag <strong>traf</strong> ich mich mit Freunden im Park. Wir{" "}
        <strong>redeten</strong> über vieles und <strong>lachten</strong> viel.
      </GlossaryParagraph>
      <GlossaryParagraph>
        Am Sonntag <strong>schlief</strong> ich lange, weil ich die ganze Woche
        viel <strong>gearbeitet hatte</strong>. Nach dem Mittagessen{" "}
        <strong>machte</strong> ich einen Spaziergang. Die Sonne{" "}
        <strong>schien</strong>, und die Luft <strong>war</strong> frisch. Am
        Abend <strong>las</strong> ich ein Buch, das ich schon lange{" "}
        <strong>angefangen hatte</strong>. Es <strong>war</strong> ein
        wunderbares Wochenende.
      </GlossaryParagraph>
      <Container bg="var(--red)">Übung 1 medium</Container>
      <h3>Was muss ich wissen und können?</h3>
      <p></p>
      <Image
        src="/das_perfekt_2.png"
        alt="Das Perfekt und das Plusquamperfekt"
        width={872}
        height={387}
      />
    </Container>')
      ON CONFLICT (id) DO NOTHING;

INSERT INTO communications_pages_html (id, content)
VALUES (2, '<Column className="chapter-content">
      <ul>
        <li>Passiv</li>
        <li>Infinitivkonstruktionen</li>
        <li>Finalsätze u. a.</li>
      </ul>
    </Column>')
ON CONFLICT (id) DO NOTHING;

INSERT INTO communications_pages_html (id, content)
VALUES (3, '<Column className="chapter-content">
      <ul>
        <li>Konjunktiv I bei indirekten Zitaten</li>
        <li>indirekte Frage- und Aussagesätze</li>
        <li>subjektive Modalität</li>
        <li>Futur II u. a. Vermutungen</li>
      </ul>
    </Column>')
ON CONFLICT (id) DO NOTHING;

INSERT INTO communications_pages_html (id, content)
VALUES (4, '<Column className="chapter-content">
      <ul>
        <li>Konjunktiv II als Höflichkeitsform</li>
        <li>Das Pronomen es (z. B. bei Witterungsverben)</li>
        <li>Dativ-Verben (geben, schenken usw.)</li>
      </ul>
    </Column>')
ON CONFLICT (id) DO NOTHING;

INSERT INTO communications_pages_html (id, content)
VALUES (5, '<Column className="chapter-content">
      <ul>
        <li>Vergleiche (wie und als)</li>
        <li>Adjektivdeklination</li>
      </ul>
    </Column>')
ON CONFLICT (id) DO NOTHING;

INSERT INTO communications_pages_html (id, content)
VALUES (6, '<Column className="chapter-content">
      <ul>
        <li>Adjektivdeklination</li>
        <li>Temporalangaben, -adverbien, -sätze</li>
      </ul>
    </Column>')
ON CONFLICT (id) DO NOTHING;

INSERT INTO communications_pages_html (id, content)
VALUES (7, '<Column className="chapter-content">
      <ul>
        <li>Hilfsverben</li>
        <li>Artikelverwendung</li>
      </ul>
    </Column>')
ON CONFLICT (id) DO NOTHING;

INSERT INTO communications_pages_html (id, content)
VALUES (8, '<Column className="chapter-content">
      <ul>
        <li>Adjektivdeklination</li>
        <li>Lokalangaben, -adverbien, -sätze</li>
        <li>Passiv</li>
        <li>
          Adverbien zur Darstellung von Chronologie in Prozessbeschreibungen
        </li>
      </ul>
    </Column>')
ON CONFLICT (id) DO NOTHING;

INSERT INTO communications_pages_html (id, content)
VALUES (9, '<Column className="chapter-content">
      <ul>
        <li>Adjektivdeklination</li>
        <li>Vergleiche</li>
        <li>Präpositionen bei der Beschreibung von Leistungen und Produkten</li>
      </ul>
    </Column>')
ON CONFLICT (id) DO NOTHING;

INSERT INTO communications_pages_html (id, content)
VALUES (10, '<Column className="chapter-content">
      <ul>
        <li>Genuszuordnung</li>
        <li>Formen der Artikel</li>
        <li>Gebrauch der Artikel</li>
        <li>andere Artikelwörter</li>
        <li>Akkusativ Bildung und Verwendung</li>
      </ul>
    </Column>')
ON CONFLICT (id) DO NOTHING;

INSERT INTO communications_pages_html (id, content)
VALUES (11, '<Column className="chapter-content">
      <ul>
        <li>
          Lokalpräpositionen (Wechsel- und ausgewählte lokale
          Akk/Dat-Präpositionen)
        </li>
        <li>Lokaladverbien (insb. Verwendung im Satz)</li>
      </ul>
    </Column>')
ON CONFLICT (id) DO NOTHING;

INSERT INTO communications_pages_html (id, content)
VALUES (12, '<Column className="chapter-content">
      <ul>
        <li>Vergangenheitstempora, auch (hyster.) Präsens</li>
        <li>Temporaladverbien</li>
      </ul>
    </Column>')
ON CONFLICT (id) DO NOTHING;

INSERT INTO communications_pages_html (id, content)
VALUES (13, '<Column className="chapter-content">
      <ul>
        <li>Präsens + Temporaladverbien</li>
        <li>Temporalangaben und -sätze</li>
        <li>Konditionalsätze (real/irreal mit Konjunktiv II und würde)</li>
        <li>Futur I</li>
      </ul>
    </Column>')
ON CONFLICT (id) DO NOTHING;

INSERT INTO communications_pages_html (id, content)
VALUES (14, '<Column className="chapter-content">
      <ul>
        <li>Temporaladverbien</li>
        <li>Versch. Konjunktionalsätze</li>
        <li>Uneingeleitete Nebensätze</li>
      </ul>
    </Column>')
ON CONFLICT (id) DO NOTHING;

INSERT INTO communications_pages_html (id, content)
VALUES (15, '<Column className="chapter-content">
      <ul>
        <li>Komparation der Adjektive</li>
        <li>Anrede (du/Sie)</li>
        <li>
          <Link href="/grammar/themes/perfekt">Perfekt</Link> / Präteritum
        </li>
      </ul>
    </Column>')
ON CONFLICT (id) DO NOTHING;

INSERT INTO communications_pages_html (id, content)
VALUES (16, '<Column className="chapter-content">
      <ul>
        <li>Konjunktiv</li>
        <li>Imperativ</li>
        <li>Rektion der Verben</li>
      </ul>
    </Column>')
ON CONFLICT (id) DO NOTHING;