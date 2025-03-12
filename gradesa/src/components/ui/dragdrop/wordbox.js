import { memo } from "react";
import { useDrag } from "react-dnd";

const style = {
  border: "var(--radius-xxs) dashed",
  backgroundColor: "var(--fg8)",
  padding: "var(--u-md)",
  marginRight: "var(--u-md)",
  marginBottom: "var(--u-xl)",
  cursor: "move",
  float: "left",
};
export const WordBox = memo(function WordBox({ name, type, isDropped }) {
  const [{ opacity }, drag] = useDrag(
    () => ({
      type,
      item: { name },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [name, type]
  );
  return (
    <div ref={drag} style={{ ...style, opacity }} data-testid="wordbox">
      {isDropped ? <s>{name}</s> : name}
    </div>
  );
});
