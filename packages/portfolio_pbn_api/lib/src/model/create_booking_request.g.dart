// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_booking_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CreateBookingRequest _$CreateBookingRequestFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('CreateBookingRequest', json, ($checkedConvert) {
  $checkKeys(
    json,
    requiredKeys: const ['date', 'clientName', 'clientEmail', 'serviceId'],
  );
  final val = CreateBookingRequest(
    date: $checkedConvert('date', (v) => v as String),
    endDate: $checkedConvert('endDate', (v) => v as String?),
    clientName: $checkedConvert('clientName', (v) => v as String),
    clientEmail: $checkedConvert('clientEmail', (v) => v as String),
    clientPhone: $checkedConvert('clientPhone', (v) => v as String?),
    clientNotes: $checkedConvert('clientNotes', (v) => v as String?),
    guestCount: $checkedConvert('guestCount', (v) => (v as num?)?.toInt()),
    serviceId: $checkedConvert('serviceId', (v) => v as String),
    adminNotes: $checkedConvert('adminNotes', (v) => v as String?),
    totalAmount: $checkedConvert('totalAmount', (v) => v as num?),
    paymentStatus: $checkedConvert('paymentStatus', (v) => v as String?),
    paymentMethod: $checkedConvert('paymentMethod', (v) => v as String?),
    status: $checkedConvert(
      'status',
      (v) => $enumDecodeNullable(_$CreateBookingRequestStatusEnumEnumMap, v),
    ),
  );
  return val;
});

Map<String, dynamic> _$CreateBookingRequestToJson(
  CreateBookingRequest instance,
) => <String, dynamic>{
  'date': instance.date,
  'endDate': ?instance.endDate,
  'clientName': instance.clientName,
  'clientEmail': instance.clientEmail,
  'clientPhone': ?instance.clientPhone,
  'clientNotes': ?instance.clientNotes,
  'guestCount': ?instance.guestCount,
  'serviceId': instance.serviceId,
  'adminNotes': ?instance.adminNotes,
  'totalAmount': ?instance.totalAmount,
  'paymentStatus': ?instance.paymentStatus,
  'paymentMethod': ?instance.paymentMethod,
  'status': ?_$CreateBookingRequestStatusEnumEnumMap[instance.status],
};

const _$CreateBookingRequestStatusEnumEnumMap = {
  CreateBookingRequestStatusEnum.PENDING: 'PENDING',
  CreateBookingRequestStatusEnum.CONFIRMED: 'CONFIRMED',
  CreateBookingRequestStatusEnum.IN_PROGRESS: 'IN_PROGRESS',
  CreateBookingRequestStatusEnum.CANCELLED: 'CANCELLED',
  CreateBookingRequestStatusEnum.COMPLETED: 'COMPLETED',
  CreateBookingRequestStatusEnum.NO_SHOW: 'NO_SHOW',
};
