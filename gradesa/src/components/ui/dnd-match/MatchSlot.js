import { memo } from "react";
import { useDrop } from "react-dnd";
import { CARD_TYPE } from "./MatchCard";

export const MatchSlot = memo(function MatchSlot({
  slotId,
  label,
  droppedItem,
  isSubmitted,
  isCorrect,
  onDrop,
  onRemove,
}) {
  const [{ isOver }, drop] = useDrop({
    accept: CARD_TYPE,
    drop: (item) => {
      if (onDrop) onDrop(slotId, item);
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  let dropStyle = {
    flex: 1,
    minHeight: "2.6rem",
    borderRadius: "var(--radius-sm)",
    display: "flex",
    alignItems: "center",
    padding: "var(--u-sm) var(--u-md)",
    border: "2px dashed var(--fg4)",
    backgroundColor: isOver ? "var(--bg4, var(--bg3))" : "var(--bg3)",
    transition: "background-color 0.15s",
  };

  if (isSubmitted && droppedItem) {
    dropStyle = {
      ...dropStyle,
      border: "none",
      backgroundColor: isCorrect ? "#b3f0b3" : "#ffb3b3",
    };
  }

  return (
    <div className="match-slot" data-testid="match-slot">
      <div className="match-slot__label">{label}</div>
      <div className="match-slot__arrow">→</div>
      <div ref={drop} style={dropStyle} className="match-slot__drop">
        {droppedItem ? (
          <div className="match-slot__dropped-item">
            <span
              style={
                isSubmitted
                  ? {
                      color: isCorrect ? "#1a5c1a" : "#7a0000",
                      fontWeight: 500,
                    }
                  : {}
              }
            >
              {droppedItem.text}
            </span>
            {!isSubmitted && (
              <button
                className="match-slot__remove-btn"
                onClick={() => onRemove && onRemove(slotId)}
                aria-label={`${droppedItem.text} entfernen`}
                type="button"
              >
                ✕
              </button>
            )}
          </div>
        ) : (
          <span className="match-slot__placeholder">Hier ablegen</span>
        )}
      </div>
    </div>
  );
});
