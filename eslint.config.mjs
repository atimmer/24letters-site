import nextConfig from "eslint-config-next/core-web-vitals";
import nextTypeScriptConfig from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: ["convex/_generated/**"],
  },
  ...nextConfig,
  ...nextTypeScriptConfig,
];

export default eslintConfig;
