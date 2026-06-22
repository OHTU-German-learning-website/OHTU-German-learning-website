"use client";
import { Container, Column, Row } from "@/components/ui/layout/container";
import useQuery from "@/shared/hooks/useQuery";
import { useRequest } from "@/shared/hooks/useRequest";
import { useState } from "react";
import "./news.css";
import { LinkButton } from "@/components/ui/linkbutton";
import { Button } from "@/components/ui/button";
import RenderHTML from "@/components/ui/render-html/render-html";

export default function NewsList() {
  const { data: articles, error, isLoading, refetch } = useQuery("/admin/news");
  const makeRequest = useRequest();
  const [deleting, setDeleting] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  if (isLoading) {
    return <p>Wird geladen...</p>;
  }

  if (error) {
    return <p className="error">Fehler beim Laden der Neuigkeiten</p>;
  }

  const handleDelete = async (id) => {
    if (confirmDelete === id) {
      try {
        setDeleting(id);
        await makeRequest(`/admin/news?id=${id}`, null, {
          method: "DELETE",
        });
        await refetch();
        setConfirmDelete(null);
      } catch (error) {
        console.error("Error deleting news article:", error);
        alert("Fehler beim Löschen des Artikels");
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

  const sortedArticles = [...(articles || [])].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <Column gap="md" width="100%">
      <Row justify="space-between" gap="xl" width="100%" align="center">
        <h2 id="news-top">Neuigkeiten</h2>
      </Row>
      <LinkButton href="/admin/news/create">
        Neue Nachricht erstellen
      </LinkButton>

      {sortedArticles.length === 0 ? (
        <p>
          Keine Neuigkeiten vorhanden. Erstellen Sie eine neue Nachricht, um zu
          beginnen.
        </p>
      ) : (
        <Container display="grid" gap="md">
          {sortedArticles.map((article) => (
            <Container key={article.id} className="news-card">
              <Column gap="sm">
                <h3 className="news-title">{article.title}</h3>
                <RenderHTML data={article.content} disableGlossary />
                <Row justify="flex-end" gap="sm" className="news-meta">
                  <LinkButton
                    href={`/admin/news/create?id=${article.id}`}
                    variant="outline"
                    size="sm"
                  >
                    Bearbeiten
                  </LinkButton>
                  <Button
                    variant={
                      confirmDelete === article.id ? "danger" : "outline"
                    }
                    size="sm"
                    width="fit"
                    onClick={() => handleDelete(article.id)}
                    disabled={deleting === article.id}
                  >
                    {deleting === article.id
                      ? "Löschen..."
                      : confirmDelete === article.id
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
