import { isTest } from "../config";
import { faker } from "@faker-js/faker";
import { createHash } from "node:crypto";
import { DB } from "../db";
import crypto from "crypto";
import { hashPassword } from "../auth/hash";

/**
 * @description Factory function to create a model for a given table.
 * @param {string} tableName - The name of the table for which the model is being created.
 * @param {Object|Function} base - The base values or a function returning base values for the model.
 * @returns {function} - A function that creates a model for the given table.
 */
function modelFactory(tableName, base) {
  return async function (mod) {
    if (!isTest) {
      throw new Error("This function is only available in test mode");
    }
    const baseValues = typeof base === "function" ? await base() : base;
    const model = { ...baseValues, ...mod };
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

export const TestFactory = {
  user,
};
