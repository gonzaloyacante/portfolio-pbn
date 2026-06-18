// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'testimonial_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

TestimonialDetail _$TestimonialDetailFromJson(Map<String, dynamic> json) =>
    $checkedCreate('TestimonialDetail', json, ($checkedConvert) {
      $checkKeys(
        json,
        requiredKeys: const [
          'id',
          'name',
          'text',
          'excerpt',
          'email',
          'phone',
          'position',
          'company',
          'avatarUrl',
          'rating',
          'verified',
          'featured',
          'status',
          'isActive',
          'sortOrder',
          'createdAt',
          'updatedAt',
        ],
      );
      final val = TestimonialDetail(
        id: $checkedConvert('id', (v) => v as String),
        name: $checkedConvert('name', (v) => v as String),
        text: $checkedConvert('text', (v) => v as String),
        excerpt: $checkedConvert('excerpt', (v) => v as String?),
        email: $checkedConvert('email', (v) => v as String?),
        phone: $checkedConvert('phone', (v) => v as String?),
        position: $checkedConvert('position', (v) => v as String?),
        company: $checkedConvert('company', (v) => v as String?),
        avatarUrl: $checkedConvert('avatarUrl', (v) => v as String?),
        rating: $checkedConvert('rating', (v) => v as num),
        verified: $checkedConvert('verified', (v) => v as bool),
        featured: $checkedConvert('featured', (v) => v as bool),
        status: $checkedConvert('status', (v) => v as String),
        isActive: $checkedConvert('isActive', (v) => v as bool),
        sortOrder: $checkedConvert('sortOrder', (v) => v as num),
        createdAt: $checkedConvert('createdAt', (v) => v as String),
        updatedAt: $checkedConvert('updatedAt', (v) => v as String),
      );
      return val;
    });

Map<String, dynamic> _$TestimonialDetailToJson(TestimonialDetail instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'text': instance.text,
      'excerpt': instance.excerpt,
      'email': instance.email,
      'phone': instance.phone,
      'position': instance.position,
      'company': instance.company,
      'avatarUrl': instance.avatarUrl,
      'rating': instance.rating,
      'verified': instance.verified,
      'featured': instance.featured,
      'status': instance.status,
      'isActive': instance.isActive,
      'sortOrder': instance.sortOrder,
      'createdAt': instance.createdAt,
      'updatedAt': instance.updatedAt,
    };
