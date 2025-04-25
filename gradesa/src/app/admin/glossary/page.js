"use client";
import { Container, Column, Row } from "@/components/ui/layout/container";
import useQuery from "@/shared/hooks/useQuery";
import { useRequest } from "@/shared/hooks/useRequest";
import { useState } from "react";
import "./glossary.css";
import { LinkButton } from "@/components/ui/linkbutton";
import { Button } from "@/components/ui/button";

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
                  <Button
                    variant={confirmDelete === entry.id ? "danger" : "outline"}
                    size="sm"
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
              </Column>
            </Container>
          ))}
        </Container>
      )}
    </Column>
  );
}
