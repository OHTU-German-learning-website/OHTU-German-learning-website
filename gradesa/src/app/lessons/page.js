import LessonsLayout from "./layout";

export default function LessonsPage() {
  return (
    <LessonsLayout>
      <div>
        <h1>Übungen</h1>
        <div className="flex-parent-element">
          <div className="flex-child-element">
            <h2>Grammatik 1</h2>
            <ul>
              <li>Übung 1</li>
              <li>Übung 2</li>
              <li>Übung 3</li>
            </ul>
          </div>
          <div className="flex-child-element">
            <h2>Grammatik 2</h2>
            <ul>
              <li>Übung 1</li>
              <li>Übung 2</li>
              <li>Übung 3</li>
            </ul>
          </div>
        </div>
      </div>
    </LessonsLayout>
  );
}
