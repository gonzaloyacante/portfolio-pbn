// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'add_gallery_images_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AddGalleryImagesRequest _$AddGalleryImagesRequestFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('AddGalleryImagesRequest', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['images']);
  final val = AddGalleryImagesRequest(
    images: $checkedConvert(
      'images',
      (v) => (v as List<dynamic>)
          .map(
            (e) => AddGalleryImagesRequestImagesInner.fromJson(
              e as Map<String, dynamic>,
            ),
          )
          .toList(),
    ),
  );
  return val;
});

Map<String, dynamic> _$AddGalleryImagesRequestToJson(
  AddGalleryImagesRequest instance,
) => <String, dynamic>{
  'images': instance.images.map((e) => e.toJson()).toList(),
};
