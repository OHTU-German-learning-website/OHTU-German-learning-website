import "./lessons.css";

export default function ThemesLayout({ children }) {
  return (
    <div className="lessons-title">
      <div className="lessons-container">
        <section className="lessons-content">{children}</section>
      </div>
    </div>
  );
}
