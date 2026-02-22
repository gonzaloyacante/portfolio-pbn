// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'category_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

CategoryItem _$CategoryItemFromJson(Map<String, dynamic> json) {
  return _CategoryItem.fromJson(json);
}

/// @nodoc
mixin _$CategoryItem {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get slug => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  String? get thumbnailUrl => throw _privateConstructorUsedError;
  String? get iconName => throw _privateConstructorUsedError;
  String? get color => throw _privateConstructorUsedError;
  int get sortOrder => throw _privateConstructorUsedError;
  bool get isActive => throw _privateConstructorUsedError;
  int get projectCount => throw _privateConstructorUsedError;
  int get viewCount => throw _privateConstructorUsedError;
  String get createdAt => throw _privateConstructorUsedError;
  String get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this CategoryItem to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CategoryItem
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CategoryItemCopyWith<CategoryItem> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CategoryItemCopyWith<$Res> {
  factory $CategoryItemCopyWith(
    CategoryItem value,
    $Res Function(CategoryItem) then,
  ) = _$CategoryItemCopyWithImpl<$Res, CategoryItem>;
  @useResult
  $Res call({
    String id,
    String name,
    String slug,
    String? description,
    String? thumbnailUrl,
    String? iconName,
    String? color,
    int sortOrder,
    bool isActive,
    int projectCount,
    int viewCount,
    String createdAt,
    String updatedAt,
  });
}

/// @nodoc
class _$CategoryItemCopyWithImpl<$Res, $Val extends CategoryItem>
    implements $CategoryItemCopyWith<$Res> {
  _$CategoryItemCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CategoryItem
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? slug = null,
    Object? description = freezed,
    Object? thumbnailUrl = freezed,
    Object? iconName = freezed,
    Object? color = freezed,
    Object? sortOrder = null,
    Object? isActive = null,
    Object? projectCount = null,
    Object? viewCount = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
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
            description: freezed == description
                ? _value.description
                : description // ignore: cast_nullable_to_non_nullable
                      as String?,
            thumbnailUrl: freezed == thumbnailUrl
                ? _value.thumbnailUrl
                : thumbnailUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            iconName: freezed == iconName
                ? _value.iconName
                : iconName // ignore: cast_nullable_to_non_nullable
                      as String?,
            color: freezed == color
                ? _value.color
                : color // ignore: cast_nullable_to_non_nullable
                      as String?,
            sortOrder: null == sortOrder
                ? _value.sortOrder
                : sortOrder // ignore: cast_nullable_to_non_nullable
                      as int,
            isActive: null == isActive
                ? _value.isActive
                : isActive // ignore: cast_nullable_to_non_nullable
                      as bool,
            projectCount: null == projectCount
                ? _value.projectCount
                : projectCount // ignore: cast_nullable_to_non_nullable
                      as int,
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
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$CategoryItemImplCopyWith<$Res>
    implements $CategoryItemCopyWith<$Res> {
  factory _$$CategoryItemImplCopyWith(
    _$CategoryItemImpl value,
    $Res Function(_$CategoryItemImpl) then,
  ) = __$$CategoryItemImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String name,
    String slug,
    String? description,
    String? thumbnailUrl,
    String? iconName,
    String? color,
    int sortOrder,
    bool isActive,
    int projectCount,
    int viewCount,
    String createdAt,
    String updatedAt,
  });
}

/// @nodoc
class __$$CategoryItemImplCopyWithImpl<$Res>
    extends _$CategoryItemCopyWithImpl<$Res, _$CategoryItemImpl>
    implements _$$CategoryItemImplCopyWith<$Res> {
  __$$CategoryItemImplCopyWithImpl(
    _$CategoryItemImpl _value,
    $Res Function(_$CategoryItemImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of CategoryItem
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? slug = null,
    Object? description = freezed,
    Object? thumbnailUrl = freezed,
    Object? iconName = freezed,
    Object? color = freezed,
    Object? sortOrder = null,
    Object? isActive = null,
    Object? projectCount = null,
    Object? viewCount = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _$CategoryItemImpl(
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
        description: freezed == description
            ? _value.description
            : description // ignore: cast_nullable_to_non_nullable
                  as String?,
        thumbnailUrl: freezed == thumbnailUrl
            ? _value.thumbnailUrl
            : thumbnailUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        iconName: freezed == iconName
            ? _value.iconName
            : iconName // ignore: cast_nullable_to_non_nullable
                  as String?,
        color: freezed == color
            ? _value.color
            : color // ignore: cast_nullable_to_non_nullable
                  as String?,
        sortOrder: null == sortOrder
            ? _value.sortOrder
            : sortOrder // ignore: cast_nullable_to_non_nullable
                  as int,
        isActive: null == isActive
            ? _value.isActive
            : isActive // ignore: cast_nullable_to_non_nullable
                  as bool,
        projectCount: null == projectCount
            ? _value.projectCount
            : projectCount // ignore: cast_nullable_to_non_nullable
                  as int,
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
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$CategoryItemImpl implements _CategoryItem {
  const _$CategoryItemImpl({
    required this.id,
    required this.name,
    required this.slug,
    this.description,
    this.thumbnailUrl,
    this.iconName,
    this.color,
    this.sortOrder = 0,
    this.isActive = true,
    this.projectCount = 0,
    this.viewCount = 0,
    required this.createdAt,
    required this.updatedAt,
  });

  factory _$CategoryItemImpl.fromJson(Map<String, dynamic> json) =>
      _$$CategoryItemImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String slug;
  @override
  final String? description;
  @override
  final String? thumbnailUrl;
  @override
  final String? iconName;
  @override
  final String? color;
  @override
  @JsonKey()
  final int sortOrder;
  @override
  @JsonKey()
  final bool isActive;
  @override
  @JsonKey()
  final int projectCount;
  @override
  @JsonKey()
  final int viewCount;
  @override
  final String createdAt;
  @override
  final String updatedAt;

  @override
  String toString() {
    return 'CategoryItem(id: $id, name: $name, slug: $slug, description: $description, thumbnailUrl: $thumbnailUrl, iconName: $iconName, color: $color, sortOrder: $sortOrder, isActive: $isActive, projectCount: $projectCount, viewCount: $viewCount, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CategoryItemImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.slug, slug) || other.slug == slug) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.thumbnailUrl, thumbnailUrl) ||
                other.thumbnailUrl == thumbnailUrl) &&
            (identical(other.iconName, iconName) ||
                other.iconName == iconName) &&
            (identical(other.color, color) || other.color == color) &&
            (identical(other.sortOrder, sortOrder) ||
                other.sortOrder == sortOrder) &&
            (identical(other.isActive, isActive) ||
                other.isActive == isActive) &&
            (identical(other.projectCount, projectCount) ||
                other.projectCount == projectCount) &&
            (identical(other.viewCount, viewCount) ||
                other.viewCount == viewCount) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    name,
    slug,
    description,
    thumbnailUrl,
    iconName,
    color,
    sortOrder,
    isActive,
    projectCount,
    viewCount,
    createdAt,
    updatedAt,
  );

  /// Create a copy of CategoryItem
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CategoryItemImplCopyWith<_$CategoryItemImpl> get copyWith =>
      __$$CategoryItemImplCopyWithImpl<_$CategoryItemImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CategoryItemImplToJson(this);
  }
}

abstract class _CategoryItem implements CategoryItem {
  const factory _CategoryItem({
    required final String id,
    required final String name,
    required final String slug,
    final String? description,
    final String? thumbnailUrl,
    final String? iconName,
    final String? color,
    final int sortOrder,
    final bool isActive,
    final int projectCount,
    final int viewCount,
    required final String createdAt,
    required final String updatedAt,
  }) = _$CategoryItemImpl;

  factory _CategoryItem.fromJson(Map<String, dynamic> json) =
      _$CategoryItemImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get slug;
  @override
  String? get description;
  @override
  String? get thumbnailUrl;
  @override
  String? get iconName;
  @override
  String? get color;
  @override
  int get sortOrder;
  @override
  bool get isActive;
  @override
  int get projectCount;
  @override
  int get viewCount;
  @override
  String get createdAt;
  @override
  String get updatedAt;

  /// Create a copy of CategoryItem
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CategoryItemImplCopyWith<_$CategoryItemImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

CategoryDetail _$CategoryDetailFromJson(Map<String, dynamic> json) {
  return _CategoryDetail.fromJson(json);
}

/// @nodoc
mixin _$CategoryDetail {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get slug => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  String? get thumbnailUrl => throw _privateConstructorUsedError;
  String? get coverImageUrl => throw _privateConstructorUsedError;
  String? get iconName => throw _privateConstructorUsedError;
  String? get color => throw _privateConstructorUsedError;
  String? get metaTitle => throw _privateConstructorUsedError;
  String? get metaDescription => throw _privateConstructorUsedError;
  List<String> get metaKeywords => throw _privateConstructorUsedError;
  String? get ogImage => throw _privateConstructorUsedError;
  int get sortOrder => throw _privateConstructorUsedError;
  bool get isActive => throw _privateConstructorUsedError;
  int get projectCount => throw _privateConstructorUsedError;
  int get viewCount => throw _privateConstructorUsedError;
  String get createdAt => throw _privateConstructorUsedError;
  String get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this CategoryDetail to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CategoryDetail
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CategoryDetailCopyWith<CategoryDetail> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CategoryDetailCopyWith<$Res> {
  factory $CategoryDetailCopyWith(
    CategoryDetail value,
    $Res Function(CategoryDetail) then,
  ) = _$CategoryDetailCopyWithImpl<$Res, CategoryDetail>;
  @useResult
  $Res call({
    String id,
    String name,
    String slug,
    String? description,
    String? thumbnailUrl,
    String? coverImageUrl,
    String? iconName,
    String? color,
    String? metaTitle,
    String? metaDescription,
    List<String> metaKeywords,
    String? ogImage,
    int sortOrder,
    bool isActive,
    int projectCount,
    int viewCount,
    String createdAt,
    String updatedAt,
  });
}

/// @nodoc
class _$CategoryDetailCopyWithImpl<$Res, $Val extends CategoryDetail>
    implements $CategoryDetailCopyWith<$Res> {
  _$CategoryDetailCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CategoryDetail
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? slug = null,
    Object? description = freezed,
    Object? thumbnailUrl = freezed,
    Object? coverImageUrl = freezed,
    Object? iconName = freezed,
    Object? color = freezed,
    Object? metaTitle = freezed,
    Object? metaDescription = freezed,
    Object? metaKeywords = null,
    Object? ogImage = freezed,
    Object? sortOrder = null,
    Object? isActive = null,
    Object? projectCount = null,
    Object? viewCount = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
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
            description: freezed == description
                ? _value.description
                : description // ignore: cast_nullable_to_non_nullable
                      as String?,
            thumbnailUrl: freezed == thumbnailUrl
                ? _value.thumbnailUrl
                : thumbnailUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            coverImageUrl: freezed == coverImageUrl
                ? _value.coverImageUrl
                : coverImageUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            iconName: freezed == iconName
                ? _value.iconName
                : iconName // ignore: cast_nullable_to_non_nullable
                      as String?,
            color: freezed == color
                ? _value.color
                : color // ignore: cast_nullable_to_non_nullable
                      as String?,
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
            sortOrder: null == sortOrder
                ? _value.sortOrder
                : sortOrder // ignore: cast_nullable_to_non_nullable
                      as int,
            isActive: null == isActive
                ? _value.isActive
                : isActive // ignore: cast_nullable_to_non_nullable
                      as bool,
            projectCount: null == projectCount
                ? _value.projectCount
                : projectCount // ignore: cast_nullable_to_non_nullable
                      as int,
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
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$CategoryDetailImplCopyWith<$Res>
    implements $CategoryDetailCopyWith<$Res> {
  factory _$$CategoryDetailImplCopyWith(
    _$CategoryDetailImpl value,
    $Res Function(_$CategoryDetailImpl) then,
  ) = __$$CategoryDetailImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String name,
    String slug,
    String? description,
    String? thumbnailUrl,
    String? coverImageUrl,
    String? iconName,
    String? color,
    String? metaTitle,
    String? metaDescription,
    List<String> metaKeywords,
    String? ogImage,
    int sortOrder,
    bool isActive,
    int projectCount,
    int viewCount,
    String createdAt,
    String updatedAt,
  });
}

/// @nodoc
class __$$CategoryDetailImplCopyWithImpl<$Res>
    extends _$CategoryDetailCopyWithImpl<$Res, _$CategoryDetailImpl>
    implements _$$CategoryDetailImplCopyWith<$Res> {
  __$$CategoryDetailImplCopyWithImpl(
    _$CategoryDetailImpl _value,
    $Res Function(_$CategoryDetailImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of CategoryDetail
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? slug = null,
    Object? description = freezed,
    Object? thumbnailUrl = freezed,
    Object? coverImageUrl = freezed,
    Object? iconName = freezed,
    Object? color = freezed,
    Object? metaTitle = freezed,
    Object? metaDescription = freezed,
    Object? metaKeywords = null,
    Object? ogImage = freezed,
    Object? sortOrder = null,
    Object? isActive = null,
    Object? projectCount = null,
    Object? viewCount = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _$CategoryDetailImpl(
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
        description: freezed == description
            ? _value.description
            : description // ignore: cast_nullable_to_non_nullable
                  as String?,
        thumbnailUrl: freezed == thumbnailUrl
            ? _value.thumbnailUrl
            : thumbnailUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        coverImageUrl: freezed == coverImageUrl
            ? _value.coverImageUrl
            : coverImageUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        iconName: freezed == iconName
            ? _value.iconName
            : iconName // ignore: cast_nullable_to_non_nullable
                  as String?,
        color: freezed == color
            ? _value.color
            : color // ignore: cast_nullable_to_non_nullable
                  as String?,
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
        sortOrder: null == sortOrder
            ? _value.sortOrder
            : sortOrder // ignore: cast_nullable_to_non_nullable
                  as int,
        isActive: null == isActive
            ? _value.isActive
            : isActive // ignore: cast_nullable_to_non_nullable
                  as bool,
        projectCount: null == projectCount
            ? _value.projectCount
            : projectCount // ignore: cast_nullable_to_non_nullable
                  as int,
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
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$CategoryDetailImpl implements _CategoryDetail {
  const _$CategoryDetailImpl({
    required this.id,
    required this.name,
    required this.slug,
    this.description,
    this.thumbnailUrl,
    this.coverImageUrl,
    this.iconName,
    this.color,
    this.metaTitle,
    this.metaDescription,
    final List<String> metaKeywords = const [],
    this.ogImage,
    this.sortOrder = 0,
    this.isActive = true,
    this.projectCount = 0,
    this.viewCount = 0,
    required this.createdAt,
    required this.updatedAt,
  }) : _metaKeywords = metaKeywords;

  factory _$CategoryDetailImpl.fromJson(Map<String, dynamic> json) =>
      _$$CategoryDetailImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String slug;
  @override
  final String? description;
  @override
  final String? thumbnailUrl;
  @override
  final String? coverImageUrl;
  @override
  final String? iconName;
  @override
  final String? color;
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
  @JsonKey()
  final int sortOrder;
  @override
  @JsonKey()
  final bool isActive;
  @override
  @JsonKey()
  final int projectCount;
  @override
  @JsonKey()
  final int viewCount;
  @override
  final String createdAt;
  @override
  final String updatedAt;

  @override
  String toString() {
    return 'CategoryDetail(id: $id, name: $name, slug: $slug, description: $description, thumbnailUrl: $thumbnailUrl, coverImageUrl: $coverImageUrl, iconName: $iconName, color: $color, metaTitle: $metaTitle, metaDescription: $metaDescription, metaKeywords: $metaKeywords, ogImage: $ogImage, sortOrder: $sortOrder, isActive: $isActive, projectCount: $projectCount, viewCount: $viewCount, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CategoryDetailImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.slug, slug) || other.slug == slug) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.thumbnailUrl, thumbnailUrl) ||
                other.thumbnailUrl == thumbnailUrl) &&
            (identical(other.coverImageUrl, coverImageUrl) ||
                other.coverImageUrl == coverImageUrl) &&
            (identical(other.iconName, iconName) ||
                other.iconName == iconName) &&
            (identical(other.color, color) || other.color == color) &&
            (identical(other.metaTitle, metaTitle) ||
                other.metaTitle == metaTitle) &&
            (identical(other.metaDescription, metaDescription) ||
                other.metaDescription == metaDescription) &&
            const DeepCollectionEquality().equals(
              other._metaKeywords,
              _metaKeywords,
            ) &&
            (identical(other.ogImage, ogImage) || other.ogImage == ogImage) &&
            (identical(other.sortOrder, sortOrder) ||
                other.sortOrder == sortOrder) &&
            (identical(other.isActive, isActive) ||
                other.isActive == isActive) &&
            (identical(other.projectCount, projectCount) ||
                other.projectCount == projectCount) &&
            (identical(other.viewCount, viewCount) ||
                other.viewCount == viewCount) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    name,
    slug,
    description,
    thumbnailUrl,
    coverImageUrl,
    iconName,
    color,
    metaTitle,
    metaDescription,
    const DeepCollectionEquality().hash(_metaKeywords),
    ogImage,
    sortOrder,
    isActive,
    projectCount,
    viewCount,
    createdAt,
    updatedAt,
  );

  /// Create a copy of CategoryDetail
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CategoryDetailImplCopyWith<_$CategoryDetailImpl> get copyWith =>
      __$$CategoryDetailImplCopyWithImpl<_$CategoryDetailImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$CategoryDetailImplToJson(this);
  }
}

abstract class _CategoryDetail implements CategoryDetail {
  const factory _CategoryDetail({
    required final String id,
    required final String name,
    required final String slug,
    final String? description,
    final String? thumbnailUrl,
    final String? coverImageUrl,
    final String? iconName,
    final String? color,
    final String? metaTitle,
    final String? metaDescription,
    final List<String> metaKeywords,
    final String? ogImage,
    final int sortOrder,
    final bool isActive,
    final int projectCount,
    final int viewCount,
    required final String createdAt,
    required final String updatedAt,
  }) = _$CategoryDetailImpl;

  factory _CategoryDetail.fromJson(Map<String, dynamic> json) =
      _$CategoryDetailImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get slug;
  @override
  String? get description;
  @override
  String? get thumbnailUrl;
  @override
  String? get coverImageUrl;
  @override
  String? get iconName;
  @override
  String? get color;
  @override
  String? get metaTitle;
  @override
  String? get metaDescription;
  @override
  List<String> get metaKeywords;
  @override
  String? get ogImage;
  @override
  int get sortOrder;
  @override
  bool get isActive;
  @override
  int get projectCount;
  @override
  int get viewCount;
  @override
  String get createdAt;
  @override
  String get updatedAt;

  /// Create a copy of CategoryDetail
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CategoryDetailImplCopyWith<_$CategoryDetailImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
