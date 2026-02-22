// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'settings_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$AboutSettingsImpl _$$AboutSettingsImplFromJson(Map<String, dynamic> json) =>
    _$AboutSettingsImpl(
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

Map<String, dynamic> _$$AboutSettingsImplToJson(_$AboutSettingsImpl instance) =>
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

_$ContactSettingsImpl _$$ContactSettingsImplFromJson(
  Map<String, dynamic> json,
) => _$ContactSettingsImpl(
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

Map<String, dynamic> _$$ContactSettingsImplToJson(
  _$ContactSettingsImpl instance,
) => <String, dynamic>{
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

_$ThemeSettingsImpl _$$ThemeSettingsImplFromJson(Map<String, dynamic> json) =>
    _$ThemeSettingsImpl(
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

Map<String, dynamic> _$$ThemeSettingsImplToJson(_$ThemeSettingsImpl instance) =>
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

_$SiteSettingsImpl _$$SiteSettingsImplFromJson(Map<String, dynamic> json) =>
    _$SiteSettingsImpl(
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

Map<String, dynamic> _$$SiteSettingsImplToJson(_$SiteSettingsImpl instance) =>
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

_$SocialLinkImpl _$$SocialLinkImplFromJson(Map<String, dynamic> json) =>
    _$SocialLinkImpl(
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

Map<String, dynamic> _$$SocialLinkImplToJson(_$SocialLinkImpl instance) =>
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
