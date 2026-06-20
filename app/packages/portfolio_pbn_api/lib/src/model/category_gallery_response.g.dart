// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'category_gallery_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CategoryGalleryResponse _$CategoryGalleryResponseFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('CategoryGalleryResponse', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['images']);
  final val = CategoryGalleryResponse(
    images: $checkedConvert(
      'images',
      (v) => (v as List<dynamic>)
          .map((e) => GalleryImage.fromJson(e as Map<String, dynamic>))
          .toList(),
    ),
  );
  return val;
});

Map<String, dynamic> _$CategoryGalleryResponseToJson(
  CategoryGalleryResponse instance,
) => <String, dynamic>{
  'images': instance.images.map((e) => e.toJson()).toList(),
};
