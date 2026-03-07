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

 String get id; String get name; String get slug; String? get description; String? get thumbnailUrl; String? get iconName; String? get color; int get sortOrder; bool get isActive; int get projectCount; int get viewCount; String get createdAt; String get updatedAt;
/// Create a copy of CategoryItem
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CategoryItemCopyWith<CategoryItem> get copyWith => _$CategoryItemCopyWithImpl<CategoryItem>(this as CategoryItem, _$identity);

  /// Serializes this CategoryItem to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CategoryItem&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.slug, slug) || other.slug == slug)&&(identical(other.description, description) || other.description == description)&&(identical(other.thumbnailUrl, thumbnailUrl) || other.thumbnailUrl == thumbnailUrl)&&(identical(other.iconName, iconName) || other.iconName == iconName)&&(identical(other.color, color) || other.color == color)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.projectCount, projectCount) || other.projectCount == projectCount)&&(identical(other.viewCount, viewCount) || other.viewCount == viewCount)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name,slug,description,thumbnailUrl,iconName,color,sortOrder,isActive,projectCount,viewCount,createdAt,updatedAt);

@override
String toString() {
  return 'CategoryItem(id: $id, name: $name, slug: $slug, description: $description, thumbnailUrl: $thumbnailUrl, iconName: $iconName, color: $color, sortOrder: $sortOrder, isActive: $isActive, projectCount: $projectCount, viewCount: $viewCount, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $CategoryItemCopyWith<$Res>  {
  factory $CategoryItemCopyWith(CategoryItem value, $Res Function(CategoryItem) _then) = _$CategoryItemCopyWithImpl;
@useResult
$Res call({
 String id, String name, String slug, String? description, String? thumbnailUrl, String? iconName, String? color, int sortOrder, bool isActive, int projectCount, int viewCount, String createdAt, String updatedAt
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
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? slug = null,Object? description = freezed,Object? thumbnailUrl = freezed,Object? iconName = freezed,Object? color = freezed,Object? sortOrder = null,Object? isActive = null,Object? projectCount = null,Object? viewCount = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,slug: null == slug ? _self.slug : slug // ignore: cast_nullable_to_non_nullable
as String,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,thumbnailUrl: freezed == thumbnailUrl ? _self.thumbnailUrl : thumbnailUrl // ignore: cast_nullable_to_non_nullable
as String?,iconName: freezed == iconName ? _self.iconName : iconName // ignore: cast_nullable_to_non_nullable
as String?,color: freezed == color ? _self.color : color // ignore: cast_nullable_to_non_nullable
as String?,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,projectCount: null == projectCount ? _self.projectCount : projectCount // ignore: cast_nullable_to_non_nullable
as int,viewCount: null == viewCount ? _self.viewCount : viewCount // ignore: cast_nullable_to_non_nullable
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String name,  String slug,  String? description,  String? thumbnailUrl,  String? iconName,  String? color,  int sortOrder,  bool isActive,  int projectCount,  int viewCount,  String createdAt,  String updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CategoryItem() when $default != null:
return $default(_that.id,_that.name,_that.slug,_that.description,_that.thumbnailUrl,_that.iconName,_that.color,_that.sortOrder,_that.isActive,_that.projectCount,_that.viewCount,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String name,  String slug,  String? description,  String? thumbnailUrl,  String? iconName,  String? color,  int sortOrder,  bool isActive,  int projectCount,  int viewCount,  String createdAt,  String updatedAt)  $default,) {final _that = this;
switch (_that) {
case _CategoryItem():
return $default(_that.id,_that.name,_that.slug,_that.description,_that.thumbnailUrl,_that.iconName,_that.color,_that.sortOrder,_that.isActive,_that.projectCount,_that.viewCount,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String name,  String slug,  String? description,  String? thumbnailUrl,  String? iconName,  String? color,  int sortOrder,  bool isActive,  int projectCount,  int viewCount,  String createdAt,  String updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _CategoryItem() when $default != null:
return $default(_that.id,_that.name,_that.slug,_that.description,_that.thumbnailUrl,_that.iconName,_that.color,_that.sortOrder,_that.isActive,_that.projectCount,_that.viewCount,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _CategoryItem implements CategoryItem {
  const _CategoryItem({required this.id, required this.name, required this.slug, this.description, this.thumbnailUrl, this.iconName, this.color, this.sortOrder = 0, this.isActive = true, this.projectCount = 0, this.viewCount = 0, required this.createdAt, required this.updatedAt});
  factory _CategoryItem.fromJson(Map<String, dynamic> json) => _$CategoryItemFromJson(json);

@override final  String id;
@override final  String name;
@override final  String slug;
@override final  String? description;
@override final  String? thumbnailUrl;
@override final  String? iconName;
@override final  String? color;
@override@JsonKey() final  int sortOrder;
@override@JsonKey() final  bool isActive;
@override@JsonKey() final  int projectCount;
@override@JsonKey() final  int viewCount;
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
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _CategoryItem&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.slug, slug) || other.slug == slug)&&(identical(other.description, description) || other.description == description)&&(identical(other.thumbnailUrl, thumbnailUrl) || other.thumbnailUrl == thumbnailUrl)&&(identical(other.iconName, iconName) || other.iconName == iconName)&&(identical(other.color, color) || other.color == color)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.projectCount, projectCount) || other.projectCount == projectCount)&&(identical(other.viewCount, viewCount) || other.viewCount == viewCount)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name,slug,description,thumbnailUrl,iconName,color,sortOrder,isActive,projectCount,viewCount,createdAt,updatedAt);

@override
String toString() {
  return 'CategoryItem(id: $id, name: $name, slug: $slug, description: $description, thumbnailUrl: $thumbnailUrl, iconName: $iconName, color: $color, sortOrder: $sortOrder, isActive: $isActive, projectCount: $projectCount, viewCount: $viewCount, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$CategoryItemCopyWith<$Res> implements $CategoryItemCopyWith<$Res> {
  factory _$CategoryItemCopyWith(_CategoryItem value, $Res Function(_CategoryItem) _then) = __$CategoryItemCopyWithImpl;
@override @useResult
$Res call({
 String id, String name, String slug, String? description, String? thumbnailUrl, String? iconName, String? color, int sortOrder, bool isActive, int projectCount, int viewCount, String createdAt, String updatedAt
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
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? slug = null,Object? description = freezed,Object? thumbnailUrl = freezed,Object? iconName = freezed,Object? color = freezed,Object? sortOrder = null,Object? isActive = null,Object? projectCount = null,Object? viewCount = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_CategoryItem(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,slug: null == slug ? _self.slug : slug // ignore: cast_nullable_to_non_nullable
as String,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,thumbnailUrl: freezed == thumbnailUrl ? _self.thumbnailUrl : thumbnailUrl // ignore: cast_nullable_to_non_nullable
as String?,iconName: freezed == iconName ? _self.iconName : iconName // ignore: cast_nullable_to_non_nullable
as String?,color: freezed == color ? _self.color : color // ignore: cast_nullable_to_non_nullable
as String?,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,projectCount: null == projectCount ? _self.projectCount : projectCount // ignore: cast_nullable_to_non_nullable
as int,viewCount: null == viewCount ? _self.viewCount : viewCount // ignore: cast_nullable_to_non_nullable
as int,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}


/// @nodoc
mixin _$CategoryDetail {

 String get id; String get name; String get slug; String? get description; String? get thumbnailUrl; String? get coverImageUrl; String? get iconName; String? get color; String? get metaTitle; String? get metaDescription; List<String> get metaKeywords; String? get ogImage; int get sortOrder; bool get isActive; int get projectCount; int get viewCount; String get createdAt; String get updatedAt;
/// Create a copy of CategoryDetail
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CategoryDetailCopyWith<CategoryDetail> get copyWith => _$CategoryDetailCopyWithImpl<CategoryDetail>(this as CategoryDetail, _$identity);

  /// Serializes this CategoryDetail to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CategoryDetail&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.slug, slug) || other.slug == slug)&&(identical(other.description, description) || other.description == description)&&(identical(other.thumbnailUrl, thumbnailUrl) || other.thumbnailUrl == thumbnailUrl)&&(identical(other.coverImageUrl, coverImageUrl) || other.coverImageUrl == coverImageUrl)&&(identical(other.iconName, iconName) || other.iconName == iconName)&&(identical(other.color, color) || other.color == color)&&(identical(other.metaTitle, metaTitle) || other.metaTitle == metaTitle)&&(identical(other.metaDescription, metaDescription) || other.metaDescription == metaDescription)&&const DeepCollectionEquality().equals(other.metaKeywords, metaKeywords)&&(identical(other.ogImage, ogImage) || other.ogImage == ogImage)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.projectCount, projectCount) || other.projectCount == projectCount)&&(identical(other.viewCount, viewCount) || other.viewCount == viewCount)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name,slug,description,thumbnailUrl,coverImageUrl,iconName,color,metaTitle,metaDescription,const DeepCollectionEquality().hash(metaKeywords),ogImage,sortOrder,isActive,projectCount,viewCount,createdAt,updatedAt);

@override
String toString() {
  return 'CategoryDetail(id: $id, name: $name, slug: $slug, description: $description, thumbnailUrl: $thumbnailUrl, coverImageUrl: $coverImageUrl, iconName: $iconName, color: $color, metaTitle: $metaTitle, metaDescription: $metaDescription, metaKeywords: $metaKeywords, ogImage: $ogImage, sortOrder: $sortOrder, isActive: $isActive, projectCount: $projectCount, viewCount: $viewCount, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $CategoryDetailCopyWith<$Res>  {
  factory $CategoryDetailCopyWith(CategoryDetail value, $Res Function(CategoryDetail) _then) = _$CategoryDetailCopyWithImpl;
@useResult
$Res call({
 String id, String name, String slug, String? description, String? thumbnailUrl, String? coverImageUrl, String? iconName, String? color, String? metaTitle, String? metaDescription, List<String> metaKeywords, String? ogImage, int sortOrder, bool isActive, int projectCount, int viewCount, String createdAt, String updatedAt
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
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? slug = null,Object? description = freezed,Object? thumbnailUrl = freezed,Object? coverImageUrl = freezed,Object? iconName = freezed,Object? color = freezed,Object? metaTitle = freezed,Object? metaDescription = freezed,Object? metaKeywords = null,Object? ogImage = freezed,Object? sortOrder = null,Object? isActive = null,Object? projectCount = null,Object? viewCount = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,slug: null == slug ? _self.slug : slug // ignore: cast_nullable_to_non_nullable
as String,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,thumbnailUrl: freezed == thumbnailUrl ? _self.thumbnailUrl : thumbnailUrl // ignore: cast_nullable_to_non_nullable
as String?,coverImageUrl: freezed == coverImageUrl ? _self.coverImageUrl : coverImageUrl // ignore: cast_nullable_to_non_nullable
as String?,iconName: freezed == iconName ? _self.iconName : iconName // ignore: cast_nullable_to_non_nullable
as String?,color: freezed == color ? _self.color : color // ignore: cast_nullable_to_non_nullable
as String?,metaTitle: freezed == metaTitle ? _self.metaTitle : metaTitle // ignore: cast_nullable_to_non_nullable
as String?,metaDescription: freezed == metaDescription ? _self.metaDescription : metaDescription // ignore: cast_nullable_to_non_nullable
as String?,metaKeywords: null == metaKeywords ? _self.metaKeywords : metaKeywords // ignore: cast_nullable_to_non_nullable
as List<String>,ogImage: freezed == ogImage ? _self.ogImage : ogImage // ignore: cast_nullable_to_non_nullable
as String?,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,projectCount: null == projectCount ? _self.projectCount : projectCount // ignore: cast_nullable_to_non_nullable
as int,viewCount: null == viewCount ? _self.viewCount : viewCount // ignore: cast_nullable_to_non_nullable
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String name,  String slug,  String? description,  String? thumbnailUrl,  String? coverImageUrl,  String? iconName,  String? color,  String? metaTitle,  String? metaDescription,  List<String> metaKeywords,  String? ogImage,  int sortOrder,  bool isActive,  int projectCount,  int viewCount,  String createdAt,  String updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CategoryDetail() when $default != null:
return $default(_that.id,_that.name,_that.slug,_that.description,_that.thumbnailUrl,_that.coverImageUrl,_that.iconName,_that.color,_that.metaTitle,_that.metaDescription,_that.metaKeywords,_that.ogImage,_that.sortOrder,_that.isActive,_that.projectCount,_that.viewCount,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String name,  String slug,  String? description,  String? thumbnailUrl,  String? coverImageUrl,  String? iconName,  String? color,  String? metaTitle,  String? metaDescription,  List<String> metaKeywords,  String? ogImage,  int sortOrder,  bool isActive,  int projectCount,  int viewCount,  String createdAt,  String updatedAt)  $default,) {final _that = this;
switch (_that) {
case _CategoryDetail():
return $default(_that.id,_that.name,_that.slug,_that.description,_that.thumbnailUrl,_that.coverImageUrl,_that.iconName,_that.color,_that.metaTitle,_that.metaDescription,_that.metaKeywords,_that.ogImage,_that.sortOrder,_that.isActive,_that.projectCount,_that.viewCount,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String name,  String slug,  String? description,  String? thumbnailUrl,  String? coverImageUrl,  String? iconName,  String? color,  String? metaTitle,  String? metaDescription,  List<String> metaKeywords,  String? ogImage,  int sortOrder,  bool isActive,  int projectCount,  int viewCount,  String createdAt,  String updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _CategoryDetail() when $default != null:
return $default(_that.id,_that.name,_that.slug,_that.description,_that.thumbnailUrl,_that.coverImageUrl,_that.iconName,_that.color,_that.metaTitle,_that.metaDescription,_that.metaKeywords,_that.ogImage,_that.sortOrder,_that.isActive,_that.projectCount,_that.viewCount,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _CategoryDetail implements CategoryDetail {
  const _CategoryDetail({required this.id, required this.name, required this.slug, this.description, this.thumbnailUrl, this.coverImageUrl, this.iconName, this.color, this.metaTitle, this.metaDescription, final  List<String> metaKeywords = const [], this.ogImage, this.sortOrder = 0, this.isActive = true, this.projectCount = 0, this.viewCount = 0, required this.createdAt, required this.updatedAt}): _metaKeywords = metaKeywords;
  factory _CategoryDetail.fromJson(Map<String, dynamic> json) => _$CategoryDetailFromJson(json);

@override final  String id;
@override final  String name;
@override final  String slug;
@override final  String? description;
@override final  String? thumbnailUrl;
@override final  String? coverImageUrl;
@override final  String? iconName;
@override final  String? color;
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
@override@JsonKey() final  int viewCount;
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
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _CategoryDetail&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.slug, slug) || other.slug == slug)&&(identical(other.description, description) || other.description == description)&&(identical(other.thumbnailUrl, thumbnailUrl) || other.thumbnailUrl == thumbnailUrl)&&(identical(other.coverImageUrl, coverImageUrl) || other.coverImageUrl == coverImageUrl)&&(identical(other.iconName, iconName) || other.iconName == iconName)&&(identical(other.color, color) || other.color == color)&&(identical(other.metaTitle, metaTitle) || other.metaTitle == metaTitle)&&(identical(other.metaDescription, metaDescription) || other.metaDescription == metaDescription)&&const DeepCollectionEquality().equals(other._metaKeywords, _metaKeywords)&&(identical(other.ogImage, ogImage) || other.ogImage == ogImage)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.projectCount, projectCount) || other.projectCount == projectCount)&&(identical(other.viewCount, viewCount) || other.viewCount == viewCount)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name,slug,description,thumbnailUrl,coverImageUrl,iconName,color,metaTitle,metaDescription,const DeepCollectionEquality().hash(_metaKeywords),ogImage,sortOrder,isActive,projectCount,viewCount,createdAt,updatedAt);

@override
String toString() {
  return 'CategoryDetail(id: $id, name: $name, slug: $slug, description: $description, thumbnailUrl: $thumbnailUrl, coverImageUrl: $coverImageUrl, iconName: $iconName, color: $color, metaTitle: $metaTitle, metaDescription: $metaDescription, metaKeywords: $metaKeywords, ogImage: $ogImage, sortOrder: $sortOrder, isActive: $isActive, projectCount: $projectCount, viewCount: $viewCount, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$CategoryDetailCopyWith<$Res> implements $CategoryDetailCopyWith<$Res> {
  factory _$CategoryDetailCopyWith(_CategoryDetail value, $Res Function(_CategoryDetail) _then) = __$CategoryDetailCopyWithImpl;
@override @useResult
$Res call({
 String id, String name, String slug, String? description, String? thumbnailUrl, String? coverImageUrl, String? iconName, String? color, String? metaTitle, String? metaDescription, List<String> metaKeywords, String? ogImage, int sortOrder, bool isActive, int projectCount, int viewCount, String createdAt, String updatedAt
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
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? slug = null,Object? description = freezed,Object? thumbnailUrl = freezed,Object? coverImageUrl = freezed,Object? iconName = freezed,Object? color = freezed,Object? metaTitle = freezed,Object? metaDescription = freezed,Object? metaKeywords = null,Object? ogImage = freezed,Object? sortOrder = null,Object? isActive = null,Object? projectCount = null,Object? viewCount = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_CategoryDetail(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,slug: null == slug ? _self.slug : slug // ignore: cast_nullable_to_non_nullable
as String,description: freezed == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String?,thumbnailUrl: freezed == thumbnailUrl ? _self.thumbnailUrl : thumbnailUrl // ignore: cast_nullable_to_non_nullable
as String?,coverImageUrl: freezed == coverImageUrl ? _self.coverImageUrl : coverImageUrl // ignore: cast_nullable_to_non_nullable
as String?,iconName: freezed == iconName ? _self.iconName : iconName // ignore: cast_nullable_to_non_nullable
as String?,color: freezed == color ? _self.color : color // ignore: cast_nullable_to_non_nullable
as String?,metaTitle: freezed == metaTitle ? _self.metaTitle : metaTitle // ignore: cast_nullable_to_non_nullable
as String?,metaDescription: freezed == metaDescription ? _self.metaDescription : metaDescription // ignore: cast_nullable_to_non_nullable
as String?,metaKeywords: null == metaKeywords ? _self._metaKeywords : metaKeywords // ignore: cast_nullable_to_non_nullable
as List<String>,ogImage: freezed == ogImage ? _self.ogImage : ogImage // ignore: cast_nullable_to_non_nullable
as String?,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,projectCount: null == projectCount ? _self.projectCount : projectCount // ignore: cast_nullable_to_non_nullable
as int,viewCount: null == viewCount ? _self.viewCount : viewCount // ignore: cast_nullable_to_non_nullable
as int,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}

// dart format on
