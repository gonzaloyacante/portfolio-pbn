// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'contact_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ContactItem {

 String get id; String get name; String get email; String? get phone; String? get subject; String get status; String get priority; bool get isRead; bool get isReplied; DateTime? get readAt; DateTime? get repliedAt; int? get leadScore; String? get leadSource; List<String> get tags; DateTime get createdAt; DateTime get updatedAt;
/// Create a copy of ContactItem
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ContactItemCopyWith<ContactItem> get copyWith => _$ContactItemCopyWithImpl<ContactItem>(this as ContactItem, _$identity);

  /// Serializes this ContactItem to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ContactItem&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.email, email) || other.email == email)&&(identical(other.phone, phone) || other.phone == phone)&&(identical(other.subject, subject) || other.subject == subject)&&(identical(other.status, status) || other.status == status)&&(identical(other.priority, priority) || other.priority == priority)&&(identical(other.isRead, isRead) || other.isRead == isRead)&&(identical(other.isReplied, isReplied) || other.isReplied == isReplied)&&(identical(other.readAt, readAt) || other.readAt == readAt)&&(identical(other.repliedAt, repliedAt) || other.repliedAt == repliedAt)&&(identical(other.leadScore, leadScore) || other.leadScore == leadScore)&&(identical(other.leadSource, leadSource) || other.leadSource == leadSource)&&const DeepCollectionEquality().equals(other.tags, tags)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name,email,phone,subject,status,priority,isRead,isReplied,readAt,repliedAt,leadScore,leadSource,const DeepCollectionEquality().hash(tags),createdAt,updatedAt);

@override
String toString() {
  return 'ContactItem(id: $id, name: $name, email: $email, phone: $phone, subject: $subject, status: $status, priority: $priority, isRead: $isRead, isReplied: $isReplied, readAt: $readAt, repliedAt: $repliedAt, leadScore: $leadScore, leadSource: $leadSource, tags: $tags, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $ContactItemCopyWith<$Res>  {
  factory $ContactItemCopyWith(ContactItem value, $Res Function(ContactItem) _then) = _$ContactItemCopyWithImpl;
@useResult
$Res call({
 String id, String name, String email, String? phone, String? subject, String status, String priority, bool isRead, bool isReplied, DateTime? readAt, DateTime? repliedAt, int? leadScore, String? leadSource, List<String> tags, DateTime createdAt, DateTime updatedAt
});




}
/// @nodoc
class _$ContactItemCopyWithImpl<$Res>
    implements $ContactItemCopyWith<$Res> {
  _$ContactItemCopyWithImpl(this._self, this._then);

  final ContactItem _self;
  final $Res Function(ContactItem) _then;

/// Create a copy of ContactItem
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? email = null,Object? phone = freezed,Object? subject = freezed,Object? status = null,Object? priority = null,Object? isRead = null,Object? isReplied = null,Object? readAt = freezed,Object? repliedAt = freezed,Object? leadScore = freezed,Object? leadSource = freezed,Object? tags = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,phone: freezed == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String?,subject: freezed == subject ? _self.subject : subject // ignore: cast_nullable_to_non_nullable
as String?,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,priority: null == priority ? _self.priority : priority // ignore: cast_nullable_to_non_nullable
as String,isRead: null == isRead ? _self.isRead : isRead // ignore: cast_nullable_to_non_nullable
as bool,isReplied: null == isReplied ? _self.isReplied : isReplied // ignore: cast_nullable_to_non_nullable
as bool,readAt: freezed == readAt ? _self.readAt : readAt // ignore: cast_nullable_to_non_nullable
as DateTime?,repliedAt: freezed == repliedAt ? _self.repliedAt : repliedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,leadScore: freezed == leadScore ? _self.leadScore : leadScore // ignore: cast_nullable_to_non_nullable
as int?,leadSource: freezed == leadSource ? _self.leadSource : leadSource // ignore: cast_nullable_to_non_nullable
as String?,tags: null == tags ? _self.tags : tags // ignore: cast_nullable_to_non_nullable
as List<String>,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

}


/// Adds pattern-matching-related methods to [ContactItem].
extension ContactItemPatterns on ContactItem {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ContactItem value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ContactItem() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ContactItem value)  $default,){
final _that = this;
switch (_that) {
case _ContactItem():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ContactItem value)?  $default,){
final _that = this;
switch (_that) {
case _ContactItem() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String name,  String email,  String? phone,  String? subject,  String status,  String priority,  bool isRead,  bool isReplied,  DateTime? readAt,  DateTime? repliedAt,  int? leadScore,  String? leadSource,  List<String> tags,  DateTime createdAt,  DateTime updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ContactItem() when $default != null:
return $default(_that.id,_that.name,_that.email,_that.phone,_that.subject,_that.status,_that.priority,_that.isRead,_that.isReplied,_that.readAt,_that.repliedAt,_that.leadScore,_that.leadSource,_that.tags,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String name,  String email,  String? phone,  String? subject,  String status,  String priority,  bool isRead,  bool isReplied,  DateTime? readAt,  DateTime? repliedAt,  int? leadScore,  String? leadSource,  List<String> tags,  DateTime createdAt,  DateTime updatedAt)  $default,) {final _that = this;
switch (_that) {
case _ContactItem():
return $default(_that.id,_that.name,_that.email,_that.phone,_that.subject,_that.status,_that.priority,_that.isRead,_that.isReplied,_that.readAt,_that.repliedAt,_that.leadScore,_that.leadSource,_that.tags,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String name,  String email,  String? phone,  String? subject,  String status,  String priority,  bool isRead,  bool isReplied,  DateTime? readAt,  DateTime? repliedAt,  int? leadScore,  String? leadSource,  List<String> tags,  DateTime createdAt,  DateTime updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _ContactItem() when $default != null:
return $default(_that.id,_that.name,_that.email,_that.phone,_that.subject,_that.status,_that.priority,_that.isRead,_that.isReplied,_that.readAt,_that.repliedAt,_that.leadScore,_that.leadSource,_that.tags,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ContactItem implements ContactItem {
  const _ContactItem({required this.id, required this.name, required this.email, this.phone, this.subject, this.status = 'NEW', this.priority = 'MEDIUM', this.isRead = false, this.isReplied = false, this.readAt, this.repliedAt, this.leadScore, this.leadSource, final  List<String> tags = const [], required this.createdAt, required this.updatedAt}): _tags = tags;
  factory _ContactItem.fromJson(Map<String, dynamic> json) => _$ContactItemFromJson(json);

@override final  String id;
@override final  String name;
@override final  String email;
@override final  String? phone;
@override final  String? subject;
@override@JsonKey() final  String status;
@override@JsonKey() final  String priority;
@override@JsonKey() final  bool isRead;
@override@JsonKey() final  bool isReplied;
@override final  DateTime? readAt;
@override final  DateTime? repliedAt;
@override final  int? leadScore;
@override final  String? leadSource;
 final  List<String> _tags;
@override@JsonKey() List<String> get tags {
  if (_tags is EqualUnmodifiableListView) return _tags;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_tags);
}

@override final  DateTime createdAt;
@override final  DateTime updatedAt;

/// Create a copy of ContactItem
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ContactItemCopyWith<_ContactItem> get copyWith => __$ContactItemCopyWithImpl<_ContactItem>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ContactItemToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ContactItem&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.email, email) || other.email == email)&&(identical(other.phone, phone) || other.phone == phone)&&(identical(other.subject, subject) || other.subject == subject)&&(identical(other.status, status) || other.status == status)&&(identical(other.priority, priority) || other.priority == priority)&&(identical(other.isRead, isRead) || other.isRead == isRead)&&(identical(other.isReplied, isReplied) || other.isReplied == isReplied)&&(identical(other.readAt, readAt) || other.readAt == readAt)&&(identical(other.repliedAt, repliedAt) || other.repliedAt == repliedAt)&&(identical(other.leadScore, leadScore) || other.leadScore == leadScore)&&(identical(other.leadSource, leadSource) || other.leadSource == leadSource)&&const DeepCollectionEquality().equals(other._tags, _tags)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name,email,phone,subject,status,priority,isRead,isReplied,readAt,repliedAt,leadScore,leadSource,const DeepCollectionEquality().hash(_tags),createdAt,updatedAt);

@override
String toString() {
  return 'ContactItem(id: $id, name: $name, email: $email, phone: $phone, subject: $subject, status: $status, priority: $priority, isRead: $isRead, isReplied: $isReplied, readAt: $readAt, repliedAt: $repliedAt, leadScore: $leadScore, leadSource: $leadSource, tags: $tags, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$ContactItemCopyWith<$Res> implements $ContactItemCopyWith<$Res> {
  factory _$ContactItemCopyWith(_ContactItem value, $Res Function(_ContactItem) _then) = __$ContactItemCopyWithImpl;
@override @useResult
$Res call({
 String id, String name, String email, String? phone, String? subject, String status, String priority, bool isRead, bool isReplied, DateTime? readAt, DateTime? repliedAt, int? leadScore, String? leadSource, List<String> tags, DateTime createdAt, DateTime updatedAt
});




}
/// @nodoc
class __$ContactItemCopyWithImpl<$Res>
    implements _$ContactItemCopyWith<$Res> {
  __$ContactItemCopyWithImpl(this._self, this._then);

  final _ContactItem _self;
  final $Res Function(_ContactItem) _then;

/// Create a copy of ContactItem
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? email = null,Object? phone = freezed,Object? subject = freezed,Object? status = null,Object? priority = null,Object? isRead = null,Object? isReplied = null,Object? readAt = freezed,Object? repliedAt = freezed,Object? leadScore = freezed,Object? leadSource = freezed,Object? tags = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_ContactItem(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,phone: freezed == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String?,subject: freezed == subject ? _self.subject : subject // ignore: cast_nullable_to_non_nullable
as String?,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,priority: null == priority ? _self.priority : priority // ignore: cast_nullable_to_non_nullable
as String,isRead: null == isRead ? _self.isRead : isRead // ignore: cast_nullable_to_non_nullable
as bool,isReplied: null == isReplied ? _self.isReplied : isReplied // ignore: cast_nullable_to_non_nullable
as bool,readAt: freezed == readAt ? _self.readAt : readAt // ignore: cast_nullable_to_non_nullable
as DateTime?,repliedAt: freezed == repliedAt ? _self.repliedAt : repliedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,leadScore: freezed == leadScore ? _self.leadScore : leadScore // ignore: cast_nullable_to_non_nullable
as int?,leadSource: freezed == leadSource ? _self.leadSource : leadSource // ignore: cast_nullable_to_non_nullable
as String?,tags: null == tags ? _self._tags : tags // ignore: cast_nullable_to_non_nullable
as List<String>,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}


}


/// @nodoc
mixin _$ContactDetail {

 String get id; String get name; String get email; String? get phone; String get message; String? get subject; String get responsePreference; int? get leadScore; String? get leadSource; String get status; String get priority; String? get assignedTo; bool get isRead; DateTime? get readAt; String? get readBy; bool get isReplied; DateTime? get repliedAt; String? get repliedBy; String? get replyText; String? get adminNote; List<String> get tags; String? get ipAddress; String? get referrer; String? get utmSource; String? get utmMedium; String? get utmCampaign; DateTime get createdAt; DateTime get updatedAt;
/// Create a copy of ContactDetail
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ContactDetailCopyWith<ContactDetail> get copyWith => _$ContactDetailCopyWithImpl<ContactDetail>(this as ContactDetail, _$identity);

  /// Serializes this ContactDetail to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ContactDetail&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.email, email) || other.email == email)&&(identical(other.phone, phone) || other.phone == phone)&&(identical(other.message, message) || other.message == message)&&(identical(other.subject, subject) || other.subject == subject)&&(identical(other.responsePreference, responsePreference) || other.responsePreference == responsePreference)&&(identical(other.leadScore, leadScore) || other.leadScore == leadScore)&&(identical(other.leadSource, leadSource) || other.leadSource == leadSource)&&(identical(other.status, status) || other.status == status)&&(identical(other.priority, priority) || other.priority == priority)&&(identical(other.assignedTo, assignedTo) || other.assignedTo == assignedTo)&&(identical(other.isRead, isRead) || other.isRead == isRead)&&(identical(other.readAt, readAt) || other.readAt == readAt)&&(identical(other.readBy, readBy) || other.readBy == readBy)&&(identical(other.isReplied, isReplied) || other.isReplied == isReplied)&&(identical(other.repliedAt, repliedAt) || other.repliedAt == repliedAt)&&(identical(other.repliedBy, repliedBy) || other.repliedBy == repliedBy)&&(identical(other.replyText, replyText) || other.replyText == replyText)&&(identical(other.adminNote, adminNote) || other.adminNote == adminNote)&&const DeepCollectionEquality().equals(other.tags, tags)&&(identical(other.ipAddress, ipAddress) || other.ipAddress == ipAddress)&&(identical(other.referrer, referrer) || other.referrer == referrer)&&(identical(other.utmSource, utmSource) || other.utmSource == utmSource)&&(identical(other.utmMedium, utmMedium) || other.utmMedium == utmMedium)&&(identical(other.utmCampaign, utmCampaign) || other.utmCampaign == utmCampaign)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hashAll([runtimeType,id,name,email,phone,message,subject,responsePreference,leadScore,leadSource,status,priority,assignedTo,isRead,readAt,readBy,isReplied,repliedAt,repliedBy,replyText,adminNote,const DeepCollectionEquality().hash(tags),ipAddress,referrer,utmSource,utmMedium,utmCampaign,createdAt,updatedAt]);

@override
String toString() {
  return 'ContactDetail(id: $id, name: $name, email: $email, phone: $phone, message: $message, subject: $subject, responsePreference: $responsePreference, leadScore: $leadScore, leadSource: $leadSource, status: $status, priority: $priority, assignedTo: $assignedTo, isRead: $isRead, readAt: $readAt, readBy: $readBy, isReplied: $isReplied, repliedAt: $repliedAt, repliedBy: $repliedBy, replyText: $replyText, adminNote: $adminNote, tags: $tags, ipAddress: $ipAddress, referrer: $referrer, utmSource: $utmSource, utmMedium: $utmMedium, utmCampaign: $utmCampaign, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $ContactDetailCopyWith<$Res>  {
  factory $ContactDetailCopyWith(ContactDetail value, $Res Function(ContactDetail) _then) = _$ContactDetailCopyWithImpl;
@useResult
$Res call({
 String id, String name, String email, String? phone, String message, String? subject, String responsePreference, int? leadScore, String? leadSource, String status, String priority, String? assignedTo, bool isRead, DateTime? readAt, String? readBy, bool isReplied, DateTime? repliedAt, String? repliedBy, String? replyText, String? adminNote, List<String> tags, String? ipAddress, String? referrer, String? utmSource, String? utmMedium, String? utmCampaign, DateTime createdAt, DateTime updatedAt
});




}
/// @nodoc
class _$ContactDetailCopyWithImpl<$Res>
    implements $ContactDetailCopyWith<$Res> {
  _$ContactDetailCopyWithImpl(this._self, this._then);

  final ContactDetail _self;
  final $Res Function(ContactDetail) _then;

/// Create a copy of ContactDetail
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? email = null,Object? phone = freezed,Object? message = null,Object? subject = freezed,Object? responsePreference = null,Object? leadScore = freezed,Object? leadSource = freezed,Object? status = null,Object? priority = null,Object? assignedTo = freezed,Object? isRead = null,Object? readAt = freezed,Object? readBy = freezed,Object? isReplied = null,Object? repliedAt = freezed,Object? repliedBy = freezed,Object? replyText = freezed,Object? adminNote = freezed,Object? tags = null,Object? ipAddress = freezed,Object? referrer = freezed,Object? utmSource = freezed,Object? utmMedium = freezed,Object? utmCampaign = freezed,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,phone: freezed == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String?,message: null == message ? _self.message : message // ignore: cast_nullable_to_non_nullable
as String,subject: freezed == subject ? _self.subject : subject // ignore: cast_nullable_to_non_nullable
as String?,responsePreference: null == responsePreference ? _self.responsePreference : responsePreference // ignore: cast_nullable_to_non_nullable
as String,leadScore: freezed == leadScore ? _self.leadScore : leadScore // ignore: cast_nullable_to_non_nullable
as int?,leadSource: freezed == leadSource ? _self.leadSource : leadSource // ignore: cast_nullable_to_non_nullable
as String?,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,priority: null == priority ? _self.priority : priority // ignore: cast_nullable_to_non_nullable
as String,assignedTo: freezed == assignedTo ? _self.assignedTo : assignedTo // ignore: cast_nullable_to_non_nullable
as String?,isRead: null == isRead ? _self.isRead : isRead // ignore: cast_nullable_to_non_nullable
as bool,readAt: freezed == readAt ? _self.readAt : readAt // ignore: cast_nullable_to_non_nullable
as DateTime?,readBy: freezed == readBy ? _self.readBy : readBy // ignore: cast_nullable_to_non_nullable
as String?,isReplied: null == isReplied ? _self.isReplied : isReplied // ignore: cast_nullable_to_non_nullable
as bool,repliedAt: freezed == repliedAt ? _self.repliedAt : repliedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,repliedBy: freezed == repliedBy ? _self.repliedBy : repliedBy // ignore: cast_nullable_to_non_nullable
as String?,replyText: freezed == replyText ? _self.replyText : replyText // ignore: cast_nullable_to_non_nullable
as String?,adminNote: freezed == adminNote ? _self.adminNote : adminNote // ignore: cast_nullable_to_non_nullable
as String?,tags: null == tags ? _self.tags : tags // ignore: cast_nullable_to_non_nullable
as List<String>,ipAddress: freezed == ipAddress ? _self.ipAddress : ipAddress // ignore: cast_nullable_to_non_nullable
as String?,referrer: freezed == referrer ? _self.referrer : referrer // ignore: cast_nullable_to_non_nullable
as String?,utmSource: freezed == utmSource ? _self.utmSource : utmSource // ignore: cast_nullable_to_non_nullable
as String?,utmMedium: freezed == utmMedium ? _self.utmMedium : utmMedium // ignore: cast_nullable_to_non_nullable
as String?,utmCampaign: freezed == utmCampaign ? _self.utmCampaign : utmCampaign // ignore: cast_nullable_to_non_nullable
as String?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

}


/// Adds pattern-matching-related methods to [ContactDetail].
extension ContactDetailPatterns on ContactDetail {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ContactDetail value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ContactDetail() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ContactDetail value)  $default,){
final _that = this;
switch (_that) {
case _ContactDetail():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ContactDetail value)?  $default,){
final _that = this;
switch (_that) {
case _ContactDetail() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String name,  String email,  String? phone,  String message,  String? subject,  String responsePreference,  int? leadScore,  String? leadSource,  String status,  String priority,  String? assignedTo,  bool isRead,  DateTime? readAt,  String? readBy,  bool isReplied,  DateTime? repliedAt,  String? repliedBy,  String? replyText,  String? adminNote,  List<String> tags,  String? ipAddress,  String? referrer,  String? utmSource,  String? utmMedium,  String? utmCampaign,  DateTime createdAt,  DateTime updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ContactDetail() when $default != null:
return $default(_that.id,_that.name,_that.email,_that.phone,_that.message,_that.subject,_that.responsePreference,_that.leadScore,_that.leadSource,_that.status,_that.priority,_that.assignedTo,_that.isRead,_that.readAt,_that.readBy,_that.isReplied,_that.repliedAt,_that.repliedBy,_that.replyText,_that.adminNote,_that.tags,_that.ipAddress,_that.referrer,_that.utmSource,_that.utmMedium,_that.utmCampaign,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String name,  String email,  String? phone,  String message,  String? subject,  String responsePreference,  int? leadScore,  String? leadSource,  String status,  String priority,  String? assignedTo,  bool isRead,  DateTime? readAt,  String? readBy,  bool isReplied,  DateTime? repliedAt,  String? repliedBy,  String? replyText,  String? adminNote,  List<String> tags,  String? ipAddress,  String? referrer,  String? utmSource,  String? utmMedium,  String? utmCampaign,  DateTime createdAt,  DateTime updatedAt)  $default,) {final _that = this;
switch (_that) {
case _ContactDetail():
return $default(_that.id,_that.name,_that.email,_that.phone,_that.message,_that.subject,_that.responsePreference,_that.leadScore,_that.leadSource,_that.status,_that.priority,_that.assignedTo,_that.isRead,_that.readAt,_that.readBy,_that.isReplied,_that.repliedAt,_that.repliedBy,_that.replyText,_that.adminNote,_that.tags,_that.ipAddress,_that.referrer,_that.utmSource,_that.utmMedium,_that.utmCampaign,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String name,  String email,  String? phone,  String message,  String? subject,  String responsePreference,  int? leadScore,  String? leadSource,  String status,  String priority,  String? assignedTo,  bool isRead,  DateTime? readAt,  String? readBy,  bool isReplied,  DateTime? repliedAt,  String? repliedBy,  String? replyText,  String? adminNote,  List<String> tags,  String? ipAddress,  String? referrer,  String? utmSource,  String? utmMedium,  String? utmCampaign,  DateTime createdAt,  DateTime updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _ContactDetail() when $default != null:
return $default(_that.id,_that.name,_that.email,_that.phone,_that.message,_that.subject,_that.responsePreference,_that.leadScore,_that.leadSource,_that.status,_that.priority,_that.assignedTo,_that.isRead,_that.readAt,_that.readBy,_that.isReplied,_that.repliedAt,_that.repliedBy,_that.replyText,_that.adminNote,_that.tags,_that.ipAddress,_that.referrer,_that.utmSource,_that.utmMedium,_that.utmCampaign,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ContactDetail implements ContactDetail {
  const _ContactDetail({required this.id, required this.name, required this.email, this.phone, required this.message, this.subject, this.responsePreference = 'EMAIL', this.leadScore, this.leadSource, this.status = 'NEW', this.priority = 'MEDIUM', this.assignedTo, this.isRead = false, this.readAt, this.readBy, this.isReplied = false, this.repliedAt, this.repliedBy, this.replyText, this.adminNote, final  List<String> tags = const [], this.ipAddress, this.referrer, this.utmSource, this.utmMedium, this.utmCampaign, required this.createdAt, required this.updatedAt}): _tags = tags;
  factory _ContactDetail.fromJson(Map<String, dynamic> json) => _$ContactDetailFromJson(json);

@override final  String id;
@override final  String name;
@override final  String email;
@override final  String? phone;
@override final  String message;
@override final  String? subject;
@override@JsonKey() final  String responsePreference;
@override final  int? leadScore;
@override final  String? leadSource;
@override@JsonKey() final  String status;
@override@JsonKey() final  String priority;
@override final  String? assignedTo;
@override@JsonKey() final  bool isRead;
@override final  DateTime? readAt;
@override final  String? readBy;
@override@JsonKey() final  bool isReplied;
@override final  DateTime? repliedAt;
@override final  String? repliedBy;
@override final  String? replyText;
@override final  String? adminNote;
 final  List<String> _tags;
@override@JsonKey() List<String> get tags {
  if (_tags is EqualUnmodifiableListView) return _tags;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_tags);
}

@override final  String? ipAddress;
@override final  String? referrer;
@override final  String? utmSource;
@override final  String? utmMedium;
@override final  String? utmCampaign;
@override final  DateTime createdAt;
@override final  DateTime updatedAt;

/// Create a copy of ContactDetail
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ContactDetailCopyWith<_ContactDetail> get copyWith => __$ContactDetailCopyWithImpl<_ContactDetail>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ContactDetailToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ContactDetail&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.email, email) || other.email == email)&&(identical(other.phone, phone) || other.phone == phone)&&(identical(other.message, message) || other.message == message)&&(identical(other.subject, subject) || other.subject == subject)&&(identical(other.responsePreference, responsePreference) || other.responsePreference == responsePreference)&&(identical(other.leadScore, leadScore) || other.leadScore == leadScore)&&(identical(other.leadSource, leadSource) || other.leadSource == leadSource)&&(identical(other.status, status) || other.status == status)&&(identical(other.priority, priority) || other.priority == priority)&&(identical(other.assignedTo, assignedTo) || other.assignedTo == assignedTo)&&(identical(other.isRead, isRead) || other.isRead == isRead)&&(identical(other.readAt, readAt) || other.readAt == readAt)&&(identical(other.readBy, readBy) || other.readBy == readBy)&&(identical(other.isReplied, isReplied) || other.isReplied == isReplied)&&(identical(other.repliedAt, repliedAt) || other.repliedAt == repliedAt)&&(identical(other.repliedBy, repliedBy) || other.repliedBy == repliedBy)&&(identical(other.replyText, replyText) || other.replyText == replyText)&&(identical(other.adminNote, adminNote) || other.adminNote == adminNote)&&const DeepCollectionEquality().equals(other._tags, _tags)&&(identical(other.ipAddress, ipAddress) || other.ipAddress == ipAddress)&&(identical(other.referrer, referrer) || other.referrer == referrer)&&(identical(other.utmSource, utmSource) || other.utmSource == utmSource)&&(identical(other.utmMedium, utmMedium) || other.utmMedium == utmMedium)&&(identical(other.utmCampaign, utmCampaign) || other.utmCampaign == utmCampaign)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hashAll([runtimeType,id,name,email,phone,message,subject,responsePreference,leadScore,leadSource,status,priority,assignedTo,isRead,readAt,readBy,isReplied,repliedAt,repliedBy,replyText,adminNote,const DeepCollectionEquality().hash(_tags),ipAddress,referrer,utmSource,utmMedium,utmCampaign,createdAt,updatedAt]);

@override
String toString() {
  return 'ContactDetail(id: $id, name: $name, email: $email, phone: $phone, message: $message, subject: $subject, responsePreference: $responsePreference, leadScore: $leadScore, leadSource: $leadSource, status: $status, priority: $priority, assignedTo: $assignedTo, isRead: $isRead, readAt: $readAt, readBy: $readBy, isReplied: $isReplied, repliedAt: $repliedAt, repliedBy: $repliedBy, replyText: $replyText, adminNote: $adminNote, tags: $tags, ipAddress: $ipAddress, referrer: $referrer, utmSource: $utmSource, utmMedium: $utmMedium, utmCampaign: $utmCampaign, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$ContactDetailCopyWith<$Res> implements $ContactDetailCopyWith<$Res> {
  factory _$ContactDetailCopyWith(_ContactDetail value, $Res Function(_ContactDetail) _then) = __$ContactDetailCopyWithImpl;
@override @useResult
$Res call({
 String id, String name, String email, String? phone, String message, String? subject, String responsePreference, int? leadScore, String? leadSource, String status, String priority, String? assignedTo, bool isRead, DateTime? readAt, String? readBy, bool isReplied, DateTime? repliedAt, String? repliedBy, String? replyText, String? adminNote, List<String> tags, String? ipAddress, String? referrer, String? utmSource, String? utmMedium, String? utmCampaign, DateTime createdAt, DateTime updatedAt
});




}
/// @nodoc
class __$ContactDetailCopyWithImpl<$Res>
    implements _$ContactDetailCopyWith<$Res> {
  __$ContactDetailCopyWithImpl(this._self, this._then);

  final _ContactDetail _self;
  final $Res Function(_ContactDetail) _then;

/// Create a copy of ContactDetail
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? email = null,Object? phone = freezed,Object? message = null,Object? subject = freezed,Object? responsePreference = null,Object? leadScore = freezed,Object? leadSource = freezed,Object? status = null,Object? priority = null,Object? assignedTo = freezed,Object? isRead = null,Object? readAt = freezed,Object? readBy = freezed,Object? isReplied = null,Object? repliedAt = freezed,Object? repliedBy = freezed,Object? replyText = freezed,Object? adminNote = freezed,Object? tags = null,Object? ipAddress = freezed,Object? referrer = freezed,Object? utmSource = freezed,Object? utmMedium = freezed,Object? utmCampaign = freezed,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_ContactDetail(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,phone: freezed == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String?,message: null == message ? _self.message : message // ignore: cast_nullable_to_non_nullable
as String,subject: freezed == subject ? _self.subject : subject // ignore: cast_nullable_to_non_nullable
as String?,responsePreference: null == responsePreference ? _self.responsePreference : responsePreference // ignore: cast_nullable_to_non_nullable
as String,leadScore: freezed == leadScore ? _self.leadScore : leadScore // ignore: cast_nullable_to_non_nullable
as int?,leadSource: freezed == leadSource ? _self.leadSource : leadSource // ignore: cast_nullable_to_non_nullable
as String?,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,priority: null == priority ? _self.priority : priority // ignore: cast_nullable_to_non_nullable
as String,assignedTo: freezed == assignedTo ? _self.assignedTo : assignedTo // ignore: cast_nullable_to_non_nullable
as String?,isRead: null == isRead ? _self.isRead : isRead // ignore: cast_nullable_to_non_nullable
as bool,readAt: freezed == readAt ? _self.readAt : readAt // ignore: cast_nullable_to_non_nullable
as DateTime?,readBy: freezed == readBy ? _self.readBy : readBy // ignore: cast_nullable_to_non_nullable
as String?,isReplied: null == isReplied ? _self.isReplied : isReplied // ignore: cast_nullable_to_non_nullable
as bool,repliedAt: freezed == repliedAt ? _self.repliedAt : repliedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,repliedBy: freezed == repliedBy ? _self.repliedBy : repliedBy // ignore: cast_nullable_to_non_nullable
as String?,replyText: freezed == replyText ? _self.replyText : replyText // ignore: cast_nullable_to_non_nullable
as String?,adminNote: freezed == adminNote ? _self.adminNote : adminNote // ignore: cast_nullable_to_non_nullable
as String?,tags: null == tags ? _self._tags : tags // ignore: cast_nullable_to_non_nullable
as List<String>,ipAddress: freezed == ipAddress ? _self.ipAddress : ipAddress // ignore: cast_nullable_to_non_nullable
as String?,referrer: freezed == referrer ? _self.referrer : referrer // ignore: cast_nullable_to_non_nullable
as String?,utmSource: freezed == utmSource ? _self.utmSource : utmSource // ignore: cast_nullable_to_non_nullable
as String?,utmMedium: freezed == utmMedium ? _self.utmMedium : utmMedium // ignore: cast_nullable_to_non_nullable
as String?,utmCampaign: freezed == utmCampaign ? _self.utmCampaign : utmCampaign // ignore: cast_nullable_to_non_nullable
as String?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}


}

// dart format on
