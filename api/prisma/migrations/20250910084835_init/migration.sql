/*
  Warnings:

  - A unique constraint covering the columns `[uid]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uid]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN "uid" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN "uid" TEXT;

-- CreateTable
CREATE TABLE "ImportMap" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "entity" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "targetCatId" INTEGER,
    "targetProjId" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "ImportMap_entity_sourceId_key" ON "ImportMap"("entity", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_uid_key" ON "Category"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Project_uid_key" ON "Project"("uid");
