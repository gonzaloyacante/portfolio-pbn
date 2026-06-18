// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_contact_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UpdateContactRequest _$UpdateContactRequestFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('UpdateContactRequest', json, ($checkedConvert) {
  final val = UpdateContactRequest(
    status: $checkedConvert('status', (v) => v as String?),
    priority: $checkedConvert('priority', (v) => v as String?),
    isRead: $checkedConvert('isRead', (v) => v as bool?),
    isImportant: $checkedConvert('isImportant', (v) => v as bool?),
    adminNote: $checkedConvert('adminNote', (v) => v as String?),
    tags: $checkedConvert(
      'tags',
      (v) => (v as List<dynamic>?)?.map((e) => e as String).toList(),
    ),
  );
  return val;
});

Map<String, dynamic> _$UpdateContactRequestToJson(
  UpdateContactRequest instance,
) => <String, dynamic>{
  'status': ?instance.status,
  'priority': ?instance.priority,
  'isRead': ?instance.isRead,
  'isImportant': ?instance.isImportant,
  'adminNote': ?instance.adminNote,
  'tags': ?instance.tags,
};
