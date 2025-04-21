export default function RenderText({
  exerciseData,
  userAnswers,
  isSubmitted,
  dropdownSubmittedStates,
  checkedAnswers,
  handleChange: onAnswerChange,
}) {
  const renderItem = (item, index) => {
    if (item.content_type === "text") {
      return <span key={index}>{item.content_value} </span>;
    }

    if (item.content_type === "multichoice") {
      const userAnswer = userAnswers[index] || "";
      const isCorrect = checkedAnswers[index];
      const selectClassName =
        dropdownSubmittedStates[index] && userAnswer !== "" // Use dropdown-specific state
          ? isCorrect
            ? "correct"
            : "incorrect"
          : ""; // No class during user selection

      return (
        <select
          key={index}
          value={userAnswer}
          onChange={(e) => {
            onAnswerChange(index, e.target.value);
          }}
          disabled={isSubmitted && isCorrect} // Lock only correct dropdowns
          className={selectClassName}
        >
          <option value="">Wähle...</option>
          {item.options.map((option, i) => (
            <option key={i} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return null; // Fallback for unsupported types
  };
  return <p className="task-sentence">{exerciseData.map(renderItem)}</p>;
}
