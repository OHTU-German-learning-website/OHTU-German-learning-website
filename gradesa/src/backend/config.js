import { config } from "dotenv";

/**
 * Environment and configuration helpers.
 *
 * This module centralizes reading environment variables from `.env` and
 * `.env.<NODE_ENV>`, and exposes a structured `getConfig()` object for
 * application settings, including PostgreSQL connection parameters.
 */

/**
 * Current runtime environment (e.g., `development`, `test`, `production`).
 * @type {string | undefined}
 */
export const environment = process.env.NODE_ENV;

/** Whether running in test environment. */
export const isTest = environment === "test";
/** Whether running in development environment. */
export const isDevelopment = environment === "development";
/** Whether running in production environment. */
export const isProduction = environment === "production";

// Loads .env and .env.NODE_ENV (e.g. .env.development)
// Shared environment variables are in .env
// Environment specific variables are in .env.NODE_ENV
// NextJS defaults to 'development' when running npm run dev
/**
 * Loads environment variable files.
 *
 * - Always loads `.env`
 * - Then loads `.env.<environment>` if `environment` is one of
 *   `test`, `development`, or `production`.
 *
 * Note: This function is synchronous despite being declared `async` in
 * some usages; dotenv's `config` is synchronous.
 */
export const initConfig = async () => {
  switch (environment) {
    case "test":
    case "development":
    case "production":
      config({ path: `${process.cwd()}/.env`, override: true });
      config({ path: `${process.cwd()}/.env.${environment}`, override: true });
      break;
    default:
      // Provide a clearer error without referencing undefined variables.
      throw new Error("Unsupported environment: " + String(environment));
  }
};

// The following is an environment variable helper.
// It's used to read environment variables from .env and .env.NODE_ENV
// So instead of using process.env.DB_HOST, you can use getConfig().db.host
// This is useful for keeping the code clean and gives you clear errors if you miss a variable.
/** @type {ReturnType<typeof create> | undefined} */
let cachedConfig;

/**
 * Returns the cached application configuration, creating it on first access.
 * Ensures environment files are loaded before reading variables.
 *
 * @returns {{
 *   url: string,
 *   apiUrl: string,
 *   sessionSecret: string,
 *   sessionTTL: number,
 *   db: {
 *     host: string,
 *     port: number,
 *     user: string,
 *     password: string,
 *     database: string,
 *     ssl: boolean,
 *   }
 * }}
 */
export const getConfig = () => {
  if (cachedConfig) {
    return cachedConfig;
  }
  initConfig();
  cachedConfig = create();
  return cachedConfig;
};

/**
 * Reads a raw value from `process.env`.
 * @param {string} key - Environment variable name.
 * @returns {string | undefined} The value or `undefined` if not set.
 */
function getFromEnv(key) {
  const val = process.env[key];
  if (val === undefined) {
    return undefined;
  }
  return val;
}

/**
 * Builds the structured configuration object from environment variables.
 * Validates presence and basic type parsing, accumulating missing keys
 * and throwing an error if any are invalid.
 *
 * @returns {ReturnType<typeof getConfig>}
 * @throws {Error} If required environment variables are missing or invalid.
 */
function create() {
  let errors = [];

  /**
   * Reads a non-empty string env var; records missing/empty keys.
   * @param {string} key
   * @returns {string}
   */
  function readString(key) {
    const val = getFromEnv(key);
    if (val === undefined || val.trim() === "") {
      errors.push(key);
    }
    return val ?? "";
  }

  /**
   * Reads a required integer env var; records missing keys.
   * @param {string} key
   * @returns {number}
   */
  function readInt(key) {
    const val = getFromEnv(key);
    if (val === undefined) {
      errors.push(key);
      return -1;
    }
    return parseInt(val);
  }

  /**
   * Reads an optional integer env var with a default fallback.
   * @param {string} key
   * @param {number} defaultValue
   * @returns {number}
   */
  function readIntOptional(key, defaultValue) {
    const value = getFromEnv(key);
    return value === undefined ? defaultValue : parseInt(value);
  }

  /** @type {ReturnType<typeof getConfig>} */
  const config = {
    url: "http://localhost:3000",
    apiUrl: "http://localhost:3000/api",
    sessionSecret: readString("SESSION_SECRET"),
    sessionTTL: readIntOptional("SESSION_TTL", 7 * 24 * 60 * 60 * 1000),
    db: {
      host: readString("DB_HOST"),
      port: readInt("DB_PORT"),
      user: readString("DB_USER"),
      password: readString("DB_PASSWORD"),
      database: readString("DB_NAME"),
      ssl: isProduction,
    },
  };

  if (errors.length > 0) {
    throw new Error(
      `Missing or invalid environment variables: ${errors.join(", ")}`
    );
  }

  return config;
}
