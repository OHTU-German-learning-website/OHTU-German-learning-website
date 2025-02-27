import { Pool } from "pg";
import { getConfig } from "./config";
import { isTest } from "./config";
export function dbURL(config) {
  return `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;
}
import { logger } from "./logging";

let _pool;

async function connect(pool) {
  let client;
  try {
    if (!pool) {
      throw new Error("Pool not initialized");
    }
    client = await pool.connect();
    if (!isTest) {
      const row = await client.query(
        "SELECT current_database() as database_name, now()"
      );
      logger.info(
        `Connected to database ${row.rows[0].database_name} at ${row.rows[0].now.toISOString()}`
      );
    }
  } catch (err) {
    logger.error("Failed to connect to database", err);
  } finally {
    if (client) {
      await client.release();
    }
  }
  return pool;
}

async function get() {
  if (!_pool) {
    const config = getConfig();
    _pool = new Pool(config.db);
  }
  return _pool;
}

/**
 * Executes a database query using the connection pool.
 *
 * @param {string} text - The SQL query text to be executed.
 * @param {Array} [params] - An optional array of parameters to be used in the query.
 * @returns {Promise<Object>} - A promise that resolves to the result of the query.
 */
async function pool(text, params) {
  return (await get()).query(text, params);
}

/**
 * Executes a database transaction using the connection pool.
 *
 * @param {Function} fn - A function that takes a client as an argument and returns a promise.
 * @returns {Promise<Object>} - A promise that resolves to the result of the transaction.
 */
async function transaction(fn) {
  const db = await get();
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    await client.release();
  }
}

async function set(config) {
  if (!isTest) {
    throw new Error(
      "Cannot set database in non-test environment, was " + environment
    );
  }
  const newPool = new Pool(config);
  await connect(newPool);
  _pool = newPool;
}

async function destroy() {
  if (_pool !== undefined) {
    if (!_pool.ended && !_pool.ending) {
      await _pool.end();
      logger.info("Pool destroyed");
    }
  }
  _pool = undefined;
}

async function getClient() {
  return connect(await get());
}

async function reset() {
  if (!isTest)
    throw new Error(
      "Cannot reset database in non-test environment, was " + environment
    );
  if (_pool !== undefined) {
    await destroy();
  }
  _pool = undefined;
}

export const DB = {
  get,
  pool,
  transaction,
  set,
  destroy,
  getClient,
  reset,
};
