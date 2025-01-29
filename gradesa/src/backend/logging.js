
// Printing these strings will change the color of the text in the console
const colors = {
  blue: '\x1b[34m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  reset: '\x1b[0m',
};

export const logger = {
  info: (...args) => console.log(colors.blue, ...args, colors.reset),
  error: (...args) => console.error(colors.red, ...args, colors.reset),
  warn: (...args) => console.warn(colors.yellow, ...args, colors.reset),
  debug: (...args) => console.debug(colors.green, ...args, colors.reset),
};
