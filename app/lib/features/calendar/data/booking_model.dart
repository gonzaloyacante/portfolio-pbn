// ignore_for_file: invalid_annotation_target

import 'package:freezed_annotation/freezed_annotation.dart';

part 'booking_model.freezed.dart';
part 'booking_model.g.dart';

/// Modelo resumido del servicio embebido
@freezed
class BookingService with _$BookingService {
  const factory BookingService({required String name}) = _BookingService;

  factory BookingService.fromJson(Map<String, dynamic> json) =>
      _$BookingServiceFromJson(json);
}

/// Modelo resumido para listas y calendario
@freezed
class BookingItem with _$BookingItem {
  const factory BookingItem({
    required String id,
    required DateTime date,
    DateTime? endDate,
    @Default('PENDING') String status,
    required String clientName,
    required String clientEmail,
    String? clientPhone,
    int? guestCount,
    String? totalAmount,
    String? paymentStatus,
    required String serviceId,
    BookingService? service,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _BookingItem;

  factory BookingItem.fromJson(Map<String, dynamic> json) =>
      _$BookingItemFromJson(json);
}

/// Modelo completo para detalle / gestión
@freezed
class BookingDetail with _$BookingDetail {
  const factory BookingDetail({
    required String id,
    required DateTime date,
    DateTime? endDate,
    @Default('PENDING') String status,
    required String clientName,
    required String clientEmail,
    String? clientPhone,
    String? clientNotes,
    @Default(1) int guestCount,
    String? adminNotes,
    DateTime? confirmedAt,
    String? confirmedBy,
    DateTime? cancelledAt,
    String? cancelledBy,
    String? cancellationReason,
    String? totalAmount,
    String? paidAmount,
    String? paymentStatus,
    String? paymentMethod,
    String? paymentRef,
    DateTime? reminderSentAt,
    @Default(0) int reminderCount,
    @Default(false) bool feedbackSent,
    int? feedbackRating,
    String? feedbackText,
    required String serviceId,
    BookingService? service,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _BookingDetail;

  factory BookingDetail.fromJson(Map<String, dynamic> json) =>
      _$BookingDetailFromJson(json);
}

/// DTO para crear / editar una reserva
class BookingFormData {
  final DateTime date;
  final DateTime? endDate;
  final String clientName;
  final String clientEmail;
  final String? clientPhone;
  final String? clientNotes;
  final int guestCount;
  final String serviceId;
  final String? adminNotes;
  final String status;
  final String? totalAmount;
  final String? paymentMethod;

  const BookingFormData({
    required this.date,
    this.endDate,
    required this.clientName,
    required this.clientEmail,
    this.clientPhone,
    this.clientNotes,
    this.guestCount = 1,
    required this.serviceId,
    this.adminNotes,
    this.status = 'PENDING',
    this.totalAmount,
    this.paymentMethod,
  });

  Map<String, dynamic> toJson() => {
    'date': date.toIso8601String(),
    if (endDate != null) 'endDate': endDate!.toIso8601String(),
    'clientName': clientName,
    'clientEmail': clientEmail,
    if (clientPhone != null) 'clientPhone': clientPhone,
    if (clientNotes != null) 'clientNotes': clientNotes,
    'guestCount': guestCount,
    'serviceId': serviceId,
    if (adminNotes != null) 'adminNotes': adminNotes,
    'status': status,
    if (totalAmount != null) 'totalAmount': totalAmount,
    if (paymentMethod != null) 'paymentMethod': paymentMethod,
  };
}
