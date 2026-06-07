"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Column, Row } from "@/components/ui/layout/container";
import { useRequest } from "@/shared/hooks/useRequest";
import { withBasePath } from "@/shared/utils/basePath";
import AdminLastModified from "@/components/ui/admin-last-modified";

const emptyPair = { left_item: "", right_item: "" };

export default function CreateMemoryGame() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pairs, setPairs] = useState([emptyPair]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [lastModifiedAt, setLastModifiedAt] = useState(null);
  const [lastModifiedBy, setLastModifiedBy] = useState(null);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const routeGameId = params?.memory_game_id;
  const queryGameId = searchParams.get("id");
  const gameId = routeGameId || queryGameId;
  const isEditing = Boolean(gameId);
  const makeRequest = useRequest();

  useEffect(() => {
    if (!isEditing) return;

    const loadGame = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          withBasePath(`/api/admin/exercises/memory-game/${gameId}`)
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Fehler beim Laden des Spiels");
        }
        setTitle(data.title || "");
        setDescription(data.description || "");
        setPairs(
          data.pairs?.map((pair) => ({
            left_item: pair.left_item,
            right_item: pair.right_item,
          })) || [emptyPair]
        );
        setLastModifiedAt(data.last_modified_at || null);
        setLastModifiedBy(data.last_modified_by || null);
      } catch (error) {
        console.error(error);
        setGeneralError("Fehler beim Laden des Spiels");
      } finally {
        setIsLoading(false);
      }
    };

    loadGame();
  }, [gameId, isEditing]);

  const handlePairChange = (index, field, value) => {
    setPairs((current) => {
      const next = [...current];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addPair = () => setPairs((current) => [...current, emptyPair]);
  const removePair = (index) =>
    setPairs((current) => current.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setGeneralError("");
    try {
      const method = isEditing ? "PUT" : "POST";
      const response = await makeRequest(
        isEditing
          ? `/admin/exercises/memory-game/${gameId}`
          : "/admin/exercises/memory-game",
        { title, description, pairs },
        { method }
      );
      const responseData = response?.data;
      if (!responseData || responseData.error) {
        throw new Error(
          responseData?.error || "Fehler beim Speichern des Spiels"
        );
      }
      const nextPath = isEditing
        ? "/grammar/exercises/memory-game"
        : `/grammar/exercises/memory-game/${responseData.id}`;
      router.push(nextPath);
    } catch (error) {
      console.error(error);
      setGeneralError(error.message || "Fehler beim Speichern des Spiels");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Column gap="md" width="100%">
      <h2>{isEditing ? "Memory Game bearbeiten" : "Memory Game erstellen"}</h2>
      {isEditing && (
        <AdminLastModified
          updatedAt={lastModifiedAt}
          updatedBy={lastModifiedBy}
        />
      )}
      {generalError && <p className="error">{generalError}</p>}
      <label>
        Titel
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label>
        Beschreibung
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <Column gap="sm">
        <h3>Paarweise Elemente</h3>
        {pairs.map((pair, index) => (
          <Row key={index} gap="sm" align="center">
            <input
              type="text"
              placeholder="Linkes Element"
              value={pair.left_item}
              onChange={(e) =>
                handlePairChange(index, "left_item", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Rechtes Element"
              value={pair.right_item}
              onChange={(e) =>
                handlePairChange(index, "right_item", e.target.value)
              }
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => removePair(index)}
            >
              Entfernen
            </Button>
          </Row>
        ))}
        <Button variant="outline" size="sm" onClick={addPair}>
          Paar hinzufügen
        </Button>
      </Column>
      <Row gap="md">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/create-exercise/memory-game")}
        >
          Abbrechen
        </Button>
        <Button
          variant="secondary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Speichern..." : "Speichern"}
        </Button>
      </Row>
    </Column>
  );
}
