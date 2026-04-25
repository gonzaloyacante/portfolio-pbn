-- CreateTable
CREATE TABLE "app_releases" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "versionCode" INTEGER NOT NULL,
    "releaseNotes" TEXT NOT NULL,
    "downloadUrl" TEXT NOT NULL,
    "checksumSha256" TEXT,
    "mandatory" BOOLEAN NOT NULL DEFAULT false,
    "minVersion" TEXT,
    "fileSizeBytes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_releases_pkey" PRIMARY KEY ("id")
);
