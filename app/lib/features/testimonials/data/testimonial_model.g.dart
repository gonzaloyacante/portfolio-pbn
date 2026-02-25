// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'testimonial_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_TestimonialItem _$TestimonialItemFromJson(Map<String, dynamic> json) =>
    _TestimonialItem(
      id: json['id'] as String,
      name: json['name'] as String,
      excerpt: json['excerpt'] as String?,
      position: json['position'] as String?,
      company: json['company'] as String?,
      avatarUrl: json['avatarUrl'] as String?,
      rating: (json['rating'] as num?)?.toInt() ?? 5,
      verified: json['verified'] as bool? ?? false,
      featured: json['featured'] as bool? ?? false,
      status: json['status'] as String? ?? 'PENDING',
      isActive: json['isActive'] as bool? ?? true,
      sortOrder: (json['sortOrder'] as num?)?.toInt() ?? 0,
      viewCount: (json['viewCount'] as num?)?.toInt() ?? 0,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$TestimonialItemToJson(_TestimonialItem instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'excerpt': instance.excerpt,
      'position': instance.position,
      'company': instance.company,
      'avatarUrl': instance.avatarUrl,
      'rating': instance.rating,
      'verified': instance.verified,
      'featured': instance.featured,
      'status': instance.status,
      'isActive': instance.isActive,
      'sortOrder': instance.sortOrder,
      'viewCount': instance.viewCount,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

_TestimonialDetail _$TestimonialDetailFromJson(Map<String, dynamic> json) =>
    _TestimonialDetail(
      id: json['id'] as String,
      name: json['name'] as String,
      text: json['text'] as String,
      excerpt: json['excerpt'] as String?,
      email: json['email'] as String?,
      phone: json['phone'] as String?,
      position: json['position'] as String?,
      company: json['company'] as String?,
      website: json['website'] as String?,
      avatarUrl: json['avatarUrl'] as String?,
      rating: (json['rating'] as num?)?.toInt() ?? 5,
      verified: json['verified'] as bool? ?? false,
      featured: json['featured'] as bool? ?? false,
      source: json['source'] as String?,
      projectId: json['projectId'] as String?,
      status: json['status'] as String? ?? 'PENDING',
      moderatedBy: json['moderatedBy'] as String?,
      moderatedAt: json['moderatedAt'] == null
          ? null
          : DateTime.parse(json['moderatedAt'] as String),
      isActive: json['isActive'] as bool? ?? true,
      sortOrder: (json['sortOrder'] as num?)?.toInt() ?? 0,
      viewCount: (json['viewCount'] as num?)?.toInt() ?? 0,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$TestimonialDetailToJson(_TestimonialDetail instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'text': instance.text,
      'excerpt': instance.excerpt,
      'email': instance.email,
      'phone': instance.phone,
      'position': instance.position,
      'company': instance.company,
      'website': instance.website,
      'avatarUrl': instance.avatarUrl,
      'rating': instance.rating,
      'verified': instance.verified,
      'featured': instance.featured,
      'source': instance.source,
      'projectId': instance.projectId,
      'status': instance.status,
      'moderatedBy': instance.moderatedBy,
      'moderatedAt': instance.moderatedAt?.toIso8601String(),
      'isActive': instance.isActive,
      'sortOrder': instance.sortOrder,
      'viewCount': instance.viewCount,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
