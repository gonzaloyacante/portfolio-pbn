-- CreateTable
CREATE TABLE "testimonials" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "excerpt" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "position" TEXT,
    "company" TEXT,
    "website" TEXT,
    "avatarUrl" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT,
    "projectId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "moderatedBy" TEXT,
    "moderatedAt" TIMESTAMP(3),
    "moderationNote" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "shortDesc" TEXT,
    "price" DECIMAL(10,2),
    "priceLabel" TEXT DEFAULT 'desde',
    "currency" TEXT NOT NULL DEFAULT 'ARS',
    "pricingTiers" JSONB,
    "duration" TEXT,
    "durationMinutes" INTEGER,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "maxBookingsPerDay" INTEGER DEFAULT 3,
    "advanceNoticeDays" INTEGER DEFAULT 2,
    "imageUrl" TEXT,
    "galleryUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "videoUrl" TEXT,
    "iconName" TEXT,
    "color" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "bookingCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "requirements" TEXT,
    "cancellationPolicy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "subject" TEXT,
    "responsePreference" TEXT NOT NULL DEFAULT 'EMAIL',
    "leadScore" INTEGER DEFAULT 0,
    "leadSource" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "assignedTo" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "readBy" TEXT,
    "isReplied" BOOLEAN NOT NULL DEFAULT false,
    "repliedAt" TIMESTAMP(3),
    "repliedBy" TEXT,
    "replyText" TEXT,
    "adminNote" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientPhone" TEXT,
    "clientNotes" TEXT,
    "guestCount" INTEGER DEFAULT 1,
    "adminNotes" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "confirmedBy" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "cancelledBy" TEXT,
    "cancellationReason" TEXT,
    "totalAmount" DECIMAL(10,2),
    "paidAmount" DECIMAL(10,2),
    "paymentStatus" TEXT DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "paymentRef" TEXT,
    "reminderSentAt" TIMESTAMP(3),
    "reminderCount" INTEGER NOT NULL DEFAULT 0,
    "feedbackSent" BOOLEAN NOT NULL DEFAULT false,
    "feedbackRating" INTEGER,
    "feedbackText" TEXT,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "avatarUrl" TEXT,
    "bio" TEXT,
    "emailVerified" TIMESTAMP(3),
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "lastLoginIp" TEXT,
    "failedLoginCount" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "locale" TEXT NOT NULL DEFAULT 'es',
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Madrid',
    "notifications" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ogImage" TEXT,
    "thumbnailUrl" TEXT,
    "coverImageUrl" TEXT,
    "iconName" TEXT,
    "color" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "projectCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "excerpt" TEXT,
    "thumbnailUrl" TEXT NOT NULL,
    "videoUrl" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" TEXT,
    "client" TEXT,
    "location" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ogImage" TEXT,
    "canonicalUrl" TEXT,
    "categoryId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "layout" TEXT DEFAULT 'grid',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "lastViewedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "publishedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "alt" TEXT,
    "caption" TEXT,
    "title" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "format" TEXT,
    "bytes" INTEGER,
    "seoAlt" TEXT,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "isHero" BOOLEAN NOT NULL DEFAULT false,
    "categoryGalleryOrder" INTEGER,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "project_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytic_logs" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "entityId" TEXT,
    "entityType" TEXT,
    "eventData" JSONB,
    "sessionId" TEXT,
    "userId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmTerm" TEXT,
    "utmContent" TEXT,
    "country" TEXT,
    "city" TEXT,
    "region" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "device" TEXT,
    "loadTime" INTEGER,
    "scrollDepth" INTEGER,
    "timeOnPage" INTEGER,
    "sessionDuration" INTEGER,
    "clickTarget" TEXT,
    "vitalsLCP" DOUBLE PRECISION,
    "vitalsFCP" DOUBLE PRECISION,
    "vitalsINP" DOUBLE PRECISION,
    "vitalsCLS" DOUBLE PRECISION,
    "isDuplicate" BOOLEAN NOT NULL DEFAULT false,
    "isBot" BOOLEAN NOT NULL DEFAULT false,
    "metadata" TEXT,

    CONSTRAINT "analytic_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "country" TEXT,
    "city" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_events" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "details" JSONB,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "security_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocked_ips" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "blockedBy" TEXT,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "hitCount" INTEGER NOT NULL DEFAULT 0,
    "lastHitAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blocked_ips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_settings" (
    "id" TEXT NOT NULL,
    "heroTitle1Text" TEXT DEFAULT 'Make-up',
    "heroTitle1Font" TEXT,
    "heroTitle1FontUrl" TEXT,
    "heroTitle1FontSize" INTEGER DEFAULT 112,
    "heroTitle1Color" TEXT,
    "heroTitle1ColorDark" TEXT,
    "heroTitle1ZIndex" INTEGER DEFAULT 20,
    "heroTitle1OffsetX" INTEGER DEFAULT 0,
    "heroTitle1OffsetY" INTEGER DEFAULT 0,
    "heroTitle2Text" TEXT DEFAULT 'Portfolio',
    "heroTitle2Font" TEXT,
    "heroTitle2FontUrl" TEXT,
    "heroTitle2FontSize" INTEGER DEFAULT 96,
    "heroTitle2Color" TEXT,
    "heroTitle2ColorDark" TEXT,
    "heroTitle2ZIndex" INTEGER DEFAULT 10,
    "heroTitle2OffsetX" INTEGER DEFAULT 0,
    "heroTitle2OffsetY" INTEGER DEFAULT 0,
    "ownerNameText" TEXT DEFAULT 'Paola Bolívar Nievas',
    "ownerNameFont" TEXT,
    "ownerNameFontUrl" TEXT,
    "ownerNameFontSize" INTEGER DEFAULT 36,
    "ownerNameColor" TEXT,
    "ownerNameColorDark" TEXT,
    "ownerNameZIndex" INTEGER DEFAULT 15,
    "ownerNameOffsetX" INTEGER DEFAULT 0,
    "ownerNameOffsetY" INTEGER DEFAULT 0,
    "heroMainImageUrl" TEXT,
    "heroMainImageAlt" TEXT DEFAULT 'Trabajo destacado',
    "heroMainImageCaption" TEXT,
    "heroImageStyle" TEXT DEFAULT 'original',
    "heroMainImageZIndex" INTEGER DEFAULT 5,
    "heroMainImageOffsetX" INTEGER DEFAULT 0,
    "heroMainImageOffsetY" INTEGER DEFAULT 0,
    "illustrationUrl" TEXT,
    "illustrationAlt" TEXT DEFAULT 'Ilustración maquilladora',
    "illustrationZIndex" INTEGER DEFAULT 10,
    "illustrationOpacity" INTEGER DEFAULT 100,
    "illustrationSize" INTEGER DEFAULT 100,
    "illustrationOffsetX" INTEGER DEFAULT 0,
    "illustrationOffsetY" INTEGER DEFAULT 0,
    "illustrationRotation" INTEGER DEFAULT 0,
    "ctaText" TEXT DEFAULT 'Ver Portfolio',
    "ctaLink" TEXT DEFAULT '/proyectos',
    "ctaFont" TEXT,
    "ctaFontUrl" TEXT,
    "ctaFontSize" INTEGER DEFAULT 16,
    "ctaVariant" TEXT DEFAULT 'default',
    "ctaSize" TEXT DEFAULT 'default',
    "ctaOffsetX" INTEGER DEFAULT 0,
    "ctaOffsetY" INTEGER DEFAULT 0,
    "heroTitle1MobileOffsetX" INTEGER DEFAULT 0,
    "heroTitle1MobileOffsetY" INTEGER DEFAULT 0,
    "heroTitle1MobileFontSize" INTEGER DEFAULT 56,
    "heroTitle2MobileOffsetX" INTEGER DEFAULT 0,
    "heroTitle2MobileOffsetY" INTEGER DEFAULT 0,
    "heroTitle2MobileFontSize" INTEGER DEFAULT 72,
    "ownerNameMobileOffsetX" INTEGER DEFAULT 0,
    "ownerNameMobileOffsetY" INTEGER DEFAULT 0,
    "ownerNameMobileFontSize" INTEGER DEFAULT 28,
    "heroMainImageMobileOffsetX" INTEGER DEFAULT 0,
    "heroMainImageMobileOffsetY" INTEGER DEFAULT 0,
    "illustrationMobileOffsetX" INTEGER DEFAULT 0,
    "illustrationMobileOffsetY" INTEGER DEFAULT 0,
    "illustrationMobileSize" INTEGER DEFAULT 60,
    "illustrationMobileRotation" INTEGER DEFAULT 0,
    "ctaMobileOffsetX" INTEGER DEFAULT 0,
    "ctaMobileOffsetY" INTEGER DEFAULT 0,
    "ctaMobileFontSize" INTEGER DEFAULT 16,
    "showFeaturedProjects" BOOLEAN NOT NULL DEFAULT true,
    "featuredTitle" TEXT DEFAULT 'Proyectos Destacados',
    "featuredTitleFont" TEXT,
    "featuredTitleFontUrl" TEXT,
    "featuredTitleFontSize" INTEGER DEFAULT 32,
    "featuredTitleColor" TEXT,
    "featuredTitleColorDark" TEXT,
    "featuredCount" INTEGER NOT NULL DEFAULT 6,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about_settings" (
    "id" TEXT NOT NULL,
    "illustrationUrl" TEXT,
    "illustrationAlt" TEXT DEFAULT 'Ilustración sobre mí',
    "bioTitle" TEXT DEFAULT 'Hola, soy Paola.',
    "bioIntro" TEXT,
    "bioDescription" TEXT,
    "profileImageUrl" TEXT,
    "profileImageAlt" TEXT DEFAULT 'Paola Bolívar Nievas',
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "yearsExperience" INTEGER,
    "certifications" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_settings" (
    "id" TEXT NOT NULL,
    "pageTitle" TEXT DEFAULT 'Contacto',
    "illustrationUrl" TEXT,
    "illustrationAlt" TEXT DEFAULT 'Ilustración contacto',
    "ownerName" TEXT DEFAULT 'Paola Bolívar Nievas',
    "email" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "location" TEXT,
    "formTitle" TEXT DEFAULT 'Envíame un mensaje',
    "nameLabel" TEXT DEFAULT 'Tu nombre',
    "emailLabel" TEXT DEFAULT 'Tu email',
    "phoneLabel" TEXT DEFAULT 'Tu teléfono (opcional)',
    "messageLabel" TEXT DEFAULT 'Mensaje',
    "preferenceLabel" TEXT DEFAULT '¿Cómo preferís que te contacte?',
    "submitLabel" TEXT DEFAULT 'Enviar mensaje',
    "successTitle" TEXT DEFAULT '¡Mensaje enviado!',
    "successMessage" TEXT DEFAULT 'Gracias por contactarme. Te responderé lo antes posible.',
    "sendAnotherLabel" TEXT DEFAULT 'Enviar otro mensaje',
    "showSocialLinks" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_settings" (
    "id" TEXT NOT NULL,
    "showCardTitles" BOOLEAN NOT NULL DEFAULT true,
    "showCardCategory" BOOLEAN NOT NULL DEFAULT true,
    "gridColumns" INTEGER NOT NULL DEFAULT 3,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_settings" (
    "id" TEXT NOT NULL,
    "showDescription" BOOLEAN NOT NULL DEFAULT true,
    "showProjectCount" BOOLEAN NOT NULL DEFAULT true,
    "gridColumns" INTEGER NOT NULL DEFAULT 4,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonial_settings" (
    "id" TEXT NOT NULL,
    "showOnAbout" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT DEFAULT 'Lo que dicen mis clientes',
    "maxDisplay" INTEGER NOT NULL DEFAULT 6,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonial_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "theme_settings" (
    "id" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL DEFAULT '#6c0a0a',
    "secondaryColor" TEXT NOT NULL DEFAULT '#ffaadd',
    "accentColor" TEXT NOT NULL DEFAULT '#fff1f9',
    "backgroundColor" TEXT NOT NULL DEFAULT '#fff1f9',
    "textColor" TEXT NOT NULL DEFAULT '#000000',
    "cardBgColor" TEXT NOT NULL DEFAULT '#ffaadd',
    "darkPrimaryColor" TEXT NOT NULL DEFAULT '#ffaadd',
    "darkSecondaryColor" TEXT NOT NULL DEFAULT '#6c0a0a',
    "darkAccentColor" TEXT NOT NULL DEFAULT '#000000',
    "darkBackgroundColor" TEXT NOT NULL DEFAULT '#6c0a0a',
    "darkTextColor" TEXT NOT NULL DEFAULT '#fff1f9',
    "darkCardBgColor" TEXT NOT NULL DEFAULT '#ffaadd',
    "headingFont" TEXT NOT NULL DEFAULT 'Poppins',
    "headingFontUrl" TEXT,
    "headingFontSize" INTEGER NOT NULL DEFAULT 32,
    "scriptFont" TEXT NOT NULL DEFAULT 'Great Vibes',
    "scriptFontUrl" TEXT,
    "scriptFontSize" INTEGER NOT NULL DEFAULT 24,
    "bodyFont" TEXT NOT NULL DEFAULT 'Open Sans',
    "bodyFontUrl" TEXT,
    "bodyFontSize" INTEGER NOT NULL DEFAULT 16,
    "brandFont" TEXT DEFAULT 'Saira Extra Condensed',
    "brandFontUrl" TEXT,
    "brandFontSize" INTEGER NOT NULL DEFAULT 112,
    "portfolioFont" TEXT DEFAULT 'Saira Extra Condensed',
    "portfolioFontUrl" TEXT,
    "portfolioFontSize" INTEGER NOT NULL DEFAULT 96,
    "signatureFont" TEXT DEFAULT 'Dawning of a New Day',
    "signatureFontUrl" TEXT,
    "signatureFontSize" INTEGER NOT NULL DEFAULT 36,
    "borderRadius" INTEGER NOT NULL DEFAULT 40,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "theme_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_links" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "username" TEXT,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'Paola Bolívar Nievas - Make-up Artist',
    "siteTagline" TEXT DEFAULT 'Especialista en maquillaje profesional',
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "defaultMetaTitle" TEXT DEFAULT 'Paola Bolívar Nievas | Make-up Artist Portfolio',
    "defaultMetaDescription" TEXT,
    "defaultOgImage" TEXT,
    "defaultEmail" TEXT,
    "defaultPhone" TEXT,
    "defaultWhatsapp" TEXT,
    "defaultAddress" TEXT,
    "businessHours" JSONB,
    "googleAnalyticsId" TEXT,
    "facebookPixelId" TEXT,
    "googleTagManagerId" TEXT,
    "privacyPolicyUrl" TEXT,
    "termsOfServiceUrl" TEXT,
    "cookiePolicyUrl" TEXT,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceMessage" TEXT,
    "showAboutPage" BOOLEAN NOT NULL DEFAULT true,
    "showProjectsPage" BOOLEAN NOT NULL DEFAULT true,
    "showServicesPage" BOOLEAN NOT NULL DEFAULT false,
    "showContactPage" BOOLEAN NOT NULL DEFAULT true,
    "allowIndexing" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_settings" (
    "id" TEXT NOT NULL,
    "smtpHost" TEXT,
    "smtpPort" INTEGER DEFAULT 587,
    "smtpUser" TEXT,
    "smtpPassword" TEXT,
    "smtpFrom" TEXT DEFAULT 'noreply@portfolio.com',
    "smtpFromName" TEXT DEFAULT 'Paola Bolívar Nievas',
    "sendContactNotifications" BOOLEAN NOT NULL DEFAULT true,
    "sendBookingNotifications" BOOLEAN NOT NULL DEFAULT true,
    "sendTestimonialNotifications" BOOLEAN NOT NULL DEFAULT true,
    "notificationEmails" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "testimonials_isActive_sortOrder_idx" ON "testimonials"("isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "testimonials_status_featured_idx" ON "testimonials"("status", "featured");

-- CreateIndex
CREATE INDEX "testimonials_rating_idx" ON "testimonials"("rating");

-- CreateIndex
CREATE INDEX "testimonials_viewCount_idx" ON "testimonials"("viewCount");

-- CreateIndex
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");

-- CreateIndex
CREATE INDEX "services_isActive_sortOrder_idx" ON "services"("isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "services_isFeatured_idx" ON "services"("isFeatured");

-- CreateIndex
CREATE INDEX "services_isAvailable_idx" ON "services"("isAvailable");

-- CreateIndex
CREATE INDEX "contacts_ipAddress_createdAt_idx" ON "contacts"("ipAddress", "createdAt");

-- CreateIndex
CREATE INDEX "contacts_isRead_status_idx" ON "contacts"("isRead", "status");

-- CreateIndex
CREATE INDEX "contacts_status_priority_idx" ON "contacts"("status", "priority");

-- CreateIndex
CREATE INDEX "contacts_assignedTo_idx" ON "contacts"("assignedTo");

-- CreateIndex
CREATE INDEX "contacts_leadScore_idx" ON "contacts"("leadScore");

-- CreateIndex
CREATE INDEX "bookings_date_idx" ON "bookings"("date");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE INDEX "bookings_clientEmail_idx" ON "bookings"("clientEmail");

-- CreateIndex
CREATE INDEX "bookings_serviceId_date_idx" ON "bookings"("serviceId", "date");

-- CreateIndex
CREATE INDEX "bookings_paymentStatus_idx" ON "bookings"("paymentStatus");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_isActive_deletedAt_idx" ON "users"("isActive", "deletedAt");

-- CreateIndex
CREATE INDEX "users_lastLoginAt_idx" ON "users"("lastLoginAt");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_sortOrder_idx" ON "categories"("sortOrder");

-- CreateIndex
CREATE INDEX "categories_isActive_deletedAt_idx" ON "categories"("isActive", "deletedAt");

-- CreateIndex
CREATE INDEX "categories_viewCount_idx" ON "categories"("viewCount");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_categoryId_date_idx" ON "projects"("categoryId", "date" DESC);

-- CreateIndex
CREATE INDEX "projects_categoryId_sortOrder_idx" ON "projects"("categoryId", "sortOrder");

-- CreateIndex
CREATE INDEX "projects_isActive_isDeleted_idx" ON "projects"("isActive", "isDeleted");

-- CreateIndex
CREATE INDEX "projects_isFeatured_isPinned_idx" ON "projects"("isFeatured", "isPinned");

-- CreateIndex
CREATE INDEX "projects_publishedAt_idx" ON "projects"("publishedAt");

-- CreateIndex
CREATE INDEX "projects_viewCount_idx" ON "projects"("viewCount");

-- CreateIndex
CREATE INDEX "projects_tags_idx" ON "projects"("tags");

-- CreateIndex
CREATE INDEX "project_images_projectId_order_idx" ON "project_images"("projectId", "order");

-- CreateIndex
CREATE INDEX "project_images_isCover_idx" ON "project_images"("isCover");

-- CreateIndex
CREATE INDEX "project_images_isHero_idx" ON "project_images"("isHero");

-- CreateIndex
CREATE INDEX "project_images_categoryGalleryOrder_idx" ON "project_images"("categoryGalleryOrder");

-- CreateIndex
CREATE INDEX "analytic_logs_eventType_timestamp_idx" ON "analytic_logs"("eventType", "timestamp");

-- CreateIndex
CREATE INDEX "analytic_logs_entityType_entityId_idx" ON "analytic_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "analytic_logs_sessionId_idx" ON "analytic_logs"("sessionId");

-- CreateIndex
CREATE INDEX "analytic_logs_userId_idx" ON "analytic_logs"("userId");

-- CreateIndex
CREATE INDEX "analytic_logs_ipAddress_idx" ON "analytic_logs"("ipAddress");

-- CreateIndex
CREATE INDEX "analytic_logs_country_city_idx" ON "analytic_logs"("country", "city");

-- CreateIndex
CREATE INDEX "analytic_logs_isDuplicate_eventType_timestamp_idx" ON "analytic_logs"("isDuplicate", "eventType", "timestamp");

-- CreateIndex
CREATE INDEX "analytic_logs_timestamp_idx" ON "analytic_logs"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "password_reset_tokens_email_idx" ON "password_reset_tokens"("email");

-- CreateIndex
CREATE INDEX "password_reset_tokens_token_expiresAt_idx" ON "password_reset_tokens"("token", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "sessions_userId_isActive_idx" ON "sessions"("userId", "isActive");

-- CreateIndex
CREATE INDEX "sessions_sessionToken_idx" ON "sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "security_events_eventType_severity_idx" ON "security_events"("eventType", "severity");

-- CreateIndex
CREATE INDEX "security_events_userId_idx" ON "security_events"("userId");

-- CreateIndex
CREATE INDEX "security_events_ipAddress_idx" ON "security_events"("ipAddress");

-- CreateIndex
CREATE INDEX "security_events_resolved_idx" ON "security_events"("resolved");

-- CreateIndex
CREATE UNIQUE INDEX "blocked_ips_ipAddress_key" ON "blocked_ips"("ipAddress");

-- CreateIndex
CREATE INDEX "blocked_ips_ipAddress_isActive_idx" ON "blocked_ips"("ipAddress", "isActive");

-- CreateIndex
CREATE INDEX "blocked_ips_expiresAt_idx" ON "blocked_ips"("expiresAt");

-- CreateIndex
CREATE INDEX "social_links_isActive_sortOrder_idx" ON "social_links"("isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "social_links_platform_key" ON "social_links"("platform");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
