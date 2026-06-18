// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'booking.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Booking _$BookingFromJson(Map<String, dynamic> json) =>
    $checkedCreate('Booking', json, ($checkedConvert) {
      $checkKeys(
        json,
        requiredKeys: const [
          'id',
          'date',
          'endDate',
          'clientName',
          'clientEmail',
          'clientPhone',
          'clientNotes',
          'guestCount',
          'serviceId',
          'adminNotes',
          'totalAmount',
          'paymentStatus',
          'paymentMethod',
          'status',
          'cancellationReason',
          'paidAmount',
          'paymentRef',
          'createdAt',
          'updatedAt',
        ],
      );
      final val = Booking(
        id: $checkedConvert('id', (v) => v as String),
        date: $checkedConvert('date', (v) => v as String),
        endDate: $checkedConvert('endDate', (v) => v as String?),
        clientName: $checkedConvert('clientName', (v) => v as String),
        clientEmail: $checkedConvert('clientEmail', (v) => v as String),
        clientPhone: $checkedConvert('clientPhone', (v) => v as String?),
        clientNotes: $checkedConvert('clientNotes', (v) => v as String?),
        guestCount: $checkedConvert('guestCount', (v) => v as num?),
        serviceId: $checkedConvert('serviceId', (v) => v as String),
        adminNotes: $checkedConvert('adminNotes', (v) => v as String?),
        totalAmount: $checkedConvert('totalAmount', (v) => v as num?),
        paymentStatus: $checkedConvert('paymentStatus', (v) => v as String?),
        paymentMethod: $checkedConvert('paymentMethod', (v) => v as String?),
        status: $checkedConvert(
          'status',
          (v) => $enumDecode(_$BookingStatusEnumEnumMap, v),
        ),
        cancellationReason: $checkedConvert(
          'cancellationReason',
          (v) => v as String?,
        ),
        paidAmount: $checkedConvert('paidAmount', (v) => v as num?),
        paymentRef: $checkedConvert('paymentRef', (v) => v as String?),
        createdAt: $checkedConvert('createdAt', (v) => v as String),
        updatedAt: $checkedConvert('updatedAt', (v) => v as String),
      );
      return val;
    });

Map<String, dynamic> _$BookingToJson(Booking instance) => <String, dynamic>{
  'id': instance.id,
  'date': instance.date,
  'endDate': instance.endDate,
  'clientName': instance.clientName,
  'clientEmail': instance.clientEmail,
  'clientPhone': instance.clientPhone,
  'clientNotes': instance.clientNotes,
  'guestCount': instance.guestCount,
  'serviceId': instance.serviceId,
  'adminNotes': instance.adminNotes,
  'totalAmount': instance.totalAmount,
  'paymentStatus': instance.paymentStatus,
  'paymentMethod': instance.paymentMethod,
  'status': _$BookingStatusEnumEnumMap[instance.status]!,
  'cancellationReason': instance.cancellationReason,
  'paidAmount': instance.paidAmount,
  'paymentRef': instance.paymentRef,
  'createdAt': instance.createdAt,
  'updatedAt': instance.updatedAt,
};

const _$BookingStatusEnumEnumMap = {
  BookingStatusEnum.PENDING: 'PENDING',
  BookingStatusEnum.CONFIRMED: 'CONFIRMED',
  BookingStatusEnum.IN_PROGRESS: 'IN_PROGRESS',
  BookingStatusEnum.CANCELLED: 'CANCELLED',
  BookingStatusEnum.COMPLETED: 'COMPLETED',
  BookingStatusEnum.NO_SHOW: 'NO_SHOW',
};
