// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'contact_list.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ContactList _$ContactListFromJson(Map<String, dynamic> json) =>
    $checkedCreate('ContactList', json, ($checkedConvert) {
      $checkKeys(json, requiredKeys: const ['data', 'pagination']);
      final val = ContactList(
        data: $checkedConvert(
          'data',
          (v) => (v as List<dynamic>)
              .map((e) => ContactItem.fromJson(e as Map<String, dynamic>))
              .toList(),
        ),
        pagination: $checkedConvert(
          'pagination',
          (v) => Pagination.fromJson(v as Map<String, dynamic>),
        ),
      );
      return val;
    });

Map<String, dynamic> _$ContactListToJson(ContactList instance) =>
    <String, dynamic>{
      'data': instance.data.map((e) => e.toJson()).toList(),
      'pagination': instance.pagination.toJson(),
    };
