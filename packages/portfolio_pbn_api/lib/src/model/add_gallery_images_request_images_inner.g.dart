// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'add_gallery_images_request_images_inner.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AddGalleryImagesRequestImagesInner _$AddGalleryImagesRequestImagesInnerFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('AddGalleryImagesRequestImagesInner', json, (
  $checkedConvert,
) {
  $checkKeys(json, requiredKeys: const ['url', 'publicId']);
  final val = AddGalleryImagesRequestImagesInner(
    url: $checkedConvert('url', (v) => v as String),
    publicId: $checkedConvert('publicId', (v) => v as String),
    width: $checkedConvert('width', (v) => v as num?),
    height: $checkedConvert('height', (v) => v as num?),
  );
  return val;
});

Map<String, dynamic> _$AddGalleryImagesRequestImagesInnerToJson(
  AddGalleryImagesRequestImagesInner instance,
) => <String, dynamic>{
  'url': instance.url,
  'publicId': instance.publicId,
  'width': ?instance.width,
  'height': ?instance.height,
};
