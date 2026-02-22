// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'contact_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ContactItemImpl _$$ContactItemImplFromJson(Map<String, dynamic> json) =>
    _$ContactItemImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      phone: json['phone'] as String?,
      subject: json['subject'] as String?,
      status: json['status'] as String? ?? 'NEW',
      priority: json['priority'] as String? ?? 'MEDIUM',
      isRead: json['isRead'] as bool? ?? false,
      isReplied: json['isReplied'] as bool? ?? false,
      readAt: json['readAt'] == null
          ? null
          : DateTime.parse(json['readAt'] as String),
      repliedAt: json['repliedAt'] == null
          ? null
          : DateTime.parse(json['repliedAt'] as String),
      leadScore: (json['leadScore'] as num?)?.toInt(),
      leadSource: json['leadSource'] as String?,
      tags:
          (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList() ??
          const [],
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$$ContactItemImplToJson(_$ContactItemImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'email': instance.email,
      'phone': instance.phone,
      'subject': instance.subject,
      'status': instance.status,
      'priority': instance.priority,
      'isRead': instance.isRead,
      'isReplied': instance.isReplied,
      'readAt': instance.readAt?.toIso8601String(),
      'repliedAt': instance.repliedAt?.toIso8601String(),
      'leadScore': instance.leadScore,
      'leadSource': instance.leadSource,
      'tags': instance.tags,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

_$ContactDetailImpl _$$ContactDetailImplFromJson(Map<String, dynamic> json) =>
    _$ContactDetailImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      phone: json['phone'] as String?,
      message: json['message'] as String,
      subject: json['subject'] as String?,
      responsePreference: json['responsePreference'] as String? ?? 'EMAIL',
      leadScore: (json['leadScore'] as num?)?.toInt(),
      leadSource: json['leadSource'] as String?,
      status: json['status'] as String? ?? 'NEW',
      priority: json['priority'] as String? ?? 'MEDIUM',
      assignedTo: json['assignedTo'] as String?,
      isRead: json['isRead'] as bool? ?? false,
      readAt: json['readAt'] == null
          ? null
          : DateTime.parse(json['readAt'] as String),
      readBy: json['readBy'] as String?,
      isReplied: json['isReplied'] as bool? ?? false,
      repliedAt: json['repliedAt'] == null
          ? null
          : DateTime.parse(json['repliedAt'] as String),
      repliedBy: json['repliedBy'] as String?,
      replyText: json['replyText'] as String?,
      adminNote: json['adminNote'] as String?,
      tags:
          (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList() ??
          const [],
      ipAddress: json['ipAddress'] as String?,
      referrer: json['referrer'] as String?,
      utmSource: json['utmSource'] as String?,
      utmMedium: json['utmMedium'] as String?,
      utmCampaign: json['utmCampaign'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$$ContactDetailImplToJson(_$ContactDetailImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'email': instance.email,
      'phone': instance.phone,
      'message': instance.message,
      'subject': instance.subject,
      'responsePreference': instance.responsePreference,
      'leadScore': instance.leadScore,
      'leadSource': instance.leadSource,
      'status': instance.status,
      'priority': instance.priority,
      'assignedTo': instance.assignedTo,
      'isRead': instance.isRead,
      'readAt': instance.readAt?.toIso8601String(),
      'readBy': instance.readBy,
      'isReplied': instance.isReplied,
      'repliedAt': instance.repliedAt?.toIso8601String(),
      'repliedBy': instance.repliedBy,
      'replyText': instance.replyText,
      'adminNote': instance.adminNote,
      'tags': instance.tags,
      'ipAddress': instance.ipAddress,
      'referrer': instance.referrer,
      'utmSource': instance.utmSource,
      'utmMedium': instance.utmMedium,
      'utmCampaign': instance.utmCampaign,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
