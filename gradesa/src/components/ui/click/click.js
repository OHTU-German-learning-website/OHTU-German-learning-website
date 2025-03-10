import React, { useState } from "react";

const WordSelectionExercise = ({
  title,
  instructions,
  targetCategory,
  targetWords,
  allWords,
}) => {
  const [selectedWords, setSelectedWords] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleWordClick = (word) => {
    if (isSubmitted) return;

    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const checkAnswers = () => {
    const correctAnswers = targetWords;
    const incorrectSelections = selectedWords.filter(
      (word) => !correctAnswers.includes(word)
    );
    const missedCorrectAnswers = correctAnswers.filter(
      (word) => !selectedWords.includes(word)
    );

    const score = Math.round(
      ((correctAnswers.length -
        missedCorrectAnswers.length -
        incorrectSelections.length) /
        correctAnswers.length) *
        100
    );

    let feedbackMessage = "";
    if (score === 100) {
      feedbackMessage =
        "Perfect! You identified all the " + targetCategory + " correctly!";
    } else if (score >= 70) {
      feedbackMessage = "Good job! Score: " + score + "%";
    } else {
      feedbackMessage = "Keep practicing! Score: " + score + "%";
    }

    setFeedback(feedbackMessage);
    setIsSubmitted(true);
  };

  const resetExercise = () => {
    setSelectedWords([]);
    setIsSubmitted(false);
    setFeedback("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="mb-6">
        {instructions ||
          `Select all the ${targetCategory} from the list below.`}
      </p>

      <div className="mb-8 flex flex-wrap gap-2">
        {allWords.map((word, index) => (
          <button
            key={index}
            onClick={() => handleWordClick(word)}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedWords.includes(word)
                ? isSubmitted
                  ? targetWords.includes(word)
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  : "bg-blue-500 text-white"
                : isSubmitted && targetWords.includes(word)
                  ? "bg-yellow-200 border border-yellow-500"
                  : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {word}
          </button>
        ))}
      </div>

      {feedback && (
        <div className="mb-4 p-3 bg-blue-100 rounded text-blue-800">
          {feedback}
        </div>
      )}

      <div className="flex gap-4">
        {!isSubmitted ? (
          <button
            onClick={checkAnswers}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Check Answers
          </button>
        ) : (
          <button
            onClick={resetExercise}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default WordSelectionExercise;
