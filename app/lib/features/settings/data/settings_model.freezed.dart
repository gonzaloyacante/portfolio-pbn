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

 String? get id; String? get pageTitle; String? get ownerName; String? get email; String? get phone; String? get whatsapp; String? get location; String? get formTitle; String? get successTitle; String? get successMessage; bool get showSocialLinks; bool get showPhone; bool get showWhatsapp; bool get showEmail; bool get showLocation; bool get isActive;
/// Create a copy of ContactSettings
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ContactSettingsCopyWith<ContactSettings> get copyWith => _$ContactSettingsCopyWithImpl<ContactSettings>(this as ContactSettings, _$identity);

  /// Serializes this ContactSettings to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ContactSettings&&(identical(other.id, id) || other.id == id)&&(identical(other.pageTitle, pageTitle) || other.pageTitle == pageTitle)&&(identical(other.ownerName, ownerName) || other.ownerName == ownerName)&&(identical(other.email, email) || other.email == email)&&(identical(other.phone, phone) || other.phone == phone)&&(identical(other.whatsapp, whatsapp) || other.whatsapp == whatsapp)&&(identical(other.location, location) || other.location == location)&&(identical(other.formTitle, formTitle) || other.formTitle == formTitle)&&(identical(other.successTitle, successTitle) || other.successTitle == successTitle)&&(identical(other.successMessage, successMessage) || other.successMessage == successMessage)&&(identical(other.showSocialLinks, showSocialLinks) || other.showSocialLinks == showSocialLinks)&&(identical(other.showPhone, showPhone) || other.showPhone == showPhone)&&(identical(other.showWhatsapp, showWhatsapp) || other.showWhatsapp == showWhatsapp)&&(identical(other.showEmail, showEmail) || other.showEmail == showEmail)&&(identical(other.showLocation, showLocation) || other.showLocation == showLocation)&&(identical(other.isActive, isActive) || other.isActive == isActive));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,pageTitle,ownerName,email,phone,whatsapp,location,formTitle,successTitle,successMessage,showSocialLinks,showPhone,showWhatsapp,showEmail,showLocation,isActive);

@override
String toString() {
  return 'ContactSettings(id: $id, pageTitle: $pageTitle, ownerName: $ownerName, email: $email, phone: $phone, whatsapp: $whatsapp, location: $location, formTitle: $formTitle, successTitle: $successTitle, successMessage: $successMessage, showSocialLinks: $showSocialLinks, showPhone: $showPhone, showWhatsapp: $showWhatsapp, showEmail: $showEmail, showLocation: $showLocation, isActive: $isActive)';
}


}

/// @nodoc
abstract mixin class $ContactSettingsCopyWith<$Res>  {
  factory $ContactSettingsCopyWith(ContactSettings value, $Res Function(ContactSettings) _then) = _$ContactSettingsCopyWithImpl;
@useResult
$Res call({
 String? id, String? pageTitle, String? ownerName, String? email, String? phone, String? whatsapp, String? location, String? formTitle, String? successTitle, String? successMessage, bool showSocialLinks, bool showPhone, bool showWhatsapp, bool showEmail, bool showLocation, bool isActive
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
@pragma('vm:prefer-inline') @override $Res call({Object? id = freezed,Object? pageTitle = freezed,Object? ownerName = freezed,Object? email = freezed,Object? phone = freezed,Object? whatsapp = freezed,Object? location = freezed,Object? formTitle = freezed,Object? successTitle = freezed,Object? successMessage = freezed,Object? showSocialLinks = null,Object? showPhone = null,Object? showWhatsapp = null,Object? showEmail = null,Object? showLocation = null,Object? isActive = null,}) {
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
as bool,showPhone: null == showPhone ? _self.showPhone : showPhone // ignore: cast_nullable_to_non_nullable
as bool,showWhatsapp: null == showWhatsapp ? _self.showWhatsapp : showWhatsapp // ignore: cast_nullable_to_non_nullable
as bool,showEmail: null == showEmail ? _self.showEmail : showEmail // ignore: cast_nullable_to_non_nullable
as bool,showLocation: null == showLocation ? _self.showLocation : showLocation // ignore: cast_nullable_to_non_nullable
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String? id,  String? pageTitle,  String? ownerName,  String? email,  String? phone,  String? whatsapp,  String? location,  String? formTitle,  String? successTitle,  String? successMessage,  bool showSocialLinks,  bool showPhone,  bool showWhatsapp,  bool showEmail,  bool showLocation,  bool isActive)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ContactSettings() when $default != null:
return $default(_that.id,_that.pageTitle,_that.ownerName,_that.email,_that.phone,_that.whatsapp,_that.location,_that.formTitle,_that.successTitle,_that.successMessage,_that.showSocialLinks,_that.showPhone,_that.showWhatsapp,_that.showEmail,_that.showLocation,_that.isActive);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String? id,  String? pageTitle,  String? ownerName,  String? email,  String? phone,  String? whatsapp,  String? location,  String? formTitle,  String? successTitle,  String? successMessage,  bool showSocialLinks,  bool showPhone,  bool showWhatsapp,  bool showEmail,  bool showLocation,  bool isActive)  $default,) {final _that = this;
switch (_that) {
case _ContactSettings():
return $default(_that.id,_that.pageTitle,_that.ownerName,_that.email,_that.phone,_that.whatsapp,_that.location,_that.formTitle,_that.successTitle,_that.successMessage,_that.showSocialLinks,_that.showPhone,_that.showWhatsapp,_that.showEmail,_that.showLocation,_that.isActive);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String? id,  String? pageTitle,  String? ownerName,  String? email,  String? phone,  String? whatsapp,  String? location,  String? formTitle,  String? successTitle,  String? successMessage,  bool showSocialLinks,  bool showPhone,  bool showWhatsapp,  bool showEmail,  bool showLocation,  bool isActive)?  $default,) {final _that = this;
switch (_that) {
case _ContactSettings() when $default != null:
return $default(_that.id,_that.pageTitle,_that.ownerName,_that.email,_that.phone,_that.whatsapp,_that.location,_that.formTitle,_that.successTitle,_that.successMessage,_that.showSocialLinks,_that.showPhone,_that.showWhatsapp,_that.showEmail,_that.showLocation,_that.isActive);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ContactSettings implements ContactSettings {
  const _ContactSettings({this.id, this.pageTitle, this.ownerName, this.email, this.phone, this.whatsapp, this.location, this.formTitle, this.successTitle, this.successMessage, this.showSocialLinks = true, this.showPhone = true, this.showWhatsapp = true, this.showEmail = true, this.showLocation = true, this.isActive = true});
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
@override@JsonKey() final  bool showPhone;
@override@JsonKey() final  bool showWhatsapp;
@override@JsonKey() final  bool showEmail;
@override@JsonKey() final  bool showLocation;
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
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ContactSettings&&(identical(other.id, id) || other.id == id)&&(identical(other.pageTitle, pageTitle) || other.pageTitle == pageTitle)&&(identical(other.ownerName, ownerName) || other.ownerName == ownerName)&&(identical(other.email, email) || other.email == email)&&(identical(other.phone, phone) || other.phone == phone)&&(identical(other.whatsapp, whatsapp) || other.whatsapp == whatsapp)&&(identical(other.location, location) || other.location == location)&&(identical(other.formTitle, formTitle) || other.formTitle == formTitle)&&(identical(other.successTitle, successTitle) || other.successTitle == successTitle)&&(identical(other.successMessage, successMessage) || other.successMessage == successMessage)&&(identical(other.showSocialLinks, showSocialLinks) || other.showSocialLinks == showSocialLinks)&&(identical(other.showPhone, showPhone) || other.showPhone == showPhone)&&(identical(other.showWhatsapp, showWhatsapp) || other.showWhatsapp == showWhatsapp)&&(identical(other.showEmail, showEmail) || other.showEmail == showEmail)&&(identical(other.showLocation, showLocation) || other.showLocation == showLocation)&&(identical(other.isActive, isActive) || other.isActive == isActive));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,pageTitle,ownerName,email,phone,whatsapp,location,formTitle,successTitle,successMessage,showSocialLinks,showPhone,showWhatsapp,showEmail,showLocation,isActive);

@override
String toString() {
  return 'ContactSettings(id: $id, pageTitle: $pageTitle, ownerName: $ownerName, email: $email, phone: $phone, whatsapp: $whatsapp, location: $location, formTitle: $formTitle, successTitle: $successTitle, successMessage: $successMessage, showSocialLinks: $showSocialLinks, showPhone: $showPhone, showWhatsapp: $showWhatsapp, showEmail: $showEmail, showLocation: $showLocation, isActive: $isActive)';
}


}

/// @nodoc
abstract mixin class _$ContactSettingsCopyWith<$Res> implements $ContactSettingsCopyWith<$Res> {
  factory _$ContactSettingsCopyWith(_ContactSettings value, $Res Function(_ContactSettings) _then) = __$ContactSettingsCopyWithImpl;
@override @useResult
$Res call({
 String? id, String? pageTitle, String? ownerName, String? email, String? phone, String? whatsapp, String? location, String? formTitle, String? successTitle, String? successMessage, bool showSocialLinks, bool showPhone, bool showWhatsapp, bool showEmail, bool showLocation, bool isActive
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
@override @pragma('vm:prefer-inline') $Res call({Object? id = freezed,Object? pageTitle = freezed,Object? ownerName = freezed,Object? email = freezed,Object? phone = freezed,Object? whatsapp = freezed,Object? location = freezed,Object? formTitle = freezed,Object? successTitle = freezed,Object? successMessage = freezed,Object? showSocialLinks = null,Object? showPhone = null,Object? showWhatsapp = null,Object? showEmail = null,Object? showLocation = null,Object? isActive = null,}) {
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
as bool,showPhone: null == showPhone ? _self.showPhone : showPhone // ignore: cast_nullable_to_non_nullable
as bool,showWhatsapp: null == showWhatsapp ? _self.showWhatsapp : showWhatsapp // ignore: cast_nullable_to_non_nullable
as bool,showEmail: null == showEmail ? _self.showEmail : showEmail // ignore: cast_nullable_to_non_nullable
as bool,showLocation: null == showLocation ? _self.showLocation : showLocation // ignore: cast_nullable_to_non_nullable
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

 String? get id;// ── Título 1 ──
 String? get heroTitle1Text; String? get heroTitle1Font; String? get heroTitle1FontUrl; int? get heroTitle1FontSize; String? get heroTitle1Color; String? get heroTitle1ColorDark; int? get heroTitle1ZIndex; int? get heroTitle1OffsetX; int? get heroTitle1OffsetY;// ── Título 2 ──
 String? get heroTitle2Text; String? get heroTitle2Font; String? get heroTitle2FontUrl; int? get heroTitle2FontSize; String? get heroTitle2Color; String? get heroTitle2ColorDark; int? get heroTitle2ZIndex; int? get heroTitle2OffsetX; int? get heroTitle2OffsetY;// ── Nombre propietario ──
 String? get ownerNameText; String? get ownerNameFont; String? get ownerNameFontUrl; int? get ownerNameFontSize; String? get ownerNameColor; String? get ownerNameColorDark; int? get ownerNameZIndex; int? get ownerNameOffsetX; int? get ownerNameOffsetY;// ── Imagen principal ──
 String? get heroMainImageUrl; String? get heroMainImageAlt; String? get heroMainImageCaption; String? get heroImageStyle; int? get heroMainImageZIndex; int? get heroMainImageOffsetX; int? get heroMainImageOffsetY;// ── Ilustración ──
 String? get illustrationUrl; String? get illustrationAlt; int? get illustrationZIndex; int? get illustrationOpacity; int? get illustrationSize; int? get illustrationOffsetX; int? get illustrationOffsetY; int? get illustrationRotation;// ── Botón CTA ──
 String? get ctaText; String? get ctaLink; String? get ctaFont; String? get ctaFontUrl; int? get ctaFontSize; String? get ctaVariant; String? get ctaSize; int? get ctaOffsetX; int? get ctaOffsetY;// ── Mobile Overrides ──
 int? get heroTitle1MobileOffsetX; int? get heroTitle1MobileOffsetY; int? get heroTitle1MobileFontSize; int? get heroTitle2MobileOffsetX; int? get heroTitle2MobileOffsetY; int? get heroTitle2MobileFontSize; int? get ownerNameMobileOffsetX; int? get ownerNameMobileOffsetY; int? get ownerNameMobileFontSize; int? get heroMainImageMobileOffsetX; int? get heroMainImageMobileOffsetY; int? get illustrationMobileOffsetX; int? get illustrationMobileOffsetY; int? get illustrationMobileSize; int? get illustrationMobileRotation; int? get ctaMobileOffsetX; int? get ctaMobileOffsetY; int? get ctaMobileFontSize;// ── Proyectos destacados ──
 bool get showFeaturedProjects; String? get featuredTitle; String? get featuredTitleFont; String? get featuredTitleFontUrl; int? get featuredTitleFontSize; String? get featuredTitleColor; String? get featuredTitleColorDark; int get featuredCount;// ── Meta ──
 bool get isActive;
/// Create a copy of HomeSettings
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$HomeSettingsCopyWith<HomeSettings> get copyWith => _$HomeSettingsCopyWithImpl<HomeSettings>(this as HomeSettings, _$identity);

  /// Serializes this HomeSettings to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is HomeSettings&&(identical(other.id, id) || other.id == id)&&(identical(other.heroTitle1Text, heroTitle1Text) || other.heroTitle1Text == heroTitle1Text)&&(identical(other.heroTitle1Font, heroTitle1Font) || other.heroTitle1Font == heroTitle1Font)&&(identical(other.heroTitle1FontUrl, heroTitle1FontUrl) || other.heroTitle1FontUrl == heroTitle1FontUrl)&&(identical(other.heroTitle1FontSize, heroTitle1FontSize) || other.heroTitle1FontSize == heroTitle1FontSize)&&(identical(other.heroTitle1Color, heroTitle1Color) || other.heroTitle1Color == heroTitle1Color)&&(identical(other.heroTitle1ColorDark, heroTitle1ColorDark) || other.heroTitle1ColorDark == heroTitle1ColorDark)&&(identical(other.heroTitle1ZIndex, heroTitle1ZIndex) || other.heroTitle1ZIndex == heroTitle1ZIndex)&&(identical(other.heroTitle1OffsetX, heroTitle1OffsetX) || other.heroTitle1OffsetX == heroTitle1OffsetX)&&(identical(other.heroTitle1OffsetY, heroTitle1OffsetY) || other.heroTitle1OffsetY == heroTitle1OffsetY)&&(identical(other.heroTitle2Text, heroTitle2Text) || other.heroTitle2Text == heroTitle2Text)&&(identical(other.heroTitle2Font, heroTitle2Font) || other.heroTitle2Font == heroTitle2Font)&&(identical(other.heroTitle2FontUrl, heroTitle2FontUrl) || other.heroTitle2FontUrl == heroTitle2FontUrl)&&(identical(other.heroTitle2FontSize, heroTitle2FontSize) || other.heroTitle2FontSize == heroTitle2FontSize)&&(identical(other.heroTitle2Color, heroTitle2Color) || other.heroTitle2Color == heroTitle2Color)&&(identical(other.heroTitle2ColorDark, heroTitle2ColorDark) || other.heroTitle2ColorDark == heroTitle2ColorDark)&&(identical(other.heroTitle2ZIndex, heroTitle2ZIndex) || other.heroTitle2ZIndex == heroTitle2ZIndex)&&(identical(other.heroTitle2OffsetX, heroTitle2OffsetX) || other.heroTitle2OffsetX == heroTitle2OffsetX)&&(identical(other.heroTitle2OffsetY, heroTitle2OffsetY) || other.heroTitle2OffsetY == heroTitle2OffsetY)&&(identical(other.ownerNameText, ownerNameText) || other.ownerNameText == ownerNameText)&&(identical(other.ownerNameFont, ownerNameFont) || other.ownerNameFont == ownerNameFont)&&(identical(other.ownerNameFontUrl, ownerNameFontUrl) || other.ownerNameFontUrl == ownerNameFontUrl)&&(identical(other.ownerNameFontSize, ownerNameFontSize) || other.ownerNameFontSize == ownerNameFontSize)&&(identical(other.ownerNameColor, ownerNameColor) || other.ownerNameColor == ownerNameColor)&&(identical(other.ownerNameColorDark, ownerNameColorDark) || other.ownerNameColorDark == ownerNameColorDark)&&(identical(other.ownerNameZIndex, ownerNameZIndex) || other.ownerNameZIndex == ownerNameZIndex)&&(identical(other.ownerNameOffsetX, ownerNameOffsetX) || other.ownerNameOffsetX == ownerNameOffsetX)&&(identical(other.ownerNameOffsetY, ownerNameOffsetY) || other.ownerNameOffsetY == ownerNameOffsetY)&&(identical(other.heroMainImageUrl, heroMainImageUrl) || other.heroMainImageUrl == heroMainImageUrl)&&(identical(other.heroMainImageAlt, heroMainImageAlt) || other.heroMainImageAlt == heroMainImageAlt)&&(identical(other.heroMainImageCaption, heroMainImageCaption) || other.heroMainImageCaption == heroMainImageCaption)&&(identical(other.heroImageStyle, heroImageStyle) || other.heroImageStyle == heroImageStyle)&&(identical(other.heroMainImageZIndex, heroMainImageZIndex) || other.heroMainImageZIndex == heroMainImageZIndex)&&(identical(other.heroMainImageOffsetX, heroMainImageOffsetX) || other.heroMainImageOffsetX == heroMainImageOffsetX)&&(identical(other.heroMainImageOffsetY, heroMainImageOffsetY) || other.heroMainImageOffsetY == heroMainImageOffsetY)&&(identical(other.illustrationUrl, illustrationUrl) || other.illustrationUrl == illustrationUrl)&&(identical(other.illustrationAlt, illustrationAlt) || other.illustrationAlt == illustrationAlt)&&(identical(other.illustrationZIndex, illustrationZIndex) || other.illustrationZIndex == illustrationZIndex)&&(identical(other.illustrationOpacity, illustrationOpacity) || other.illustrationOpacity == illustrationOpacity)&&(identical(other.illustrationSize, illustrationSize) || other.illustrationSize == illustrationSize)&&(identical(other.illustrationOffsetX, illustrationOffsetX) || other.illustrationOffsetX == illustrationOffsetX)&&(identical(other.illustrationOffsetY, illustrationOffsetY) || other.illustrationOffsetY == illustrationOffsetY)&&(identical(other.illustrationRotation, illustrationRotation) || other.illustrationRotation == illustrationRotation)&&(identical(other.ctaText, ctaText) || other.ctaText == ctaText)&&(identical(other.ctaLink, ctaLink) || other.ctaLink == ctaLink)&&(identical(other.ctaFont, ctaFont) || other.ctaFont == ctaFont)&&(identical(other.ctaFontUrl, ctaFontUrl) || other.ctaFontUrl == ctaFontUrl)&&(identical(other.ctaFontSize, ctaFontSize) || other.ctaFontSize == ctaFontSize)&&(identical(other.ctaVariant, ctaVariant) || other.ctaVariant == ctaVariant)&&(identical(other.ctaSize, ctaSize) || other.ctaSize == ctaSize)&&(identical(other.ctaOffsetX, ctaOffsetX) || other.ctaOffsetX == ctaOffsetX)&&(identical(other.ctaOffsetY, ctaOffsetY) || other.ctaOffsetY == ctaOffsetY)&&(identical(other.heroTitle1MobileOffsetX, heroTitle1MobileOffsetX) || other.heroTitle1MobileOffsetX == heroTitle1MobileOffsetX)&&(identical(other.heroTitle1MobileOffsetY, heroTitle1MobileOffsetY) || other.heroTitle1MobileOffsetY == heroTitle1MobileOffsetY)&&(identical(other.heroTitle1MobileFontSize, heroTitle1MobileFontSize) || other.heroTitle1MobileFontSize == heroTitle1MobileFontSize)&&(identical(other.heroTitle2MobileOffsetX, heroTitle2MobileOffsetX) || other.heroTitle2MobileOffsetX == heroTitle2MobileOffsetX)&&(identical(other.heroTitle2MobileOffsetY, heroTitle2MobileOffsetY) || other.heroTitle2MobileOffsetY == heroTitle2MobileOffsetY)&&(identical(other.heroTitle2MobileFontSize, heroTitle2MobileFontSize) || other.heroTitle2MobileFontSize == heroTitle2MobileFontSize)&&(identical(other.ownerNameMobileOffsetX, ownerNameMobileOffsetX) || other.ownerNameMobileOffsetX == ownerNameMobileOffsetX)&&(identical(other.ownerNameMobileOffsetY, ownerNameMobileOffsetY) || other.ownerNameMobileOffsetY == ownerNameMobileOffsetY)&&(identical(other.ownerNameMobileFontSize, ownerNameMobileFontSize) || other.ownerNameMobileFontSize == ownerNameMobileFontSize)&&(identical(other.heroMainImageMobileOffsetX, heroMainImageMobileOffsetX) || other.heroMainImageMobileOffsetX == heroMainImageMobileOffsetX)&&(identical(other.heroMainImageMobileOffsetY, heroMainImageMobileOffsetY) || other.heroMainImageMobileOffsetY == heroMainImageMobileOffsetY)&&(identical(other.illustrationMobileOffsetX, illustrationMobileOffsetX) || other.illustrationMobileOffsetX == illustrationMobileOffsetX)&&(identical(other.illustrationMobileOffsetY, illustrationMobileOffsetY) || other.illustrationMobileOffsetY == illustrationMobileOffsetY)&&(identical(other.illustrationMobileSize, illustrationMobileSize) || other.illustrationMobileSize == illustrationMobileSize)&&(identical(other.illustrationMobileRotation, illustrationMobileRotation) || other.illustrationMobileRotation == illustrationMobileRotation)&&(identical(other.ctaMobileOffsetX, ctaMobileOffsetX) || other.ctaMobileOffsetX == ctaMobileOffsetX)&&(identical(other.ctaMobileOffsetY, ctaMobileOffsetY) || other.ctaMobileOffsetY == ctaMobileOffsetY)&&(identical(other.ctaMobileFontSize, ctaMobileFontSize) || other.ctaMobileFontSize == ctaMobileFontSize)&&(identical(other.showFeaturedProjects, showFeaturedProjects) || other.showFeaturedProjects == showFeaturedProjects)&&(identical(other.featuredTitle, featuredTitle) || other.featuredTitle == featuredTitle)&&(identical(other.featuredTitleFont, featuredTitleFont) || other.featuredTitleFont == featuredTitleFont)&&(identical(other.featuredTitleFontUrl, featuredTitleFontUrl) || other.featuredTitleFontUrl == featuredTitleFontUrl)&&(identical(other.featuredTitleFontSize, featuredTitleFontSize) || other.featuredTitleFontSize == featuredTitleFontSize)&&(identical(other.featuredTitleColor, featuredTitleColor) || other.featuredTitleColor == featuredTitleColor)&&(identical(other.featuredTitleColorDark, featuredTitleColorDark) || other.featuredTitleColorDark == featuredTitleColorDark)&&(identical(other.featuredCount, featuredCount) || other.featuredCount == featuredCount)&&(identical(other.isActive, isActive) || other.isActive == isActive));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hashAll([runtimeType,id,heroTitle1Text,heroTitle1Font,heroTitle1FontUrl,heroTitle1FontSize,heroTitle1Color,heroTitle1ColorDark,heroTitle1ZIndex,heroTitle1OffsetX,heroTitle1OffsetY,heroTitle2Text,heroTitle2Font,heroTitle2FontUrl,heroTitle2FontSize,heroTitle2Color,heroTitle2ColorDark,heroTitle2ZIndex,heroTitle2OffsetX,heroTitle2OffsetY,ownerNameText,ownerNameFont,ownerNameFontUrl,ownerNameFontSize,ownerNameColor,ownerNameColorDark,ownerNameZIndex,ownerNameOffsetX,ownerNameOffsetY,heroMainImageUrl,heroMainImageAlt,heroMainImageCaption,heroImageStyle,heroMainImageZIndex,heroMainImageOffsetX,heroMainImageOffsetY,illustrationUrl,illustrationAlt,illustrationZIndex,illustrationOpacity,illustrationSize,illustrationOffsetX,illustrationOffsetY,illustrationRotation,ctaText,ctaLink,ctaFont,ctaFontUrl,ctaFontSize,ctaVariant,ctaSize,ctaOffsetX,ctaOffsetY,heroTitle1MobileOffsetX,heroTitle1MobileOffsetY,heroTitle1MobileFontSize,heroTitle2MobileOffsetX,heroTitle2MobileOffsetY,heroTitle2MobileFontSize,ownerNameMobileOffsetX,ownerNameMobileOffsetY,ownerNameMobileFontSize,heroMainImageMobileOffsetX,heroMainImageMobileOffsetY,illustrationMobileOffsetX,illustrationMobileOffsetY,illustrationMobileSize,illustrationMobileRotation,ctaMobileOffsetX,ctaMobileOffsetY,ctaMobileFontSize,showFeaturedProjects,featuredTitle,featuredTitleFont,featuredTitleFontUrl,featuredTitleFontSize,featuredTitleColor,featuredTitleColorDark,featuredCount,isActive]);

@override
String toString() {
  return 'HomeSettings(id: $id, heroTitle1Text: $heroTitle1Text, heroTitle1Font: $heroTitle1Font, heroTitle1FontUrl: $heroTitle1FontUrl, heroTitle1FontSize: $heroTitle1FontSize, heroTitle1Color: $heroTitle1Color, heroTitle1ColorDark: $heroTitle1ColorDark, heroTitle1ZIndex: $heroTitle1ZIndex, heroTitle1OffsetX: $heroTitle1OffsetX, heroTitle1OffsetY: $heroTitle1OffsetY, heroTitle2Text: $heroTitle2Text, heroTitle2Font: $heroTitle2Font, heroTitle2FontUrl: $heroTitle2FontUrl, heroTitle2FontSize: $heroTitle2FontSize, heroTitle2Color: $heroTitle2Color, heroTitle2ColorDark: $heroTitle2ColorDark, heroTitle2ZIndex: $heroTitle2ZIndex, heroTitle2OffsetX: $heroTitle2OffsetX, heroTitle2OffsetY: $heroTitle2OffsetY, ownerNameText: $ownerNameText, ownerNameFont: $ownerNameFont, ownerNameFontUrl: $ownerNameFontUrl, ownerNameFontSize: $ownerNameFontSize, ownerNameColor: $ownerNameColor, ownerNameColorDark: $ownerNameColorDark, ownerNameZIndex: $ownerNameZIndex, ownerNameOffsetX: $ownerNameOffsetX, ownerNameOffsetY: $ownerNameOffsetY, heroMainImageUrl: $heroMainImageUrl, heroMainImageAlt: $heroMainImageAlt, heroMainImageCaption: $heroMainImageCaption, heroImageStyle: $heroImageStyle, heroMainImageZIndex: $heroMainImageZIndex, heroMainImageOffsetX: $heroMainImageOffsetX, heroMainImageOffsetY: $heroMainImageOffsetY, illustrationUrl: $illustrationUrl, illustrationAlt: $illustrationAlt, illustrationZIndex: $illustrationZIndex, illustrationOpacity: $illustrationOpacity, illustrationSize: $illustrationSize, illustrationOffsetX: $illustrationOffsetX, illustrationOffsetY: $illustrationOffsetY, illustrationRotation: $illustrationRotation, ctaText: $ctaText, ctaLink: $ctaLink, ctaFont: $ctaFont, ctaFontUrl: $ctaFontUrl, ctaFontSize: $ctaFontSize, ctaVariant: $ctaVariant, ctaSize: $ctaSize, ctaOffsetX: $ctaOffsetX, ctaOffsetY: $ctaOffsetY, heroTitle1MobileOffsetX: $heroTitle1MobileOffsetX, heroTitle1MobileOffsetY: $heroTitle1MobileOffsetY, heroTitle1MobileFontSize: $heroTitle1MobileFontSize, heroTitle2MobileOffsetX: $heroTitle2MobileOffsetX, heroTitle2MobileOffsetY: $heroTitle2MobileOffsetY, heroTitle2MobileFontSize: $heroTitle2MobileFontSize, ownerNameMobileOffsetX: $ownerNameMobileOffsetX, ownerNameMobileOffsetY: $ownerNameMobileOffsetY, ownerNameMobileFontSize: $ownerNameMobileFontSize, heroMainImageMobileOffsetX: $heroMainImageMobileOffsetX, heroMainImageMobileOffsetY: $heroMainImageMobileOffsetY, illustrationMobileOffsetX: $illustrationMobileOffsetX, illustrationMobileOffsetY: $illustrationMobileOffsetY, illustrationMobileSize: $illustrationMobileSize, illustrationMobileRotation: $illustrationMobileRotation, ctaMobileOffsetX: $ctaMobileOffsetX, ctaMobileOffsetY: $ctaMobileOffsetY, ctaMobileFontSize: $ctaMobileFontSize, showFeaturedProjects: $showFeaturedProjects, featuredTitle: $featuredTitle, featuredTitleFont: $featuredTitleFont, featuredTitleFontUrl: $featuredTitleFontUrl, featuredTitleFontSize: $featuredTitleFontSize, featuredTitleColor: $featuredTitleColor, featuredTitleColorDark: $featuredTitleColorDark, featuredCount: $featuredCount, isActive: $isActive)';
}


}

/// @nodoc
abstract mixin class $HomeSettingsCopyWith<$Res>  {
  factory $HomeSettingsCopyWith(HomeSettings value, $Res Function(HomeSettings) _then) = _$HomeSettingsCopyWithImpl;
@useResult
$Res call({
 String? id, String? heroTitle1Text, String? heroTitle1Font, String? heroTitle1FontUrl, int? heroTitle1FontSize, String? heroTitle1Color, String? heroTitle1ColorDark, int? heroTitle1ZIndex, int? heroTitle1OffsetX, int? heroTitle1OffsetY, String? heroTitle2Text, String? heroTitle2Font, String? heroTitle2FontUrl, int? heroTitle2FontSize, String? heroTitle2Color, String? heroTitle2ColorDark, int? heroTitle2ZIndex, int? heroTitle2OffsetX, int? heroTitle2OffsetY, String? ownerNameText, String? ownerNameFont, String? ownerNameFontUrl, int? ownerNameFontSize, String? ownerNameColor, String? ownerNameColorDark, int? ownerNameZIndex, int? ownerNameOffsetX, int? ownerNameOffsetY, String? heroMainImageUrl, String? heroMainImageAlt, String? heroMainImageCaption, String? heroImageStyle, int? heroMainImageZIndex, int? heroMainImageOffsetX, int? heroMainImageOffsetY, String? illustrationUrl, String? illustrationAlt, int? illustrationZIndex, int? illustrationOpacity, int? illustrationSize, int? illustrationOffsetX, int? illustrationOffsetY, int? illustrationRotation, String? ctaText, String? ctaLink, String? ctaFont, String? ctaFontUrl, int? ctaFontSize, String? ctaVariant, String? ctaSize, int? ctaOffsetX, int? ctaOffsetY, int? heroTitle1MobileOffsetX, int? heroTitle1MobileOffsetY, int? heroTitle1MobileFontSize, int? heroTitle2MobileOffsetX, int? heroTitle2MobileOffsetY, int? heroTitle2MobileFontSize, int? ownerNameMobileOffsetX, int? ownerNameMobileOffsetY, int? ownerNameMobileFontSize, int? heroMainImageMobileOffsetX, int? heroMainImageMobileOffsetY, int? illustrationMobileOffsetX, int? illustrationMobileOffsetY, int? illustrationMobileSize, int? illustrationMobileRotation, int? ctaMobileOffsetX, int? ctaMobileOffsetY, int? ctaMobileFontSize, bool showFeaturedProjects, String? featuredTitle, String? featuredTitleFont, String? featuredTitleFontUrl, int? featuredTitleFontSize, String? featuredTitleColor, String? featuredTitleColorDark, int featuredCount, bool isActive
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
@pragma('vm:prefer-inline') @override $Res call({Object? id = freezed,Object? heroTitle1Text = freezed,Object? heroTitle1Font = freezed,Object? heroTitle1FontUrl = freezed,Object? heroTitle1FontSize = freezed,Object? heroTitle1Color = freezed,Object? heroTitle1ColorDark = freezed,Object? heroTitle1ZIndex = freezed,Object? heroTitle1OffsetX = freezed,Object? heroTitle1OffsetY = freezed,Object? heroTitle2Text = freezed,Object? heroTitle2Font = freezed,Object? heroTitle2FontUrl = freezed,Object? heroTitle2FontSize = freezed,Object? heroTitle2Color = freezed,Object? heroTitle2ColorDark = freezed,Object? heroTitle2ZIndex = freezed,Object? heroTitle2OffsetX = freezed,Object? heroTitle2OffsetY = freezed,Object? ownerNameText = freezed,Object? ownerNameFont = freezed,Object? ownerNameFontUrl = freezed,Object? ownerNameFontSize = freezed,Object? ownerNameColor = freezed,Object? ownerNameColorDark = freezed,Object? ownerNameZIndex = freezed,Object? ownerNameOffsetX = freezed,Object? ownerNameOffsetY = freezed,Object? heroMainImageUrl = freezed,Object? heroMainImageAlt = freezed,Object? heroMainImageCaption = freezed,Object? heroImageStyle = freezed,Object? heroMainImageZIndex = freezed,Object? heroMainImageOffsetX = freezed,Object? heroMainImageOffsetY = freezed,Object? illustrationUrl = freezed,Object? illustrationAlt = freezed,Object? illustrationZIndex = freezed,Object? illustrationOpacity = freezed,Object? illustrationSize = freezed,Object? illustrationOffsetX = freezed,Object? illustrationOffsetY = freezed,Object? illustrationRotation = freezed,Object? ctaText = freezed,Object? ctaLink = freezed,Object? ctaFont = freezed,Object? ctaFontUrl = freezed,Object? ctaFontSize = freezed,Object? ctaVariant = freezed,Object? ctaSize = freezed,Object? ctaOffsetX = freezed,Object? ctaOffsetY = freezed,Object? heroTitle1MobileOffsetX = freezed,Object? heroTitle1MobileOffsetY = freezed,Object? heroTitle1MobileFontSize = freezed,Object? heroTitle2MobileOffsetX = freezed,Object? heroTitle2MobileOffsetY = freezed,Object? heroTitle2MobileFontSize = freezed,Object? ownerNameMobileOffsetX = freezed,Object? ownerNameMobileOffsetY = freezed,Object? ownerNameMobileFontSize = freezed,Object? heroMainImageMobileOffsetX = freezed,Object? heroMainImageMobileOffsetY = freezed,Object? illustrationMobileOffsetX = freezed,Object? illustrationMobileOffsetY = freezed,Object? illustrationMobileSize = freezed,Object? illustrationMobileRotation = freezed,Object? ctaMobileOffsetX = freezed,Object? ctaMobileOffsetY = freezed,Object? ctaMobileFontSize = freezed,Object? showFeaturedProjects = null,Object? featuredTitle = freezed,Object? featuredTitleFont = freezed,Object? featuredTitleFontUrl = freezed,Object? featuredTitleFontSize = freezed,Object? featuredTitleColor = freezed,Object? featuredTitleColorDark = freezed,Object? featuredCount = null,Object? isActive = null,}) {
  return _then(_self.copyWith(
id: freezed == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String?,heroTitle1Text: freezed == heroTitle1Text ? _self.heroTitle1Text : heroTitle1Text // ignore: cast_nullable_to_non_nullable
as String?,heroTitle1Font: freezed == heroTitle1Font ? _self.heroTitle1Font : heroTitle1Font // ignore: cast_nullable_to_non_nullable
as String?,heroTitle1FontUrl: freezed == heroTitle1FontUrl ? _self.heroTitle1FontUrl : heroTitle1FontUrl // ignore: cast_nullable_to_non_nullable
as String?,heroTitle1FontSize: freezed == heroTitle1FontSize ? _self.heroTitle1FontSize : heroTitle1FontSize // ignore: cast_nullable_to_non_nullable
as int?,heroTitle1Color: freezed == heroTitle1Color ? _self.heroTitle1Color : heroTitle1Color // ignore: cast_nullable_to_non_nullable
as String?,heroTitle1ColorDark: freezed == heroTitle1ColorDark ? _self.heroTitle1ColorDark : heroTitle1ColorDark // ignore: cast_nullable_to_non_nullable
as String?,heroTitle1ZIndex: freezed == heroTitle1ZIndex ? _self.heroTitle1ZIndex : heroTitle1ZIndex // ignore: cast_nullable_to_non_nullable
as int?,heroTitle1OffsetX: freezed == heroTitle1OffsetX ? _self.heroTitle1OffsetX : heroTitle1OffsetX // ignore: cast_nullable_to_non_nullable
as int?,heroTitle1OffsetY: freezed == heroTitle1OffsetY ? _self.heroTitle1OffsetY : heroTitle1OffsetY // ignore: cast_nullable_to_non_nullable
as int?,heroTitle2Text: freezed == heroTitle2Text ? _self.heroTitle2Text : heroTitle2Text // ignore: cast_nullable_to_non_nullable
as String?,heroTitle2Font: freezed == heroTitle2Font ? _self.heroTitle2Font : heroTitle2Font // ignore: cast_nullable_to_non_nullable
as String?,heroTitle2FontUrl: freezed == heroTitle2FontUrl ? _self.heroTitle2FontUrl : heroTitle2FontUrl // ignore: cast_nullable_to_non_nullable
as String?,heroTitle2FontSize: freezed == heroTitle2FontSize ? _self.heroTitle2FontSize : heroTitle2FontSize // ignore: cast_nullable_to_non_nullable
as int?,heroTitle2Color: freezed == heroTitle2Color ? _self.heroTitle2Color : heroTitle2Color // ignore: cast_nullable_to_non_nullable
as String?,heroTitle2ColorDark: freezed == heroTitle2ColorDark ? _self.heroTitle2ColorDark : heroTitle2ColorDark // ignore: cast_nullable_to_non_nullable
as String?,heroTitle2ZIndex: freezed == heroTitle2ZIndex ? _self.heroTitle2ZIndex : heroTitle2ZIndex // ignore: cast_nullable_to_non_nullable
as int?,heroTitle2OffsetX: freezed == heroTitle2OffsetX ? _self.heroTitle2OffsetX : heroTitle2OffsetX // ignore: cast_nullable_to_non_nullable
as int?,heroTitle2OffsetY: freezed == heroTitle2OffsetY ? _self.heroTitle2OffsetY : heroTitle2OffsetY // ignore: cast_nullable_to_non_nullable
as int?,ownerNameText: freezed == ownerNameText ? _self.ownerNameText : ownerNameText // ignore: cast_nullable_to_non_nullable
as String?,ownerNameFont: freezed == ownerNameFont ? _self.ownerNameFont : ownerNameFont // ignore: cast_nullable_to_non_nullable
as String?,ownerNameFontUrl: freezed == ownerNameFontUrl ? _self.ownerNameFontUrl : ownerNameFontUrl // ignore: cast_nullable_to_non_nullable
as String?,ownerNameFontSize: freezed == ownerNameFontSize ? _self.ownerNameFontSize : ownerNameFontSize // ignore: cast_nullable_to_non_nullable
as int?,ownerNameColor: freezed == ownerNameColor ? _self.ownerNameColor : ownerNameColor // ignore: cast_nullable_to_non_nullable
as String?,ownerNameColorDark: freezed == ownerNameColorDark ? _self.ownerNameColorDark : ownerNameColorDark // ignore: cast_nullable_to_non_nullable
as String?,ownerNameZIndex: freezed == ownerNameZIndex ? _self.ownerNameZIndex : ownerNameZIndex // ignore: cast_nullable_to_non_nullable
as int?,ownerNameOffsetX: freezed == ownerNameOffsetX ? _self.ownerNameOffsetX : ownerNameOffsetX // ignore: cast_nullable_to_non_nullable
as int?,ownerNameOffsetY: freezed == ownerNameOffsetY ? _self.ownerNameOffsetY : ownerNameOffsetY // ignore: cast_nullable_to_non_nullable
as int?,heroMainImageUrl: freezed == heroMainImageUrl ? _self.heroMainImageUrl : heroMainImageUrl // ignore: cast_nullable_to_non_nullable
as String?,heroMainImageAlt: freezed == heroMainImageAlt ? _self.heroMainImageAlt : heroMainImageAlt // ignore: cast_nullable_to_non_nullable
as String?,heroMainImageCaption: freezed == heroMainImageCaption ? _self.heroMainImageCaption : heroMainImageCaption // ignore: cast_nullable_to_non_nullable
as String?,heroImageStyle: freezed == heroImageStyle ? _self.heroImageStyle : heroImageStyle // ignore: cast_nullable_to_non_nullable
as String?,heroMainImageZIndex: freezed == heroMainImageZIndex ? _self.heroMainImageZIndex : heroMainImageZIndex // ignore: cast_nullable_to_non_nullable
as int?,heroMainImageOffsetX: freezed == heroMainImageOffsetX ? _self.heroMainImageOffsetX : heroMainImageOffsetX // ignore: cast_nullable_to_non_nullable
as int?,heroMainImageOffsetY: freezed == heroMainImageOffsetY ? _self.heroMainImageOffsetY : heroMainImageOffsetY // ignore: cast_nullable_to_non_nullable
as int?,illustrationUrl: freezed == illustrationUrl ? _self.illustrationUrl : illustrationUrl // ignore: cast_nullable_to_non_nullable
as String?,illustrationAlt: freezed == illustrationAlt ? _self.illustrationAlt : illustrationAlt // ignore: cast_nullable_to_non_nullable
as String?,illustrationZIndex: freezed == illustrationZIndex ? _self.illustrationZIndex : illustrationZIndex // ignore: cast_nullable_to_non_nullable
as int?,illustrationOpacity: freezed == illustrationOpacity ? _self.illustrationOpacity : illustrationOpacity // ignore: cast_nullable_to_non_nullable
as int?,illustrationSize: freezed == illustrationSize ? _self.illustrationSize : illustrationSize // ignore: cast_nullable_to_non_nullable
as int?,illustrationOffsetX: freezed == illustrationOffsetX ? _self.illustrationOffsetX : illustrationOffsetX // ignore: cast_nullable_to_non_nullable
as int?,illustrationOffsetY: freezed == illustrationOffsetY ? _self.illustrationOffsetY : illustrationOffsetY // ignore: cast_nullable_to_non_nullable
as int?,illustrationRotation: freezed == illustrationRotation ? _self.illustrationRotation : illustrationRotation // ignore: cast_nullable_to_non_nullable
as int?,ctaText: freezed == ctaText ? _self.ctaText : ctaText // ignore: cast_nullable_to_non_nullable
as String?,ctaLink: freezed == ctaLink ? _self.ctaLink : ctaLink // ignore: cast_nullable_to_non_nullable
as String?,ctaFont: freezed == ctaFont ? _self.ctaFont : ctaFont // ignore: cast_nullable_to_non_nullable
as String?,ctaFontUrl: freezed == ctaFontUrl ? _self.ctaFontUrl : ctaFontUrl // ignore: cast_nullable_to_non_nullable
as String?,ctaFontSize: freezed == ctaFontSize ? _self.ctaFontSize : ctaFontSize // ignore: cast_nullable_to_non_nullable
as int?,ctaVariant: freezed == ctaVariant ? _self.ctaVariant : ctaVariant // ignore: cast_nullable_to_non_nullable
as String?,ctaSize: freezed == ctaSize ? _self.ctaSize : ctaSize // ignore: cast_nullable_to_non_nullable
as String?,ctaOffsetX: freezed == ctaOffsetX ? _self.ctaOffsetX : ctaOffsetX // ignore: cast_nullable_to_non_nullable
as int?,ctaOffsetY: freezed == ctaOffsetY ? _self.ctaOffsetY : ctaOffsetY // ignore: cast_nullable_to_non_nullable
as int?,heroTitle1MobileOffsetX: freezed == heroTitle1MobileOffsetX ? _self.heroTitle1MobileOffsetX : heroTitle1MobileOffsetX // ignore: cast_nullable_to_non_nullable
as int?,heroTitle1MobileOffsetY: freezed == heroTitle1MobileOffsetY ? _self.heroTitle1MobileOffsetY : heroTitle1MobileOffsetY // ignore: cast_nullable_to_non_nullable
as int?,heroTitle1MobileFontSize: freezed == heroTitle1MobileFontSize ? _self.heroTitle1MobileFontSize : heroTitle1MobileFontSize // ignore: cast_nullable_to_non_nullable
as int?,heroTitle2MobileOffsetX: freezed == heroTitle2MobileOffsetX ? _self.heroTitle2MobileOffsetX : heroTitle2MobileOffsetX // ignore: cast_nullable_to_non_nullable
as int?,heroTitle2MobileOffsetY: freezed == heroTitle2MobileOffsetY ? _self.heroTitle2MobileOffsetY : heroTitle2MobileOffsetY // ignore: cast_nullable_to_non_nullable
as int?,heroTitle2MobileFontSize: freezed == heroTitle2MobileFontSize ? _self.heroTitle2MobileFontSize : heroTitle2MobileFontSize // ignore: cast_nullable_to_non_nullable
as int?,ownerNameMobileOffsetX: freezed == ownerNameMobileOffsetX ? _self.ownerNameMobileOffsetX : ownerNameMobileOffsetX // ignore: cast_nullable_to_non_nullable
as int?,ownerNameMobileOffsetY: freezed == ownerNameMobileOffsetY ? _self.ownerNameMobileOffsetY : ownerNameMobileOffsetY // ignore: cast_nullable_to_non_nullable
as int?,ownerNameMobileFontSize: freezed == ownerNameMobileFontSize ? _self.ownerNameMobileFontSize : ownerNameMobileFontSize // ignore: cast_nullable_to_non_nullable
as int?,heroMainImageMobileOffsetX: freezed == heroMainImageMobileOffsetX ? _self.heroMainImageMobileOffsetX : heroMainImageMobileOffsetX // ignore: cast_nullable_to_non_nullable
as int?,heroMainImageMobileOffsetY: freezed == heroMainImageMobileOffsetY ? _self.heroMainImageMobileOffsetY : heroMainImageMobileOffsetY // ignore: cast_nullable_to_non_nullable
as int?,illustrationMobileOffsetX: freezed == illustrationMobileOffsetX ? _self.illustrationMobileOffsetX : illustrationMobileOffsetX // ignore: cast_nullable_to_non_nullable
as int?,illustrationMobileOffsetY: freezed == illustrationMobileOffsetY ? _self.illustrationMobileOffsetY : illustrationMobileOffsetY // ignore: cast_nullable_to_non_nullable
as int?,illustrationMobileSize: freezed == illustrationMobileSize ? _self.illustrationMobileSize : illustrationMobileSize // ignore: cast_nullable_to_non_nullable
as int?,illustrationMobileRotation: freezed == illustrationMobileRotation ? _self.illustrationMobileRotation : illustrationMobileRotation // ignore: cast_nullable_to_non_nullable
as int?,ctaMobileOffsetX: freezed == ctaMobileOffsetX ? _self.ctaMobileOffsetX : ctaMobileOffsetX // ignore: cast_nullable_to_non_nullable
as int?,ctaMobileOffsetY: freezed == ctaMobileOffsetY ? _self.ctaMobileOffsetY : ctaMobileOffsetY // ignore: cast_nullable_to_non_nullable
as int?,ctaMobileFontSize: freezed == ctaMobileFontSize ? _self.ctaMobileFontSize : ctaMobileFontSize // ignore: cast_nullable_to_non_nullable
as int?,showFeaturedProjects: null == showFeaturedProjects ? _self.showFeaturedProjects : showFeaturedProjects // ignore: cast_nullable_to_non_nullable
as bool,featuredTitle: freezed == featuredTitle ? _self.featuredTitle : featuredTitle // ignore: cast_nullable_to_non_nullable
as String?,featuredTitleFont: freezed == featuredTitleFont ? _self.featuredTitleFont : featuredTitleFont // ignore: cast_nullable_to_non_nullable
as String?,featuredTitleFontUrl: freezed == featuredTitleFontUrl ? _self.featuredTitleFontUrl : featuredTitleFontUrl // ignore: cast_nullable_to_non_nullable
as String?,featuredTitleFontSize: freezed == featuredTitleFontSize ? _self.featuredTitleFontSize : featuredTitleFontSize // ignore: cast_nullable_to_non_nullable
as int?,featuredTitleColor: freezed == featuredTitleColor ? _self.featuredTitleColor : featuredTitleColor // ignore: cast_nullable_to_non_nullable
as String?,featuredTitleColorDark: freezed == featuredTitleColorDark ? _self.featuredTitleColorDark : featuredTitleColorDark // ignore: cast_nullable_to_non_nullable
as String?,featuredCount: null == featuredCount ? _self.featuredCount : featuredCount // ignore: cast_nullable_to_non_nullable
as int,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String? id,  String? heroTitle1Text,  String? heroTitle1Font,  String? heroTitle1FontUrl,  int? heroTitle1FontSize,  String? heroTitle1Color,  String? heroTitle1ColorDark,  int? heroTitle1ZIndex,  int? heroTitle1OffsetX,  int? heroTitle1OffsetY,  String? heroTitle2Text,  String? heroTitle2Font,  String? heroTitle2FontUrl,  int? heroTitle2FontSize,  String? heroTitle2Color,  String? heroTitle2ColorDark,  int? heroTitle2ZIndex,  int? heroTitle2OffsetX,  int? heroTitle2OffsetY,  String? ownerNameText,  String? ownerNameFont,  String? ownerNameFontUrl,  int? ownerNameFontSize,  String? ownerNameColor,  String? ownerNameColorDark,  int? ownerNameZIndex,  int? ownerNameOffsetX,  int? ownerNameOffsetY,  String? heroMainImageUrl,  String? heroMainImageAlt,  String? heroMainImageCaption,  String? heroImageStyle,  int? heroMainImageZIndex,  int? heroMainImageOffsetX,  int? heroMainImageOffsetY,  String? illustrationUrl,  String? illustrationAlt,  int? illustrationZIndex,  int? illustrationOpacity,  int? illustrationSize,  int? illustrationOffsetX,  int? illustrationOffsetY,  int? illustrationRotation,  String? ctaText,  String? ctaLink,  String? ctaFont,  String? ctaFontUrl,  int? ctaFontSize,  String? ctaVariant,  String? ctaSize,  int? ctaOffsetX,  int? ctaOffsetY,  int? heroTitle1MobileOffsetX,  int? heroTitle1MobileOffsetY,  int? heroTitle1MobileFontSize,  int? heroTitle2MobileOffsetX,  int? heroTitle2MobileOffsetY,  int? heroTitle2MobileFontSize,  int? ownerNameMobileOffsetX,  int? ownerNameMobileOffsetY,  int? ownerNameMobileFontSize,  int? heroMainImageMobileOffsetX,  int? heroMainImageMobileOffsetY,  int? illustrationMobileOffsetX,  int? illustrationMobileOffsetY,  int? illustrationMobileSize,  int? illustrationMobileRotation,  int? ctaMobileOffsetX,  int? ctaMobileOffsetY,  int? ctaMobileFontSize,  bool showFeaturedProjects,  String? featuredTitle,  String? featuredTitleFont,  String? featuredTitleFontUrl,  int? featuredTitleFontSize,  String? featuredTitleColor,  String? featuredTitleColorDark,  int featuredCount,  bool isActive)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _HomeSettings() when $default != null:
return $default(_that.id,_that.heroTitle1Text,_that.heroTitle1Font,_that.heroTitle1FontUrl,_that.heroTitle1FontSize,_that.heroTitle1Color,_that.heroTitle1ColorDark,_that.heroTitle1ZIndex,_that.heroTitle1OffsetX,_that.heroTitle1OffsetY,_that.heroTitle2Text,_that.heroTitle2Font,_that.heroTitle2FontUrl,_that.heroTitle2FontSize,_that.heroTitle2Color,_that.heroTitle2ColorDark,_that.heroTitle2ZIndex,_that.heroTitle2OffsetX,_that.heroTitle2OffsetY,_that.ownerNameText,_that.ownerNameFont,_that.ownerNameFontUrl,_that.ownerNameFontSize,_that.ownerNameColor,_that.ownerNameColorDark,_that.ownerNameZIndex,_that.ownerNameOffsetX,_that.ownerNameOffsetY,_that.heroMainImageUrl,_that.heroMainImageAlt,_that.heroMainImageCaption,_that.heroImageStyle,_that.heroMainImageZIndex,_that.heroMainImageOffsetX,_that.heroMainImageOffsetY,_that.illustrationUrl,_that.illustrationAlt,_that.illustrationZIndex,_that.illustrationOpacity,_that.illustrationSize,_that.illustrationOffsetX,_that.illustrationOffsetY,_that.illustrationRotation,_that.ctaText,_that.ctaLink,_that.ctaFont,_that.ctaFontUrl,_that.ctaFontSize,_that.ctaVariant,_that.ctaSize,_that.ctaOffsetX,_that.ctaOffsetY,_that.heroTitle1MobileOffsetX,_that.heroTitle1MobileOffsetY,_that.heroTitle1MobileFontSize,_that.heroTitle2MobileOffsetX,_that.heroTitle2MobileOffsetY,_that.heroTitle2MobileFontSize,_that.ownerNameMobileOffsetX,_that.ownerNameMobileOffsetY,_that.ownerNameMobileFontSize,_that.heroMainImageMobileOffsetX,_that.heroMainImageMobileOffsetY,_that.illustrationMobileOffsetX,_that.illustrationMobileOffsetY,_that.illustrationMobileSize,_that.illustrationMobileRotation,_that.ctaMobileOffsetX,_that.ctaMobileOffsetY,_that.ctaMobileFontSize,_that.showFeaturedProjects,_that.featuredTitle,_that.featuredTitleFont,_that.featuredTitleFontUrl,_that.featuredTitleFontSize,_that.featuredTitleColor,_that.featuredTitleColorDark,_that.featuredCount,_that.isActive);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String? id,  String? heroTitle1Text,  String? heroTitle1Font,  String? heroTitle1FontUrl,  int? heroTitle1FontSize,  String? heroTitle1Color,  String? heroTitle1ColorDark,  int? heroTitle1ZIndex,  int? heroTitle1OffsetX,  int? heroTitle1OffsetY,  String? heroTitle2Text,  String? heroTitle2Font,  String? heroTitle2FontUrl,  int? heroTitle2FontSize,  String? heroTitle2Color,  String? heroTitle2ColorDark,  int? heroTitle2ZIndex,  int? heroTitle2OffsetX,  int? heroTitle2OffsetY,  String? ownerNameText,  String? ownerNameFont,  String? ownerNameFontUrl,  int? ownerNameFontSize,  String? ownerNameColor,  String? ownerNameColorDark,  int? ownerNameZIndex,  int? ownerNameOffsetX,  int? ownerNameOffsetY,  String? heroMainImageUrl,  String? heroMainImageAlt,  String? heroMainImageCaption,  String? heroImageStyle,  int? heroMainImageZIndex,  int? heroMainImageOffsetX,  int? heroMainImageOffsetY,  String? illustrationUrl,  String? illustrationAlt,  int? illustrationZIndex,  int? illustrationOpacity,  int? illustrationSize,  int? illustrationOffsetX,  int? illustrationOffsetY,  int? illustrationRotation,  String? ctaText,  String? ctaLink,  String? ctaFont,  String? ctaFontUrl,  int? ctaFontSize,  String? ctaVariant,  String? ctaSize,  int? ctaOffsetX,  int? ctaOffsetY,  int? heroTitle1MobileOffsetX,  int? heroTitle1MobileOffsetY,  int? heroTitle1MobileFontSize,  int? heroTitle2MobileOffsetX,  int? heroTitle2MobileOffsetY,  int? heroTitle2MobileFontSize,  int? ownerNameMobileOffsetX,  int? ownerNameMobileOffsetY,  int? ownerNameMobileFontSize,  int? heroMainImageMobileOffsetX,  int? heroMainImageMobileOffsetY,  int? illustrationMobileOffsetX,  int? illustrationMobileOffsetY,  int? illustrationMobileSize,  int? illustrationMobileRotation,  int? ctaMobileOffsetX,  int? ctaMobileOffsetY,  int? ctaMobileFontSize,  bool showFeaturedProjects,  String? featuredTitle,  String? featuredTitleFont,  String? featuredTitleFontUrl,  int? featuredTitleFontSize,  String? featuredTitleColor,  String? featuredTitleColorDark,  int featuredCount,  bool isActive)  $default,) {final _that = this;
switch (_that) {
case _HomeSettings():
return $default(_that.id,_that.heroTitle1Text,_that.heroTitle1Font,_that.heroTitle1FontUrl,_that.heroTitle1FontSize,_that.heroTitle1Color,_that.heroTitle1ColorDark,_that.heroTitle1ZIndex,_that.heroTitle1OffsetX,_that.heroTitle1OffsetY,_that.heroTitle2Text,_that.heroTitle2Font,_that.heroTitle2FontUrl,_that.heroTitle2FontSize,_that.heroTitle2Color,_that.heroTitle2ColorDark,_that.heroTitle2ZIndex,_that.heroTitle2OffsetX,_that.heroTitle2OffsetY,_that.ownerNameText,_that.ownerNameFont,_that.ownerNameFontUrl,_that.ownerNameFontSize,_that.ownerNameColor,_that.ownerNameColorDark,_that.ownerNameZIndex,_that.ownerNameOffsetX,_that.ownerNameOffsetY,_that.heroMainImageUrl,_that.heroMainImageAlt,_that.heroMainImageCaption,_that.heroImageStyle,_that.heroMainImageZIndex,_that.heroMainImageOffsetX,_that.heroMainImageOffsetY,_that.illustrationUrl,_that.illustrationAlt,_that.illustrationZIndex,_that.illustrationOpacity,_that.illustrationSize,_that.illustrationOffsetX,_that.illustrationOffsetY,_that.illustrationRotation,_that.ctaText,_that.ctaLink,_that.ctaFont,_that.ctaFontUrl,_that.ctaFontSize,_that.ctaVariant,_that.ctaSize,_that.ctaOffsetX,_that.ctaOffsetY,_that.heroTitle1MobileOffsetX,_that.heroTitle1MobileOffsetY,_that.heroTitle1MobileFontSize,_that.heroTitle2MobileOffsetX,_that.heroTitle2MobileOffsetY,_that.heroTitle2MobileFontSize,_that.ownerNameMobileOffsetX,_that.ownerNameMobileOffsetY,_that.ownerNameMobileFontSize,_that.heroMainImageMobileOffsetX,_that.heroMainImageMobileOffsetY,_that.illustrationMobileOffsetX,_that.illustrationMobileOffsetY,_that.illustrationMobileSize,_that.illustrationMobileRotation,_that.ctaMobileOffsetX,_that.ctaMobileOffsetY,_that.ctaMobileFontSize,_that.showFeaturedProjects,_that.featuredTitle,_that.featuredTitleFont,_that.featuredTitleFontUrl,_that.featuredTitleFontSize,_that.featuredTitleColor,_that.featuredTitleColorDark,_that.featuredCount,_that.isActive);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String? id,  String? heroTitle1Text,  String? heroTitle1Font,  String? heroTitle1FontUrl,  int? heroTitle1FontSize,  String? heroTitle1Color,  String? heroTitle1ColorDark,  int? heroTitle1ZIndex,  int? heroTitle1OffsetX,  int? heroTitle1OffsetY,  String? heroTitle2Text,  String? heroTitle2Font,  String? heroTitle2FontUrl,  int? heroTitle2FontSize,  String? heroTitle2Color,  String? heroTitle2ColorDark,  int? heroTitle2ZIndex,  int? heroTitle2OffsetX,  int? heroTitle2OffsetY,  String? ownerNameText,  String? ownerNameFont,  String? ownerNameFontUrl,  int? ownerNameFontSize,  String? ownerNameColor,  String? ownerNameColorDark,  int? ownerNameZIndex,  int? ownerNameOffsetX,  int? ownerNameOffsetY,  String? heroMainImageUrl,  String? heroMainImageAlt,  String? heroMainImageCaption,  String? heroImageStyle,  int? heroMainImageZIndex,  int? heroMainImageOffsetX,  int? heroMainImageOffsetY,  String? illustrationUrl,  String? illustrationAlt,  int? illustrationZIndex,  int? illustrationOpacity,  int? illustrationSize,  int? illustrationOffsetX,  int? illustrationOffsetY,  int? illustrationRotation,  String? ctaText,  String? ctaLink,  String? ctaFont,  String? ctaFontUrl,  int? ctaFontSize,  String? ctaVariant,  String? ctaSize,  int? ctaOffsetX,  int? ctaOffsetY,  int? heroTitle1MobileOffsetX,  int? heroTitle1MobileOffsetY,  int? heroTitle1MobileFontSize,  int? heroTitle2MobileOffsetX,  int? heroTitle2MobileOffsetY,  int? heroTitle2MobileFontSize,  int? ownerNameMobileOffsetX,  int? ownerNameMobileOffsetY,  int? ownerNameMobileFontSize,  int? heroMainImageMobileOffsetX,  int? heroMainImageMobileOffsetY,  int? illustrationMobileOffsetX,  int? illustrationMobileOffsetY,  int? illustrationMobileSize,  int? illustrationMobileRotation,  int? ctaMobileOffsetX,  int? ctaMobileOffsetY,  int? ctaMobileFontSize,  bool showFeaturedProjects,  String? featuredTitle,  String? featuredTitleFont,  String? featuredTitleFontUrl,  int? featuredTitleFontSize,  String? featuredTitleColor,  String? featuredTitleColorDark,  int featuredCount,  bool isActive)?  $default,) {final _that = this;
switch (_that) {
case _HomeSettings() when $default != null:
return $default(_that.id,_that.heroTitle1Text,_that.heroTitle1Font,_that.heroTitle1FontUrl,_that.heroTitle1FontSize,_that.heroTitle1Color,_that.heroTitle1ColorDark,_that.heroTitle1ZIndex,_that.heroTitle1OffsetX,_that.heroTitle1OffsetY,_that.heroTitle2Text,_that.heroTitle2Font,_that.heroTitle2FontUrl,_that.heroTitle2FontSize,_that.heroTitle2Color,_that.heroTitle2ColorDark,_that.heroTitle2ZIndex,_that.heroTitle2OffsetX,_that.heroTitle2OffsetY,_that.ownerNameText,_that.ownerNameFont,_that.ownerNameFontUrl,_that.ownerNameFontSize,_that.ownerNameColor,_that.ownerNameColorDark,_that.ownerNameZIndex,_that.ownerNameOffsetX,_that.ownerNameOffsetY,_that.heroMainImageUrl,_that.heroMainImageAlt,_that.heroMainImageCaption,_that.heroImageStyle,_that.heroMainImageZIndex,_that.heroMainImageOffsetX,_that.heroMainImageOffsetY,_that.illustrationUrl,_that.illustrationAlt,_that.illustrationZIndex,_that.illustrationOpacity,_that.illustrationSize,_that.illustrationOffsetX,_that.illustrationOffsetY,_that.illustrationRotation,_that.ctaText,_that.ctaLink,_that.ctaFont,_that.ctaFontUrl,_that.ctaFontSize,_that.ctaVariant,_that.ctaSize,_that.ctaOffsetX,_that.ctaOffsetY,_that.heroTitle1MobileOffsetX,_that.heroTitle1MobileOffsetY,_that.heroTitle1MobileFontSize,_that.heroTitle2MobileOffsetX,_that.heroTitle2MobileOffsetY,_that.heroTitle2MobileFontSize,_that.ownerNameMobileOffsetX,_that.ownerNameMobileOffsetY,_that.ownerNameMobileFontSize,_that.heroMainImageMobileOffsetX,_that.heroMainImageMobileOffsetY,_that.illustrationMobileOffsetX,_that.illustrationMobileOffsetY,_that.illustrationMobileSize,_that.illustrationMobileRotation,_that.ctaMobileOffsetX,_that.ctaMobileOffsetY,_that.ctaMobileFontSize,_that.showFeaturedProjects,_that.featuredTitle,_that.featuredTitleFont,_that.featuredTitleFontUrl,_that.featuredTitleFontSize,_that.featuredTitleColor,_that.featuredTitleColorDark,_that.featuredCount,_that.isActive);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _HomeSettings implements HomeSettings {
  const _HomeSettings({this.id, this.heroTitle1Text, this.heroTitle1Font, this.heroTitle1FontUrl, this.heroTitle1FontSize, this.heroTitle1Color, this.heroTitle1ColorDark, this.heroTitle1ZIndex, this.heroTitle1OffsetX, this.heroTitle1OffsetY, this.heroTitle2Text, this.heroTitle2Font, this.heroTitle2FontUrl, this.heroTitle2FontSize, this.heroTitle2Color, this.heroTitle2ColorDark, this.heroTitle2ZIndex, this.heroTitle2OffsetX, this.heroTitle2OffsetY, this.ownerNameText, this.ownerNameFont, this.ownerNameFontUrl, this.ownerNameFontSize, this.ownerNameColor, this.ownerNameColorDark, this.ownerNameZIndex, this.ownerNameOffsetX, this.ownerNameOffsetY, this.heroMainImageUrl, this.heroMainImageAlt, this.heroMainImageCaption, this.heroImageStyle, this.heroMainImageZIndex, this.heroMainImageOffsetX, this.heroMainImageOffsetY, this.illustrationUrl, this.illustrationAlt, this.illustrationZIndex, this.illustrationOpacity, this.illustrationSize, this.illustrationOffsetX, this.illustrationOffsetY, this.illustrationRotation, this.ctaText, this.ctaLink, this.ctaFont, this.ctaFontUrl, this.ctaFontSize, this.ctaVariant, this.ctaSize, this.ctaOffsetX, this.ctaOffsetY, this.heroTitle1MobileOffsetX, this.heroTitle1MobileOffsetY, this.heroTitle1MobileFontSize, this.heroTitle2MobileOffsetX, this.heroTitle2MobileOffsetY, this.heroTitle2MobileFontSize, this.ownerNameMobileOffsetX, this.ownerNameMobileOffsetY, this.ownerNameMobileFontSize, this.heroMainImageMobileOffsetX, this.heroMainImageMobileOffsetY, this.illustrationMobileOffsetX, this.illustrationMobileOffsetY, this.illustrationMobileSize, this.illustrationMobileRotation, this.ctaMobileOffsetX, this.ctaMobileOffsetY, this.ctaMobileFontSize, this.showFeaturedProjects = true, this.featuredTitle, this.featuredTitleFont, this.featuredTitleFontUrl, this.featuredTitleFontSize, this.featuredTitleColor, this.featuredTitleColorDark, this.featuredCount = 6, this.isActive = true});
  factory _HomeSettings.fromJson(Map<String, dynamic> json) => _$HomeSettingsFromJson(json);

@override final  String? id;
// ── Título 1 ──
@override final  String? heroTitle1Text;
@override final  String? heroTitle1Font;
@override final  String? heroTitle1FontUrl;
@override final  int? heroTitle1FontSize;
@override final  String? heroTitle1Color;
@override final  String? heroTitle1ColorDark;
@override final  int? heroTitle1ZIndex;
@override final  int? heroTitle1OffsetX;
@override final  int? heroTitle1OffsetY;
// ── Título 2 ──
@override final  String? heroTitle2Text;
@override final  String? heroTitle2Font;
@override final  String? heroTitle2FontUrl;
@override final  int? heroTitle2FontSize;
@override final  String? heroTitle2Color;
@override final  String? heroTitle2ColorDark;
@override final  int? heroTitle2ZIndex;
@override final  int? heroTitle2OffsetX;
@override final  int? heroTitle2OffsetY;
// ── Nombre propietario ──
@override final  String? ownerNameText;
@override final  String? ownerNameFont;
@override final  String? ownerNameFontUrl;
@override final  int? ownerNameFontSize;
@override final  String? ownerNameColor;
@override final  String? ownerNameColorDark;
@override final  int? ownerNameZIndex;
@override final  int? ownerNameOffsetX;
@override final  int? ownerNameOffsetY;
// ── Imagen principal ──
@override final  String? heroMainImageUrl;
@override final  String? heroMainImageAlt;
@override final  String? heroMainImageCaption;
@override final  String? heroImageStyle;
@override final  int? heroMainImageZIndex;
@override final  int? heroMainImageOffsetX;
@override final  int? heroMainImageOffsetY;
// ── Ilustración ──
@override final  String? illustrationUrl;
@override final  String? illustrationAlt;
@override final  int? illustrationZIndex;
@override final  int? illustrationOpacity;
@override final  int? illustrationSize;
@override final  int? illustrationOffsetX;
@override final  int? illustrationOffsetY;
@override final  int? illustrationRotation;
// ── Botón CTA ──
@override final  String? ctaText;
@override final  String? ctaLink;
@override final  String? ctaFont;
@override final  String? ctaFontUrl;
@override final  int? ctaFontSize;
@override final  String? ctaVariant;
@override final  String? ctaSize;
@override final  int? ctaOffsetX;
@override final  int? ctaOffsetY;
// ── Mobile Overrides ──
@override final  int? heroTitle1MobileOffsetX;
@override final  int? heroTitle1MobileOffsetY;
@override final  int? heroTitle1MobileFontSize;
@override final  int? heroTitle2MobileOffsetX;
@override final  int? heroTitle2MobileOffsetY;
@override final  int? heroTitle2MobileFontSize;
@override final  int? ownerNameMobileOffsetX;
@override final  int? ownerNameMobileOffsetY;
@override final  int? ownerNameMobileFontSize;
@override final  int? heroMainImageMobileOffsetX;
@override final  int? heroMainImageMobileOffsetY;
@override final  int? illustrationMobileOffsetX;
@override final  int? illustrationMobileOffsetY;
@override final  int? illustrationMobileSize;
@override final  int? illustrationMobileRotation;
@override final  int? ctaMobileOffsetX;
@override final  int? ctaMobileOffsetY;
@override final  int? ctaMobileFontSize;
// ── Proyectos destacados ──
@override@JsonKey() final  bool showFeaturedProjects;
@override final  String? featuredTitle;
@override final  String? featuredTitleFont;
@override final  String? featuredTitleFontUrl;
@override final  int? featuredTitleFontSize;
@override final  String? featuredTitleColor;
@override final  String? featuredTitleColorDark;
@override@JsonKey() final  int featuredCount;
// ── Meta ──
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
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _HomeSettings&&(identical(other.id, id) || other.id == id)&&(identical(other.heroTitle1Text, heroTitle1Text) || other.heroTitle1Text == heroTitle1Text)&&(identical(other.heroTitle1Font, heroTitle1Font) || other.heroTitle1Font == heroTitle1Font)&&(identical(other.heroTitle1FontUrl, heroTitle1FontUrl) || other.heroTitle1FontUrl == heroTitle1FontUrl)&&(identical(other.heroTitle1FontSize, heroTitle1FontSize) || other.heroTitle1FontSize == heroTitle1FontSize)&&(identical(other.heroTitle1Color, heroTitle1Color) || other.heroTitle1Color == heroTitle1Color)&&(identical(other.heroTitle1ColorDark, heroTitle1ColorDark) || other.heroTitle1ColorDark == heroTitle1ColorDark)&&(identical(other.heroTitle1ZIndex, heroTitle1ZIndex) || other.heroTitle1ZIndex == heroTitle1ZIndex)&&(identical(other.heroTitle1OffsetX, heroTitle1OffsetX) || other.heroTitle1OffsetX == heroTitle1OffsetX)&&(identical(other.heroTitle1OffsetY, heroTitle1OffsetY) || other.heroTitle1OffsetY == heroTitle1OffsetY)&&(identical(other.heroTitle2Text, heroTitle2Text) || other.heroTitle2Text == heroTitle2Text)&&(identical(other.heroTitle2Font, heroTitle2Font) || other.heroTitle2Font == heroTitle2Font)&&(identical(other.heroTitle2FontUrl, heroTitle2FontUrl) || other.heroTitle2FontUrl == heroTitle2FontUrl)&&(identical(other.heroTitle2FontSize, heroTitle2FontSize) || other.heroTitle2FontSize == heroTitle2FontSize)&&(identical(other.heroTitle2Color, heroTitle2Color) || other.heroTitle2Color == heroTitle2Color)&&(identical(other.heroTitle2ColorDark, heroTitle2ColorDark) || other.heroTitle2ColorDark == heroTitle2ColorDark)&&(identical(other.heroTitle2ZIndex, heroTitle2ZIndex) || other.heroTitle2ZIndex == heroTitle2ZIndex)&&(identical(other.heroTitle2OffsetX, heroTitle2OffsetX) || other.heroTitle2OffsetX == heroTitle2OffsetX)&&(identical(other.heroTitle2OffsetY, heroTitle2OffsetY) || other.heroTitle2OffsetY == heroTitle2OffsetY)&&(identical(other.ownerNameText, ownerNameText) || other.ownerNameText == ownerNameText)&&(identical(other.ownerNameFont, ownerNameFont) || other.ownerNameFont == ownerNameFont)&&(identical(other.ownerNameFontUrl, ownerNameFontUrl) || other.ownerNameFontUrl == ownerNameFontUrl)&&(identical(other.ownerNameFontSize, ownerNameFontSize) || other.ownerNameFontSize == ownerNameFontSize)&&(identical(other.ownerNameColor, ownerNameColor) || other.ownerNameColor == ownerNameColor)&&(identical(other.ownerNameColorDark, ownerNameColorDark) || other.ownerNameColorDark == ownerNameColorDark)&&(identical(other.ownerNameZIndex, ownerNameZIndex) || other.ownerNameZIndex == ownerNameZIndex)&&(identical(other.ownerNameOffsetX, ownerNameOffsetX) || other.ownerNameOffsetX == ownerNameOffsetX)&&(identical(other.ownerNameOffsetY, ownerNameOffsetY) || other.ownerNameOffsetY == ownerNameOffsetY)&&(identical(other.heroMainImageUrl, heroMainImageUrl) || other.heroMainImageUrl == heroMainImageUrl)&&(identical(other.heroMainImageAlt, heroMainImageAlt) || other.heroMainImageAlt == heroMainImageAlt)&&(identical(other.heroMainImageCaption, heroMainImageCaption) || other.heroMainImageCaption == heroMainImageCaption)&&(identical(other.heroImageStyle, heroImageStyle) || other.heroImageStyle == heroImageStyle)&&(identical(other.heroMainImageZIndex, heroMainImageZIndex) || other.heroMainImageZIndex == heroMainImageZIndex)&&(identical(other.heroMainImageOffsetX, heroMainImageOffsetX) || other.heroMainImageOffsetX == heroMainImageOffsetX)&&(identical(other.heroMainImageOffsetY, heroMainImageOffsetY) || other.heroMainImageOffsetY == heroMainImageOffsetY)&&(identical(other.illustrationUrl, illustrationUrl) || other.illustrationUrl == illustrationUrl)&&(identical(other.illustrationAlt, illustrationAlt) || other.illustrationAlt == illustrationAlt)&&(identical(other.illustrationZIndex, illustrationZIndex) || other.illustrationZIndex == illustrationZIndex)&&(identical(other.illustrationOpacity, illustrationOpacity) || other.illustrationOpacity == illustrationOpacity)&&(identical(other.illustrationSize, illustrationSize) || other.illustrationSize == illustrationSize)&&(identical(other.illustrationOffsetX, illustrationOffsetX) || other.illustrationOffsetX == illustrationOffsetX)&&(identical(other.illustrationOffsetY, illustrationOffsetY) || other.illustrationOffsetY == illustrationOffsetY)&&(identical(other.illustrationRotation, illustrationRotation) || other.illustrationRotation == illustrationRotation)&&(identical(other.ctaText, ctaText) || other.ctaText == ctaText)&&(identical(other.ctaLink, ctaLink) || other.ctaLink == ctaLink)&&(identical(other.ctaFont, ctaFont) || other.ctaFont == ctaFont)&&(identical(other.ctaFontUrl, ctaFontUrl) || other.ctaFontUrl == ctaFontUrl)&&(identical(other.ctaFontSize, ctaFontSize) || other.ctaFontSize == ctaFontSize)&&(identical(other.ctaVariant, ctaVariant) || other.ctaVariant == ctaVariant)&&(identical(other.ctaSize, ctaSize) || other.ctaSize == ctaSize)&&(identical(other.ctaOffsetX, ctaOffsetX) || other.ctaOffsetX == ctaOffsetX)&&(identical(other.ctaOffsetY, ctaOffsetY) || other.ctaOffsetY == ctaOffsetY)&&(identical(other.heroTitle1MobileOffsetX, heroTitle1MobileOffsetX) || other.heroTitle1MobileOffsetX == heroTitle1MobileOffsetX)&&(identical(other.heroTitle1MobileOffsetY, heroTitle1MobileOffsetY) || other.heroTitle1MobileOffsetY == heroTitle1MobileOffsetY)&&(identical(other.heroTitle1MobileFontSize, heroTitle1MobileFontSize) || other.heroTitle1MobileFontSize == heroTitle1MobileFontSize)&&(identical(other.heroTitle2MobileOffsetX, heroTitle2MobileOffsetX) || other.heroTitle2MobileOffsetX == heroTitle2MobileOffsetX)&&(identical(other.heroTitle2MobileOffsetY, heroTitle2MobileOffsetY) || other.heroTitle2MobileOffsetY == heroTitle2MobileOffsetY)&&(identical(other.heroTitle2MobileFontSize, heroTitle2MobileFontSize) || other.heroTitle2MobileFontSize == heroTitle2MobileFontSize)&&(identical(other.ownerNameMobileOffsetX, ownerNameMobileOffsetX) || other.ownerNameMobileOffsetX == ownerNameMobileOffsetX)&&(identical(other.ownerNameMobileOffsetY, ownerNameMobileOffsetY) || other.ownerNameMobileOffsetY == ownerNameMobileOffsetY)&&(identical(other.ownerNameMobileFontSize, ownerNameMobileFontSize) || other.ownerNameMobileFontSize == ownerNameMobileFontSize)&&(identical(other.heroMainImageMobileOffsetX, heroMainImageMobileOffsetX) || other.heroMainImageMobileOffsetX == heroMainImageMobileOffsetX)&&(identical(other.heroMainImageMobileOffsetY, heroMainImageMobileOffsetY) || other.heroMainImageMobileOffsetY == heroMainImageMobileOffsetY)&&(identical(other.illustrationMobileOffsetX, illustrationMobileOffsetX) || other.illustrationMobileOffsetX == illustrationMobileOffsetX)&&(identical(other.illustrationMobileOffsetY, illustrationMobileOffsetY) || other.illustrationMobileOffsetY == illustrationMobileOffsetY)&&(identical(other.illustrationMobileSize, illustrationMobileSize) || other.illustrationMobileSize == illustrationMobileSize)&&(identical(other.illustrationMobileRotation, illustrationMobileRotation) || other.illustrationMobileRotation == illustrationMobileRotation)&&(identical(other.ctaMobileOffsetX, ctaMobileOffsetX) || other.ctaMobileOffsetX == ctaMobileOffsetX)&&(identical(other.ctaMobileOffsetY, ctaMobileOffsetY) || other.ctaMobileOffsetY == ctaMobileOffsetY)&&(identical(other.ctaMobileFontSize, ctaMobileFontSize) || other.ctaMobileFontSize == ctaMobileFontSize)&&(identical(other.showFeaturedProjects, showFeaturedProjects) || other.showFeaturedProjects == showFeaturedProjects)&&(identical(other.featuredTitle, featuredTitle) || other.featuredTitle == featuredTitle)&&(identical(other.featuredTitleFont, featuredTitleFont) || other.featuredTitleFont == featuredTitleFont)&&(identical(other.featuredTitleFontUrl, featuredTitleFontUrl) || other.featuredTitleFontUrl == featuredTitleFontUrl)&&(identical(other.featuredTitleFontSize, featuredTitleFontSize) || other.featuredTitleFontSize == featuredTitleFontSize)&&(identical(other.featuredTitleColor, featuredTitleColor) || other.featuredTitleColor == featuredTitleColor)&&(identical(other.featuredTitleColorDark, featuredTitleColorDark) || other.featuredTitleColorDark == featuredTitleColorDark)&&(identical(other.featuredCount, featuredCount) || other.featuredCount == featuredCount)&&(identical(other.isActive, isActive) || other.isActive == isActive));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hashAll([runtimeType,id,heroTitle1Text,heroTitle1Font,heroTitle1FontUrl,heroTitle1FontSize,heroTitle1Color,heroTitle1ColorDark,heroTitle1ZIndex,heroTitle1OffsetX,heroTitle1OffsetY,heroTitle2Text,heroTitle2Font,heroTitle2FontUrl,heroTitle2FontSize,heroTitle2Color,heroTitle2ColorDark,heroTitle2ZIndex,heroTitle2OffsetX,heroTitle2OffsetY,ownerNameText,ownerNameFont,ownerNameFontUrl,ownerNameFontSize,ownerNameColor,ownerNameColorDark,ownerNameZIndex,ownerNameOffsetX,ownerNameOffsetY,heroMainImageUrl,heroMainImageAlt,heroMainImageCaption,heroImageStyle,heroMainImageZIndex,heroMainImageOffsetX,heroMainImageOffsetY,illustrationUrl,illustrationAlt,illustrationZIndex,illustrationOpacity,illustrationSize,illustrationOffsetX,illustrationOffsetY,illustrationRotation,ctaText,ctaLink,ctaFont,ctaFontUrl,ctaFontSize,ctaVariant,ctaSize,ctaOffsetX,ctaOffsetY,heroTitle1MobileOffsetX,heroTitle1MobileOffsetY,heroTitle1MobileFontSize,heroTitle2MobileOffsetX,heroTitle2MobileOffsetY,heroTitle2MobileFontSize,ownerNameMobileOffsetX,ownerNameMobileOffsetY,ownerNameMobileFontSize,heroMainImageMobileOffsetX,heroMainImageMobileOffsetY,illustrationMobileOffsetX,illustrationMobileOffsetY,illustrationMobileSize,illustrationMobileRotation,ctaMobileOffsetX,ctaMobileOffsetY,ctaMobileFontSize,showFeaturedProjects,featuredTitle,featuredTitleFont,featuredTitleFontUrl,featuredTitleFontSize,featuredTitleColor,featuredTitleColorDark,featuredCount,isActive]);

@override
String toString() {
  return 'HomeSettings(id: $id, heroTitle1Text: $heroTitle1Text, heroTitle1Font: $heroTitle1Font, heroTitle1FontUrl: $heroTitle1FontUrl, heroTitle1FontSize: $heroTitle1FontSize, heroTitle1Color: $heroTitle1Color, heroTitle1ColorDark: $heroTitle1ColorDark, heroTitle1ZIndex: $heroTitle1ZIndex, heroTitle1OffsetX: $heroTitle1OffsetX, heroTitle1OffsetY: $heroTitle1OffsetY, heroTitle2Text: $heroTitle2Text, heroTitle2Font: $heroTitle2Font, heroTitle2FontUrl: $heroTitle2FontUrl, heroTitle2FontSize: $heroTitle2FontSize, heroTitle2Color: $heroTitle2Color, heroTitle2ColorDark: $heroTitle2ColorDark, heroTitle2ZIndex: $heroTitle2ZIndex, heroTitle2OffsetX: $heroTitle2OffsetX, heroTitle2OffsetY: $heroTitle2OffsetY, ownerNameText: $ownerNameText, ownerNameFont: $ownerNameFont, ownerNameFontUrl: $ownerNameFontUrl, ownerNameFontSize: $ownerNameFontSize, ownerNameColor: $ownerNameColor, ownerNameColorDark: $ownerNameColorDark, ownerNameZIndex: $ownerNameZIndex, ownerNameOffsetX: $ownerNameOffsetX, ownerNameOffsetY: $ownerNameOffsetY, heroMainImageUrl: $heroMainImageUrl, heroMainImageAlt: $heroMainImageAlt, heroMainImageCaption: $heroMainImageCaption, heroImageStyle: $heroImageStyle, heroMainImageZIndex: $heroMainImageZIndex, heroMainImageOffsetX: $heroMainImageOffsetX, heroMainImageOffsetY: $heroMainImageOffsetY, illustrationUrl: $illustrationUrl, illustrationAlt: $illustrationAlt, illustrationZIndex: $illustrationZIndex, illustrationOpacity: $illustrationOpacity, illustrationSize: $illustrationSize, illustrationOffsetX: $illustrationOffsetX, illustrationOffsetY: $illustrationOffsetY, illustrationRotation: $illustrationRotation, ctaText: $ctaText, ctaLink: $ctaLink, ctaFont: $ctaFont, ctaFontUrl: $ctaFontUrl, ctaFontSize: $ctaFontSize, ctaVariant: $ctaVariant, ctaSize: $ctaSize, ctaOffsetX: $ctaOffsetX, ctaOffsetY: $ctaOffsetY, heroTitle1MobileOffsetX: $heroTitle1MobileOffsetX, heroTitle1MobileOffsetY: $heroTitle1MobileOffsetY, heroTitle1MobileFontSize: $heroTitle1MobileFontSize, heroTitle2MobileOffsetX: $heroTitle2MobileOffsetX, heroTitle2MobileOffsetY: $heroTitle2MobileOffsetY, heroTitle2MobileFontSize: $heroTitle2MobileFontSize, ownerNameMobileOffsetX: $ownerNameMobileOffsetX, ownerNameMobileOffsetY: $ownerNameMobileOffsetY, ownerNameMobileFontSize: $ownerNameMobileFontSize, heroMainImageMobileOffsetX: $heroMainImageMobileOffsetX, heroMainImageMobileOffsetY: $heroMainImageMobileOffsetY, illustrationMobileOffsetX: $illustrationMobileOffsetX, illustrationMobileOffsetY: $illustrationMobileOffsetY, illustrationMobileSize: $illustrationMobileSize, illustrationMobileRotation: $illustrationMobileRotation, ctaMobileOffsetX: $ctaMobileOffsetX, ctaMobileOffsetY: $ctaMobileOffsetY, ctaMobileFontSize: $ctaMobileFontSize, showFeaturedProjects: $showFeaturedProjects, featuredTitle: $featuredTitle, featuredTitleFont: $featuredTitleFont, featuredTitleFontUrl: $featuredTitleFontUrl, featuredTitleFontSize: $featuredTitleFontSize, featuredTitleColor: $featuredTitleColor, featuredTitleColorDark: $featuredTitleColorDark, featuredCount: $featuredCount, isActive: $isActive)';
}


}

/// @nodoc
abstract mixin class _$HomeSettingsCopyWith<$Res> implements $HomeSettingsCopyWith<$Res> {
  factory _$HomeSettingsCopyWith(_HomeSettings value, $Res Function(_HomeSettings) _then) = __$HomeSettingsCopyWithImpl;
@override @useResult
$Res call({
 String? id, String? heroTitle1Text, String? heroTitle1Font, String? heroTitle1FontUrl, int? heroTitle1FontSize, String? heroTitle1Color, String? heroTitle1ColorDark, int? heroTitle1ZIndex, int? heroTitle1OffsetX, int? heroTitle1OffsetY, String? heroTitle2Text, String? heroTitle2Font, String? heroTitle2FontUrl, int? heroTitle2FontSize, String? heroTitle2Color, String? heroTitle2ColorDark, int? heroTitle2ZIndex, int? heroTitle2OffsetX, int? heroTitle2OffsetY, String? ownerNameText, String? ownerNameFont, String? ownerNameFontUrl, int? ownerNameFontSize, String? ownerNameColor, String? ownerNameColorDark, int? ownerNameZIndex, int? ownerNameOffsetX, int? ownerNameOffsetY, String? heroMainImageUrl, String? heroMainImageAlt, String? heroMainImageCaption, String? heroImageStyle, int? heroMainImageZIndex, int? heroMainImageOffsetX, int? heroMainImageOffsetY, String? illustrationUrl, String? illustrationAlt, int? illustrationZIndex, int? illustrationOpacity, int? illustrationSize, int? illustrationOffsetX, int? illustrationOffsetY, int? illustrationRotation, String? ctaText, String? ctaLink, String? ctaFont, String? ctaFontUrl, int? ctaFontSize, String? ctaVariant, String? ctaSize, int? ctaOffsetX, int? ctaOffsetY, int? heroTitle1MobileOffsetX, int? heroTitle1MobileOffsetY, int? heroTitle1MobileFontSize, int? heroTitle2MobileOffsetX, int? heroTitle2MobileOffsetY, int? heroTitle2MobileFontSize, int? ownerNameMobileOffsetX, int? ownerNameMobileOffsetY, int? ownerNameMobileFontSize, int? heroMainImageMobileOffsetX, int? heroMainImageMobileOffsetY, int? illustrationMobileOffsetX, int? illustrationMobileOffsetY, int? illustrationMobileSize, int? illustrationMobileRotation, int? ctaMobileOffsetX, int? ctaMobileOffsetY, int? ctaMobileFontSize, bool showFeaturedProjects, String? featuredTitle, String? featuredTitleFont, String? featuredTitleFontUrl, int? featuredTitleFontSize, String? featuredTitleColor, String? featuredTitleColorDark, int featuredCount, bool isActive
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
@override @pragma('vm:prefer-inline') $Res call({Object? id = freezed,Object? heroTitle1Text = freezed,Object? heroTitle1Font = freezed,Object? heroTitle1FontUrl = freezed,Object? heroTitle1FontSize = freezed,Object? heroTitle1Color = freezed,Object? heroTitle1ColorDark = freezed,Object? heroTitle1ZIndex = freezed,Object? heroTitle1OffsetX = freezed,Object? heroTitle1OffsetY = freezed,Object? heroTitle2Text = freezed,Object? heroTitle2Font = freezed,Object? heroTitle2FontUrl = freezed,Object? heroTitle2FontSize = freezed,Object? heroTitle2Color = freezed,Object? heroTitle2ColorDark = freezed,Object? heroTitle2ZIndex = freezed,Object? heroTitle2OffsetX = freezed,Object? heroTitle2OffsetY = freezed,Object? ownerNameText = freezed,Object? ownerNameFont = freezed,Object? ownerNameFontUrl = freezed,Object? ownerNameFontSize = freezed,Object? ownerNameColor = freezed,Object? ownerNameColorDark = freezed,Object? ownerNameZIndex = freezed,Object? ownerNameOffsetX = freezed,Object? ownerNameOffsetY = freezed,Object? heroMainImageUrl = freezed,Object? heroMainImageAlt = freezed,Object? heroMainImageCaption = freezed,Object? heroImageStyle = freezed,Object? heroMainImageZIndex = freezed,Object? heroMainImageOffsetX = freezed,Object? heroMainImageOffsetY = freezed,Object? illustrationUrl = freezed,Object? illustrationAlt = freezed,Object? illustrationZIndex = freezed,Object? illustrationOpacity = freezed,Object? illustrationSize = freezed,Object? illustrationOffsetX = freezed,Object? illustrationOffsetY = freezed,Object? illustrationRotation = freezed,Object? ctaText = freezed,Object? ctaLink = freezed,Object? ctaFont = freezed,Object? ctaFontUrl = freezed,Object? ctaFontSize = freezed,Object? ctaVariant = freezed,Object? ctaSize = freezed,Object? ctaOffsetX = freezed,Object? ctaOffsetY = freezed,Object? heroTitle1MobileOffsetX = freezed,Object? heroTitle1MobileOffsetY = freezed,Object? heroTitle1MobileFontSize = freezed,Object? heroTitle2MobileOffsetX = freezed,Object? heroTitle2MobileOffsetY = freezed,Object? heroTitle2MobileFontSize = freezed,Object? ownerNameMobileOffsetX = freezed,Object? ownerNameMobileOffsetY = freezed,Object? ownerNameMobileFontSize = freezed,Object? heroMainImageMobileOffsetX = freezed,Object? heroMainImageMobileOffsetY = freezed,Object? illustrationMobileOffsetX = freezed,Object? illustrationMobileOffsetY = freezed,Object? illustrationMobileSize = freezed,Object? illustrationMobileRotation = freezed,Object? ctaMobileOffsetX = freezed,Object? ctaMobileOffsetY = freezed,Object? ctaMobileFontSize = freezed,Object? showFeaturedProjects = null,Object? featuredTitle = freezed,Object? featuredTitleFont = freezed,Object? featuredTitleFontUrl = freezed,Object? featuredTitleFontSize = freezed,Object? featuredTitleColor = freezed,Object? featuredTitleColorDark = freezed,Object? featuredCount = null,Object? isActive = null,}) {
  return _then(_HomeSettings(
id: freezed == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String?,heroTitle1Text: freezed == heroTitle1Text ? _self.heroTitle1Text : heroTitle1Text // ignore: cast_nullable_to_non_nullable
as String?,heroTitle1Font: freezed == heroTitle1Font ? _self.heroTitle1Font : heroTitle1Font // ignore: cast_nullable_to_non_nullable
as String?,heroTitle1FontUrl: freezed == heroTitle1FontUrl ? _self.heroTitle1FontUrl : heroTitle1FontUrl // ignore: cast_nullable_to_non_nullable
as String?,heroTitle1FontSize: freezed == heroTitle1FontSize ? _self.heroTitle1FontSize : heroTitle1FontSize // ignore: cast_nullable_to_non_nullable
as int?,heroTitle1Color: freezed == heroTitle1Color ? _self.heroTitle1Color : heroTitle1Color // ignore: cast_nullable_to_non_nullable
as String?,heroTitle1ColorDark: freezed == heroTitle1ColorDark ? _self.heroTitle1ColorDark : heroTitle1ColorDark // ignore: cast_nullable_to_non_nullable
as String?,heroTitle1ZIndex: freezed == heroTitle1ZIndex ? _self.heroTitle1ZIndex : heroTitle1ZIndex // ignore: cast_nullable_to_non_nullable
as int?,heroTitle1OffsetX: freezed == heroTitle1OffsetX ? _self.heroTitle1OffsetX : heroTitle1OffsetX // ignore: cast_nullable_to_non_nullable
as int?,heroTitle1OffsetY: freezed == heroTitle1OffsetY ? _self.heroTitle1OffsetY : heroTitle1OffsetY // ignore: cast_nullable_to_non_nullable
as int?,heroTitle2Text: freezed == heroTitle2Text ? _self.heroTitle2Text : heroTitle2Text // ignore: cast_nullable_to_non_nullable
as String?,heroTitle2Font: freezed == heroTitle2Font ? _self.heroTitle2Font : heroTitle2Font // ignore: cast_nullable_to_non_nullable
as String?,heroTitle2FontUrl: freezed == heroTitle2FontUrl ? _self.heroTitle2FontUrl : heroTitle2FontUrl // ignore: cast_nullable_to_non_nullable
as String?,heroTitle2FontSize: freezed == heroTitle2FontSize ? _self.heroTitle2FontSize : heroTitle2FontSize // ignore: cast_nullable_to_non_nullable
as int?,heroTitle2Color: freezed == heroTitle2Color ? _self.heroTitle2Color : heroTitle2Color // ignore: cast_nullable_to_non_nullable
as String?,heroTitle2ColorDark: freezed == heroTitle2ColorDark ? _self.heroTitle2ColorDark : heroTitle2ColorDark // ignore: cast_nullable_to_non_nullable
as String?,heroTitle2ZIndex: freezed == heroTitle2ZIndex ? _self.heroTitle2ZIndex : heroTitle2ZIndex // ignore: cast_nullable_to_non_nullable
as int?,heroTitle2OffsetX: freezed == heroTitle2OffsetX ? _self.heroTitle2OffsetX : heroTitle2OffsetX // ignore: cast_nullable_to_non_nullable
as int?,heroTitle2OffsetY: freezed == heroTitle2OffsetY ? _self.heroTitle2OffsetY : heroTitle2OffsetY // ignore: cast_nullable_to_non_nullable
as int?,ownerNameText: freezed == ownerNameText ? _self.ownerNameText : ownerNameText // ignore: cast_nullable_to_non_nullable
as String?,ownerNameFont: freezed == ownerNameFont ? _self.ownerNameFont : ownerNameFont // ignore: cast_nullable_to_non_nullable
as String?,ownerNameFontUrl: freezed == ownerNameFontUrl ? _self.ownerNameFontUrl : ownerNameFontUrl // ignore: cast_nullable_to_non_nullable
as String?,ownerNameFontSize: freezed == ownerNameFontSize ? _self.ownerNameFontSize : ownerNameFontSize // ignore: cast_nullable_to_non_nullable
as int?,ownerNameColor: freezed == ownerNameColor ? _self.ownerNameColor : ownerNameColor // ignore: cast_nullable_to_non_nullable
as String?,ownerNameColorDark: freezed == ownerNameColorDark ? _self.ownerNameColorDark : ownerNameColorDark // ignore: cast_nullable_to_non_nullable
as String?,ownerNameZIndex: freezed == ownerNameZIndex ? _self.ownerNameZIndex : ownerNameZIndex // ignore: cast_nullable_to_non_nullable
as int?,ownerNameOffsetX: freezed == ownerNameOffsetX ? _self.ownerNameOffsetX : ownerNameOffsetX // ignore: cast_nullable_to_non_nullable
as int?,ownerNameOffsetY: freezed == ownerNameOffsetY ? _self.ownerNameOffsetY : ownerNameOffsetY // ignore: cast_nullable_to_non_nullable
as int?,heroMainImageUrl: freezed == heroMainImageUrl ? _self.heroMainImageUrl : heroMainImageUrl // ignore: cast_nullable_to_non_nullable
as String?,heroMainImageAlt: freezed == heroMainImageAlt ? _self.heroMainImageAlt : heroMainImageAlt // ignore: cast_nullable_to_non_nullable
as String?,heroMainImageCaption: freezed == heroMainImageCaption ? _self.heroMainImageCaption : heroMainImageCaption // ignore: cast_nullable_to_non_nullable
as String?,heroImageStyle: freezed == heroImageStyle ? _self.heroImageStyle : heroImageStyle // ignore: cast_nullable_to_non_nullable
as String?,heroMainImageZIndex: freezed == heroMainImageZIndex ? _self.heroMainImageZIndex : heroMainImageZIndex // ignore: cast_nullable_to_non_nullable
as int?,heroMainImageOffsetX: freezed == heroMainImageOffsetX ? _self.heroMainImageOffsetX : heroMainImageOffsetX // ignore: cast_nullable_to_non_nullable
as int?,heroMainImageOffsetY: freezed == heroMainImageOffsetY ? _self.heroMainImageOffsetY : heroMainImageOffsetY // ignore: cast_nullable_to_non_nullable
as int?,illustrationUrl: freezed == illustrationUrl ? _self.illustrationUrl : illustrationUrl // ignore: cast_nullable_to_non_nullable
as String?,illustrationAlt: freezed == illustrationAlt ? _self.illustrationAlt : illustrationAlt // ignore: cast_nullable_to_non_nullable
as String?,illustrationZIndex: freezed == illustrationZIndex ? _self.illustrationZIndex : illustrationZIndex // ignore: cast_nullable_to_non_nullable
as int?,illustrationOpacity: freezed == illustrationOpacity ? _self.illustrationOpacity : illustrationOpacity // ignore: cast_nullable_to_non_nullable
as int?,illustrationSize: freezed == illustrationSize ? _self.illustrationSize : illustrationSize // ignore: cast_nullable_to_non_nullable
as int?,illustrationOffsetX: freezed == illustrationOffsetX ? _self.illustrationOffsetX : illustrationOffsetX // ignore: cast_nullable_to_non_nullable
as int?,illustrationOffsetY: freezed == illustrationOffsetY ? _self.illustrationOffsetY : illustrationOffsetY // ignore: cast_nullable_to_non_nullable
as int?,illustrationRotation: freezed == illustrationRotation ? _self.illustrationRotation : illustrationRotation // ignore: cast_nullable_to_non_nullable
as int?,ctaText: freezed == ctaText ? _self.ctaText : ctaText // ignore: cast_nullable_to_non_nullable
as String?,ctaLink: freezed == ctaLink ? _self.ctaLink : ctaLink // ignore: cast_nullable_to_non_nullable
as String?,ctaFont: freezed == ctaFont ? _self.ctaFont : ctaFont // ignore: cast_nullable_to_non_nullable
as String?,ctaFontUrl: freezed == ctaFontUrl ? _self.ctaFontUrl : ctaFontUrl // ignore: cast_nullable_to_non_nullable
as String?,ctaFontSize: freezed == ctaFontSize ? _self.ctaFontSize : ctaFontSize // ignore: cast_nullable_to_non_nullable
as int?,ctaVariant: freezed == ctaVariant ? _self.ctaVariant : ctaVariant // ignore: cast_nullable_to_non_nullable
as String?,ctaSize: freezed == ctaSize ? _self.ctaSize : ctaSize // ignore: cast_nullable_to_non_nullable
as String?,ctaOffsetX: freezed == ctaOffsetX ? _self.ctaOffsetX : ctaOffsetX // ignore: cast_nullable_to_non_nullable
as int?,ctaOffsetY: freezed == ctaOffsetY ? _self.ctaOffsetY : ctaOffsetY // ignore: cast_nullable_to_non_nullable
as int?,heroTitle1MobileOffsetX: freezed == heroTitle1MobileOffsetX ? _self.heroTitle1MobileOffsetX : heroTitle1MobileOffsetX // ignore: cast_nullable_to_non_nullable
as int?,heroTitle1MobileOffsetY: freezed == heroTitle1MobileOffsetY ? _self.heroTitle1MobileOffsetY : heroTitle1MobileOffsetY // ignore: cast_nullable_to_non_nullable
as int?,heroTitle1MobileFontSize: freezed == heroTitle1MobileFontSize ? _self.heroTitle1MobileFontSize : heroTitle1MobileFontSize // ignore: cast_nullable_to_non_nullable
as int?,heroTitle2MobileOffsetX: freezed == heroTitle2MobileOffsetX ? _self.heroTitle2MobileOffsetX : heroTitle2MobileOffsetX // ignore: cast_nullable_to_non_nullable
as int?,heroTitle2MobileOffsetY: freezed == heroTitle2MobileOffsetY ? _self.heroTitle2MobileOffsetY : heroTitle2MobileOffsetY // ignore: cast_nullable_to_non_nullable
as int?,heroTitle2MobileFontSize: freezed == heroTitle2MobileFontSize ? _self.heroTitle2MobileFontSize : heroTitle2MobileFontSize // ignore: cast_nullable_to_non_nullable
as int?,ownerNameMobileOffsetX: freezed == ownerNameMobileOffsetX ? _self.ownerNameMobileOffsetX : ownerNameMobileOffsetX // ignore: cast_nullable_to_non_nullable
as int?,ownerNameMobileOffsetY: freezed == ownerNameMobileOffsetY ? _self.ownerNameMobileOffsetY : ownerNameMobileOffsetY // ignore: cast_nullable_to_non_nullable
as int?,ownerNameMobileFontSize: freezed == ownerNameMobileFontSize ? _self.ownerNameMobileFontSize : ownerNameMobileFontSize // ignore: cast_nullable_to_non_nullable
as int?,heroMainImageMobileOffsetX: freezed == heroMainImageMobileOffsetX ? _self.heroMainImageMobileOffsetX : heroMainImageMobileOffsetX // ignore: cast_nullable_to_non_nullable
as int?,heroMainImageMobileOffsetY: freezed == heroMainImageMobileOffsetY ? _self.heroMainImageMobileOffsetY : heroMainImageMobileOffsetY // ignore: cast_nullable_to_non_nullable
as int?,illustrationMobileOffsetX: freezed == illustrationMobileOffsetX ? _self.illustrationMobileOffsetX : illustrationMobileOffsetX // ignore: cast_nullable_to_non_nullable
as int?,illustrationMobileOffsetY: freezed == illustrationMobileOffsetY ? _self.illustrationMobileOffsetY : illustrationMobileOffsetY // ignore: cast_nullable_to_non_nullable
as int?,illustrationMobileSize: freezed == illustrationMobileSize ? _self.illustrationMobileSize : illustrationMobileSize // ignore: cast_nullable_to_non_nullable
as int?,illustrationMobileRotation: freezed == illustrationMobileRotation ? _self.illustrationMobileRotation : illustrationMobileRotation // ignore: cast_nullable_to_non_nullable
as int?,ctaMobileOffsetX: freezed == ctaMobileOffsetX ? _self.ctaMobileOffsetX : ctaMobileOffsetX // ignore: cast_nullable_to_non_nullable
as int?,ctaMobileOffsetY: freezed == ctaMobileOffsetY ? _self.ctaMobileOffsetY : ctaMobileOffsetY // ignore: cast_nullable_to_non_nullable
as int?,ctaMobileFontSize: freezed == ctaMobileFontSize ? _self.ctaMobileFontSize : ctaMobileFontSize // ignore: cast_nullable_to_non_nullable
as int?,showFeaturedProjects: null == showFeaturedProjects ? _self.showFeaturedProjects : showFeaturedProjects // ignore: cast_nullable_to_non_nullable
as bool,featuredTitle: freezed == featuredTitle ? _self.featuredTitle : featuredTitle // ignore: cast_nullable_to_non_nullable
as String?,featuredTitleFont: freezed == featuredTitleFont ? _self.featuredTitleFont : featuredTitleFont // ignore: cast_nullable_to_non_nullable
as String?,featuredTitleFontUrl: freezed == featuredTitleFontUrl ? _self.featuredTitleFontUrl : featuredTitleFontUrl // ignore: cast_nullable_to_non_nullable
as String?,featuredTitleFontSize: freezed == featuredTitleFontSize ? _self.featuredTitleFontSize : featuredTitleFontSize // ignore: cast_nullable_to_non_nullable
as int?,featuredTitleColor: freezed == featuredTitleColor ? _self.featuredTitleColor : featuredTitleColor // ignore: cast_nullable_to_non_nullable
as String?,featuredTitleColorDark: freezed == featuredTitleColorDark ? _self.featuredTitleColorDark : featuredTitleColorDark // ignore: cast_nullable_to_non_nullable
as String?,featuredCount: null == featuredCount ? _self.featuredCount : featuredCount // ignore: cast_nullable_to_non_nullable
as int,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}


}


/// @nodoc
mixin _$CategoryDisplaySettings {

 String? get id; bool get showDescription; bool get showProjectCount; int get gridColumns; bool get isActive;
/// Create a copy of CategoryDisplaySettings
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CategoryDisplaySettingsCopyWith<CategoryDisplaySettings> get copyWith => _$CategoryDisplaySettingsCopyWithImpl<CategoryDisplaySettings>(this as CategoryDisplaySettings, _$identity);

  /// Serializes this CategoryDisplaySettings to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CategoryDisplaySettings&&(identical(other.id, id) || other.id == id)&&(identical(other.showDescription, showDescription) || other.showDescription == showDescription)&&(identical(other.showProjectCount, showProjectCount) || other.showProjectCount == showProjectCount)&&(identical(other.gridColumns, gridColumns) || other.gridColumns == gridColumns)&&(identical(other.isActive, isActive) || other.isActive == isActive));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,showDescription,showProjectCount,gridColumns,isActive);

@override
String toString() {
  return 'CategoryDisplaySettings(id: $id, showDescription: $showDescription, showProjectCount: $showProjectCount, gridColumns: $gridColumns, isActive: $isActive)';
}


}

/// @nodoc
abstract mixin class $CategoryDisplaySettingsCopyWith<$Res>  {
  factory $CategoryDisplaySettingsCopyWith(CategoryDisplaySettings value, $Res Function(CategoryDisplaySettings) _then) = _$CategoryDisplaySettingsCopyWithImpl;
@useResult
$Res call({
 String? id, bool showDescription, bool showProjectCount, int gridColumns, bool isActive
});




}
/// @nodoc
class _$CategoryDisplaySettingsCopyWithImpl<$Res>
    implements $CategoryDisplaySettingsCopyWith<$Res> {
  _$CategoryDisplaySettingsCopyWithImpl(this._self, this._then);

  final CategoryDisplaySettings _self;
  final $Res Function(CategoryDisplaySettings) _then;

/// Create a copy of CategoryDisplaySettings
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = freezed,Object? showDescription = null,Object? showProjectCount = null,Object? gridColumns = null,Object? isActive = null,}) {
  return _then(_self.copyWith(
id: freezed == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String?,showDescription: null == showDescription ? _self.showDescription : showDescription // ignore: cast_nullable_to_non_nullable
as bool,showProjectCount: null == showProjectCount ? _self.showProjectCount : showProjectCount // ignore: cast_nullable_to_non_nullable
as bool,gridColumns: null == gridColumns ? _self.gridColumns : gridColumns // ignore: cast_nullable_to_non_nullable
as int,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}

}


/// Adds pattern-matching-related methods to [CategoryDisplaySettings].
extension CategoryDisplaySettingsPatterns on CategoryDisplaySettings {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _CategoryDisplaySettings value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _CategoryDisplaySettings() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _CategoryDisplaySettings value)  $default,){
final _that = this;
switch (_that) {
case _CategoryDisplaySettings():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _CategoryDisplaySettings value)?  $default,){
final _that = this;
switch (_that) {
case _CategoryDisplaySettings() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String? id,  bool showDescription,  bool showProjectCount,  int gridColumns,  bool isActive)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CategoryDisplaySettings() when $default != null:
return $default(_that.id,_that.showDescription,_that.showProjectCount,_that.gridColumns,_that.isActive);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String? id,  bool showDescription,  bool showProjectCount,  int gridColumns,  bool isActive)  $default,) {final _that = this;
switch (_that) {
case _CategoryDisplaySettings():
return $default(_that.id,_that.showDescription,_that.showProjectCount,_that.gridColumns,_that.isActive);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String? id,  bool showDescription,  bool showProjectCount,  int gridColumns,  bool isActive)?  $default,) {final _that = this;
switch (_that) {
case _CategoryDisplaySettings() when $default != null:
return $default(_that.id,_that.showDescription,_that.showProjectCount,_that.gridColumns,_that.isActive);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _CategoryDisplaySettings implements CategoryDisplaySettings {
  const _CategoryDisplaySettings({this.id, this.showDescription = true, this.showProjectCount = true, this.gridColumns = 4, this.isActive = true});
  factory _CategoryDisplaySettings.fromJson(Map<String, dynamic> json) => _$CategoryDisplaySettingsFromJson(json);

@override final  String? id;
@override@JsonKey() final  bool showDescription;
@override@JsonKey() final  bool showProjectCount;
@override@JsonKey() final  int gridColumns;
@override@JsonKey() final  bool isActive;

/// Create a copy of CategoryDisplaySettings
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CategoryDisplaySettingsCopyWith<_CategoryDisplaySettings> get copyWith => __$CategoryDisplaySettingsCopyWithImpl<_CategoryDisplaySettings>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$CategoryDisplaySettingsToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _CategoryDisplaySettings&&(identical(other.id, id) || other.id == id)&&(identical(other.showDescription, showDescription) || other.showDescription == showDescription)&&(identical(other.showProjectCount, showProjectCount) || other.showProjectCount == showProjectCount)&&(identical(other.gridColumns, gridColumns) || other.gridColumns == gridColumns)&&(identical(other.isActive, isActive) || other.isActive == isActive));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,showDescription,showProjectCount,gridColumns,isActive);

@override
String toString() {
  return 'CategoryDisplaySettings(id: $id, showDescription: $showDescription, showProjectCount: $showProjectCount, gridColumns: $gridColumns, isActive: $isActive)';
}


}

/// @nodoc
abstract mixin class _$CategoryDisplaySettingsCopyWith<$Res> implements $CategoryDisplaySettingsCopyWith<$Res> {
  factory _$CategoryDisplaySettingsCopyWith(_CategoryDisplaySettings value, $Res Function(_CategoryDisplaySettings) _then) = __$CategoryDisplaySettingsCopyWithImpl;
@override @useResult
$Res call({
 String? id, bool showDescription, bool showProjectCount, int gridColumns, bool isActive
});




}
/// @nodoc
class __$CategoryDisplaySettingsCopyWithImpl<$Res>
    implements _$CategoryDisplaySettingsCopyWith<$Res> {
  __$CategoryDisplaySettingsCopyWithImpl(this._self, this._then);

  final _CategoryDisplaySettings _self;
  final $Res Function(_CategoryDisplaySettings) _then;

/// Create a copy of CategoryDisplaySettings
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = freezed,Object? showDescription = null,Object? showProjectCount = null,Object? gridColumns = null,Object? isActive = null,}) {
  return _then(_CategoryDisplaySettings(
id: freezed == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String?,showDescription: null == showDescription ? _self.showDescription : showDescription // ignore: cast_nullable_to_non_nullable
as bool,showProjectCount: null == showProjectCount ? _self.showProjectCount : showProjectCount // ignore: cast_nullable_to_non_nullable
as bool,gridColumns: null == gridColumns ? _self.gridColumns : gridColumns // ignore: cast_nullable_to_non_nullable
as int,isActive: null == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
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
