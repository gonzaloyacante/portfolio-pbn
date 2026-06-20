// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'delete_gallery_image_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DeleteGalleryImageRequest _$DeleteGalleryImageRequestFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('DeleteGalleryImageRequest', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['imageId']);
  final val = DeleteGalleryImageRequest(
    imageId: $checkedConvert('imageId', (v) => v as String),
  );
  return val;
});

Map<String, dynamic> _$DeleteGalleryImageRequestToJson(
  DeleteGalleryImageRequest instance,
) => <String, dynamic>{'imageId': instance.imageId};
