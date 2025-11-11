-- DropForeignKey
ALTER TABLE "project_images" DROP CONSTRAINT "project_images_projectId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_categoryId_fkey";

-- AlterTable
ALTER TABLE "design_settings" ADD COLUMN     "draftData" JSONB,
ADD COLUMN     "publishedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "page_sections" ADD COLUMN     "draftConfig" JSONB,
ADD COLUMN     "draftSubtitle" TEXT,
ADD COLUMN     "draftTitle" TEXT,
ADD COLUMN     "draftVisible" BOOLEAN,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "publishedAt" TIMESTAMP(3);
