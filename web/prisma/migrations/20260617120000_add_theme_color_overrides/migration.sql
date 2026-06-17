-- CreateTable
CREATE TABLE "theme_color_overrides" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "light" TEXT NOT NULL,
    "dark" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "theme_color_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "theme_color_overrides_key_key" ON "theme_color_overrides"("key");
