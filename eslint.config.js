import js from "@eslint/js";
import globals from "globals";
import stylistic from "@stylistic/eslint-plugin";
import ts from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
    js.configs.recommended,
    ts.configs.strictTypeChecked,
    ts.configs.stylisticTypeChecked,
    stylistic.configs.customize({
        arrowParens: true,
        braceStyle: "1tbs",
        indent: 4,
        quotes: "double",
        quoteProps: "consistent",
        semi: true,
    }),
    {
        languageOptions: {
            globals: globals.node,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // eslint rules: https://eslint.org/docs/latest/rules/
            "eqeqeq": ["error", "always", { null: "never" }],
            "no-console": "error",
            "no-restricted-syntax": [
                "error",
                {
                    "selector": "MethodDefinition[static = true] ThisExpression",
                    "message": "Don't use `this` in static methods. Reference the class directly.",
                },
                {
                    "selector": "TSEnumDeclaration",
                    "message": "Don't use enums. Use string unions.",
                },
            ],
            "prefer-const": "off",
            // @typescript-eslint rules: https://typescript-eslint.io/rules/
            "@typescript-eslint/consistent-type-imports": ["error", { prefer: "no-type-imports" }],
            "@typescript-eslint/dot-notation": "error",
            "@typescript-eslint/explicit-member-accessibility": ["error", { accessibility: "explicit", overrides: { constructors: "no-public" } }],
            "@typescript-eslint/naming-convention": ["error",
                {
                    selector: "default",
                    format: ["camelCase"],
                    leadingUnderscore: "allow",
                    trailingUnderscore: "allow",
                },
                {
                    selector: "import",
                    format: ["camelCase", "PascalCase"],
                },
                {
                    selector: "variable",
                    format: ["camelCase", "UPPER_CASE"],
                    leadingUnderscore: "allow",
                    trailingUnderscore: "allow",
                },
                {
                    selector: "typeLike",
                    format: ["PascalCase"],
                },
                {
                    selector: "function",
                    format: ["camelCase", "PascalCase"],
                },
                {
                    selector: "objectLiteralProperty",
                    format: null,
                },
            ],
            "@typescript-eslint/no-unused-vars": "off", // Our TypeScript config already prevents this
            "@typescript-eslint/restrict-template-expressions": ["error", {
                allowNumber: true,
                allow: [],
                allowAny: false,
                allowBoolean: false,
                allowNullish: false,
                allowRegExp: false,
            }],
            "@typescript-eslint/strict-boolean-expressions": ["error", { allowString: false, allowNumber: false, allowNullableObject: false }],
            "@typescript-eslint/switch-exhaustiveness-check": "error",
            "@typescript-eslint/unbound-method": ["error", { ignoreStatic: true }],
            // @stylistic rules: https://eslint.style/packages/default
            "@stylistic/member-delimiter-style": ["error", {
                "multiline": {
                    "delimiter": "comma",
                    "requireLast": true,
                },
                "singleline": {
                    "delimiter": "comma",
                    "requireLast": false,
                },
            }],
        },
    },
    {
        files: ["**/*.js", "tests/**/*.ts"],
        extends: [ts.configs.disableTypeChecked],
    },
    {
        ignores: [
            "dist/",
        ],
    },
]);
