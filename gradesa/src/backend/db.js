import { Pool } from "pg";
import { getConfig } from "./config";
import { isTest } from "./config";
import { logger } from "./logging";

/**
 * Database utilities for managing a shared PostgreSQL connection pool.
 *
 * This module centralizes pool creation, simple queries, and transactional
 * execution. In test environments (`isTest`), helpers like `set` and `reset`
 * allow substituting and tearing down the pool safely.
 */

/**
 * Builds a PostgreSQL connection URL from a configuration object.
 *
 * @param {{ user: string, password: string, host: string, port: number|string, database: string }} config -
 *   Basic connection fields used to construct the URL.
 * @returns {string} The postgres connection URL (e.g., `postgres://user:pass@host:port/db`).
 */
export function dbURL(config) {
  return `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;
}

/** @type {import('pg').Pool | undefined} */
let _pool;

/**
 * Verifies a connection can be obtained from the given pool.
 * Logs a successful connection (non-test only) and always releases the client.
 *
 * @param {import('pg').Pool} pool - A previously constructed Pool instance.
 * @returns {Promise<import('pg').Pool>} Resolves to the provided pool.
 */
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

/**
 * Lazily creates and returns the shared connection pool.
 *
 * Configuration is loaded via `getConfig().db` on first access.
 * @returns {Promise<import('pg').Pool>} Resolves to the shared Pool.
 */
async function get() {
  if (!_pool) {
    const config = getConfig();
    _pool = new Pool(config.db);
  }
  return _pool;
}

/**
 * Executes a database query using the shared pool.
 *
 * @param {string} text - SQL query text to be executed.
 * @param {Array<any>} [params] - Optional positional parameters for the query.
 * @returns {Promise<import('pg').QueryResult>} Resolves to the query result.
 */
async function pool(text, params) {
  return (await get()).query(text, params);
}

/**
 * Executes a database transaction using the shared pool.
 *
 * The provided function receives a `PoolClient` which must be used
 * for all queries in the transaction scope.
 *
 * @template T
 * @param {(client: import('pg').PoolClient) => Promise<T>} fn -
 *   Function performing transactional work with the provided client.
 * @returns {Promise<T>} Resolves to the function's result after COMMIT.
 * @throws Will rethrow the original error after ROLLBACK on failure.
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

/**
 * Test-only: Replace the shared pool with a new one created from `config`.
 * Ensures a connection can be obtained before swapping the pool.
 *
 * @param {import('pg').PoolConfig} config - Configuration for the new pool.
 * @returns {Promise<void>} Resolves when the pool has been replaced.
 * @throws If called outside test environment.
 */
async function set(config) {
  if (!isTest) {
    throw new Error("Cannot set database in non-test environment");
  }
  const newPool = new Pool(config);
  await connect(newPool);
  _pool = newPool;
}

/**
 * Gracefully ends the current shared pool, if present.
 * Safe to call multiple times.
 * @returns {Promise<void>} Resolves when the pool is shut down.
 */
async function destroy() {
  if (_pool !== undefined) {
    if (!_pool.ended && !_pool.ending) {
      await _pool.end();
      logger.info("Pool destroyed");
    }
  }
  _pool = undefined;
}

/**
 * Ensures the shared pool can provide a client.
 * Useful as a readiness check; returns the pool itself.
 *
 * @returns {Promise<import('pg').Pool>} Resolves to the shared pool.
 */
async function getClient() {
  return connect(await get());
}

/**
 * Test-only: Tear down the shared pool and clear internal state.
 *
 * @returns {Promise<void>} Resolves when the pool has been reset.
 * @throws If called outside test environment.
 */
async function reset() {
  if (!isTest) throw new Error("Cannot reset database in non-test environment");
  if (_pool !== undefined) {
    await destroy();
  }
  _pool = undefined;
}

/**
 * Facade for database interactions.
 *
 * - `get`: Lazily get the shared pool
 * - `pool`: Run a single query via the shared pool
 * - `transaction`: Run a function within a transaction
 * - `set` (test): Replace the pool
 * - `destroy`: End the pool
 * - `getClient`: Ensure pool connectivity (returns the pool)
 * - `reset` (test): Destroy and clear the pool
 */
export const DB = {
  get,
  pool,
  transaction,
  set,
  destroy,
  getClient,
  reset,
};
