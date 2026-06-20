// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'trash_list.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

TrashList _$TrashListFromJson(Map<String, dynamic> json) =>
    $checkedCreate('TrashList', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['data', 'total']);
      final val = TrashList(
        data: $checkedConvert(
          'data',
          (v) => TrashListData.fromJson(v as Map<String, dynamic>),
        ),
        total: $checkedConvert('total', (v) => v as num),
      );
      return val;
    });

Map<String, dynamic> _$TrashListToJson(TrashList instance) => <String, dynamic>{
  'data': instance.data.toJson(),
  'total': instance.total,
};
