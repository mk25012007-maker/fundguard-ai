import baseConfig from "@repo/eslint-config/base.js";
import nextConfig from "@next/eslint-plugin-next";

export default [
  {
    ignores: [".next/**", "node_modules/**", "out/**"],
  },
  ...baseConfig,
  {
    plugins: {
      "@next/next": nextConfig,
    },
    rules: {
      ...nextConfig.configs.recommended.rules,
      ...nextConfig.configs["core-web-vitals"].rules,
    },
  },
];
