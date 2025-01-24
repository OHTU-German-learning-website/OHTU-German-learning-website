import { Pool } from 'pg';
import { getConfig } from './config';
import { isTest } from './config';
export function dbURL(config) {
  return `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;
}
export class DB {
  #pool;
  constructor() { }

  async get() {
    if (!this.#pool) {
      const config = getConfig();
      this.#createPool(config.db);
      await this.#connect(this.#pool);
    }
    return this.#pool;
  }

  #createPool(config) {
    this.#pool = new Pool(config);
  }

  async #connect(pool) {
    let client
    try {
      if (!pool) {
        throw new Error('Pool not initialized');
      }
      client = await pool.connect()
      if (!isTest) {
        const row = await client.query('SELECT current_database() as database_name, now()');
        console.log('\x1b[34m%s\x1b[0m', `Connected to database ${row.rows[0].database_name} at ${row.rows[0].now.toISOString()}`);
      }
    } catch (err) {
      console.error('Failed to connect to database', err);
    } finally {
      if (client) {
        await client.release();
      }
    }
  }

  /**
 * Executes a database query using the connection pool.
 * 
 * @param {string} text - The SQL query text to be executed.
 * @param {Array} [params] - An optional array of parameters to be used in the query.
 * @returns {Promise<Object>} - A promise that resolves to the result of the query.
 */
  async pool(text, params) {
    return (await this.get()).query(text, params);
  }

  /**
   * Executes a database transaction using the connection pool.
   * 
   * @param {Function} fn - A function that takes a client as an argument and returns a promise.
   * @returns {Promise<Object>} - A promise that resolves to the result of the transaction.
   */
  async transaction(fn) {
    const client = await (await this.get()).connect();
    try {
      await client.query('BEGIN');
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      await client.release();
    }
  }

  // Set the database to use a new config
  async set(config) {
    if (!isTest) {
      throw new Error('Cannot set database in non-test environment, was ' + environment);
    }
    const newPool = new Pool(config);
    await this.#connect(newPool);
    this.#pool = newPool;
  }

  // Destroy all connections and release the pool
  async destroy() {
    if (this.#pool !== undefined) {
      // Terminate the pool and close all connections
      await this.#pool.end();
    }
    this.#pool = undefined;
  }

  // Get a client connection from the database pool
  // It's important to run some queries on the same client
  // Ex. locks and transactions
  async getClient() {
    return (await this.get()).connect();
  }

  // Reset the database
  // This is only used in the test environment
  async reset() {
    if (!isTest) throw new Error('Cannot reset database in non-test environment, was ' + environment);
    await this.destroy();
    this.#pool = undefined;
  }
}

export const db = new DB();

