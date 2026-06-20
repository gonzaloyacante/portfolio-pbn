// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'booking_list.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

BookingList _$BookingListFromJson(Map<String, dynamic> json) =>
    $checkedCreate('BookingList', json, ($checkedConvert) {
      $checkKeys(
        json,
        requiredKeys: const ['items', 'total', 'page', 'totalPages'],
      );
      final val = BookingList(
        items: $checkedConvert(
          'items',
          (v) => (v as List<dynamic>)
              .map((e) => Booking.fromJson(e as Map<String, dynamic>))
              .toList(),
        ),
        total: $checkedConvert('total', (v) => v as num),
        page: $checkedConvert('page', (v) => v as num),
        totalPages: $checkedConvert('totalPages', (v) => v as num),
      );
      return val;
    });

Map<String, dynamic> _$BookingListToJson(BookingList instance) =>
    <String, dynamic>{
      'items': instance.items.map((e) => e.toJson()).toList(),
      'total': instance.total,
      'page': instance.page,
      'totalPages': instance.totalPages,
    };
