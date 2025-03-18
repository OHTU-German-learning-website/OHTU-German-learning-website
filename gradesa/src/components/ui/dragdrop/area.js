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
  const [isExerciseComplete, setIsExerciseComplete] = useState(false);

  function isDropped(boxName) {
    return droppedBoxNames.indexOf(boxName) > -1;
  }

  const checkExerciseComplete = (updatedDustbins) => {
    const totalDroppedItems = updatedDustbins.reduce(
      (sum, dustbin) => sum + dustbin.droppedItems.length,
      0
    );

    const allBoxesPlaced = totalDroppedItems === initialBoxes.length;

    const allItemsCorrect = updatedDustbins.every((dustbin) =>
      dustbin.droppedItems.every((item) => item.type === dustbin.accepts[0])
    );

    console.log("Exercise complete check:", {
      totalDroppedItems,
      totalBoxes: initialBoxes.length,
      allBoxesPlaced,
      allItemsCorrect,
    });

    return allBoxesPlaced && allItemsCorrect;
  };

  const handleDrop = useCallback(
    (index, item) => {
      const { name, type } = item;
      console.log("Handling drop:", { name, type, index });

      if (!isDropped(name)) {
        const updatedDroppedBoxNames = [...droppedBoxNames, name];
        const updatedDustbins = [...dustbins];
        updatedDustbins[index] = {
          ...updatedDustbins[index],
          droppedItems: [
            ...updatedDustbins[index].droppedItems,
            { name, type },
          ],
        };

        console.log("Updated dustbin:", updatedDustbins[index]);

        setDroppedBoxNames(updatedDroppedBoxNames);
        setDustbins(updatedDustbins);

        const isComplete = checkExerciseComplete(updatedDustbins);
        console.log("Setting exercise complete:", isComplete);
        setIsExerciseComplete(isComplete);
      }
    },
    [droppedBoxNames, dustbins]
  );

  const reset = () => {
    setDustbins(initialDustbins);
    setDroppedBoxNames([]);
    setIsExerciseComplete(false);
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
      {isExerciseComplete && (
        <div className="success-message">
          Super! Du hast die Übung abgeschlossen.
        </div>
      )}
    </div>
  );
});
