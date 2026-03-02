// ignore_for_file: invalid_annotation_target
import 'package:freezed_annotation/freezed_annotation.dart';

part 'category_model.freezed.dart';
part 'category_model.g.dart';

// ── CategoryModel ─────────────────────────────────────────────────────────────

/// Modelo ligero para listas.
@freezed
abstract class CategoryItem with _$CategoryItem {
  const factory CategoryItem({
    required String id,
    required String name,
    required String slug,
    String? description,
    String? thumbnailUrl,
    String? iconName,
    String? color,
    @Default(0) int sortOrder,
    @Default(true) bool isActive,
    @Default(0) int projectCount,
    @Default(0) int viewCount,
    required String createdAt,
    required String updatedAt,
  }) = _CategoryItem;

  factory CategoryItem.fromJson(Map<String, dynamic> json) =>
      _$CategoryItemFromJson(json);
}

// ── CategoryDetail ────────────────────────────────────────────────────────────

/// Modelo completo para vista/edición.
@freezed
abstract class CategoryDetail with _$CategoryDetail {
  const factory CategoryDetail({
    required String id,
    required String name,
    required String slug,
    String? description,
    String? thumbnailUrl,
    String? coverImageUrl,
    String? iconName,
    String? color,
    String? metaTitle,
    String? metaDescription,
    @Default([]) List<String> metaKeywords,
    String? ogImage,
    @Default(0) int sortOrder,
    @Default(true) bool isActive,
    @Default(0) int projectCount,
    @Default(0) int viewCount,
    required String createdAt,
    required String updatedAt,
  }) = _CategoryDetail;

  factory CategoryDetail.fromJson(Map<String, dynamic> json) =>
      _$CategoryDetailFromJson(json);
}

// ── CategoryFormData ──────────────────────────────────────────────────────────

class CategoryFormData {
  final String name;
  final String slug;
  final String? description;
  final String? thumbnailUrl;
  final String? iconName;
  final String? color;
  final bool isActive;

  const CategoryFormData({
    required this.name,
    required this.slug,
    this.description,
    this.thumbnailUrl,
    this.iconName,
    this.color,
    this.isActive = true,
  });

  Map<String, dynamic> toJson() => {
    'name': name,
    'slug': slug,
    if (description != null) 'description': description,
    if (thumbnailUrl != null) 'thumbnailUrl': thumbnailUrl,
    if (iconName != null) 'iconName': iconName,
    if (color != null) 'color': color,
    'isActive': isActive,
  };
}
