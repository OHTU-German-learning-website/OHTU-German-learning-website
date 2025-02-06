module.exports = {
  root: true,
  extends: ["next", "prettier"],
  plugins: ["eslint-plugin-react", "react-refresh", "unused-imports"],
  rules: {
    "turbo/no-undeclared-env-vars": 0,
    "react-hooks/exhaustive-deps": 0,
    "react/no-unescaped-entities": 0,
    "unused-imports/no-unused-vars": [
      "error",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
  },
  ignorePatterns: ["next.config.js"],
};
