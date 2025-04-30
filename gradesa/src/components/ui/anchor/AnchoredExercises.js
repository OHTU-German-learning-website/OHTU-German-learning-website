"use client";
import { useState } from "react";
import Link from "next/link";
import useQuery from "@/shared/hooks/useQuery";
import { useRequest } from "@/shared/hooks/useRequest";
import { useUser } from "@/context/user.context";
import "@/styles/anchoredExercises.css";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { Column, Row } from "../layout/container";

const DIFFICULTY_OPTIONS = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];

function ExerciseLinkForm({ anchorId, onSuccess, initialError = null }) {
  const [linkUrl, setLinkUrl] = useState("");
  const [error, setError] = useState(initialError);
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState(DIFFICULTY_OPTIONS[1]);
  const makeRequest = useRequest();

  const handleLink = async (e) => {
    e.preventDefault();

    try {
      const urlPattern = /\/api\/redirect\/exercises\/(\d+)/;
      const match = linkUrl.match(urlPattern);

      if (!match) {
        setError("Invalid URL format. Please use /api/redirect/exercises/[id]");
        return;
      }

      const exerciseId = parseInt(match[1], 10);

      const response = await makeRequest(
        "/admin/anchors/link",
        {
          anchor_id: anchorId,
          exercise_id: exerciseId,
          difficulty: difficulty.value,
          title,
        },
        { method: "POST" }
      );

      if (response.status === 200) {
        setLinkUrl("");
        setTitle("");
        onSuccess();
      } else {
        setError(response.data?.error || "Failed to link exercise");
      }
    } catch (err) {
      setError("An error occurred while linking");
    }
  };

  return (
    <div className="admin-controls">
      <form onSubmit={handleLink}>
        <Row justify="space-between" align="center" gap="lg" w="100%">
          <Column gap="sm" grow={1}>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="/api/redirect/exercises/[id]"
              className="link-input"
            />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="link-input"
            />
          </Column>
          <Column gap="sm">
            <Dropdown options={DIFFICULTY_OPTIONS} onSelect={setDifficulty}>
              <Button size="sm">{difficulty.label}</Button>
            </Dropdown>
            <Button size="sm" type="submit" className="link-button">
              Link Exercise
            </Button>
          </Column>
        </Row>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default function AnchoredExercises({ id }) {
  const { auth } = useUser();
  const isAdmin = auth.user?.is_admin;
  const [error, setError] = useState(null);
  const makeRequest = useRequest();
  const {
    data: exercises,
    isLoading,
    error: fetchError,
    refetch,
  } = useQuery(`/anchors/${id}`);

  const handleUnlink = async (exerciseId) => {
    try {
      const response = await makeRequest(
        "/admin/anchors/unlink",
        {
          anchor_id: id,
          exercise_id: exerciseId,
        },
        { method: "POST" }
      );

      if (response.status === 200) {
        refetch();
      } else {
        setError("Failed to unlink exercise");
      }
    } catch (err) {
      setError("An error occurred while unlinking");
    }
  };

  if (isLoading) return null;

  if (fetchError)
    return <div className="error-message">Failed to load exercises</div>;

  if (!exercises || exercises.length === 0) {
    return (
      <div className="anchor-container">
        {isAdmin && (
          <ExerciseLinkForm
            anchorId={id}
            onSuccess={refetch}
            initialError={error}
          />
        )}
      </div>
    );
  }

  return (
    <div className="anchor-container">
      <span className="anchor-title">
        {exercises.length} Exercise{exercises.length === 1 ? "" : "s"}
      </span>
      <div className="exercises-container">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className={`exercise-card ${exercise.difficulty}`}
          >
            <Link
              href={`/api/redirect/exercises/${exercise.id}`}
              className="exercise-link"
            >
              {exercise.title || `Exercise ${exercise.id}`}
            </Link>
            {isAdmin && (
              <button
                onClick={() => handleUnlink(exercise.id)}
                className="unlink-button"
              >
                Unlink
              </button>
            )}
          </div>
        ))}
      </div>

      {isAdmin && (
        <ExerciseLinkForm
          anchorId={id}
          onSuccess={refetch}
          initialError={error}
        />
      )}
    </div>
  );
}
