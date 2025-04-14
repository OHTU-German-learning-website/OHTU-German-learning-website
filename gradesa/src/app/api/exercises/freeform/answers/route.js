import { NextResponse } from "next/server";
import { DB } from "@/backend/db";
import { withAuth } from "@/backend/middleware/withAuth";
import { withInputValidation } from "@/backend/middleware/withInputValidation";
import { z } from "zod";

export function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const positionWeight = 0.3;
const sequenceWeight = 0.3;
const jaccardWeight = 0.3;

export function calculateSimilarity(str1, str2) {
  const normalized1 = normalizeText(str1);
  const normalized2 = normalizeText(str2);

  if (normalized1 === normalized2) return 1.0;

  const words1 = normalized1.split(" ");
  const words2 = normalized2.split(" ");

  const uniqueWords = new Set([...words1, ...words2]);
  let matchingWords = 0;
  for (const word of words1) {
    if (words2.includes(word)) matchingWords++;
  }
  const jaccardSimilarity = matchingWords / uniqueWords.size;

  const lcsLength = findLongestCommonSubsequence(words1, words2);
  const maxLength = Math.max(words1.length, words2.length);
  const sequenceSimilarity = maxLength > 0 ? lcsLength / maxLength : 0;

  const positionSimilarity = calculatePositionSimilarity(words1, words2);

  return (
    jaccardWeight * jaccardSimilarity +
    sequenceWeight * sequenceSimilarity +
    positionWeight * positionSimilarity
  );
}

export function findLongestCommonSubsequence(sequence1, sequence2) {
  const m = sequence1.length;
  const n = sequence2.length;

  const dp = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (sequence1[i - 1] === sequence2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}

export function calculatePositionSimilarity(words1, words2) {
  let positionMatchScore = 0;
  const maxLength = Math.max(words1.length, words2.length);

  if (maxLength === 0) return 1.0;

  for (let i = 0; i < words1.length; i++) {
    const word = words1[i];
    const posInSeq2 = words2.indexOf(word);

    if (posInSeq2 !== -1) {
      const posDiff = Math.abs(i - posInSeq2);
      const maxPossibleDiff = maxLength - 1;

      const wordPositionScore =
        maxPossibleDiff > 0 ? 1 - posDiff / maxPossibleDiff : 1;

      positionMatchScore += wordPositionScore;
    }
  }

  return words1.length > 0 ? positionMatchScore / words1.length : 0;
}

export function generateComparisonDetails(studentAnswer, correctAnswer) {
  const studentWords = studentAnswer.trim().split(/\s+/);
  const correctWords = correctAnswer.trim().split(/\s+/);

  const normalizedStudentWords = studentAnswer
    .trim()
    .toLowerCase()
    .split(/\s+/);
  const normalizedCorrectWords = correctAnswer
    .trim()
    .toLowerCase()
    .split(/\s+/);

  const studentWordStatus = studentWords.map((word, index) => {
    const normalizedWord = normalizedStudentWords[index];

    const matchIndex = normalizedCorrectWords.indexOf(normalizedWord);

    if (matchIndex !== -1) {
      if (matchIndex === index) {
        return {
          word,
          status: "match",
          correctWord: correctWords[matchIndex],
          position: "correct",
        };
      } else {
        return {
          word,
          status: "match",
          correctWord: correctWords[matchIndex],
          position: "wrong",
          correctPosition: matchIndex,
        };
      }
    } else {
      let bestMatch = null;
      let highestSimilarity = 0;

      for (let i = 0; i < normalizedCorrectWords.length; i++) {
        const correctWord = normalizedCorrectWords[i];
        const similarity = calculateWordSimilarity(normalizedWord, correctWord);

        if (similarity > 0.7 && similarity > highestSimilarity) {
          highestSimilarity = similarity;
          bestMatch = correctWords[i];
        }
      }

      return {
        word,
        status: bestMatch ? "similar" : "error",
        suggestion: bestMatch || null,
      };
    }
  });

  // Find words in correct answer that are missing from student answer
  const missingWords = [];
  correctWords.forEach((word, index) => {
    const normalizedWord = normalizedCorrectWords[index];
    if (!normalizedStudentWords.includes(normalizedWord)) {
      missingWords.push({
        word,
        status: "missing",
        position: index,
      });
    }
  });

  // Calculate word order errors
  const wordOrderErrors = studentWordStatus.filter(
    (word) => word.status === "match" && word.position === "wrong"
  ).length;

  return {
    studentWords: studentWordStatus,
    missingWords: missingWords,
    wordOrderErrors,
    hasErrors:
      studentWordStatus.some(
        (w) =>
          w.status === "error" ||
          w.status === "similar" ||
          w.position === "wrong"
      ) || missingWords.length > 0,
  };
}

// Calculate character-level similarity between words
function calculateWordSimilarity(word1, word2) {
  // For very short words, be more strict
  if (word1.length <= 2 || word2.length <= 2) {
    return word1 === word2 ? 1 : 0;
  }

  // Simple character overlap
  const chars1 = word1.split("");
  const chars2 = word2.split("");

  const uniqueChars = new Set([...chars1, ...chars2]);

  let matches = 0;
  for (const char of chars1) {
    if (chars2.includes(char)) matches++;
  }

  return matches / uniqueChars.size;
}

export const POST = withAuth(
  withInputValidation(
    z.object({
      freeFormExerciseId: z.string(),
      answer: z.string(),
    }),
    async (request) => {
      try {
        const userId = request.user.id;

        const body = await request.json();
        const { freeFormExerciseId, answer } = body;

        if (!freeFormExerciseId || !answer) {
          return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
          );
        }

        const { rows: possibleAnswers } = await DB.pool(
          `SELECT id, answer, is_correct, feedback 
           FROM free_form_answers 
           WHERE free_form_exercise_id = $1`,
          [freeFormExerciseId]
        );

        if (possibleAnswers.length === 0) {
          return NextResponse.json(
            { error: "No answers found for this exercise" },
            { status: 404 }
          );
        }

        const SIMILARITY_THRESHOLD = 0.7; // Minimum similarity to consider a match

        const similarities = possibleAnswers.map((possibleAnswer) => ({
          ...possibleAnswer,
          similarity: calculateSimilarity(answer, possibleAnswer.answer),
        }));

        // Sort by similarity (highest first)
        similarities.sort((a, b) => b.similarity - a.similarity);

        // Get the most similar answer
        const bestMatch = similarities[0];

        // If similarity is below threshold, consider it not matched
        if (bestMatch.similarity < SIMILARITY_THRESHOLD) {
          await recordUserAnswer(userId, freeFormExerciseId, answer, false);

          return NextResponse.json({
            is_correct: false,
            answer: "",
            feedback:
              "Your answer doesn't match any of the expected answers. Please try again.",
            similarity: bestMatch.similarity,
          });
        }

        // Generate comparison details if the match is not perfect
        const comparisonDetails =
          bestMatch.similarity < 1
            ? generateComparisonDetails(answer, bestMatch.answer)
            : null;

        // Answer is correct enough, but may have minor errors
        const perfectAnswer = bestMatch.similarity === 1;

        // Allow partially correct answers to be considered correct but with feedback
        const isAnswerCorrect = bestMatch.is_correct;

        // Record user's answer with the matched answer's correctness
        await recordUserAnswer(
          userId,
          freeFormExerciseId,
          answer,
          isAnswerCorrect
        );

        // Generate feedback based on comparison
        let feedbackMessage =
          bestMatch.feedback ||
          (isAnswerCorrect
            ? "Correct answer!"
            : "Incorrect answer. Please try again.");

        if (comparisonDetails) {
          if (comparisonDetails.wordOrderErrors > 0 && isAnswerCorrect) {
            feedbackMessage =
              "Your answer has the right words, but some are in the wrong order.";
          } else if (comparisonDetails.hasErrors && isAnswerCorrect) {
            feedbackMessage =
              "Your answer is correct, but there are some minor errors.";
          }
        }

        return NextResponse.json({
          is_correct: isAnswerCorrect,
          answer: bestMatch.answer,
          similarity: bestMatch.similarity,
          perfectAnswer,
          comparisonDetails,
          feedback: feedbackMessage,
        });
      } catch (error) {
        console.error("Error processing free form answer:", error);
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      }
    }
  )
);

async function recordUserAnswer(userId, freeFormExerciseId, answer, isCorrect) {
  try {
    await DB.pool(
      `INSERT INTO free_form_user_answers 
       (answer, free_form_exercise_id, is_correct, user_id) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, free_form_exercise_id) 
       DO UPDATE SET 
         answer = $1, 
         is_correct = $3, 
         updated_at = NOW()`,
      [answer, freeFormExerciseId, isCorrect, userId]
    );
  } catch (error) {
    console.error("Error recording user answer:", error);
    throw error;
  }
}
