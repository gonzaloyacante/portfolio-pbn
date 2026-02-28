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
    @Default('#6c0a0a') String primaryColor,
    @Default('#ffaadd') String secondaryColor,
    @Default('#fff1f9') String accentColor,
    @Default('#fff1f9') String backgroundColor,
    @Default('#000000') String textColor,
    @Default('#ffaadd') String darkPrimaryColor,
    @Default('#6c0a0a') String darkSecondaryColor,
    @Default('#6c0a0a') String darkBackgroundColor,
    @Default('#fff1f9') String darkTextColor,
    @Default('Poppins') String headingFont,
    @Default('Open Sans') String bodyFont,
    @Default('Great Vibes') String scriptFont,
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
    String? heroTitle1Text,
    String? heroTitle2Text,
    String? ownerNameText,
    String? heroMainImageUrl,
    String? heroMainImageAlt,
    String? ctaText,
    String? ctaLink,
    @Default(true) bool showFeaturedProjects,
    String? featuredTitle,
    @Default(3) int featuredCount,
    String? illustrationUrl,
    @Default(true) bool isActive,
  }) = _HomeSettings;

  factory HomeSettings.fromJson(Map<String, dynamic> json) =>
      _$HomeSettingsFromJson(json);
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
