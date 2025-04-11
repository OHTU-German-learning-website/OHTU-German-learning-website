import { memo, useCallback, useState, useEffect } from "react";
import { WordBox } from "./wordbox.js";
import { Dustbin } from "./dustbin.js";
import { Button } from "@/components/ui/button";

const Area = ({ exerciseID }) => {
  const [dustbins, setDustbins] = useState([]);
  const [droppedBoxNames, setDroppedBoxNames] = useState([]);
  const [isExerciseComplete, setIsExerciseComplete] = useState(false);
  const [availableWords, setAvailableWords] = useState([]);
  const [visibleWords, setVisibleWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allWords, setAllWords] = useState([]);
  const [initialDustbins, setInitialDustbins] = useState([]);

  useEffect(() => {
    const fetchExerciseData = async () => {
      if (!exerciseID) return;

      try {
        const response = await fetch(`/api/exercises/dragdrop/${exerciseID}`);
        if (!response.ok) throw new Error("Fehler beim Laden der Übung.");

        const data = await response.json();

        if (!data.categories || !data.words) {
          throw new Error("Unvollständige Übungsdaten");
        }

        const initialDustbins = data.categories.map((category) => ({
          accepts: [category.category],
          droppedItems: [],
          color: category.color,
        }));

        setInitialDustbins(initialDustbins);
        setDustbins(initialDustbins);
        setAllWords(data.words);
        setAvailableWords(data.words);
        setVisibleWords(getRandomUnusedWords(5, data.words));
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchExerciseData();
  }, [exerciseID]);

  const getRandomUnusedWords = (count, wordList) => {
    if (!wordList || wordList.length === 0) return [];
    const shuffled = [...wordList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  };

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

      if (droppedBoxNames.includes(name)) return;

      const updatedDustbins = dustbins.map((bin, binIndex) => {
        if (binIndex === index) {
          return {
            ...bin,
            droppedItems: [...bin.droppedItems, { name, type }],
          };
        }
        return bin;
      });

      const updatedAvailableWords = availableWords.filter(
        (word) => word.name !== name
      );

      const remainingVisibleWords = visibleWords.filter(
        (word) => word.name !== name
      );

      let newWords = [];
      const wordsNeeded = 5 - remainingVisibleWords.length;

      if (wordsNeeded > 0) {
        const unusedWords = updatedAvailableWords.filter(
          (word) =>
            !remainingVisibleWords.some((visible) => visible.name === word.name)
        );
        newWords = getRandomUnusedWords(wordsNeeded, unusedWords);
      }

      // if (!isDropped(name)) {
      //   const updatedDroppedBoxNames = [...droppedBoxNames, name];
      //   const updatedDustbins = [...dustbins];
      //   updatedDustbins[index] = {
      //     ...updatedDustbins[index],
      //     droppedItems: [
      //       ...updatedDustbins[index].droppedItems,
      //       { name, type },
      //     ],
      //   };

      //   const updatedAvailableWords = availableWords.filter(
      //     (word) => word.name !== name
      //   );

      //   const remainingVisibleWords = visibleWords.filter(
      //     (word) => word.name !== name
      //   );

      //   let updatedVisibleWords = [...remainingVisibleWords];

      //   while (
      //     updatedVisibleWords.length < 5 &&
      //     updatedAvailableWords.length > 0
      //   ) {
      //     const newWordIndex = Math.floor(
      //       Math.random() * updatedAvailableWords.length
      //     );
      //     const newWord = updatedAvailableWords[newWordIndex]; // Remove from available and get the word
      //     if (
      //       !remainingVisibleWords.find((word) => word.name === newWord.name)
      //     ) {
      //       updatedVisibleWords.push(newWord);
      //     }
      //   }

      setDroppedBoxNames([...droppedBoxNames, name]);
      setDustbins(updatedDustbins);
      setAvailableWords(updatedAvailableWords);
      setVisibleWords([...remainingVisibleWords, ...newWords]);

      const isComplete = checkExerciseComplete(updatedDustbins);
      setIsExerciseComplete(isComplete);
    },
    [droppedBoxNames, dustbins, availableWords, visibleWords]
  );

  const reset = () => {
    setDustbins(initialDustbins);
    setDroppedBoxNames([]);
    setIsExerciseComplete(false);
    setAvailableWords([...allWords]);
    setVisibleWords(getRandomUnusedWords(5, allWords));
  };

  if (isLoading) return <div>Loading exercise...</div>;
  if (error) return <div>Error: {error}</div>;

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
        {dustbins.map(({ accepts, droppedItems, color }, index) => (
          <Dustbin
            accept={accepts}
            droppedItems={droppedItems}
            color={color}
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
};

export const MemoizedArea = memo(Area);
export default MemoizedArea;
