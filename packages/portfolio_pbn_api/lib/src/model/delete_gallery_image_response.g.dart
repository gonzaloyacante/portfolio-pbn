// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'delete_gallery_image_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DeleteGalleryImageResponse _$DeleteGalleryImageResponseFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('DeleteGalleryImageResponse', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['ok']);
  final val = DeleteGalleryImageResponse(
    ok: $checkedConvert('ok', (v) => v as bool),
  );
  return val;
});

Map<String, dynamic> _$DeleteGalleryImageResponseToJson(
  DeleteGalleryImageResponse instance,
) => <String, dynamic>{'ok': instance.ok};
