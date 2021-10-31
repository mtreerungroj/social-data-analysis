module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./firebase/functions/tsconfig.json", "./firebase/functions/tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": "off",
    "indent": "off",
    "object-curly-spacing": "off",
    "max-len": "off",
    "semi": "off",
    "arrow-parens": "off",
    "camelcase": "off",
    "@typescript-eslint/ban-ts-comment": "off",
  },
};
