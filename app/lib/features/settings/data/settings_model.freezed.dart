// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'settings_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AboutSettings {

 String? get id; String? get bioTitle; String? get bioIntro; String? get bioDescription; String? get profileImageUrl; String? get profileImageAlt; String? get profileImageShape; String? get illustrationUrl; String? get illustrationAlt; List<String> get skills; List<String> get certifications; int? get yearsExperience; bool get isActive;
/// Create a copy of AboutSettings
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AboutSettingsCopyWith<AboutSettings> get copyWith => _$AboutSettingsCopyWithImpl<AboutSettings>(this as AboutSettings, _$identity);

  /// Serializes this AboutSettings to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AboutSettings&&(identical(other.id, id) || other.id == id)&&(identical(other.bioTitle, bioTitle) || other.bioTitle == bioTitle)&&(identical(other.bioIntro, bioIntro) || other.bioIntro == bioIntro)&&(identical(other.bioDescription, bioDescription) || other.bioDescription == bioDescription)&&(identical(other.profileImageUrl, profileImageUrl) || other.profileImageUrl == profileImageUrl)&&(identical(other.profileImageAlt, profileImageAlt) || other.profileImageAlt == profileImageAlt)&&(identical(other.profileImageShape, profileImageShape) || other.profileImageShape == profileImageShape)&&(identical(other.illustrationUrl, illustrationUrl) || other.illustrationUrl == illustrationUrl)&&(identical(other.illustrationAlt, illustrationAlt) || other.illustrationAlt == illustrationAlt)&&const DeepCollectionEquality().equals(other.skills, skills)&&const DeepCollectionEquality().equals(other.certifications, certifications)&&(identical(other.yearsExperience, yearsExperience) || other.yearsExperience == yearsExperience)&&(identical(other.isActive, isActive) || other.isActive == isActive));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,bioTitle,bioIntro,bioDescription,profileImageUrl,profileImageAlt,profileImageShape,illustrationUrl,illustrationAlt,const DeepCollectionEquality().hash(skills),const DeepCollectionEquality().hash(certifications),yearsExperience,isActive);

@override
String toString() {
  return 'AboutSettings(id: $id, bioTitle: $bioTitle, bioIntro: $bioIntro, bioDescription: $bioDescription, profileImageUrl: $profileImageUrl, profileImageAlt: $profileImageAlt, profileImageShape: $profileImageShape, illustrationUrl: $illustrationUrl, illustrationAlt: $illustrationAlt, skills: $skills, certifications: $certifications, yearsExperience: $yearsExperience, isActive: $isActive)';
}


}

/// @nodoc
abstract mixin class $AboutSettingsCopyWith<$Res>  {
  factory $AboutSettingsCopyWith(AboutSettings value, $Res Function(AboutSettings) _then) = _$AboutSettingsCopyWithImpl;
@useResult
$Res call({
 String? id, String? bioTitle, String? bioIntro, String? bioDescription, String? profileImageUrl, String? profileImageAlt, String? profileImageShape, String? illustrationUrl, String? illustrationAlt, List<String> skills, List<String> certifications, int? yearsExperience, bool isActive
});




}
/// @nodoc
class _$AboutSettingsCopyWithImpl<$Res>
    implements $AboutSettingsCopyWith<$Res> {
  _$AboutSettingsCopyWithImpl(this._self, this._then);

  final AboutSettings _self;
  final $Res Function(AboutSettings) _then;

/// Create a copy of AboutSettings
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = freezed,Object? bioTitle = freezed,Object? bioIntro = freezed,Object? bioDescription = freezed,Object? profileImageUrl = freezed,Object? profileImageAlt = freezed,Object? profileImageShape = freezed,Object? illustrationUrl = freezed,Object? illustrationAlt = freezed,Object? skills = null,Object? certifications = null,Object? yearsExperience = freezed,Object? isActive = null,}) {
  return _then(_self.copyWith(
id: freezed == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String?,bioTitle: freezed == bioTitle ? _self.bioTitle : bioTitle // ignore: cast_nullable_to_non_nullable
as String?,bioIntro: freezed == bioIntro ? _self.bioIntro : bioIntro // ignore: cast_nullable_to_non_nullable
as String?,bioDescription: freezed == bioDescription ? _self.bioDescription : bioDescription // ignore: cast_nullable_to_non_nullable
as String?,profileImageUrl: freezed == profileImageUrl ? _self.profileImageUrl : profileImageUrl // ignore: cast_nullable_to_non_nullable
as String?,profileImageAlt: freezed == profileImageAlt ? _self.profileImageAlt : profileImageAlt // ignore: cast_nullable_to_non_nullable
as String?,profileImageShape: freezed == profileImageShape ? _self.profileImageShape : profileImageShape // ignore: cast_nullable_to_non_nullable
as String?,illustrationUrl: freezed == illustrationUrl ? _self.illustrationUrl : illustrationUrl // ignore: cast_nullable_to_non_nullable
as String?,illustrationAlt: freezed == illustrationAlt ? _self.illustrationAlt : illustrationAlt // ignore: cast_nullable_to_non_nullable
as String?,skills: null == skills ? _self.skills : skills // ignore: cast_nullable_to_non_nullable
as List<String>,certifications: null == certifications ? _self.certifications : certifications // ignore: cast_nullable_to_non_nullable
as List<String>,yearsExperience: freezed == yearsExperience ? _self.yearsExperience : yearsExperience // ignore: cast_nullable_to_non_nullable
as int?,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}

}


/// Adds pattern-matching-related methods to [AboutSettings].
extension AboutSettingsPatterns on AboutSettings {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AboutSettings value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AboutSettings() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AboutSettings value)  $default,){
final _that = this;
switch (_that) {
case _AboutSettings():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AboutSettings value)?  $default,){
final _that = this;
switch (_that) {
case _AboutSettings() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String? id,  String? bioTitle,  String? bioIntro,  String? bioDescription,  String? profileImageUrl,  String? profileImageAlt,  String? profileImageShape,  String? illustrationUrl,  String? illustrationAlt,  List<String> skills,  List<String> certifications,  int? yearsExperience,  bool isActive)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AboutSettings() when $default != null:
return $default(_that.id,_that.bioTitle,_that.bioIntro,_that.bioDescription,_that.profileImageUrl,_that.profileImageAlt,_that.profileImageShape,_that.illustrationUrl,_that.illustrationAlt,_that.skills,_that.certifications,_that.yearsExperience,_that.isActive);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String? id,  String? bioTitle,  String? bioIntro,  String? bioDescription,  String? profileImageUrl,  String? profileImageAlt,  String? profileImageShape,  String? illustrationUrl,  String? illustrationAlt,  List<String> skills,  List<String> certifications,  int? yearsExperience,  bool isActive)  $default,) {final _that = this;
switch (_that) {
case _AboutSettings():
return $default(_that.id,_that.bioTitle,_that.bioIntro,_that.bioDescription,_that.profileImageUrl,_that.profileImageAlt,_that.profileImageShape,_that.illustrationUrl,_that.illustrationAlt,_that.skills,_that.certifications,_that.yearsExperience,_that.isActive);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String? id,  String? bioTitle,  String? bioIntro,  String? bioDescription,  String? profileImageUrl,  String? profileImageAlt,  String? profileImageShape,  String? illustrationUrl,  String? illustrationAlt,  List<String> skills,  List<String> certifications,  int? yearsExperience,  bool isActive)?  $default,) {final _that = this;
switch (_that) {
case _AboutSettings() when $default != null:
return $default(_that.id,_that.bioTitle,_that.bioIntro,_that.bioDescription,_that.profileImageUrl,_that.profileImageAlt,_that.profileImageShape,_that.illustrationUrl,_that.illustrationAlt,_that.skills,_that.certifications,_that.yearsExperience,_that.isActive);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AboutSettings implements AboutSettings {
  const _AboutSettings({this.id, this.bioTitle, this.bioIntro, this.bioDescription, this.profileImageUrl, this.profileImageAlt, this.profileImageShape, this.illustrationUrl, this.illustrationAlt, final  List<String> skills = const [], final  List<String> certifications = const [], this.yearsExperience, this.isActive = true}): _skills = skills,_certifications = certifications;
  factory _AboutSettings.fromJson(Map<String, dynamic> json) => _$AboutSettingsFromJson(json);

@override final  String? id;
@override final  String? bioTitle;
@override final  String? bioIntro;
@override final  String? bioDescription;
@override final  String? profileImageUrl;
@override final  String? profileImageAlt;
@override final  String? profileImageShape;
@override final  String? illustrationUrl;
@override final  String? illustrationAlt;
 final  List<String> _skills;
@override@JsonKey() List<String> get skills {
  if (_skills is EqualUnmodifiableListView) return _skills;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_skills);
}

 final  List<String> _certifications;
@override@JsonKey() List<String> get certifications {
  if (_certifications is EqualUnmodifiableListView) return _certifications;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_certifications);
}

@override final  int? yearsExperience;
@override@JsonKey() final  bool isActive;

/// Create a copy of AboutSettings
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AboutSettingsCopyWith<_AboutSettings> get copyWith => __$AboutSettingsCopyWithImpl<_AboutSettings>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AboutSettingsToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _AboutSettings&&(identical(other.id, id) || other.id == id)&&(identical(other.bioTitle, bioTitle) || other.bioTitle == bioTitle)&&(identical(other.bioIntro, bioIntro) || other.bioIntro == bioIntro)&&(identical(other.bioDescription, bioDescription) || other.bioDescription == bioDescription)&&(identical(other.profileImageUrl, profileImageUrl) || other.profileImageUrl == profileImageUrl)&&(identical(other.profileImageAlt, profileImageAlt) || other.profileImageAlt == profileImageAlt)&&(identical(other.profileImageShape, profileImageShape) || other.profileImageShape == profileImageShape)&&(identical(other.illustrationUrl, illustrationUrl) || other.illustrationUrl == illustrationUrl)&&(identical(other.illustrationAlt, illustrationAlt) || other.illustrationAlt == illustrationAlt)&&const DeepCollectionEquality().equals(other._skills, _skills)&&const DeepCollectionEquality().equals(other._certifications, _certifications)&&(identical(other.yearsExperience, yearsExperience) || other.yearsExperience == yearsExperience)&&(identical(other.isActive, isActive) || other.isActive == isActive));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,bioTitle,bioIntro,bioDescription,profileImageUrl,profileImageAlt,profileImageShape,illustrationUrl,illustrationAlt,const DeepCollectionEquality().hash(_skills),const DeepCollectionEquality().hash(_certifications),yearsExperience,isActive);

@override
String toString() {
  return 'AboutSettings(id: $id, bioTitle: $bioTitle, bioIntro: $bioIntro, bioDescription: $bioDescription, profileImageUrl: $profileImageUrl, profileImageAlt: $profileImageAlt, profileImageShape: $profileImageShape, illustrationUrl: $illustrationUrl, illustrationAlt: $illustrationAlt, skills: $skills, certifications: $certifications, yearsExperience: $yearsExperience, isActive: $isActive)';
}


}

/// @nodoc
abstract mixin class _$AboutSettingsCopyWith<$Res> implements $AboutSettingsCopyWith<$Res> {
  factory _$AboutSettingsCopyWith(_AboutSettings value, $Res Function(_AboutSettings) _then) = __$AboutSettingsCopyWithImpl;
@override @useResult
$Res call({
 String? id, String? bioTitle, String? bioIntro, String? bioDescription, String? profileImageUrl, String? profileImageAlt, String? profileImageShape, String? illustrationUrl, String? illustrationAlt, List<String> skills, List<String> certifications, int? yearsExperience, bool isActive
});




}
/// @nodoc
class __$AboutSettingsCopyWithImpl<$Res>
    implements _$AboutSettingsCopyWith<$Res> {
  __$AboutSettingsCopyWithImpl(this._self, this._then);

  final _AboutSettings _self;
  final $Res Function(_AboutSettings) _then;

/// Create a copy of AboutSettings
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = freezed,Object? bioTitle = freezed,Object? bioIntro = freezed,Object? bioDescription = freezed,Object? profileImageUrl = freezed,Object? profileImageAlt = freezed,Object? profileImageShape = freezed,Object? illustrationUrl = freezed,Object? illustrationAlt = freezed,Object? skills = null,Object? certifications = null,Object? yearsExperience = freezed,Object? isActive = null,}) {
  return _then(_AboutSettings(
id: freezed == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String?,bioTitle: freezed == bioTitle ? _self.bioTitle : bioTitle // ignore: cast_nullable_to_non_nullable
as String?,bioIntro: freezed == bioIntro ? _self.bioIntro : bioIntro // ignore: cast_nullable_to_non_nullable
as String?,bioDescription: freezed == bioDescription ? _self.bioDescription : bioDescription // ignore: cast_nullable_to_non_nullable
as String?,profileImageUrl: freezed == profileImageUrl ? _self.profileImageUrl : profileImageUrl // ignore: cast_nullable_to_non_nullable
as String?,profileImageAlt: freezed == profileImageAlt ? _self.profileImageAlt : profileImageAlt // ignore: cast_nullable_to_non_nullable
as String?,profileImageShape: freezed == profileImageShape ? _self.profileImageShape : profileImageShape // ignore: cast_nullable_to_non_nullable
as String?,illustrationUrl: freezed == illustrationUrl ? _self.illustrationUrl : illustrationUrl // ignore: cast_nullable_to_non_nullable
as String?,illustrationAlt: freezed == illustrationAlt ? _self.illustrationAlt : illustrationAlt // ignore: cast_nullable_to_non_nullable
as String?,skills: null == skills ? _self._skills : skills // ignore: cast_nullable_to_non_nullable
as List<String>,certifications: null == certifications ? _self._certifications : certifications // ignore: cast_nullable_to_non_nullable
as List<String>,yearsExperience: freezed == yearsExperience ? _self.yearsExperience : yearsExperience // ignore: cast_nullable_to_non_nullable
as int?,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}


}


/// @nodoc
mixin _$ContactSettings {

 String? get id; String? get pageTitle; String? get ownerName; String? get email; String? get phone; String? get whatsapp; String? get location; String? get formTitle; String? get successTitle; String? get successMessage; bool get showSocialLinks; bool get isActive;
/// Create a copy of ContactSettings
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ContactSettingsCopyWith<ContactSettings> get copyWith => _$ContactSettingsCopyWithImpl<ContactSettings>(this as ContactSettings, _$identity);

  /// Serializes this ContactSettings to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ContactSettings&&(identical(other.id, id) || other.id == id)&&(identical(other.pageTitle, pageTitle) || other.pageTitle == pageTitle)&&(identical(other.ownerName, ownerName) || other.ownerName == ownerName)&&(identical(other.email, email) || other.email == email)&&(identical(other.phone, phone) || other.phone == phone)&&(identical(other.whatsapp, whatsapp) || other.whatsapp == whatsapp)&&(identical(other.location, location) || other.location == location)&&(identical(other.formTitle, formTitle) || other.formTitle == formTitle)&&(identical(other.successTitle, successTitle) || other.successTitle == successTitle)&&(identical(other.successMessage, successMessage) || other.successMessage == successMessage)&&(identical(other.showSocialLinks, showSocialLinks) || other.showSocialLinks == showSocialLinks)&&(identical(other.isActive, isActive) || other.isActive == isActive));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,pageTitle,ownerName,email,phone,whatsapp,location,formTitle,successTitle,successMessage,showSocialLinks,isActive);

@override
String toString() {
  return 'ContactSettings(id: $id, pageTitle: $pageTitle, ownerName: $ownerName, email: $email, phone: $phone, whatsapp: $whatsapp, location: $location, formTitle: $formTitle, successTitle: $successTitle, successMessage: $successMessage, showSocialLinks: $showSocialLinks, isActive: $isActive)';
}


}

/// @nodoc
abstract mixin class $ContactSettingsCopyWith<$Res>  {
  factory $ContactSettingsCopyWith(ContactSettings value, $Res Function(ContactSettings) _then) = _$ContactSettingsCopyWithImpl;
@useResult
$Res call({
 String? id, String? pageTitle, String? ownerName, String? email, String? phone, String? whatsapp, String? location, String? formTitle, String? successTitle, String? successMessage, bool showSocialLinks, bool isActive
});




}
/// @nodoc
class _$ContactSettingsCopyWithImpl<$Res>
    implements $ContactSettingsCopyWith<$Res> {
  _$ContactSettingsCopyWithImpl(this._self, this._then);

  final ContactSettings _self;
  final $Res Function(ContactSettings) _then;

/// Create a copy of ContactSettings
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = freezed,Object? pageTitle = freezed,Object? ownerName = freezed,Object? email = freezed,Object? phone = freezed,Object? whatsapp = freezed,Object? location = freezed,Object? formTitle = freezed,Object? successTitle = freezed,Object? successMessage = freezed,Object? showSocialLinks = null,Object? isActive = null,}) {
  return _then(_self.copyWith(
id: freezed == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String?,pageTitle: freezed == pageTitle ? _self.pageTitle : pageTitle // ignore: cast_nullable_to_non_nullable
as String?,ownerName: freezed == ownerName ? _self.ownerName : ownerName // ignore: cast_nullable_to_non_nullable
as String?,email: freezed == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String?,phone: freezed == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String?,whatsapp: freezed == whatsapp ? _self.whatsapp : whatsapp // ignore: cast_nullable_to_non_nullable
as String?,location: freezed == location ? _self.location : location // ignore: cast_nullable_to_non_nullable
as String?,formTitle: freezed == formTitle ? _self.formTitle : formTitle // ignore: cast_nullable_to_non_nullable
as String?,successTitle: freezed == successTitle ? _self.successTitle : successTitle // ignore: cast_nullable_to_non_nullable
as String?,successMessage: freezed == successMessage ? _self.successMessage : successMessage // ignore: cast_nullable_to_non_nullable
as String?,showSocialLinks: null == showSocialLinks ? _self.showSocialLinks : showSocialLinks // ignore: cast_nullable_to_non_nullable
as bool,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}

}


/// Adds pattern-matching-related methods to [ContactSettings].
extension ContactSettingsPatterns on ContactSettings {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ContactSettings value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ContactSettings() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ContactSettings value)  $default,){
final _that = this;
switch (_that) {
case _ContactSettings():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ContactSettings value)?  $default,){
final _that = this;
switch (_that) {
case _ContactSettings() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String? id,  String? pageTitle,  String? ownerName,  String? email,  String? phone,  String? whatsapp,  String? location,  String? formTitle,  String? successTitle,  String? successMessage,  bool showSocialLinks,  bool isActive)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ContactSettings() when $default != null:
return $default(_that.id,_that.pageTitle,_that.ownerName,_that.email,_that.phone,_that.whatsapp,_that.location,_that.formTitle,_that.successTitle,_that.successMessage,_that.showSocialLinks,_that.isActive);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String? id,  String? pageTitle,  String? ownerName,  String? email,  String? phone,  String? whatsapp,  String? location,  String? formTitle,  String? successTitle,  String? successMessage,  bool showSocialLinks,  bool isActive)  $default,) {final _that = this;
switch (_that) {
case _ContactSettings():
return $default(_that.id,_that.pageTitle,_that.ownerName,_that.email,_that.phone,_that.whatsapp,_that.location,_that.formTitle,_that.successTitle,_that.successMessage,_that.showSocialLinks,_that.isActive);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String? id,  String? pageTitle,  String? ownerName,  String? email,  String? phone,  String? whatsapp,  String? location,  String? formTitle,  String? successTitle,  String? successMessage,  bool showSocialLinks,  bool isActive)?  $default,) {final _that = this;
switch (_that) {
case _ContactSettings() when $default != null:
return $default(_that.id,_that.pageTitle,_that.ownerName,_that.email,_that.phone,_that.whatsapp,_that.location,_that.formTitle,_that.successTitle,_that.successMessage,_that.showSocialLinks,_that.isActive);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ContactSettings implements ContactSettings {
  const _ContactSettings({this.id, this.pageTitle, this.ownerName, this.email, this.phone, this.whatsapp, this.location, this.formTitle, this.successTitle, this.successMessage, this.showSocialLinks = true, this.isActive = true});
  factory _ContactSettings.fromJson(Map<String, dynamic> json) => _$ContactSettingsFromJson(json);

@override final  String? id;
@override final  String? pageTitle;
@override final  String? ownerName;
@override final  String? email;
@override final  String? phone;
@override final  String? whatsapp;
@override final  String? location;
@override final  String? formTitle;
@override final  String? successTitle;
@override final  String? successMessage;
@override@JsonKey() final  bool showSocialLinks;
@override@JsonKey() final  bool isActive;

/// Create a copy of ContactSettings
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ContactSettingsCopyWith<_ContactSettings> get copyWith => __$ContactSettingsCopyWithImpl<_ContactSettings>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ContactSettingsToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ContactSettings&&(identical(other.id, id) || other.id == id)&&(identical(other.pageTitle, pageTitle) || other.pageTitle == pageTitle)&&(identical(other.ownerName, ownerName) || other.ownerName == ownerName)&&(identical(other.email, email) || other.email == email)&&(identical(other.phone, phone) || other.phone == phone)&&(identical(other.whatsapp, whatsapp) || other.whatsapp == whatsapp)&&(identical(other.location, location) || other.location == location)&&(identical(other.formTitle, formTitle) || other.formTitle == formTitle)&&(identical(other.successTitle, successTitle) || other.successTitle == successTitle)&&(identical(other.successMessage, successMessage) || other.successMessage == successMessage)&&(identical(other.showSocialLinks, showSocialLinks) || other.showSocialLinks == showSocialLinks)&&(identical(other.isActive, isActive) || other.isActive == isActive));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,pageTitle,ownerName,email,phone,whatsapp,location,formTitle,successTitle,successMessage,showSocialLinks,isActive);

@override
String toString() {
  return 'ContactSettings(id: $id, pageTitle: $pageTitle, ownerName: $ownerName, email: $email, phone: $phone, whatsapp: $whatsapp, location: $location, formTitle: $formTitle, successTitle: $successTitle, successMessage: $successMessage, showSocialLinks: $showSocialLinks, isActive: $isActive)';
}


}

/// @nodoc
abstract mixin class _$ContactSettingsCopyWith<$Res> implements $ContactSettingsCopyWith<$Res> {
  factory _$ContactSettingsCopyWith(_ContactSettings value, $Res Function(_ContactSettings) _then) = __$ContactSettingsCopyWithImpl;
@override @useResult
$Res call({
 String? id, String? pageTitle, String? ownerName, String? email, String? phone, String? whatsapp, String? location, String? formTitle, String? successTitle, String? successMessage, bool showSocialLinks, bool isActive
});




}
/// @nodoc
class __$ContactSettingsCopyWithImpl<$Res>
    implements _$ContactSettingsCopyWith<$Res> {
  __$ContactSettingsCopyWithImpl(this._self, this._then);

  final _ContactSettings _self;
  final $Res Function(_ContactSettings) _then;

/// Create a copy of ContactSettings
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = freezed,Object? pageTitle = freezed,Object? ownerName = freezed,Object? email = freezed,Object? phone = freezed,Object? whatsapp = freezed,Object? location = freezed,Object? formTitle = freezed,Object? successTitle = freezed,Object? successMessage = freezed,Object? showSocialLinks = null,Object? isActive = null,}) {
  return _then(_ContactSettings(
id: freezed == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String?,pageTitle: freezed == pageTitle ? _self.pageTitle : pageTitle // ignore: cast_nullable_to_non_nullable
as String?,ownerName: freezed == ownerName ? _self.ownerName : ownerName // ignore: cast_nullable_to_non_nullable
as String?,email: freezed == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String?,phone: freezed == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String?,whatsapp: freezed == whatsapp ? _self.whatsapp : whatsapp // ignore: cast_nullable_to_non_nullable
as String?,location: freezed == location ? _self.location : location // ignore: cast_nullable_to_non_nullable
as String?,formTitle: freezed == formTitle ? _self.formTitle : formTitle // ignore: cast_nullable_to_non_nullable
as String?,successTitle: freezed == successTitle ? _self.successTitle : successTitle // ignore: cast_nullable_to_non_nullable
as String?,successMessage: freezed == successMessage ? _self.successMessage : successMessage // ignore: cast_nullable_to_non_nullable
as String?,showSocialLinks: null == showSocialLinks ? _self.showSocialLinks : showSocialLinks // ignore: cast_nullable_to_non_nullable
as bool,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}


}


/// @nodoc
mixin _$ThemeSettings {

 String? get id; String get primaryColor; String get secondaryColor; String get accentColor; String get backgroundColor; String get textColor; String get darkPrimaryColor; String get darkSecondaryColor; String get darkBackgroundColor; String get darkTextColor; String get headingFont; String get bodyFont; String get scriptFont; int get borderRadius; bool get isActive;
/// Create a copy of ThemeSettings
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ThemeSettingsCopyWith<ThemeSettings> get copyWith => _$ThemeSettingsCopyWithImpl<ThemeSettings>(this as ThemeSettings, _$identity);

  /// Serializes this ThemeSettings to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ThemeSettings&&(identical(other.id, id) || other.id == id)&&(identical(other.primaryColor, primaryColor) || other.primaryColor == primaryColor)&&(identical(other.secondaryColor, secondaryColor) || other.secondaryColor == secondaryColor)&&(identical(other.accentColor, accentColor) || other.accentColor == accentColor)&&(identical(other.backgroundColor, backgroundColor) || other.backgroundColor == backgroundColor)&&(identical(other.textColor, textColor) || other.textColor == textColor)&&(identical(other.darkPrimaryColor, darkPrimaryColor) || other.darkPrimaryColor == darkPrimaryColor)&&(identical(other.darkSecondaryColor, darkSecondaryColor) || other.darkSecondaryColor == darkSecondaryColor)&&(identical(other.darkBackgroundColor, darkBackgroundColor) || other.darkBackgroundColor == darkBackgroundColor)&&(identical(other.darkTextColor, darkTextColor) || other.darkTextColor == darkTextColor)&&(identical(other.headingFont, headingFont) || other.headingFont == headingFont)&&(identical(other.bodyFont, bodyFont) || other.bodyFont == bodyFont)&&(identical(other.scriptFont, scriptFont) || other.scriptFont == scriptFont)&&(identical(other.borderRadius, borderRadius) || other.borderRadius == borderRadius)&&(identical(other.isActive, isActive) || other.isActive == isActive));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,primaryColor,secondaryColor,accentColor,backgroundColor,textColor,darkPrimaryColor,darkSecondaryColor,darkBackgroundColor,darkTextColor,headingFont,bodyFont,scriptFont,borderRadius,isActive);

@override
String toString() {
  return 'ThemeSettings(id: $id, primaryColor: $primaryColor, secondaryColor: $secondaryColor, accentColor: $accentColor, backgroundColor: $backgroundColor, textColor: $textColor, darkPrimaryColor: $darkPrimaryColor, darkSecondaryColor: $darkSecondaryColor, darkBackgroundColor: $darkBackgroundColor, darkTextColor: $darkTextColor, headingFont: $headingFont, bodyFont: $bodyFont, scriptFont: $scriptFont, borderRadius: $borderRadius, isActive: $isActive)';
}


}

/// @nodoc
abstract mixin class $ThemeSettingsCopyWith<$Res>  {
  factory $ThemeSettingsCopyWith(ThemeSettings value, $Res Function(ThemeSettings) _then) = _$ThemeSettingsCopyWithImpl;
@useResult
$Res call({
 String? id, String primaryColor, String secondaryColor, String accentColor, String backgroundColor, String textColor, String darkPrimaryColor, String darkSecondaryColor, String darkBackgroundColor, String darkTextColor, String headingFont, String bodyFont, String scriptFont, int borderRadius, bool isActive
});




}
/// @nodoc
class _$ThemeSettingsCopyWithImpl<$Res>
    implements $ThemeSettingsCopyWith<$Res> {
  _$ThemeSettingsCopyWithImpl(this._self, this._then);

  final ThemeSettings _self;
  final $Res Function(ThemeSettings) _then;

/// Create a copy of ThemeSettings
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = freezed,Object? primaryColor = null,Object? secondaryColor = null,Object? accentColor = null,Object? backgroundColor = null,Object? textColor = null,Object? darkPrimaryColor = null,Object? darkSecondaryColor = null,Object? darkBackgroundColor = null,Object? darkTextColor = null,Object? headingFont = null,Object? bodyFont = null,Object? scriptFont = null,Object? borderRadius = null,Object? isActive = null,}) {
  return _then(_self.copyWith(
id: freezed == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String?,primaryColor: null == primaryColor ? _self.primaryColor : primaryColor // ignore: cast_nullable_to_non_nullable
as String,secondaryColor: null == secondaryColor ? _self.secondaryColor : secondaryColor // ignore: cast_nullable_to_non_nullable
as String,accentColor: null == accentColor ? _self.accentColor : accentColor // ignore: cast_nullable_to_non_nullable
as String,backgroundColor: null == backgroundColor ? _self.backgroundColor : backgroundColor // ignore: cast_nullable_to_non_nullable
as String,textColor: null == textColor ? _self.textColor : textColor // ignore: cast_nullable_to_non_nullable
as String,darkPrimaryColor: null == darkPrimaryColor ? _self.darkPrimaryColor : darkPrimaryColor // ignore: cast_nullable_to_non_nullable
as String,darkSecondaryColor: null == darkSecondaryColor ? _self.darkSecondaryColor : darkSecondaryColor // ignore: cast_nullable_to_non_nullable
as String,darkBackgroundColor: null == darkBackgroundColor ? _self.darkBackgroundColor : darkBackgroundColor // ignore: cast_nullable_to_non_nullable
as String,darkTextColor: null == darkTextColor ? _self.darkTextColor : darkTextColor // ignore: cast_nullable_to_non_nullable
as String,headingFont: null == headingFont ? _self.headingFont : headingFont // ignore: cast_nullable_to_non_nullable
as String,bodyFont: null == bodyFont ? _self.bodyFont : bodyFont // ignore: cast_nullable_to_non_nullable
as String,scriptFont: null == scriptFont ? _self.scriptFont : scriptFont // ignore: cast_nullable_to_non_nullable
as String,borderRadius: null == borderRadius ? _self.borderRadius : borderRadius // ignore: cast_nullable_to_non_nullable
as int,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}

}


/// Adds pattern-matching-related methods to [ThemeSettings].
extension ThemeSettingsPatterns on ThemeSettings {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ThemeSettings value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ThemeSettings() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ThemeSettings value)  $default,){
final _that = this;
switch (_that) {
case _ThemeSettings():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ThemeSettings value)?  $default,){
final _that = this;
switch (_that) {
case _ThemeSettings() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String? id,  String primaryColor,  String secondaryColor,  String accentColor,  String backgroundColor,  String textColor,  String darkPrimaryColor,  String darkSecondaryColor,  String darkBackgroundColor,  String darkTextColor,  String headingFont,  String bodyFont,  String scriptFont,  int borderRadius,  bool isActive)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ThemeSettings() when $default != null:
return $default(_that.id,_that.primaryColor,_that.secondaryColor,_that.accentColor,_that.backgroundColor,_that.textColor,_that.darkPrimaryColor,_that.darkSecondaryColor,_that.darkBackgroundColor,_that.darkTextColor,_that.headingFont,_that.bodyFont,_that.scriptFont,_that.borderRadius,_that.isActive);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String? id,  String primaryColor,  String secondaryColor,  String accentColor,  String backgroundColor,  String textColor,  String darkPrimaryColor,  String darkSecondaryColor,  String darkBackgroundColor,  String darkTextColor,  String headingFont,  String bodyFont,  String scriptFont,  int borderRadius,  bool isActive)  $default,) {final _that = this;
switch (_that) {
case _ThemeSettings():
return $default(_that.id,_that.primaryColor,_that.secondaryColor,_that.accentColor,_that.backgroundColor,_that.textColor,_that.darkPrimaryColor,_that.darkSecondaryColor,_that.darkBackgroundColor,_that.darkTextColor,_that.headingFont,_that.bodyFont,_that.scriptFont,_that.borderRadius,_that.isActive);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String? id,  String primaryColor,  String secondaryColor,  String accentColor,  String backgroundColor,  String textColor,  String darkPrimaryColor,  String darkSecondaryColor,  String darkBackgroundColor,  String darkTextColor,  String headingFont,  String bodyFont,  String scriptFont,  int borderRadius,  bool isActive)?  $default,) {final _that = this;
switch (_that) {
case _ThemeSettings() when $default != null:
return $default(_that.id,_that.primaryColor,_that.secondaryColor,_that.accentColor,_that.backgroundColor,_that.textColor,_that.darkPrimaryColor,_that.darkSecondaryColor,_that.darkBackgroundColor,_that.darkTextColor,_that.headingFont,_that.bodyFont,_that.scriptFont,_that.borderRadius,_that.isActive);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ThemeSettings implements ThemeSettings {
  const _ThemeSettings({this.id, this.primaryColor = '#6c0a0a', this.secondaryColor = '#ffaadd', this.accentColor = '#fff1f9', this.backgroundColor = '#fff1f9', this.textColor = '#000000', this.darkPrimaryColor = '#ffaadd', this.darkSecondaryColor = '#6c0a0a', this.darkBackgroundColor = '#6c0a0a', this.darkTextColor = '#fff1f9', this.headingFont = 'Poppins', this.bodyFont = 'Open Sans', this.scriptFont = 'Great Vibes', this.borderRadius = 40, this.isActive = true});
  factory _ThemeSettings.fromJson(Map<String, dynamic> json) => _$ThemeSettingsFromJson(json);

@override final  String? id;
@override@JsonKey() final  String primaryColor;
@override@JsonKey() final  String secondaryColor;
@override@JsonKey() final  String accentColor;
@override@JsonKey() final  String backgroundColor;
@override@JsonKey() final  String textColor;
@override@JsonKey() final  String darkPrimaryColor;
@override@JsonKey() final  String darkSecondaryColor;
@override@JsonKey() final  String darkBackgroundColor;
@override@JsonKey() final  String darkTextColor;
@override@JsonKey() final  String headingFont;
@override@JsonKey() final  String bodyFont;
@override@JsonKey() final  String scriptFont;
@override@JsonKey() final  int borderRadius;
@override@JsonKey() final  bool isActive;

/// Create a copy of ThemeSettings
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ThemeSettingsCopyWith<_ThemeSettings> get copyWith => __$ThemeSettingsCopyWithImpl<_ThemeSettings>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ThemeSettingsToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ThemeSettings&&(identical(other.id, id) || other.id == id)&&(identical(other.primaryColor, primaryColor) || other.primaryColor == primaryColor)&&(identical(other.secondaryColor, secondaryColor) || other.secondaryColor == secondaryColor)&&(identical(other.accentColor, accentColor) || other.accentColor == accentColor)&&(identical(other.backgroundColor, backgroundColor) || other.backgroundColor == backgroundColor)&&(identical(other.textColor, textColor) || other.textColor == textColor)&&(identical(other.darkPrimaryColor, darkPrimaryColor) || other.darkPrimaryColor == darkPrimaryColor)&&(identical(other.darkSecondaryColor, darkSecondaryColor) || other.darkSecondaryColor == darkSecondaryColor)&&(identical(other.darkBackgroundColor, darkBackgroundColor) || other.darkBackgroundColor == darkBackgroundColor)&&(identical(other.darkTextColor, darkTextColor) || other.darkTextColor == darkTextColor)&&(identical(other.headingFont, headingFont) || other.headingFont == headingFont)&&(identical(other.bodyFont, bodyFont) || other.bodyFont == bodyFont)&&(identical(other.scriptFont, scriptFont) || other.scriptFont == scriptFont)&&(identical(other.borderRadius, borderRadius) || other.borderRadius == borderRadius)&&(identical(other.isActive, isActive) || other.isActive == isActive));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,primaryColor,secondaryColor,accentColor,backgroundColor,textColor,darkPrimaryColor,darkSecondaryColor,darkBackgroundColor,darkTextColor,headingFont,bodyFont,scriptFont,borderRadius,isActive);

@override
String toString() {
  return 'ThemeSettings(id: $id, primaryColor: $primaryColor, secondaryColor: $secondaryColor, accentColor: $accentColor, backgroundColor: $backgroundColor, textColor: $textColor, darkPrimaryColor: $darkPrimaryColor, darkSecondaryColor: $darkSecondaryColor, darkBackgroundColor: $darkBackgroundColor, darkTextColor: $darkTextColor, headingFont: $headingFont, bodyFont: $bodyFont, scriptFont: $scriptFont, borderRadius: $borderRadius, isActive: $isActive)';
}


}

/// @nodoc
abstract mixin class _$ThemeSettingsCopyWith<$Res> implements $ThemeSettingsCopyWith<$Res> {
  factory _$ThemeSettingsCopyWith(_ThemeSettings value, $Res Function(_ThemeSettings) _then) = __$ThemeSettingsCopyWithImpl;
@override @useResult
$Res call({
 String? id, String primaryColor, String secondaryColor, String accentColor, String backgroundColor, String textColor, String darkPrimaryColor, String darkSecondaryColor, String darkBackgroundColor, String darkTextColor, String headingFont, String bodyFont, String scriptFont, int borderRadius, bool isActive
});




}
/// @nodoc
class __$ThemeSettingsCopyWithImpl<$Res>
    implements _$ThemeSettingsCopyWith<$Res> {
  __$ThemeSettingsCopyWithImpl(this._self, this._then);

  final _ThemeSettings _self;
  final $Res Function(_ThemeSettings) _then;

/// Create a copy of ThemeSettings
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = freezed,Object? primaryColor = null,Object? secondaryColor = null,Object? accentColor = null,Object? backgroundColor = null,Object? textColor = null,Object? darkPrimaryColor = null,Object? darkSecondaryColor = null,Object? darkBackgroundColor = null,Object? darkTextColor = null,Object? headingFont = null,Object? bodyFont = null,Object? scriptFont = null,Object? borderRadius = null,Object? isActive = null,}) {
  return _then(_ThemeSettings(
id: freezed == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String?,primaryColor: null == primaryColor ? _self.primaryColor : primaryColor // ignore: cast_nullable_to_non_nullable
as String,secondaryColor: null == secondaryColor ? _self.secondaryColor : secondaryColor // ignore: cast_nullable_to_non_nullable
as String,accentColor: null == accentColor ? _self.accentColor : accentColor // ignore: cast_nullable_to_non_nullable
as String,backgroundColor: null == backgroundColor ? _self.backgroundColor : backgroundColor // ignore: cast_nullable_to_non_nullable
as String,textColor: null == textColor ? _self.textColor : textColor // ignore: cast_nullable_to_non_nullable
as String,darkPrimaryColor: null == darkPrimaryColor ? _self.darkPrimaryColor : darkPrimaryColor // ignore: cast_nullable_to_non_nullable
as String,darkSecondaryColor: null == darkSecondaryColor ? _self.darkSecondaryColor : darkSecondaryColor // ignore: cast_nullable_to_non_nullable
as String,darkBackgroundColor: null == darkBackgroundColor ? _self.darkBackgroundColor : darkBackgroundColor // ignore: cast_nullable_to_non_nullable
as String,darkTextColor: null == darkTextColor ? _self.darkTextColor : darkTextColor // ignore: cast_nullable_to_non_nullable
as String,headingFont: null == headingFont ? _self.headingFont : headingFont // ignore: cast_nullable_to_non_nullable
as String,bodyFont: null == bodyFont ? _self.bodyFont : bodyFont // ignore: cast_nullable_to_non_nullable
as String,scriptFont: null == scriptFont ? _self.scriptFont : scriptFont // ignore: cast_nullable_to_non_nullable
as String,borderRadius: null == borderRadius ? _self.borderRadius : borderRadius // ignore: cast_nullable_to_non_nullable
as int,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}


}


/// @nodoc
mixin _$SiteSettings {

 String? get id; String get siteName; String? get siteTagline; String? get logoUrl; String? get defaultMetaTitle; String? get defaultMetaDescription; String? get defaultEmail; String? get defaultPhone; String? get defaultWhatsapp; String? get googleAnalyticsId; bool get maintenanceMode; String? get maintenanceMessage; bool get showAboutPage; bool get showProjectsPage; bool get showServicesPage; bool get showContactPage; bool get allowIndexing; bool get isActive;
/// Create a copy of SiteSettings
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SiteSettingsCopyWith<SiteSettings> get copyWith => _$SiteSettingsCopyWithImpl<SiteSettings>(this as SiteSettings, _$identity);

  /// Serializes this SiteSettings to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SiteSettings&&(identical(other.id, id) || other.id == id)&&(identical(other.siteName, siteName) || other.siteName == siteName)&&(identical(other.siteTagline, siteTagline) || other.siteTagline == siteTagline)&&(identical(other.logoUrl, logoUrl) || other.logoUrl == logoUrl)&&(identical(other.defaultMetaTitle, defaultMetaTitle) || other.defaultMetaTitle == defaultMetaTitle)&&(identical(other.defaultMetaDescription, defaultMetaDescription) || other.defaultMetaDescription == defaultMetaDescription)&&(identical(other.defaultEmail, defaultEmail) || other.defaultEmail == defaultEmail)&&(identical(other.defaultPhone, defaultPhone) || other.defaultPhone == defaultPhone)&&(identical(other.defaultWhatsapp, defaultWhatsapp) || other.defaultWhatsapp == defaultWhatsapp)&&(identical(other.googleAnalyticsId, googleAnalyticsId) || other.googleAnalyticsId == googleAnalyticsId)&&(identical(other.maintenanceMode, maintenanceMode) || other.maintenanceMode == maintenanceMode)&&(identical(other.maintenanceMessage, maintenanceMessage) || other.maintenanceMessage == maintenanceMessage)&&(identical(other.showAboutPage, showAboutPage) || other.showAboutPage == showAboutPage)&&(identical(other.showProjectsPage, showProjectsPage) || other.showProjectsPage == showProjectsPage)&&(identical(other.showServicesPage, showServicesPage) || other.showServicesPage == showServicesPage)&&(identical(other.showContactPage, showContactPage) || other.showContactPage == showContactPage)&&(identical(other.allowIndexing, allowIndexing) || other.allowIndexing == allowIndexing)&&(identical(other.isActive, isActive) || other.isActive == isActive));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,siteName,siteTagline,logoUrl,defaultMetaTitle,defaultMetaDescription,defaultEmail,defaultPhone,defaultWhatsapp,googleAnalyticsId,maintenanceMode,maintenanceMessage,showAboutPage,showProjectsPage,showServicesPage,showContactPage,allowIndexing,isActive);

@override
String toString() {
  return 'SiteSettings(id: $id, siteName: $siteName, siteTagline: $siteTagline, logoUrl: $logoUrl, defaultMetaTitle: $defaultMetaTitle, defaultMetaDescription: $defaultMetaDescription, defaultEmail: $defaultEmail, defaultPhone: $defaultPhone, defaultWhatsapp: $defaultWhatsapp, googleAnalyticsId: $googleAnalyticsId, maintenanceMode: $maintenanceMode, maintenanceMessage: $maintenanceMessage, showAboutPage: $showAboutPage, showProjectsPage: $showProjectsPage, showServicesPage: $showServicesPage, showContactPage: $showContactPage, allowIndexing: $allowIndexing, isActive: $isActive)';
}


}

/// @nodoc
abstract mixin class $SiteSettingsCopyWith<$Res>  {
  factory $SiteSettingsCopyWith(SiteSettings value, $Res Function(SiteSettings) _then) = _$SiteSettingsCopyWithImpl;
@useResult
$Res call({
 String? id, String siteName, String? siteTagline, String? logoUrl, String? defaultMetaTitle, String? defaultMetaDescription, String? defaultEmail, String? defaultPhone, String? defaultWhatsapp, String? googleAnalyticsId, bool maintenanceMode, String? maintenanceMessage, bool showAboutPage, bool showProjectsPage, bool showServicesPage, bool showContactPage, bool allowIndexing, bool isActive
});




}
/// @nodoc
class _$SiteSettingsCopyWithImpl<$Res>
    implements $SiteSettingsCopyWith<$Res> {
  _$SiteSettingsCopyWithImpl(this._self, this._then);

  final SiteSettings _self;
  final $Res Function(SiteSettings) _then;

/// Create a copy of SiteSettings
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = freezed,Object? siteName = null,Object? siteTagline = freezed,Object? logoUrl = freezed,Object? defaultMetaTitle = freezed,Object? defaultMetaDescription = freezed,Object? defaultEmail = freezed,Object? defaultPhone = freezed,Object? defaultWhatsapp = freezed,Object? googleAnalyticsId = freezed,Object? maintenanceMode = null,Object? maintenanceMessage = freezed,Object? showAboutPage = null,Object? showProjectsPage = null,Object? showServicesPage = null,Object? showContactPage = null,Object? allowIndexing = null,Object? isActive = null,}) {
  return _then(_self.copyWith(
id: freezed == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String?,siteName: null == siteName ? _self.siteName : siteName // ignore: cast_nullable_to_non_nullable
as String,siteTagline: freezed == siteTagline ? _self.siteTagline : siteTagline // ignore: cast_nullable_to_non_nullable
as String?,logoUrl: freezed == logoUrl ? _self.logoUrl : logoUrl // ignore: cast_nullable_to_non_nullable
as String?,defaultMetaTitle: freezed == defaultMetaTitle ? _self.defaultMetaTitle : defaultMetaTitle // ignore: cast_nullable_to_non_nullable
as String?,defaultMetaDescription: freezed == defaultMetaDescription ? _self.defaultMetaDescription : defaultMetaDescription // ignore: cast_nullable_to_non_nullable
as String?,defaultEmail: freezed == defaultEmail ? _self.defaultEmail : defaultEmail // ignore: cast_nullable_to_non_nullable
as String?,defaultPhone: freezed == defaultPhone ? _self.defaultPhone : defaultPhone // ignore: cast_nullable_to_non_nullable
as String?,defaultWhatsapp: freezed == defaultWhatsapp ? _self.defaultWhatsapp : defaultWhatsapp // ignore: cast_nullable_to_non_nullable
as String?,googleAnalyticsId: freezed == googleAnalyticsId ? _self.googleAnalyticsId : googleAnalyticsId // ignore: cast_nullable_to_non_nullable
as String?,maintenanceMode: null == maintenanceMode ? _self.maintenanceMode : maintenanceMode // ignore: cast_nullable_to_non_nullable
as bool,maintenanceMessage: freezed == maintenanceMessage ? _self.maintenanceMessage : maintenanceMessage // ignore: cast_nullable_to_non_nullable
as String?,showAboutPage: null == showAboutPage ? _self.showAboutPage : showAboutPage // ignore: cast_nullable_to_non_nullable
as bool,showProjectsPage: null == showProjectsPage ? _self.showProjectsPage : showProjectsPage // ignore: cast_nullable_to_non_nullable
as bool,showServicesPage: null == showServicesPage ? _self.showServicesPage : showServicesPage // ignore: cast_nullable_to_non_nullable
as bool,showContactPage: null == showContactPage ? _self.showContactPage : showContactPage // ignore: cast_nullable_to_non_nullable
as bool,allowIndexing: null == allowIndexing ? _self.allowIndexing : allowIndexing // ignore: cast_nullable_to_non_nullable
as bool,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}

}


/// Adds pattern-matching-related methods to [SiteSettings].
extension SiteSettingsPatterns on SiteSettings {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SiteSettings value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SiteSettings() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SiteSettings value)  $default,){
final _that = this;
switch (_that) {
case _SiteSettings():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SiteSettings value)?  $default,){
final _that = this;
switch (_that) {
case _SiteSettings() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String? id,  String siteName,  String? siteTagline,  String? logoUrl,  String? defaultMetaTitle,  String? defaultMetaDescription,  String? defaultEmail,  String? defaultPhone,  String? defaultWhatsapp,  String? googleAnalyticsId,  bool maintenanceMode,  String? maintenanceMessage,  bool showAboutPage,  bool showProjectsPage,  bool showServicesPage,  bool showContactPage,  bool allowIndexing,  bool isActive)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SiteSettings() when $default != null:
return $default(_that.id,_that.siteName,_that.siteTagline,_that.logoUrl,_that.defaultMetaTitle,_that.defaultMetaDescription,_that.defaultEmail,_that.defaultPhone,_that.defaultWhatsapp,_that.googleAnalyticsId,_that.maintenanceMode,_that.maintenanceMessage,_that.showAboutPage,_that.showProjectsPage,_that.showServicesPage,_that.showContactPage,_that.allowIndexing,_that.isActive);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String? id,  String siteName,  String? siteTagline,  String? logoUrl,  String? defaultMetaTitle,  String? defaultMetaDescription,  String? defaultEmail,  String? defaultPhone,  String? defaultWhatsapp,  String? googleAnalyticsId,  bool maintenanceMode,  String? maintenanceMessage,  bool showAboutPage,  bool showProjectsPage,  bool showServicesPage,  bool showContactPage,  bool allowIndexing,  bool isActive)  $default,) {final _that = this;
switch (_that) {
case _SiteSettings():
return $default(_that.id,_that.siteName,_that.siteTagline,_that.logoUrl,_that.defaultMetaTitle,_that.defaultMetaDescription,_that.defaultEmail,_that.defaultPhone,_that.defaultWhatsapp,_that.googleAnalyticsId,_that.maintenanceMode,_that.maintenanceMessage,_that.showAboutPage,_that.showProjectsPage,_that.showServicesPage,_that.showContactPage,_that.allowIndexing,_that.isActive);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String? id,  String siteName,  String? siteTagline,  String? logoUrl,  String? defaultMetaTitle,  String? defaultMetaDescription,  String? defaultEmail,  String? defaultPhone,  String? defaultWhatsapp,  String? googleAnalyticsId,  bool maintenanceMode,  String? maintenanceMessage,  bool showAboutPage,  bool showProjectsPage,  bool showServicesPage,  bool showContactPage,  bool allowIndexing,  bool isActive)?  $default,) {final _that = this;
switch (_that) {
case _SiteSettings() when $default != null:
return $default(_that.id,_that.siteName,_that.siteTagline,_that.logoUrl,_that.defaultMetaTitle,_that.defaultMetaDescription,_that.defaultEmail,_that.defaultPhone,_that.defaultWhatsapp,_that.googleAnalyticsId,_that.maintenanceMode,_that.maintenanceMessage,_that.showAboutPage,_that.showProjectsPage,_that.showServicesPage,_that.showContactPage,_that.allowIndexing,_that.isActive);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SiteSettings implements SiteSettings {
  const _SiteSettings({this.id, this.siteName = 'Paola Bolívar Nievas - Make-up Artist', this.siteTagline, this.logoUrl, this.defaultMetaTitle, this.defaultMetaDescription, this.defaultEmail, this.defaultPhone, this.defaultWhatsapp, this.googleAnalyticsId, this.maintenanceMode = false, this.maintenanceMessage, this.showAboutPage = true, this.showProjectsPage = true, this.showServicesPage = false, this.showContactPage = true, this.allowIndexing = true, this.isActive = true});
  factory _SiteSettings.fromJson(Map<String, dynamic> json) => _$SiteSettingsFromJson(json);

@override final  String? id;
@override@JsonKey() final  String siteName;
@override final  String? siteTagline;
@override final  String? logoUrl;
@override final  String? defaultMetaTitle;
@override final  String? defaultMetaDescription;
@override final  String? defaultEmail;
@override final  String? defaultPhone;
@override final  String? defaultWhatsapp;
@override final  String? googleAnalyticsId;
@override@JsonKey() final  bool maintenanceMode;
@override final  String? maintenanceMessage;
@override@JsonKey() final  bool showAboutPage;
@override@JsonKey() final  bool showProjectsPage;
@override@JsonKey() final  bool showServicesPage;
@override@JsonKey() final  bool showContactPage;
@override@JsonKey() final  bool allowIndexing;
@override@JsonKey() final  bool isActive;

/// Create a copy of SiteSettings
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SiteSettingsCopyWith<_SiteSettings> get copyWith => __$SiteSettingsCopyWithImpl<_SiteSettings>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SiteSettingsToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _SiteSettings&&(identical(other.id, id) || other.id == id)&&(identical(other.siteName, siteName) || other.siteName == siteName)&&(identical(other.siteTagline, siteTagline) || other.siteTagline == siteTagline)&&(identical(other.logoUrl, logoUrl) || other.logoUrl == logoUrl)&&(identical(other.defaultMetaTitle, defaultMetaTitle) || other.defaultMetaTitle == defaultMetaTitle)&&(identical(other.defaultMetaDescription, defaultMetaDescription) || other.defaultMetaDescription == defaultMetaDescription)&&(identical(other.defaultEmail, defaultEmail) || other.defaultEmail == defaultEmail)&&(identical(other.defaultPhone, defaultPhone) || other.defaultPhone == defaultPhone)&&(identical(other.defaultWhatsapp, defaultWhatsapp) || other.defaultWhatsapp == defaultWhatsapp)&&(identical(other.googleAnalyticsId, googleAnalyticsId) || other.googleAnalyticsId == googleAnalyticsId)&&(identical(other.maintenanceMode, maintenanceMode) || other.maintenanceMode == maintenanceMode)&&(identical(other.maintenanceMessage, maintenanceMessage) || other.maintenanceMessage == maintenanceMessage)&&(identical(other.showAboutPage, showAboutPage) || other.showAboutPage == showAboutPage)&&(identical(other.showProjectsPage, showProjectsPage) || other.showProjectsPage == showProjectsPage)&&(identical(other.showServicesPage, showServicesPage) || other.showServicesPage == showServicesPage)&&(identical(other.showContactPage, showContactPage) || other.showContactPage == showContactPage)&&(identical(other.allowIndexing, allowIndexing) || other.allowIndexing == allowIndexing)&&(identical(other.isActive, isActive) || other.isActive == isActive));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,siteName,siteTagline,logoUrl,defaultMetaTitle,defaultMetaDescription,defaultEmail,defaultPhone,defaultWhatsapp,googleAnalyticsId,maintenanceMode,maintenanceMessage,showAboutPage,showProjectsPage,showServicesPage,showContactPage,allowIndexing,isActive);

@override
String toString() {
  return 'SiteSettings(id: $id, siteName: $siteName, siteTagline: $siteTagline, logoUrl: $logoUrl, defaultMetaTitle: $defaultMetaTitle, defaultMetaDescription: $defaultMetaDescription, defaultEmail: $defaultEmail, defaultPhone: $defaultPhone, defaultWhatsapp: $defaultWhatsapp, googleAnalyticsId: $googleAnalyticsId, maintenanceMode: $maintenanceMode, maintenanceMessage: $maintenanceMessage, showAboutPage: $showAboutPage, showProjectsPage: $showProjectsPage, showServicesPage: $showServicesPage, showContactPage: $showContactPage, allowIndexing: $allowIndexing, isActive: $isActive)';
}


}

/// @nodoc
abstract mixin class _$SiteSettingsCopyWith<$Res> implements $SiteSettingsCopyWith<$Res> {
  factory _$SiteSettingsCopyWith(_SiteSettings value, $Res Function(_SiteSettings) _then) = __$SiteSettingsCopyWithImpl;
@override @useResult
$Res call({
 String? id, String siteName, String? siteTagline, String? logoUrl, String? defaultMetaTitle, String? defaultMetaDescription, String? defaultEmail, String? defaultPhone, String? defaultWhatsapp, String? googleAnalyticsId, bool maintenanceMode, String? maintenanceMessage, bool showAboutPage, bool showProjectsPage, bool showServicesPage, bool showContactPage, bool allowIndexing, bool isActive
});




}
/// @nodoc
class __$SiteSettingsCopyWithImpl<$Res>
    implements _$SiteSettingsCopyWith<$Res> {
  __$SiteSettingsCopyWithImpl(this._self, this._then);

  final _SiteSettings _self;
  final $Res Function(_SiteSettings) _then;

/// Create a copy of SiteSettings
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = freezed,Object? siteName = null,Object? siteTagline = freezed,Object? logoUrl = freezed,Object? defaultMetaTitle = freezed,Object? defaultMetaDescription = freezed,Object? defaultEmail = freezed,Object? defaultPhone = freezed,Object? defaultWhatsapp = freezed,Object? googleAnalyticsId = freezed,Object? maintenanceMode = null,Object? maintenanceMessage = freezed,Object? showAboutPage = null,Object? showProjectsPage = null,Object? showServicesPage = null,Object? showContactPage = null,Object? allowIndexing = null,Object? isActive = null,}) {
  return _then(_SiteSettings(
id: freezed == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String?,siteName: null == siteName ? _self.siteName : siteName // ignore: cast_nullable_to_non_nullable
as String,siteTagline: freezed == siteTagline ? _self.siteTagline : siteTagline // ignore: cast_nullable_to_non_nullable
as String?,logoUrl: freezed == logoUrl ? _self.logoUrl : logoUrl // ignore: cast_nullable_to_non_nullable
as String?,defaultMetaTitle: freezed == defaultMetaTitle ? _self.defaultMetaTitle : defaultMetaTitle // ignore: cast_nullable_to_non_nullable
as String?,defaultMetaDescription: freezed == defaultMetaDescription ? _self.defaultMetaDescription : defaultMetaDescription // ignore: cast_nullable_to_non_nullable
as String?,defaultEmail: freezed == defaultEmail ? _self.defaultEmail : defaultEmail // ignore: cast_nullable_to_non_nullable
as String?,defaultPhone: freezed == defaultPhone ? _self.defaultPhone : defaultPhone // ignore: cast_nullable_to_non_nullable
as String?,defaultWhatsapp: freezed == defaultWhatsapp ? _self.defaultWhatsapp : defaultWhatsapp // ignore: cast_nullable_to_non_nullable
as String?,googleAnalyticsId: freezed == googleAnalyticsId ? _self.googleAnalyticsId : googleAnalyticsId // ignore: cast_nullable_to_non_nullable
as String?,maintenanceMode: null == maintenanceMode ? _self.maintenanceMode : maintenanceMode // ignore: cast_nullable_to_non_nullable
as bool,maintenanceMessage: freezed == maintenanceMessage ? _self.maintenanceMessage : maintenanceMessage // ignore: cast_nullable_to_non_nullable
as String?,showAboutPage: null == showAboutPage ? _self.showAboutPage : showAboutPage // ignore: cast_nullable_to_non_nullable
as bool,showProjectsPage: null == showProjectsPage ? _self.showProjectsPage : showProjectsPage // ignore: cast_nullable_to_non_nullable
as bool,showServicesPage: null == showServicesPage ? _self.showServicesPage : showServicesPage // ignore: cast_nullable_to_non_nullable
as bool,showContactPage: null == showContactPage ? _self.showContactPage : showContactPage // ignore: cast_nullable_to_non_nullable
as bool,allowIndexing: null == allowIndexing ? _self.allowIndexing : allowIndexing // ignore: cast_nullable_to_non_nullable
as bool,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}


}


/// @nodoc
mixin _$HomeSettings {

 String? get id; String? get heroTitle1Text; String? get heroTitle2Text; String? get ownerNameText; String? get heroMainImageUrl; String? get heroMainImageAlt; String? get ctaText; String? get ctaLink; bool get showFeaturedProjects; String? get featuredTitle; int get featuredCount; String? get illustrationUrl; bool get isActive;
/// Create a copy of HomeSettings
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$HomeSettingsCopyWith<HomeSettings> get copyWith => _$HomeSettingsCopyWithImpl<HomeSettings>(this as HomeSettings, _$identity);

  /// Serializes this HomeSettings to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is HomeSettings&&(identical(other.id, id) || other.id == id)&&(identical(other.heroTitle1Text, heroTitle1Text) || other.heroTitle1Text == heroTitle1Text)&&(identical(other.heroTitle2Text, heroTitle2Text) || other.heroTitle2Text == heroTitle2Text)&&(identical(other.ownerNameText, ownerNameText) || other.ownerNameText == ownerNameText)&&(identical(other.heroMainImageUrl, heroMainImageUrl) || other.heroMainImageUrl == heroMainImageUrl)&&(identical(other.heroMainImageAlt, heroMainImageAlt) || other.heroMainImageAlt == heroMainImageAlt)&&(identical(other.ctaText, ctaText) || other.ctaText == ctaText)&&(identical(other.ctaLink, ctaLink) || other.ctaLink == ctaLink)&&(identical(other.showFeaturedProjects, showFeaturedProjects) || other.showFeaturedProjects == showFeaturedProjects)&&(identical(other.featuredTitle, featuredTitle) || other.featuredTitle == featuredTitle)&&(identical(other.featuredCount, featuredCount) || other.featuredCount == featuredCount)&&(identical(other.illustrationUrl, illustrationUrl) || other.illustrationUrl == illustrationUrl)&&(identical(other.isActive, isActive) || other.isActive == isActive));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,heroTitle1Text,heroTitle2Text,ownerNameText,heroMainImageUrl,heroMainImageAlt,ctaText,ctaLink,showFeaturedProjects,featuredTitle,featuredCount,illustrationUrl,isActive);

@override
String toString() {
  return 'HomeSettings(id: $id, heroTitle1Text: $heroTitle1Text, heroTitle2Text: $heroTitle2Text, ownerNameText: $ownerNameText, heroMainImageUrl: $heroMainImageUrl, heroMainImageAlt: $heroMainImageAlt, ctaText: $ctaText, ctaLink: $ctaLink, showFeaturedProjects: $showFeaturedProjects, featuredTitle: $featuredTitle, featuredCount: $featuredCount, illustrationUrl: $illustrationUrl, isActive: $isActive)';
}


}

/// @nodoc
abstract mixin class $HomeSettingsCopyWith<$Res>  {
  factory $HomeSettingsCopyWith(HomeSettings value, $Res Function(HomeSettings) _then) = _$HomeSettingsCopyWithImpl;
@useResult
$Res call({
 String? id, String? heroTitle1Text, String? heroTitle2Text, String? ownerNameText, String? heroMainImageUrl, String? heroMainImageAlt, String? ctaText, String? ctaLink, bool showFeaturedProjects, String? featuredTitle, int featuredCount, String? illustrationUrl, bool isActive
});




}
/// @nodoc
class _$HomeSettingsCopyWithImpl<$Res>
    implements $HomeSettingsCopyWith<$Res> {
  _$HomeSettingsCopyWithImpl(this._self, this._then);

  final HomeSettings _self;
  final $Res Function(HomeSettings) _then;

/// Create a copy of HomeSettings
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = freezed,Object? heroTitle1Text = freezed,Object? heroTitle2Text = freezed,Object? ownerNameText = freezed,Object? heroMainImageUrl = freezed,Object? heroMainImageAlt = freezed,Object? ctaText = freezed,Object? ctaLink = freezed,Object? showFeaturedProjects = null,Object? featuredTitle = freezed,Object? featuredCount = null,Object? illustrationUrl = freezed,Object? isActive = null,}) {
  return _then(_self.copyWith(
id: freezed == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String?,heroTitle1Text: freezed == heroTitle1Text ? _self.heroTitle1Text : heroTitle1Text // ignore: cast_nullable_to_non_nullable
as String?,heroTitle2Text: freezed == heroTitle2Text ? _self.heroTitle2Text : heroTitle2Text // ignore: cast_nullable_to_non_nullable
as String?,ownerNameText: freezed == ownerNameText ? _self.ownerNameText : ownerNameText // ignore: cast_nullable_to_non_nullable
as String?,heroMainImageUrl: freezed == heroMainImageUrl ? _self.heroMainImageUrl : heroMainImageUrl // ignore: cast_nullable_to_non_nullable
as String?,heroMainImageAlt: freezed == heroMainImageAlt ? _self.heroMainImageAlt : heroMainImageAlt // ignore: cast_nullable_to_non_nullable
as String?,ctaText: freezed == ctaText ? _self.ctaText : ctaText // ignore: cast_nullable_to_non_nullable
as String?,ctaLink: freezed == ctaLink ? _self.ctaLink : ctaLink // ignore: cast_nullable_to_non_nullable
as String?,showFeaturedProjects: null == showFeaturedProjects ? _self.showFeaturedProjects : showFeaturedProjects // ignore: cast_nullable_to_non_nullable
as bool,featuredTitle: freezed == featuredTitle ? _self.featuredTitle : featuredTitle // ignore: cast_nullable_to_non_nullable
as String?,featuredCount: null == featuredCount ? _self.featuredCount : featuredCount // ignore: cast_nullable_to_non_nullable
as int,illustrationUrl: freezed == illustrationUrl ? _self.illustrationUrl : illustrationUrl // ignore: cast_nullable_to_non_nullable
as String?,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}

}


/// Adds pattern-matching-related methods to [HomeSettings].
extension HomeSettingsPatterns on HomeSettings {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _HomeSettings value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _HomeSettings() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _HomeSettings value)  $default,){
final _that = this;
switch (_that) {
case _HomeSettings():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _HomeSettings value)?  $default,){
final _that = this;
switch (_that) {
case _HomeSettings() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String? id,  String? heroTitle1Text,  String? heroTitle2Text,  String? ownerNameText,  String? heroMainImageUrl,  String? heroMainImageAlt,  String? ctaText,  String? ctaLink,  bool showFeaturedProjects,  String? featuredTitle,  int featuredCount,  String? illustrationUrl,  bool isActive)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _HomeSettings() when $default != null:
return $default(_that.id,_that.heroTitle1Text,_that.heroTitle2Text,_that.ownerNameText,_that.heroMainImageUrl,_that.heroMainImageAlt,_that.ctaText,_that.ctaLink,_that.showFeaturedProjects,_that.featuredTitle,_that.featuredCount,_that.illustrationUrl,_that.isActive);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String? id,  String? heroTitle1Text,  String? heroTitle2Text,  String? ownerNameText,  String? heroMainImageUrl,  String? heroMainImageAlt,  String? ctaText,  String? ctaLink,  bool showFeaturedProjects,  String? featuredTitle,  int featuredCount,  String? illustrationUrl,  bool isActive)  $default,) {final _that = this;
switch (_that) {
case _HomeSettings():
return $default(_that.id,_that.heroTitle1Text,_that.heroTitle2Text,_that.ownerNameText,_that.heroMainImageUrl,_that.heroMainImageAlt,_that.ctaText,_that.ctaLink,_that.showFeaturedProjects,_that.featuredTitle,_that.featuredCount,_that.illustrationUrl,_that.isActive);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String? id,  String? heroTitle1Text,  String? heroTitle2Text,  String? ownerNameText,  String? heroMainImageUrl,  String? heroMainImageAlt,  String? ctaText,  String? ctaLink,  bool showFeaturedProjects,  String? featuredTitle,  int featuredCount,  String? illustrationUrl,  bool isActive)?  $default,) {final _that = this;
switch (_that) {
case _HomeSettings() when $default != null:
return $default(_that.id,_that.heroTitle1Text,_that.heroTitle2Text,_that.ownerNameText,_that.heroMainImageUrl,_that.heroMainImageAlt,_that.ctaText,_that.ctaLink,_that.showFeaturedProjects,_that.featuredTitle,_that.featuredCount,_that.illustrationUrl,_that.isActive);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _HomeSettings implements HomeSettings {
  const _HomeSettings({this.id, this.heroTitle1Text, this.heroTitle2Text, this.ownerNameText, this.heroMainImageUrl, this.heroMainImageAlt, this.ctaText, this.ctaLink, this.showFeaturedProjects = true, this.featuredTitle, this.featuredCount = 3, this.illustrationUrl, this.isActive = true});
  factory _HomeSettings.fromJson(Map<String, dynamic> json) => _$HomeSettingsFromJson(json);

@override final  String? id;
@override final  String? heroTitle1Text;
@override final  String? heroTitle2Text;
@override final  String? ownerNameText;
@override final  String? heroMainImageUrl;
@override final  String? heroMainImageAlt;
@override final  String? ctaText;
@override final  String? ctaLink;
@override@JsonKey() final  bool showFeaturedProjects;
@override final  String? featuredTitle;
@override@JsonKey() final  int featuredCount;
@override final  String? illustrationUrl;
@override@JsonKey() final  bool isActive;

/// Create a copy of HomeSettings
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$HomeSettingsCopyWith<_HomeSettings> get copyWith => __$HomeSettingsCopyWithImpl<_HomeSettings>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$HomeSettingsToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _HomeSettings&&(identical(other.id, id) || other.id == id)&&(identical(other.heroTitle1Text, heroTitle1Text) || other.heroTitle1Text == heroTitle1Text)&&(identical(other.heroTitle2Text, heroTitle2Text) || other.heroTitle2Text == heroTitle2Text)&&(identical(other.ownerNameText, ownerNameText) || other.ownerNameText == ownerNameText)&&(identical(other.heroMainImageUrl, heroMainImageUrl) || other.heroMainImageUrl == heroMainImageUrl)&&(identical(other.heroMainImageAlt, heroMainImageAlt) || other.heroMainImageAlt == heroMainImageAlt)&&(identical(other.ctaText, ctaText) || other.ctaText == ctaText)&&(identical(other.ctaLink, ctaLink) || other.ctaLink == ctaLink)&&(identical(other.showFeaturedProjects, showFeaturedProjects) || other.showFeaturedProjects == showFeaturedProjects)&&(identical(other.featuredTitle, featuredTitle) || other.featuredTitle == featuredTitle)&&(identical(other.featuredCount, featuredCount) || other.featuredCount == featuredCount)&&(identical(other.illustrationUrl, illustrationUrl) || other.illustrationUrl == illustrationUrl)&&(identical(other.isActive, isActive) || other.isActive == isActive));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,heroTitle1Text,heroTitle2Text,ownerNameText,heroMainImageUrl,heroMainImageAlt,ctaText,ctaLink,showFeaturedProjects,featuredTitle,featuredCount,illustrationUrl,isActive);

@override
String toString() {
  return 'HomeSettings(id: $id, heroTitle1Text: $heroTitle1Text, heroTitle2Text: $heroTitle2Text, ownerNameText: $ownerNameText, heroMainImageUrl: $heroMainImageUrl, heroMainImageAlt: $heroMainImageAlt, ctaText: $ctaText, ctaLink: $ctaLink, showFeaturedProjects: $showFeaturedProjects, featuredTitle: $featuredTitle, featuredCount: $featuredCount, illustrationUrl: $illustrationUrl, isActive: $isActive)';
}


}

/// @nodoc
abstract mixin class _$HomeSettingsCopyWith<$Res> implements $HomeSettingsCopyWith<$Res> {
  factory _$HomeSettingsCopyWith(_HomeSettings value, $Res Function(_HomeSettings) _then) = __$HomeSettingsCopyWithImpl;
@override @useResult
$Res call({
 String? id, String? heroTitle1Text, String? heroTitle2Text, String? ownerNameText, String? heroMainImageUrl, String? heroMainImageAlt, String? ctaText, String? ctaLink, bool showFeaturedProjects, String? featuredTitle, int featuredCount, String? illustrationUrl, bool isActive
});




}
/// @nodoc
class __$HomeSettingsCopyWithImpl<$Res>
    implements _$HomeSettingsCopyWith<$Res> {
  __$HomeSettingsCopyWithImpl(this._self, this._then);

  final _HomeSettings _self;
  final $Res Function(_HomeSettings) _then;

/// Create a copy of HomeSettings
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = freezed,Object? heroTitle1Text = freezed,Object? heroTitle2Text = freezed,Object? ownerNameText = freezed,Object? heroMainImageUrl = freezed,Object? heroMainImageAlt = freezed,Object? ctaText = freezed,Object? ctaLink = freezed,Object? showFeaturedProjects = null,Object? featuredTitle = freezed,Object? featuredCount = null,Object? illustrationUrl = freezed,Object? isActive = null,}) {
  return _then(_HomeSettings(
id: freezed == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String?,heroTitle1Text: freezed == heroTitle1Text ? _self.heroTitle1Text : heroTitle1Text // ignore: cast_nullable_to_non_nullable
as String?,heroTitle2Text: freezed == heroTitle2Text ? _self.heroTitle2Text : heroTitle2Text // ignore: cast_nullable_to_non_nullable
as String?,ownerNameText: freezed == ownerNameText ? _self.ownerNameText : ownerNameText // ignore: cast_nullable_to_non_nullable
as String?,heroMainImageUrl: freezed == heroMainImageUrl ? _self.heroMainImageUrl : heroMainImageUrl // ignore: cast_nullable_to_non_nullable
as String?,heroMainImageAlt: freezed == heroMainImageAlt ? _self.heroMainImageAlt : heroMainImageAlt // ignore: cast_nullable_to_non_nullable
as String?,ctaText: freezed == ctaText ? _self.ctaText : ctaText // ignore: cast_nullable_to_non_nullable
as String?,ctaLink: freezed == ctaLink ? _self.ctaLink : ctaLink // ignore: cast_nullable_to_non_nullable
as String?,showFeaturedProjects: null == showFeaturedProjects ? _self.showFeaturedProjects : showFeaturedProjects // ignore: cast_nullable_to_non_nullable
as bool,featuredTitle: freezed == featuredTitle ? _self.featuredTitle : featuredTitle // ignore: cast_nullable_to_non_nullable
as String?,featuredCount: null == featuredCount ? _self.featuredCount : featuredCount // ignore: cast_nullable_to_non_nullable
as int,illustrationUrl: freezed == illustrationUrl ? _self.illustrationUrl : illustrationUrl // ignore: cast_nullable_to_non_nullable
as String?,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}


}


/// @nodoc
mixin _$SocialLink {

 String get id; String get platform; String get url; String? get username; String? get icon; bool get isActive; int get sortOrder; DateTime? get createdAt; DateTime? get updatedAt;
/// Create a copy of SocialLink
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SocialLinkCopyWith<SocialLink> get copyWith => _$SocialLinkCopyWithImpl<SocialLink>(this as SocialLink, _$identity);

  /// Serializes this SocialLink to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SocialLink&&(identical(other.id, id) || other.id == id)&&(identical(other.platform, platform) || other.platform == platform)&&(identical(other.url, url) || other.url == url)&&(identical(other.username, username) || other.username == username)&&(identical(other.icon, icon) || other.icon == icon)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,platform,url,username,icon,isActive,sortOrder,createdAt,updatedAt);

@override
String toString() {
  return 'SocialLink(id: $id, platform: $platform, url: $url, username: $username, icon: $icon, isActive: $isActive, sortOrder: $sortOrder, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $SocialLinkCopyWith<$Res>  {
  factory $SocialLinkCopyWith(SocialLink value, $Res Function(SocialLink) _then) = _$SocialLinkCopyWithImpl;
@useResult
$Res call({
 String id, String platform, String url, String? username, String? icon, bool isActive, int sortOrder, DateTime? createdAt, DateTime? updatedAt
});




}
/// @nodoc
class _$SocialLinkCopyWithImpl<$Res>
    implements $SocialLinkCopyWith<$Res> {
  _$SocialLinkCopyWithImpl(this._self, this._then);

  final SocialLink _self;
  final $Res Function(SocialLink) _then;

/// Create a copy of SocialLink
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? platform = null,Object? url = null,Object? username = freezed,Object? icon = freezed,Object? isActive = null,Object? sortOrder = null,Object? createdAt = freezed,Object? updatedAt = freezed,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,platform: null == platform ? _self.platform : platform // ignore: cast_nullable_to_non_nullable
as String,url: null == url ? _self.url : url // ignore: cast_nullable_to_non_nullable
as String,username: freezed == username ? _self.username : username // ignore: cast_nullable_to_non_nullable
as String?,icon: freezed == icon ? _self.icon : icon // ignore: cast_nullable_to_non_nullable
as String?,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,createdAt: freezed == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime?,updatedAt: freezed == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,
  ));
}

}


/// Adds pattern-matching-related methods to [SocialLink].
extension SocialLinkPatterns on SocialLink {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SocialLink value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SocialLink() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SocialLink value)  $default,){
final _that = this;
switch (_that) {
case _SocialLink():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SocialLink value)?  $default,){
final _that = this;
switch (_that) {
case _SocialLink() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String platform,  String url,  String? username,  String? icon,  bool isActive,  int sortOrder,  DateTime? createdAt,  DateTime? updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SocialLink() when $default != null:
return $default(_that.id,_that.platform,_that.url,_that.username,_that.icon,_that.isActive,_that.sortOrder,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String platform,  String url,  String? username,  String? icon,  bool isActive,  int sortOrder,  DateTime? createdAt,  DateTime? updatedAt)  $default,) {final _that = this;
switch (_that) {
case _SocialLink():
return $default(_that.id,_that.platform,_that.url,_that.username,_that.icon,_that.isActive,_that.sortOrder,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String platform,  String url,  String? username,  String? icon,  bool isActive,  int sortOrder,  DateTime? createdAt,  DateTime? updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _SocialLink() when $default != null:
return $default(_that.id,_that.platform,_that.url,_that.username,_that.icon,_that.isActive,_that.sortOrder,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SocialLink implements SocialLink {
  const _SocialLink({required this.id, required this.platform, required this.url, this.username, this.icon, this.isActive = true, this.sortOrder = 0, this.createdAt, this.updatedAt});
  factory _SocialLink.fromJson(Map<String, dynamic> json) => _$SocialLinkFromJson(json);

@override final  String id;
@override final  String platform;
@override final  String url;
@override final  String? username;
@override final  String? icon;
@override@JsonKey() final  bool isActive;
@override@JsonKey() final  int sortOrder;
@override final  DateTime? createdAt;
@override final  DateTime? updatedAt;

/// Create a copy of SocialLink
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SocialLinkCopyWith<_SocialLink> get copyWith => __$SocialLinkCopyWithImpl<_SocialLink>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SocialLinkToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _SocialLink&&(identical(other.id, id) || other.id == id)&&(identical(other.platform, platform) || other.platform == platform)&&(identical(other.url, url) || other.url == url)&&(identical(other.username, username) || other.username == username)&&(identical(other.icon, icon) || other.icon == icon)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.sortOrder, sortOrder) || other.sortOrder == sortOrder)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,platform,url,username,icon,isActive,sortOrder,createdAt,updatedAt);

@override
String toString() {
  return 'SocialLink(id: $id, platform: $platform, url: $url, username: $username, icon: $icon, isActive: $isActive, sortOrder: $sortOrder, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$SocialLinkCopyWith<$Res> implements $SocialLinkCopyWith<$Res> {
  factory _$SocialLinkCopyWith(_SocialLink value, $Res Function(_SocialLink) _then) = __$SocialLinkCopyWithImpl;
@override @useResult
$Res call({
 String id, String platform, String url, String? username, String? icon, bool isActive, int sortOrder, DateTime? createdAt, DateTime? updatedAt
});




}
/// @nodoc
class __$SocialLinkCopyWithImpl<$Res>
    implements _$SocialLinkCopyWith<$Res> {
  __$SocialLinkCopyWithImpl(this._self, this._then);

  final _SocialLink _self;
  final $Res Function(_SocialLink) _then;

/// Create a copy of SocialLink
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? platform = null,Object? url = null,Object? username = freezed,Object? icon = freezed,Object? isActive = null,Object? sortOrder = null,Object? createdAt = freezed,Object? updatedAt = freezed,}) {
  return _then(_SocialLink(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,platform: null == platform ? _self.platform : platform // ignore: cast_nullable_to_non_nullable
as String,url: null == url ? _self.url : url // ignore: cast_nullable_to_non_nullable
as String,username: freezed == username ? _self.username : username // ignore: cast_nullable_to_non_nullable
as String?,icon: freezed == icon ? _self.icon : icon // ignore: cast_nullable_to_non_nullable
as String?,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,sortOrder: null == sortOrder ? _self.sortOrder : sortOrder // ignore: cast_nullable_to_non_nullable
as int,createdAt: freezed == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime?,updatedAt: freezed == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,
  ));
}


}

// dart format on
