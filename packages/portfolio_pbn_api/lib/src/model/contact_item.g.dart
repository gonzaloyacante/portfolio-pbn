// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'contact_item.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ContactItem _$ContactItemFromJson(Map<String, dynamic> json) =>
    $checkedCreate('ContactItem', json, ($checkedConvert) {
      $checkKeys(
        json,
        requiredKeys: const [
          'id',
          'name',
          'email',
          'phone',
          'subject',
          'status',
          'priority',
          'isRead',
          'readAt',
          'tags',
          'createdAt',
          'updatedAt',
        ],
      );
      final val = ContactItem(
        id: $checkedConvert('id', (v) => v as String),
        name: $checkedConvert('name', (v) => v as String),
        email: $checkedConvert('email', (v) => v as String),
        phone: $checkedConvert('phone', (v) => v as String?),
        subject: $checkedConvert('subject', (v) => v as String?),
        status: $checkedConvert('status', (v) => v as String),
        priority: $checkedConvert('priority', (v) => v as String),
        isRead: $checkedConvert('isRead', (v) => v as bool),
        readAt: $checkedConvert('readAt', (v) => v as String?),
        tags: $checkedConvert(
          'tags',
          (v) => (v as List<dynamic>).map((e) => e as String).toList(),
        ),
        createdAt: $checkedConvert('createdAt', (v) => v as String),
        updatedAt: $checkedConvert('updatedAt', (v) => v as String),
      );
      return val;
    });

Map<String, dynamic> _$ContactItemToJson(ContactItem instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'email': instance.email,
      'phone': instance.phone,
      'subject': instance.subject,
      'status': instance.status,
      'priority': instance.priority,
      'isRead': instance.isRead,
      'readAt': instance.readAt,
      'tags': instance.tags,
      'createdAt': instance.createdAt,
      'updatedAt': instance.updatedAt,
    };
