import { memo } from "react";
import { useDrop } from "react-dnd";

const style = {
  height: "12rem",
  width: "12rem",
  marginRight: "1.5rem",
  marginBottom: "1.5rem",
  color: "white",
  padding: "1rem",
  textAlign: "center",
  fontSize: "1rem",
  lineHeight: "normal",
  float: "left",
};

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
    <div ref={drop} style={{ ...style, backgroundColor }} data-testid="dustbin">
      {isActive ? `${accept.join(", ")}` : `${accept.join(", ")}`}

      {droppedItems && (
        <div>
          {droppedItems.map((item) => (
            <span key={item.name}>{item.name}</span>
          ))}
        </div>
      )}
    </div>
  );
});
