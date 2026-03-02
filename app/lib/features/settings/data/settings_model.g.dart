// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'settings_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AboutSettings _$AboutSettingsFromJson(Map<String, dynamic> json) =>
    _AboutSettings(
      id: json['id'] as String?,
      bioTitle: json['bioTitle'] as String?,
      bioIntro: json['bioIntro'] as String?,
      bioDescription: json['bioDescription'] as String?,
      profileImageUrl: json['profileImageUrl'] as String?,
      profileImageAlt: json['profileImageAlt'] as String?,
      profileImageShape: json['profileImageShape'] as String?,
      illustrationUrl: json['illustrationUrl'] as String?,
      illustrationAlt: json['illustrationAlt'] as String?,
      skills:
          (json['skills'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      certifications:
          (json['certifications'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      yearsExperience: (json['yearsExperience'] as num?)?.toInt(),
      isActive: json['isActive'] as bool? ?? true,
    );

Map<String, dynamic> _$AboutSettingsToJson(_AboutSettings instance) =>
    <String, dynamic>{
      'id': instance.id,
      'bioTitle': instance.bioTitle,
      'bioIntro': instance.bioIntro,
      'bioDescription': instance.bioDescription,
      'profileImageUrl': instance.profileImageUrl,
      'profileImageAlt': instance.profileImageAlt,
      'profileImageShape': instance.profileImageShape,
      'illustrationUrl': instance.illustrationUrl,
      'illustrationAlt': instance.illustrationAlt,
      'skills': instance.skills,
      'certifications': instance.certifications,
      'yearsExperience': instance.yearsExperience,
      'isActive': instance.isActive,
    };

_ContactSettings _$ContactSettingsFromJson(Map<String, dynamic> json) =>
    _ContactSettings(
      id: json['id'] as String?,
      pageTitle: json['pageTitle'] as String?,
      ownerName: json['ownerName'] as String?,
      email: json['email'] as String?,
      phone: json['phone'] as String?,
      whatsapp: json['whatsapp'] as String?,
      location: json['location'] as String?,
      formTitle: json['formTitle'] as String?,
      successTitle: json['successTitle'] as String?,
      successMessage: json['successMessage'] as String?,
      showSocialLinks: json['showSocialLinks'] as bool? ?? true,
      isActive: json['isActive'] as bool? ?? true,
    );

Map<String, dynamic> _$ContactSettingsToJson(_ContactSettings instance) =>
    <String, dynamic>{
      'id': instance.id,
      'pageTitle': instance.pageTitle,
      'ownerName': instance.ownerName,
      'email': instance.email,
      'phone': instance.phone,
      'whatsapp': instance.whatsapp,
      'location': instance.location,
      'formTitle': instance.formTitle,
      'successTitle': instance.successTitle,
      'successMessage': instance.successMessage,
      'showSocialLinks': instance.showSocialLinks,
      'isActive': instance.isActive,
    };

_ThemeSettings _$ThemeSettingsFromJson(Map<String, dynamic> json) =>
    _ThemeSettings(
      id: json['id'] as String?,
      primaryColor: json['primaryColor'] as String? ?? '#6c0a0a',
      secondaryColor: json['secondaryColor'] as String? ?? '#ffaadd',
      accentColor: json['accentColor'] as String? ?? '#fff1f9',
      backgroundColor: json['backgroundColor'] as String? ?? '#fff1f9',
      textColor: json['textColor'] as String? ?? '#000000',
      darkPrimaryColor: json['darkPrimaryColor'] as String? ?? '#ffaadd',
      darkSecondaryColor: json['darkSecondaryColor'] as String? ?? '#6c0a0a',
      darkBackgroundColor: json['darkBackgroundColor'] as String? ?? '#6c0a0a',
      darkTextColor: json['darkTextColor'] as String? ?? '#fff1f9',
      headingFont: json['headingFont'] as String? ?? 'Poppins',
      bodyFont: json['bodyFont'] as String? ?? 'Open Sans',
      scriptFont: json['scriptFont'] as String? ?? 'Great Vibes',
      borderRadius: (json['borderRadius'] as num?)?.toInt() ?? 40,
      isActive: json['isActive'] as bool? ?? true,
    );

Map<String, dynamic> _$ThemeSettingsToJson(_ThemeSettings instance) =>
    <String, dynamic>{
      'id': instance.id,
      'primaryColor': instance.primaryColor,
      'secondaryColor': instance.secondaryColor,
      'accentColor': instance.accentColor,
      'backgroundColor': instance.backgroundColor,
      'textColor': instance.textColor,
      'darkPrimaryColor': instance.darkPrimaryColor,
      'darkSecondaryColor': instance.darkSecondaryColor,
      'darkBackgroundColor': instance.darkBackgroundColor,
      'darkTextColor': instance.darkTextColor,
      'headingFont': instance.headingFont,
      'bodyFont': instance.bodyFont,
      'scriptFont': instance.scriptFont,
      'borderRadius': instance.borderRadius,
      'isActive': instance.isActive,
    };

_SiteSettings _$SiteSettingsFromJson(Map<String, dynamic> json) =>
    _SiteSettings(
      id: json['id'] as String?,
      siteName:
          json['siteName'] as String? ??
          'Paola Bolívar Nievas - Make-up Artist',
      siteTagline: json['siteTagline'] as String?,
      logoUrl: json['logoUrl'] as String?,
      defaultMetaTitle: json['defaultMetaTitle'] as String?,
      defaultMetaDescription: json['defaultMetaDescription'] as String?,
      defaultEmail: json['defaultEmail'] as String?,
      defaultPhone: json['defaultPhone'] as String?,
      defaultWhatsapp: json['defaultWhatsapp'] as String?,
      googleAnalyticsId: json['googleAnalyticsId'] as String?,
      maintenanceMode: json['maintenanceMode'] as bool? ?? false,
      maintenanceMessage: json['maintenanceMessage'] as String?,
      showAboutPage: json['showAboutPage'] as bool? ?? true,
      showProjectsPage: json['showProjectsPage'] as bool? ?? true,
      showServicesPage: json['showServicesPage'] as bool? ?? false,
      showContactPage: json['showContactPage'] as bool? ?? true,
      allowIndexing: json['allowIndexing'] as bool? ?? true,
      isActive: json['isActive'] as bool? ?? true,
    );

Map<String, dynamic> _$SiteSettingsToJson(_SiteSettings instance) =>
    <String, dynamic>{
      'id': instance.id,
      'siteName': instance.siteName,
      'siteTagline': instance.siteTagline,
      'logoUrl': instance.logoUrl,
      'defaultMetaTitle': instance.defaultMetaTitle,
      'defaultMetaDescription': instance.defaultMetaDescription,
      'defaultEmail': instance.defaultEmail,
      'defaultPhone': instance.defaultPhone,
      'defaultWhatsapp': instance.defaultWhatsapp,
      'googleAnalyticsId': instance.googleAnalyticsId,
      'maintenanceMode': instance.maintenanceMode,
      'maintenanceMessage': instance.maintenanceMessage,
      'showAboutPage': instance.showAboutPage,
      'showProjectsPage': instance.showProjectsPage,
      'showServicesPage': instance.showServicesPage,
      'showContactPage': instance.showContactPage,
      'allowIndexing': instance.allowIndexing,
      'isActive': instance.isActive,
    };

_HomeSettings _$HomeSettingsFromJson(Map<String, dynamic> json) =>
    _HomeSettings(
      id: json['id'] as String?,
      heroTitle1Text: json['heroTitle1Text'] as String?,
      heroTitle2Text: json['heroTitle2Text'] as String?,
      ownerNameText: json['ownerNameText'] as String?,
      heroMainImageUrl: json['heroMainImageUrl'] as String?,
      heroMainImageAlt: json['heroMainImageAlt'] as String?,
      ctaText: json['ctaText'] as String?,
      ctaLink: json['ctaLink'] as String?,
      showFeaturedProjects: json['showFeaturedProjects'] as bool? ?? true,
      featuredTitle: json['featuredTitle'] as String?,
      featuredCount: (json['featuredCount'] as num?)?.toInt() ?? 3,
      illustrationUrl: json['illustrationUrl'] as String?,
      isActive: json['isActive'] as bool? ?? true,
    );

Map<String, dynamic> _$HomeSettingsToJson(_HomeSettings instance) =>
    <String, dynamic>{
      'id': instance.id,
      'heroTitle1Text': instance.heroTitle1Text,
      'heroTitle2Text': instance.heroTitle2Text,
      'ownerNameText': instance.ownerNameText,
      'heroMainImageUrl': instance.heroMainImageUrl,
      'heroMainImageAlt': instance.heroMainImageAlt,
      'ctaText': instance.ctaText,
      'ctaLink': instance.ctaLink,
      'showFeaturedProjects': instance.showFeaturedProjects,
      'featuredTitle': instance.featuredTitle,
      'featuredCount': instance.featuredCount,
      'illustrationUrl': instance.illustrationUrl,
      'isActive': instance.isActive,
    };

_SocialLink _$SocialLinkFromJson(Map<String, dynamic> json) => _SocialLink(
  id: json['id'] as String,
  platform: json['platform'] as String,
  url: json['url'] as String,
  username: json['username'] as String?,
  icon: json['icon'] as String?,
  isActive: json['isActive'] as bool? ?? true,
  sortOrder: (json['sortOrder'] as num?)?.toInt() ?? 0,
  createdAt: json['createdAt'] == null
      ? null
      : DateTime.parse(json['createdAt'] as String),
  updatedAt: json['updatedAt'] == null
      ? null
      : DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$SocialLinkToJson(_SocialLink instance) =>
    <String, dynamic>{
      'id': instance.id,
      'platform': instance.platform,
      'url': instance.url,
      'username': instance.username,
      'icon': instance.icon,
      'isActive': instance.isActive,
      'sortOrder': instance.sortOrder,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
    };
