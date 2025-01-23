export const initConfig = async () => {
  const env = process.env.NODE_ENV;
  switch (env) {
    case 'test':
    case 'local':
    case 'production':
      config({ path: `${__dirname}/dotenv/.env`, override: true });
      config({ path: `${__dirname}/dotenv/.env.${env}`, override: true });
      break;
    default:
      throw new Error('Unsupported environment');
  }
};
initConfig();

let cachedConfig;

export const getConfig = () => {
  if (cachedConfig) {
    return cachedConfig;
  }
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
    if (val === undefined || val.trim() === '') {
      errors.push(key);
    }
    return val ?? '';
  }

  function readStringOptional(key, defaultValue) {
    return (getFromEnv(key)) ?? defaultValue;
  }

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
    db: {
      host: readString('DB_HOST'),
      port: readInt('DB_PORT'),
      user: readString('DB_USER'),
      password: readString('DB_PASSWORD'),
      database: readString('DB_NAME'),
    },
  };

  if (errors.length > 0) {
    throw new Error(`Missing or invalid environment variables: ${errors.join(', ')}`);
  }

  return config;
}
