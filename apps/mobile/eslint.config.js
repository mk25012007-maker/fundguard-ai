import baseConfig from "@repo/eslint-config/base.js";
import expoConfig from "eslint-config-expo/flat.js";

export default [...expoConfig, ...baseConfig];
