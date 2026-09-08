import js from "@eslint/js";
import ts from "typescript-eslint";
export default ts.config(
  { ignores: ["site/dist/**", "site/.server/**", "site/.generated/**"] },
  js.configs.recommended,
  ...ts.configs.recommended,
);
