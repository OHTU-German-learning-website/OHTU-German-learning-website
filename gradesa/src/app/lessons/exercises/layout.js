import "../lessons.css";
import Sidebar from "@/components/ui/sidenavigation";

export default function LessonsLayout({ children }) {
  return (
    <div className="lessons-container">
      <Sidebar />
      <section className="lessons-content">{children}</section>
    </div>
  );
}