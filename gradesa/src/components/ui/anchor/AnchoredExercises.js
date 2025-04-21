"use client";
import { useState } from "react";
import Link from "next/link";
import useQuery from "@/shared/hooks/useQuery";
import { useRequest } from "@/shared/hooks/useRequest";
import { useUser } from "@/context/user.context";
import "@/styles/anchoredExercises.css";

export default function AnchoredExercises({ id }) {
  const { auth, actAs } = useUser();
  const isAdmin =
    auth.isLoggedIn && auth.user.is_admin && actAs.value === "admin";
  const [linkUrl, setLinkUrl] = useState("");
  const [error, setError] = useState(null);
  const makeRequest = useRequest();

  const {
    data: exercises,
    isLoading,
    error: fetchError,
    mutate,
  } = useQuery(`/anchors/${id}`);

  const handleUnlink = async (exerciseId) => {
    try {
      const response = await makeRequest(
        "/api/admin/anchors/unlink",
        {
          anchor_id: id,
          exercise_id: exerciseId,
        },
        { method: "POST" }
      );

      if (response.status === 200) {
        mutate();
      } else {
        setError("Failed to unlink exercise");
      }
    } catch (err) {
      setError("An error occurred while unlinking");
    }
  };

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
        "/api/admin/anchors/link",
        {
          anchor_id: id,
          exercise_id: exerciseId,
        },
        { method: "POST" }
      );

      if (response.status === 200) {
        setLinkUrl("");
        mutate();
      } else {
        setError(response.data?.error || "Failed to link exercise");
      }
    } catch (err) {
      setError("An error occurred while linking");
    }
  };

  if (isLoading)
    return <div className="loading-message">Loading exercises...</div>;

  if (fetchError)
    return <div className="error-message">Failed to load exercises</div>;

  if (!exercises || exercises.length === 0) {
    return (
      <div className="anchor-container">
        <div className="empty-message">No exercises found for this anchor</div>
        {isAdmin && (
          <div className="admin-controls">
            <form onSubmit={handleLink}>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="/api/redirect/exercises/[id]"
                className="link-input"
              />
              <button type="submit" className="link-button">
                Link Exercise
              </button>
            </form>
            {error && <div className="error-message">{error}</div>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="anchor-container">
      <div className="exercises-container">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="exercise-card">
            <Link href={`/api/redirect/exercises/${exercise.id}`}>
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
        <div className="admin-controls">
          <form onSubmit={handleLink}>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="/api/redirect/exercises/[id]"
              className="link-input"
            />
            <button type="submit" className="link-button">
              Link Exercise
            </button>
          </form>
          {error && <div className="error-message">{error}</div>}
        </div>
      )}
    </div>
  );
}
