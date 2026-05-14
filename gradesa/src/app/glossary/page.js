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

  return (
    <Column gap="md" width="100%">
      <Row justify="space-between" gap="xl" width="100%" align="center">
        <h2>Glossar</h2>
      </Row>

      {sortedEntries.length > 0 && (
        <Container className="glossary-index" mb="md">
          <h3>Register</h3>
          <Container
            display="grid"
            templateColumns="repeat(auto-fit, minmax(160px, 1fr))"
            gap="sm"
          >
            {sortedEntries.map((entry) => (
              <span key={entry.id} className="glossary-index-item">
                {entry.word}
              </span>
            ))}
          </Container>
        </Container>
      )}

      {sortedEntries.length === 0 ? (
        <p>Keine Einträge gefunden.</p>
      ) : (
        <Container
          display="grid"
          templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          gap="md"
        >
          {sortedEntries.map((entry) => (
            <Container key={entry.id} className="glossary-card">
              <Column gap="sm">
                <h4 className="glossary-word">{entry.word}</h4>
                <RenderHTML data={entry.word_definition} disableGlossary />
              </Column>
            </Container>
          ))}
        </Container>
      )}
    </Column>
  );
}
