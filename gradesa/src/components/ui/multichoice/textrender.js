export default function RenderText({
  exerciseData,
  userAnswers,
  isSubmitted,
  checkedAnswers,
  handleChange: onAnswerChange,
}) {
  const { text, options } = exerciseData;

  // Helper function to count gaps before a specific index
  const countGapsBeforeIndex = (textArray, currentIndex) => {
    return textArray.slice(0, currentIndex).filter((word) => word === "___")
      .length;
  };

  const renderWord = (word, index) => {
    if (word !== "___") {
      return <span key={index}>{word} </span>;
    }

    const gapIndex = countGapsBeforeIndex(text, index);

    // Safety check to prevent out-of-bounds access to the options array
    if (gapIndex < 0 || gapIndex >= options.length) {
      console.error(`Invalid gap index: ${gapIndex}`);
      return <span key={index}> [Error in gap] </span>;
    }

    const userAnswer = userAnswers[gapIndex];
    const isCorrect = checkedAnswers[gapIndex];
    const selectClassName = isSubmitted
      ? isCorrect
        ? "correct"
        : "incorrect"
      : "";

    return (
      <select
        key={index}
        value={userAnswer}
        onChange={(e) => onAnswerChange(gapIndex, e.target.value)}
        disabled={isSubmitted && isCorrect}
        className={selectClassName}
      >
        <option value="">Wähle...</option>
        {options[gapIndex].map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  };

  return <p className="task-sentence">{text.map(renderWord)}</p>;
}
