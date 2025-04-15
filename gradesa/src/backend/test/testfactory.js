import { isTest } from "../config";
import { faker } from "@faker-js/faker";
import { createHash } from "node:crypto";
import { DB } from "../db";

/**
 * @description Factory function to create a model for a given table.
 * @param {string} tableName - The name of the table for which the model is being created.
 * @param {Object|Function} base - The base values or a function returning base values for the model.
 * @returns {function} - A function that creates a model for the given table.
 */
function modelFactory(tableName, base, insertLinked) {
  return async function (mod) {
    if (!isTest) {
      throw new Error("This function is only available in test mode");
    }
    const baseValues = typeof base === "function" ? base() : base;
    const model = { ...baseValues, ...mod };

    if (insertLinked !== undefined) {
      await insertLinked(model);
    }

    if (Object.keys(model).length === 0) {
      const insertedRow = await DB.pool(
        `INSERT INTO ${tableName} DEFAULT VALUES RETURNING *`
      );
      if (insertedRow.rows.length === 0) {
        throw new Error("No row was inserted");
      }
      return insertedRow.rows[0];
    }

    const insertedRow = await DB.pool(
      `INSERT INTO ${tableName} (${Object.keys(model).join(", ")}) VALUES (${Object.values(
        model
      )
        .map((_, i) => `$${i + 1}`)
        .join(", ")}) RETURNING *`,
      Object.values(model)
    );
    if (insertedRow.rows.length === 0) {
      throw new Error("No row was inserted");
    }
    return insertedRow.rows[0];
  };
}

faker.seed(123);

const user = modelFactory("users", () => ({
  username: faker.internet.username().trim(),
  email: faker.internet.email().toLowerCase().trim(),
  password_hash: createHash("sha256")
    .update(faker.internet.password())
    .digest("hex"),
  salt: faker.string.alphanumeric(16),
}));

const exercise = modelFactory("exercises", () => ({}));

const freeFormExercise = modelFactory(
  "free_form_exercises",
  {
    question: faker.lorem.sentence(),
  },
  async (base) => {
    if (!base.exercise_id) {
      const exercise = await exercise();
      base.exercise_id = exercise.id;
    }
  }
);

const freeFormAnswer = modelFactory(
  "free_form_answers",
  {
    free_form_exercise_id: freeFormExercise.id,
    answer: faker.lorem.sentence(),
    is_correct: faker.datatype.boolean(),
    feedback: faker.lorem.sentence(),
  },
  async (base) => {
    if (!base.free_form_exercise_id) {
      const freeFormExercise = await freeFormExercise();
      base.free_form_exercise_id = freeFormExercise.id;
    }
  }
);

export const TestFactory = {
  user,
  exercise,
  freeFormExercise,
  freeFormAnswer,
};
