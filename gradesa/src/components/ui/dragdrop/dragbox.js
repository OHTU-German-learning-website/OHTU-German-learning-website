"use client";
import { useDrag } from "react-dnd";

export function DragBox() {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: "BOX",
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
}
