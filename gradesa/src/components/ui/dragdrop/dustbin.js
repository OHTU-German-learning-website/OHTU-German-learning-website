import { memo } from "react";
import { useDrop } from "react-dnd";
import { dustbin } from "./dragdrop.css";

export const Dustbin = memo(function Dustbin({
  accept,
  label,
  correctType,
  droppedItems,
  color,
  isSubmitted,
  onDrop,
}) {
  const [{ isOver }, drop] = useDrop({
    accept,
    drop: (item) => {
      if (onDrop) {
        onDrop(item);
        return undefined;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      style={{ backgroundColor: "var(--bg3)", opacity: isOver ? 0.95 : 1 }}
      className="dustbin"
      data-testid="dustbin"
    >
      {label}

      {droppedItems && droppedItems.length > 0 && (
        <div className="dropped-items">
          {droppedItems.map((item, index) => {
            let itemStyle = { color: `var(--${color})` };
            if (isSubmitted) {
              itemStyle = item.type === correctType
                ? { backgroundColor: "#b3f0b3", color: "#1a5c1a", borderRadius: "4px", padding: "2px 6px" }
                : { backgroundColor: "#ffb3b3", color: "#7a0000", borderRadius: "4px", padding: "2px 6px" };
            }
            return (
              <div
                key={`${item.name}-${index}`}
                className="dropped-item"
                style={itemStyle}
              >
                {item.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});
