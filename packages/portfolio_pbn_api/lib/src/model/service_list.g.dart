// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'service_list.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ServiceList _$ServiceListFromJson(Map<String, dynamic> json) =>
    $checkedCreate('ServiceList', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['data', 'pagination']);
      final val = ServiceList(
        data: $checkedConvert(
          'data',
          (v) => (v as List<dynamic>)
              .map((e) => ServiceItem.fromJson(e as Map<String, dynamic>))
              .toList(),
        ),
        pagination: $checkedConvert(
          'pagination',
          (v) => Pagination.fromJson(v as Map<String, dynamic>),
        ),
      );
      return val;
    });

Map<String, dynamic> _$ServiceListToJson(ServiceList instance) =>
    <String, dynamic>{
      'data': instance.data.map((e) => e.toJson()).toList(),
      'pagination': instance.pagination.toJson(),
    };
