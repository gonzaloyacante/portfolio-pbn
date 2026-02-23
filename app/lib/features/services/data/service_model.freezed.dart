// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'service_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

ServiceItem _$ServiceItemFromJson(Map<String, dynamic> json) {
  return _ServiceItem.fromJson(json);
}

/// @nodoc
mixin _$ServiceItem {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get slug => throw _privateConstructorUsedError;
  String? get shortDesc => throw _privateConstructorUsedError;
  String? get price => throw _privateConstructorUsedError;
  String? get priceLabel => throw _privateConstructorUsedError;
  String get currency => throw _privateConstructorUsedError;
  String? get duration => throw _privateConstructorUsedError;
  String? get imageUrl => throw _privateConstructorUsedError;
  String? get iconName => throw _privateConstructorUsedError;
  String? get color => throw _privateConstructorUsedError;
  bool get isActive => throw _privateConstructorUsedError;
  bool get isFeatured => throw _privateConstructorUsedError;
  bool get isAvailable => throw _privateConstructorUsedError;
  int get sortOrder => throw _privateConstructorUsedError;
  int get bookingCount => throw _privateConstructorUsedError;
  int get viewCount => throw _privateConstructorUsedError;
  String get createdAt => throw _privateConstructorUsedError;
  String get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this ServiceItem to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ServiceItem
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ServiceItemCopyWith<ServiceItem> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ServiceItemCopyWith<$Res> {
  factory $ServiceItemCopyWith(
    ServiceItem value,
    $Res Function(ServiceItem) then,
  ) = _$ServiceItemCopyWithImpl<$Res, ServiceItem>;
  @useResult
  $Res call({
    String id,
    String name,
    String slug,
    String? shortDesc,
    String? price,
    String? priceLabel,
    String currency,
    String? duration,
    String? imageUrl,
    String? iconName,
    String? color,
    bool isActive,
    bool isFeatured,
    bool isAvailable,
    int sortOrder,
    int bookingCount,
    int viewCount,
    String createdAt,
    String updatedAt,
  });
}

/// @nodoc
class _$ServiceItemCopyWithImpl<$Res, $Val extends ServiceItem>
    implements $ServiceItemCopyWith<$Res> {
  _$ServiceItemCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ServiceItem
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? slug = null,
    Object? shortDesc = freezed,
    Object? price = freezed,
    Object? priceLabel = freezed,
    Object? currency = null,
    Object? duration = freezed,
    Object? imageUrl = freezed,
    Object? iconName = freezed,
    Object? color = freezed,
    Object? isActive = null,
    Object? isFeatured = null,
    Object? isAvailable = null,
    Object? sortOrder = null,
    Object? bookingCount = null,
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
            shortDesc: freezed == shortDesc
                ? _value.shortDesc
                : shortDesc // ignore: cast_nullable_to_non_nullable
                      as String?,
            price: freezed == price
                ? _value.price
                : price // ignore: cast_nullable_to_non_nullable
                      as String?,
            priceLabel: freezed == priceLabel
                ? _value.priceLabel
                : priceLabel // ignore: cast_nullable_to_non_nullable
                      as String?,
            currency: null == currency
                ? _value.currency
                : currency // ignore: cast_nullable_to_non_nullable
                      as String,
            duration: freezed == duration
                ? _value.duration
                : duration // ignore: cast_nullable_to_non_nullable
                      as String?,
            imageUrl: freezed == imageUrl
                ? _value.imageUrl
                : imageUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            iconName: freezed == iconName
                ? _value.iconName
                : iconName // ignore: cast_nullable_to_non_nullable
                      as String?,
            color: freezed == color
                ? _value.color
                : color // ignore: cast_nullable_to_non_nullable
                      as String?,
            isActive: null == isActive
                ? _value.isActive
                : isActive // ignore: cast_nullable_to_non_nullable
                      as bool,
            isFeatured: null == isFeatured
                ? _value.isFeatured
                : isFeatured // ignore: cast_nullable_to_non_nullable
                      as bool,
            isAvailable: null == isAvailable
                ? _value.isAvailable
                : isAvailable // ignore: cast_nullable_to_non_nullable
                      as bool,
            sortOrder: null == sortOrder
                ? _value.sortOrder
                : sortOrder // ignore: cast_nullable_to_non_nullable
                      as int,
            bookingCount: null == bookingCount
                ? _value.bookingCount
                : bookingCount // ignore: cast_nullable_to_non_nullable
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
abstract class _$$ServiceItemImplCopyWith<$Res>
    implements $ServiceItemCopyWith<$Res> {
  factory _$$ServiceItemImplCopyWith(
    _$ServiceItemImpl value,
    $Res Function(_$ServiceItemImpl) then,
  ) = __$$ServiceItemImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String name,
    String slug,
    String? shortDesc,
    String? price,
    String? priceLabel,
    String currency,
    String? duration,
    String? imageUrl,
    String? iconName,
    String? color,
    bool isActive,
    bool isFeatured,
    bool isAvailable,
    int sortOrder,
    int bookingCount,
    int viewCount,
    String createdAt,
    String updatedAt,
  });
}

/// @nodoc
class __$$ServiceItemImplCopyWithImpl<$Res>
    extends _$ServiceItemCopyWithImpl<$Res, _$ServiceItemImpl>
    implements _$$ServiceItemImplCopyWith<$Res> {
  __$$ServiceItemImplCopyWithImpl(
    _$ServiceItemImpl _value,
    $Res Function(_$ServiceItemImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ServiceItem
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? slug = null,
    Object? shortDesc = freezed,
    Object? price = freezed,
    Object? priceLabel = freezed,
    Object? currency = null,
    Object? duration = freezed,
    Object? imageUrl = freezed,
    Object? iconName = freezed,
    Object? color = freezed,
    Object? isActive = null,
    Object? isFeatured = null,
    Object? isAvailable = null,
    Object? sortOrder = null,
    Object? bookingCount = null,
    Object? viewCount = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _$ServiceItemImpl(
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
        shortDesc: freezed == shortDesc
            ? _value.shortDesc
            : shortDesc // ignore: cast_nullable_to_non_nullable
                  as String?,
        price: freezed == price
            ? _value.price
            : price // ignore: cast_nullable_to_non_nullable
                  as String?,
        priceLabel: freezed == priceLabel
            ? _value.priceLabel
            : priceLabel // ignore: cast_nullable_to_non_nullable
                  as String?,
        currency: null == currency
            ? _value.currency
            : currency // ignore: cast_nullable_to_non_nullable
                  as String,
        duration: freezed == duration
            ? _value.duration
            : duration // ignore: cast_nullable_to_non_nullable
                  as String?,
        imageUrl: freezed == imageUrl
            ? _value.imageUrl
            : imageUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        iconName: freezed == iconName
            ? _value.iconName
            : iconName // ignore: cast_nullable_to_non_nullable
                  as String?,
        color: freezed == color
            ? _value.color
            : color // ignore: cast_nullable_to_non_nullable
                  as String?,
        isActive: null == isActive
            ? _value.isActive
            : isActive // ignore: cast_nullable_to_non_nullable
                  as bool,
        isFeatured: null == isFeatured
            ? _value.isFeatured
            : isFeatured // ignore: cast_nullable_to_non_nullable
                  as bool,
        isAvailable: null == isAvailable
            ? _value.isAvailable
            : isAvailable // ignore: cast_nullable_to_non_nullable
                  as bool,
        sortOrder: null == sortOrder
            ? _value.sortOrder
            : sortOrder // ignore: cast_nullable_to_non_nullable
                  as int,
        bookingCount: null == bookingCount
            ? _value.bookingCount
            : bookingCount // ignore: cast_nullable_to_non_nullable
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
class _$ServiceItemImpl implements _ServiceItem {
  const _$ServiceItemImpl({
    required this.id,
    required this.name,
    required this.slug,
    this.shortDesc,
    this.price,
    this.priceLabel,
    this.currency = 'ARS',
    this.duration,
    this.imageUrl,
    this.iconName,
    this.color,
    this.isActive = true,
    this.isFeatured = false,
    this.isAvailable = true,
    this.sortOrder = 0,
    this.bookingCount = 0,
    this.viewCount = 0,
    required this.createdAt,
    required this.updatedAt,
  });

  factory _$ServiceItemImpl.fromJson(Map<String, dynamic> json) =>
      _$$ServiceItemImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String slug;
  @override
  final String? shortDesc;
  @override
  final String? price;
  @override
  final String? priceLabel;
  @override
  @JsonKey()
  final String currency;
  @override
  final String? duration;
  @override
  final String? imageUrl;
  @override
  final String? iconName;
  @override
  final String? color;
  @override
  @JsonKey()
  final bool isActive;
  @override
  @JsonKey()
  final bool isFeatured;
  @override
  @JsonKey()
  final bool isAvailable;
  @override
  @JsonKey()
  final int sortOrder;
  @override
  @JsonKey()
  final int bookingCount;
  @override
  @JsonKey()
  final int viewCount;
  @override
  final String createdAt;
  @override
  final String updatedAt;

  @override
  String toString() {
    return 'ServiceItem(id: $id, name: $name, slug: $slug, shortDesc: $shortDesc, price: $price, priceLabel: $priceLabel, currency: $currency, duration: $duration, imageUrl: $imageUrl, iconName: $iconName, color: $color, isActive: $isActive, isFeatured: $isFeatured, isAvailable: $isAvailable, sortOrder: $sortOrder, bookingCount: $bookingCount, viewCount: $viewCount, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ServiceItemImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.slug, slug) || other.slug == slug) &&
            (identical(other.shortDesc, shortDesc) ||
                other.shortDesc == shortDesc) &&
            (identical(other.price, price) || other.price == price) &&
            (identical(other.priceLabel, priceLabel) ||
                other.priceLabel == priceLabel) &&
            (identical(other.currency, currency) ||
                other.currency == currency) &&
            (identical(other.duration, duration) ||
                other.duration == duration) &&
            (identical(other.imageUrl, imageUrl) ||
                other.imageUrl == imageUrl) &&
            (identical(other.iconName, iconName) ||
                other.iconName == iconName) &&
            (identical(other.color, color) || other.color == color) &&
            (identical(other.isActive, isActive) ||
                other.isActive == isActive) &&
            (identical(other.isFeatured, isFeatured) ||
                other.isFeatured == isFeatured) &&
            (identical(other.isAvailable, isAvailable) ||
                other.isAvailable == isAvailable) &&
            (identical(other.sortOrder, sortOrder) ||
                other.sortOrder == sortOrder) &&
            (identical(other.bookingCount, bookingCount) ||
                other.bookingCount == bookingCount) &&
            (identical(other.viewCount, viewCount) ||
                other.viewCount == viewCount) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hashAll([
    runtimeType,
    id,
    name,
    slug,
    shortDesc,
    price,
    priceLabel,
    currency,
    duration,
    imageUrl,
    iconName,
    color,
    isActive,
    isFeatured,
    isAvailable,
    sortOrder,
    bookingCount,
    viewCount,
    createdAt,
    updatedAt,
  ]);

  /// Create a copy of ServiceItem
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ServiceItemImplCopyWith<_$ServiceItemImpl> get copyWith =>
      __$$ServiceItemImplCopyWithImpl<_$ServiceItemImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ServiceItemImplToJson(this);
  }
}

abstract class _ServiceItem implements ServiceItem {
  const factory _ServiceItem({
    required final String id,
    required final String name,
    required final String slug,
    final String? shortDesc,
    final String? price,
    final String? priceLabel,
    final String currency,
    final String? duration,
    final String? imageUrl,
    final String? iconName,
    final String? color,
    final bool isActive,
    final bool isFeatured,
    final bool isAvailable,
    final int sortOrder,
    final int bookingCount,
    final int viewCount,
    required final String createdAt,
    required final String updatedAt,
  }) = _$ServiceItemImpl;

  factory _ServiceItem.fromJson(Map<String, dynamic> json) =
      _$ServiceItemImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get slug;
  @override
  String? get shortDesc;
  @override
  String? get price;
  @override
  String? get priceLabel;
  @override
  String get currency;
  @override
  String? get duration;
  @override
  String? get imageUrl;
  @override
  String? get iconName;
  @override
  String? get color;
  @override
  bool get isActive;
  @override
  bool get isFeatured;
  @override
  bool get isAvailable;
  @override
  int get sortOrder;
  @override
  int get bookingCount;
  @override
  int get viewCount;
  @override
  String get createdAt;
  @override
  String get updatedAt;

  /// Create a copy of ServiceItem
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ServiceItemImplCopyWith<_$ServiceItemImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

ServiceDetail _$ServiceDetailFromJson(Map<String, dynamic> json) {
  return _ServiceDetail.fromJson(json);
}

/// @nodoc
mixin _$ServiceDetail {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get slug => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  String? get shortDesc => throw _privateConstructorUsedError;
  String? get price => throw _privateConstructorUsedError;
  String? get priceLabel => throw _privateConstructorUsedError;
  String get currency => throw _privateConstructorUsedError;
  String? get duration => throw _privateConstructorUsedError;
  int? get durationMinutes => throw _privateConstructorUsedError;
  String? get imageUrl => throw _privateConstructorUsedError;
  String? get iconName => throw _privateConstructorUsedError;
  String? get color => throw _privateConstructorUsedError;
  bool get isActive => throw _privateConstructorUsedError;
  bool get isFeatured => throw _privateConstructorUsedError;
  bool get isAvailable => throw _privateConstructorUsedError;
  int? get maxBookingsPerDay => throw _privateConstructorUsedError;
  int? get advanceNoticeDays => throw _privateConstructorUsedError;
  int get sortOrder => throw _privateConstructorUsedError;
  String? get metaTitle => throw _privateConstructorUsedError;
  String? get metaDescription => throw _privateConstructorUsedError;
  List<String> get metaKeywords => throw _privateConstructorUsedError;
  String? get requirements => throw _privateConstructorUsedError;
  String? get cancellationPolicy => throw _privateConstructorUsedError;
  int get bookingCount => throw _privateConstructorUsedError;
  int get viewCount => throw _privateConstructorUsedError;
  String get createdAt => throw _privateConstructorUsedError;
  String get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this ServiceDetail to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ServiceDetail
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ServiceDetailCopyWith<ServiceDetail> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ServiceDetailCopyWith<$Res> {
  factory $ServiceDetailCopyWith(
    ServiceDetail value,
    $Res Function(ServiceDetail) then,
  ) = _$ServiceDetailCopyWithImpl<$Res, ServiceDetail>;
  @useResult
  $Res call({
    String id,
    String name,
    String slug,
    String? description,
    String? shortDesc,
    String? price,
    String? priceLabel,
    String currency,
    String? duration,
    int? durationMinutes,
    String? imageUrl,
    String? iconName,
    String? color,
    bool isActive,
    bool isFeatured,
    bool isAvailable,
    int? maxBookingsPerDay,
    int? advanceNoticeDays,
    int sortOrder,
    String? metaTitle,
    String? metaDescription,
    List<String> metaKeywords,
    String? requirements,
    String? cancellationPolicy,
    int bookingCount,
    int viewCount,
    String createdAt,
    String updatedAt,
  });
}

/// @nodoc
class _$ServiceDetailCopyWithImpl<$Res, $Val extends ServiceDetail>
    implements $ServiceDetailCopyWith<$Res> {
  _$ServiceDetailCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ServiceDetail
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? slug = null,
    Object? description = freezed,
    Object? shortDesc = freezed,
    Object? price = freezed,
    Object? priceLabel = freezed,
    Object? currency = null,
    Object? duration = freezed,
    Object? durationMinutes = freezed,
    Object? imageUrl = freezed,
    Object? iconName = freezed,
    Object? color = freezed,
    Object? isActive = null,
    Object? isFeatured = null,
    Object? isAvailable = null,
    Object? maxBookingsPerDay = freezed,
    Object? advanceNoticeDays = freezed,
    Object? sortOrder = null,
    Object? metaTitle = freezed,
    Object? metaDescription = freezed,
    Object? metaKeywords = null,
    Object? requirements = freezed,
    Object? cancellationPolicy = freezed,
    Object? bookingCount = null,
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
            shortDesc: freezed == shortDesc
                ? _value.shortDesc
                : shortDesc // ignore: cast_nullable_to_non_nullable
                      as String?,
            price: freezed == price
                ? _value.price
                : price // ignore: cast_nullable_to_non_nullable
                      as String?,
            priceLabel: freezed == priceLabel
                ? _value.priceLabel
                : priceLabel // ignore: cast_nullable_to_non_nullable
                      as String?,
            currency: null == currency
                ? _value.currency
                : currency // ignore: cast_nullable_to_non_nullable
                      as String,
            duration: freezed == duration
                ? _value.duration
                : duration // ignore: cast_nullable_to_non_nullable
                      as String?,
            durationMinutes: freezed == durationMinutes
                ? _value.durationMinutes
                : durationMinutes // ignore: cast_nullable_to_non_nullable
                      as int?,
            imageUrl: freezed == imageUrl
                ? _value.imageUrl
                : imageUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            iconName: freezed == iconName
                ? _value.iconName
                : iconName // ignore: cast_nullable_to_non_nullable
                      as String?,
            color: freezed == color
                ? _value.color
                : color // ignore: cast_nullable_to_non_nullable
                      as String?,
            isActive: null == isActive
                ? _value.isActive
                : isActive // ignore: cast_nullable_to_non_nullable
                      as bool,
            isFeatured: null == isFeatured
                ? _value.isFeatured
                : isFeatured // ignore: cast_nullable_to_non_nullable
                      as bool,
            isAvailable: null == isAvailable
                ? _value.isAvailable
                : isAvailable // ignore: cast_nullable_to_non_nullable
                      as bool,
            maxBookingsPerDay: freezed == maxBookingsPerDay
                ? _value.maxBookingsPerDay
                : maxBookingsPerDay // ignore: cast_nullable_to_non_nullable
                      as int?,
            advanceNoticeDays: freezed == advanceNoticeDays
                ? _value.advanceNoticeDays
                : advanceNoticeDays // ignore: cast_nullable_to_non_nullable
                      as int?,
            sortOrder: null == sortOrder
                ? _value.sortOrder
                : sortOrder // ignore: cast_nullable_to_non_nullable
                      as int,
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
            requirements: freezed == requirements
                ? _value.requirements
                : requirements // ignore: cast_nullable_to_non_nullable
                      as String?,
            cancellationPolicy: freezed == cancellationPolicy
                ? _value.cancellationPolicy
                : cancellationPolicy // ignore: cast_nullable_to_non_nullable
                      as String?,
            bookingCount: null == bookingCount
                ? _value.bookingCount
                : bookingCount // ignore: cast_nullable_to_non_nullable
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
abstract class _$$ServiceDetailImplCopyWith<$Res>
    implements $ServiceDetailCopyWith<$Res> {
  factory _$$ServiceDetailImplCopyWith(
    _$ServiceDetailImpl value,
    $Res Function(_$ServiceDetailImpl) then,
  ) = __$$ServiceDetailImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String name,
    String slug,
    String? description,
    String? shortDesc,
    String? price,
    String? priceLabel,
    String currency,
    String? duration,
    int? durationMinutes,
    String? imageUrl,
    String? iconName,
    String? color,
    bool isActive,
    bool isFeatured,
    bool isAvailable,
    int? maxBookingsPerDay,
    int? advanceNoticeDays,
    int sortOrder,
    String? metaTitle,
    String? metaDescription,
    List<String> metaKeywords,
    String? requirements,
    String? cancellationPolicy,
    int bookingCount,
    int viewCount,
    String createdAt,
    String updatedAt,
  });
}

/// @nodoc
class __$$ServiceDetailImplCopyWithImpl<$Res>
    extends _$ServiceDetailCopyWithImpl<$Res, _$ServiceDetailImpl>
    implements _$$ServiceDetailImplCopyWith<$Res> {
  __$$ServiceDetailImplCopyWithImpl(
    _$ServiceDetailImpl _value,
    $Res Function(_$ServiceDetailImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ServiceDetail
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? slug = null,
    Object? description = freezed,
    Object? shortDesc = freezed,
    Object? price = freezed,
    Object? priceLabel = freezed,
    Object? currency = null,
    Object? duration = freezed,
    Object? durationMinutes = freezed,
    Object? imageUrl = freezed,
    Object? iconName = freezed,
    Object? color = freezed,
    Object? isActive = null,
    Object? isFeatured = null,
    Object? isAvailable = null,
    Object? maxBookingsPerDay = freezed,
    Object? advanceNoticeDays = freezed,
    Object? sortOrder = null,
    Object? metaTitle = freezed,
    Object? metaDescription = freezed,
    Object? metaKeywords = null,
    Object? requirements = freezed,
    Object? cancellationPolicy = freezed,
    Object? bookingCount = null,
    Object? viewCount = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _$ServiceDetailImpl(
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
        shortDesc: freezed == shortDesc
            ? _value.shortDesc
            : shortDesc // ignore: cast_nullable_to_non_nullable
                  as String?,
        price: freezed == price
            ? _value.price
            : price // ignore: cast_nullable_to_non_nullable
                  as String?,
        priceLabel: freezed == priceLabel
            ? _value.priceLabel
            : priceLabel // ignore: cast_nullable_to_non_nullable
                  as String?,
        currency: null == currency
            ? _value.currency
            : currency // ignore: cast_nullable_to_non_nullable
                  as String,
        duration: freezed == duration
            ? _value.duration
            : duration // ignore: cast_nullable_to_non_nullable
                  as String?,
        durationMinutes: freezed == durationMinutes
            ? _value.durationMinutes
            : durationMinutes // ignore: cast_nullable_to_non_nullable
                  as int?,
        imageUrl: freezed == imageUrl
            ? _value.imageUrl
            : imageUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        iconName: freezed == iconName
            ? _value.iconName
            : iconName // ignore: cast_nullable_to_non_nullable
                  as String?,
        color: freezed == color
            ? _value.color
            : color // ignore: cast_nullable_to_non_nullable
                  as String?,
        isActive: null == isActive
            ? _value.isActive
            : isActive // ignore: cast_nullable_to_non_nullable
                  as bool,
        isFeatured: null == isFeatured
            ? _value.isFeatured
            : isFeatured // ignore: cast_nullable_to_non_nullable
                  as bool,
        isAvailable: null == isAvailable
            ? _value.isAvailable
            : isAvailable // ignore: cast_nullable_to_non_nullable
                  as bool,
        maxBookingsPerDay: freezed == maxBookingsPerDay
            ? _value.maxBookingsPerDay
            : maxBookingsPerDay // ignore: cast_nullable_to_non_nullable
                  as int?,
        advanceNoticeDays: freezed == advanceNoticeDays
            ? _value.advanceNoticeDays
            : advanceNoticeDays // ignore: cast_nullable_to_non_nullable
                  as int?,
        sortOrder: null == sortOrder
            ? _value.sortOrder
            : sortOrder // ignore: cast_nullable_to_non_nullable
                  as int,
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
        requirements: freezed == requirements
            ? _value.requirements
            : requirements // ignore: cast_nullable_to_non_nullable
                  as String?,
        cancellationPolicy: freezed == cancellationPolicy
            ? _value.cancellationPolicy
            : cancellationPolicy // ignore: cast_nullable_to_non_nullable
                  as String?,
        bookingCount: null == bookingCount
            ? _value.bookingCount
            : bookingCount // ignore: cast_nullable_to_non_nullable
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
class _$ServiceDetailImpl implements _ServiceDetail {
  const _$ServiceDetailImpl({
    required this.id,
    required this.name,
    required this.slug,
    this.description,
    this.shortDesc,
    this.price,
    this.priceLabel,
    this.currency = 'ARS',
    this.duration,
    this.durationMinutes,
    this.imageUrl,
    this.iconName,
    this.color,
    this.isActive = true,
    this.isFeatured = false,
    this.isAvailable = true,
    this.maxBookingsPerDay,
    this.advanceNoticeDays,
    this.sortOrder = 0,
    this.metaTitle,
    this.metaDescription,
    final List<String> metaKeywords = const [],
    this.requirements,
    this.cancellationPolicy,
    this.bookingCount = 0,
    this.viewCount = 0,
    required this.createdAt,
    required this.updatedAt,
  }) : _metaKeywords = metaKeywords;

  factory _$ServiceDetailImpl.fromJson(Map<String, dynamic> json) =>
      _$$ServiceDetailImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String slug;
  @override
  final String? description;
  @override
  final String? shortDesc;
  @override
  final String? price;
  @override
  final String? priceLabel;
  @override
  @JsonKey()
  final String currency;
  @override
  final String? duration;
  @override
  final int? durationMinutes;
  @override
  final String? imageUrl;
  @override
  final String? iconName;
  @override
  final String? color;
  @override
  @JsonKey()
  final bool isActive;
  @override
  @JsonKey()
  final bool isFeatured;
  @override
  @JsonKey()
  final bool isAvailable;
  @override
  final int? maxBookingsPerDay;
  @override
  final int? advanceNoticeDays;
  @override
  @JsonKey()
  final int sortOrder;
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
  final String? requirements;
  @override
  final String? cancellationPolicy;
  @override
  @JsonKey()
  final int bookingCount;
  @override
  @JsonKey()
  final int viewCount;
  @override
  final String createdAt;
  @override
  final String updatedAt;

  @override
  String toString() {
    return 'ServiceDetail(id: $id, name: $name, slug: $slug, description: $description, shortDesc: $shortDesc, price: $price, priceLabel: $priceLabel, currency: $currency, duration: $duration, durationMinutes: $durationMinutes, imageUrl: $imageUrl, iconName: $iconName, color: $color, isActive: $isActive, isFeatured: $isFeatured, isAvailable: $isAvailable, maxBookingsPerDay: $maxBookingsPerDay, advanceNoticeDays: $advanceNoticeDays, sortOrder: $sortOrder, metaTitle: $metaTitle, metaDescription: $metaDescription, metaKeywords: $metaKeywords, requirements: $requirements, cancellationPolicy: $cancellationPolicy, bookingCount: $bookingCount, viewCount: $viewCount, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ServiceDetailImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.slug, slug) || other.slug == slug) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.shortDesc, shortDesc) ||
                other.shortDesc == shortDesc) &&
            (identical(other.price, price) || other.price == price) &&
            (identical(other.priceLabel, priceLabel) ||
                other.priceLabel == priceLabel) &&
            (identical(other.currency, currency) ||
                other.currency == currency) &&
            (identical(other.duration, duration) ||
                other.duration == duration) &&
            (identical(other.durationMinutes, durationMinutes) ||
                other.durationMinutes == durationMinutes) &&
            (identical(other.imageUrl, imageUrl) ||
                other.imageUrl == imageUrl) &&
            (identical(other.iconName, iconName) ||
                other.iconName == iconName) &&
            (identical(other.color, color) || other.color == color) &&
            (identical(other.isActive, isActive) ||
                other.isActive == isActive) &&
            (identical(other.isFeatured, isFeatured) ||
                other.isFeatured == isFeatured) &&
            (identical(other.isAvailable, isAvailable) ||
                other.isAvailable == isAvailable) &&
            (identical(other.maxBookingsPerDay, maxBookingsPerDay) ||
                other.maxBookingsPerDay == maxBookingsPerDay) &&
            (identical(other.advanceNoticeDays, advanceNoticeDays) ||
                other.advanceNoticeDays == advanceNoticeDays) &&
            (identical(other.sortOrder, sortOrder) ||
                other.sortOrder == sortOrder) &&
            (identical(other.metaTitle, metaTitle) ||
                other.metaTitle == metaTitle) &&
            (identical(other.metaDescription, metaDescription) ||
                other.metaDescription == metaDescription) &&
            const DeepCollectionEquality().equals(
              other._metaKeywords,
              _metaKeywords,
            ) &&
            (identical(other.requirements, requirements) ||
                other.requirements == requirements) &&
            (identical(other.cancellationPolicy, cancellationPolicy) ||
                other.cancellationPolicy == cancellationPolicy) &&
            (identical(other.bookingCount, bookingCount) ||
                other.bookingCount == bookingCount) &&
            (identical(other.viewCount, viewCount) ||
                other.viewCount == viewCount) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hashAll([
    runtimeType,
    id,
    name,
    slug,
    description,
    shortDesc,
    price,
    priceLabel,
    currency,
    duration,
    durationMinutes,
    imageUrl,
    iconName,
    color,
    isActive,
    isFeatured,
    isAvailable,
    maxBookingsPerDay,
    advanceNoticeDays,
    sortOrder,
    metaTitle,
    metaDescription,
    const DeepCollectionEquality().hash(_metaKeywords),
    requirements,
    cancellationPolicy,
    bookingCount,
    viewCount,
    createdAt,
    updatedAt,
  ]);

  /// Create a copy of ServiceDetail
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ServiceDetailImplCopyWith<_$ServiceDetailImpl> get copyWith =>
      __$$ServiceDetailImplCopyWithImpl<_$ServiceDetailImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ServiceDetailImplToJson(this);
  }
}

abstract class _ServiceDetail implements ServiceDetail {
  const factory _ServiceDetail({
    required final String id,
    required final String name,
    required final String slug,
    final String? description,
    final String? shortDesc,
    final String? price,
    final String? priceLabel,
    final String currency,
    final String? duration,
    final int? durationMinutes,
    final String? imageUrl,
    final String? iconName,
    final String? color,
    final bool isActive,
    final bool isFeatured,
    final bool isAvailable,
    final int? maxBookingsPerDay,
    final int? advanceNoticeDays,
    final int sortOrder,
    final String? metaTitle,
    final String? metaDescription,
    final List<String> metaKeywords,
    final String? requirements,
    final String? cancellationPolicy,
    final int bookingCount,
    final int viewCount,
    required final String createdAt,
    required final String updatedAt,
  }) = _$ServiceDetailImpl;

  factory _ServiceDetail.fromJson(Map<String, dynamic> json) =
      _$ServiceDetailImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get slug;
  @override
  String? get description;
  @override
  String? get shortDesc;
  @override
  String? get price;
  @override
  String? get priceLabel;
  @override
  String get currency;
  @override
  String? get duration;
  @override
  int? get durationMinutes;
  @override
  String? get imageUrl;
  @override
  String? get iconName;
  @override
  String? get color;
  @override
  bool get isActive;
  @override
  bool get isFeatured;
  @override
  bool get isAvailable;
  @override
  int? get maxBookingsPerDay;
  @override
  int? get advanceNoticeDays;
  @override
  int get sortOrder;
  @override
  String? get metaTitle;
  @override
  String? get metaDescription;
  @override
  List<String> get metaKeywords;
  @override
  String? get requirements;
  @override
  String? get cancellationPolicy;
  @override
  int get bookingCount;
  @override
  int get viewCount;
  @override
  String get createdAt;
  @override
  String get updatedAt;

  /// Create a copy of ServiceDetail
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ServiceDetailImplCopyWith<_$ServiceDetailImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
