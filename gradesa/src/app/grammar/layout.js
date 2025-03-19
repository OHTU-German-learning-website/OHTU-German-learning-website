import "./grammar.css";

export default function GrammarLayout({ children }) {
  return (
    <div className="grammar-container">
      <section className="grammar-content">{children}</section>
    </div>
  );
}
