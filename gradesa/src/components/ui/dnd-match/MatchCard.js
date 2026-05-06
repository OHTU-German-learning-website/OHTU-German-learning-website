import { memo } from "react";
import { useDrag } from "react-dnd";

export const CARD_TYPE = "DND_MATCH_CARD";

export const MatchCard = memo(function MatchCard({ id, text }) {
  const [{ opacity }, drag] = useDrag(
    () => ({
      type: CARD_TYPE,
      item: { id, text },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [id, text]
  );

  return (
    <div
      ref={drag}
      style={{ opacity }}
      className="match-card"
      data-testid="match-card"
    >
      {text}
    </div>
  );
});
