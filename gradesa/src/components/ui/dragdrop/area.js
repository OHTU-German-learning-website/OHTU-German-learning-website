import { memo, useCallback, useState, useEffect } from "react";
import { ItemTypes } from "../../../app/grammar/exercises/dragdrop/itemtypes.js";
import { WordBox } from "./wordbox.js";
import { Dustbin } from "./dustbin.js";
import { Button } from "@/components/ui/button";

export const Area = memo(function Area() {
  const initialDustbins = [
    { accepts: [ItemTypes.DER], droppedItems: [] },
    { accepts: [ItemTypes.DIE], droppedItems: [] },
    { accepts: [ItemTypes.DAS], droppedItems: [] },
  ];
  const allWords = [
    { name: "Kurs", type: ItemTypes.DER },
    { name: "Elefant", type: ItemTypes.DER },
    { name: "Hund", type: ItemTypes.DER },
    { name: "Schule", type: ItemTypes.DIE },
    { name: "Eule", type: ItemTypes.DIE },
    { name: "Zeit", type: ItemTypes.DIE },
    { name: "Schmetterling", type: ItemTypes.DIE },
    { name: "Auto", type: ItemTypes.DAS },
    { name: "Kaninchen", type: ItemTypes.DAS },
    { name: "Geld", type: ItemTypes.DAS },
    { name: "Wort", type: ItemTypes.DAS },
    { name: "Haus", type: ItemTypes.DAS },
    { name: "Bild", type: ItemTypes.DAS },
  ];

  const [dustbins, setDustbins] = useState(initialDustbins);
  const [droppedBoxNames, setDroppedBoxNames] = useState([]);
  const [isExerciseComplete, setIsExerciseComplete] = useState(false);
  const [availableWords, setAvailableWords] = useState([...allWords]);
  const [visibleWords, setVisibleWords] = useState([]);

  const getRandomUnusedWords = (count) => {
    if (availableWords.length === 0) return [];
    const shuffled = [...availableWords].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  };

  useEffect(() => {
    setVisibleWords(getRandomUnusedWords(5));
  }, []);

  function isDropped(boxName) {
    return droppedBoxNames.indexOf(boxName) > -1;
  }

  const checkExerciseComplete = (updatedDustbins) => {
    const totalDroppedItems = updatedDustbins.reduce(
      (sum, dustbin) => sum + dustbin.droppedItems.length,
      0
    );

    const allBoxesPlaced = totalDroppedItems === allWords.length;

    const allItemsCorrect = updatedDustbins.every((dustbin) =>
      dustbin.droppedItems.every((item) => item.type === dustbin.accepts[0])
    );

    return allBoxesPlaced && allItemsCorrect;
  };

  const handleDrop = useCallback(
    (index, item) => {
      const { name, type } = item;

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

        const updatedAvailableWords = availableWords.filter(
          (word) => word.name !== name
        );

        const remainingVisibleWords = visibleWords.filter(
          (word) => word.name !== name
        );

        let updatedVisibleWords = [...remainingVisibleWords];

        while (
          updatedVisibleWords.length < 5 &&
          updatedAvailableWords.length > 0
        ) {
          const newWordIndex = Math.floor(
            Math.random() * updatedAvailableWords.length
          );
          const newWord = updatedAvailableWords.splice(newWordIndex, 1)[0]; // Remove from available and get the word
          if (
            !remainingVisibleWords.find((word) => word.name === newWord.name)
          ) {
            updatedVisibleWords.push(newWord);
          }
        }

        setDroppedBoxNames(updatedDroppedBoxNames);
        setDustbins(updatedDustbins);
        setAvailableWords(updatedAvailableWords);
        setVisibleWords(updatedVisibleWords);

        const isComplete = checkExerciseComplete(updatedDustbins);
        setIsExerciseComplete(isComplete);
      }
    },
    [droppedBoxNames, dustbins, availableWords, visibleWords]
  );

  const reset = () => {
    setDustbins(initialDustbins);
    setDroppedBoxNames([]);
    setIsExerciseComplete(false);
    setAvailableWords([...allWords]);
  };

  useEffect(() => {
    if (availableWords.length === allWords.length) {
      setVisibleWords(getRandomUnusedWords(5));
    }
  }, [availableWords]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: "calc(36rem + 2 * var(--u-xl))",
          gap: "var(--u-md)",
        }}
      >
        {visibleWords.map(({ name, type }, index) => (
          <WordBox
            name={name}
            type={type}
            isDropped={isDropped(name)}
            key={`${name}-${index}`}
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
      {isExerciseComplete && (
        <div className="success-message">
          Super! Du hast die Übung abgeschlossen.
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          width: "100%",
          marginTop: "var(--u-xl)",
        }}
      >
        <Button variant="primary" onClick={reset}>
          Erneut versuchen
        </Button>
      </div>
    </div>
  );
});
