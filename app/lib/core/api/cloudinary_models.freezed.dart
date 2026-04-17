// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'cloudinary_models.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$CloudinarySignResponse {

 String get apiKey; String get cloudName; int get timestamp; String get signature; String get folder;
/// Create a copy of CloudinarySignResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CloudinarySignResponseCopyWith<CloudinarySignResponse> get copyWith => _$CloudinarySignResponseCopyWithImpl<CloudinarySignResponse>(this as CloudinarySignResponse, _$identity);

  /// Serializes this CloudinarySignResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CloudinarySignResponse&&(identical(other.apiKey, apiKey) || other.apiKey == apiKey)&&(identical(other.cloudName, cloudName) || other.cloudName == cloudName)&&(identical(other.timestamp, timestamp) || other.timestamp == timestamp)&&(identical(other.signature, signature) || other.signature == signature)&&(identical(other.folder, folder) || other.folder == folder));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,apiKey,cloudName,timestamp,signature,folder);

@override
String toString() {
  return 'CloudinarySignResponse(apiKey: $apiKey, cloudName: $cloudName, timestamp: $timestamp, signature: $signature, folder: $folder)';
}


}

/// @nodoc
abstract mixin class $CloudinarySignResponseCopyWith<$Res>  {
  factory $CloudinarySignResponseCopyWith(CloudinarySignResponse value, $Res Function(CloudinarySignResponse) _then) = _$CloudinarySignResponseCopyWithImpl;
@useResult
$Res call({
 String apiKey, String cloudName, int timestamp, String signature, String folder
});




}
/// @nodoc
class _$CloudinarySignResponseCopyWithImpl<$Res>
    implements $CloudinarySignResponseCopyWith<$Res> {
  _$CloudinarySignResponseCopyWithImpl(this._self, this._then);

  final CloudinarySignResponse _self;
  final $Res Function(CloudinarySignResponse) _then;

/// Create a copy of CloudinarySignResponse
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? apiKey = null,Object? cloudName = null,Object? timestamp = null,Object? signature = null,Object? folder = null,}) {
  return _then(_self.copyWith(
apiKey: null == apiKey ? _self.apiKey : apiKey // ignore: cast_nullable_to_non_nullable
as String,cloudName: null == cloudName ? _self.cloudName : cloudName // ignore: cast_nullable_to_non_nullable
as String,timestamp: null == timestamp ? _self.timestamp : timestamp // ignore: cast_nullable_to_non_nullable
as int,signature: null == signature ? _self.signature : signature // ignore: cast_nullable_to_non_nullable
as String,folder: null == folder ? _self.folder : folder // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [CloudinarySignResponse].
extension CloudinarySignResponsePatterns on CloudinarySignResponse {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _CloudinarySignResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _CloudinarySignResponse() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _CloudinarySignResponse value)  $default,){
final _that = this;
switch (_that) {
case _CloudinarySignResponse():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _CloudinarySignResponse value)?  $default,){
final _that = this;
switch (_that) {
case _CloudinarySignResponse() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String apiKey,  String cloudName,  int timestamp,  String signature,  String folder)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CloudinarySignResponse() when $default != null:
return $default(_that.apiKey,_that.cloudName,_that.timestamp,_that.signature,_that.folder);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String apiKey,  String cloudName,  int timestamp,  String signature,  String folder)  $default,) {final _that = this;
switch (_that) {
case _CloudinarySignResponse():
return $default(_that.apiKey,_that.cloudName,_that.timestamp,_that.signature,_that.folder);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String apiKey,  String cloudName,  int timestamp,  String signature,  String folder)?  $default,) {final _that = this;
switch (_that) {
case _CloudinarySignResponse() when $default != null:
return $default(_that.apiKey,_that.cloudName,_that.timestamp,_that.signature,_that.folder);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _CloudinarySignResponse implements CloudinarySignResponse {
  const _CloudinarySignResponse({required this.apiKey, required this.cloudName, required this.timestamp, required this.signature, required this.folder});
  factory _CloudinarySignResponse.fromJson(Map<String, dynamic> json) => _$CloudinarySignResponseFromJson(json);

@override final  String apiKey;
@override final  String cloudName;
@override final  int timestamp;
@override final  String signature;
@override final  String folder;

/// Create a copy of CloudinarySignResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CloudinarySignResponseCopyWith<_CloudinarySignResponse> get copyWith => __$CloudinarySignResponseCopyWithImpl<_CloudinarySignResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$CloudinarySignResponseToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _CloudinarySignResponse&&(identical(other.apiKey, apiKey) || other.apiKey == apiKey)&&(identical(other.cloudName, cloudName) || other.cloudName == cloudName)&&(identical(other.timestamp, timestamp) || other.timestamp == timestamp)&&(identical(other.signature, signature) || other.signature == signature)&&(identical(other.folder, folder) || other.folder == folder));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,apiKey,cloudName,timestamp,signature,folder);

@override
String toString() {
  return 'CloudinarySignResponse(apiKey: $apiKey, cloudName: $cloudName, timestamp: $timestamp, signature: $signature, folder: $folder)';
}


}

/// @nodoc
abstract mixin class _$CloudinarySignResponseCopyWith<$Res> implements $CloudinarySignResponseCopyWith<$Res> {
  factory _$CloudinarySignResponseCopyWith(_CloudinarySignResponse value, $Res Function(_CloudinarySignResponse) _then) = __$CloudinarySignResponseCopyWithImpl;
@override @useResult
$Res call({
 String apiKey, String cloudName, int timestamp, String signature, String folder
});




}
/// @nodoc
class __$CloudinarySignResponseCopyWithImpl<$Res>
    implements _$CloudinarySignResponseCopyWith<$Res> {
  __$CloudinarySignResponseCopyWithImpl(this._self, this._then);

  final _CloudinarySignResponse _self;
  final $Res Function(_CloudinarySignResponse) _then;

/// Create a copy of CloudinarySignResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? apiKey = null,Object? cloudName = null,Object? timestamp = null,Object? signature = null,Object? folder = null,}) {
  return _then(_CloudinarySignResponse(
apiKey: null == apiKey ? _self.apiKey : apiKey // ignore: cast_nullable_to_non_nullable
as String,cloudName: null == cloudName ? _self.cloudName : cloudName // ignore: cast_nullable_to_non_nullable
as String,timestamp: null == timestamp ? _self.timestamp : timestamp // ignore: cast_nullable_to_non_nullable
as int,signature: null == signature ? _self.signature : signature // ignore: cast_nullable_to_non_nullable
as String,folder: null == folder ? _self.folder : folder // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}


/// @nodoc
mixin _$CloudinaryUploadResponse {

@JsonKey(name: 'secure_url') String get secureUrl;@JsonKey(name: 'public_id') String get publicId; int? get width; int? get height;
/// Create a copy of CloudinaryUploadResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CloudinaryUploadResponseCopyWith<CloudinaryUploadResponse> get copyWith => _$CloudinaryUploadResponseCopyWithImpl<CloudinaryUploadResponse>(this as CloudinaryUploadResponse, _$identity);

  /// Serializes this CloudinaryUploadResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CloudinaryUploadResponse&&(identical(other.secureUrl, secureUrl) || other.secureUrl == secureUrl)&&(identical(other.publicId, publicId) || other.publicId == publicId)&&(identical(other.width, width) || other.width == width)&&(identical(other.height, height) || other.height == height));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,secureUrl,publicId,width,height);

@override
String toString() {
  return 'CloudinaryUploadResponse(secureUrl: $secureUrl, publicId: $publicId, width: $width, height: $height)';
}


}

/// @nodoc
abstract mixin class $CloudinaryUploadResponseCopyWith<$Res>  {
  factory $CloudinaryUploadResponseCopyWith(CloudinaryUploadResponse value, $Res Function(CloudinaryUploadResponse) _then) = _$CloudinaryUploadResponseCopyWithImpl;
@useResult
$Res call({
@JsonKey(name: 'secure_url') String secureUrl,@JsonKey(name: 'public_id') String publicId, int? width, int? height
});




}
/// @nodoc
class _$CloudinaryUploadResponseCopyWithImpl<$Res>
    implements $CloudinaryUploadResponseCopyWith<$Res> {
  _$CloudinaryUploadResponseCopyWithImpl(this._self, this._then);

  final CloudinaryUploadResponse _self;
  final $Res Function(CloudinaryUploadResponse) _then;

/// Create a copy of CloudinaryUploadResponse
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? secureUrl = null,Object? publicId = null,Object? width = freezed,Object? height = freezed,}) {
  return _then(_self.copyWith(
secureUrl: null == secureUrl ? _self.secureUrl : secureUrl // ignore: cast_nullable_to_non_nullable
as String,publicId: null == publicId ? _self.publicId : publicId // ignore: cast_nullable_to_non_nullable
as String,width: freezed == width ? _self.width : width // ignore: cast_nullable_to_non_nullable
as int?,height: freezed == height ? _self.height : height // ignore: cast_nullable_to_non_nullable
as int?,
  ));
}

}


/// Adds pattern-matching-related methods to [CloudinaryUploadResponse].
extension CloudinaryUploadResponsePatterns on CloudinaryUploadResponse {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _CloudinaryUploadResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _CloudinaryUploadResponse() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _CloudinaryUploadResponse value)  $default,){
final _that = this;
switch (_that) {
case _CloudinaryUploadResponse():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _CloudinaryUploadResponse value)?  $default,){
final _that = this;
switch (_that) {
case _CloudinaryUploadResponse() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@JsonKey(name: 'secure_url')  String secureUrl, @JsonKey(name: 'public_id')  String publicId,  int? width,  int? height)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CloudinaryUploadResponse() when $default != null:
return $default(_that.secureUrl,_that.publicId,_that.width,_that.height);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@JsonKey(name: 'secure_url')  String secureUrl, @JsonKey(name: 'public_id')  String publicId,  int? width,  int? height)  $default,) {final _that = this;
switch (_that) {
case _CloudinaryUploadResponse():
return $default(_that.secureUrl,_that.publicId,_that.width,_that.height);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@JsonKey(name: 'secure_url')  String secureUrl, @JsonKey(name: 'public_id')  String publicId,  int? width,  int? height)?  $default,) {final _that = this;
switch (_that) {
case _CloudinaryUploadResponse() when $default != null:
return $default(_that.secureUrl,_that.publicId,_that.width,_that.height);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _CloudinaryUploadResponse implements CloudinaryUploadResponse {
  const _CloudinaryUploadResponse({@JsonKey(name: 'secure_url') required this.secureUrl, @JsonKey(name: 'public_id') required this.publicId, this.width, this.height});
  factory _CloudinaryUploadResponse.fromJson(Map<String, dynamic> json) => _$CloudinaryUploadResponseFromJson(json);

@override@JsonKey(name: 'secure_url') final  String secureUrl;
@override@JsonKey(name: 'public_id') final  String publicId;
@override final  int? width;
@override final  int? height;

/// Create a copy of CloudinaryUploadResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CloudinaryUploadResponseCopyWith<_CloudinaryUploadResponse> get copyWith => __$CloudinaryUploadResponseCopyWithImpl<_CloudinaryUploadResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$CloudinaryUploadResponseToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _CloudinaryUploadResponse&&(identical(other.secureUrl, secureUrl) || other.secureUrl == secureUrl)&&(identical(other.publicId, publicId) || other.publicId == publicId)&&(identical(other.width, width) || other.width == width)&&(identical(other.height, height) || other.height == height));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,secureUrl,publicId,width,height);

@override
String toString() {
  return 'CloudinaryUploadResponse(secureUrl: $secureUrl, publicId: $publicId, width: $width, height: $height)';
}


}

/// @nodoc
abstract mixin class _$CloudinaryUploadResponseCopyWith<$Res> implements $CloudinaryUploadResponseCopyWith<$Res> {
  factory _$CloudinaryUploadResponseCopyWith(_CloudinaryUploadResponse value, $Res Function(_CloudinaryUploadResponse) _then) = __$CloudinaryUploadResponseCopyWithImpl;
@override @useResult
$Res call({
@JsonKey(name: 'secure_url') String secureUrl,@JsonKey(name: 'public_id') String publicId, int? width, int? height
});




}
/// @nodoc
class __$CloudinaryUploadResponseCopyWithImpl<$Res>
    implements _$CloudinaryUploadResponseCopyWith<$Res> {
  __$CloudinaryUploadResponseCopyWithImpl(this._self, this._then);

  final _CloudinaryUploadResponse _self;
  final $Res Function(_CloudinaryUploadResponse) _then;

/// Create a copy of CloudinaryUploadResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? secureUrl = null,Object? publicId = null,Object? width = freezed,Object? height = freezed,}) {
  return _then(_CloudinaryUploadResponse(
secureUrl: null == secureUrl ? _self.secureUrl : secureUrl // ignore: cast_nullable_to_non_nullable
as String,publicId: null == publicId ? _self.publicId : publicId // ignore: cast_nullable_to_non_nullable
as String,width: freezed == width ? _self.width : width // ignore: cast_nullable_to_non_nullable
as int?,height: freezed == height ? _self.height : height // ignore: cast_nullable_to_non_nullable
as int?,
  ));
}


}

// dart format on
