// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'add_gallery_images_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AddGalleryImagesResponse _$AddGalleryImagesResponseFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('AddGalleryImagesResponse', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['images']);
  final val = AddGalleryImagesResponse(
    images: $checkedConvert(
      'images',
      (v) => (v as List<dynamic>)
          .map((e) => GalleryImage.fromJson(e as Map<String, dynamic>))
          .toList(),
    ),
  );
  return val;
});

Map<String, dynamic> _$AddGalleryImagesResponseToJson(
  AddGalleryImagesResponse instance,
) => <String, dynamic>{
  'images': instance.images.map((e) => e.toJson()).toList(),
};
