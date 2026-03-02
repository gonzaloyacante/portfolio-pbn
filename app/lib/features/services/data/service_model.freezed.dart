// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'service_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ServiceItem {

 String get id; String get name; String get slug; String? get shortDesc; String? get price; String? get priceLabel; String get currency; String? get duration; String? get imageUrl; String? get iconName; String? get color; bool get isActive; bool get isFeatured; bool get isAvailable; int get sortOrder; int get bookingCount; int get viewCount; String get createdAt; String get updatedAt;
/// Create a copy of ServiceItem
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ServiceItemCopyWith<ServiceItem> get copyWith => _$ServiceItemCopyWithImpl<ServiceItem>(this as ServiceItem, _$identity);

  /// Serializes this ServiceItem to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ServiceItem&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.slug, slug) || other.slug == slug)&&(identical(other.shortDesc, shortDesc) || other.shortDesc == shortDesc)&&(identical(other.price, price) || other.price == price)&&(identical(other.priceLabel, priceLabel) || other.priceLabel == priceLabel)&&(identical(other.currency, currency) || other.currency == currency)&&(identical(other.duration, duration) || other.duration == duration)&&(identical(other.imageUrl, imageUrl) || other.imageUrl == imageUrl)&&(identical(other.iconName, iconName) || other.iconName == iconName)&&(identical(other.color, color) || other.color == color)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.isFeatured, isFeatured) || other.isFeatured == isFeatured)&&(identical(other.isAvailable, isAvailable) || other.isAvailable == isAvailable)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder)&&(identical(other.bookingCount, bookingCount) || other.bookingCount == bookingCount)&&(identical(other.viewCount, viewCount) || other.viewCount == viewCount)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hashAll([runtimeType,id,name,slug,shortDesc,price,priceLabel,currency,duration,imageUrl,iconName,color,isActive,isFeatured,isAvailable,sortOrder,bookingCount,viewCount,createdAt,updatedAt]);

@override
String toString() {
  return 'ServiceItem(id: $id, name: $name, slug: $slug, shortDesc: $shortDesc, price: $price, priceLabel: $priceLabel, currency: $currency, duration: $duration, imageUrl: $imageUrl, iconName: $iconName, color: $color, isActive: $isActive, isFeatured: $isFeatured, isAvailable: $isAvailable, sortOrder: $sortOrder, bookingCount: $bookingCount, viewCount: $viewCount, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $ServiceItemCopyWith<$Res>  {
  factory $ServiceItemCopyWith(ServiceItem value, $Res Function(ServiceItem) _then) = _$ServiceItemCopyWithImpl;
@useResult
$Res call({
 String id, String name, String slug, String? shortDesc, String? price, String? priceLabel, String currency, String? duration, String? imageUrl, String? iconName, String? color, bool isActive, bool isFeatured, bool isAvailable, int sortOrder, int bookingCount, int viewCount, String createdAt, String updatedAt
});




}
/// @nodoc
class _$ServiceItemCopyWithImpl<$Res>
    implements $ServiceItemCopyWith<$Res> {
  _$ServiceItemCopyWithImpl(this._self, this._then);

  final ServiceItem _self;
  final $Res Function(ServiceItem) _then;

/// Create a copy of ServiceItem
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? slug = null,Object? shortDesc = freezed,Object? price = freezed,Object? priceLabel = freezed,Object? currency = null,Object? duration = freezed,Object? imageUrl = freezed,Object? iconName = freezed,Object? color = freezed,Object? isActive = null,Object? isFeatured = null,Object? isAvailable = null,Object? sortOrder = null,Object? bookingCount = null,Object? viewCount = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,slug: null == slug ? _self.slug : slug // ignore: cast_nullable_to_non_nullable
as String,shortDesc: freezed == shortDesc ? _self.shortDesc : shortDesc // ignore: cast_nullable_to_non_nullable
as String?,price: freezed == price ? _self.price : price // ignore: cast_nullable_to_non_nullable
as String?,priceLabel: freezed == priceLabel ? _self.priceLabel : priceLabel // ignore: cast_nullable_to_non_nullable
as String?,currency: null == currency ? _self.currency : currency // ignore: cast_nullable_to_non_nullable
as String,duration: freezed == duration ? _self.duration : duration // ignore: cast_nullable_to_non_nullable
as String?,imageUrl: freezed == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
as String?,iconName: freezed == iconName ? _self.iconName : iconName // ignore: cast_nullable_to_non_nullable
as String?,color: freezed == color ? _self.color : color // ignore: cast_nullable_to_non_nullable
as String?,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,isFeatured: null == isFeatured ? _self.isFeatured : isFeatured // ignore: cast_nullable_to_non_nullable
as bool,isAvailable: null == isAvailable ? _self.isAvailable : isAvailable // ignore: cast_nullable_to_non_nullable
as bool,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,bookingCount: null == bookingCount ? _self.bookingCount : bookingCount // ignore: cast_nullable_to_non_nullable
as int,viewCount: null == viewCount ? _self.viewCount : viewCount // ignore: cast_nullable_to_non_nullable
as int,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [ServiceItem].
extension ServiceItemPatterns on ServiceItem {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ServiceItem value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ServiceItem() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ServiceItem value)  $default,){
final _that = this;
switch (_that) {
case _ServiceItem():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ServiceItem value)?  $default,){
final _that = this;
switch (_that) {
case _ServiceItem() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String name,  String slug,  String? shortDesc,  String? price,  String? priceLabel,  String currency,  String? duration,  String? imageUrl,  String? iconName,  String? color,  bool isActive,  bool isFeatured,  bool isAvailable,  int sortOrder,  int bookingCount,  int viewCount,  String createdAt,  String updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ServiceItem() when $default != null:
return $default(_that.id,_that.name,_that.slug,_that.shortDesc,_that.price,_that.priceLabel,_that.currency,_that.duration,_that.imageUrl,_that.iconName,_that.color,_that.isActive,_that.isFeatured,_that.isAvailable,_that.sortOrder,_that.bookingCount,_that.viewCount,_that.createdAt,_that.updatedAt);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String name,  String slug,  String? shortDesc,  String? price,  String? priceLabel,  String currency,  String? duration,  String? imageUrl,  String? iconName,  String? color,  bool isActive,  bool isFeatured,  bool isAvailable,  int sortOrder,  int bookingCount,  int viewCount,  String createdAt,  String updatedAt)  $default,) {final _that = this;
switch (_that) {
case _ServiceItem():
return $default(_that.id,_that.name,_that.slug,_that.shortDesc,_that.price,_that.priceLabel,_that.currency,_that.duration,_that.imageUrl,_that.iconName,_that.color,_that.isActive,_that.isFeatured,_that.isAvailable,_that.sortOrder,_that.bookingCount,_that.viewCount,_that.createdAt,_that.updatedAt);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String name,  String slug,  String? shortDesc,  String? price,  String? priceLabel,  String currency,  String? duration,  String? imageUrl,  String? iconName,  String? color,  bool isActive,  bool isFeatured,  bool isAvailable,  int sortOrder,  int bookingCount,  int viewCount,  String createdAt,  String updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _ServiceItem() when $default != null:
return $default(_that.id,_that.name,_that.slug,_that.shortDesc,_that.price,_that.priceLabel,_that.currency,_that.duration,_that.imageUrl,_that.iconName,_that.color,_that.isActive,_that.isFeatured,_that.isAvailable,_that.sortOrder,_that.bookingCount,_that.viewCount,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ServiceItem implements ServiceItem {
  const _ServiceItem({required this.id, required this.name, required this.slug, this.shortDesc, this.price, this.priceLabel, this.currency = 'EUR', this.duration, this.imageUrl, this.iconName, this.color, this.isActive = true, this.isFeatured = false, this.isAvailable = true, this.sortOrder = 0, this.bookingCount = 0, this.viewCount = 0, required this.createdAt, required this.updatedAt});
  factory _ServiceItem.fromJson(Map<String, dynamic> json) => _$ServiceItemFromJson(json);

@override final  String id;
@override final  String name;
@override final  String slug;
@override final  String? shortDesc;
@override final  String? price;
@override final  String? priceLabel;
@override@JsonKey() final  String currency;
@override final  String? duration;
@override final  String? imageUrl;
@override final  String? iconName;
@override final  String? color;
@override@JsonKey() final  bool isActive;
@override@JsonKey() final  bool isFeatured;
@override@JsonKey() final  bool isAvailable;
@override@JsonKey() final  int sortOrder;
@override@JsonKey() final  int bookingCount;
@override@JsonKey() final  int viewCount;
@override final  String createdAt;
@override final  String updatedAt;

/// Create a copy of ServiceItem
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ServiceItemCopyWith<_ServiceItem> get copyWith => __$ServiceItemCopyWithImpl<_ServiceItem>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ServiceItemToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ServiceItem&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.slug, slug) || other.slug == slug)&&(identical(other.shortDesc, shortDesc) || other.shortDesc == shortDesc)&&(identical(other.price, price) || other.price == price)&&(identical(other.priceLabel, priceLabel) || other.priceLabel == priceLabel)&&(identical(other.currency, currency) || other.currency == currency)&&(identical(other.duration, duration) || other.duration == duration)&&(identical(other.imageUrl, imageUrl) || other.imageUrl == imageUrl)&&(identical(other.iconName, iconName) || other.iconName == iconName)&&(identical(other.color, color) || other.color == color)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.isFeatured, isFeatured) || other.isFeatured == isFeatured)&&(identical(other.isAvailable, isAvailable) || other.isAvailable == isAvailable)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder)&&(identical(other.bookingCount, bookingCount) || other.bookingCount == bookingCount)&&(identical(other.viewCount, viewCount) || other.viewCount == viewCount)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hashAll([runtimeType,id,name,slug,shortDesc,price,priceLabel,currency,duration,imageUrl,iconName,color,isActive,isFeatured,isAvailable,sortOrder,bookingCount,viewCount,createdAt,updatedAt]);

@override
String toString() {
  return 'ServiceItem(id: $id, name: $name, slug: $slug, shortDesc: $shortDesc, price: $price, priceLabel: $priceLabel, currency: $currency, duration: $duration, imageUrl: $imageUrl, iconName: $iconName, color: $color, isActive: $isActive, isFeatured: $isFeatured, isAvailable: $isAvailable, sortOrder: $sortOrder, bookingCount: $bookingCount, viewCount: $viewCount, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$ServiceItemCopyWith<$Res> implements $ServiceItemCopyWith<$Res> {
  factory _$ServiceItemCopyWith(_ServiceItem value, $Res Function(_ServiceItem) _then) = __$ServiceItemCopyWithImpl;
@override @useResult
$Res call({
 String id, String name, String slug, String? shortDesc, String? price, String? priceLabel, String currency, String? duration, String? imageUrl, String? iconName, String? color, bool isActive, bool isFeatured, bool isAvailable, int sortOrder, int bookingCount, int viewCount, String createdAt, String updatedAt
});




}
/// @nodoc
class __$ServiceItemCopyWithImpl<$Res>
    implements _$ServiceItemCopyWith<$Res> {
  __$ServiceItemCopyWithImpl(this._self, this._then);

  final _ServiceItem _self;
  final $Res Function(_ServiceItem) _then;

/// Create a copy of ServiceItem
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? slug = null,Object? shortDesc = freezed,Object? price = freezed,Object? priceLabel = freezed,Object? currency = null,Object? duration = freezed,Object? imageUrl = freezed,Object? iconName = freezed,Object? color = freezed,Object? isActive = null,Object? isFeatured = null,Object? isAvailable = null,Object? sortOrder = null,Object? bookingCount = null,Object? viewCount = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_ServiceItem(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,slug: null == slug ? _self.slug : slug // ignore: cast_nullable_to_non_nullable
as String,shortDesc: freezed == shortDesc ? _self.shortDesc : shortDesc // ignore: cast_nullable_to_non_nullable
as String?,price: freezed == price ? _self.price : price // ignore: cast_nullable_to_non_nullable
as String?,priceLabel: freezed == priceLabel ? _self.priceLabel : priceLabel // ignore: cast_nullable_to_non_nullable
as String?,currency: null == currency ? _self.currency : currency // ignore: cast_nullable_to_non_nullable
as String,duration: freezed == duration ? _self.duration : duration // ignore: cast_nullable_to_non_nullable
as String?,imageUrl: freezed == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
as String?,iconName: freezed == iconName ? _self.iconName : iconName // ignore: cast_nullable_to_non_nullable
as String?,color: freezed == color ? _self.color : color // ignore: cast_nullable_to_non_nullable
as String?,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,isFeatured: null == isFeatured ? _self.isFeatured : isFeatured // ignore: cast_nullable_to_non_nullable
as bool,isAvailable: null == isAvailable ? _self.isAvailable : isAvailable // ignore: cast_nullable_to_non_nullable
as bool,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,bookingCount: null == bookingCount ? _self.bookingCount : bookingCount // ignore: cast_nullable_to_non_nullable
as int,viewCount: null == viewCount ? _self.viewCount : viewCount // ignore: cast_nullable_to_non_nullable
as int,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}


/// @nodoc
mixin _$ServiceDetail {

 String get id; String get name; String get slug; String? get description; String? get shortDesc; String? get price; String? get priceLabel; String get currency; String? get duration; int? get durationMinutes; String? get imageUrl; String? get iconName; String? get color; bool get isActive; bool get isFeatured; bool get isAvailable; int? get maxBookingsPerDay; int? get advanceNoticeDays; int get sortOrder; String? get metaTitle; String? get metaDescription; List<String> get metaKeywords; String? get requirements; String? get cancellationPolicy; int get bookingCount; int get viewCount; String get createdAt; String get updatedAt;
/// Create a copy of ServiceDetail
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ServiceDetailCopyWith<ServiceDetail> get copyWith => _$ServiceDetailCopyWithImpl<ServiceDetail>(this as ServiceDetail, _$identity);

  /// Serializes this ServiceDetail to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ServiceDetail&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.slug, slug) || other.slug == slug)&&(identical(other.description, description) || other.description == description)&&(identical(other.shortDesc, shortDesc) || other.shortDesc == shortDesc)&&(identical(other.price, price) || other.price == price)&&(identical(other.priceLabel, priceLabel) || other.priceLabel == priceLabel)&&(identical(other.currency, currency) || other.currency == currency)&&(identical(other.duration, duration) || other.duration == duration)&&(identical(other.durationMinutes, durationMinutes) || other.durationMinutes == durationMinutes)&&(identical(other.imageUrl, imageUrl) || other.imageUrl == imageUrl)&&(identical(other.iconName, iconName) || other.iconName == iconName)&&(identical(other.color, color) || other.color == color)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.isFeatured, isFeatured) || other.isFeatured == isFeatured)&&(identical(other.isAvailable, isAvailable) || other.isAvailable == isAvailable)&&(identical(other.maxBookingsPerDay, maxBookingsPerDay) || other.maxBookingsPerDay == maxBookingsPerDay)&&(identical(other.advanceNoticeDays, advanceNoticeDays) || other.advanceNoticeDays == advanceNoticeDays)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder)&&(identical(other.metaTitle, metaTitle) || other.metaTitle == metaTitle)&&(identical(other.metaDescription, metaDescription) || other.metaDescription == metaDescription)&&const DeepCollectionEquality().equals(other.metaKeywords, metaKeywords)&&(identical(other.requirements, requirements) || other.requirements == requirements)&&(identical(other.cancellationPolicy, cancellationPolicy) || other.cancellationPolicy == cancellationPolicy)&&(identical(other.bookingCount, bookingCount) || other.bookingCount == bookingCount)&&(identical(other.viewCount, viewCount) || other.viewCount == viewCount)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hashAll([runtimeType,id,name,slug,description,shortDesc,price,priceLabel,currency,duration,durationMinutes,imageUrl,iconName,color,isActive,isFeatured,isAvailable,maxBookingsPerDay,advanceNoticeDays,sortOrder,metaTitle,metaDescription,const DeepCollectionEquality().hash(metaKeywords),requirements,cancellationPolicy,bookingCount,viewCount,createdAt,updatedAt]);

@override
String toString() {
  return 'ServiceDetail(id: $id, name: $name, slug: $slug, description: $description, shortDesc: $shortDesc, price: $price, priceLabel: $priceLabel, currency: $currency, duration: $duration, durationMinutes: $durationMinutes, imageUrl: $imageUrl, iconName: $iconName, color: $color, isActive: $isActive, isFeatured: $isFeatured, isAvailable: $isAvailable, maxBookingsPerDay: $maxBookingsPerDay, advanceNoticeDays: $advanceNoticeDays, sortOrder: $sortOrder, metaTitle: $metaTitle, metaDescription: $metaDescription, metaKeywords: $metaKeywords, requirements: $requirements, cancellationPolicy: $cancellationPolicy, bookingCount: $bookingCount, viewCount: $viewCount, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $ServiceDetailCopyWith<$Res>  {
  factory $ServiceDetailCopyWith(ServiceDetail value, $Res Function(ServiceDetail) _then) = _$ServiceDetailCopyWithImpl;
@useResult
$Res call({
 String id, String name, String slug, String? description, String? shortDesc, String? price, String? priceLabel, String currency, String? duration, int? durationMinutes, String? imageUrl, String? iconName, String? color, bool isActive, bool isFeatured, bool isAvailable, int? maxBookingsPerDay, int? advanceNoticeDays, int sortOrder, String? metaTitle, String? metaDescription, List<String> metaKeywords, String? requirements, String? cancellationPolicy, int bookingCount, int viewCount, String createdAt, String updatedAt
});




}
/// @nodoc
class _$ServiceDetailCopyWithImpl<$Res>
    implements $ServiceDetailCopyWith<$Res> {
  _$ServiceDetailCopyWithImpl(this._self, this._then);

  final ServiceDetail _self;
  final $Res Function(ServiceDetail) _then;

/// Create a copy of ServiceDetail
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? slug = null,Object? description = freezed,Object? shortDesc = freezed,Object? price = freezed,Object? priceLabel = freezed,Object? currency = null,Object? duration = freezed,Object? durationMinutes = freezed,Object? imageUrl = freezed,Object? iconName = freezed,Object? color = freezed,Object? isActive = null,Object? isFeatured = null,Object? isAvailable = null,Object? maxBookingsPerDay = freezed,Object? advanceNoticeDays = freezed,Object? sortOrder = null,Object? metaTitle = freezed,Object? metaDescription = freezed,Object? metaKeywords = null,Object? requirements = freezed,Object? cancellationPolicy = freezed,Object? bookingCount = null,Object? viewCount = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,slug: null == slug ? _self.slug : slug // ignore: cast_nullable_to_non_nullable
as String,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,shortDesc: freezed == shortDesc ? _self.shortDesc : shortDesc // ignore: cast_nullable_to_non_nullable
as String?,price: freezed == price ? _self.price : price // ignore: cast_nullable_to_non_nullable
as String?,priceLabel: freezed == priceLabel ? _self.priceLabel : priceLabel // ignore: cast_nullable_to_non_nullable
as String?,currency: null == currency ? _self.currency : currency // ignore: cast_nullable_to_non_nullable
as String,duration: freezed == duration ? _self.duration : duration // ignore: cast_nullable_to_non_nullable
as String?,durationMinutes: freezed == durationMinutes ? _self.durationMinutes : durationMinutes // ignore: cast_nullable_to_non_nullable
as int?,imageUrl: freezed == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
as String?,iconName: freezed == iconName ? _self.iconName : iconName // ignore: cast_nullable_to_non_nullable
as String?,color: freezed == color ? _self.color : color // ignore: cast_nullable_to_non_nullable
as String?,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,isFeatured: null == isFeatured ? _self.isFeatured : isFeatured // ignore: cast_nullable_to_non_nullable
as bool,isAvailable: null == isAvailable ? _self.isAvailable : isAvailable // ignore: cast_nullable_to_non_nullable
as bool,maxBookingsPerDay: freezed == maxBookingsPerDay ? _self.maxBookingsPerDay : maxBookingsPerDay // ignore: cast_nullable_to_non_nullable
as int?,advanceNoticeDays: freezed == advanceNoticeDays ? _self.advanceNoticeDays : advanceNoticeDays // ignore: cast_nullable_to_non_nullable
as int?,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,metaTitle: freezed == metaTitle ? _self.metaTitle : metaTitle // ignore: cast_nullable_to_non_nullable
as String?,metaDescription: freezed == metaDescription ? _self.metaDescription : metaDescription // ignore: cast_nullable_to_non_nullable
as String?,metaKeywords: null == metaKeywords ? _self.metaKeywords : metaKeywords // ignore: cast_nullable_to_non_nullable
as List<String>,requirements: freezed == requirements ? _self.requirements : requirements // ignore: cast_nullable_to_non_nullable
as String?,cancellationPolicy: freezed == cancellationPolicy ? _self.cancellationPolicy : cancellationPolicy // ignore: cast_nullable_to_non_nullable
as String?,bookingCount: null == bookingCount ? _self.bookingCount : bookingCount // ignore: cast_nullable_to_non_nullable
as int,viewCount: null == viewCount ? _self.viewCount : viewCount // ignore: cast_nullable_to_non_nullable
as int,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [ServiceDetail].
extension ServiceDetailPatterns on ServiceDetail {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ServiceDetail value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ServiceDetail() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ServiceDetail value)  $default,){
final _that = this;
switch (_that) {
case _ServiceDetail():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ServiceDetail value)?  $default,){
final _that = this;
switch (_that) {
case _ServiceDetail() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String name,  String slug,  String? description,  String? shortDesc,  String? price,  String? priceLabel,  String currency,  String? duration,  int? durationMinutes,  String? imageUrl,  String? iconName,  String? color,  bool isActive,  bool isFeatured,  bool isAvailable,  int? maxBookingsPerDay,  int? advanceNoticeDays,  int sortOrder,  String? metaTitle,  String? metaDescription,  List<String> metaKeywords,  String? requirements,  String? cancellationPolicy,  int bookingCount,  int viewCount,  String createdAt,  String updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ServiceDetail() when $default != null:
return $default(_that.id,_that.name,_that.slug,_that.description,_that.shortDesc,_that.price,_that.priceLabel,_that.currency,_that.duration,_that.durationMinutes,_that.imageUrl,_that.iconName,_that.color,_that.isActive,_that.isFeatured,_that.isAvailable,_that.maxBookingsPerDay,_that.advanceNoticeDays,_that.sortOrder,_that.metaTitle,_that.metaDescription,_that.metaKeywords,_that.requirements,_that.cancellationPolicy,_that.bookingCount,_that.viewCount,_that.createdAt,_that.updatedAt);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String name,  String slug,  String? description,  String? shortDesc,  String? price,  String? priceLabel,  String currency,  String? duration,  int? durationMinutes,  String? imageUrl,  String? iconName,  String? color,  bool isActive,  bool isFeatured,  bool isAvailable,  int? maxBookingsPerDay,  int? advanceNoticeDays,  int sortOrder,  String? metaTitle,  String? metaDescription,  List<String> metaKeywords,  String? requirements,  String? cancellationPolicy,  int bookingCount,  int viewCount,  String createdAt,  String updatedAt)  $default,) {final _that = this;
switch (_that) {
case _ServiceDetail():
return $default(_that.id,_that.name,_that.slug,_that.description,_that.shortDesc,_that.price,_that.priceLabel,_that.currency,_that.duration,_that.durationMinutes,_that.imageUrl,_that.iconName,_that.color,_that.isActive,_that.isFeatured,_that.isAvailable,_that.maxBookingsPerDay,_that.advanceNoticeDays,_that.sortOrder,_that.metaTitle,_that.metaDescription,_that.metaKeywords,_that.requirements,_that.cancellationPolicy,_that.bookingCount,_that.viewCount,_that.createdAt,_that.updatedAt);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String name,  String slug,  String? description,  String? shortDesc,  String? price,  String? priceLabel,  String currency,  String? duration,  int? durationMinutes,  String? imageUrl,  String? iconName,  String? color,  bool isActive,  bool isFeatured,  bool isAvailable,  int? maxBookingsPerDay,  int? advanceNoticeDays,  int sortOrder,  String? metaTitle,  String? metaDescription,  List<String> metaKeywords,  String? requirements,  String? cancellationPolicy,  int bookingCount,  int viewCount,  String createdAt,  String updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _ServiceDetail() when $default != null:
return $default(_that.id,_that.name,_that.slug,_that.description,_that.shortDesc,_that.price,_that.priceLabel,_that.currency,_that.duration,_that.durationMinutes,_that.imageUrl,_that.iconName,_that.color,_that.isActive,_that.isFeatured,_that.isAvailable,_that.maxBookingsPerDay,_that.advanceNoticeDays,_that.sortOrder,_that.metaTitle,_that.metaDescription,_that.metaKeywords,_that.requirements,_that.cancellationPolicy,_that.bookingCount,_that.viewCount,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ServiceDetail implements ServiceDetail {
  const _ServiceDetail({required this.id, required this.name, required this.slug, this.description, this.shortDesc, this.price, this.priceLabel, this.currency = 'EUR', this.duration, this.durationMinutes, this.imageUrl, this.iconName, this.color, this.isActive = true, this.isFeatured = false, this.isAvailable = true, this.maxBookingsPerDay, this.advanceNoticeDays, this.sortOrder = 0, this.metaTitle, this.metaDescription, final  List<String> metaKeywords = const [], this.requirements, this.cancellationPolicy, this.bookingCount = 0, this.viewCount = 0, required this.createdAt, required this.updatedAt}): _metaKeywords = metaKeywords;
  factory _ServiceDetail.fromJson(Map<String, dynamic> json) => _$ServiceDetailFromJson(json);

@override final  String id;
@override final  String name;
@override final  String slug;
@override final  String? description;
@override final  String? shortDesc;
@override final  String? price;
@override final  String? priceLabel;
@override@JsonKey() final  String currency;
@override final  String? duration;
@override final  int? durationMinutes;
@override final  String? imageUrl;
@override final  String? iconName;
@override final  String? color;
@override@JsonKey() final  bool isActive;
@override@JsonKey() final  bool isFeatured;
@override@JsonKey() final  bool isAvailable;
@override final  int? maxBookingsPerDay;
@override final  int? advanceNoticeDays;
@override@JsonKey() final  int sortOrder;
@override final  String? metaTitle;
@override final  String? metaDescription;
 final  List<String> _metaKeywords;
@override@JsonKey() List<String> get metaKeywords {
  if (_metaKeywords is EqualUnmodifiableListView) return _metaKeywords;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_metaKeywords);
}

@override final  String? requirements;
@override final  String? cancellationPolicy;
@override@JsonKey() final  int bookingCount;
@override@JsonKey() final  int viewCount;
@override final  String createdAt;
@override final  String updatedAt;

/// Create a copy of ServiceDetail
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ServiceDetailCopyWith<_ServiceDetail> get copyWith => __$ServiceDetailCopyWithImpl<_ServiceDetail>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ServiceDetailToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ServiceDetail&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.slug, slug) || other.slug == slug)&&(identical(other.description, description) || other.description == description)&&(identical(other.shortDesc, shortDesc) || other.shortDesc == shortDesc)&&(identical(other.price, price) || other.price == price)&&(identical(other.priceLabel, priceLabel) || other.priceLabel == priceLabel)&&(identical(other.currency, currency) || other.currency == currency)&&(identical(other.duration, duration) || other.duration == duration)&&(identical(other.durationMinutes, durationMinutes) || other.durationMinutes == durationMinutes)&&(identical(other.imageUrl, imageUrl) || other.imageUrl == imageUrl)&&(identical(other.iconName, iconName) || other.iconName == iconName)&&(identical(other.color, color) || other.color == color)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.isFeatured, isFeatured) || other.isFeatured == isFeatured)&&(identical(other.isAvailable, isAvailable) || other.isAvailable == isAvailable)&&(identical(other.maxBookingsPerDay, maxBookingsPerDay) || other.maxBookingsPerDay == maxBookingsPerDay)&&(identical(other.advanceNoticeDays, advanceNoticeDays) || other.advanceNoticeDays == advanceNoticeDays)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder)&&(identical(other.metaTitle, metaTitle) || other.metaTitle == metaTitle)&&(identical(other.metaDescription, metaDescription) || other.metaDescription == metaDescription)&&const DeepCollectionEquality().equals(other._metaKeywords, _metaKeywords)&&(identical(other.requirements, requirements) || other.requirements == requirements)&&(identical(other.cancellationPolicy, cancellationPolicy) || other.cancellationPolicy == cancellationPolicy)&&(identical(other.bookingCount, bookingCount) || other.bookingCount == bookingCount)&&(identical(other.viewCount, viewCount) || other.viewCount == viewCount)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hashAll([runtimeType,id,name,slug,description,shortDesc,price,priceLabel,currency,duration,durationMinutes,imageUrl,iconName,color,isActive,isFeatured,isAvailable,maxBookingsPerDay,advanceNoticeDays,sortOrder,metaTitle,metaDescription,const DeepCollectionEquality().hash(_metaKeywords),requirements,cancellationPolicy,bookingCount,viewCount,createdAt,updatedAt]);

@override
String toString() {
  return 'ServiceDetail(id: $id, name: $name, slug: $slug, description: $description, shortDesc: $shortDesc, price: $price, priceLabel: $priceLabel, currency: $currency, duration: $duration, durationMinutes: $durationMinutes, imageUrl: $imageUrl, iconName: $iconName, color: $color, isActive: $isActive, isFeatured: $isFeatured, isAvailable: $isAvailable, maxBookingsPerDay: $maxBookingsPerDay, advanceNoticeDays: $advanceNoticeDays, sortOrder: $sortOrder, metaTitle: $metaTitle, metaDescription: $metaDescription, metaKeywords: $metaKeywords, requirements: $requirements, cancellationPolicy: $cancellationPolicy, bookingCount: $bookingCount, viewCount: $viewCount, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$ServiceDetailCopyWith<$Res> implements $ServiceDetailCopyWith<$Res> {
  factory _$ServiceDetailCopyWith(_ServiceDetail value, $Res Function(_ServiceDetail) _then) = __$ServiceDetailCopyWithImpl;
@override @useResult
$Res call({
 String id, String name, String slug, String? description, String? shortDesc, String? price, String? priceLabel, String currency, String? duration, int? durationMinutes, String? imageUrl, String? iconName, String? color, bool isActive, bool isFeatured, bool isAvailable, int? maxBookingsPerDay, int? advanceNoticeDays, int sortOrder, String? metaTitle, String? metaDescription, List<String> metaKeywords, String? requirements, String? cancellationPolicy, int bookingCount, int viewCount, String createdAt, String updatedAt
});




}
/// @nodoc
class __$ServiceDetailCopyWithImpl<$Res>
    implements _$ServiceDetailCopyWith<$Res> {
  __$ServiceDetailCopyWithImpl(this._self, this._then);

  final _ServiceDetail _self;
  final $Res Function(_ServiceDetail) _then;

/// Create a copy of ServiceDetail
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? slug = null,Object? description = freezed,Object? shortDesc = freezed,Object? price = freezed,Object? priceLabel = freezed,Object? currency = null,Object? duration = freezed,Object? durationMinutes = freezed,Object? imageUrl = freezed,Object? iconName = freezed,Object? color = freezed,Object? isActive = null,Object? isFeatured = null,Object? isAvailable = null,Object? maxBookingsPerDay = freezed,Object? advanceNoticeDays = freezed,Object? sortOrder = null,Object? metaTitle = freezed,Object? metaDescription = freezed,Object? metaKeywords = null,Object? requirements = freezed,Object? cancellationPolicy = freezed,Object? bookingCount = null,Object? viewCount = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_ServiceDetail(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,slug: null == slug ? _self.slug : slug // ignore: cast_nullable_to_non_nullable
as String,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,shortDesc: freezed == shortDesc ? _self.shortDesc : shortDesc // ignore: cast_nullable_to_non_nullable
as String?,price: freezed == price ? _self.price : price // ignore: cast_nullable_to_non_nullable
as String?,priceLabel: freezed == priceLabel ? _self.priceLabel : priceLabel // ignore: cast_nullable_to_non_nullable
as String?,currency: null == currency ? _self.currency : currency // ignore: cast_nullable_to_non_nullable
as String,duration: freezed == duration ? _self.duration : duration // ignore: cast_nullable_to_non_nullable
as String?,durationMinutes: freezed == durationMinutes ? _self.durationMinutes : durationMinutes // ignore: cast_nullable_to_non_nullable
as int?,imageUrl: freezed == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
as String?,iconName: freezed == iconName ? _self.iconName : iconName // ignore: cast_nullable_to_non_nullable
as String?,color: freezed == color ? _self.color : color // ignore: cast_nullable_to_non_nullable
as String?,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,isFeatured: null == isFeatured ? _self.isFeatured : isFeatured // ignore: cast_nullable_to_non_nullable
as bool,isAvailable: null == isAvailable ? _self.isAvailable : isAvailable // ignore: cast_nullable_to_non_nullable
as bool,maxBookingsPerDay: freezed == maxBookingsPerDay ? _self.maxBookingsPerDay : maxBookingsPerDay // ignore: cast_nullable_to_non_nullable
as int?,advanceNoticeDays: freezed == advanceNoticeDays ? _self.advanceNoticeDays : advanceNoticeDays // ignore: cast_nullable_to_non_nullable
as int?,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,metaTitle: freezed == metaTitle ? _self.metaTitle : metaTitle // ignore: cast_nullable_to_non_nullable
as String?,metaDescription: freezed == metaDescription ? _self.metaDescription : metaDescription // ignore: cast_nullable_to_non_nullable
as String?,metaKeywords: null == metaKeywords ? _self._metaKeywords : metaKeywords // ignore: cast_nullable_to_non_nullable
as List<String>,requirements: freezed == requirements ? _self.requirements : requirements // ignore: cast_nullable_to_non_nullable
as String?,cancellationPolicy: freezed == cancellationPolicy ? _self.cancellationPolicy : cancellationPolicy // ignore: cast_nullable_to_non_nullable
as String?,bookingCount: null == bookingCount ? _self.bookingCount : bookingCount // ignore: cast_nullable_to_non_nullable
as int,viewCount: null == viewCount ? _self.viewCount : viewCount // ignore: cast_nullable_to_non_nullable
as int,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
