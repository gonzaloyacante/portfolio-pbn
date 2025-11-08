-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('HERO', 'ABOUT', 'SKILLS', 'PROJECTS', 'CONTACT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "SkillsLayoutType" AS ENUM ('GRID', 'CIRCULAR', 'HORIZONTAL', 'VERTICAL');

-- CreateEnum
CREATE TYPE "ContentBlockType" AS ENUM ('TEXT', 'IMAGE', 'CTA', 'STATS', 'TESTIMONIAL', 'CUSTOM_HTML');

-- CreateTable
CREATE TABLE "design_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "primaryColor" TEXT NOT NULL DEFAULT '#8B0000',
    "secondaryColor" TEXT NOT NULL DEFAULT '#FFB6C1',
    "backgroundColor" TEXT NOT NULL DEFAULT '#FFF5F5',
    "textColor" TEXT NOT NULL DEFAULT '#2D2D2D',
    "accentColor" TEXT NOT NULL DEFAULT '#D4A5A5',
    "headingFont" TEXT NOT NULL DEFAULT 'Parisienne',
    "bodyFont" TEXT NOT NULL DEFAULT 'Inter',
    "headingSize" TEXT NOT NULL DEFAULT '4rem',
    "bodySize" TEXT NOT NULL DEFAULT '1rem',
    "lineHeight" TEXT NOT NULL DEFAULT '1.6',
    "containerMaxWidth" TEXT NOT NULL DEFAULT '1200px',
    "sectionPadding" TEXT NOT NULL DEFAULT '4rem 2rem',
    "elementSpacing" TEXT NOT NULL DEFAULT '2rem',
    "borderRadius" TEXT NOT NULL DEFAULT '0.5rem',
    "boxShadow" TEXT NOT NULL DEFAULT '0 4px 6px rgba(0,0,0,0.1)',
    "hoverTransform" TEXT NOT NULL DEFAULT 'translateY(-4px)',
    "transitionSpeed" TEXT NOT NULL DEFAULT '0.3s',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "design_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_sections" (
    "id" TEXT NOT NULL,
    "pageName" TEXT NOT NULL,
    "sectionType" "SectionType" NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_blocks" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ContentBlockType" NOT NULL,
    "content" JSONB NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "page_sections_pageName_idx" ON "page_sections"("pageName");

-- CreateIndex
CREATE INDEX "page_sections_order_idx" ON "page_sections"("order");

-- CreateIndex
CREATE UNIQUE INDEX "page_sections_pageName_sectionType_key" ON "page_sections"("pageName", "sectionType");

-- CreateIndex
CREATE UNIQUE INDEX "content_blocks_slug_key" ON "content_blocks"("slug");

-- CreateIndex
CREATE INDEX "content_blocks_slug_idx" ON "content_blocks"("slug");

-- CreateIndex
CREATE INDEX "content_blocks_type_idx" ON "content_blocks"("type");
