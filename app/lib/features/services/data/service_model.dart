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
    String? iconName,
    String? color,
    @Default(true) bool isActive,
    @Default(false) bool isFeatured,
    @Default(true) bool isAvailable,
    @Default(0) int sortOrder,
    @Default(0) int bookingCount,
    @Default(0) int viewCount,
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
    String? iconName,
    String? color,
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
    @Default(0) int bookingCount,
    @Default(0) int viewCount,
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
  final String? imageUrl;
  final String? iconName;
  final String? color;
  final bool isActive;
  final bool isFeatured;

  const ServiceFormData({
    required this.name,
    required this.slug,
    this.description,
    this.shortDesc,
    this.price,
    this.priceLabel = 'desde',
    this.currency = 'EUR',
    this.duration,
    this.imageUrl,
    this.iconName,
    this.color,
    this.isActive = true,
    this.isFeatured = false,
  });

  Map<String, dynamic> toJson() => {
    'name': name,
    'slug': slug,
    if (description != null) 'description': description,
    if (shortDesc != null) 'shortDesc': shortDesc,
    if (price != null) 'price': price,
    'priceLabel': priceLabel,
    'currency': currency,
    if (duration != null) 'duration': duration,
    if (imageUrl != null) 'imageUrl': imageUrl,
    if (iconName != null) 'iconName': iconName,
    if (color != null) 'color': color,
    'isActive': isActive,
    'isFeatured': isFeatured,
  };
}
