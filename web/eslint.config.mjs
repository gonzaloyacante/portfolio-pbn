import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // ─── Node.js Environment (scripts, seed, tests, prisma, config) ────────────
  // Archivos que corren en Node.js y necesitan process, Buffer, __dirname, etc.
  {
    files: [
      "scripts/**/*.{ts,js,mjs}",
      "prisma/**/*.{ts,js}",
      "tests/**/*.{ts,tsx}",
      "vitest.config.ts",
      "playwright.config.ts",
      "next.config.ts",
      "postcss.config.mjs",
      "tailwind.config.ts",
      "prisma.config.ts",
    ],
    languageOptions: {
      globals: {
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
      },
    },
  },
  // ─── Vitest Globals + Relaxed rules (test files only) ────────────────────
  {
    files: ["tests/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        vi: "readonly",
      },
    },
    rules: {
      // Tests often need `any` for mocking and type assertions
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { "varsIgnorePattern": "^_", "argsIgnorePattern": "^_" },
      ],
      "@typescript-eslint/no-require-imports": "off",
      "react/display-name": "off",
      "@next/next/no-img-element": "off",
    },
  },
  // ─── Design Token Enforcement ──────────────────────────────────────────────
  // Prohíbe colores HEX hardcodeados fuera del archivo de tokens.
  // Excepciones: design-tokens.ts (fuente de verdad), ColorPicker.tsx (paleta UI),
  // OptimizedImage.tsx (SVG placeholder neutral), visual-editor (inputs nativos).
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: [
      "src/lib/design-tokens.ts",
      "src/components/ui/forms/ColorPicker.tsx",
      "src/components/ui/media/OptimizedImage.tsx",
      "src/components/features/visual-editor/**",
      "src/components/features/theme/ThemeColorSection.tsx",
    ],
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector: "Literal[value=/#[0-9a-fA-F]{6}/]",
          message:
            "Hardcoded HEX colors are forbidden. Use design tokens from @/lib/design-tokens or CSS variables (var(--token)).",
        },
      ],
    },
  },
]);

export default eslintConfig;
