import { memo } from "react";
import { useDrag } from "react-dnd";
import { wordbox } from "./dragdrop.css";

export const WordBox = memo(function WordBox({ name, types, isDropped }) {
  const [{ opacity }, drag] = useDrag(
    () => ({
      // drag type only needs to match a dustbin's accept list; grading uses `types` instead
      type: types[0],
      item: { name, types },
      canDrag: !isDropped,
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [name, types, isDropped]
  );
  return (
    <div
      ref={drag}
      style={{ opacity }}
      className="wordbox"
      data-testid="wordbox"
    >
      {isDropped ? name : name}
    </div>
  );
});
