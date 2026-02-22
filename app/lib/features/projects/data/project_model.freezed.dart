// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'project_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

ProjectCategory _$ProjectCategoryFromJson(Map<String, dynamic> json) {
  return _ProjectCategory.fromJson(json);
}

/// @nodoc
mixin _$ProjectCategory {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get slug => throw _privateConstructorUsedError;

  /// Serializes this ProjectCategory to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ProjectCategory
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ProjectCategoryCopyWith<ProjectCategory> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ProjectCategoryCopyWith<$Res> {
  factory $ProjectCategoryCopyWith(
    ProjectCategory value,
    $Res Function(ProjectCategory) then,
  ) = _$ProjectCategoryCopyWithImpl<$Res, ProjectCategory>;
  @useResult
  $Res call({String id, String name, String slug});
}

/// @nodoc
class _$ProjectCategoryCopyWithImpl<$Res, $Val extends ProjectCategory>
    implements $ProjectCategoryCopyWith<$Res> {
  _$ProjectCategoryCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ProjectCategory
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? id = null, Object? name = null, Object? slug = null}) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            name: null == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String,
            slug: null == slug
                ? _value.slug
                : slug // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$ProjectCategoryImplCopyWith<$Res>
    implements $ProjectCategoryCopyWith<$Res> {
  factory _$$ProjectCategoryImplCopyWith(
    _$ProjectCategoryImpl value,
    $Res Function(_$ProjectCategoryImpl) then,
  ) = __$$ProjectCategoryImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String id, String name, String slug});
}

/// @nodoc
class __$$ProjectCategoryImplCopyWithImpl<$Res>
    extends _$ProjectCategoryCopyWithImpl<$Res, _$ProjectCategoryImpl>
    implements _$$ProjectCategoryImplCopyWith<$Res> {
  __$$ProjectCategoryImplCopyWithImpl(
    _$ProjectCategoryImpl _value,
    $Res Function(_$ProjectCategoryImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ProjectCategory
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? id = null, Object? name = null, Object? slug = null}) {
    return _then(
      _$ProjectCategoryImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        name: null == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String,
        slug: null == slug
            ? _value.slug
            : slug // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ProjectCategoryImpl implements _ProjectCategory {
  const _$ProjectCategoryImpl({
    required this.id,
    required this.name,
    required this.slug,
  });

  factory _$ProjectCategoryImpl.fromJson(Map<String, dynamic> json) =>
      _$$ProjectCategoryImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String slug;

  @override
  String toString() {
    return 'ProjectCategory(id: $id, name: $name, slug: $slug)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ProjectCategoryImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.slug, slug) || other.slug == slug));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, name, slug);

  /// Create a copy of ProjectCategory
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ProjectCategoryImplCopyWith<_$ProjectCategoryImpl> get copyWith =>
      __$$ProjectCategoryImplCopyWithImpl<_$ProjectCategoryImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$ProjectCategoryImplToJson(this);
  }
}

abstract class _ProjectCategory implements ProjectCategory {
  const factory _ProjectCategory({
    required final String id,
    required final String name,
    required final String slug,
  }) = _$ProjectCategoryImpl;

  factory _ProjectCategory.fromJson(Map<String, dynamic> json) =
      _$ProjectCategoryImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get slug;

  /// Create a copy of ProjectCategory
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ProjectCategoryImplCopyWith<_$ProjectCategoryImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

ProjectImage _$ProjectImageFromJson(Map<String, dynamic> json) {
  return _ProjectImage.fromJson(json);
}

/// @nodoc
mixin _$ProjectImage {
  String get id => throw _privateConstructorUsedError;
  @JsonKey(name: 'url')
  String get imageUrl => throw _privateConstructorUsedError;
  @JsonKey(name: 'alt')
  String? get altText => throw _privateConstructorUsedError;
  @JsonKey(name: 'order')
  int get sortOrder => throw _privateConstructorUsedError;

  /// Serializes this ProjectImage to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ProjectImage
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ProjectImageCopyWith<ProjectImage> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ProjectImageCopyWith<$Res> {
  factory $ProjectImageCopyWith(
    ProjectImage value,
    $Res Function(ProjectImage) then,
  ) = _$ProjectImageCopyWithImpl<$Res, ProjectImage>;
  @useResult
  $Res call({
    String id,
    @JsonKey(name: 'url') String imageUrl,
    @JsonKey(name: 'alt') String? altText,
    @JsonKey(name: 'order') int sortOrder,
  });
}

/// @nodoc
class _$ProjectImageCopyWithImpl<$Res, $Val extends ProjectImage>
    implements $ProjectImageCopyWith<$Res> {
  _$ProjectImageCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ProjectImage
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? imageUrl = null,
    Object? altText = freezed,
    Object? sortOrder = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            imageUrl: null == imageUrl
                ? _value.imageUrl
                : imageUrl // ignore: cast_nullable_to_non_nullable
                      as String,
            altText: freezed == altText
                ? _value.altText
                : altText // ignore: cast_nullable_to_non_nullable
                      as String?,
            sortOrder: null == sortOrder
                ? _value.sortOrder
                : sortOrder // ignore: cast_nullable_to_non_nullable
                      as int,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$ProjectImageImplCopyWith<$Res>
    implements $ProjectImageCopyWith<$Res> {
  factory _$$ProjectImageImplCopyWith(
    _$ProjectImageImpl value,
    $Res Function(_$ProjectImageImpl) then,
  ) = __$$ProjectImageImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    @JsonKey(name: 'url') String imageUrl,
    @JsonKey(name: 'alt') String? altText,
    @JsonKey(name: 'order') int sortOrder,
  });
}

/// @nodoc
class __$$ProjectImageImplCopyWithImpl<$Res>
    extends _$ProjectImageCopyWithImpl<$Res, _$ProjectImageImpl>
    implements _$$ProjectImageImplCopyWith<$Res> {
  __$$ProjectImageImplCopyWithImpl(
    _$ProjectImageImpl _value,
    $Res Function(_$ProjectImageImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ProjectImage
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? imageUrl = null,
    Object? altText = freezed,
    Object? sortOrder = null,
  }) {
    return _then(
      _$ProjectImageImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        imageUrl: null == imageUrl
            ? _value.imageUrl
            : imageUrl // ignore: cast_nullable_to_non_nullable
                  as String,
        altText: freezed == altText
            ? _value.altText
            : altText // ignore: cast_nullable_to_non_nullable
                  as String?,
        sortOrder: null == sortOrder
            ? _value.sortOrder
            : sortOrder // ignore: cast_nullable_to_non_nullable
                  as int,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ProjectImageImpl implements _ProjectImage {
  const _$ProjectImageImpl({
    required this.id,
    @JsonKey(name: 'url') required this.imageUrl,
    @JsonKey(name: 'alt') this.altText,
    @JsonKey(name: 'order') this.sortOrder = 0,
  });

  factory _$ProjectImageImpl.fromJson(Map<String, dynamic> json) =>
      _$$ProjectImageImplFromJson(json);

  @override
  final String id;
  @override
  @JsonKey(name: 'url')
  final String imageUrl;
  @override
  @JsonKey(name: 'alt')
  final String? altText;
  @override
  @JsonKey(name: 'order')
  final int sortOrder;

  @override
  String toString() {
    return 'ProjectImage(id: $id, imageUrl: $imageUrl, altText: $altText, sortOrder: $sortOrder)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ProjectImageImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.imageUrl, imageUrl) ||
                other.imageUrl == imageUrl) &&
            (identical(other.altText, altText) || other.altText == altText) &&
            (identical(other.sortOrder, sortOrder) ||
                other.sortOrder == sortOrder));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, id, imageUrl, altText, sortOrder);

  /// Create a copy of ProjectImage
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ProjectImageImplCopyWith<_$ProjectImageImpl> get copyWith =>
      __$$ProjectImageImplCopyWithImpl<_$ProjectImageImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ProjectImageImplToJson(this);
  }
}

abstract class _ProjectImage implements ProjectImage {
  const factory _ProjectImage({
    required final String id,
    @JsonKey(name: 'url') required final String imageUrl,
    @JsonKey(name: 'alt') final String? altText,
    @JsonKey(name: 'order') final int sortOrder,
  }) = _$ProjectImageImpl;

  factory _ProjectImage.fromJson(Map<String, dynamic> json) =
      _$ProjectImageImpl.fromJson;

  @override
  String get id;
  @override
  @JsonKey(name: 'url')
  String get imageUrl;
  @override
  @JsonKey(name: 'alt')
  String? get altText;
  @override
  @JsonKey(name: 'order')
  int get sortOrder;

  /// Create a copy of ProjectImage
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ProjectImageImplCopyWith<_$ProjectImageImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

ProjectListItem _$ProjectListItemFromJson(Map<String, dynamic> json) {
  return _ProjectListItem.fromJson(json);
}

/// @nodoc
mixin _$ProjectListItem {
  String get id => throw _privateConstructorUsedError;
  String get title => throw _privateConstructorUsedError;
  String get slug => throw _privateConstructorUsedError;
  String? get excerpt => throw _privateConstructorUsedError;
  String get thumbnailUrl => throw _privateConstructorUsedError;
  String get date => throw _privateConstructorUsedError;
  int get sortOrder => throw _privateConstructorUsedError;
  bool get isFeatured => throw _privateConstructorUsedError;
  bool get isPinned => throw _privateConstructorUsedError;
  bool get isActive => throw _privateConstructorUsedError;
  int get viewCount => throw _privateConstructorUsedError;
  String get createdAt => throw _privateConstructorUsedError;
  String get updatedAt => throw _privateConstructorUsedError;
  ProjectCategory get category => throw _privateConstructorUsedError;

  /// Serializes this ProjectListItem to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ProjectListItem
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ProjectListItemCopyWith<ProjectListItem> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ProjectListItemCopyWith<$Res> {
  factory $ProjectListItemCopyWith(
    ProjectListItem value,
    $Res Function(ProjectListItem) then,
  ) = _$ProjectListItemCopyWithImpl<$Res, ProjectListItem>;
  @useResult
  $Res call({
    String id,
    String title,
    String slug,
    String? excerpt,
    String thumbnailUrl,
    String date,
    int sortOrder,
    bool isFeatured,
    bool isPinned,
    bool isActive,
    int viewCount,
    String createdAt,
    String updatedAt,
    ProjectCategory category,
  });

  $ProjectCategoryCopyWith<$Res> get category;
}

/// @nodoc
class _$ProjectListItemCopyWithImpl<$Res, $Val extends ProjectListItem>
    implements $ProjectListItemCopyWith<$Res> {
  _$ProjectListItemCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ProjectListItem
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? slug = null,
    Object? excerpt = freezed,
    Object? thumbnailUrl = null,
    Object? date = null,
    Object? sortOrder = null,
    Object? isFeatured = null,
    Object? isPinned = null,
    Object? isActive = null,
    Object? viewCount = null,
    Object? createdAt = null,
    Object? updatedAt = null,
    Object? category = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            title: null == title
                ? _value.title
                : title // ignore: cast_nullable_to_non_nullable
                      as String,
            slug: null == slug
                ? _value.slug
                : slug // ignore: cast_nullable_to_non_nullable
                      as String,
            excerpt: freezed == excerpt
                ? _value.excerpt
                : excerpt // ignore: cast_nullable_to_non_nullable
                      as String?,
            thumbnailUrl: null == thumbnailUrl
                ? _value.thumbnailUrl
                : thumbnailUrl // ignore: cast_nullable_to_non_nullable
                      as String,
            date: null == date
                ? _value.date
                : date // ignore: cast_nullable_to_non_nullable
                      as String,
            sortOrder: null == sortOrder
                ? _value.sortOrder
                : sortOrder // ignore: cast_nullable_to_non_nullable
                      as int,
            isFeatured: null == isFeatured
                ? _value.isFeatured
                : isFeatured // ignore: cast_nullable_to_non_nullable
                      as bool,
            isPinned: null == isPinned
                ? _value.isPinned
                : isPinned // ignore: cast_nullable_to_non_nullable
                      as bool,
            isActive: null == isActive
                ? _value.isActive
                : isActive // ignore: cast_nullable_to_non_nullable
                      as bool,
            viewCount: null == viewCount
                ? _value.viewCount
                : viewCount // ignore: cast_nullable_to_non_nullable
                      as int,
            createdAt: null == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as String,
            updatedAt: null == updatedAt
                ? _value.updatedAt
                : updatedAt // ignore: cast_nullable_to_non_nullable
                      as String,
            category: null == category
                ? _value.category
                : category // ignore: cast_nullable_to_non_nullable
                      as ProjectCategory,
          )
          as $Val,
    );
  }

  /// Create a copy of ProjectListItem
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $ProjectCategoryCopyWith<$Res> get category {
    return $ProjectCategoryCopyWith<$Res>(_value.category, (value) {
      return _then(_value.copyWith(category: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$ProjectListItemImplCopyWith<$Res>
    implements $ProjectListItemCopyWith<$Res> {
  factory _$$ProjectListItemImplCopyWith(
    _$ProjectListItemImpl value,
    $Res Function(_$ProjectListItemImpl) then,
  ) = __$$ProjectListItemImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String title,
    String slug,
    String? excerpt,
    String thumbnailUrl,
    String date,
    int sortOrder,
    bool isFeatured,
    bool isPinned,
    bool isActive,
    int viewCount,
    String createdAt,
    String updatedAt,
    ProjectCategory category,
  });

  @override
  $ProjectCategoryCopyWith<$Res> get category;
}

/// @nodoc
class __$$ProjectListItemImplCopyWithImpl<$Res>
    extends _$ProjectListItemCopyWithImpl<$Res, _$ProjectListItemImpl>
    implements _$$ProjectListItemImplCopyWith<$Res> {
  __$$ProjectListItemImplCopyWithImpl(
    _$ProjectListItemImpl _value,
    $Res Function(_$ProjectListItemImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ProjectListItem
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? slug = null,
    Object? excerpt = freezed,
    Object? thumbnailUrl = null,
    Object? date = null,
    Object? sortOrder = null,
    Object? isFeatured = null,
    Object? isPinned = null,
    Object? isActive = null,
    Object? viewCount = null,
    Object? createdAt = null,
    Object? updatedAt = null,
    Object? category = null,
  }) {
    return _then(
      _$ProjectListItemImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        title: null == title
            ? _value.title
            : title // ignore: cast_nullable_to_non_nullable
                  as String,
        slug: null == slug
            ? _value.slug
            : slug // ignore: cast_nullable_to_non_nullable
                  as String,
        excerpt: freezed == excerpt
            ? _value.excerpt
            : excerpt // ignore: cast_nullable_to_non_nullable
                  as String?,
        thumbnailUrl: null == thumbnailUrl
            ? _value.thumbnailUrl
            : thumbnailUrl // ignore: cast_nullable_to_non_nullable
                  as String,
        date: null == date
            ? _value.date
            : date // ignore: cast_nullable_to_non_nullable
                  as String,
        sortOrder: null == sortOrder
            ? _value.sortOrder
            : sortOrder // ignore: cast_nullable_to_non_nullable
                  as int,
        isFeatured: null == isFeatured
            ? _value.isFeatured
            : isFeatured // ignore: cast_nullable_to_non_nullable
                  as bool,
        isPinned: null == isPinned
            ? _value.isPinned
            : isPinned // ignore: cast_nullable_to_non_nullable
                  as bool,
        isActive: null == isActive
            ? _value.isActive
            : isActive // ignore: cast_nullable_to_non_nullable
                  as bool,
        viewCount: null == viewCount
            ? _value.viewCount
            : viewCount // ignore: cast_nullable_to_non_nullable
                  as int,
        createdAt: null == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as String,
        updatedAt: null == updatedAt
            ? _value.updatedAt
            : updatedAt // ignore: cast_nullable_to_non_nullable
                  as String,
        category: null == category
            ? _value.category
            : category // ignore: cast_nullable_to_non_nullable
                  as ProjectCategory,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ProjectListItemImpl implements _ProjectListItem {
  const _$ProjectListItemImpl({
    required this.id,
    required this.title,
    required this.slug,
    this.excerpt,
    required this.thumbnailUrl,
    required this.date,
    this.sortOrder = 0,
    this.isFeatured = false,
    this.isPinned = false,
    this.isActive = true,
    this.viewCount = 0,
    required this.createdAt,
    required this.updatedAt,
    required this.category,
  });

  factory _$ProjectListItemImpl.fromJson(Map<String, dynamic> json) =>
      _$$ProjectListItemImplFromJson(json);

  @override
  final String id;
  @override
  final String title;
  @override
  final String slug;
  @override
  final String? excerpt;
  @override
  final String thumbnailUrl;
  @override
  final String date;
  @override
  @JsonKey()
  final int sortOrder;
  @override
  @JsonKey()
  final bool isFeatured;
  @override
  @JsonKey()
  final bool isPinned;
  @override
  @JsonKey()
  final bool isActive;
  @override
  @JsonKey()
  final int viewCount;
  @override
  final String createdAt;
  @override
  final String updatedAt;
  @override
  final ProjectCategory category;

  @override
  String toString() {
    return 'ProjectListItem(id: $id, title: $title, slug: $slug, excerpt: $excerpt, thumbnailUrl: $thumbnailUrl, date: $date, sortOrder: $sortOrder, isFeatured: $isFeatured, isPinned: $isPinned, isActive: $isActive, viewCount: $viewCount, createdAt: $createdAt, updatedAt: $updatedAt, category: $category)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ProjectListItemImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.slug, slug) || other.slug == slug) &&
            (identical(other.excerpt, excerpt) || other.excerpt == excerpt) &&
            (identical(other.thumbnailUrl, thumbnailUrl) ||
                other.thumbnailUrl == thumbnailUrl) &&
            (identical(other.date, date) || other.date == date) &&
            (identical(other.sortOrder, sortOrder) ||
                other.sortOrder == sortOrder) &&
            (identical(other.isFeatured, isFeatured) ||
                other.isFeatured == isFeatured) &&
            (identical(other.isPinned, isPinned) ||
                other.isPinned == isPinned) &&
            (identical(other.isActive, isActive) ||
                other.isActive == isActive) &&
            (identical(other.viewCount, viewCount) ||
                other.viewCount == viewCount) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt) &&
            (identical(other.category, category) ||
                other.category == category));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    title,
    slug,
    excerpt,
    thumbnailUrl,
    date,
    sortOrder,
    isFeatured,
    isPinned,
    isActive,
    viewCount,
    createdAt,
    updatedAt,
    category,
  );

  /// Create a copy of ProjectListItem
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ProjectListItemImplCopyWith<_$ProjectListItemImpl> get copyWith =>
      __$$ProjectListItemImplCopyWithImpl<_$ProjectListItemImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$ProjectListItemImplToJson(this);
  }
}

abstract class _ProjectListItem implements ProjectListItem {
  const factory _ProjectListItem({
    required final String id,
    required final String title,
    required final String slug,
    final String? excerpt,
    required final String thumbnailUrl,
    required final String date,
    final int sortOrder,
    final bool isFeatured,
    final bool isPinned,
    final bool isActive,
    final int viewCount,
    required final String createdAt,
    required final String updatedAt,
    required final ProjectCategory category,
  }) = _$ProjectListItemImpl;

  factory _ProjectListItem.fromJson(Map<String, dynamic> json) =
      _$ProjectListItemImpl.fromJson;

  @override
  String get id;
  @override
  String get title;
  @override
  String get slug;
  @override
  String? get excerpt;
  @override
  String get thumbnailUrl;
  @override
  String get date;
  @override
  int get sortOrder;
  @override
  bool get isFeatured;
  @override
  bool get isPinned;
  @override
  bool get isActive;
  @override
  int get viewCount;
  @override
  String get createdAt;
  @override
  String get updatedAt;
  @override
  ProjectCategory get category;

  /// Create a copy of ProjectListItem
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ProjectListItemImplCopyWith<_$ProjectListItemImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

ProjectDetail _$ProjectDetailFromJson(Map<String, dynamic> json) {
  return _ProjectDetail.fromJson(json);
}

/// @nodoc
mixin _$ProjectDetail {
  String get id => throw _privateConstructorUsedError;
  String get title => throw _privateConstructorUsedError;
  String get slug => throw _privateConstructorUsedError;
  String get description => throw _privateConstructorUsedError;
  String? get excerpt => throw _privateConstructorUsedError;
  String get thumbnailUrl => throw _privateConstructorUsedError;
  String? get videoUrl => throw _privateConstructorUsedError;
  String get date => throw _privateConstructorUsedError;
  String? get duration => throw _privateConstructorUsedError;
  String? get client => throw _privateConstructorUsedError;
  String? get location => throw _privateConstructorUsedError;
  List<String> get tags => throw _privateConstructorUsedError;
  String? get metaTitle => throw _privateConstructorUsedError;
  String? get metaDescription => throw _privateConstructorUsedError;
  List<String> get metaKeywords => throw _privateConstructorUsedError;
  String? get ogImage => throw _privateConstructorUsedError;
  String get categoryId => throw _privateConstructorUsedError;
  int get sortOrder => throw _privateConstructorUsedError;
  bool get isFeatured => throw _privateConstructorUsedError;
  bool get isPinned => throw _privateConstructorUsedError;
  bool get isActive => throw _privateConstructorUsedError;
  int get viewCount => throw _privateConstructorUsedError;
  int get likeCount => throw _privateConstructorUsedError;
  String? get publishedAt => throw _privateConstructorUsedError;
  String get createdAt => throw _privateConstructorUsedError;
  String get updatedAt => throw _privateConstructorUsedError;
  ProjectCategory get category => throw _privateConstructorUsedError;
  List<ProjectImage> get images => throw _privateConstructorUsedError;

  /// Serializes this ProjectDetail to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ProjectDetail
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ProjectDetailCopyWith<ProjectDetail> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ProjectDetailCopyWith<$Res> {
  factory $ProjectDetailCopyWith(
    ProjectDetail value,
    $Res Function(ProjectDetail) then,
  ) = _$ProjectDetailCopyWithImpl<$Res, ProjectDetail>;
  @useResult
  $Res call({
    String id,
    String title,
    String slug,
    String description,
    String? excerpt,
    String thumbnailUrl,
    String? videoUrl,
    String date,
    String? duration,
    String? client,
    String? location,
    List<String> tags,
    String? metaTitle,
    String? metaDescription,
    List<String> metaKeywords,
    String? ogImage,
    String categoryId,
    int sortOrder,
    bool isFeatured,
    bool isPinned,
    bool isActive,
    int viewCount,
    int likeCount,
    String? publishedAt,
    String createdAt,
    String updatedAt,
    ProjectCategory category,
    List<ProjectImage> images,
  });

  $ProjectCategoryCopyWith<$Res> get category;
}

/// @nodoc
class _$ProjectDetailCopyWithImpl<$Res, $Val extends ProjectDetail>
    implements $ProjectDetailCopyWith<$Res> {
  _$ProjectDetailCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ProjectDetail
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? slug = null,
    Object? description = null,
    Object? excerpt = freezed,
    Object? thumbnailUrl = null,
    Object? videoUrl = freezed,
    Object? date = null,
    Object? duration = freezed,
    Object? client = freezed,
    Object? location = freezed,
    Object? tags = null,
    Object? metaTitle = freezed,
    Object? metaDescription = freezed,
    Object? metaKeywords = null,
    Object? ogImage = freezed,
    Object? categoryId = null,
    Object? sortOrder = null,
    Object? isFeatured = null,
    Object? isPinned = null,
    Object? isActive = null,
    Object? viewCount = null,
    Object? likeCount = null,
    Object? publishedAt = freezed,
    Object? createdAt = null,
    Object? updatedAt = null,
    Object? category = null,
    Object? images = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            title: null == title
                ? _value.title
                : title // ignore: cast_nullable_to_non_nullable
                      as String,
            slug: null == slug
                ? _value.slug
                : slug // ignore: cast_nullable_to_non_nullable
                      as String,
            description: null == description
                ? _value.description
                : description // ignore: cast_nullable_to_non_nullable
                      as String,
            excerpt: freezed == excerpt
                ? _value.excerpt
                : excerpt // ignore: cast_nullable_to_non_nullable
                      as String?,
            thumbnailUrl: null == thumbnailUrl
                ? _value.thumbnailUrl
                : thumbnailUrl // ignore: cast_nullable_to_non_nullable
                      as String,
            videoUrl: freezed == videoUrl
                ? _value.videoUrl
                : videoUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            date: null == date
                ? _value.date
                : date // ignore: cast_nullable_to_non_nullable
                      as String,
            duration: freezed == duration
                ? _value.duration
                : duration // ignore: cast_nullable_to_non_nullable
                      as String?,
            client: freezed == client
                ? _value.client
                : client // ignore: cast_nullable_to_non_nullable
                      as String?,
            location: freezed == location
                ? _value.location
                : location // ignore: cast_nullable_to_non_nullable
                      as String?,
            tags: null == tags
                ? _value.tags
                : tags // ignore: cast_nullable_to_non_nullable
                      as List<String>,
            metaTitle: freezed == metaTitle
                ? _value.metaTitle
                : metaTitle // ignore: cast_nullable_to_non_nullable
                      as String?,
            metaDescription: freezed == metaDescription
                ? _value.metaDescription
                : metaDescription // ignore: cast_nullable_to_non_nullable
                      as String?,
            metaKeywords: null == metaKeywords
                ? _value.metaKeywords
                : metaKeywords // ignore: cast_nullable_to_non_nullable
                      as List<String>,
            ogImage: freezed == ogImage
                ? _value.ogImage
                : ogImage // ignore: cast_nullable_to_non_nullable
                      as String?,
            categoryId: null == categoryId
                ? _value.categoryId
                : categoryId // ignore: cast_nullable_to_non_nullable
                      as String,
            sortOrder: null == sortOrder
                ? _value.sortOrder
                : sortOrder // ignore: cast_nullable_to_non_nullable
                      as int,
            isFeatured: null == isFeatured
                ? _value.isFeatured
                : isFeatured // ignore: cast_nullable_to_non_nullable
                      as bool,
            isPinned: null == isPinned
                ? _value.isPinned
                : isPinned // ignore: cast_nullable_to_non_nullable
                      as bool,
            isActive: null == isActive
                ? _value.isActive
                : isActive // ignore: cast_nullable_to_non_nullable
                      as bool,
            viewCount: null == viewCount
                ? _value.viewCount
                : viewCount // ignore: cast_nullable_to_non_nullable
                      as int,
            likeCount: null == likeCount
                ? _value.likeCount
                : likeCount // ignore: cast_nullable_to_non_nullable
                      as int,
            publishedAt: freezed == publishedAt
                ? _value.publishedAt
                : publishedAt // ignore: cast_nullable_to_non_nullable
                      as String?,
            createdAt: null == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as String,
            updatedAt: null == updatedAt
                ? _value.updatedAt
                : updatedAt // ignore: cast_nullable_to_non_nullable
                      as String,
            category: null == category
                ? _value.category
                : category // ignore: cast_nullable_to_non_nullable
                      as ProjectCategory,
            images: null == images
                ? _value.images
                : images // ignore: cast_nullable_to_non_nullable
                      as List<ProjectImage>,
          )
          as $Val,
    );
  }

  /// Create a copy of ProjectDetail
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $ProjectCategoryCopyWith<$Res> get category {
    return $ProjectCategoryCopyWith<$Res>(_value.category, (value) {
      return _then(_value.copyWith(category: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$ProjectDetailImplCopyWith<$Res>
    implements $ProjectDetailCopyWith<$Res> {
  factory _$$ProjectDetailImplCopyWith(
    _$ProjectDetailImpl value,
    $Res Function(_$ProjectDetailImpl) then,
  ) = __$$ProjectDetailImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String title,
    String slug,
    String description,
    String? excerpt,
    String thumbnailUrl,
    String? videoUrl,
    String date,
    String? duration,
    String? client,
    String? location,
    List<String> tags,
    String? metaTitle,
    String? metaDescription,
    List<String> metaKeywords,
    String? ogImage,
    String categoryId,
    int sortOrder,
    bool isFeatured,
    bool isPinned,
    bool isActive,
    int viewCount,
    int likeCount,
    String? publishedAt,
    String createdAt,
    String updatedAt,
    ProjectCategory category,
    List<ProjectImage> images,
  });

  @override
  $ProjectCategoryCopyWith<$Res> get category;
}

/// @nodoc
class __$$ProjectDetailImplCopyWithImpl<$Res>
    extends _$ProjectDetailCopyWithImpl<$Res, _$ProjectDetailImpl>
    implements _$$ProjectDetailImplCopyWith<$Res> {
  __$$ProjectDetailImplCopyWithImpl(
    _$ProjectDetailImpl _value,
    $Res Function(_$ProjectDetailImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ProjectDetail
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? slug = null,
    Object? description = null,
    Object? excerpt = freezed,
    Object? thumbnailUrl = null,
    Object? videoUrl = freezed,
    Object? date = null,
    Object? duration = freezed,
    Object? client = freezed,
    Object? location = freezed,
    Object? tags = null,
    Object? metaTitle = freezed,
    Object? metaDescription = freezed,
    Object? metaKeywords = null,
    Object? ogImage = freezed,
    Object? categoryId = null,
    Object? sortOrder = null,
    Object? isFeatured = null,
    Object? isPinned = null,
    Object? isActive = null,
    Object? viewCount = null,
    Object? likeCount = null,
    Object? publishedAt = freezed,
    Object? createdAt = null,
    Object? updatedAt = null,
    Object? category = null,
    Object? images = null,
  }) {
    return _then(
      _$ProjectDetailImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        title: null == title
            ? _value.title
            : title // ignore: cast_nullable_to_non_nullable
                  as String,
        slug: null == slug
            ? _value.slug
            : slug // ignore: cast_nullable_to_non_nullable
                  as String,
        description: null == description
            ? _value.description
            : description // ignore: cast_nullable_to_non_nullable
                  as String,
        excerpt: freezed == excerpt
            ? _value.excerpt
            : excerpt // ignore: cast_nullable_to_non_nullable
                  as String?,
        thumbnailUrl: null == thumbnailUrl
            ? _value.thumbnailUrl
            : thumbnailUrl // ignore: cast_nullable_to_non_nullable
                  as String,
        videoUrl: freezed == videoUrl
            ? _value.videoUrl
            : videoUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        date: null == date
            ? _value.date
            : date // ignore: cast_nullable_to_non_nullable
                  as String,
        duration: freezed == duration
            ? _value.duration
            : duration // ignore: cast_nullable_to_non_nullable
                  as String?,
        client: freezed == client
            ? _value.client
            : client // ignore: cast_nullable_to_non_nullable
                  as String?,
        location: freezed == location
            ? _value.location
            : location // ignore: cast_nullable_to_non_nullable
                  as String?,
        tags: null == tags
            ? _value._tags
            : tags // ignore: cast_nullable_to_non_nullable
                  as List<String>,
        metaTitle: freezed == metaTitle
            ? _value.metaTitle
            : metaTitle // ignore: cast_nullable_to_non_nullable
                  as String?,
        metaDescription: freezed == metaDescription
            ? _value.metaDescription
            : metaDescription // ignore: cast_nullable_to_non_nullable
                  as String?,
        metaKeywords: null == metaKeywords
            ? _value._metaKeywords
            : metaKeywords // ignore: cast_nullable_to_non_nullable
                  as List<String>,
        ogImage: freezed == ogImage
            ? _value.ogImage
            : ogImage // ignore: cast_nullable_to_non_nullable
                  as String?,
        categoryId: null == categoryId
            ? _value.categoryId
            : categoryId // ignore: cast_nullable_to_non_nullable
                  as String,
        sortOrder: null == sortOrder
            ? _value.sortOrder
            : sortOrder // ignore: cast_nullable_to_non_nullable
                  as int,
        isFeatured: null == isFeatured
            ? _value.isFeatured
            : isFeatured // ignore: cast_nullable_to_non_nullable
                  as bool,
        isPinned: null == isPinned
            ? _value.isPinned
            : isPinned // ignore: cast_nullable_to_non_nullable
                  as bool,
        isActive: null == isActive
            ? _value.isActive
            : isActive // ignore: cast_nullable_to_non_nullable
                  as bool,
        viewCount: null == viewCount
            ? _value.viewCount
            : viewCount // ignore: cast_nullable_to_non_nullable
                  as int,
        likeCount: null == likeCount
            ? _value.likeCount
            : likeCount // ignore: cast_nullable_to_non_nullable
                  as int,
        publishedAt: freezed == publishedAt
            ? _value.publishedAt
            : publishedAt // ignore: cast_nullable_to_non_nullable
                  as String?,
        createdAt: null == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as String,
        updatedAt: null == updatedAt
            ? _value.updatedAt
            : updatedAt // ignore: cast_nullable_to_non_nullable
                  as String,
        category: null == category
            ? _value.category
            : category // ignore: cast_nullable_to_non_nullable
                  as ProjectCategory,
        images: null == images
            ? _value._images
            : images // ignore: cast_nullable_to_non_nullable
                  as List<ProjectImage>,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ProjectDetailImpl implements _ProjectDetail {
  const _$ProjectDetailImpl({
    required this.id,
    required this.title,
    required this.slug,
    required this.description,
    this.excerpt,
    required this.thumbnailUrl,
    this.videoUrl,
    required this.date,
    this.duration,
    this.client,
    this.location,
    final List<String> tags = const [],
    this.metaTitle,
    this.metaDescription,
    final List<String> metaKeywords = const [],
    this.ogImage,
    required this.categoryId,
    this.sortOrder = 0,
    this.isFeatured = false,
    this.isPinned = false,
    this.isActive = true,
    this.viewCount = 0,
    this.likeCount = 0,
    this.publishedAt,
    required this.createdAt,
    required this.updatedAt,
    required this.category,
    final List<ProjectImage> images = const [],
  }) : _tags = tags,
       _metaKeywords = metaKeywords,
       _images = images;

  factory _$ProjectDetailImpl.fromJson(Map<String, dynamic> json) =>
      _$$ProjectDetailImplFromJson(json);

  @override
  final String id;
  @override
  final String title;
  @override
  final String slug;
  @override
  final String description;
  @override
  final String? excerpt;
  @override
  final String thumbnailUrl;
  @override
  final String? videoUrl;
  @override
  final String date;
  @override
  final String? duration;
  @override
  final String? client;
  @override
  final String? location;
  final List<String> _tags;
  @override
  @JsonKey()
  List<String> get tags {
    if (_tags is EqualUnmodifiableListView) return _tags;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_tags);
  }

  @override
  final String? metaTitle;
  @override
  final String? metaDescription;
  final List<String> _metaKeywords;
  @override
  @JsonKey()
  List<String> get metaKeywords {
    if (_metaKeywords is EqualUnmodifiableListView) return _metaKeywords;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_metaKeywords);
  }

  @override
  final String? ogImage;
  @override
  final String categoryId;
  @override
  @JsonKey()
  final int sortOrder;
  @override
  @JsonKey()
  final bool isFeatured;
  @override
  @JsonKey()
  final bool isPinned;
  @override
  @JsonKey()
  final bool isActive;
  @override
  @JsonKey()
  final int viewCount;
  @override
  @JsonKey()
  final int likeCount;
  @override
  final String? publishedAt;
  @override
  final String createdAt;
  @override
  final String updatedAt;
  @override
  final ProjectCategory category;
  final List<ProjectImage> _images;
  @override
  @JsonKey()
  List<ProjectImage> get images {
    if (_images is EqualUnmodifiableListView) return _images;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_images);
  }

  @override
  String toString() {
    return 'ProjectDetail(id: $id, title: $title, slug: $slug, description: $description, excerpt: $excerpt, thumbnailUrl: $thumbnailUrl, videoUrl: $videoUrl, date: $date, duration: $duration, client: $client, location: $location, tags: $tags, metaTitle: $metaTitle, metaDescription: $metaDescription, metaKeywords: $metaKeywords, ogImage: $ogImage, categoryId: $categoryId, sortOrder: $sortOrder, isFeatured: $isFeatured, isPinned: $isPinned, isActive: $isActive, viewCount: $viewCount, likeCount: $likeCount, publishedAt: $publishedAt, createdAt: $createdAt, updatedAt: $updatedAt, category: $category, images: $images)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ProjectDetailImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.slug, slug) || other.slug == slug) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.excerpt, excerpt) || other.excerpt == excerpt) &&
            (identical(other.thumbnailUrl, thumbnailUrl) ||
                other.thumbnailUrl == thumbnailUrl) &&
            (identical(other.videoUrl, videoUrl) ||
                other.videoUrl == videoUrl) &&
            (identical(other.date, date) || other.date == date) &&
            (identical(other.duration, duration) ||
                other.duration == duration) &&
            (identical(other.client, client) || other.client == client) &&
            (identical(other.location, location) ||
                other.location == location) &&
            const DeepCollectionEquality().equals(other._tags, _tags) &&
            (identical(other.metaTitle, metaTitle) ||
                other.metaTitle == metaTitle) &&
            (identical(other.metaDescription, metaDescription) ||
                other.metaDescription == metaDescription) &&
            const DeepCollectionEquality().equals(
              other._metaKeywords,
              _metaKeywords,
            ) &&
            (identical(other.ogImage, ogImage) || other.ogImage == ogImage) &&
            (identical(other.categoryId, categoryId) ||
                other.categoryId == categoryId) &&
            (identical(other.sortOrder, sortOrder) ||
                other.sortOrder == sortOrder) &&
            (identical(other.isFeatured, isFeatured) ||
                other.isFeatured == isFeatured) &&
            (identical(other.isPinned, isPinned) ||
                other.isPinned == isPinned) &&
            (identical(other.isActive, isActive) ||
                other.isActive == isActive) &&
            (identical(other.viewCount, viewCount) ||
                other.viewCount == viewCount) &&
            (identical(other.likeCount, likeCount) ||
                other.likeCount == likeCount) &&
            (identical(other.publishedAt, publishedAt) ||
                other.publishedAt == publishedAt) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt) &&
            (identical(other.category, category) ||
                other.category == category) &&
            const DeepCollectionEquality().equals(other._images, _images));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hashAll([
    runtimeType,
    id,
    title,
    slug,
    description,
    excerpt,
    thumbnailUrl,
    videoUrl,
    date,
    duration,
    client,
    location,
    const DeepCollectionEquality().hash(_tags),
    metaTitle,
    metaDescription,
    const DeepCollectionEquality().hash(_metaKeywords),
    ogImage,
    categoryId,
    sortOrder,
    isFeatured,
    isPinned,
    isActive,
    viewCount,
    likeCount,
    publishedAt,
    createdAt,
    updatedAt,
    category,
    const DeepCollectionEquality().hash(_images),
  ]);

  /// Create a copy of ProjectDetail
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ProjectDetailImplCopyWith<_$ProjectDetailImpl> get copyWith =>
      __$$ProjectDetailImplCopyWithImpl<_$ProjectDetailImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ProjectDetailImplToJson(this);
  }
}

abstract class _ProjectDetail implements ProjectDetail {
  const factory _ProjectDetail({
    required final String id,
    required final String title,
    required final String slug,
    required final String description,
    final String? excerpt,
    required final String thumbnailUrl,
    final String? videoUrl,
    required final String date,
    final String? duration,
    final String? client,
    final String? location,
    final List<String> tags,
    final String? metaTitle,
    final String? metaDescription,
    final List<String> metaKeywords,
    final String? ogImage,
    required final String categoryId,
    final int sortOrder,
    final bool isFeatured,
    final bool isPinned,
    final bool isActive,
    final int viewCount,
    final int likeCount,
    final String? publishedAt,
    required final String createdAt,
    required final String updatedAt,
    required final ProjectCategory category,
    final List<ProjectImage> images,
  }) = _$ProjectDetailImpl;

  factory _ProjectDetail.fromJson(Map<String, dynamic> json) =
      _$ProjectDetailImpl.fromJson;

  @override
  String get id;
  @override
  String get title;
  @override
  String get slug;
  @override
  String get description;
  @override
  String? get excerpt;
  @override
  String get thumbnailUrl;
  @override
  String? get videoUrl;
  @override
  String get date;
  @override
  String? get duration;
  @override
  String? get client;
  @override
  String? get location;
  @override
  List<String> get tags;
  @override
  String? get metaTitle;
  @override
  String? get metaDescription;
  @override
  List<String> get metaKeywords;
  @override
  String? get ogImage;
  @override
  String get categoryId;
  @override
  int get sortOrder;
  @override
  bool get isFeatured;
  @override
  bool get isPinned;
  @override
  bool get isActive;
  @override
  int get viewCount;
  @override
  int get likeCount;
  @override
  String? get publishedAt;
  @override
  String get createdAt;
  @override
  String get updatedAt;
  @override
  ProjectCategory get category;
  @override
  List<ProjectImage> get images;

  /// Create a copy of ProjectDetail
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ProjectDetailImplCopyWith<_$ProjectDetailImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
