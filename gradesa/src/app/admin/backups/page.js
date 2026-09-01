"use client";

import { Column, Row } from "@/components/ui/layout/container";
import useQuery from "@/shared/hooks/useQuery";
import { useRequest } from "@/shared/hooks/useRequest";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useIsSuperAdmin } from "@/context/user.context";
import styles from "./backups.css";

export default function BackupsPage() {
  const isSuperAdmin = useIsSuperAdmin();
  const {
    data: backups,
    error,
    isLoading,
    refetch,
  } = useQuery("/admin/backups", undefined, {
    enabled: isSuperAdmin,
  });
  const makeRequest = useRequest();
  const [restoringId, setRestoringId] = useState(null);
  const [previewId, setPreviewId] = useState(null);
  const [previewPayload, setPreviewPayload] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  if (!isSuperAdmin) {
    return <p>Wird geladen...</p>;
  }

  if (isLoading) {
    return <p>Wird geladen...</p>;
  }

  if (error) {
    return <p className="error">Fehler beim Laden der Backups</p>;
  }

  const backupItems = backups || [];

  const handleRestore = async (id) => {
    if (!confirm("Möchten Sie dieses Backup wirklich wiederherstellen?")) {
      return;
    }

    try {
      setRestoringId(id);
      await makeRequest("/admin/backups", { id }, { method: "POST" });
      await refetch();
      alert("Backup erfolgreich wiederhergestellt.");
    } catch (restoreError) {
      console.error("Restore failed:", restoreError);
      alert(restoreError.message || "Fehler beim Wiederherstellen des Backups");
    } finally {
      setRestoringId(null);
    }
  };

  const openPreview = async (id) => {
    setPreviewId(id);
    setPreviewLoading(true);
    setPreviewPayload(null);
    try {
      const resp = await makeRequest(`/admin/backups?id=${id}`, null, {
        method: "GET",
      });
      const payload = resp?.data ?? resp;
      setPreviewPayload(payload);
    } catch (err) {
      console.error("Failed to load backup payload:", err);
      alert("Fehler beim Laden der Backup-Vorschau");
      setPreviewId(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const closePreview = () => {
    setPreviewId(null);
    setPreviewPayload(null);
  };

  const renderEntityLabel = (entityType) => {
    switch (entityType) {
      case "news_articles":
        return "News-Artikel";
      case "glossary_entries":
        return "Glossareintrag";
      default:
        return entityType;
    }
  };

  return (
    <Column gap="md" width="100%">
      <Row justify="space-between" gap="xl" width="100%" align="center">
        <h2>Backups</h2>
      </Row>

      {backupItems.length === 0 ? (
        <p>Es sind keine Backups vorhanden.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "12px" }}>ID</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Typ</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Titel</th>
                <th style={{ textAlign: "left", padding: "12px" }}>
                  Entity ID
                </th>
                <th style={{ textAlign: "left", padding: "12px" }}>
                  Erstellt von
                </th>
                <th style={{ textAlign: "left", padding: "12px" }}>
                  Erstellungsdatum
                </th>
                <th style={{ textAlign: "left", padding: "12px" }}>Aktion</th>
              </tr>
            </thead>
            <tbody>
              {backupItems.map((backup) => (
                <tr
                  key={backup.id}
                  style={{ borderTop: "1px solid var(--color-border, #ddd)" }}
                >
                  <td style={{ padding: "12px" }}>{backup.id}</td>
                  <td style={{ padding: "12px" }}>
                    {renderEntityLabel(backup.entity_type)}
                  </td>
                  <td style={{ padding: "12px" }}>{backup.preview ?? "-"}</td>
                  <td style={{ padding: "12px" }}>{backup.entity_id ?? "-"}</td>
                  <td style={{ padding: "12px" }}>{backup.actor_id ?? "-"}</td>
                  <td style={{ padding: "12px" }}>
                    {new Date(backup.created_at).toLocaleString("de-DE")}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openPreview(backup.id)}
                      >
                        Vorschau
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestore(backup.id)}
                        disabled={restoringId === backup.id}
                      >
                        {restoringId === backup.id
                          ? "Wiederherstellung..."
                          : "Wiederherstellen"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {previewId && (
        <div className="preview-modal">
          <h3>Backup Vorschau ({previewId})</h3>
          {previewLoading ? (
            <p>Lädt...</p>
          ) : previewPayload ? (
            <div
              style={{
                maxHeight: "60vh",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
              }}
            >
              <pre>{JSON.stringify(previewPayload, null, 2)}</pre>
            </div>
          ) : (
            <p>Keine Vorschau verfügbar.</p>
          )}
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <Button size="sm" variant="secondary" onClick={closePreview}>
              Vorschau schließen
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (confirm("Backup wirklich wiederherstellen?")) {
                  handleRestore(previewId);
                  closePreview();
                }
              }}
              disabled={restoringId === previewId}
            >
              Wiederherstellen
            </Button>
          </div>
        </div>
      )}
    </Column>
  );
}
