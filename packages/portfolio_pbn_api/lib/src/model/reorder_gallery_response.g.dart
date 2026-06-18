// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'reorder_gallery_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReorderGalleryResponse _$ReorderGalleryResponseFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('ReorderGalleryResponse', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['ok']);
  final val = ReorderGalleryResponse(
    ok: $checkedConvert('ok', (v) => v as bool),
  );
  return val;
});

Map<String, dynamic> _$ReorderGalleryResponseToJson(
  ReorderGalleryResponse instance,
) => <String, dynamic>{'ok': instance.ok};
