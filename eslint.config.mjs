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
