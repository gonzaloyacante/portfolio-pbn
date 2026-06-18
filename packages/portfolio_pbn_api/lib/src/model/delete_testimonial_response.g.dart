// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'delete_testimonial_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DeleteTestimonialResponse _$DeleteTestimonialResponseFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('DeleteTestimonialResponse', json, ($checkedConvert) {
  $checkKeys(json, requiredKeys: const ['ok']);
  final val = DeleteTestimonialResponse(
    ok: $checkedConvert('ok', (v) => v as bool),
  );
  return val;
});

Map<String, dynamic> _$DeleteTestimonialResponseToJson(
  DeleteTestimonialResponse instance,
) => <String, dynamic>{'ok': instance.ok};
