-- AlterTable
ALTER TABLE "home_settings" ADD COLUMN     "heroScrimTabletExtentPercent" INTEGER DEFAULT 45,
ADD COLUMN     "heroScrimTabletOpacity" INTEGER DEFAULT 80,
ADD COLUMN     "heroScrimTabletShowLeft" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "heroScrimTabletShowRight" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "heroScrimTabletShowTop" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "navbarScrimMobileEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "navbarScrimMobileHeightVh" INTEGER DEFAULT 45,
ADD COLUMN     "navbarScrimMobileIntensity" INTEGER DEFAULT 80,
ADD COLUMN     "navbarScrimTabletEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "navbarScrimTabletHeightVh" INTEGER DEFAULT 45,
ADD COLUMN     "navbarScrimTabletIntensity" INTEGER DEFAULT 80;
