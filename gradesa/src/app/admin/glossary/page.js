"use client";
import { Button } from "@/components/ui/button";
import { Container, Column, Row } from "@/components/ui/layout/container";
import { useRouter } from "next/navigation";
import useQuery from "@/shared/hooks/useQuery";
import "./glossary.css";
import { LinkButton } from "@/components/ui/linkbutton";

export default function GlossaryList() {
  const router = useRouter();
  const { data: entries, error, isLoading } = useQuery("/admin/glossary");

  if (isLoading) {
    return <p>Wird geladen...</p>;
  }

  if (error) {
    return <p className="error">Fehler beim Laden der Glossareinträge</p>;
  }

  return (
    <Column gap="md" width="100%">
      <Row justify="space-between" gap="xl" width="100%" align="center">
        <h2>Glossareinträge</h2>
      </Row>
      <LinkButton href="/admin/glossary/create">
        Neuen Eintrag erstellen
      </LinkButton>
      {entries?.length === 0 ? (
        <p>
          Keine Einträge gefunden. Erstellen Sie einen neuen Eintrag, um zu
          beginnen.
        </p>
      ) : (
        <Container
          display="grid"
          templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          gap="md"
        >
          {entries?.map((entry) => (
            <Container key={entry.id} className="glossary-card">
              <Column gap="sm">
                <h4 className="glossary-word">{entry.word}</h4>
                <p className="glossary-definition">{entry.word_definition}</p>
                <Row justify="space-between" className="glossary-meta">
                  <span>
                    Erstellt: {new Date(entry.created_at).toLocaleDateString()}
                  </span>
                </Row>
              </Column>
            </Container>
          ))}
        </Container>
      )}
    </Column>
  );
}
