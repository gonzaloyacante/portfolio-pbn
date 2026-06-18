// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_booking_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UpdateBookingRequest _$UpdateBookingRequestFromJson(
  Map<String, dynamic> json,
) => $checkedCreate('UpdateBookingRequest', json, ($checkedConvert) {
  final val = UpdateBookingRequest(
    date: $checkedConvert('date', (v) => v as String?),
    endDate: $checkedConvert('endDate', (v) => v as String?),
    clientName: $checkedConvert('clientName', (v) => v as String?),
    clientEmail: $checkedConvert('clientEmail', (v) => v as String?),
    clientPhone: $checkedConvert('clientPhone', (v) => v as String?),
    clientNotes: $checkedConvert('clientNotes', (v) => v as String?),
    guestCount: $checkedConvert('guestCount', (v) => v as num?),
    serviceId: $checkedConvert('serviceId', (v) => v as String?),
    adminNotes: $checkedConvert('adminNotes', (v) => v as String?),
    totalAmount: $checkedConvert('totalAmount', (v) => v as num?),
    paymentStatus: $checkedConvert('paymentStatus', (v) => v as String?),
    paymentMethod: $checkedConvert('paymentMethod', (v) => v as String?),
    status: $checkedConvert(
      'status',
      (v) => $enumDecodeNullable(_$UpdateBookingRequestStatusEnumEnumMap, v),
    ),
    cancellationReason: $checkedConvert(
      'cancellationReason',
      (v) => v as String?,
    ),
    paidAmount: $checkedConvert('paidAmount', (v) => v as num?),
    paymentRef: $checkedConvert('paymentRef', (v) => v as String?),
  );
  return val;
});

Map<String, dynamic> _$UpdateBookingRequestToJson(
  UpdateBookingRequest instance,
) => <String, dynamic>{
  'date': ?instance.date,
  'endDate': ?instance.endDate,
  'clientName': ?instance.clientName,
  'clientEmail': ?instance.clientEmail,
  'clientPhone': ?instance.clientPhone,
  'clientNotes': ?instance.clientNotes,
  'guestCount': ?instance.guestCount,
  'serviceId': ?instance.serviceId,
  'adminNotes': ?instance.adminNotes,
  'totalAmount': ?instance.totalAmount,
  'paymentStatus': ?instance.paymentStatus,
  'paymentMethod': ?instance.paymentMethod,
  'status': ?_$UpdateBookingRequestStatusEnumEnumMap[instance.status],
  'cancellationReason': ?instance.cancellationReason,
  'paidAmount': ?instance.paidAmount,
  'paymentRef': ?instance.paymentRef,
};

const _$UpdateBookingRequestStatusEnumEnumMap = {
  UpdateBookingRequestStatusEnum.PENDING: 'PENDING',
  UpdateBookingRequestStatusEnum.CONFIRMED: 'CONFIRMED',
  UpdateBookingRequestStatusEnum.IN_PROGRESS: 'IN_PROGRESS',
  UpdateBookingRequestStatusEnum.CANCELLED: 'CANCELLED',
  UpdateBookingRequestStatusEnum.COMPLETED: 'COMPLETED',
  UpdateBookingRequestStatusEnum.NO_SHOW: 'NO_SHOW',
};
