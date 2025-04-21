import { isTest } from "../config";
import { faker } from "@faker-js/faker";
import { DB } from "../db";
import crypto from "crypto";
import { hashPassword } from "../auth/hash";

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
    const baseValues = typeof base === "function" ? await base() : base;
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

const user = modelFactory("users", async () => {
  const salt = crypto.randomBytes(16).toString("hex");
  const { hashedPassword } = await hashPassword("correct", salt);
  return {
    username: faker.internet.username().trim(),
    email: faker.internet.email().toLowerCase().trim(),
    password_hash: hashedPassword,
    salt: salt,
  };
});

const exercise = modelFactory("exercises", () => ({
  category: "freeform",
}));

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

const anchor = modelFactory("anchors", () => ({
  anchor_id: faker.lorem.word(),
}));

const exerciseAnchor = modelFactory(
  "exercise_anchors",
  () => (
    {
      position: faker.number.int({ min: 0, max: 100 }),
    },
    async (base) => {
      if (!base.exercise_id) {
        const exercise = await exercise();
        base.exercise_id = exercise.id;
      }
      if (!base.anchor_id) {
        const anchor = await anchor();
        base.anchor_id = anchor.id;
      }
    }
  )
);

export const TestFactory = {
  user,
  exercise,
  freeFormExercise,
  freeFormAnswer,
  anchor,
  exerciseAnchor,
};
