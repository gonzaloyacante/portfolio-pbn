// ignore_for_file: invalid_annotation_target
import 'package:freezed_annotation/freezed_annotation.dart';

part 'service_model.freezed.dart';
part 'service_model.g.dart';

// ── ServicePricingTierItem ────────────────────────────────────────────────────

/// A single pricing tier for a service (relational — replaces JSON blob).
@freezed
abstract class ServicePricingTierItem with _$ServicePricingTierItem {
  const factory ServicePricingTierItem({
    required String id,
    required String name,
    @Default('') String price,
    String? description,
    @Default(0) int sortOrder,
  }) = _ServicePricingTierItem;

  factory ServicePricingTierItem.fromJson(Map<String, dynamic> json) =>
      _$ServicePricingTierItemFromJson(json);
}

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
    String? videoUrl,
    @Default(true) bool isActive,
    @Default(false) bool isFeatured,
    @Default(true) bool isAvailable,
    int? maxBookingsPerDay,
    int? advanceNoticeDays,
    @Default(0) int sortOrder,
    @Default([]) List<ServicePricingTierItem> pricingTiers,
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
  final String? videoUrl;
  final bool isActive;
  final bool isFeatured;
  final bool isAvailable;
  final int? maxBookingsPerDay;
  final int? advanceNoticeDays;
  final List<ServicePricingTierItem> pricingTiers;
  final String? requirements;
  final String? cancellationPolicy;

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
    this.videoUrl,
    this.isActive = true,
    this.isFeatured = false,
    this.isAvailable = true,
    this.maxBookingsPerDay,
    this.advanceNoticeDays,
    this.pricingTiers = const [],
    this.requirements,
    this.cancellationPolicy,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'slug': slug,
      if (description != null) 'description': description,
      if (shortDesc != null) 'shortDesc': shortDesc,
      if (price != null) 'price': price,
      'priceLabel': priceLabel,
      'currency': currency,
      if (duration != null) 'duration': duration,
      if (durationMinutes != null) 'durationMinutes': durationMinutes,
      if (imageUrl != null) 'imageUrl': imageUrl,
      if (videoUrl != null) 'videoUrl': videoUrl,
      'isActive': isActive,
      'isFeatured': isFeatured,
      'isAvailable': isAvailable,
      if (maxBookingsPerDay != null) 'maxBookingsPerDay': maxBookingsPerDay,
      if (advanceNoticeDays != null) 'advanceNoticeDays': advanceNoticeDays,
      'pricingTiers': pricingTiers.map((t) => t.toJson()).toList(),
      if (requirements != null) 'requirements': requirements,
      if (cancellationPolicy != null) 'cancellationPolicy': cancellationPolicy,
    };
  }
}
