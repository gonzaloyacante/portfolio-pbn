-- Hero inmersivo activado por defecto (nuevas filas + entornos existentes).
ALTER TABLE "home_settings" ALTER COLUMN "heroImmersiveEnabled" SET DEFAULT true;

UPDATE "home_settings" SET "heroImmersiveEnabled" = true;
