import { memo } from "react";
import { useDrop } from "react-dnd";
import { dustbin } from "./dragdrop.css";

export const Dustbin = memo(function Dustbin({ accept, droppedItems, onDrop }) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const isActive = isOver && canDrop;
  let backgroundColor = "var(--bg5)";
  if (isActive) {
    backgroundColor = "var(--bg5)";
  } else if (canDrop) {
    backgroundColor = "var(--bg5";
  }
  return (
    <div
      ref={drop}
      style={{ backgroundColor }}
      className="dustbin"
      data-testid="dustbin"
    >
      {isActive ? `${accept.join(", ")}` : `${accept.join(", ")}`}

      {droppedItems && droppedItems.length > 0 && (
        <div className="dropped-items">
          {droppedItems.map((item, index) => (
            <div key={`${item.name}-${index}`} className="dropped-item">
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
