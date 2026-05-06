import "../../themes/lessons.css";

export default function DndMatchLayout({ children }) {
  return (
    <div className="exercise-container">
      <section className="exercise-content">{children}</section>
    </div>
  );
}
