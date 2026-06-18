// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'reorder_gallery_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReorderGalleryRequest _$ReorderGalleryRequestFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('ReorderGalleryRequest', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['orderedIds']);
  final val = ReorderGalleryRequest(
    orderedIds: $checkedConvert(
      'orderedIds',
      (v) => (v as List<dynamic>).map((e) => e as String).toList(),
    ),
  );
  return val;
});

Map<String, dynamic> _$ReorderGalleryRequestToJson(
  ReorderGalleryRequest instance,
) => <String, dynamic>{'orderedIds': instance.orderedIds};
