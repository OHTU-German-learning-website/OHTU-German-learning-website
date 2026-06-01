"use client";
import { Container, Column, Row } from "@/components/ui/layout/container";
import useQuery from "@/shared/hooks/useQuery";
import { useRequest } from "@/shared/hooks/useRequest";
import { useState } from "react";
import "./glossary.css";
import { LinkButton } from "@/components/ui/linkbutton";
import { Button } from "@/components/ui/button";
import RenderHTML from "@/components/ui/render-html/render-html";

export default function GlossaryList() {
  const {
    data: entries,
    error,
    isLoading,
    refetch,
  } = useQuery("/admin/glossary");
  const makeRequest = useRequest();
  const [deleting, setDeleting] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  if (isLoading) {
    return <p>Wird geladen...</p>;
  }

  if (error) {
    return <p className="error">Fehler beim Laden der Glossareinträge</p>;
  }

  const handleDelete = async (id) => {
    if (confirmDelete === id) {
      try {
        setDeleting(id);
        await makeRequest(`/admin/glossary?id=${id}`, null, {
          method: "DELETE",
        });
        await refetch();
        setConfirmDelete(null);
      } catch (error) {
        console.error("Error deleting glossary entry:", error);
        alert("Fehler beim Löschen des Eintrags");
      } finally {
        setDeleting(null);
      }
    } else {
      setConfirmDelete(id);
      // Auto-reset confirmation state after 3 seconds
      setTimeout(() => {
        if (setConfirmDelete) {
          setConfirmDelete((current) => (current === id ? null : current));
        }
      }, 3000);
    }
  };

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
        <h2 id="glossary-top">Glossareinträge</h2>
      </Row>
      <LinkButton href="/admin/glossary/create">
        Neuen Eintrag erstellen
      </LinkButton>

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
        <p>
          Keine Einträge gefunden. Erstellen Sie einen neuen Eintrag, um zu
          beginnen.
        </p>
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
                      <Row justify="space-between" className="glossary-meta">
                        <span>
                          Erstellt:{" "}
                          {new Date(entry.created_at).toLocaleDateString()}
                        </span>
                        <Row gap="sm">
                          <LinkButton
                            href={`/admin/glossary/create?id=${entry.id}`}
                            variant="outline"
                            size="sm"
                          >
                            Bearbeiten
                          </LinkButton>
                          <Button
                            variant={
                              confirmDelete === entry.id ? "danger" : "outline"
                            }
                            size="sm"
                            width="fit"
                            onClick={() => handleDelete(entry.id)}
                            disabled={deleting === entry.id}
                          >
                            {deleting === entry.id
                              ? "Löschen..."
                              : confirmDelete === entry.id
                                ? "Bestätigen"
                                : "Löschen"}
                          </Button>
                        </Row>
                      </Row>
                    </Column>
                  </Container>
                ))}
              </Container>
              <a href="#glossary-top" className="glossary-back-to-top">
                Zurück nach oben
              </a>
            </Container>
          ))}
        </Container>
      )}
    </Column>
  );
}
