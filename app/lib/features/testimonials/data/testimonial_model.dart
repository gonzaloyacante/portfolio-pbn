// ignore_for_file: invalid_annotation_target

import 'package:freezed_annotation/freezed_annotation.dart';

part 'testimonial_model.freezed.dart';
part 'testimonial_model.g.dart';

/// Modelo resumido para listas
@freezed
abstract class TestimonialItem with _$TestimonialItem {
  const factory TestimonialItem({
    required String id,
    required String name,
    String? excerpt,
    String? position,
    String? company,
    String? avatarUrl,
    @Default(5) int rating,
    @Default(false) bool verified,
    @Default(false) bool featured,
    @Default('PENDING') String status,
    @Default(true) bool isActive,
    @Default(0) int sortOrder,
    @Default(0) int viewCount,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _TestimonialItem;

  factory TestimonialItem.fromJson(Map<String, dynamic> json) =>
      _$TestimonialItemFromJson(json);
}

/// Modelo completo para detalle / edición
@freezed
abstract class TestimonialDetail with _$TestimonialDetail {
  const factory TestimonialDetail({
    required String id,
    required String name,
    required String text,
    String? excerpt,
    String? email,
    String? phone,
    String? position,
    String? company,
    String? website,
    String? avatarUrl,
    @Default(5) int rating,
    @Default(false) bool verified,
    @Default(false) bool featured,
    String? source,
    String? projectId,
    @Default('PENDING') String status,
    String? moderatedBy,
    DateTime? moderatedAt,
    @Default(true) bool isActive,
    @Default(0) int sortOrder,
    @Default(0) int viewCount,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _TestimonialDetail;

  factory TestimonialDetail.fromJson(Map<String, dynamic> json) =>
      _$TestimonialDetailFromJson(json);
}

/// DTO para crear / editar testimonio
class TestimonialFormData {
  final String name;
  final String text;
  final String? excerpt;
  final String? email;
  final String? phone;
  final String? position;
  final String? company;
  final String? website;
  final String? avatarUrl;
  final int rating;
  final bool verified;
  final bool featured;
  final String? source;
  final String? projectId;
  final String status;
  final bool isActive;

  const TestimonialFormData({
    required this.name,
    required this.text,
    this.excerpt,
    this.email,
    this.phone,
    this.position,
    this.company,
    this.website,
    this.avatarUrl,
    this.rating = 5,
    this.verified = false,
    this.featured = false,
    this.source,
    this.projectId,
    this.status = 'PENDING',
    this.isActive = true,
  });

  Map<String, dynamic> toJson() => {
    'name': name,
    'text': text,
    if (excerpt != null) 'excerpt': excerpt,
    if (email != null) 'email': email,
    if (phone != null) 'phone': phone,
    if (position != null) 'position': position,
    if (company != null) 'company': company,
    if (website != null) 'website': website,
    if (avatarUrl != null) 'avatarUrl': avatarUrl,
    'rating': rating,
    'verified': verified,
    'featured': featured,
    if (source != null) 'source': source,
    if (projectId != null) 'projectId': projectId,
    'status': status,
    'isActive': isActive,
  };
}
