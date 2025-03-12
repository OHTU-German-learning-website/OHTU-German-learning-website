import update from "immutability-helper";
import { memo, useCallback, useState } from "react";
import { ItemTypes } from "./itemtypes.js";
import { WordBox } from "./wordbox.js";
import { Dustbin } from "./dustbin.js";

export const Area = memo(function Area() {
  const [dustbins, setDustbins] = useState([
    { accepts: [ItemTypes.DER], droppedItems: [] },
    { accepts: [ItemTypes.DIE], droppedItems: [] },
    { accepts: [ItemTypes.DAS], droppedItems: [] },
  ]);
  const [boxes] = useState([
    { name: "Kurs", type: ItemTypes.DER },
    { name: "Elefant", type: ItemTypes.DER },
    { name: "Schule", type: ItemTypes.DIE },
    { name: "Auto", type: ItemTypes.DAS },
  ]);
  const [droppedBoxNames, setDroppedBoxNames] = useState([]);
  function isDropped(boxName) {
    return droppedBoxNames.indexOf(boxName) > -1;
  }
  const handleDrop = useCallback(
    (index, item) => {
      const { name } = item;
      setDroppedBoxNames(
        update(droppedBoxNames, name ? { $push: [name] } : { $push: [] })
      );
      setDustbins(
        update(dustbins, {
          [index]: {
            droppedItems: {
              $push: item ? [{ name, type: item.type }] : [],
            },
          },
        })
      );
    },
    [droppedBoxNames, dustbins]
  );

  return (
    <div>
      <div style={{ overflow: "hidden", clear: "both" }}>
        {boxes.map(({ name, type }, index) => (
          <WordBox
            name={name}
            type={type}
            isDropped={isDropped(name)}
            key={index}
          />
        ))}
      </div>
      <div style={{ overflow: "hidden", clear: "both" }}>
        {dustbins.map(({ accepts, droppedItems }, index) => (
          <Dustbin
            accept={accepts}
            droppedItems={droppedItems}
            onDrop={(item) => handleDrop(index, item)}
            key={index}
          />
        ))}
      </div>
    </div>
  );
});
