-- Defaults de tema alineados con design-tokens (BRAND). No modifica filas existentes.
ALTER TABLE "theme_settings"
  ALTER COLUMN "secondaryColor" SET DEFAULT '#fce7f3',
  ALTER COLUMN "backgroundColor" SET DEFAULT '#fff8fc',
  ALTER COLUMN "textColor" SET DEFAULT '#1a050a',
  ALTER COLUMN "cardBgColor" SET DEFAULT '#ffffff',
  ALTER COLUMN "darkPrimaryColor" SET DEFAULT '#fb7185',
  ALTER COLUMN "darkSecondaryColor" SET DEFAULT '#881337',
  ALTER COLUMN "darkAccentColor" SET DEFAULT '#2a1015',
  ALTER COLUMN "darkBackgroundColor" SET DEFAULT '#0f0505',
  ALTER COLUMN "darkTextColor" SET DEFAULT '#fafafa',
  ALTER COLUMN "darkCardBgColor" SET DEFAULT '#1c0a0f';
