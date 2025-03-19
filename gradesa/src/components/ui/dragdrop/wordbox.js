import { memo } from "react";
import { useDrag } from "react-dnd";
import { wordbox } from "./dragdrop.css";

export const WordBox = memo(function WordBox({ name, type, isDropped }) {
  const [{ opacity }, drag] = useDrag(
    () => ({
      type,
      item: { name, type },
      canDrag: !isDropped,
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [name, type, isDropped]
  );
  return (
    <div
      ref={drag}
      style={{ opacity }}
      className="wordbox"
      data-testid="wordbox"
    >
      {isDropped ? <s>{name}</s> : name}
    </div>
  );
});
