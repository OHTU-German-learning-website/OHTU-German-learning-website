import "../../lessons.css";

export default function DragdropLayout({ children }) {
  return (
    <div className="exercise-container">
      <section className="exercise-content">{children}</section>
    </div>
  );
}
