import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import globals from "globals";

export default [
  {
    files          : [ "**/*.{ts,tsx}" ],
    languageOptions: {
      ecmaVersion  : "latest",
      sourceType   : "module",
      parser       : typescriptParser,
      parserOptions: {},
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    rules: {
        "@typescript-eslint/semi": ["error"],
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/restrict-plus-operands": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",

        "@typescript-eslint/no-unused-vars": ["error", {
            argsIgnorePattern: "^_",
        }],

        "no-case-declarations": "off",
    },
  }
];