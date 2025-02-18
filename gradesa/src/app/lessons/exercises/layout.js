import "../lessons.css";

export default function LessonsLayout({ children }) {
  return (
    <div className="lessons-container">
      <section className="lessons-content">{children}</section>
    </div>
  );
}3