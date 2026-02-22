// ignore_for_file: invalid_annotation_target
import 'package:freezed_annotation/freezed_annotation.dart';

part 'project_model.freezed.dart';
part 'project_model.g.dart';

// ── ProjectCategory ───────────────────────────────────────────────────────────

@freezed
class ProjectCategory with _$ProjectCategory {
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
class ProjectImage with _$ProjectImage {
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
class ProjectListItem with _$ProjectListItem {
  const factory ProjectListItem({
    required String id,
    required String title,
    required String slug,
    String? excerpt,
    required String thumbnailUrl,
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
@freezed
class ProjectDetail with _$ProjectDetail {
  const factory ProjectDetail({
    required String id,
    required String title,
    required String slug,
    required String description,
    String? excerpt,
    required String thumbnailUrl,
    String? videoUrl,
    required String date,
    String? duration,
    String? client,
    String? location,
    @Default([]) List<String> tags,
    String? metaTitle,
    String? metaDescription,
    @Default([]) List<String> metaKeywords,
    String? ogImage,
    required String categoryId,
    @Default(0) int sortOrder,
    @Default(false) bool isFeatured,
    @Default(false) bool isPinned,
    @Default(true) bool isActive,
    @Default(0) int viewCount,
    @Default(0) int likeCount,
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
    this.location,
    this.tags = const [],
    this.metaTitle,
    this.metaDescription,
    this.categoryId = '',
    this.isFeatured = false,
    this.isPinned = false,
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
  String? location;
  List<String> tags;
  String? metaTitle;
  String? metaDescription;
  String categoryId;
  bool isFeatured;
  bool isPinned;

  Map<String, dynamic> toJson() => {
    'title': title,
    'slug': slug,
    'description': description,
    if (excerpt != null) 'excerpt': excerpt,
    'thumbnailUrl': thumbnailUrl,
    if (videoUrl != null) 'videoUrl': videoUrl,
    if (date != null) 'date': date!.toIso8601String(),
    if (duration != null) 'duration': duration,
    if (client != null) 'client': client,
    if (location != null) 'location': location,
    'tags': tags,
    if (metaTitle != null) 'metaTitle': metaTitle,
    if (metaDescription != null) 'metaDescription': metaDescription,
    'categoryId': categoryId,
    'isFeatured': isFeatured,
    'isPinned': isPinned,
  };
}
