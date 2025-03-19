"use client";
import styles from "../../../page.module.css";
import DragdropLayout from "./layout";
import { Area } from "@/components/ui/dragdrop/area";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function Dragdrop({}) {
  return (
    <DragdropLayout>
      <div className={styles.page}>
        <div className="exercise-container">
          <h1>Übung 1 Substantiv</h1>
          <DndProvider backend={HTML5Backend}>
            <Area />
          </DndProvider>
        </div>
      </div>
    </DragdropLayout>
  );
}
