// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'booking_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$BookingServiceImpl _$$BookingServiceImplFromJson(Map<String, dynamic> json) =>
    _$BookingServiceImpl(name: json['name'] as String);

Map<String, dynamic> _$$BookingServiceImplToJson(
  _$BookingServiceImpl instance,
) => <String, dynamic>{'name': instance.name};

_$BookingItemImpl _$$BookingItemImplFromJson(Map<String, dynamic> json) =>
    _$BookingItemImpl(
      id: json['id'] as String,
      date: DateTime.parse(json['date'] as String),
      endDate: json['endDate'] == null
          ? null
          : DateTime.parse(json['endDate'] as String),
      status: json['status'] as String? ?? 'PENDING',
      clientName: json['clientName'] as String,
      clientEmail: json['clientEmail'] as String,
      clientPhone: json['clientPhone'] as String?,
      guestCount: (json['guestCount'] as num?)?.toInt(),
      totalAmount: json['totalAmount'] as String?,
      paymentStatus: json['paymentStatus'] as String?,
      serviceId: json['serviceId'] as String,
      service: json['service'] == null
          ? null
          : BookingService.fromJson(json['service'] as Map<String, dynamic>),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$$BookingItemImplToJson(_$BookingItemImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'date': instance.date.toIso8601String(),
      'endDate': instance.endDate?.toIso8601String(),
      'status': instance.status,
      'clientName': instance.clientName,
      'clientEmail': instance.clientEmail,
      'clientPhone': instance.clientPhone,
      'guestCount': instance.guestCount,
      'totalAmount': instance.totalAmount,
      'paymentStatus': instance.paymentStatus,
      'serviceId': instance.serviceId,
      'service': instance.service,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

_$BookingDetailImpl _$$BookingDetailImplFromJson(Map<String, dynamic> json) =>
    _$BookingDetailImpl(
      id: json['id'] as String,
      date: DateTime.parse(json['date'] as String),
      endDate: json['endDate'] == null
          ? null
          : DateTime.parse(json['endDate'] as String),
      status: json['status'] as String? ?? 'PENDING',
      clientName: json['clientName'] as String,
      clientEmail: json['clientEmail'] as String,
      clientPhone: json['clientPhone'] as String?,
      clientNotes: json['clientNotes'] as String?,
      guestCount: (json['guestCount'] as num?)?.toInt() ?? 1,
      adminNotes: json['adminNotes'] as String?,
      confirmedAt: json['confirmedAt'] == null
          ? null
          : DateTime.parse(json['confirmedAt'] as String),
      confirmedBy: json['confirmedBy'] as String?,
      cancelledAt: json['cancelledAt'] == null
          ? null
          : DateTime.parse(json['cancelledAt'] as String),
      cancelledBy: json['cancelledBy'] as String?,
      cancellationReason: json['cancellationReason'] as String?,
      totalAmount: json['totalAmount'] as String?,
      paidAmount: json['paidAmount'] as String?,
      paymentStatus: json['paymentStatus'] as String?,
      paymentMethod: json['paymentMethod'] as String?,
      paymentRef: json['paymentRef'] as String?,
      reminderSentAt: json['reminderSentAt'] == null
          ? null
          : DateTime.parse(json['reminderSentAt'] as String),
      reminderCount: (json['reminderCount'] as num?)?.toInt() ?? 0,
      feedbackSent: json['feedbackSent'] as bool? ?? false,
      feedbackRating: (json['feedbackRating'] as num?)?.toInt(),
      feedbackText: json['feedbackText'] as String?,
      serviceId: json['serviceId'] as String,
      service: json['service'] == null
          ? null
          : BookingService.fromJson(json['service'] as Map<String, dynamic>),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$$BookingDetailImplToJson(_$BookingDetailImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'date': instance.date.toIso8601String(),
      'endDate': instance.endDate?.toIso8601String(),
      'status': instance.status,
      'clientName': instance.clientName,
      'clientEmail': instance.clientEmail,
      'clientPhone': instance.clientPhone,
      'clientNotes': instance.clientNotes,
      'guestCount': instance.guestCount,
      'adminNotes': instance.adminNotes,
      'confirmedAt': instance.confirmedAt?.toIso8601String(),
      'confirmedBy': instance.confirmedBy,
      'cancelledAt': instance.cancelledAt?.toIso8601String(),
      'cancelledBy': instance.cancelledBy,
      'cancellationReason': instance.cancellationReason,
      'totalAmount': instance.totalAmount,
      'paidAmount': instance.paidAmount,
      'paymentStatus': instance.paymentStatus,
      'paymentMethod': instance.paymentMethod,
      'paymentRef': instance.paymentRef,
      'reminderSentAt': instance.reminderSentAt?.toIso8601String(),
      'reminderCount': instance.reminderCount,
      'feedbackSent': instance.feedbackSent,
      'feedbackRating': instance.feedbackRating,
      'feedbackText': instance.feedbackText,
      'serviceId': instance.serviceId,
      'service': instance.service,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
