// ignore_for_file: invalid_annotation_target

import 'package:freezed_annotation/freezed_annotation.dart';

part 'contact_model.freezed.dart';
part 'contact_model.g.dart';

/// Modelo resumido para listas (campos principales del CRM)
@freezed
class ContactItem with _$ContactItem {
  const factory ContactItem({
    required String id,
    required String name,
    required String email,
    String? phone,
    String? subject,
    @Default('NEW') String status,
    @Default('MEDIUM') String priority,
    @Default(false) bool isRead,
    @Default(false) bool isReplied,
    DateTime? readAt,
    DateTime? repliedAt,
    int? leadScore,
    String? leadSource,
    @Default([]) List<String> tags,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _ContactItem;

  factory ContactItem.fromJson(Map<String, dynamic> json) =>
      _$ContactItemFromJson(json);
}

/// Modelo completo para detalle / gestión
@freezed
class ContactDetail with _$ContactDetail {
  const factory ContactDetail({
    required String id,
    required String name,
    required String email,
    String? phone,
    required String message,
    String? subject,
    @Default('EMAIL') String responsePreference,
    int? leadScore,
    String? leadSource,
    @Default('NEW') String status,
    @Default('MEDIUM') String priority,
    String? assignedTo,
    @Default(false) bool isRead,
    DateTime? readAt,
    String? readBy,
    @Default(false) bool isReplied,
    DateTime? repliedAt,
    String? repliedBy,
    String? replyText,
    String? adminNote,
    @Default([]) List<String> tags,
    String? ipAddress,
    String? referrer,
    String? utmSource,
    String? utmMedium,
    String? utmCampaign,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _ContactDetail;

  factory ContactDetail.fromJson(Map<String, dynamic> json) =>
      _$ContactDetailFromJson(json);
}
