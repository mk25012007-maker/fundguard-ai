import baseConfig from "@repo/eslint-config/base.js";

export default [
  ...baseConfig,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
];