"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Row } from "@/components/ui/layout/container";
import useQuery from "@/shared/hooks/useQuery";
import "./admin.css";

const EMPTY_PAIR = () => ({ leftItem: "", rightItem: "" });

export default function DndMatchAdminPage() {
  const { match_id } = useParams();
  const isEditMode = Boolean(match_id);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pairs, setPairs] = useState([EMPTY_PAIR(), EMPTY_PAIR()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    data: exerciseData,
    isLoading: isExerciseLoading,
    error: exerciseError,
  } = useQuery(`/admin/exercises/dnd-match/${match_id || ""}`, null, {
    enabled: isEditMode,
  });

  useEffect(() => {
    if (!isEditMode || !exerciseData) return;
    setTitle(exerciseData.title || "");
    setDescription(exerciseData.description || "");
    setPairs(
      Array.isArray(exerciseData.pairs) && exerciseData.pairs.length >= 2
        ? exerciseData.pairs.map((p) => ({
            leftItem: p.left_item,
            rightItem: p.right_item,
          }))
        : [EMPTY_PAIR(), EMPTY_PAIR()]
    );
  }, [exerciseData, isEditMode]);

  const updatePair = (index, field, value) => {
    setPairs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addPair = () => setPairs((prev) => [...prev, EMPTY_PAIR()]);

  const removePair = (index) => {
    if (pairs.length <= 2) return;
    setPairs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setError("Titel ist erforderlich.");
      return;
    }
    if (!trimmedDescription) {
      setError("Beschreibung ist erforderlich.");
      return;
    }
    if (pairs.some((p) => !p.leftItem.trim() || !p.rightItem.trim())) {
      setError("Alle Paare müssen ausgefüllt sein.");
      return;
    }

    const payload = {
      title: trimmedTitle,
      description: trimmedDescription,
      pairs: pairs.map((p) => ({
        leftItem: p.leftItem.trim(),
        rightItem: p.rightItem.trim(),
      })),
    };

    try {
      setIsSubmitting(true);

      if (isEditMode) {
        const res = await fetch(`/api/admin/exercises/dnd-match/${match_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Fehler beim Speichern.");
        router.push("/grammar/exercises/dnd-match");
      } else {
        const res = await fetch("/api/admin/exercises/dnd-match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Fehler beim Erstellen.");
        router.push(`/grammar/exercises/dnd-match/${data.id}`);
      }
    } catch (err) {
      setError(err.message || "Ein Fehler ist aufgetreten.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditMode && isExerciseLoading) return <div>Übung wird geladen…</div>;
  if (isEditMode && exerciseError)
    return <div>{exerciseError.message || "Fehler beim Laden der Übung."}</div>;

  return (
    <div className="dnd-match-admin-container">
      <h1>
        {isEditMode
          ? "Zuordnungs-Übung bearbeiten"
          : "Neue Zuordnungs-Übung erstellen"}
      </h1>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Titel *</label>
          <input
            id="title"
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel der Übung"
            required
          />
        </div>

        {/* Descriptionnn */}
        <div className="form-group">
          <label htmlFor="description">Beschreibung *</label>
          <textarea
            id="description"
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Aufgabenstellung für die Studierenden"
            required
          />
        </div>

        {/* Pair rows */}
        <div className="form-group">
          <label>
            Paare (linke Seite = geordnet, rechte Seite = durchgemischt)
          </label>

          {pairs.map((pair, index) => (
            <div key={index} className="pair-row">
              <span style={{ color: "var(--fg3)", minWidth: "1.5rem" }}>
                {index + 1}.
              </span>
              <input
                type="text"
                className="pair-row__input"
                value={pair.leftItem}
                onChange={(e) => updatePair(index, "leftItem", e.target.value)}
                placeholder="Linkes Element"
                aria-label={`Paar ${index + 1} – linkes Element`}
              />
              <span className="pair-row__arrow">→</span>
              <input
                type="text"
                className="pair-row__input"
                value={pair.rightItem}
                onChange={(e) => updatePair(index, "rightItem", e.target.value)}
                placeholder="Rechtes Element"
                aria-label={`Paar ${index + 1} – rechtes Element`}
              />
              <button
                type="button"
                className="pair-row__remove"
                onClick={() => removePair(index)}
                disabled={pairs.length <= 2}
                aria-label={`Paar ${index + 1} entfernen`}
                title={
                  pairs.length <= 2
                    ? "Mindestens 2 Paare erforderlich"
                    : "Paar entfernen"
                }
              >
                ✕
              </button>
            </div>
          ))}

          <div style={{ marginTop: "0.5rem" }}>
            <Button type="button" variant="outline" size="sm" onClick={addPair}>
              + Paar hinzufügen
            </Button>
          </div>
        </div>

        {/* Submit / Cancel */}
        <Row gap="md" mt="lg">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting
              ? "Wird gespeichert…"
              : isEditMode
                ? "Änderungen speichern"
                : "Übung erstellen"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/admin/create-exercise")}
          >
            Abbrechen
          </Button>
        </Row>
      </form>
    </div>
  );
}
