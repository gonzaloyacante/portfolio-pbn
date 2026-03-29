// ignore_for_file: invalid_annotation_target
import 'package:freezed_annotation/freezed_annotation.dart';

part 'project_model.freezed.dart';
part 'project_model.g.dart';

// ── ProjectCategory ───────────────────────────────────────────────────────────

@freezed
abstract class ProjectCategory with _$ProjectCategory {
  const factory ProjectCategory({
    required String id,
    required String name,
    required String slug,
  }) = _ProjectCategory;

  factory ProjectCategory.fromJson(Map<String, dynamic> json) =>
      _$ProjectCategoryFromJson(json);
}

// ── ProjectImage ──────────────────────────────────────────────────────────────

@freezed
abstract class ProjectImage with _$ProjectImage {
  const factory ProjectImage({
    required String id,
    @JsonKey(name: 'url') required String imageUrl,
    @JsonKey(name: 'alt') String? altText,
    @JsonKey(name: 'order') @Default(0) int sortOrder,
  }) = _ProjectImage;

  factory ProjectImage.fromJson(Map<String, dynamic> json) =>
      _$ProjectImageFromJson(json);
}

// ── ProjectListItem ───────────────────────────────────────────────────────────

/// Modelo ligero para la lista de proyectos.
@freezed
abstract class ProjectListItem with _$ProjectListItem {
  const factory ProjectListItem({
    required String id,
    required String title,
    required String slug,
    String? excerpt,
    String? thumbnailUrl,
    required String date,
    @Default(0) int sortOrder,
    @Default(false) bool isFeatured,
    @Default(false) bool isPinned,
    @Default(true) bool isActive,
    @Default(0) int viewCount,
    required String createdAt,
    required String updatedAt,
    required ProjectCategory category,
  }) = _ProjectListItem;

  factory ProjectListItem.fromJson(Map<String, dynamic> json) =>
      _$ProjectListItemFromJson(json);
}

// ── ProjectDetail ─────────────────────────────────────────────────────────────

/// Modelo completo para la vista/edición de proyecto.
/// Sincronizado 100% con el schema de Prisma (sin campos SEO — se generan
/// automáticamente en la web pública a partir del title y description).
@freezed
abstract class ProjectDetail with _$ProjectDetail {
  const factory ProjectDetail({
    required String id,
    required String title,
    required String slug,
    required String description,
    String? excerpt,
    String? thumbnailUrl,
    String? videoUrl, // Optional video showcase (future use)
    required String date,
    String? duration,
    String? client,
    required String categoryId,
    @Default(0) int sortOrder,
    @Default(false) bool isFeatured,
    @Default(false) bool isPinned,
    @Default(true) bool isActive,
    @Default(0) int viewCount,
    String? publishedAt,
    required String createdAt,
    required String updatedAt,
    required ProjectCategory category,
    @Default([]) List<ProjectImage> images,
  }) = _ProjectDetail;

  factory ProjectDetail.fromJson(Map<String, dynamic> json) =>
      _$ProjectDetailFromJson(json);
}

// ── ProjectFormData ───────────────────────────────────────────────────────────

/// Datos del formulario de creación/edición.
/// Sincronizado 100% con Prisma y con el formulario de la Web Admin.
class ProjectFormData {
  ProjectFormData({
    this.title = '',
    this.slug = '',
    this.description = '',
    this.excerpt,
    this.thumbnailUrl = '',
    this.videoUrl,
    this.date,
    this.duration,
    this.client,
    this.categoryId = '',
    this.isFeatured = false,
    this.isPinned = false,
    this.isActive = true,
  });

  String title;
  String slug;
  String description;
  String? excerpt;
  String thumbnailUrl;
  String? videoUrl;
  DateTime? date;
  String? duration;
  String? client;
  String categoryId;
  bool isFeatured;
  bool isPinned;
  bool isActive;

  Map<String, dynamic> toJson() => {
    'title': title,
    'slug': slug,
    'description': description,
    'excerpt': excerpt,
    'thumbnailUrl': thumbnailUrl,
    'videoUrl': videoUrl,
    if (date != null) 'date': date!.toIso8601String(),
    'duration': duration,
    'client': client,
    'categoryId': categoryId,
    'isFeatured': isFeatured,
    'isPinned': isPinned,
    'isActive': isActive,
  };
}
