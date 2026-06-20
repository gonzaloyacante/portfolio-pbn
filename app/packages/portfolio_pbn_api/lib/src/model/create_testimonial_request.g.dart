// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_testimonial_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CreateTestimonialRequest _$CreateTestimonialRequestFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('CreateTestimonialRequest', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['name', 'text']);
  final val = CreateTestimonialRequest(
    name: $checkedConvert('name', (v) => v as String),
    text: $checkedConvert('text', (v) => v as String),
    excerpt: $checkedConvert('excerpt', (v) => v as String?),
    position: $checkedConvert('position', (v) => v as String?),
    company: $checkedConvert('company', (v) => v as String?),
    avatarUrl: $checkedConvert('avatarUrl', (v) => v as String?),
    rating: $checkedConvert('rating', (v) => (v as num?)?.toInt()),
    featured: $checkedConvert('featured', (v) => v as bool?),
    status: $checkedConvert('status', (v) => v as String?),
  );
  return val;
});

Map<String, dynamic> _$CreateTestimonialRequestToJson(
  CreateTestimonialRequest instance,
) => <String, dynamic>{
  'name': instance.name,
  'text': instance.text,
  'excerpt': ?instance.excerpt,
  'position': ?instance.position,
  'company': ?instance.company,
  'avatarUrl': ?instance.avatarUrl,
  'rating': ?instance.rating,
  'featured': ?instance.featured,
  'status': ?instance.status,
};
