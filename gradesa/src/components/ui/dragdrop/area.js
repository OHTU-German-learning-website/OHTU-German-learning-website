import update from "immutability-helper";
import { memo, useCallback, useState } from "react";
import { ItemTypes } from "../../../app/lessons/exercises/dragdrop/itemtypes.js";
import { WordBox } from "./wordbox.js";
import { Dustbin } from "./dustbin.js";
import { Button } from "@/components/ui/button";

export const Area = memo(function Area() {
  const initialDustbins = [
    { accepts: [ItemTypes.DER], droppedItems: [] },
    { accepts: [ItemTypes.DIE], droppedItems: [] },
    { accepts: [ItemTypes.DAS], droppedItems: [] },
  ];
  const initialBoxes = [
    { name: "Kurs", type: ItemTypes.DER },
    { name: "Elefant", type: ItemTypes.DER },
    { name: "Schule", type: ItemTypes.DIE },
    { name: "Eule", type: ItemTypes.DIE },
    { name: "Auto", type: ItemTypes.DAS },
    { name: "Kaninchen", type: ItemTypes.DAS },
  ];

  const [dustbins, setDustbins] = useState(initialDustbins);
  const [boxes] = useState(initialBoxes);
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

  const reset = () => {
    setDustbins(initialDustbins);
    setDroppedBoxNames([]);
  };

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
      <Button onClick={reset}>Erneut versuchen</Button>
    </div>
  );
});
