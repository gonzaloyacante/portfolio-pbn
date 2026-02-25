// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'testimonial_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$TestimonialItem {

 String get id; String get name; String? get excerpt; String? get position; String? get company; String? get avatarUrl; int get rating; bool get verified; bool get featured; String get status; bool get isActive; int get sortOrder; int get viewCount; DateTime get createdAt; DateTime get updatedAt;
/// Create a copy of TestimonialItem
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$TestimonialItemCopyWith<TestimonialItem> get copyWith => _$TestimonialItemCopyWithImpl<TestimonialItem>(this as TestimonialItem, _$identity);

  /// Serializes this TestimonialItem to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is TestimonialItem&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.excerpt, excerpt) || other.excerpt == excerpt)&&(identical(other.position, position) || other.position == position)&&(identical(other.company, company) || other.company == company)&&(identical(other.avatarUrl, avatarUrl) || other.avatarUrl == avatarUrl)&&(identical(other.rating, rating) || other.rating == rating)&&(identical(other.verified, verified) || other.verified == verified)&&(identical(other.featured, featured) || other.featured == featured)&&(identical(other.status, status) || other.status == status)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder)&&(identical(other.viewCount, viewCount) || other.viewCount == viewCount)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name,excerpt,position,company,avatarUrl,rating,verified,featured,status,isActive,sortOrder,viewCount,createdAt,updatedAt);

@override
String toString() {
  return 'TestimonialItem(id: $id, name: $name, excerpt: $excerpt, position: $position, company: $company, avatarUrl: $avatarUrl, rating: $rating, verified: $verified, featured: $featured, status: $status, isActive: $isActive, sortOrder: $sortOrder, viewCount: $viewCount, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $TestimonialItemCopyWith<$Res>  {
  factory $TestimonialItemCopyWith(TestimonialItem value, $Res Function(TestimonialItem) _then) = _$TestimonialItemCopyWithImpl;
@useResult
$Res call({
 String id, String name, String? excerpt, String? position, String? company, String? avatarUrl, int rating, bool verified, bool featured, String status, bool isActive, int sortOrder, int viewCount, DateTime createdAt, DateTime updatedAt
});




}
/// @nodoc
class _$TestimonialItemCopyWithImpl<$Res>
    implements $TestimonialItemCopyWith<$Res> {
  _$TestimonialItemCopyWithImpl(this._self, this._then);

  final TestimonialItem _self;
  final $Res Function(TestimonialItem) _then;

/// Create a copy of TestimonialItem
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? excerpt = freezed,Object? position = freezed,Object? company = freezed,Object? avatarUrl = freezed,Object? rating = null,Object? verified = null,Object? featured = null,Object? status = null,Object? isActive = null,Object? sortOrder = null,Object? viewCount = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,excerpt: freezed == excerpt ? _self.excerpt : excerpt // ignore: cast_nullable_to_non_nullable
as String?,position: freezed == position ? _self.position : position // ignore: cast_nullable_to_non_nullable
as String?,company: freezed == company ? _self.company : company // ignore: cast_nullable_to_non_nullable
as String?,avatarUrl: freezed == avatarUrl ? _self.avatarUrl : avatarUrl // ignore: cast_nullable_to_non_nullable
as String?,rating: null == rating ? _self.rating : rating // ignore: cast_nullable_to_non_nullable
as int,verified: null == verified ? _self.verified : verified // ignore: cast_nullable_to_non_nullable
as bool,featured: null == featured ? _self.featured : featured // ignore: cast_nullable_to_non_nullable
as bool,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,viewCount: null == viewCount ? _self.viewCount : viewCount // ignore: cast_nullable_to_non_nullable
as int,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

}


/// Adds pattern-matching-related methods to [TestimonialItem].
extension TestimonialItemPatterns on TestimonialItem {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _TestimonialItem value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _TestimonialItem() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _TestimonialItem value)  $default,){
final _that = this;
switch (_that) {
case _TestimonialItem():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _TestimonialItem value)?  $default,){
final _that = this;
switch (_that) {
case _TestimonialItem() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String name,  String? excerpt,  String? position,  String? company,  String? avatarUrl,  int rating,  bool verified,  bool featured,  String status,  bool isActive,  int sortOrder,  int viewCount,  DateTime createdAt,  DateTime updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _TestimonialItem() when $default != null:
return $default(_that.id,_that.name,_that.excerpt,_that.position,_that.company,_that.avatarUrl,_that.rating,_that.verified,_that.featured,_that.status,_that.isActive,_that.sortOrder,_that.viewCount,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String name,  String? excerpt,  String? position,  String? company,  String? avatarUrl,  int rating,  bool verified,  bool featured,  String status,  bool isActive,  int sortOrder,  int viewCount,  DateTime createdAt,  DateTime updatedAt)  $default,) {final _that = this;
switch (_that) {
case _TestimonialItem():
return $default(_that.id,_that.name,_that.excerpt,_that.position,_that.company,_that.avatarUrl,_that.rating,_that.verified,_that.featured,_that.status,_that.isActive,_that.sortOrder,_that.viewCount,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String name,  String? excerpt,  String? position,  String? company,  String? avatarUrl,  int rating,  bool verified,  bool featured,  String status,  bool isActive,  int sortOrder,  int viewCount,  DateTime createdAt,  DateTime updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _TestimonialItem() when $default != null:
return $default(_that.id,_that.name,_that.excerpt,_that.position,_that.company,_that.avatarUrl,_that.rating,_that.verified,_that.featured,_that.status,_that.isActive,_that.sortOrder,_that.viewCount,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _TestimonialItem implements TestimonialItem {
  const _TestimonialItem({required this.id, required this.name, this.excerpt, this.position, this.company, this.avatarUrl, this.rating = 5, this.verified = false, this.featured = false, this.status = 'PENDING', this.isActive = true, this.sortOrder = 0, this.viewCount = 0, required this.createdAt, required this.updatedAt});
  factory _TestimonialItem.fromJson(Map<String, dynamic> json) => _$TestimonialItemFromJson(json);

@override final  String id;
@override final  String name;
@override final  String? excerpt;
@override final  String? position;
@override final  String? company;
@override final  String? avatarUrl;
@override@JsonKey() final  int rating;
@override@JsonKey() final  bool verified;
@override@JsonKey() final  bool featured;
@override@JsonKey() final  String status;
@override@JsonKey() final  bool isActive;
@override@JsonKey() final  int sortOrder;
@override@JsonKey() final  int viewCount;
@override final  DateTime createdAt;
@override final  DateTime updatedAt;

/// Create a copy of TestimonialItem
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$TestimonialItemCopyWith<_TestimonialItem> get copyWith => __$TestimonialItemCopyWithImpl<_TestimonialItem>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$TestimonialItemToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _TestimonialItem&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.excerpt, excerpt) || other.excerpt == excerpt)&&(identical(other.position, position) || other.position == position)&&(identical(other.company, company) || other.company == company)&&(identical(other.avatarUrl, avatarUrl) || other.avatarUrl == avatarUrl)&&(identical(other.rating, rating) || other.rating == rating)&&(identical(other.verified, verified) || other.verified == verified)&&(identical(other.featured, featured) || other.featured == featured)&&(identical(other.status, status) || other.status == status)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder)&&(identical(other.viewCount, viewCount) || other.viewCount == viewCount)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name,excerpt,position,company,avatarUrl,rating,verified,featured,status,isActive,sortOrder,viewCount,createdAt,updatedAt);

@override
String toString() {
  return 'TestimonialItem(id: $id, name: $name, excerpt: $excerpt, position: $position, company: $company, avatarUrl: $avatarUrl, rating: $rating, verified: $verified, featured: $featured, status: $status, isActive: $isActive, sortOrder: $sortOrder, viewCount: $viewCount, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$TestimonialItemCopyWith<$Res> implements $TestimonialItemCopyWith<$Res> {
  factory _$TestimonialItemCopyWith(_TestimonialItem value, $Res Function(_TestimonialItem) _then) = __$TestimonialItemCopyWithImpl;
@override @useResult
$Res call({
 String id, String name, String? excerpt, String? position, String? company, String? avatarUrl, int rating, bool verified, bool featured, String status, bool isActive, int sortOrder, int viewCount, DateTime createdAt, DateTime updatedAt
});




}
/// @nodoc
class __$TestimonialItemCopyWithImpl<$Res>
    implements _$TestimonialItemCopyWith<$Res> {
  __$TestimonialItemCopyWithImpl(this._self, this._then);

  final _TestimonialItem _self;
  final $Res Function(_TestimonialItem) _then;

/// Create a copy of TestimonialItem
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? excerpt = freezed,Object? position = freezed,Object? company = freezed,Object? avatarUrl = freezed,Object? rating = null,Object? verified = null,Object? featured = null,Object? status = null,Object? isActive = null,Object? sortOrder = null,Object? viewCount = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_TestimonialItem(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,excerpt: freezed == excerpt ? _self.excerpt : excerpt // ignore: cast_nullable_to_non_nullable
as String?,position: freezed == position ? _self.position : position // ignore: cast_nullable_to_non_nullable
as String?,company: freezed == company ? _self.company : company // ignore: cast_nullable_to_non_nullable
as String?,avatarUrl: freezed == avatarUrl ? _self.avatarUrl : avatarUrl // ignore: cast_nullable_to_non_nullable
as String?,rating: null == rating ? _self.rating : rating // ignore: cast_nullable_to_non_nullable
as int,verified: null == verified ? _self.verified : verified // ignore: cast_nullable_to_non_nullable
as bool,featured: null == featured ? _self.featured : featured // ignore: cast_nullable_to_non_nullable
as bool,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,viewCount: null == viewCount ? _self.viewCount : viewCount // ignore: cast_nullable_to_non_nullable
as int,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}


}


/// @nodoc
mixin _$TestimonialDetail {

 String get id; String get name; String get text; String? get excerpt; String? get email; String? get phone; String? get position; String? get company; String? get website; String? get avatarUrl; int get rating; bool get verified; bool get featured; String? get source; String? get projectId; String get status; String? get moderatedBy; DateTime? get moderatedAt; bool get isActive; int get sortOrder; int get viewCount; DateTime get createdAt; DateTime get updatedAt;
/// Create a copy of TestimonialDetail
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$TestimonialDetailCopyWith<TestimonialDetail> get copyWith => _$TestimonialDetailCopyWithImpl<TestimonialDetail>(this as TestimonialDetail, _$identity);

  /// Serializes this TestimonialDetail to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is TestimonialDetail&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.text, text) || other.text == text)&&(identical(other.excerpt, excerpt) || other.excerpt == excerpt)&&(identical(other.email, email) || other.email == email)&&(identical(other.phone, phone) || other.phone == phone)&&(identical(other.position, position) || other.position == position)&&(identical(other.company, company) || other.company == company)&&(identical(other.website, website) || other.website == website)&&(identical(other.avatarUrl, avatarUrl) || other.avatarUrl == avatarUrl)&&(identical(other.rating, rating) || other.rating == rating)&&(identical(other.verified, verified) || other.verified == verified)&&(identical(other.featured, featured) || other.featured == featured)&&(identical(other.source, source) || other.source == source)&&(identical(other.projectId, projectId) || other.projectId == projectId)&&(identical(other.status, status) || other.status == status)&&(identical(other.moderatedBy, moderatedBy) || other.moderatedBy == moderatedBy)&&(identical(other.moderatedAt, moderatedAt) || other.moderatedAt == moderatedAt)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder)&&(identical(other.viewCount, viewCount) || other.viewCount == viewCount)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hashAll([runtimeType,id,name,text,excerpt,email,phone,position,company,website,avatarUrl,rating,verified,featured,source,projectId,status,moderatedBy,moderatedAt,isActive,sortOrder,viewCount,createdAt,updatedAt]);

@override
String toString() {
  return 'TestimonialDetail(id: $id, name: $name, text: $text, excerpt: $excerpt, email: $email, phone: $phone, position: $position, company: $company, website: $website, avatarUrl: $avatarUrl, rating: $rating, verified: $verified, featured: $featured, source: $source, projectId: $projectId, status: $status, moderatedBy: $moderatedBy, moderatedAt: $moderatedAt, isActive: $isActive, sortOrder: $sortOrder, viewCount: $viewCount, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $TestimonialDetailCopyWith<$Res>  {
  factory $TestimonialDetailCopyWith(TestimonialDetail value, $Res Function(TestimonialDetail) _then) = _$TestimonialDetailCopyWithImpl;
@useResult
$Res call({
 String id, String name, String text, String? excerpt, String? email, String? phone, String? position, String? company, String? website, String? avatarUrl, int rating, bool verified, bool featured, String? source, String? projectId, String status, String? moderatedBy, DateTime? moderatedAt, bool isActive, int sortOrder, int viewCount, DateTime createdAt, DateTime updatedAt
});




}
/// @nodoc
class _$TestimonialDetailCopyWithImpl<$Res>
    implements $TestimonialDetailCopyWith<$Res> {
  _$TestimonialDetailCopyWithImpl(this._self, this._then);

  final TestimonialDetail _self;
  final $Res Function(TestimonialDetail) _then;

/// Create a copy of TestimonialDetail
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? text = null,Object? excerpt = freezed,Object? email = freezed,Object? phone = freezed,Object? position = freezed,Object? company = freezed,Object? website = freezed,Object? avatarUrl = freezed,Object? rating = null,Object? verified = null,Object? featured = null,Object? source = freezed,Object? projectId = freezed,Object? status = null,Object? moderatedBy = freezed,Object? moderatedAt = freezed,Object? isActive = null,Object? sortOrder = null,Object? viewCount = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,text: null == text ? _self.text : text // ignore: cast_nullable_to_non_nullable
as String,excerpt: freezed == excerpt ? _self.excerpt : excerpt // ignore: cast_nullable_to_non_nullable
as String?,email: freezed == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String?,phone: freezed == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String?,position: freezed == position ? _self.position : position // ignore: cast_nullable_to_non_nullable
as String?,company: freezed == company ? _self.company : company // ignore: cast_nullable_to_non_nullable
as String?,website: freezed == website ? _self.website : website // ignore: cast_nullable_to_non_nullable
as String?,avatarUrl: freezed == avatarUrl ? _self.avatarUrl : avatarUrl // ignore: cast_nullable_to_non_nullable
as String?,rating: null == rating ? _self.rating : rating // ignore: cast_nullable_to_non_nullable
as int,verified: null == verified ? _self.verified : verified // ignore: cast_nullable_to_non_nullable
as bool,featured: null == featured ? _self.featured : featured // ignore: cast_nullable_to_non_nullable
as bool,source: freezed == source ? _self.source : source // ignore: cast_nullable_to_non_nullable
as String?,projectId: freezed == projectId ? _self.projectId : projectId // ignore: cast_nullable_to_non_nullable
as String?,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,moderatedBy: freezed == moderatedBy ? _self.moderatedBy : moderatedBy // ignore: cast_nullable_to_non_nullable
as String?,moderatedAt: freezed == moderatedAt ? _self.moderatedAt : moderatedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,viewCount: null == viewCount ? _self.viewCount : viewCount // ignore: cast_nullable_to_non_nullable
as int,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

}


/// Adds pattern-matching-related methods to [TestimonialDetail].
extension TestimonialDetailPatterns on TestimonialDetail {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _TestimonialDetail value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _TestimonialDetail() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _TestimonialDetail value)  $default,){
final _that = this;
switch (_that) {
case _TestimonialDetail():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _TestimonialDetail value)?  $default,){
final _that = this;
switch (_that) {
case _TestimonialDetail() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String name,  String text,  String? excerpt,  String? email,  String? phone,  String? position,  String? company,  String? website,  String? avatarUrl,  int rating,  bool verified,  bool featured,  String? source,  String? projectId,  String status,  String? moderatedBy,  DateTime? moderatedAt,  bool isActive,  int sortOrder,  int viewCount,  DateTime createdAt,  DateTime updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _TestimonialDetail() when $default != null:
return $default(_that.id,_that.name,_that.text,_that.excerpt,_that.email,_that.phone,_that.position,_that.company,_that.website,_that.avatarUrl,_that.rating,_that.verified,_that.featured,_that.source,_that.projectId,_that.status,_that.moderatedBy,_that.moderatedAt,_that.isActive,_that.sortOrder,_that.viewCount,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String name,  String text,  String? excerpt,  String? email,  String? phone,  String? position,  String? company,  String? website,  String? avatarUrl,  int rating,  bool verified,  bool featured,  String? source,  String? projectId,  String status,  String? moderatedBy,  DateTime? moderatedAt,  bool isActive,  int sortOrder,  int viewCount,  DateTime createdAt,  DateTime updatedAt)  $default,) {final _that = this;
switch (_that) {
case _TestimonialDetail():
return $default(_that.id,_that.name,_that.text,_that.excerpt,_that.email,_that.phone,_that.position,_that.company,_that.website,_that.avatarUrl,_that.rating,_that.verified,_that.featured,_that.source,_that.projectId,_that.status,_that.moderatedBy,_that.moderatedAt,_that.isActive,_that.sortOrder,_that.viewCount,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String name,  String text,  String? excerpt,  String? email,  String? phone,  String? position,  String? company,  String? website,  String? avatarUrl,  int rating,  bool verified,  bool featured,  String? source,  String? projectId,  String status,  String? moderatedBy,  DateTime? moderatedAt,  bool isActive,  int sortOrder,  int viewCount,  DateTime createdAt,  DateTime updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _TestimonialDetail() when $default != null:
return $default(_that.id,_that.name,_that.text,_that.excerpt,_that.email,_that.phone,_that.position,_that.company,_that.website,_that.avatarUrl,_that.rating,_that.verified,_that.featured,_that.source,_that.projectId,_that.status,_that.moderatedBy,_that.moderatedAt,_that.isActive,_that.sortOrder,_that.viewCount,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _TestimonialDetail implements TestimonialDetail {
  const _TestimonialDetail({required this.id, required this.name, required this.text, this.excerpt, this.email, this.phone, this.position, this.company, this.website, this.avatarUrl, this.rating = 5, this.verified = false, this.featured = false, this.source, this.projectId, this.status = 'PENDING', this.moderatedBy, this.moderatedAt, this.isActive = true, this.sortOrder = 0, this.viewCount = 0, required this.createdAt, required this.updatedAt});
  factory _TestimonialDetail.fromJson(Map<String, dynamic> json) => _$TestimonialDetailFromJson(json);

@override final  String id;
@override final  String name;
@override final  String text;
@override final  String? excerpt;
@override final  String? email;
@override final  String? phone;
@override final  String? position;
@override final  String? company;
@override final  String? website;
@override final  String? avatarUrl;
@override@JsonKey() final  int rating;
@override@JsonKey() final  bool verified;
@override@JsonKey() final  bool featured;
@override final  String? source;
@override final  String? projectId;
@override@JsonKey() final  String status;
@override final  String? moderatedBy;
@override final  DateTime? moderatedAt;
@override@JsonKey() final  bool isActive;
@override@JsonKey() final  int sortOrder;
@override@JsonKey() final  int viewCount;
@override final  DateTime createdAt;
@override final  DateTime updatedAt;

/// Create a copy of TestimonialDetail
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$TestimonialDetailCopyWith<_TestimonialDetail> get copyWith => __$TestimonialDetailCopyWithImpl<_TestimonialDetail>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$TestimonialDetailToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _TestimonialDetail&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.text, text) || other.text == text)&&(identical(other.excerpt, excerpt) || other.excerpt == excerpt)&&(identical(other.email, email) || other.email == email)&&(identical(other.phone, phone) || other.phone == phone)&&(identical(other.position, position) || other.position == position)&&(identical(other.company, company) || other.company == company)&&(identical(other.website, website) || other.website == website)&&(identical(other.avatarUrl, avatarUrl) || other.avatarUrl == avatarUrl)&&(identical(other.rating, rating) || other.rating == rating)&&(identical(other.verified, verified) || other.verified == verified)&&(identical(other.featured, featured) || other.featured == featured)&&(identical(other.source, source) || other.source == source)&&(identical(other.projectId, projectId) || other.projectId == projectId)&&(identical(other.status, status) || other.status == status)&&(identical(other.moderatedBy, moderatedBy) || other.moderatedBy == moderatedBy)&&(identical(other.moderatedAt, moderatedAt) || other.moderatedAt == moderatedAt)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder)&&(identical(other.viewCount, viewCount) || other.viewCount == viewCount)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hashAll([runtimeType,id,name,text,excerpt,email,phone,position,company,website,avatarUrl,rating,verified,featured,source,projectId,status,moderatedBy,moderatedAt,isActive,sortOrder,viewCount,createdAt,updatedAt]);

@override
String toString() {
  return 'TestimonialDetail(id: $id, name: $name, text: $text, excerpt: $excerpt, email: $email, phone: $phone, position: $position, company: $company, website: $website, avatarUrl: $avatarUrl, rating: $rating, verified: $verified, featured: $featured, source: $source, projectId: $projectId, status: $status, moderatedBy: $moderatedBy, moderatedAt: $moderatedAt, isActive: $isActive, sortOrder: $sortOrder, viewCount: $viewCount, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$TestimonialDetailCopyWith<$Res> implements $TestimonialDetailCopyWith<$Res> {
  factory _$TestimonialDetailCopyWith(_TestimonialDetail value, $Res Function(_TestimonialDetail) _then) = __$TestimonialDetailCopyWithImpl;
@override @useResult
$Res call({
 String id, String name, String text, String? excerpt, String? email, String? phone, String? position, String? company, String? website, String? avatarUrl, int rating, bool verified, bool featured, String? source, String? projectId, String status, String? moderatedBy, DateTime? moderatedAt, bool isActive, int sortOrder, int viewCount, DateTime createdAt, DateTime updatedAt
});




}
/// @nodoc
class __$TestimonialDetailCopyWithImpl<$Res>
    implements _$TestimonialDetailCopyWith<$Res> {
  __$TestimonialDetailCopyWithImpl(this._self, this._then);

  final _TestimonialDetail _self;
  final $Res Function(_TestimonialDetail) _then;

/// Create a copy of TestimonialDetail
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? text = null,Object? excerpt = freezed,Object? email = freezed,Object? phone = freezed,Object? position = freezed,Object? company = freezed,Object? website = freezed,Object? avatarUrl = freezed,Object? rating = null,Object? verified = null,Object? featured = null,Object? source = freezed,Object? projectId = freezed,Object? status = null,Object? moderatedBy = freezed,Object? moderatedAt = freezed,Object? isActive = null,Object? sortOrder = null,Object? viewCount = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_TestimonialDetail(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,text: null == text ? _self.text : text // ignore: cast_nullable_to_non_nullable
as String,excerpt: freezed == excerpt ? _self.excerpt : excerpt // ignore: cast_nullable_to_non_nullable
as String?,email: freezed == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String?,phone: freezed == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String?,position: freezed == position ? _self.position : position // ignore: cast_nullable_to_non_nullable
as String?,company: freezed == company ? _self.company : company // ignore: cast_nullable_to_non_nullable
as String?,website: freezed == website ? _self.website : website // ignore: cast_nullable_to_non_nullable
as String?,avatarUrl: freezed == avatarUrl ? _self.avatarUrl : avatarUrl // ignore: cast_nullable_to_non_nullable
as String?,rating: null == rating ? _self.rating : rating // ignore: cast_nullable_to_non_nullable
as int,verified: null == verified ? _self.verified : verified // ignore: cast_nullable_to_non_nullable
as bool,featured: null == featured ? _self.featured : featured // ignore: cast_nullable_to_non_nullable
as bool,source: freezed == source ? _self.source : source // ignore: cast_nullable_to_non_nullable
as String?,projectId: freezed == projectId ? _self.projectId : projectId // ignore: cast_nullable_to_non_nullable
as String?,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,moderatedBy: freezed == moderatedBy ? _self.moderatedBy : moderatedBy // ignore: cast_nullable_to_non_nullable
as String?,moderatedAt: freezed == moderatedAt ? _self.moderatedAt : moderatedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,viewCount: null == viewCount ? _self.viewCount : viewCount // ignore: cast_nullable_to_non_nullable
as int,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}


}

// dart format on
