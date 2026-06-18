// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'toggle_featured_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ToggleFeaturedRequest _$ToggleFeaturedRequestFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('ToggleFeaturedRequest', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['imageId', 'isFeatured']);
  final val = ToggleFeaturedRequest(
    imageId: $checkedConvert('imageId', (v) => v as String),
    isFeatured: $checkedConvert('isFeatured', (v) => v as bool),
  );
  return val;
});

Map<String, dynamic> _$ToggleFeaturedRequestToJson(
  ToggleFeaturedRequest instance,
) => <String, dynamic>{
  'imageId': instance.imageId,
  'isFeatured': instance.isFeatured,
};
