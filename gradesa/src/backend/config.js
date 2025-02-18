import { config } from "dotenv";

export const environment = process.env.NODE_ENV;

export const isTest = environment === "test";
export const isDevelopment = environment === "development";
export const isProduction = environment === "production";

// Loads .env and .env.NODE_ENV (e.g. .env.development)
// Shared environment variables are in .env
// Environment specific variables are in .env.NODE_ENV
// NextJS defaults to 'development' when running npm run dev
export const initConfig = async () => {
  switch (environment) {
    case "test":
    case "development":
    case "production":
      config({ path: `${process.cwd()}/.env`, override: true });
      config({ path: `${process.cwd()}/.env.${environment}`, override: true });
      break;
    default:
      throw new Error("Unsupported environment: " + env);
  }
};

// The following is an environment variable helper.
// It's used to read environment variables from .env and .env.NODE_ENV
// So instead of using process.env.DB_HOST, you can use getConfig().db.host
// This is useful for keeping the code clean and gives you clear errors if you miss a variable.
let cachedConfig;

export const getConfig = () => {
  if (cachedConfig) {
    return cachedConfig;
  }
  initConfig();
  cachedConfig = create();
  return cachedConfig;
};

function getFromEnv(key) {
  const val = process.env[key];
  if (val === undefined) {
    return undefined;
  }
  return val;
}

function create() {
  let errors = [];

  function readString(key) {
    const val = getFromEnv(key);
    if (val === undefined || val.trim() === "") {
      errors.push(key);
    }
    return val ?? "";
  }
  // Unused-vars
  // function readStringOptional(key, defaultValue) {
  //   return getFromEnv(key) ?? defaultValue;
  // }

  function readInt(key) {
    const val = getFromEnv(key);
    if (val === undefined) {
      errors.push(key);
      return -1;
    }
    return parseInt(val);
  }

  function readIntOptional(key, defaultValue) {
    const value = getFromEnv(key);
    return value === undefined ? defaultValue : parseInt(value);
  }

  const config = {
    url: "http://localhost:3000",
    apiUrl: "http://localhost:3000/api",
    db: {
      host: readString("DB_HOST"),
      port: readInt("DB_PORT"),
      user: readString("DB_USER"),
      password: readString("DB_PASSWORD"),
      database: readString("DB_NAME"),
    },
  };

  if (errors.length > 0) {
    throw new Error(
      `Missing or invalid environment variables: ${errors.join(", ")}`
    );
  }

  return config;
}
