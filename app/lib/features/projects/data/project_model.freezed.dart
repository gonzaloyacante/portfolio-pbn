// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'project_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ProjectCategory {

 String get id; String get name; String get slug;
/// Create a copy of ProjectCategory
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ProjectCategoryCopyWith<ProjectCategory> get copyWith => _$ProjectCategoryCopyWithImpl<ProjectCategory>(this as ProjectCategory, _$identity);

  /// Serializes this ProjectCategory to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ProjectCategory&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.slug, slug) || other.slug == slug));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name,slug);

@override
String toString() {
  return 'ProjectCategory(id: $id, name: $name, slug: $slug)';
}


}

/// @nodoc
abstract mixin class $ProjectCategoryCopyWith<$Res>  {
  factory $ProjectCategoryCopyWith(ProjectCategory value, $Res Function(ProjectCategory) _then) = _$ProjectCategoryCopyWithImpl;
@useResult
$Res call({
 String id, String name, String slug
});




}
/// @nodoc
class _$ProjectCategoryCopyWithImpl<$Res>
    implements $ProjectCategoryCopyWith<$Res> {
  _$ProjectCategoryCopyWithImpl(this._self, this._then);

  final ProjectCategory _self;
  final $Res Function(ProjectCategory) _then;

/// Create a copy of ProjectCategory
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? slug = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,slug: null == slug ? _self.slug : slug // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [ProjectCategory].
extension ProjectCategoryPatterns on ProjectCategory {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ProjectCategory value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ProjectCategory() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ProjectCategory value)  $default,){
final _that = this;
switch (_that) {
case _ProjectCategory():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ProjectCategory value)?  $default,){
final _that = this;
switch (_that) {
case _ProjectCategory() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String name,  String slug)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ProjectCategory() when $default != null:
return $default(_that.id,_that.name,_that.slug);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String name,  String slug)  $default,) {final _that = this;
switch (_that) {
case _ProjectCategory():
return $default(_that.id,_that.name,_that.slug);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String name,  String slug)?  $default,) {final _that = this;
switch (_that) {
case _ProjectCategory() when $default != null:
return $default(_that.id,_that.name,_that.slug);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ProjectCategory implements ProjectCategory {
  const _ProjectCategory({required this.id, required this.name, required this.slug});
  factory _ProjectCategory.fromJson(Map<String, dynamic> json) => _$ProjectCategoryFromJson(json);

@override final  String id;
@override final  String name;
@override final  String slug;

/// Create a copy of ProjectCategory
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ProjectCategoryCopyWith<_ProjectCategory> get copyWith => __$ProjectCategoryCopyWithImpl<_ProjectCategory>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ProjectCategoryToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ProjectCategory&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.slug, slug) || other.slug == slug));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name,slug);

@override
String toString() {
  return 'ProjectCategory(id: $id, name: $name, slug: $slug)';
}


}

/// @nodoc
abstract mixin class _$ProjectCategoryCopyWith<$Res> implements $ProjectCategoryCopyWith<$Res> {
  factory _$ProjectCategoryCopyWith(_ProjectCategory value, $Res Function(_ProjectCategory) _then) = __$ProjectCategoryCopyWithImpl;
@override @useResult
$Res call({
 String id, String name, String slug
});




}
/// @nodoc
class __$ProjectCategoryCopyWithImpl<$Res>
    implements _$ProjectCategoryCopyWith<$Res> {
  __$ProjectCategoryCopyWithImpl(this._self, this._then);

  final _ProjectCategory _self;
  final $Res Function(_ProjectCategory) _then;

/// Create a copy of ProjectCategory
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? slug = null,}) {
  return _then(_ProjectCategory(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,slug: null == slug ? _self.slug : slug // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}


/// @nodoc
mixin _$ProjectImage {

 String get id;@JsonKey(name: 'url') String get imageUrl;@JsonKey(name: 'alt') String? get altText;@JsonKey(name: 'order') int get sortOrder;
/// Create a copy of ProjectImage
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ProjectImageCopyWith<ProjectImage> get copyWith => _$ProjectImageCopyWithImpl<ProjectImage>(this as ProjectImage, _$identity);

  /// Serializes this ProjectImage to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ProjectImage&&(identical(other.id, id) || other.id == id)&&(identical(other.imageUrl, imageUrl) || other.imageUrl == imageUrl)&&(identical(other.altText, altText) || other.altText == altText)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,imageUrl,altText,sortOrder);

@override
String toString() {
  return 'ProjectImage(id: $id, imageUrl: $imageUrl, altText: $altText, sortOrder: $sortOrder)';
}


}

/// @nodoc
abstract mixin class $ProjectImageCopyWith<$Res>  {
  factory $ProjectImageCopyWith(ProjectImage value, $Res Function(ProjectImage) _then) = _$ProjectImageCopyWithImpl;
@useResult
$Res call({
 String id,@JsonKey(name: 'url') String imageUrl,@JsonKey(name: 'alt') String? altText,@JsonKey(name: 'order') int sortOrder
});




}
/// @nodoc
class _$ProjectImageCopyWithImpl<$Res>
    implements $ProjectImageCopyWith<$Res> {
  _$ProjectImageCopyWithImpl(this._self, this._then);

  final ProjectImage _self;
  final $Res Function(ProjectImage) _then;

/// Create a copy of ProjectImage
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? imageUrl = null,Object? altText = freezed,Object? sortOrder = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,imageUrl: null == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
as String,altText: freezed == altText ? _self.altText : altText // ignore: cast_nullable_to_non_nullable
as String?,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [ProjectImage].
extension ProjectImagePatterns on ProjectImage {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ProjectImage value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ProjectImage() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ProjectImage value)  $default,){
final _that = this;
switch (_that) {
case _ProjectImage():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ProjectImage value)?  $default,){
final _that = this;
switch (_that) {
case _ProjectImage() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'url')  String imageUrl, @JsonKey(name: 'alt')  String? altText, @JsonKey(name: 'order')  int sortOrder)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ProjectImage() when $default != null:
return $default(_that.id,_that.imageUrl,_that.altText,_that.sortOrder);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'url')  String imageUrl, @JsonKey(name: 'alt')  String? altText, @JsonKey(name: 'order')  int sortOrder)  $default,) {final _that = this;
switch (_that) {
case _ProjectImage():
return $default(_that.id,_that.imageUrl,_that.altText,_that.sortOrder);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'url')  String imageUrl, @JsonKey(name: 'alt')  String? altText, @JsonKey(name: 'order')  int sortOrder)?  $default,) {final _that = this;
switch (_that) {
case _ProjectImage() when $default != null:
return $default(_that.id,_that.imageUrl,_that.altText,_that.sortOrder);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ProjectImage implements ProjectImage {
  const _ProjectImage({required this.id, @JsonKey(name: 'url') required this.imageUrl, @JsonKey(name: 'alt') this.altText, @JsonKey(name: 'order') this.sortOrder = 0});
  factory _ProjectImage.fromJson(Map<String, dynamic> json) => _$ProjectImageFromJson(json);

@override final  String id;
@override@JsonKey(name: 'url') final  String imageUrl;
@override@JsonKey(name: 'alt') final  String? altText;
@override@JsonKey(name: 'order') final  int sortOrder;

/// Create a copy of ProjectImage
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ProjectImageCopyWith<_ProjectImage> get copyWith => __$ProjectImageCopyWithImpl<_ProjectImage>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ProjectImageToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ProjectImage&&(identical(other.id, id) || other.id == id)&&(identical(other.imageUrl, imageUrl) || other.imageUrl == imageUrl)&&(identical(other.altText, altText) || other.altText == altText)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,imageUrl,altText,sortOrder);

@override
String toString() {
  return 'ProjectImage(id: $id, imageUrl: $imageUrl, altText: $altText, sortOrder: $sortOrder)';
}


}

/// @nodoc
abstract mixin class _$ProjectImageCopyWith<$Res> implements $ProjectImageCopyWith<$Res> {
  factory _$ProjectImageCopyWith(_ProjectImage value, $Res Function(_ProjectImage) _then) = __$ProjectImageCopyWithImpl;
@override @useResult
$Res call({
 String id,@JsonKey(name: 'url') String imageUrl,@JsonKey(name: 'alt') String? altText,@JsonKey(name: 'order') int sortOrder
});




}
/// @nodoc
class __$ProjectImageCopyWithImpl<$Res>
    implements _$ProjectImageCopyWith<$Res> {
  __$ProjectImageCopyWithImpl(this._self, this._then);

  final _ProjectImage _self;
  final $Res Function(_ProjectImage) _then;

/// Create a copy of ProjectImage
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? imageUrl = null,Object? altText = freezed,Object? sortOrder = null,}) {
  return _then(_ProjectImage(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,imageUrl: null == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
as String,altText: freezed == altText ? _self.altText : altText // ignore: cast_nullable_to_non_nullable
as String?,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}


/// @nodoc
mixin _$ProjectListItem {

 String get id; String get title; String get slug; String? get excerpt; String? get thumbnailUrl; String get date; int get sortOrder; bool get isFeatured; bool get isPinned; bool get isActive; int get viewCount; String get createdAt; String get updatedAt; ProjectCategory get category;
/// Create a copy of ProjectListItem
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ProjectListItemCopyWith<ProjectListItem> get copyWith => _$ProjectListItemCopyWithImpl<ProjectListItem>(this as ProjectListItem, _$identity);

  /// Serializes this ProjectListItem to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ProjectListItem&&(identical(other.id, id) || other.id == id)&&(identical(other.title, title) || other.title == title)&&(identical(other.slug, slug) || other.slug == slug)&&(identical(other.excerpt, excerpt) || other.excerpt == excerpt)&&(identical(other.thumbnailUrl, thumbnailUrl) || other.thumbnailUrl == thumbnailUrl)&&(identical(other.date, date) || other.date == date)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder)&&(identical(other.isFeatured, isFeatured) || other.isFeatured == isFeatured)&&(identical(other.isPinned, isPinned) || other.isPinned == isPinned)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.viewCount, viewCount) || other.viewCount == viewCount)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&(identical(other.category, category) || other.category == category));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,title,slug,excerpt,thumbnailUrl,date,sortOrder,isFeatured,isPinned,isActive,viewCount,createdAt,updatedAt,category);

@override
String toString() {
  return 'ProjectListItem(id: $id, title: $title, slug: $slug, excerpt: $excerpt, thumbnailUrl: $thumbnailUrl, date: $date, sortOrder: $sortOrder, isFeatured: $isFeatured, isPinned: $isPinned, isActive: $isActive, viewCount: $viewCount, createdAt: $createdAt, updatedAt: $updatedAt, category: $category)';
}


}

/// @nodoc
abstract mixin class $ProjectListItemCopyWith<$Res>  {
  factory $ProjectListItemCopyWith(ProjectListItem value, $Res Function(ProjectListItem) _then) = _$ProjectListItemCopyWithImpl;
@useResult
$Res call({
 String id, String title, String slug, String? excerpt, String? thumbnailUrl, String date, int sortOrder, bool isFeatured, bool isPinned, bool isActive, int viewCount, String createdAt, String updatedAt, ProjectCategory category
});


$ProjectCategoryCopyWith<$Res> get category;

}
/// @nodoc
class _$ProjectListItemCopyWithImpl<$Res>
    implements $ProjectListItemCopyWith<$Res> {
  _$ProjectListItemCopyWithImpl(this._self, this._then);

  final ProjectListItem _self;
  final $Res Function(ProjectListItem) _then;

/// Create a copy of ProjectListItem
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? title = null,Object? slug = null,Object? excerpt = freezed,Object? thumbnailUrl = freezed,Object? date = null,Object? sortOrder = null,Object? isFeatured = null,Object? isPinned = null,Object? isActive = null,Object? viewCount = null,Object? createdAt = null,Object? updatedAt = null,Object? category = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,title: null == title ? _self.title : title // ignore: cast_nullable_to_non_nullable
as String,slug: null == slug ? _self.slug : slug // ignore: cast_nullable_to_non_nullable
as String,excerpt: freezed == excerpt ? _self.excerpt : excerpt // ignore: cast_nullable_to_non_nullable
as String?,thumbnailUrl: freezed == thumbnailUrl ? _self.thumbnailUrl : thumbnailUrl // ignore: cast_nullable_to_non_nullable
as String?,date: null == date ? _self.date : date // ignore: cast_nullable_to_non_nullable
as String,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,isFeatured: null == isFeatured ? _self.isFeatured : isFeatured // ignore: cast_nullable_to_non_nullable
as bool,isPinned: null == isPinned ? _self.isPinned : isPinned // ignore: cast_nullable_to_non_nullable
as bool,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,viewCount: null == viewCount ? _self.viewCount : viewCount // ignore: cast_nullable_to_non_nullable
as int,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as String,category: null == category ? _self.category : category // ignore: cast_nullable_to_non_nullable
as ProjectCategory,
  ));
}
/// Create a copy of ProjectListItem
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$ProjectCategoryCopyWith<$Res> get category {
  
  return $ProjectCategoryCopyWith<$Res>(_self.category, (value) {
    return _then(_self.copyWith(category: value));
  });
}
}


/// Adds pattern-matching-related methods to [ProjectListItem].
extension ProjectListItemPatterns on ProjectListItem {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ProjectListItem value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ProjectListItem() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ProjectListItem value)  $default,){
final _that = this;
switch (_that) {
case _ProjectListItem():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ProjectListItem value)?  $default,){
final _that = this;
switch (_that) {
case _ProjectListItem() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String title,  String slug,  String? excerpt,  String? thumbnailUrl,  String date,  int sortOrder,  bool isFeatured,  bool isPinned,  bool isActive,  int viewCount,  String createdAt,  String updatedAt,  ProjectCategory category)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ProjectListItem() when $default != null:
return $default(_that.id,_that.title,_that.slug,_that.excerpt,_that.thumbnailUrl,_that.date,_that.sortOrder,_that.isFeatured,_that.isPinned,_that.isActive,_that.viewCount,_that.createdAt,_that.updatedAt,_that.category);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String title,  String slug,  String? excerpt,  String? thumbnailUrl,  String date,  int sortOrder,  bool isFeatured,  bool isPinned,  bool isActive,  int viewCount,  String createdAt,  String updatedAt,  ProjectCategory category)  $default,) {final _that = this;
switch (_that) {
case _ProjectListItem():
return $default(_that.id,_that.title,_that.slug,_that.excerpt,_that.thumbnailUrl,_that.date,_that.sortOrder,_that.isFeatured,_that.isPinned,_that.isActive,_that.viewCount,_that.createdAt,_that.updatedAt,_that.category);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String title,  String slug,  String? excerpt,  String? thumbnailUrl,  String date,  int sortOrder,  bool isFeatured,  bool isPinned,  bool isActive,  int viewCount,  String createdAt,  String updatedAt,  ProjectCategory category)?  $default,) {final _that = this;
switch (_that) {
case _ProjectListItem() when $default != null:
return $default(_that.id,_that.title,_that.slug,_that.excerpt,_that.thumbnailUrl,_that.date,_that.sortOrder,_that.isFeatured,_that.isPinned,_that.isActive,_that.viewCount,_that.createdAt,_that.updatedAt,_that.category);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ProjectListItem implements ProjectListItem {
  const _ProjectListItem({required this.id, required this.title, required this.slug, this.excerpt, this.thumbnailUrl, required this.date, this.sortOrder = 0, this.isFeatured = false, this.isPinned = false, this.isActive = true, this.viewCount = 0, required this.createdAt, required this.updatedAt, required this.category});
  factory _ProjectListItem.fromJson(Map<String, dynamic> json) => _$ProjectListItemFromJson(json);

@override final  String id;
@override final  String title;
@override final  String slug;
@override final  String? excerpt;
@override final  String? thumbnailUrl;
@override final  String date;
@override@JsonKey() final  int sortOrder;
@override@JsonKey() final  bool isFeatured;
@override@JsonKey() final  bool isPinned;
@override@JsonKey() final  bool isActive;
@override@JsonKey() final  int viewCount;
@override final  String createdAt;
@override final  String updatedAt;
@override final  ProjectCategory category;

/// Create a copy of ProjectListItem
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ProjectListItemCopyWith<_ProjectListItem> get copyWith => __$ProjectListItemCopyWithImpl<_ProjectListItem>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ProjectListItemToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ProjectListItem&&(identical(other.id, id) || other.id == id)&&(identical(other.title, title) || other.title == title)&&(identical(other.slug, slug) || other.slug == slug)&&(identical(other.excerpt, excerpt) || other.excerpt == excerpt)&&(identical(other.thumbnailUrl, thumbnailUrl) || other.thumbnailUrl == thumbnailUrl)&&(identical(other.date, date) || other.date == date)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder)&&(identical(other.isFeatured, isFeatured) || other.isFeatured == isFeatured)&&(identical(other.isPinned, isPinned) || other.isPinned == isPinned)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.viewCount, viewCount) || other.viewCount == viewCount)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&(identical(other.category, category) || other.category == category));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,title,slug,excerpt,thumbnailUrl,date,sortOrder,isFeatured,isPinned,isActive,viewCount,createdAt,updatedAt,category);

@override
String toString() {
  return 'ProjectListItem(id: $id, title: $title, slug: $slug, excerpt: $excerpt, thumbnailUrl: $thumbnailUrl, date: $date, sortOrder: $sortOrder, isFeatured: $isFeatured, isPinned: $isPinned, isActive: $isActive, viewCount: $viewCount, createdAt: $createdAt, updatedAt: $updatedAt, category: $category)';
}


}

/// @nodoc
abstract mixin class _$ProjectListItemCopyWith<$Res> implements $ProjectListItemCopyWith<$Res> {
  factory _$ProjectListItemCopyWith(_ProjectListItem value, $Res Function(_ProjectListItem) _then) = __$ProjectListItemCopyWithImpl;
@override @useResult
$Res call({
 String id, String title, String slug, String? excerpt, String? thumbnailUrl, String date, int sortOrder, bool isFeatured, bool isPinned, bool isActive, int viewCount, String createdAt, String updatedAt, ProjectCategory category
});


@override $ProjectCategoryCopyWith<$Res> get category;

}
/// @nodoc
class __$ProjectListItemCopyWithImpl<$Res>
    implements _$ProjectListItemCopyWith<$Res> {
  __$ProjectListItemCopyWithImpl(this._self, this._then);

  final _ProjectListItem _self;
  final $Res Function(_ProjectListItem) _then;

/// Create a copy of ProjectListItem
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? title = null,Object? slug = null,Object? excerpt = freezed,Object? thumbnailUrl = freezed,Object? date = null,Object? sortOrder = null,Object? isFeatured = null,Object? isPinned = null,Object? isActive = null,Object? viewCount = null,Object? createdAt = null,Object? updatedAt = null,Object? category = null,}) {
  return _then(_ProjectListItem(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,title: null == title ? _self.title : title // ignore: cast_nullable_to_non_nullable
as String,slug: null == slug ? _self.slug : slug // ignore: cast_nullable_to_non_nullable
as String,excerpt: freezed == excerpt ? _self.excerpt : excerpt // ignore: cast_nullable_to_non_nullable
as String?,thumbnailUrl: freezed == thumbnailUrl ? _self.thumbnailUrl : thumbnailUrl // ignore: cast_nullable_to_non_nullable
as String?,date: null == date ? _self.date : date // ignore: cast_nullable_to_non_nullable
as String,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,isFeatured: null == isFeatured ? _self.isFeatured : isFeatured // ignore: cast_nullable_to_non_nullable
as bool,isPinned: null == isPinned ? _self.isPinned : isPinned // ignore: cast_nullable_to_non_nullable
as bool,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,viewCount: null == viewCount ? _self.viewCount : viewCount // ignore: cast_nullable_to_non_nullable
as int,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as String,category: null == category ? _self.category : category // ignore: cast_nullable_to_non_nullable
as ProjectCategory,
  ));
}

/// Create a copy of ProjectListItem
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$ProjectCategoryCopyWith<$Res> get category {
  
  return $ProjectCategoryCopyWith<$Res>(_self.category, (value) {
    return _then(_self.copyWith(category: value));
  });
}
}


/// @nodoc
mixin _$ProjectDetail {

 String get id; String get title; String get slug; String get description; String? get excerpt; String? get thumbnailUrl; String? get videoUrl; String get date; String? get duration; String? get client; String? get location; List<String> get tags; String? get metaTitle; String? get metaDescription; List<String> get metaKeywords; String? get ogImage; String get categoryId; int get sortOrder; bool get isFeatured; bool get isPinned; bool get isActive; int get viewCount; int get likeCount; String? get publishedAt; String get createdAt; String get updatedAt; ProjectCategory get category; List<ProjectImage> get images;
/// Create a copy of ProjectDetail
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ProjectDetailCopyWith<ProjectDetail> get copyWith => _$ProjectDetailCopyWithImpl<ProjectDetail>(this as ProjectDetail, _$identity);

  /// Serializes this ProjectDetail to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ProjectDetail&&(identical(other.id, id) || other.id == id)&&(identical(other.title, title) || other.title == title)&&(identical(other.slug, slug) || other.slug == slug)&&(identical(other.description, description) || other.description == description)&&(identical(other.excerpt, excerpt) || other.excerpt == excerpt)&&(identical(other.thumbnailUrl, thumbnailUrl) || other.thumbnailUrl == thumbnailUrl)&&(identical(other.videoUrl, videoUrl) || other.videoUrl == videoUrl)&&(identical(other.date, date) || other.date == date)&&(identical(other.duration, duration) || other.duration == duration)&&(identical(other.client, client) || other.client == client)&&(identical(other.location, location) || other.location == location)&&const DeepCollectionEquality().equals(other.tags, tags)&&(identical(other.metaTitle, metaTitle) || other.metaTitle == metaTitle)&&(identical(other.metaDescription, metaDescription) || other.metaDescription == metaDescription)&&const DeepCollectionEquality().equals(other.metaKeywords, metaKeywords)&&(identical(other.ogImage, ogImage) || other.ogImage == ogImage)&&(identical(other.categoryId, categoryId) || other.categoryId == categoryId)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder)&&(identical(other.isFeatured, isFeatured) || other.isFeatured == isFeatured)&&(identical(other.isPinned, isPinned) || other.isPinned == isPinned)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.viewCount, viewCount) || other.viewCount == viewCount)&&(identical(other.likeCount, likeCount) || other.likeCount == likeCount)&&(identical(other.publishedAt, publishedAt) || other.publishedAt == publishedAt)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&(identical(other.category, category) || other.category == category)&&const DeepCollectionEquality().equals(other.images, images));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hashAll([runtimeType,id,title,slug,description,excerpt,thumbnailUrl,videoUrl,date,duration,client,location,const DeepCollectionEquality().hash(tags),metaTitle,metaDescription,const DeepCollectionEquality().hash(metaKeywords),ogImage,categoryId,sortOrder,isFeatured,isPinned,isActive,viewCount,likeCount,publishedAt,createdAt,updatedAt,category,const DeepCollectionEquality().hash(images)]);

@override
String toString() {
  return 'ProjectDetail(id: $id, title: $title, slug: $slug, description: $description, excerpt: $excerpt, thumbnailUrl: $thumbnailUrl, videoUrl: $videoUrl, date: $date, duration: $duration, client: $client, location: $location, tags: $tags, metaTitle: $metaTitle, metaDescription: $metaDescription, metaKeywords: $metaKeywords, ogImage: $ogImage, categoryId: $categoryId, sortOrder: $sortOrder, isFeatured: $isFeatured, isPinned: $isPinned, isActive: $isActive, viewCount: $viewCount, likeCount: $likeCount, publishedAt: $publishedAt, createdAt: $createdAt, updatedAt: $updatedAt, category: $category, images: $images)';
}


}

/// @nodoc
abstract mixin class $ProjectDetailCopyWith<$Res>  {
  factory $ProjectDetailCopyWith(ProjectDetail value, $Res Function(ProjectDetail) _then) = _$ProjectDetailCopyWithImpl;
@useResult
$Res call({
 String id, String title, String slug, String description, String? excerpt, String? thumbnailUrl, String? videoUrl, String date, String? duration, String? client, String? location, List<String> tags, String? metaTitle, String? metaDescription, List<String> metaKeywords, String? ogImage, String categoryId, int sortOrder, bool isFeatured, bool isPinned, bool isActive, int viewCount, int likeCount, String? publishedAt, String createdAt, String updatedAt, ProjectCategory category, List<ProjectImage> images
});


$ProjectCategoryCopyWith<$Res> get category;

}
/// @nodoc
class _$ProjectDetailCopyWithImpl<$Res>
    implements $ProjectDetailCopyWith<$Res> {
  _$ProjectDetailCopyWithImpl(this._self, this._then);

  final ProjectDetail _self;
  final $Res Function(ProjectDetail) _then;

/// Create a copy of ProjectDetail
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? title = null,Object? slug = null,Object? description = null,Object? excerpt = freezed,Object? thumbnailUrl = freezed,Object? videoUrl = freezed,Object? date = null,Object? duration = freezed,Object? client = freezed,Object? location = freezed,Object? tags = null,Object? metaTitle = freezed,Object? metaDescription = freezed,Object? metaKeywords = null,Object? ogImage = freezed,Object? categoryId = null,Object? sortOrder = null,Object? isFeatured = null,Object? isPinned = null,Object? isActive = null,Object? viewCount = null,Object? likeCount = null,Object? publishedAt = freezed,Object? createdAt = null,Object? updatedAt = null,Object? category = null,Object? images = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,title: null == title ? _self.title : title // ignore: cast_nullable_to_non_nullable
as String,slug: null == slug ? _self.slug : slug // ignore: cast_nullable_to_non_nullable
as String,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,excerpt: freezed == excerpt ? _self.excerpt : excerpt // ignore: cast_nullable_to_non_nullable
as String?,thumbnailUrl: freezed == thumbnailUrl ? _self.thumbnailUrl : thumbnailUrl // ignore: cast_nullable_to_non_nullable
as String?,videoUrl: freezed == videoUrl ? _self.videoUrl : videoUrl // ignore: cast_nullable_to_non_nullable
as String?,date: null == date ? _self.date : date // ignore: cast_nullable_to_non_nullable
as String,duration: freezed == duration ? _self.duration : duration // ignore: cast_nullable_to_non_nullable
as String?,client: freezed == client ? _self.client : client // ignore: cast_nullable_to_non_nullable
as String?,location: freezed == location ? _self.location : location // ignore: cast_nullable_to_non_nullable
as String?,tags: null == tags ? _self.tags : tags // ignore: cast_nullable_to_non_nullable
as List<String>,metaTitle: freezed == metaTitle ? _self.metaTitle : metaTitle // ignore: cast_nullable_to_non_nullable
as String?,metaDescription: freezed == metaDescription ? _self.metaDescription : metaDescription // ignore: cast_nullable_to_non_nullable
as String?,metaKeywords: null == metaKeywords ? _self.metaKeywords : metaKeywords // ignore: cast_nullable_to_non_nullable
as List<String>,ogImage: freezed == ogImage ? _self.ogImage : ogImage // ignore: cast_nullable_to_non_nullable
as String?,categoryId: null == categoryId ? _self.categoryId : categoryId // ignore: cast_nullable_to_non_nullable
as String,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,isFeatured: null == isFeatured ? _self.isFeatured : isFeatured // ignore: cast_nullable_to_non_nullable
as bool,isPinned: null == isPinned ? _self.isPinned : isPinned // ignore: cast_nullable_to_non_nullable
as bool,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,viewCount: null == viewCount ? _self.viewCount : viewCount // ignore: cast_nullable_to_non_nullable
as int,likeCount: null == likeCount ? _self.likeCount : likeCount // ignore: cast_nullable_to_non_nullable
as int,publishedAt: freezed == publishedAt ? _self.publishedAt : publishedAt // ignore: cast_nullable_to_non_nullable
as String?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as String,category: null == category ? _self.category : category // ignore: cast_nullable_to_non_nullable
as ProjectCategory,images: null == images ? _self.images : images // ignore: cast_nullable_to_non_nullable
as List<ProjectImage>,
  ));
}
/// Create a copy of ProjectDetail
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$ProjectCategoryCopyWith<$Res> get category {
  
  return $ProjectCategoryCopyWith<$Res>(_self.category, (value) {
    return _then(_self.copyWith(category: value));
  });
}
}


/// Adds pattern-matching-related methods to [ProjectDetail].
extension ProjectDetailPatterns on ProjectDetail {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ProjectDetail value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ProjectDetail() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ProjectDetail value)  $default,){
final _that = this;
switch (_that) {
case _ProjectDetail():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ProjectDetail value)?  $default,){
final _that = this;
switch (_that) {
case _ProjectDetail() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String title,  String slug,  String description,  String? excerpt,  String? thumbnailUrl,  String? videoUrl,  String date,  String? duration,  String? client,  String? location,  List<String> tags,  String? metaTitle,  String? metaDescription,  List<String> metaKeywords,  String? ogImage,  String categoryId,  int sortOrder,  bool isFeatured,  bool isPinned,  bool isActive,  int viewCount,  int likeCount,  String? publishedAt,  String createdAt,  String updatedAt,  ProjectCategory category,  List<ProjectImage> images)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ProjectDetail() when $default != null:
return $default(_that.id,_that.title,_that.slug,_that.description,_that.excerpt,_that.thumbnailUrl,_that.videoUrl,_that.date,_that.duration,_that.client,_that.location,_that.tags,_that.metaTitle,_that.metaDescription,_that.metaKeywords,_that.ogImage,_that.categoryId,_that.sortOrder,_that.isFeatured,_that.isPinned,_that.isActive,_that.viewCount,_that.likeCount,_that.publishedAt,_that.createdAt,_that.updatedAt,_that.category,_that.images);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String title,  String slug,  String description,  String? excerpt,  String? thumbnailUrl,  String? videoUrl,  String date,  String? duration,  String? client,  String? location,  List<String> tags,  String? metaTitle,  String? metaDescription,  List<String> metaKeywords,  String? ogImage,  String categoryId,  int sortOrder,  bool isFeatured,  bool isPinned,  bool isActive,  int viewCount,  int likeCount,  String? publishedAt,  String createdAt,  String updatedAt,  ProjectCategory category,  List<ProjectImage> images)  $default,) {final _that = this;
switch (_that) {
case _ProjectDetail():
return $default(_that.id,_that.title,_that.slug,_that.description,_that.excerpt,_that.thumbnailUrl,_that.videoUrl,_that.date,_that.duration,_that.client,_that.location,_that.tags,_that.metaTitle,_that.metaDescription,_that.metaKeywords,_that.ogImage,_that.categoryId,_that.sortOrder,_that.isFeatured,_that.isPinned,_that.isActive,_that.viewCount,_that.likeCount,_that.publishedAt,_that.createdAt,_that.updatedAt,_that.category,_that.images);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String title,  String slug,  String description,  String? excerpt,  String? thumbnailUrl,  String? videoUrl,  String date,  String? duration,  String? client,  String? location,  List<String> tags,  String? metaTitle,  String? metaDescription,  List<String> metaKeywords,  String? ogImage,  String categoryId,  int sortOrder,  bool isFeatured,  bool isPinned,  bool isActive,  int viewCount,  int likeCount,  String? publishedAt,  String createdAt,  String updatedAt,  ProjectCategory category,  List<ProjectImage> images)?  $default,) {final _that = this;
switch (_that) {
case _ProjectDetail() when $default != null:
return $default(_that.id,_that.title,_that.slug,_that.description,_that.excerpt,_that.thumbnailUrl,_that.videoUrl,_that.date,_that.duration,_that.client,_that.location,_that.tags,_that.metaTitle,_that.metaDescription,_that.metaKeywords,_that.ogImage,_that.categoryId,_that.sortOrder,_that.isFeatured,_that.isPinned,_that.isActive,_that.viewCount,_that.likeCount,_that.publishedAt,_that.createdAt,_that.updatedAt,_that.category,_that.images);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ProjectDetail implements ProjectDetail {
  const _ProjectDetail({required this.id, required this.title, required this.slug, required this.description, this.excerpt, this.thumbnailUrl, this.videoUrl, required this.date, this.duration, this.client, this.location, final  List<String> tags = const [], this.metaTitle, this.metaDescription, final  List<String> metaKeywords = const [], this.ogImage, required this.categoryId, this.sortOrder = 0, this.isFeatured = false, this.isPinned = false, this.isActive = true, this.viewCount = 0, this.likeCount = 0, this.publishedAt, required this.createdAt, required this.updatedAt, required this.category, final  List<ProjectImage> images = const []}): _tags = tags,_metaKeywords = metaKeywords,_images = images;
  factory _ProjectDetail.fromJson(Map<String, dynamic> json) => _$ProjectDetailFromJson(json);

@override final  String id;
@override final  String title;
@override final  String slug;
@override final  String description;
@override final  String? excerpt;
@override final  String? thumbnailUrl;
@override final  String? videoUrl;
@override final  String date;
@override final  String? duration;
@override final  String? client;
@override final  String? location;
 final  List<String> _tags;
@override@JsonKey() List<String> get tags {
  if (_tags is EqualUnmodifiableListView) return _tags;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_tags);
}

@override final  String? metaTitle;
@override final  String? metaDescription;
 final  List<String> _metaKeywords;
@override@JsonKey() List<String> get metaKeywords {
  if (_metaKeywords is EqualUnmodifiableListView) return _metaKeywords;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_metaKeywords);
}

@override final  String? ogImage;
@override final  String categoryId;
@override@JsonKey() final  int sortOrder;
@override@JsonKey() final  bool isFeatured;
@override@JsonKey() final  bool isPinned;
@override@JsonKey() final  bool isActive;
@override@JsonKey() final  int viewCount;
@override@JsonKey() final  int likeCount;
@override final  String? publishedAt;
@override final  String createdAt;
@override final  String updatedAt;
@override final  ProjectCategory category;
 final  List<ProjectImage> _images;
@override@JsonKey() List<ProjectImage> get images {
  if (_images is EqualUnmodifiableListView) return _images;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_images);
}


/// Create a copy of ProjectDetail
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ProjectDetailCopyWith<_ProjectDetail> get copyWith => __$ProjectDetailCopyWithImpl<_ProjectDetail>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ProjectDetailToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ProjectDetail&&(identical(other.id, id) || other.id == id)&&(identical(other.title, title) || other.title == title)&&(identical(other.slug, slug) || other.slug == slug)&&(identical(other.description, description) || other.description == description)&&(identical(other.excerpt, excerpt) || other.excerpt == excerpt)&&(identical(other.thumbnailUrl, thumbnailUrl) || other.thumbnailUrl == thumbnailUrl)&&(identical(other.videoUrl, videoUrl) || other.videoUrl == videoUrl)&&(identical(other.date, date) || other.date == date)&&(identical(other.duration, duration) || other.duration == duration)&&(identical(other.client, client) || other.client == client)&&(identical(other.location, location) || other.location == location)&&const DeepCollectionEquality().equals(other._tags, _tags)&&(identical(other.metaTitle, metaTitle) || other.metaTitle == metaTitle)&&(identical(other.metaDescription, metaDescription) || other.metaDescription == metaDescription)&&const DeepCollectionEquality().equals(other._metaKeywords, _metaKeywords)&&(identical(other.ogImage, ogImage) || other.ogImage == ogImage)&&(identical(other.categoryId, categoryId) || other.categoryId == categoryId)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder)&&(identical(other.isFeatured, isFeatured) || other.isFeatured == isFeatured)&&(identical(other.isPinned, isPinned) || other.isPinned == isPinned)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.viewCount, viewCount) || other.viewCount == viewCount)&&(identical(other.likeCount, likeCount) || other.likeCount == likeCount)&&(identical(other.publishedAt, publishedAt) || other.publishedAt == publishedAt)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt)&&(identical(other.category, category) || other.category == category)&&const DeepCollectionEquality().equals(other._images, _images));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hashAll([runtimeType,id,title,slug,description,excerpt,thumbnailUrl,videoUrl,date,duration,client,location,const DeepCollectionEquality().hash(_tags),metaTitle,metaDescription,const DeepCollectionEquality().hash(_metaKeywords),ogImage,categoryId,sortOrder,isFeatured,isPinned,isActive,viewCount,likeCount,publishedAt,createdAt,updatedAt,category,const DeepCollectionEquality().hash(_images)]);

@override
String toString() {
  return 'ProjectDetail(id: $id, title: $title, slug: $slug, description: $description, excerpt: $excerpt, thumbnailUrl: $thumbnailUrl, videoUrl: $videoUrl, date: $date, duration: $duration, client: $client, location: $location, tags: $tags, metaTitle: $metaTitle, metaDescription: $metaDescription, metaKeywords: $metaKeywords, ogImage: $ogImage, categoryId: $categoryId, sortOrder: $sortOrder, isFeatured: $isFeatured, isPinned: $isPinned, isActive: $isActive, viewCount: $viewCount, likeCount: $likeCount, publishedAt: $publishedAt, createdAt: $createdAt, updatedAt: $updatedAt, category: $category, images: $images)';
}


}

/// @nodoc
abstract mixin class _$ProjectDetailCopyWith<$Res> implements $ProjectDetailCopyWith<$Res> {
  factory _$ProjectDetailCopyWith(_ProjectDetail value, $Res Function(_ProjectDetail) _then) = __$ProjectDetailCopyWithImpl;
@override @useResult
$Res call({
 String id, String title, String slug, String description, String? excerpt, String? thumbnailUrl, String? videoUrl, String date, String? duration, String? client, String? location, List<String> tags, String? metaTitle, String? metaDescription, List<String> metaKeywords, String? ogImage, String categoryId, int sortOrder, bool isFeatured, bool isPinned, bool isActive, int viewCount, int likeCount, String? publishedAt, String createdAt, String updatedAt, ProjectCategory category, List<ProjectImage> images
});


@override $ProjectCategoryCopyWith<$Res> get category;

}
/// @nodoc
class __$ProjectDetailCopyWithImpl<$Res>
    implements _$ProjectDetailCopyWith<$Res> {
  __$ProjectDetailCopyWithImpl(this._self, this._then);

  final _ProjectDetail _self;
  final $Res Function(_ProjectDetail) _then;

/// Create a copy of ProjectDetail
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? title = null,Object? slug = null,Object? description = null,Object? excerpt = freezed,Object? thumbnailUrl = freezed,Object? videoUrl = freezed,Object? date = null,Object? duration = freezed,Object? client = freezed,Object? location = freezed,Object? tags = null,Object? metaTitle = freezed,Object? metaDescription = freezed,Object? metaKeywords = null,Object? ogImage = freezed,Object? categoryId = null,Object? sortOrder = null,Object? isFeatured = null,Object? isPinned = null,Object? isActive = null,Object? viewCount = null,Object? likeCount = null,Object? publishedAt = freezed,Object? createdAt = null,Object? updatedAt = null,Object? category = null,Object? images = null,}) {
  return _then(_ProjectDetail(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,title: null == title ? _self.title : title // ignore: cast_nullable_to_non_nullable
as String,slug: null == slug ? _self.slug : slug // ignore: cast_nullable_to_non_nullable
as String,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,excerpt: freezed == excerpt ? _self.excerpt : excerpt // ignore: cast_nullable_to_non_nullable
as String?,thumbnailUrl: freezed == thumbnailUrl ? _self.thumbnailUrl : thumbnailUrl // ignore: cast_nullable_to_non_nullable
as String?,videoUrl: freezed == videoUrl ? _self.videoUrl : videoUrl // ignore: cast_nullable_to_non_nullable
as String?,date: null == date ? _self.date : date // ignore: cast_nullable_to_non_nullable
as String,duration: freezed == duration ? _self.duration : duration // ignore: cast_nullable_to_non_nullable
as String?,client: freezed == client ? _self.client : client // ignore: cast_nullable_to_non_nullable
as String?,location: freezed == location ? _self.location : location // ignore: cast_nullable_to_non_nullable
as String?,tags: null == tags ? _self._tags : tags // ignore: cast_nullable_to_non_nullable
as List<String>,metaTitle: freezed == metaTitle ? _self.metaTitle : metaTitle // ignore: cast_nullable_to_non_nullable
as String?,metaDescription: freezed == metaDescription ? _self.metaDescription : metaDescription // ignore: cast_nullable_to_non_nullable
as String?,metaKeywords: null == metaKeywords ? _self._metaKeywords : metaKeywords // ignore: cast_nullable_to_non_nullable
as List<String>,ogImage: freezed == ogImage ? _self.ogImage : ogImage // ignore: cast_nullable_to_non_nullable
as String?,categoryId: null == categoryId ? _self.categoryId : categoryId // ignore: cast_nullable_to_non_nullable
as String,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,isFeatured: null == isFeatured ? _self.isFeatured : isFeatured // ignore: cast_nullable_to_non_nullable
as bool,isPinned: null == isPinned ? _self.isPinned : isPinned // ignore: cast_nullable_to_non_nullable
as bool,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,viewCount: null == viewCount ? _self.viewCount : viewCount // ignore: cast_nullable_to_non_nullable
as int,likeCount: null == likeCount ? _self.likeCount : likeCount // ignore: cast_nullable_to_non_nullable
as int,publishedAt: freezed == publishedAt ? _self.publishedAt : publishedAt // ignore: cast_nullable_to_non_nullable
as String?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as String,category: null == category ? _self.category : category // ignore: cast_nullable_to_non_nullable
as ProjectCategory,images: null == images ? _self._images : images // ignore: cast_nullable_to_non_nullable
as List<ProjectImage>,
  ));
}

/// Create a copy of ProjectDetail
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$ProjectCategoryCopyWith<$Res> get category {
  
  return $ProjectCategoryCopyWith<$Res>(_self.category, (value) {
    return _then(_self.copyWith(category: value));
  });
}
}

// dart format on
