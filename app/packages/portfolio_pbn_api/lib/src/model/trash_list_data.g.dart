// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'trash_list_data.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

TrashListData _$TrashListDataFromJson(Map<String, dynamic> json) =>
    $checkedCreate('TrashListData', json, ($checkedConvert) {
      final val = TrashListData(
        category: $checkedConvert(
          'category',
          (v) => (v as List<dynamic>?)
              ?.map(
                (e) => (e as Map<String, dynamic>).map(
                  (k, e) => MapEntry(k, e as Object),
                ),
              )
              .toList(),
        ),
        service: $checkedConvert(
          'service',
          (v) => (v as List<dynamic>?)
              ?.map(
                (e) => (e as Map<String, dynamic>).map(
                  (k, e) => MapEntry(k, e as Object),
                ),
              )
              .toList(),
        ),
        testimonial: $checkedConvert(
          'testimonial',
          (v) => (v as List<dynamic>?)
              ?.map(
                (e) => (e as Map<String, dynamic>).map(
                  (k, e) => MapEntry(k, e as Object),
                ),
              )
              .toList(),
        ),
        contact: $checkedConvert(
          'contact',
          (v) => (v as List<dynamic>?)
              ?.map(
                (e) => (e as Map<String, dynamic>).map(
                  (k, e) => MapEntry(k, e as Object),
                ),
              )
              .toList(),
        ),
        booking: $checkedConvert(
          'booking',
          (v) => (v as List<dynamic>?)
              ?.map(
                (e) => (e as Map<String, dynamic>).map(
                  (k, e) => MapEntry(k, e as Object),
                ),
              )
              .toList(),
        ),
      );
      return val;
    });

Map<String, dynamic> _$TrashListDataToJson(TrashListData instance) =>
    <String, dynamic>{
      'category': ?instance.category,
      'service': ?instance.service,
      'testimonial': ?instance.testimonial,
      'contact': ?instance.contact,
      'booking': ?instance.booking,
    };
