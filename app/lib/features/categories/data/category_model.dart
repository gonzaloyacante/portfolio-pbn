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
    String? coverImageUrl,
    @Default(0) int sortOrder,
    @Default(true) bool isActive,
    @Default(0) int projectCount,
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
    String? metaTitle,
    String? metaDescription,
    @Default([]) List<String> metaKeywords,
    String? ogImage,
    @Default(0) int sortOrder,
    @Default(true) bool isActive,
    @Default(0) int projectCount,
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

  /// URL original (alta calidad) subida por el usuario.
  /// El backend genera automáticamente thumbnailUrl a partir de este campo.
  final String? coverImageUrl;
  final bool isActive;

  const CategoryFormData({
    required this.name,
    required this.slug,
    this.description,
    this.coverImageUrl,
    this.isActive = true,
  });

  Map<String, dynamic> toJson() => {
    'name': name,
    'slug': slug,
    'description': description,
    'coverImageUrl': coverImageUrl,
    'isActive': isActive,
  };
}

// ── GalleryImageItem ────────────────────────────────────────────────────────────

/// Imagen de un proyecto que pertenece a la galería de su categoría.
/// El campo [categoryGalleryOrder] es independiente del orden dentro del proyecto.
@freezed
abstract class GalleryImageItem with _$GalleryImageItem {
  const factory GalleryImageItem({
    required String id,
    required String url,
    required String thumbnailUrl,
    String? publicId,
    String? alt,
    String? caption,
    int? width,
    int? height,
    @Default(false) bool isCover,
    @Default(false) bool isHero,
    int? categoryGalleryOrder,
    required String projectId,
    required String projectTitle,
    required String projectSlug,
  }) = _GalleryImageItem;

  factory GalleryImageItem.fromJson(Map<String, dynamic> json) =>
      _$GalleryImageItemFromJson(json);
}
