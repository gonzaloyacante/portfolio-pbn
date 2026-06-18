// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'testimonial_list.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

TestimonialList _$TestimonialListFromJson(Map<String, dynamic> json) =>
    $checkedCreate('TestimonialList', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['data', 'pagination']);
      final val = TestimonialList(
        data: $checkedConvert(
          'data',
          (v) => (v as List<dynamic>)
              .map((e) => TestimonialItem.fromJson(e as Map<String, dynamic>))
              .toList(),
        ),
        pagination: $checkedConvert(
          'pagination',
          (v) => Pagination.fromJson(v as Map<String, dynamic>),
        ),
      );
      return val;
    });

Map<String, dynamic> _$TestimonialListToJson(TestimonialList instance) =>
    <String, dynamic>{
      'data': instance.data.map((e) => e.toJson()).toList(),
      'pagination': instance.pagination.toJson(),
    };
