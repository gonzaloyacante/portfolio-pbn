// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'pagination.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Pagination _$PaginationFromJson(Map<String, dynamic> json) =>
    $checkedCreate('Pagination', json, ($checkedConvert) {
      $checkKeys(
        json,
        requiredKeys: const ['total', 'page', 'limit', 'totalPages'],
      );
      final val = Pagination(
        total: $checkedConvert('total', (v) => v as num),
        page: $checkedConvert('page', (v) => v as num),
        limit: $checkedConvert('limit', (v) => v as num),
        totalPages: $checkedConvert('totalPages', (v) => v as num),
      );
      return val;
    });

Map<String, dynamic> _$PaginationToJson(Pagination instance) =>
    <String, dynamic>{
      'total': instance.total,
      'page': instance.page,
      'limit': instance.limit,
      'totalPages': instance.totalPages,
    };
