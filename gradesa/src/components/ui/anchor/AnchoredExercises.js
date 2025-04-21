"use client";
import useQuery from "@/shared/hooks/useQuery";
import "@/styles/anchoredExercises.css";

export default function AnchoredExercises({ id }) {
  const {
    data: exercises,
    isLoading,
    error,
  } = useQuery(`/admin/anchors/${id}/exercises`);

  if (isLoading)
    return <div className="loading-message">Loading exercises...</div>;

  if (error)
    return <div className="error-message">Failed to load exercises</div>;

  if (!exercises || exercises.length === 0) {
    return (
      <div className="empty-message">No exercises found for this anchor</div>
    );
  }

  return (
    <div className="exercises-container">
      {exercises.map((exercise) => (
        <div key={exercise.id} className="exercise-card">
          <Link href={`/api/redirect/exercises/${exercise.id}`}>Exercise</Link>
        </div>
      ))}
    </div>
  );
}
