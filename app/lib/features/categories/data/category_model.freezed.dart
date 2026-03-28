// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'category_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$CategoryItem {

 String get id; String get name; String get slug; String? get description; String? get thumbnailUrl; String? get coverImageUrl; int get sortOrder; bool get isActive; int get projectCount; String get createdAt; String get updatedAt;
/// Create a copy of CategoryItem
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CategoryItemCopyWith<CategoryItem> get copyWith => _$CategoryItemCopyWithImpl<CategoryItem>(this as CategoryItem, _$identity);

  /// Serializes this CategoryItem to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CategoryItem&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.slug, slug) || other.slug == slug)&&(identical(other.description, description) || other.description == description)&&(identical(other.thumbnailUrl, thumbnailUrl) || other.thumbnailUrl == thumbnailUrl)&&(identical(other.coverImageUrl, coverImageUrl) || other.coverImageUrl == coverImageUrl)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.projectCount, projectCount) || other.projectCount == projectCount)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name,slug,description,thumbnailUrl,coverImageUrl,sortOrder,isActive,projectCount,createdAt,updatedAt);

@override
String toString() {
  return 'CategoryItem(id: $id, name: $name, slug: $slug, description: $description, thumbnailUrl: $thumbnailUrl, coverImageUrl: $coverImageUrl, sortOrder: $sortOrder, isActive: $isActive, projectCount: $projectCount, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $CategoryItemCopyWith<$Res>  {
  factory $CategoryItemCopyWith(CategoryItem value, $Res Function(CategoryItem) _then) = _$CategoryItemCopyWithImpl;
@useResult
$Res call({
 String id, String name, String slug, String? description, String? thumbnailUrl, String? coverImageUrl, int sortOrder, bool isActive, int projectCount, String createdAt, String updatedAt
});




}
/// @nodoc
class _$CategoryItemCopyWithImpl<$Res>
    implements $CategoryItemCopyWith<$Res> {
  _$CategoryItemCopyWithImpl(this._self, this._then);

  final CategoryItem _self;
  final $Res Function(CategoryItem) _then;

/// Create a copy of CategoryItem
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? slug = null,Object? description = freezed,Object? thumbnailUrl = freezed,Object? coverImageUrl = freezed,Object? sortOrder = null,Object? isActive = null,Object? projectCount = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,slug: null == slug ? _self.slug : slug // ignore: cast_nullable_to_non_nullable
as String,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,thumbnailUrl: freezed == thumbnailUrl ? _self.thumbnailUrl : thumbnailUrl // ignore: cast_nullable_to_non_nullable
as String?,coverImageUrl: freezed == coverImageUrl ? _self.coverImageUrl : coverImageUrl // ignore: cast_nullable_to_non_nullable
as String?,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,projectCount: null == projectCount ? _self.projectCount : projectCount // ignore: cast_nullable_to_non_nullable
as int,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [CategoryItem].
extension CategoryItemPatterns on CategoryItem {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _CategoryItem value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _CategoryItem() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _CategoryItem value)  $default,){
final _that = this;
switch (_that) {
case _CategoryItem():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _CategoryItem value)?  $default,){
final _that = this;
switch (_that) {
case _CategoryItem() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String name,  String slug,  String? description,  String? thumbnailUrl,  String? coverImageUrl,  int sortOrder,  bool isActive,  int projectCount,  String createdAt,  String updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CategoryItem() when $default != null:
return $default(_that.id,_that.name,_that.slug,_that.description,_that.thumbnailUrl,_that.coverImageUrl,_that.sortOrder,_that.isActive,_that.projectCount,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String name,  String slug,  String? description,  String? thumbnailUrl,  String? coverImageUrl,  int sortOrder,  bool isActive,  int projectCount,  String createdAt,  String updatedAt)  $default,) {final _that = this;
switch (_that) {
case _CategoryItem():
return $default(_that.id,_that.name,_that.slug,_that.description,_that.thumbnailUrl,_that.coverImageUrl,_that.sortOrder,_that.isActive,_that.projectCount,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String name,  String slug,  String? description,  String? thumbnailUrl,  String? coverImageUrl,  int sortOrder,  bool isActive,  int projectCount,  String createdAt,  String updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _CategoryItem() when $default != null:
return $default(_that.id,_that.name,_that.slug,_that.description,_that.thumbnailUrl,_that.coverImageUrl,_that.sortOrder,_that.isActive,_that.projectCount,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _CategoryItem implements CategoryItem {
  const _CategoryItem({required this.id, required this.name, required this.slug, this.description, this.thumbnailUrl, this.coverImageUrl, this.sortOrder = 0, this.isActive = true, this.projectCount = 0, required this.createdAt, required this.updatedAt});
  factory _CategoryItem.fromJson(Map<String, dynamic> json) => _$CategoryItemFromJson(json);

@override final  String id;
@override final  String name;
@override final  String slug;
@override final  String? description;
@override final  String? thumbnailUrl;
@override final  String? coverImageUrl;
@override@JsonKey() final  int sortOrder;
@override@JsonKey() final  bool isActive;
@override@JsonKey() final  int projectCount;
@override final  String createdAt;
@override final  String updatedAt;

/// Create a copy of CategoryItem
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CategoryItemCopyWith<_CategoryItem> get copyWith => __$CategoryItemCopyWithImpl<_CategoryItem>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$CategoryItemToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _CategoryItem&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.slug, slug) || other.slug == slug)&&(identical(other.description, description) || other.description == description)&&(identical(other.thumbnailUrl, thumbnailUrl) || other.thumbnailUrl == thumbnailUrl)&&(identical(other.coverImageUrl, coverImageUrl) || other.coverImageUrl == coverImageUrl)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.projectCount, projectCount) || other.projectCount == projectCount)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name,slug,description,thumbnailUrl,coverImageUrl,sortOrder,isActive,projectCount,createdAt,updatedAt);

@override
String toString() {
  return 'CategoryItem(id: $id, name: $name, slug: $slug, description: $description, thumbnailUrl: $thumbnailUrl, coverImageUrl: $coverImageUrl, sortOrder: $sortOrder, isActive: $isActive, projectCount: $projectCount, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$CategoryItemCopyWith<$Res> implements $CategoryItemCopyWith<$Res> {
  factory _$CategoryItemCopyWith(_CategoryItem value, $Res Function(_CategoryItem) _then) = __$CategoryItemCopyWithImpl;
@override @useResult
$Res call({
 String id, String name, String slug, String? description, String? thumbnailUrl, String? coverImageUrl, int sortOrder, bool isActive, int projectCount, String createdAt, String updatedAt
});




}
/// @nodoc
class __$CategoryItemCopyWithImpl<$Res>
    implements _$CategoryItemCopyWith<$Res> {
  __$CategoryItemCopyWithImpl(this._self, this._then);

  final _CategoryItem _self;
  final $Res Function(_CategoryItem) _then;

/// Create a copy of CategoryItem
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? slug = null,Object? description = freezed,Object? thumbnailUrl = freezed,Object? coverImageUrl = freezed,Object? sortOrder = null,Object? isActive = null,Object? projectCount = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_CategoryItem(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,slug: null == slug ? _self.slug : slug // ignore: cast_nullable_to_non_nullable
as String,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,thumbnailUrl: freezed == thumbnailUrl ? _self.thumbnailUrl : thumbnailUrl // ignore: cast_nullable_to_non_nullable
as String?,coverImageUrl: freezed == coverImageUrl ? _self.coverImageUrl : coverImageUrl // ignore: cast_nullable_to_non_nullable
as String?,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,projectCount: null == projectCount ? _self.projectCount : projectCount // ignore: cast_nullable_to_non_nullable
as int,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}


/// @nodoc
mixin _$CategoryDetail {

 String get id; String get name; String get slug; String? get description; String? get thumbnailUrl; String? get coverImageUrl; String? get metaTitle; String? get metaDescription; List<String> get metaKeywords; String? get ogImage; int get sortOrder; bool get isActive; int get projectCount; String get createdAt; String get updatedAt;
/// Create a copy of CategoryDetail
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CategoryDetailCopyWith<CategoryDetail> get copyWith => _$CategoryDetailCopyWithImpl<CategoryDetail>(this as CategoryDetail, _$identity);

  /// Serializes this CategoryDetail to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CategoryDetail&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.slug, slug) || other.slug == slug)&&(identical(other.description, description) || other.description == description)&&(identical(other.thumbnailUrl, thumbnailUrl) || other.thumbnailUrl == thumbnailUrl)&&(identical(other.coverImageUrl, coverImageUrl) || other.coverImageUrl == coverImageUrl)&&(identical(other.metaTitle, metaTitle) || other.metaTitle == metaTitle)&&(identical(other.metaDescription, metaDescription) || other.metaDescription == metaDescription)&&const DeepCollectionEquality().equals(other.metaKeywords, metaKeywords)&&(identical(other.ogImage, ogImage) || other.ogImage == ogImage)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.projectCount, projectCount) || other.projectCount == projectCount)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name,slug,description,thumbnailUrl,coverImageUrl,metaTitle,metaDescription,const DeepCollectionEquality().hash(metaKeywords),ogImage,sortOrder,isActive,projectCount,createdAt,updatedAt);

@override
String toString() {
  return 'CategoryDetail(id: $id, name: $name, slug: $slug, description: $description, thumbnailUrl: $thumbnailUrl, coverImageUrl: $coverImageUrl, metaTitle: $metaTitle, metaDescription: $metaDescription, metaKeywords: $metaKeywords, ogImage: $ogImage, sortOrder: $sortOrder, isActive: $isActive, projectCount: $projectCount, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $CategoryDetailCopyWith<$Res>  {
  factory $CategoryDetailCopyWith(CategoryDetail value, $Res Function(CategoryDetail) _then) = _$CategoryDetailCopyWithImpl;
@useResult
$Res call({
 String id, String name, String slug, String? description, String? thumbnailUrl, String? coverImageUrl, String? metaTitle, String? metaDescription, List<String> metaKeywords, String? ogImage, int sortOrder, bool isActive, int projectCount, String createdAt, String updatedAt
});




}
/// @nodoc
class _$CategoryDetailCopyWithImpl<$Res>
    implements $CategoryDetailCopyWith<$Res> {
  _$CategoryDetailCopyWithImpl(this._self, this._then);

  final CategoryDetail _self;
  final $Res Function(CategoryDetail) _then;

/// Create a copy of CategoryDetail
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? slug = null,Object? description = freezed,Object? thumbnailUrl = freezed,Object? coverImageUrl = freezed,Object? metaTitle = freezed,Object? metaDescription = freezed,Object? metaKeywords = null,Object? ogImage = freezed,Object? sortOrder = null,Object? isActive = null,Object? projectCount = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,slug: null == slug ? _self.slug : slug // ignore: cast_nullable_to_non_nullable
as String,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,thumbnailUrl: freezed == thumbnailUrl ? _self.thumbnailUrl : thumbnailUrl // ignore: cast_nullable_to_non_nullable
as String?,coverImageUrl: freezed == coverImageUrl ? _self.coverImageUrl : coverImageUrl // ignore: cast_nullable_to_non_nullable
as String?,metaTitle: freezed == metaTitle ? _self.metaTitle : metaTitle // ignore: cast_nullable_to_non_nullable
as String?,metaDescription: freezed == metaDescription ? _self.metaDescription : metaDescription // ignore: cast_nullable_to_non_nullable
as String?,metaKeywords: null == metaKeywords ? _self.metaKeywords : metaKeywords // ignore: cast_nullable_to_non_nullable
as List<String>,ogImage: freezed == ogImage ? _self.ogImage : ogImage // ignore: cast_nullable_to_non_nullable
as String?,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,projectCount: null == projectCount ? _self.projectCount : projectCount // ignore: cast_nullable_to_non_nullable
as int,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [CategoryDetail].
extension CategoryDetailPatterns on CategoryDetail {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _CategoryDetail value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _CategoryDetail() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _CategoryDetail value)  $default,){
final _that = this;
switch (_that) {
case _CategoryDetail():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _CategoryDetail value)?  $default,){
final _that = this;
switch (_that) {
case _CategoryDetail() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String name,  String slug,  String? description,  String? thumbnailUrl,  String? coverImageUrl,  String? metaTitle,  String? metaDescription,  List<String> metaKeywords,  String? ogImage,  int sortOrder,  bool isActive,  int projectCount,  String createdAt,  String updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CategoryDetail() when $default != null:
return $default(_that.id,_that.name,_that.slug,_that.description,_that.thumbnailUrl,_that.coverImageUrl,_that.metaTitle,_that.metaDescription,_that.metaKeywords,_that.ogImage,_that.sortOrder,_that.isActive,_that.projectCount,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String name,  String slug,  String? description,  String? thumbnailUrl,  String? coverImageUrl,  String? metaTitle,  String? metaDescription,  List<String> metaKeywords,  String? ogImage,  int sortOrder,  bool isActive,  int projectCount,  String createdAt,  String updatedAt)  $default,) {final _that = this;
switch (_that) {
case _CategoryDetail():
return $default(_that.id,_that.name,_that.slug,_that.description,_that.thumbnailUrl,_that.coverImageUrl,_that.metaTitle,_that.metaDescription,_that.metaKeywords,_that.ogImage,_that.sortOrder,_that.isActive,_that.projectCount,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String name,  String slug,  String? description,  String? thumbnailUrl,  String? coverImageUrl,  String? metaTitle,  String? metaDescription,  List<String> metaKeywords,  String? ogImage,  int sortOrder,  bool isActive,  int projectCount,  String createdAt,  String updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _CategoryDetail() when $default != null:
return $default(_that.id,_that.name,_that.slug,_that.description,_that.thumbnailUrl,_that.coverImageUrl,_that.metaTitle,_that.metaDescription,_that.metaKeywords,_that.ogImage,_that.sortOrder,_that.isActive,_that.projectCount,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _CategoryDetail implements CategoryDetail {
  const _CategoryDetail({required this.id, required this.name, required this.slug, this.description, this.thumbnailUrl, this.coverImageUrl, this.metaTitle, this.metaDescription, final  List<String> metaKeywords = const [], this.ogImage, this.sortOrder = 0, this.isActive = true, this.projectCount = 0, required this.createdAt, required this.updatedAt}): _metaKeywords = metaKeywords;
  factory _CategoryDetail.fromJson(Map<String, dynamic> json) => _$CategoryDetailFromJson(json);

@override final  String id;
@override final  String name;
@override final  String slug;
@override final  String? description;
@override final  String? thumbnailUrl;
@override final  String? coverImageUrl;
@override final  String? metaTitle;
@override final  String? metaDescription;
 final  List<String> _metaKeywords;
@override@JsonKey() List<String> get metaKeywords {
  if (_metaKeywords is EqualUnmodifiableListView) return _metaKeywords;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_metaKeywords);
}

@override final  String? ogImage;
@override@JsonKey() final  int sortOrder;
@override@JsonKey() final  bool isActive;
@override@JsonKey() final  int projectCount;
@override final  String createdAt;
@override final  String updatedAt;

/// Create a copy of CategoryDetail
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CategoryDetailCopyWith<_CategoryDetail> get copyWith => __$CategoryDetailCopyWithImpl<_CategoryDetail>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$CategoryDetailToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _CategoryDetail&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.slug, slug) || other.slug == slug)&&(identical(other.description, description) || other.description == description)&&(identical(other.thumbnailUrl, thumbnailUrl) || other.thumbnailUrl == thumbnailUrl)&&(identical(other.coverImageUrl, coverImageUrl) || other.coverImageUrl == coverImageUrl)&&(identical(other.metaTitle, metaTitle) || other.metaTitle == metaTitle)&&(identical(other.metaDescription, metaDescription) || other.metaDescription == metaDescription)&&const DeepCollectionEquality().equals(other._metaKeywords, _metaKeywords)&&(identical(other.ogImage, ogImage) || other.ogImage == ogImage)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.projectCount, projectCount) || other.projectCount == projectCount)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name,slug,description,thumbnailUrl,coverImageUrl,metaTitle,metaDescription,const DeepCollectionEquality().hash(_metaKeywords),ogImage,sortOrder,isActive,projectCount,createdAt,updatedAt);

@override
String toString() {
  return 'CategoryDetail(id: $id, name: $name, slug: $slug, description: $description, thumbnailUrl: $thumbnailUrl, coverImageUrl: $coverImageUrl, metaTitle: $metaTitle, metaDescription: $metaDescription, metaKeywords: $metaKeywords, ogImage: $ogImage, sortOrder: $sortOrder, isActive: $isActive, projectCount: $projectCount, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$CategoryDetailCopyWith<$Res> implements $CategoryDetailCopyWith<$Res> {
  factory _$CategoryDetailCopyWith(_CategoryDetail value, $Res Function(_CategoryDetail) _then) = __$CategoryDetailCopyWithImpl;
@override @useResult
$Res call({
 String id, String name, String slug, String? description, String? thumbnailUrl, String? coverImageUrl, String? metaTitle, String? metaDescription, List<String> metaKeywords, String? ogImage, int sortOrder, bool isActive, int projectCount, String createdAt, String updatedAt
});




}
/// @nodoc
class __$CategoryDetailCopyWithImpl<$Res>
    implements _$CategoryDetailCopyWith<$Res> {
  __$CategoryDetailCopyWithImpl(this._self, this._then);

  final _CategoryDetail _self;
  final $Res Function(_CategoryDetail) _then;

/// Create a copy of CategoryDetail
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? slug = null,Object? description = freezed,Object? thumbnailUrl = freezed,Object? coverImageUrl = freezed,Object? metaTitle = freezed,Object? metaDescription = freezed,Object? metaKeywords = null,Object? ogImage = freezed,Object? sortOrder = null,Object? isActive = null,Object? projectCount = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_CategoryDetail(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,slug: null == slug ? _self.slug : slug // ignore: cast_nullable_to_non_nullable
as String,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,thumbnailUrl: freezed == thumbnailUrl ? _self.thumbnailUrl : thumbnailUrl // ignore: cast_nullable_to_non_nullable
as String?,coverImageUrl: freezed == coverImageUrl ? _self.coverImageUrl : coverImageUrl // ignore: cast_nullable_to_non_nullable
as String?,metaTitle: freezed == metaTitle ? _self.metaTitle : metaTitle // ignore: cast_nullable_to_non_nullable
as String?,metaDescription: freezed == metaDescription ? _self.metaDescription : metaDescription // ignore: cast_nullable_to_non_nullable
as String?,metaKeywords: null == metaKeywords ? _self._metaKeywords : metaKeywords // ignore: cast_nullable_to_non_nullable
as List<String>,ogImage: freezed == ogImage ? _self.ogImage : ogImage // ignore: cast_nullable_to_non_nullable
as String?,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,projectCount: null == projectCount ? _self.projectCount : projectCount // ignore: cast_nullable_to_non_nullable
as int,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}


/// @nodoc
mixin _$GalleryImageItem {

 String get id; String get url; String get thumbnailUrl; String? get publicId; String? get alt; String? get caption; int? get width; int? get height; bool get isCover; bool get isHero; int? get categoryGalleryOrder; String get projectId; String get projectTitle; String get projectSlug;
/// Create a copy of GalleryImageItem
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$GalleryImageItemCopyWith<GalleryImageItem> get copyWith => _$GalleryImageItemCopyWithImpl<GalleryImageItem>(this as GalleryImageItem, _$identity);

  /// Serializes this GalleryImageItem to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is GalleryImageItem&&(identical(other.id, id) || other.id == id)&&(identical(other.url, url) || other.url == url)&&(identical(other.thumbnailUrl, thumbnailUrl) || other.thumbnailUrl == thumbnailUrl)&&(identical(other.publicId, publicId) || other.publicId == publicId)&&(identical(other.alt, alt) || other.alt == alt)&&(identical(other.caption, caption) || other.caption == caption)&&(identical(other.width, width) || other.width == width)&&(identical(other.height, height) || other.height == height)&&(identical(other.isCover, isCover) || other.isCover == isCover)&&(identical(other.isHero, isHero) || other.isHero == isHero)&&(identical(other.categoryGalleryOrder, categoryGalleryOrder) || other.categoryGalleryOrder == categoryGalleryOrder)&&(identical(other.projectId, projectId) || other.projectId == projectId)&&(identical(other.projectTitle, projectTitle) || other.projectTitle == projectTitle)&&(identical(other.projectSlug, projectSlug) || other.projectSlug == projectSlug));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,url,thumbnailUrl,publicId,alt,caption,width,height,isCover,isHero,categoryGalleryOrder,projectId,projectTitle,projectSlug);

@override
String toString() {
  return 'GalleryImageItem(id: $id, url: $url, thumbnailUrl: $thumbnailUrl, publicId: $publicId, alt: $alt, caption: $caption, width: $width, height: $height, isCover: $isCover, isHero: $isHero, categoryGalleryOrder: $categoryGalleryOrder, projectId: $projectId, projectTitle: $projectTitle, projectSlug: $projectSlug)';
}


}

/// @nodoc
abstract mixin class $GalleryImageItemCopyWith<$Res>  {
  factory $GalleryImageItemCopyWith(GalleryImageItem value, $Res Function(GalleryImageItem) _then) = _$GalleryImageItemCopyWithImpl;
@useResult
$Res call({
 String id, String url, String thumbnailUrl, String? publicId, String? alt, String? caption, int? width, int? height, bool isCover, bool isHero, int? categoryGalleryOrder, String projectId, String projectTitle, String projectSlug
});




}
/// @nodoc
class _$GalleryImageItemCopyWithImpl<$Res>
    implements $GalleryImageItemCopyWith<$Res> {
  _$GalleryImageItemCopyWithImpl(this._self, this._then);

  final GalleryImageItem _self;
  final $Res Function(GalleryImageItem) _then;

/// Create a copy of GalleryImageItem
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? url = null,Object? thumbnailUrl = null,Object? publicId = freezed,Object? alt = freezed,Object? caption = freezed,Object? width = freezed,Object? height = freezed,Object? isCover = null,Object? isHero = null,Object? categoryGalleryOrder = freezed,Object? projectId = null,Object? projectTitle = null,Object? projectSlug = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,url: null == url ? _self.url : url // ignore: cast_nullable_to_non_nullable
as String,thumbnailUrl: null == thumbnailUrl ? _self.thumbnailUrl : thumbnailUrl // ignore: cast_nullable_to_non_nullable
as String,publicId: freezed == publicId ? _self.publicId : publicId // ignore: cast_nullable_to_non_nullable
as String?,alt: freezed == alt ? _self.alt : alt // ignore: cast_nullable_to_non_nullable
as String?,caption: freezed == caption ? _self.caption : caption // ignore: cast_nullable_to_non_nullable
as String?,width: freezed == width ? _self.width : width // ignore: cast_nullable_to_non_nullable
as int?,height: freezed == height ? _self.height : height // ignore: cast_nullable_to_non_nullable
as int?,isCover: null == isCover ? _self.isCover : isCover // ignore: cast_nullable_to_non_nullable
as bool,isHero: null == isHero ? _self.isHero : isHero // ignore: cast_nullable_to_non_nullable
as bool,categoryGalleryOrder: freezed == categoryGalleryOrder ? _self.categoryGalleryOrder : categoryGalleryOrder // ignore: cast_nullable_to_non_nullable
as int?,projectId: null == projectId ? _self.projectId : projectId // ignore: cast_nullable_to_non_nullable
as String,projectTitle: null == projectTitle ? _self.projectTitle : projectTitle // ignore: cast_nullable_to_non_nullable
as String,projectSlug: null == projectSlug ? _self.projectSlug : projectSlug // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [GalleryImageItem].
extension GalleryImageItemPatterns on GalleryImageItem {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _GalleryImageItem value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _GalleryImageItem() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _GalleryImageItem value)  $default,){
final _that = this;
switch (_that) {
case _GalleryImageItem():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _GalleryImageItem value)?  $default,){
final _that = this;
switch (_that) {
case _GalleryImageItem() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String url,  String thumbnailUrl,  String? publicId,  String? alt,  String? caption,  int? width,  int? height,  bool isCover,  bool isHero,  int? categoryGalleryOrder,  String projectId,  String projectTitle,  String projectSlug)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _GalleryImageItem() when $default != null:
return $default(_that.id,_that.url,_that.thumbnailUrl,_that.publicId,_that.alt,_that.caption,_that.width,_that.height,_that.isCover,_that.isHero,_that.categoryGalleryOrder,_that.projectId,_that.projectTitle,_that.projectSlug);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String url,  String thumbnailUrl,  String? publicId,  String? alt,  String? caption,  int? width,  int? height,  bool isCover,  bool isHero,  int? categoryGalleryOrder,  String projectId,  String projectTitle,  String projectSlug)  $default,) {final _that = this;
switch (_that) {
case _GalleryImageItem():
return $default(_that.id,_that.url,_that.thumbnailUrl,_that.publicId,_that.alt,_that.caption,_that.width,_that.height,_that.isCover,_that.isHero,_that.categoryGalleryOrder,_that.projectId,_that.projectTitle,_that.projectSlug);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String url,  String thumbnailUrl,  String? publicId,  String? alt,  String? caption,  int? width,  int? height,  bool isCover,  bool isHero,  int? categoryGalleryOrder,  String projectId,  String projectTitle,  String projectSlug)?  $default,) {final _that = this;
switch (_that) {
case _GalleryImageItem() when $default != null:
return $default(_that.id,_that.url,_that.thumbnailUrl,_that.publicId,_that.alt,_that.caption,_that.width,_that.height,_that.isCover,_that.isHero,_that.categoryGalleryOrder,_that.projectId,_that.projectTitle,_that.projectSlug);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _GalleryImageItem implements GalleryImageItem {
  const _GalleryImageItem({required this.id, required this.url, required this.thumbnailUrl, this.publicId, this.alt, this.caption, this.width, this.height, this.isCover = false, this.isHero = false, this.categoryGalleryOrder, required this.projectId, required this.projectTitle, required this.projectSlug});
  factory _GalleryImageItem.fromJson(Map<String, dynamic> json) => _$GalleryImageItemFromJson(json);

@override final  String id;
@override final  String url;
@override final  String thumbnailUrl;
@override final  String? publicId;
@override final  String? alt;
@override final  String? caption;
@override final  int? width;
@override final  int? height;
@override@JsonKey() final  bool isCover;
@override@JsonKey() final  bool isHero;
@override final  int? categoryGalleryOrder;
@override final  String projectId;
@override final  String projectTitle;
@override final  String projectSlug;

/// Create a copy of GalleryImageItem
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$GalleryImageItemCopyWith<_GalleryImageItem> get copyWith => __$GalleryImageItemCopyWithImpl<_GalleryImageItem>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$GalleryImageItemToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _GalleryImageItem&&(identical(other.id, id) || other.id == id)&&(identical(other.url, url) || other.url == url)&&(identical(other.thumbnailUrl, thumbnailUrl) || other.thumbnailUrl == thumbnailUrl)&&(identical(other.publicId, publicId) || other.publicId == publicId)&&(identical(other.alt, alt) || other.alt == alt)&&(identical(other.caption, caption) || other.caption == caption)&&(identical(other.width, width) || other.width == width)&&(identical(other.height, height) || other.height == height)&&(identical(other.isCover, isCover) || other.isCover == isCover)&&(identical(other.isHero, isHero) || other.isHero == isHero)&&(identical(other.categoryGalleryOrder, categoryGalleryOrder) || other.categoryGalleryOrder == categoryGalleryOrder)&&(identical(other.projectId, projectId) || other.projectId == projectId)&&(identical(other.projectTitle, projectTitle) || other.projectTitle == projectTitle)&&(identical(other.projectSlug, projectSlug) || other.projectSlug == projectSlug));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,url,thumbnailUrl,publicId,alt,caption,width,height,isCover,isHero,categoryGalleryOrder,projectId,projectTitle,projectSlug);

@override
String toString() {
  return 'GalleryImageItem(id: $id, url: $url, thumbnailUrl: $thumbnailUrl, publicId: $publicId, alt: $alt, caption: $caption, width: $width, height: $height, isCover: $isCover, isHero: $isHero, categoryGalleryOrder: $categoryGalleryOrder, projectId: $projectId, projectTitle: $projectTitle, projectSlug: $projectSlug)';
}


}

/// @nodoc
abstract mixin class _$GalleryImageItemCopyWith<$Res> implements $GalleryImageItemCopyWith<$Res> {
  factory _$GalleryImageItemCopyWith(_GalleryImageItem value, $Res Function(_GalleryImageItem) _then) = __$GalleryImageItemCopyWithImpl;
@override @useResult
$Res call({
 String id, String url, String thumbnailUrl, String? publicId, String? alt, String? caption, int? width, int? height, bool isCover, bool isHero, int? categoryGalleryOrder, String projectId, String projectTitle, String projectSlug
});




}
/// @nodoc
class __$GalleryImageItemCopyWithImpl<$Res>
    implements _$GalleryImageItemCopyWith<$Res> {
  __$GalleryImageItemCopyWithImpl(this._self, this._then);

  final _GalleryImageItem _self;
  final $Res Function(_GalleryImageItem) _then;

/// Create a copy of GalleryImageItem
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? url = null,Object? thumbnailUrl = null,Object? publicId = freezed,Object? alt = freezed,Object? caption = freezed,Object? width = freezed,Object? height = freezed,Object? isCover = null,Object? isHero = null,Object? categoryGalleryOrder = freezed,Object? projectId = null,Object? projectTitle = null,Object? projectSlug = null,}) {
  return _then(_GalleryImageItem(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,url: null == url ? _self.url : url // ignore: cast_nullable_to_non_nullable
as String,thumbnailUrl: null == thumbnailUrl ? _self.thumbnailUrl : thumbnailUrl // ignore: cast_nullable_to_non_nullable
as String,publicId: freezed == publicId ? _self.publicId : publicId // ignore: cast_nullable_to_non_nullable
as String?,alt: freezed == alt ? _self.alt : alt // ignore: cast_nullable_to_non_nullable
as String?,caption: freezed == caption ? _self.caption : caption // ignore: cast_nullable_to_non_nullable
as String?,width: freezed == width ? _self.width : width // ignore: cast_nullable_to_non_nullable
as int?,height: freezed == height ? _self.height : height // ignore: cast_nullable_to_non_nullable
as int?,isCover: null == isCover ? _self.isCover : isCover // ignore: cast_nullable_to_non_nullable
as bool,isHero: null == isHero ? _self.isHero : isHero // ignore: cast_nullable_to_non_nullable
as bool,categoryGalleryOrder: freezed == categoryGalleryOrder ? _self.categoryGalleryOrder : categoryGalleryOrder // ignore: cast_nullable_to_non_nullable
as int?,projectId: null == projectId ? _self.projectId : projectId // ignore: cast_nullable_to_non_nullable
as String,projectTitle: null == projectTitle ? _self.projectTitle : projectTitle // ignore: cast_nullable_to_non_nullable
as String,projectSlug: null == projectSlug ? _self.projectSlug : projectSlug // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
