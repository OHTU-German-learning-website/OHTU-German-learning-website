export default function SentenceWithGaps({
  sentenceTemplate,
  userAnswers,
  correctAnswers,
  isSubmitted,
  checkedAnswers,
  handleChange,
}) {
  return (
    <p className="task-sentence">
      {sentenceTemplate.map((word, index) => {
        if (word === "___") {
          const answerIndex = sentenceTemplate
            .slice(0, index)
            .filter((w) => w === "___").length;

          const userAnswer = userAnswers[answerIndex];
          const correctAnswer = correctAnswers[answerIndex];
          const isCorrect = checkedAnswers[answerIndex];

          if (isSubmitted && isCorrect) {
            return (
              <span key={index} className="correct">
                {correctAnswer}{" "}
              </span>
            );
          }

          return (
            <input
              key={index}
              type="text"
              value={userAnswer || ""}
              onChange={(e) => handleChange(answerIndex, e.target.value)}
              className={
                isSubmitted && !isCorrect && userAnswer ? "incorrect" : ""
              }
            />
          );
        } else {
          return <span key={index}>{word} </span>;
        }
      })}
    </p>
  );
}
