// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_testimonial_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UpdateTestimonialRequest _$UpdateTestimonialRequestFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('UpdateTestimonialRequest', json, ($checkedConvert) {
  final val = UpdateTestimonialRequest(
    name: $checkedConvert('name', (v) => v as String?),
    text: $checkedConvert('text', (v) => v as String?),
    excerpt: $checkedConvert('excerpt', (v) => v as String?),
    position: $checkedConvert('position', (v) => v as String?),
    company: $checkedConvert('company', (v) => v as String?),
    avatarUrl: $checkedConvert('avatarUrl', (v) => v as String?),
    rating: $checkedConvert('rating', (v) => (v as num?)?.toInt()),
    featured: $checkedConvert('featured', (v) => v as bool?),
    status: $checkedConvert('status', (v) => v as String?),
    isActive: $checkedConvert('isActive', (v) => v as bool?),
    sortOrder: $checkedConvert('sortOrder', (v) => (v as num?)?.toInt()),
  );
  return val;
});

Map<String, dynamic> _$UpdateTestimonialRequestToJson(
  UpdateTestimonialRequest instance,
) => <String, dynamic>{
  'name': ?instance.name,
  'text': ?instance.text,
  'excerpt': ?instance.excerpt,
  'position': ?instance.position,
  'company': ?instance.company,
  'avatarUrl': ?instance.avatarUrl,
  'rating': ?instance.rating,
  'featured': ?instance.featured,
  'status': ?instance.status,
  'isActive': ?instance.isActive,
  'sortOrder': ?instance.sortOrder,
};
