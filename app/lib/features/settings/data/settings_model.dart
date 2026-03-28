// ignore_for_file: invalid_annotation_target

import 'package:freezed_annotation/freezed_annotation.dart';

part 'settings_model.freezed.dart';
part 'settings_model.g.dart';

// ── About Settings ────────────────────────────────────────────────────────────

@freezed
abstract class AboutSettings with _$AboutSettings {
  const factory AboutSettings({
    String? id,
    String? bioTitle,
    String? bioIntro,
    String? bioDescription,
    String? profileImageUrl,
    String? profileImageAlt,
    String? profileImageShape,
    String? illustrationUrl,
    String? illustrationAlt,
    @Default([]) List<String> skills,
    @Default([]) List<String> certifications,
    int? yearsExperience,
    @Default(true) bool isActive,
  }) = _AboutSettings;

  factory AboutSettings.fromJson(Map<String, dynamic> json) =>
      _$AboutSettingsFromJson(json);
}

// ── Contact Settings ──────────────────────────────────────────────────────────

@freezed
abstract class ContactSettings with _$ContactSettings {
  const factory ContactSettings({
    String? id,
    String? pageTitle,
    String? ownerName,
    String? email,
    String? phone,
    String? whatsapp,
    String? location,
    String? formTitle,
    String? successTitle,
    String? successMessage,
    @Default(true) bool showSocialLinks,
    @Default(true) bool showPhone,
    @Default(true) bool showWhatsapp,
    @Default(true) bool showEmail,
    @Default(true) bool showLocation,
    @Default(true) bool isActive,
  }) = _ContactSettings;

  factory ContactSettings.fromJson(Map<String, dynamic> json) =>
      _$ContactSettingsFromJson(json);
}

// ── Theme Settings ───────────────────────────────────────────────────────────

@freezed
abstract class ThemeSettings with _$ThemeSettings {
  const factory ThemeSettings({
    String? id,
    // Light mode
    @Default('#6c0a0a') String primaryColor,
    @Default('#ffaadd') String secondaryColor,
    @Default('#fff1f9') String accentColor,
    @Default('#fff1f9') String backgroundColor,
    @Default('#000000') String textColor,
    @Default('#ffaadd') String cardBgColor,
    // Dark mode
    @Default('#ffaadd') String darkPrimaryColor,
    @Default('#6c0a0a') String darkSecondaryColor,
    @Default('#000000') String darkAccentColor,
    @Default('#6c0a0a') String darkBackgroundColor,
    @Default('#fff1f9') String darkTextColor,
    @Default('#ffaadd') String darkCardBgColor,
    // Typography — Base
    @Default('Poppins') String headingFont,
    String? headingFontUrl,
    @Default(32) int headingFontSize,
    @Default('Open Sans') String bodyFont,
    String? bodyFontUrl,
    @Default(16) int bodyFontSize,
    @Default('Great Vibes') String scriptFont,
    String? scriptFontUrl,
    @Default(24) int scriptFontSize,
    // Typography — Brand
    String? brandFont,
    String? brandFontUrl,
    int? brandFontSize,
    String? portfolioFont,
    String? portfolioFontUrl,
    int? portfolioFontSize,
    String? signatureFont,
    String? signatureFontUrl,
    int? signatureFontSize,
    // Layout
    @Default(40) int borderRadius,
    @Default(true) bool isActive,
  }) = _ThemeSettings;

  factory ThemeSettings.fromJson(Map<String, dynamic> json) =>
      _$ThemeSettingsFromJson(json);
}

// ── Site Settings ─────────────────────────────────────────────────────────────

@freezed
abstract class SiteSettings with _$SiteSettings {
  const factory SiteSettings({
    String? id,
    @Default('Paola Bolívar Nievas - Make-up Artist') String siteName,
    String? siteTagline,
    String? logoUrl,
    String? defaultMetaTitle,
    String? defaultMetaDescription,
    String? defaultEmail,
    String? defaultPhone,
    String? defaultWhatsapp,
    String? googleAnalyticsId,
    @Default(false) bool maintenanceMode,
    String? maintenanceMessage,
    @Default(true) bool showAboutPage,
    @Default(true) bool showProjectsPage,
    @Default(false) bool showServicesPage,
    @Default(true) bool showContactPage,
    @Default(true) bool allowIndexing,
    @Default(true) bool isActive,
  }) = _SiteSettings;

  factory SiteSettings.fromJson(Map<String, dynamic> json) =>
      _$SiteSettingsFromJson(json);
}

// ── Home Settings ───────────────────────────────────────────────────────────

@freezed
abstract class HomeSettings with _$HomeSettings {
  const factory HomeSettings({
    String? id,

    // ── Título 1 ──
    String? heroTitle1Text,
    String? heroTitle1Font,
    String? heroTitle1FontUrl,
    int? heroTitle1FontSize,
    String? heroTitle1Color,
    String? heroTitle1ColorDark,
    int? heroTitle1ZIndex,
    int? heroTitle1OffsetX,
    int? heroTitle1OffsetY,

    // ── Título 2 ──
    String? heroTitle2Text,
    String? heroTitle2Font,
    String? heroTitle2FontUrl,
    int? heroTitle2FontSize,
    String? heroTitle2Color,
    String? heroTitle2ColorDark,
    int? heroTitle2ZIndex,
    int? heroTitle2OffsetX,
    int? heroTitle2OffsetY,

    // ── Nombre propietario ──
    String? ownerNameText,
    String? ownerNameFont,
    String? ownerNameFontUrl,
    int? ownerNameFontSize,
    String? ownerNameColor,
    String? ownerNameColorDark,
    int? ownerNameZIndex,
    int? ownerNameOffsetX,
    int? ownerNameOffsetY,

    // ── Imagen principal ──
    String? heroMainImageUrl,
    String? heroMainImageAlt,
    String? heroMainImageCaption,
    String? heroImageStyle,
    int? heroMainImageZIndex,
    int? heroMainImageOffsetX,
    int? heroMainImageOffsetY,

    // ── Ilustración ──
    String? illustrationUrl,
    String? illustrationAlt,
    int? illustrationZIndex,
    int? illustrationOpacity,
    int? illustrationSize,
    int? illustrationOffsetX,
    int? illustrationOffsetY,
    int? illustrationRotation,

    // ── Botón CTA ──
    String? ctaText,
    String? ctaLink,
    String? ctaFont,
    String? ctaFontUrl,
    int? ctaFontSize,
    String? ctaVariant,
    String? ctaSize,
    int? ctaOffsetX,
    int? ctaOffsetY,

    // ── Mobile Overrides ──
    int? heroTitle1MobileOffsetX,
    int? heroTitle1MobileOffsetY,
    int? heroTitle1MobileFontSize,
    int? heroTitle2MobileOffsetX,
    int? heroTitle2MobileOffsetY,
    int? heroTitle2MobileFontSize,
    int? ownerNameMobileOffsetX,
    int? ownerNameMobileOffsetY,
    int? ownerNameMobileFontSize,
    int? heroMainImageMobileOffsetX,
    int? heroMainImageMobileOffsetY,
    int? illustrationMobileOffsetX,
    int? illustrationMobileOffsetY,
    int? illustrationMobileSize,
    int? illustrationMobileRotation,
    int? ctaMobileOffsetX,
    int? ctaMobileOffsetY,
    int? ctaMobileFontSize,

    // ── Proyectos destacados ──
    @Default(true) bool showFeaturedProjects,
    String? featuredTitle,
    String? featuredTitleFont,
    String? featuredTitleFontUrl,
    int? featuredTitleFontSize,
    String? featuredTitleColor,
    String? featuredTitleColorDark,
    @Default(6) int featuredCount,

    // ── Meta ──
    @Default(true) bool isActive,
  }) = _HomeSettings;

  factory HomeSettings.fromJson(Map<String, dynamic> json) =>
      _$HomeSettingsFromJson(json);
}

// ── Category Display Settings ───────────────────────────────────────────────

@freezed
abstract class CategoryDisplaySettings with _$CategoryDisplaySettings {
  const factory CategoryDisplaySettings({
    String? id,
    @Default(true) bool showDescription,
    @Default(true) bool showProjectCount,
    @Default(4) int gridColumns,
    @Default(true) bool isActive,
  }) = _CategoryDisplaySettings;

  factory CategoryDisplaySettings.fromJson(Map<String, dynamic> json) =>
      _$CategoryDisplaySettingsFromJson(json);
}

// ── Social Link ───────────────────────────────────────────────────────────────

@freezed
abstract class SocialLink with _$SocialLink {
  const factory SocialLink({
    required String id,
    required String platform,
    required String url,
    String? username,
    String? icon,
    @Default(true) bool isActive,
    @Default(0) int sortOrder,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) = _SocialLink;

  factory SocialLink.fromJson(Map<String, dynamic> json) =>
      _$SocialLinkFromJson(json);
}
