// ignore_for_file: invalid_annotation_target
import 'package:freezed_annotation/freezed_annotation.dart';

part 'service_model.freezed.dart';
part 'service_model.g.dart';

// ── ServiceItem ───────────────────────────────────────────────────────────────

/// Modelo ligero para listas.
@freezed
abstract class ServiceItem with _$ServiceItem {
  const factory ServiceItem({
    required String id,
    required String name,
    required String slug,
    String? shortDesc,
    String? price,
    String? priceLabel,
    @Default('EUR') String currency,
    String? duration,
    String? imageUrl,
    @Default(true) bool isActive,
    @Default(false) bool isFeatured,
    @Default(true) bool isAvailable,
    @Default(0) int sortOrder,
    required String createdAt,
    required String updatedAt,
  }) = _ServiceItem;

  factory ServiceItem.fromJson(Map<String, dynamic> json) =>
      _$ServiceItemFromJson(json);
}

// ── ServiceDetail ─────────────────────────────────────────────────────────────

/// Modelo completo para vista/edición.
@freezed
abstract class ServiceDetail with _$ServiceDetail {
  const factory ServiceDetail({
    required String id,
    required String name,
    required String slug,
    String? description,
    String? shortDesc,
    String? price,
    String? priceLabel,
    @Default('EUR') String currency,
    String? duration,
    int? durationMinutes,
    String? imageUrl,
    @Default(true) bool isActive,
    @Default(false) bool isFeatured,
    @Default(true) bool isAvailable,
    int? maxBookingsPerDay,
    int? advanceNoticeDays,
    @Default(0) int sortOrder,
    String? metaTitle,
    String? metaDescription,
    @Default([]) List<String> metaKeywords,
    String? requirements,
    String? cancellationPolicy,
    required String createdAt,
    required String updatedAt,
  }) = _ServiceDetail;

  factory ServiceDetail.fromJson(Map<String, dynamic> json) =>
      _$ServiceDetailFromJson(json);
}

// ── ServiceFormData ───────────────────────────────────────────────────────────

class ServiceFormData {
  final String name;
  final String slug;
  final String? description;
  final String? shortDesc;
  final String? price;
  final String priceLabel;
  final String currency;
  final String? duration;
  final int? durationMinutes;
  final String? imageUrl;
  final bool isActive;
  final bool isFeatured;
  final bool isAvailable;
  final int? maxBookingsPerDay;
  final int? advanceNoticeDays;
  final String? requirements;
  final String? cancellationPolicy;
  final String? metaTitle;
  final String? metaDescription;
  final String? metaKeywords;

  const ServiceFormData({
    required this.name,
    required this.slug,
    this.description,
    this.shortDesc,
    this.price,
    this.priceLabel = 'desde',
    this.currency = 'EUR',
    this.duration,
    this.durationMinutes,
    this.imageUrl,
    this.isActive = true,
    this.isFeatured = false,
    this.isAvailable = true,
    this.maxBookingsPerDay,
    this.advanceNoticeDays,
    this.requirements,
    this.cancellationPolicy,
    this.metaTitle,
    this.metaDescription,
    this.metaKeywords,
  });

  Map<String, dynamic> toJson() => {
    'name': name,
    'slug': slug,
    if (description != null) 'description': description,
    if (shortDesc != null) 'shortDesc': shortDesc,
    if (price != null) 'price': double.tryParse(price!),
    'priceLabel': priceLabel,
    'currency': currency,
    if (duration != null) 'duration': duration,
    if (durationMinutes != null) 'durationMinutes': durationMinutes,
    if (imageUrl != null) 'imageUrl': imageUrl,
    'isActive': isActive,
    'isFeatured': isFeatured,
    'isAvailable': isAvailable,
    if (maxBookingsPerDay != null) 'maxBookingsPerDay': maxBookingsPerDay,
    if (advanceNoticeDays != null) 'advanceNoticeDays': advanceNoticeDays,
    if (requirements != null) 'requirements': requirements,
    if (cancellationPolicy != null) 'cancellationPolicy': cancellationPolicy,
    if (metaTitle != null) 'metaTitle': metaTitle,
    if (metaDescription != null) 'metaDescription': metaDescription,
    if (metaKeywords != null && metaKeywords!.isNotEmpty)
      'metaKeywords': metaKeywords!
          .split(',')
          .map((e) => e.trim())
          .where((e) => e.isNotEmpty)
          .toList(),
  };
}
