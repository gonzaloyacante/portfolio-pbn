// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'booking_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$BookingService {

 String get name;
/// Create a copy of BookingService
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$BookingServiceCopyWith<BookingService> get copyWith => _$BookingServiceCopyWithImpl<BookingService>(this as BookingService, _$identity);

  /// Serializes this BookingService to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is BookingService&&(identical(other.name, name) || other.name == name));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,name);

@override
String toString() {
  return 'BookingService(name: $name)';
}


}

/// @nodoc
abstract mixin class $BookingServiceCopyWith<$Res>  {
  factory $BookingServiceCopyWith(BookingService value, $Res Function(BookingService) _then) = _$BookingServiceCopyWithImpl;
@useResult
$Res call({
 String name
});




}
/// @nodoc
class _$BookingServiceCopyWithImpl<$Res>
    implements $BookingServiceCopyWith<$Res> {
  _$BookingServiceCopyWithImpl(this._self, this._then);

  final BookingService _self;
  final $Res Function(BookingService) _then;

/// Create a copy of BookingService
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? name = null,}) {
  return _then(_self.copyWith(
name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [BookingService].
extension BookingServicePatterns on BookingService {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _BookingService value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _BookingService() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _BookingService value)  $default,){
final _that = this;
switch (_that) {
case _BookingService():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _BookingService value)?  $default,){
final _that = this;
switch (_that) {
case _BookingService() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String name)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _BookingService() when $default != null:
return $default(_that.name);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String name)  $default,) {final _that = this;
switch (_that) {
case _BookingService():
return $default(_that.name);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String name)?  $default,) {final _that = this;
switch (_that) {
case _BookingService() when $default != null:
return $default(_that.name);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _BookingService implements BookingService {
  const _BookingService({required this.name});
  factory _BookingService.fromJson(Map<String, dynamic> json) => _$BookingServiceFromJson(json);

@override final  String name;

/// Create a copy of BookingService
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$BookingServiceCopyWith<_BookingService> get copyWith => __$BookingServiceCopyWithImpl<_BookingService>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$BookingServiceToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _BookingService&&(identical(other.name, name) || other.name == name));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,name);

@override
String toString() {
  return 'BookingService(name: $name)';
}


}

/// @nodoc
abstract mixin class _$BookingServiceCopyWith<$Res> implements $BookingServiceCopyWith<$Res> {
  factory _$BookingServiceCopyWith(_BookingService value, $Res Function(_BookingService) _then) = __$BookingServiceCopyWithImpl;
@override @useResult
$Res call({
 String name
});




}
/// @nodoc
class __$BookingServiceCopyWithImpl<$Res>
    implements _$BookingServiceCopyWith<$Res> {
  __$BookingServiceCopyWithImpl(this._self, this._then);

  final _BookingService _self;
  final $Res Function(_BookingService) _then;

/// Create a copy of BookingService
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? name = null,}) {
  return _then(_BookingService(
name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}


/// @nodoc
mixin _$BookingItem {

 String get id; DateTime get date; DateTime? get endDate; String get status; String get clientName; String get clientEmail; String? get clientPhone; int? get guestCount; String? get totalAmount; String? get paymentStatus; String get serviceId; BookingService? get service; DateTime get createdAt; DateTime get updatedAt;
/// Create a copy of BookingItem
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$BookingItemCopyWith<BookingItem> get copyWith => _$BookingItemCopyWithImpl<BookingItem>(this as BookingItem, _$identity);

  /// Serializes this BookingItem to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is BookingItem&&(identical(other.id, id) || other.id == id)&&(identical(other.date, date) || other.date == date)&&(identical(other.endDate, endDate) || other.endDate == endDate)&&(identical(other.status, status) || other.status == status)&&(identical(other.clientName, clientName) || other.clientName == clientName)&&(identical(other.clientEmail, clientEmail) || other.clientEmail == clientEmail)&&(identical(other.clientPhone, clientPhone) || other.clientPhone == clientPhone)&&(identical(other.guestCount, guestCount) || other.guestCount == guestCount)&&(identical(other.totalAmount, totalAmount) || other.totalAmount == totalAmount)&&(identical(other.paymentStatus, paymentStatus) || other.paymentStatus == paymentStatus)&&(identical(other.serviceId, serviceId) || other.serviceId == serviceId)&&(identical(other.service, service) || other.service == service)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,date,endDate,status,clientName,clientEmail,clientPhone,guestCount,totalAmount,paymentStatus,serviceId,service,createdAt,updatedAt);

@override
String toString() {
  return 'BookingItem(id: $id, date: $date, endDate: $endDate, status: $status, clientName: $clientName, clientEmail: $clientEmail, clientPhone: $clientPhone, guestCount: $guestCount, totalAmount: $totalAmount, paymentStatus: $paymentStatus, serviceId: $serviceId, service: $service, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $BookingItemCopyWith<$Res>  {
  factory $BookingItemCopyWith(BookingItem value, $Res Function(BookingItem) _then) = _$BookingItemCopyWithImpl;
@useResult
$Res call({
 String id, DateTime date, DateTime? endDate, String status, String clientName, String clientEmail, String? clientPhone, int? guestCount, String? totalAmount, String? paymentStatus, String serviceId, BookingService? service, DateTime createdAt, DateTime updatedAt
});


$BookingServiceCopyWith<$Res>? get service;

}
/// @nodoc
class _$BookingItemCopyWithImpl<$Res>
    implements $BookingItemCopyWith<$Res> {
  _$BookingItemCopyWithImpl(this._self, this._then);

  final BookingItem _self;
  final $Res Function(BookingItem) _then;

/// Create a copy of BookingItem
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? date = null,Object? endDate = freezed,Object? status = null,Object? clientName = null,Object? clientEmail = null,Object? clientPhone = freezed,Object? guestCount = freezed,Object? totalAmount = freezed,Object? paymentStatus = freezed,Object? serviceId = null,Object? service = freezed,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,date: null == date ? _self.date : date // ignore: cast_nullable_to_non_nullable
as DateTime,endDate: freezed == endDate ? _self.endDate : endDate // ignore: cast_nullable_to_non_nullable
as DateTime?,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,clientName: null == clientName ? _self.clientName : clientName // ignore: cast_nullable_to_non_nullable
as String,clientEmail: null == clientEmail ? _self.clientEmail : clientEmail // ignore: cast_nullable_to_non_nullable
as String,clientPhone: freezed == clientPhone ? _self.clientPhone : clientPhone // ignore: cast_nullable_to_non_nullable
as String?,guestCount: freezed == guestCount ? _self.guestCount : guestCount // ignore: cast_nullable_to_non_nullable
as int?,totalAmount: freezed == totalAmount ? _self.totalAmount : totalAmount // ignore: cast_nullable_to_non_nullable
as String?,paymentStatus: freezed == paymentStatus ? _self.paymentStatus : paymentStatus // ignore: cast_nullable_to_non_nullable
as String?,serviceId: null == serviceId ? _self.serviceId : serviceId // ignore: cast_nullable_to_non_nullable
as String,service: freezed == service ? _self.service : service // ignore: cast_nullable_to_non_nullable
as BookingService?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}
/// Create a copy of BookingItem
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$BookingServiceCopyWith<$Res>? get service {
    if (_self.service == null) {
    return null;
  }

  return $BookingServiceCopyWith<$Res>(_self.service!, (value) {
    return _then(_self.copyWith(service: value));
  });
}
}


/// Adds pattern-matching-related methods to [BookingItem].
extension BookingItemPatterns on BookingItem {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _BookingItem value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _BookingItem() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _BookingItem value)  $default,){
final _that = this;
switch (_that) {
case _BookingItem():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _BookingItem value)?  $default,){
final _that = this;
switch (_that) {
case _BookingItem() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  DateTime date,  DateTime? endDate,  String status,  String clientName,  String clientEmail,  String? clientPhone,  int? guestCount,  String? totalAmount,  String? paymentStatus,  String serviceId,  BookingService? service,  DateTime createdAt,  DateTime updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _BookingItem() when $default != null:
return $default(_that.id,_that.date,_that.endDate,_that.status,_that.clientName,_that.clientEmail,_that.clientPhone,_that.guestCount,_that.totalAmount,_that.paymentStatus,_that.serviceId,_that.service,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  DateTime date,  DateTime? endDate,  String status,  String clientName,  String clientEmail,  String? clientPhone,  int? guestCount,  String? totalAmount,  String? paymentStatus,  String serviceId,  BookingService? service,  DateTime createdAt,  DateTime updatedAt)  $default,) {final _that = this;
switch (_that) {
case _BookingItem():
return $default(_that.id,_that.date,_that.endDate,_that.status,_that.clientName,_that.clientEmail,_that.clientPhone,_that.guestCount,_that.totalAmount,_that.paymentStatus,_that.serviceId,_that.service,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  DateTime date,  DateTime? endDate,  String status,  String clientName,  String clientEmail,  String? clientPhone,  int? guestCount,  String? totalAmount,  String? paymentStatus,  String serviceId,  BookingService? service,  DateTime createdAt,  DateTime updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _BookingItem() when $default != null:
return $default(_that.id,_that.date,_that.endDate,_that.status,_that.clientName,_that.clientEmail,_that.clientPhone,_that.guestCount,_that.totalAmount,_that.paymentStatus,_that.serviceId,_that.service,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _BookingItem implements BookingItem {
  const _BookingItem({required this.id, required this.date, this.endDate, this.status = 'PENDING', required this.clientName, required this.clientEmail, this.clientPhone, this.guestCount, this.totalAmount, this.paymentStatus, required this.serviceId, this.service, required this.createdAt, required this.updatedAt});
  factory _BookingItem.fromJson(Map<String, dynamic> json) => _$BookingItemFromJson(json);

@override final  String id;
@override final  DateTime date;
@override final  DateTime? endDate;
@override@JsonKey() final  String status;
@override final  String clientName;
@override final  String clientEmail;
@override final  String? clientPhone;
@override final  int? guestCount;
@override final  String? totalAmount;
@override final  String? paymentStatus;
@override final  String serviceId;
@override final  BookingService? service;
@override final  DateTime createdAt;
@override final  DateTime updatedAt;

/// Create a copy of BookingItem
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$BookingItemCopyWith<_BookingItem> get copyWith => __$BookingItemCopyWithImpl<_BookingItem>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$BookingItemToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _BookingItem&&(identical(other.id, id) || other.id == id)&&(identical(other.date, date) || other.date == date)&&(identical(other.endDate, endDate) || other.endDate == endDate)&&(identical(other.status, status) || other.status == status)&&(identical(other.clientName, clientName) || other.clientName == clientName)&&(identical(other.clientEmail, clientEmail) || other.clientEmail == clientEmail)&&(identical(other.clientPhone, clientPhone) || other.clientPhone == clientPhone)&&(identical(other.guestCount, guestCount) || other.guestCount == guestCount)&&(identical(other.totalAmount, totalAmount) || other.totalAmount == totalAmount)&&(identical(other.paymentStatus, paymentStatus) || other.paymentStatus == paymentStatus)&&(identical(other.serviceId, serviceId) || other.serviceId == serviceId)&&(identical(other.service, service) || other.service == service)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,date,endDate,status,clientName,clientEmail,clientPhone,guestCount,totalAmount,paymentStatus,serviceId,service,createdAt,updatedAt);

@override
String toString() {
  return 'BookingItem(id: $id, date: $date, endDate: $endDate, status: $status, clientName: $clientName, clientEmail: $clientEmail, clientPhone: $clientPhone, guestCount: $guestCount, totalAmount: $totalAmount, paymentStatus: $paymentStatus, serviceId: $serviceId, service: $service, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$BookingItemCopyWith<$Res> implements $BookingItemCopyWith<$Res> {
  factory _$BookingItemCopyWith(_BookingItem value, $Res Function(_BookingItem) _then) = __$BookingItemCopyWithImpl;
@override @useResult
$Res call({
 String id, DateTime date, DateTime? endDate, String status, String clientName, String clientEmail, String? clientPhone, int? guestCount, String? totalAmount, String? paymentStatus, String serviceId, BookingService? service, DateTime createdAt, DateTime updatedAt
});


@override $BookingServiceCopyWith<$Res>? get service;

}
/// @nodoc
class __$BookingItemCopyWithImpl<$Res>
    implements _$BookingItemCopyWith<$Res> {
  __$BookingItemCopyWithImpl(this._self, this._then);

  final _BookingItem _self;
  final $Res Function(_BookingItem) _then;

/// Create a copy of BookingItem
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? date = null,Object? endDate = freezed,Object? status = null,Object? clientName = null,Object? clientEmail = null,Object? clientPhone = freezed,Object? guestCount = freezed,Object? totalAmount = freezed,Object? paymentStatus = freezed,Object? serviceId = null,Object? service = freezed,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_BookingItem(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,date: null == date ? _self.date : date // ignore: cast_nullable_to_non_nullable
as DateTime,endDate: freezed == endDate ? _self.endDate : endDate // ignore: cast_nullable_to_non_nullable
as DateTime?,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,clientName: null == clientName ? _self.clientName : clientName // ignore: cast_nullable_to_non_nullable
as String,clientEmail: null == clientEmail ? _self.clientEmail : clientEmail // ignore: cast_nullable_to_non_nullable
as String,clientPhone: freezed == clientPhone ? _self.clientPhone : clientPhone // ignore: cast_nullable_to_non_nullable
as String?,guestCount: freezed == guestCount ? _self.guestCount : guestCount // ignore: cast_nullable_to_non_nullable
as int?,totalAmount: freezed == totalAmount ? _self.totalAmount : totalAmount // ignore: cast_nullable_to_non_nullable
as String?,paymentStatus: freezed == paymentStatus ? _self.paymentStatus : paymentStatus // ignore: cast_nullable_to_non_nullable
as String?,serviceId: null == serviceId ? _self.serviceId : serviceId // ignore: cast_nullable_to_non_nullable
as String,service: freezed == service ? _self.service : service // ignore: cast_nullable_to_non_nullable
as BookingService?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

/// Create a copy of BookingItem
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$BookingServiceCopyWith<$Res>? get service {
    if (_self.service == null) {
    return null;
  }

  return $BookingServiceCopyWith<$Res>(_self.service!, (value) {
    return _then(_self.copyWith(service: value));
  });
}
}


/// @nodoc
mixin _$BookingDetail {

 String get id; DateTime get date; DateTime? get endDate; String get status; String get clientName; String get clientEmail; String? get clientPhone; String? get clientNotes; int get guestCount; String? get adminNotes; DateTime? get confirmedAt; String? get confirmedBy; DateTime? get cancelledAt; String? get cancelledBy; String? get cancellationReason; String? get totalAmount; String? get paidAmount; String? get paymentStatus; String? get paymentMethod; String? get paymentRef; DateTime? get reminderSentAt; int get reminderCount; bool get feedbackSent; int? get feedbackRating; String? get feedbackText; String get serviceId; BookingService? get service; DateTime get createdAt; DateTime get updatedAt;
/// Create a copy of BookingDetail
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$BookingDetailCopyWith<BookingDetail> get copyWith => _$BookingDetailCopyWithImpl<BookingDetail>(this as BookingDetail, _$identity);

  /// Serializes this BookingDetail to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is BookingDetail&&(identical(other.id, id) || other.id == id)&&(identical(other.date, date) || other.date == date)&&(identical(other.endDate, endDate) || other.endDate == endDate)&&(identical(other.status, status) || other.status == status)&&(identical(other.clientName, clientName) || other.clientName == clientName)&&(identical(other.clientEmail, clientEmail) || other.clientEmail == clientEmail)&&(identical(other.clientPhone, clientPhone) || other.clientPhone == clientPhone)&&(identical(other.clientNotes, clientNotes) || other.clientNotes == clientNotes)&&(identical(other.guestCount, guestCount) || other.guestCount == guestCount)&&(identical(other.adminNotes, adminNotes) || other.adminNotes == adminNotes)&&(identical(other.confirmedAt, confirmedAt) || other.confirmedAt == confirmedAt)&&(identical(other.confirmedBy, confirmedBy) || other.confirmedBy == confirmedBy)&&(identical(other.cancelledAt, cancelledAt) || other.cancelledAt == cancelledAt)&&(identical(other.cancelledBy, cancelledBy) || other.cancelledBy == cancelledBy)&&(identical(other.cancellationReason, cancellationReason) || other.cancellationReason == cancellationReason)&&(identical(other.totalAmount, totalAmount) || other.totalAmount == totalAmount)&&(identical(other.paidAmount, paidAmount) || other.paidAmount == paidAmount)&&(identical(other.paymentStatus, paymentStatus) || other.paymentStatus == paymentStatus)&&(identical(other.paymentMethod, paymentMethod) || other.paymentMethod == paymentMethod)&&(identical(other.paymentRef, paymentRef) || other.paymentRef == paymentRef)&&(identical(other.reminderSentAt, reminderSentAt) || other.reminderSentAt == reminderSentAt)&&(identical(other.reminderCount, reminderCount) || other.reminderCount == reminderCount)&&(identical(other.feedbackSent, feedbackSent) || other.feedbackSent == feedbackSent)&&(identical(other.feedbackRating, feedbackRating) || other.feedbackRating == feedbackRating)&&(identical(other.feedbackText, feedbackText) || other.feedbackText == feedbackText)&&(identical(other.serviceId, serviceId) || other.serviceId == serviceId)&&(identical(other.service, service) || other.service == service)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hashAll([runtimeType,id,date,endDate,status,clientName,clientEmail,clientPhone,clientNotes,guestCount,adminNotes,confirmedAt,confirmedBy,cancelledAt,cancelledBy,cancellationReason,totalAmount,paidAmount,paymentStatus,paymentMethod,paymentRef,reminderSentAt,reminderCount,feedbackSent,feedbackRating,feedbackText,serviceId,service,createdAt,updatedAt]);

@override
String toString() {
  return 'BookingDetail(id: $id, date: $date, endDate: $endDate, status: $status, clientName: $clientName, clientEmail: $clientEmail, clientPhone: $clientPhone, clientNotes: $clientNotes, guestCount: $guestCount, adminNotes: $adminNotes, confirmedAt: $confirmedAt, confirmedBy: $confirmedBy, cancelledAt: $cancelledAt, cancelledBy: $cancelledBy, cancellationReason: $cancellationReason, totalAmount: $totalAmount, paidAmount: $paidAmount, paymentStatus: $paymentStatus, paymentMethod: $paymentMethod, paymentRef: $paymentRef, reminderSentAt: $reminderSentAt, reminderCount: $reminderCount, feedbackSent: $feedbackSent, feedbackRating: $feedbackRating, feedbackText: $feedbackText, serviceId: $serviceId, service: $service, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $BookingDetailCopyWith<$Res>  {
  factory $BookingDetailCopyWith(BookingDetail value, $Res Function(BookingDetail) _then) = _$BookingDetailCopyWithImpl;
@useResult
$Res call({
 String id, DateTime date, DateTime? endDate, String status, String clientName, String clientEmail, String? clientPhone, String? clientNotes, int guestCount, String? adminNotes, DateTime? confirmedAt, String? confirmedBy, DateTime? cancelledAt, String? cancelledBy, String? cancellationReason, String? totalAmount, String? paidAmount, String? paymentStatus, String? paymentMethod, String? paymentRef, DateTime? reminderSentAt, int reminderCount, bool feedbackSent, int? feedbackRating, String? feedbackText, String serviceId, BookingService? service, DateTime createdAt, DateTime updatedAt
});


$BookingServiceCopyWith<$Res>? get service;

}
/// @nodoc
class _$BookingDetailCopyWithImpl<$Res>
    implements $BookingDetailCopyWith<$Res> {
  _$BookingDetailCopyWithImpl(this._self, this._then);

  final BookingDetail _self;
  final $Res Function(BookingDetail) _then;

/// Create a copy of BookingDetail
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? date = null,Object? endDate = freezed,Object? status = null,Object? clientName = null,Object? clientEmail = null,Object? clientPhone = freezed,Object? clientNotes = freezed,Object? guestCount = null,Object? adminNotes = freezed,Object? confirmedAt = freezed,Object? confirmedBy = freezed,Object? cancelledAt = freezed,Object? cancelledBy = freezed,Object? cancellationReason = freezed,Object? totalAmount = freezed,Object? paidAmount = freezed,Object? paymentStatus = freezed,Object? paymentMethod = freezed,Object? paymentRef = freezed,Object? reminderSentAt = freezed,Object? reminderCount = null,Object? feedbackSent = null,Object? feedbackRating = freezed,Object? feedbackText = freezed,Object? serviceId = null,Object? service = freezed,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,date: null == date ? _self.date : date // ignore: cast_nullable_to_non_nullable
as DateTime,endDate: freezed == endDate ? _self.endDate : endDate // ignore: cast_nullable_to_non_nullable
as DateTime?,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,clientName: null == clientName ? _self.clientName : clientName // ignore: cast_nullable_to_non_nullable
as String,clientEmail: null == clientEmail ? _self.clientEmail : clientEmail // ignore: cast_nullable_to_non_nullable
as String,clientPhone: freezed == clientPhone ? _self.clientPhone : clientPhone // ignore: cast_nullable_to_non_nullable
as String?,clientNotes: freezed == clientNotes ? _self.clientNotes : clientNotes // ignore: cast_nullable_to_non_nullable
as String?,guestCount: null == guestCount ? _self.guestCount : guestCount // ignore: cast_nullable_to_non_nullable
as int,adminNotes: freezed == adminNotes ? _self.adminNotes : adminNotes // ignore: cast_nullable_to_non_nullable
as String?,confirmedAt: freezed == confirmedAt ? _self.confirmedAt : confirmedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,confirmedBy: freezed == confirmedBy ? _self.confirmedBy : confirmedBy // ignore: cast_nullable_to_non_nullable
as String?,cancelledAt: freezed == cancelledAt ? _self.cancelledAt : cancelledAt // ignore: cast_nullable_to_non_nullable
as DateTime?,cancelledBy: freezed == cancelledBy ? _self.cancelledBy : cancelledBy // ignore: cast_nullable_to_non_nullable
as String?,cancellationReason: freezed == cancellationReason ? _self.cancellationReason : cancellationReason // ignore: cast_nullable_to_non_nullable
as String?,totalAmount: freezed == totalAmount ? _self.totalAmount : totalAmount // ignore: cast_nullable_to_non_nullable
as String?,paidAmount: freezed == paidAmount ? _self.paidAmount : paidAmount // ignore: cast_nullable_to_non_nullable
as String?,paymentStatus: freezed == paymentStatus ? _self.paymentStatus : paymentStatus // ignore: cast_nullable_to_non_nullable
as String?,paymentMethod: freezed == paymentMethod ? _self.paymentMethod : paymentMethod // ignore: cast_nullable_to_non_nullable
as String?,paymentRef: freezed == paymentRef ? _self.paymentRef : paymentRef // ignore: cast_nullable_to_non_nullable
as String?,reminderSentAt: freezed == reminderSentAt ? _self.reminderSentAt : reminderSentAt // ignore: cast_nullable_to_non_nullable
as DateTime?,reminderCount: null == reminderCount ? _self.reminderCount : reminderCount // ignore: cast_nullable_to_non_nullable
as int,feedbackSent: null == feedbackSent ? _self.feedbackSent : feedbackSent // ignore: cast_nullable_to_non_nullable
as bool,feedbackRating: freezed == feedbackRating ? _self.feedbackRating : feedbackRating // ignore: cast_nullable_to_non_nullable
as int?,feedbackText: freezed == feedbackText ? _self.feedbackText : feedbackText // ignore: cast_nullable_to_non_nullable
as String?,serviceId: null == serviceId ? _self.serviceId : serviceId // ignore: cast_nullable_to_non_nullable
as String,service: freezed == service ? _self.service : service // ignore: cast_nullable_to_non_nullable
as BookingService?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}
/// Create a copy of BookingDetail
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$BookingServiceCopyWith<$Res>? get service {
    if (_self.service == null) {
    return null;
  }

  return $BookingServiceCopyWith<$Res>(_self.service!, (value) {
    return _then(_self.copyWith(service: value));
  });
}
}


/// Adds pattern-matching-related methods to [BookingDetail].
extension BookingDetailPatterns on BookingDetail {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _BookingDetail value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _BookingDetail() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _BookingDetail value)  $default,){
final _that = this;
switch (_that) {
case _BookingDetail():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _BookingDetail value)?  $default,){
final _that = this;
switch (_that) {
case _BookingDetail() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  DateTime date,  DateTime? endDate,  String status,  String clientName,  String clientEmail,  String? clientPhone,  String? clientNotes,  int guestCount,  String? adminNotes,  DateTime? confirmedAt,  String? confirmedBy,  DateTime? cancelledAt,  String? cancelledBy,  String? cancellationReason,  String? totalAmount,  String? paidAmount,  String? paymentStatus,  String? paymentMethod,  String? paymentRef,  DateTime? reminderSentAt,  int reminderCount,  bool feedbackSent,  int? feedbackRating,  String? feedbackText,  String serviceId,  BookingService? service,  DateTime createdAt,  DateTime updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _BookingDetail() when $default != null:
return $default(_that.id,_that.date,_that.endDate,_that.status,_that.clientName,_that.clientEmail,_that.clientPhone,_that.clientNotes,_that.guestCount,_that.adminNotes,_that.confirmedAt,_that.confirmedBy,_that.cancelledAt,_that.cancelledBy,_that.cancellationReason,_that.totalAmount,_that.paidAmount,_that.paymentStatus,_that.paymentMethod,_that.paymentRef,_that.reminderSentAt,_that.reminderCount,_that.feedbackSent,_that.feedbackRating,_that.feedbackText,_that.serviceId,_that.service,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  DateTime date,  DateTime? endDate,  String status,  String clientName,  String clientEmail,  String? clientPhone,  String? clientNotes,  int guestCount,  String? adminNotes,  DateTime? confirmedAt,  String? confirmedBy,  DateTime? cancelledAt,  String? cancelledBy,  String? cancellationReason,  String? totalAmount,  String? paidAmount,  String? paymentStatus,  String? paymentMethod,  String? paymentRef,  DateTime? reminderSentAt,  int reminderCount,  bool feedbackSent,  int? feedbackRating,  String? feedbackText,  String serviceId,  BookingService? service,  DateTime createdAt,  DateTime updatedAt)  $default,) {final _that = this;
switch (_that) {
case _BookingDetail():
return $default(_that.id,_that.date,_that.endDate,_that.status,_that.clientName,_that.clientEmail,_that.clientPhone,_that.clientNotes,_that.guestCount,_that.adminNotes,_that.confirmedAt,_that.confirmedBy,_that.cancelledAt,_that.cancelledBy,_that.cancellationReason,_that.totalAmount,_that.paidAmount,_that.paymentStatus,_that.paymentMethod,_that.paymentRef,_that.reminderSentAt,_that.reminderCount,_that.feedbackSent,_that.feedbackRating,_that.feedbackText,_that.serviceId,_that.service,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  DateTime date,  DateTime? endDate,  String status,  String clientName,  String clientEmail,  String? clientPhone,  String? clientNotes,  int guestCount,  String? adminNotes,  DateTime? confirmedAt,  String? confirmedBy,  DateTime? cancelledAt,  String? cancelledBy,  String? cancellationReason,  String? totalAmount,  String? paidAmount,  String? paymentStatus,  String? paymentMethod,  String? paymentRef,  DateTime? reminderSentAt,  int reminderCount,  bool feedbackSent,  int? feedbackRating,  String? feedbackText,  String serviceId,  BookingService? service,  DateTime createdAt,  DateTime updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _BookingDetail() when $default != null:
return $default(_that.id,_that.date,_that.endDate,_that.status,_that.clientName,_that.clientEmail,_that.clientPhone,_that.clientNotes,_that.guestCount,_that.adminNotes,_that.confirmedAt,_that.confirmedBy,_that.cancelledAt,_that.cancelledBy,_that.cancellationReason,_that.totalAmount,_that.paidAmount,_that.paymentStatus,_that.paymentMethod,_that.paymentRef,_that.reminderSentAt,_that.reminderCount,_that.feedbackSent,_that.feedbackRating,_that.feedbackText,_that.serviceId,_that.service,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _BookingDetail implements BookingDetail {
  const _BookingDetail({required this.id, required this.date, this.endDate, this.status = 'PENDING', required this.clientName, required this.clientEmail, this.clientPhone, this.clientNotes, this.guestCount = 1, this.adminNotes, this.confirmedAt, this.confirmedBy, this.cancelledAt, this.cancelledBy, this.cancellationReason, this.totalAmount, this.paidAmount, this.paymentStatus, this.paymentMethod, this.paymentRef, this.reminderSentAt, this.reminderCount = 0, this.feedbackSent = false, this.feedbackRating, this.feedbackText, required this.serviceId, this.service, required this.createdAt, required this.updatedAt});
  factory _BookingDetail.fromJson(Map<String, dynamic> json) => _$BookingDetailFromJson(json);

@override final  String id;
@override final  DateTime date;
@override final  DateTime? endDate;
@override@JsonKey() final  String status;
@override final  String clientName;
@override final  String clientEmail;
@override final  String? clientPhone;
@override final  String? clientNotes;
@override@JsonKey() final  int guestCount;
@override final  String? adminNotes;
@override final  DateTime? confirmedAt;
@override final  String? confirmedBy;
@override final  DateTime? cancelledAt;
@override final  String? cancelledBy;
@override final  String? cancellationReason;
@override final  String? totalAmount;
@override final  String? paidAmount;
@override final  String? paymentStatus;
@override final  String? paymentMethod;
@override final  String? paymentRef;
@override final  DateTime? reminderSentAt;
@override@JsonKey() final  int reminderCount;
@override@JsonKey() final  bool feedbackSent;
@override final  int? feedbackRating;
@override final  String? feedbackText;
@override final  String serviceId;
@override final  BookingService? service;
@override final  DateTime createdAt;
@override final  DateTime updatedAt;

/// Create a copy of BookingDetail
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$BookingDetailCopyWith<_BookingDetail> get copyWith => __$BookingDetailCopyWithImpl<_BookingDetail>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$BookingDetailToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _BookingDetail&&(identical(other.id, id) || other.id == id)&&(identical(other.date, date) || other.date == date)&&(identical(other.endDate, endDate) || other.endDate == endDate)&&(identical(other.status, status) || other.status == status)&&(identical(other.clientName, clientName) || other.clientName == clientName)&&(identical(other.clientEmail, clientEmail) || other.clientEmail == clientEmail)&&(identical(other.clientPhone, clientPhone) || other.clientPhone == clientPhone)&&(identical(other.clientNotes, clientNotes) || other.clientNotes == clientNotes)&&(identical(other.guestCount, guestCount) || other.guestCount == guestCount)&&(identical(other.adminNotes, adminNotes) || other.adminNotes == adminNotes)&&(identical(other.confirmedAt, confirmedAt) || other.confirmedAt == confirmedAt)&&(identical(other.confirmedBy, confirmedBy) || other.confirmedBy == confirmedBy)&&(identical(other.cancelledAt, cancelledAt) || other.cancelledAt == cancelledAt)&&(identical(other.cancelledBy, cancelledBy) || other.cancelledBy == cancelledBy)&&(identical(other.cancellationReason, cancellationReason) || other.cancellationReason == cancellationReason)&&(identical(other.totalAmount, totalAmount) || other.totalAmount == totalAmount)&&(identical(other.paidAmount, paidAmount) || other.paidAmount == paidAmount)&&(identical(other.paymentStatus, paymentStatus) || other.paymentStatus == paymentStatus)&&(identical(other.paymentMethod, paymentMethod) || other.paymentMethod == paymentMethod)&&(identical(other.paymentRef, paymentRef) || other.paymentRef == paymentRef)&&(identical(other.reminderSentAt, reminderSentAt) || other.reminderSentAt == reminderSentAt)&&(identical(other.reminderCount, reminderCount) || other.reminderCount == reminderCount)&&(identical(other.feedbackSent, feedbackSent) || other.feedbackSent == feedbackSent)&&(identical(other.feedbackRating, feedbackRating) || other.feedbackRating == feedbackRating)&&(identical(other.feedbackText, feedbackText) || other.feedbackText == feedbackText)&&(identical(other.serviceId, serviceId) || other.serviceId == serviceId)&&(identical(other.service, service) || other.service == service)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hashAll([runtimeType,id,date,endDate,status,clientName,clientEmail,clientPhone,clientNotes,guestCount,adminNotes,confirmedAt,confirmedBy,cancelledAt,cancelledBy,cancellationReason,totalAmount,paidAmount,paymentStatus,paymentMethod,paymentRef,reminderSentAt,reminderCount,feedbackSent,feedbackRating,feedbackText,serviceId,service,createdAt,updatedAt]);

@override
String toString() {
  return 'BookingDetail(id: $id, date: $date, endDate: $endDate, status: $status, clientName: $clientName, clientEmail: $clientEmail, clientPhone: $clientPhone, clientNotes: $clientNotes, guestCount: $guestCount, adminNotes: $adminNotes, confirmedAt: $confirmedAt, confirmedBy: $confirmedBy, cancelledAt: $cancelledAt, cancelledBy: $cancelledBy, cancellationReason: $cancellationReason, totalAmount: $totalAmount, paidAmount: $paidAmount, paymentStatus: $paymentStatus, paymentMethod: $paymentMethod, paymentRef: $paymentRef, reminderSentAt: $reminderSentAt, reminderCount: $reminderCount, feedbackSent: $feedbackSent, feedbackRating: $feedbackRating, feedbackText: $feedbackText, serviceId: $serviceId, service: $service, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$BookingDetailCopyWith<$Res> implements $BookingDetailCopyWith<$Res> {
  factory _$BookingDetailCopyWith(_BookingDetail value, $Res Function(_BookingDetail) _then) = __$BookingDetailCopyWithImpl;
@override @useResult
$Res call({
 String id, DateTime date, DateTime? endDate, String status, String clientName, String clientEmail, String? clientPhone, String? clientNotes, int guestCount, String? adminNotes, DateTime? confirmedAt, String? confirmedBy, DateTime? cancelledAt, String? cancelledBy, String? cancellationReason, String? totalAmount, String? paidAmount, String? paymentStatus, String? paymentMethod, String? paymentRef, DateTime? reminderSentAt, int reminderCount, bool feedbackSent, int? feedbackRating, String? feedbackText, String serviceId, BookingService? service, DateTime createdAt, DateTime updatedAt
});


@override $BookingServiceCopyWith<$Res>? get service;

}
/// @nodoc
class __$BookingDetailCopyWithImpl<$Res>
    implements _$BookingDetailCopyWith<$Res> {
  __$BookingDetailCopyWithImpl(this._self, this._then);

  final _BookingDetail _self;
  final $Res Function(_BookingDetail) _then;

/// Create a copy of BookingDetail
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? date = null,Object? endDate = freezed,Object? status = null,Object? clientName = null,Object? clientEmail = null,Object? clientPhone = freezed,Object? clientNotes = freezed,Object? guestCount = null,Object? adminNotes = freezed,Object? confirmedAt = freezed,Object? confirmedBy = freezed,Object? cancelledAt = freezed,Object? cancelledBy = freezed,Object? cancellationReason = freezed,Object? totalAmount = freezed,Object? paidAmount = freezed,Object? paymentStatus = freezed,Object? paymentMethod = freezed,Object? paymentRef = freezed,Object? reminderSentAt = freezed,Object? reminderCount = null,Object? feedbackSent = null,Object? feedbackRating = freezed,Object? feedbackText = freezed,Object? serviceId = null,Object? service = freezed,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_BookingDetail(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,date: null == date ? _self.date : date // ignore: cast_nullable_to_non_nullable
as DateTime,endDate: freezed == endDate ? _self.endDate : endDate // ignore: cast_nullable_to_non_nullable
as DateTime?,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,clientName: null == clientName ? _self.clientName : clientName // ignore: cast_nullable_to_non_nullable
as String,clientEmail: null == clientEmail ? _self.clientEmail : clientEmail // ignore: cast_nullable_to_non_nullable
as String,clientPhone: freezed == clientPhone ? _self.clientPhone : clientPhone // ignore: cast_nullable_to_non_nullable
as String?,clientNotes: freezed == clientNotes ? _self.clientNotes : clientNotes // ignore: cast_nullable_to_non_nullable
as String?,guestCount: null == guestCount ? _self.guestCount : guestCount // ignore: cast_nullable_to_non_nullable
as int,adminNotes: freezed == adminNotes ? _self.adminNotes : adminNotes // ignore: cast_nullable_to_non_nullable
as String?,confirmedAt: freezed == confirmedAt ? _self.confirmedAt : confirmedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,confirmedBy: freezed == confirmedBy ? _self.confirmedBy : confirmedBy // ignore: cast_nullable_to_non_nullable
as String?,cancelledAt: freezed == cancelledAt ? _self.cancelledAt : cancelledAt // ignore: cast_nullable_to_non_nullable
as DateTime?,cancelledBy: freezed == cancelledBy ? _self.cancelledBy : cancelledBy // ignore: cast_nullable_to_non_nullable
as String?,cancellationReason: freezed == cancellationReason ? _self.cancellationReason : cancellationReason // ignore: cast_nullable_to_non_nullable
as String?,totalAmount: freezed == totalAmount ? _self.totalAmount : totalAmount // ignore: cast_nullable_to_non_nullable
as String?,paidAmount: freezed == paidAmount ? _self.paidAmount : paidAmount // ignore: cast_nullable_to_non_nullable
as String?,paymentStatus: freezed == paymentStatus ? _self.paymentStatus : paymentStatus // ignore: cast_nullable_to_non_nullable
as String?,paymentMethod: freezed == paymentMethod ? _self.paymentMethod : paymentMethod // ignore: cast_nullable_to_non_nullable
as String?,paymentRef: freezed == paymentRef ? _self.paymentRef : paymentRef // ignore: cast_nullable_to_non_nullable
as String?,reminderSentAt: freezed == reminderSentAt ? _self.reminderSentAt : reminderSentAt // ignore: cast_nullable_to_non_nullable
as DateTime?,reminderCount: null == reminderCount ? _self.reminderCount : reminderCount // ignore: cast_nullable_to_non_nullable
as int,feedbackSent: null == feedbackSent ? _self.feedbackSent : feedbackSent // ignore: cast_nullable_to_non_nullable
as bool,feedbackRating: freezed == feedbackRating ? _self.feedbackRating : feedbackRating // ignore: cast_nullable_to_non_nullable
as int?,feedbackText: freezed == feedbackText ? _self.feedbackText : feedbackText // ignore: cast_nullable_to_non_nullable
as String?,serviceId: null == serviceId ? _self.serviceId : serviceId // ignore: cast_nullable_to_non_nullable
as String,service: freezed == service ? _self.service : service // ignore: cast_nullable_to_non_nullable
as BookingService?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime,
  ));
}

/// Create a copy of BookingDetail
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$BookingServiceCopyWith<$Res>? get service {
    if (_self.service == null) {
    return null;
  }

  return $BookingServiceCopyWith<$Res>(_self.service!, (value) {
    return _then(_self.copyWith(service: value));
  });
}
}

// dart format on
