import { Pool } from 'pg';
import { getConfig } from './config';

class DB {
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
    try {
      if (!pool) {
        throw new Error('Pool not initialized');
      }
      await pool.connect();
      const row = await pool.query('SELECT current_database() as database_name, now()');
      console.log('\x1b[34m%s\x1b[0m', `Connected to database ${row.rows[0].database_name} at ${row.rows[0].now.toISOString()}`);
    } catch (err) {
      console.error('Failed to connect to database', err);
    }
  }

  async #set(config) {
    const newPool = new Pool(config);
    await this.#connect(newPool);
    this.#pool = newPool;
  }
}

export const db = new DB();

/**
 * Executes a database query using the connection pool.
 * 
 * @param {string} text - The SQL query text to be executed.
 * @param {Array} [params] - An optional array of parameters to be used in the query.
 * @returns {Promise<Object>} - A promise that resolves to the result of the query.
 */
export const query = async (text, params) => (await db.get()).query(text, params);


/**
 * Executes a database transaction using the connection pool.
 * 
 * @param {Function} fn - A function that takes a client as an argument and returns a promise.
 * @returns {Promise<Object>} - A promise that resolves to the result of the transaction.
 */
export const transaction = async (fn) => {
  const client = await (await db.get()).connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }
};

