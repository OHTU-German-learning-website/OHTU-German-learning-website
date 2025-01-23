import { Pool } from 'pg';
import { getConfig } from './config';

const config = getConfig();

const pool = new Pool(config.db);

pool.connect().then((client) => {
  client.query('SELECT now(), database_name FROM pg_database').then((res) => {
    console.log(`Connected to database ${res.rows[0].database_name} at ${res.rows[0].now}`);
  });
}).catch((err) => {
  console.error('Failed to connect to database', err);
});

/**
 * Executes a database query using the connection pool.
 * 
 * @param {string} text - The SQL query text to be executed.
 * @param {Array} [params] - An optional array of parameters to be used in the query.
 * @returns {Promise<Object>} - A promise that resolves to the result of the query.
 */
export const query = (text, params) => pool.query(text, params);


/**
 * Executes a database transaction using the connection pool.
 * 
 * @param {Function} fn - A function that takes a client as an argument and returns a promise.
 * @returns {Promise<Object>} - A promise that resolves to the result of the transaction.
 */
export const transaction = async (fn) => {
  const client = await pool.connect();
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

