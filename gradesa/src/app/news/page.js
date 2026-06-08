"use client";
import { Container, Column, Row } from "@/components/ui/layout/container";
import useQuery from "@/shared/hooks/useQuery";
import RenderHTML from "@/components/ui/render-html/render-html";
import "./news.css";

export default function NewsPage() {
  const { data: articles, error, isLoading } = useQuery("/news");

  if (isLoading) {
    return <p>Wird geladen...</p>;
  }

  if (error) {
    return <p className="error">Fehler beim Laden der Neuigkeiten</p>;
  }

  const sortedArticles = [...(articles || [])].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <Column gap="md" width="100%">
      <Row justify="space-between" gap="xl" width="100%" align="center">
        <h2>Neuigkeiten</h2>
      </Row>

      {sortedArticles.length === 0 ? (
        <p>Keine Neuigkeiten vorhanden.</p>
      ) : (
        <Container display="grid" gap="md">
          {sortedArticles.map((article) => (
            <Container key={article.id} className="news-card">
              <Column gap="sm">
                <h3 className="news-title">{article.title}</h3>
                <p className="news-date">
                  {new Date(article.created_at).toLocaleDateString("de-DE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <RenderHTML data={article.content} disableGlossary />
              </Column>
            </Container>
          ))}
        </Container>
      )}
    </Column>
  );
}
