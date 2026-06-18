// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'contact_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ContactDetail _$ContactDetailFromJson(Map<String, dynamic> json) =>
    $checkedCreate('ContactDetail', json, ($checkedConvert) {
      $checkKeys(
        json,
        requiredKeys: const [
          'id',
          'name',
          'email',
          'phone',
          'message',
          'subject',
          'responsePreference',
          'instagramUser',
          'status',
          'priority',
          'isRead',
          'readAt',
          'isImportant',
          'adminNote',
          'tags',
          'ipAddress',
          'referrer',
          'utmSource',
          'utmMedium',
          'utmCampaign',
          'createdAt',
          'updatedAt',
        ],
      );
      final val = ContactDetail(
        id: $checkedConvert('id', (v) => v as String),
        name: $checkedConvert('name', (v) => v as String),
        email: $checkedConvert('email', (v) => v as String),
        phone: $checkedConvert('phone', (v) => v as String?),
        message: $checkedConvert('message', (v) => v as String),
        subject: $checkedConvert('subject', (v) => v as String?),
        responsePreference: $checkedConvert(
          'responsePreference',
          (v) => v as String,
        ),
        instagramUser: $checkedConvert('instagramUser', (v) => v as String?),
        status: $checkedConvert('status', (v) => v as String),
        priority: $checkedConvert('priority', (v) => v as String),
        isRead: $checkedConvert('isRead', (v) => v as bool),
        readAt: $checkedConvert('readAt', (v) => v as String?),
        isImportant: $checkedConvert('isImportant', (v) => v as bool),
        adminNote: $checkedConvert('adminNote', (v) => v as String?),
        tags: $checkedConvert(
          'tags',
          (v) => (v as List<dynamic>).map((e) => e as String).toList(),
        ),
        ipAddress: $checkedConvert('ipAddress', (v) => v as String?),
        referrer: $checkedConvert('referrer', (v) => v as String?),
        utmSource: $checkedConvert('utmSource', (v) => v as String?),
        utmMedium: $checkedConvert('utmMedium', (v) => v as String?),
        utmCampaign: $checkedConvert('utmCampaign', (v) => v as String?),
        createdAt: $checkedConvert('createdAt', (v) => v as String),
        updatedAt: $checkedConvert('updatedAt', (v) => v as String),
      );
      return val;
    });

Map<String, dynamic> _$ContactDetailToJson(ContactDetail instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'email': instance.email,
      'phone': instance.phone,
      'message': instance.message,
      'subject': instance.subject,
      'responsePreference': instance.responsePreference,
      'instagramUser': instance.instagramUser,
      'status': instance.status,
      'priority': instance.priority,
      'isRead': instance.isRead,
      'readAt': instance.readAt,
      'isImportant': instance.isImportant,
      'adminNote': instance.adminNote,
      'tags': instance.tags,
      'ipAddress': instance.ipAddress,
      'referrer': instance.referrer,
      'utmSource': instance.utmSource,
      'utmMedium': instance.utmMedium,
      'utmCampaign': instance.utmCampaign,
      'createdAt': instance.createdAt,
      'updatedAt': instance.updatedAt,
    };
