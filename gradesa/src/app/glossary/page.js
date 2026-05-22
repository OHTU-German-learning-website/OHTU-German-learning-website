"use client";
import { Container, Column, Row } from "@/components/ui/layout/container";
import useQuery from "@/shared/hooks/useQuery";
import RenderHTML from "@/components/ui/render-html/render-html";
import "./glossary.css";

export default function GlossaryPage() {
  const { data: entries, error, isLoading } = useQuery("/glossary");

  if (isLoading) {
    return <p>Wird geladen...</p>;
  }

  if (error) {
    return <p className="error">Fehler beim Laden der Glossareinträge</p>;
  }

  const sortedEntries = [...(entries || [])].sort((a, b) =>
    a.word.localeCompare(b.word)
  );

  const entriesByLetter = sortedEntries.reduce((map, entry) => {
    const letter = (entry.word?.[0] || "").toUpperCase();
    if (!map[letter]) {
      map[letter] = [];
    }
    map[letter].push(entry);
    return map;
  }, {});

  const letters = Object.keys(entriesByLetter).sort();

  return (
    <Column gap="md" width="100%">
      <Row justify="space-between" gap="xl" width="100%" align="center">
        <h2>Glossar</h2>
      </Row>

      {letters.length > 0 && (
        <Container className="glossary-index" mb="md">
          <h3>Register</h3>
          <Container display="flex" flexWrap="wrap" gap="xs" mb="sm">
            {letters.map((letter) => (
              <a
                key={letter}
                className="glossary-index-letter"
                href={`#letter-${letter}-section`}
              >
                {letter}
              </a>
            ))}
          </Container>

          <Container
            display="grid"
            templateColumns="repeat(auto-fit, minmax(160px, 1fr))"
            gap="sm"
          >
            {letters.map((letter) => (
              <Container key={letter} className="glossary-index-group">
                <h4
                  id={`letter-${letter}`}
                  className="glossary-index-group-title"
                >
                  {letter}
                </h4>
                <Column gap="xs">
                  {entriesByLetter[letter].map((entry) => (
                    <a
                      key={entry.id}
                      href={`#entry-${entry.id}`}
                      className="glossary-index-entry"
                    >
                      {entry.word}
                    </a>
                  ))}
                </Column>
              </Container>
            ))}
          </Container>
        </Container>
      )}

      {sortedEntries.length === 0 ? (
        <p>Keine Einträge gefunden.</p>
      ) : (
        <Container display="grid" gap="md">
          {letters.map((letter) => (
            <Container key={letter} className="glossary-letter-group">
              <h3
                id={`letter-${letter}-section`}
                className="glossary-letter-title"
              >
                {letter}
              </h3>
              <Container
                display="grid"
                templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                gap="md"
              >
                {entriesByLetter[letter].map((entry) => (
                  <Container
                    key={entry.id}
                    id={`entry-${entry.id}`}
                    className="glossary-card"
                  >
                    <Column gap="sm">
                      <h4 className="glossary-word">{entry.word}</h4>
                      <RenderHTML
                        data={entry.word_definition}
                        disableGlossary
                      />
                    </Column>
                  </Container>
                ))}
              </Container>
            </Container>
          ))}
        </Container>
      )}
    </Column>
  );
}
