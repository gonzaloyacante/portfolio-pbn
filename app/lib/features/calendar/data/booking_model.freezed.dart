// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'booking_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

BookingService _$BookingServiceFromJson(Map<String, dynamic> json) {
  return _BookingService.fromJson(json);
}

/// @nodoc
mixin _$BookingService {
  String get name => throw _privateConstructorUsedError;

  /// Serializes this BookingService to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of BookingService
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $BookingServiceCopyWith<BookingService> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $BookingServiceCopyWith<$Res> {
  factory $BookingServiceCopyWith(
    BookingService value,
    $Res Function(BookingService) then,
  ) = _$BookingServiceCopyWithImpl<$Res, BookingService>;
  @useResult
  $Res call({String name});
}

/// @nodoc
class _$BookingServiceCopyWithImpl<$Res, $Val extends BookingService>
    implements $BookingServiceCopyWith<$Res> {
  _$BookingServiceCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of BookingService
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? name = null}) {
    return _then(
      _value.copyWith(
            name: null == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$BookingServiceImplCopyWith<$Res>
    implements $BookingServiceCopyWith<$Res> {
  factory _$$BookingServiceImplCopyWith(
    _$BookingServiceImpl value,
    $Res Function(_$BookingServiceImpl) then,
  ) = __$$BookingServiceImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String name});
}

/// @nodoc
class __$$BookingServiceImplCopyWithImpl<$Res>
    extends _$BookingServiceCopyWithImpl<$Res, _$BookingServiceImpl>
    implements _$$BookingServiceImplCopyWith<$Res> {
  __$$BookingServiceImplCopyWithImpl(
    _$BookingServiceImpl _value,
    $Res Function(_$BookingServiceImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of BookingService
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? name = null}) {
    return _then(
      _$BookingServiceImpl(
        name: null == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$BookingServiceImpl implements _BookingService {
  const _$BookingServiceImpl({required this.name});

  factory _$BookingServiceImpl.fromJson(Map<String, dynamic> json) =>
      _$$BookingServiceImplFromJson(json);

  @override
  final String name;

  @override
  String toString() {
    return 'BookingService(name: $name)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$BookingServiceImpl &&
            (identical(other.name, name) || other.name == name));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, name);

  /// Create a copy of BookingService
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$BookingServiceImplCopyWith<_$BookingServiceImpl> get copyWith =>
      __$$BookingServiceImplCopyWithImpl<_$BookingServiceImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$BookingServiceImplToJson(this);
  }
}

abstract class _BookingService implements BookingService {
  const factory _BookingService({required final String name}) =
      _$BookingServiceImpl;

  factory _BookingService.fromJson(Map<String, dynamic> json) =
      _$BookingServiceImpl.fromJson;

  @override
  String get name;

  /// Create a copy of BookingService
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$BookingServiceImplCopyWith<_$BookingServiceImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

BookingItem _$BookingItemFromJson(Map<String, dynamic> json) {
  return _BookingItem.fromJson(json);
}

/// @nodoc
mixin _$BookingItem {
  String get id => throw _privateConstructorUsedError;
  DateTime get date => throw _privateConstructorUsedError;
  DateTime? get endDate => throw _privateConstructorUsedError;
  String get status => throw _privateConstructorUsedError;
  String get clientName => throw _privateConstructorUsedError;
  String get clientEmail => throw _privateConstructorUsedError;
  String? get clientPhone => throw _privateConstructorUsedError;
  int? get guestCount => throw _privateConstructorUsedError;
  String? get totalAmount => throw _privateConstructorUsedError;
  String? get paymentStatus => throw _privateConstructorUsedError;
  String get serviceId => throw _privateConstructorUsedError;
  BookingService? get service => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  DateTime get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this BookingItem to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of BookingItem
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $BookingItemCopyWith<BookingItem> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $BookingItemCopyWith<$Res> {
  factory $BookingItemCopyWith(
    BookingItem value,
    $Res Function(BookingItem) then,
  ) = _$BookingItemCopyWithImpl<$Res, BookingItem>;
  @useResult
  $Res call({
    String id,
    DateTime date,
    DateTime? endDate,
    String status,
    String clientName,
    String clientEmail,
    String? clientPhone,
    int? guestCount,
    String? totalAmount,
    String? paymentStatus,
    String serviceId,
    BookingService? service,
    DateTime createdAt,
    DateTime updatedAt,
  });

  $BookingServiceCopyWith<$Res>? get service;
}

/// @nodoc
class _$BookingItemCopyWithImpl<$Res, $Val extends BookingItem>
    implements $BookingItemCopyWith<$Res> {
  _$BookingItemCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of BookingItem
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? date = null,
    Object? endDate = freezed,
    Object? status = null,
    Object? clientName = null,
    Object? clientEmail = null,
    Object? clientPhone = freezed,
    Object? guestCount = freezed,
    Object? totalAmount = freezed,
    Object? paymentStatus = freezed,
    Object? serviceId = null,
    Object? service = freezed,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            date: null == date
                ? _value.date
                : date // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            endDate: freezed == endDate
                ? _value.endDate
                : endDate // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            status: null == status
                ? _value.status
                : status // ignore: cast_nullable_to_non_nullable
                      as String,
            clientName: null == clientName
                ? _value.clientName
                : clientName // ignore: cast_nullable_to_non_nullable
                      as String,
            clientEmail: null == clientEmail
                ? _value.clientEmail
                : clientEmail // ignore: cast_nullable_to_non_nullable
                      as String,
            clientPhone: freezed == clientPhone
                ? _value.clientPhone
                : clientPhone // ignore: cast_nullable_to_non_nullable
                      as String?,
            guestCount: freezed == guestCount
                ? _value.guestCount
                : guestCount // ignore: cast_nullable_to_non_nullable
                      as int?,
            totalAmount: freezed == totalAmount
                ? _value.totalAmount
                : totalAmount // ignore: cast_nullable_to_non_nullable
                      as String?,
            paymentStatus: freezed == paymentStatus
                ? _value.paymentStatus
                : paymentStatus // ignore: cast_nullable_to_non_nullable
                      as String?,
            serviceId: null == serviceId
                ? _value.serviceId
                : serviceId // ignore: cast_nullable_to_non_nullable
                      as String,
            service: freezed == service
                ? _value.service
                : service // ignore: cast_nullable_to_non_nullable
                      as BookingService?,
            createdAt: null == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            updatedAt: null == updatedAt
                ? _value.updatedAt
                : updatedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
          )
          as $Val,
    );
  }

  /// Create a copy of BookingItem
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $BookingServiceCopyWith<$Res>? get service {
    if (_value.service == null) {
      return null;
    }

    return $BookingServiceCopyWith<$Res>(_value.service!, (value) {
      return _then(_value.copyWith(service: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$BookingItemImplCopyWith<$Res>
    implements $BookingItemCopyWith<$Res> {
  factory _$$BookingItemImplCopyWith(
    _$BookingItemImpl value,
    $Res Function(_$BookingItemImpl) then,
  ) = __$$BookingItemImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    DateTime date,
    DateTime? endDate,
    String status,
    String clientName,
    String clientEmail,
    String? clientPhone,
    int? guestCount,
    String? totalAmount,
    String? paymentStatus,
    String serviceId,
    BookingService? service,
    DateTime createdAt,
    DateTime updatedAt,
  });

  @override
  $BookingServiceCopyWith<$Res>? get service;
}

/// @nodoc
class __$$BookingItemImplCopyWithImpl<$Res>
    extends _$BookingItemCopyWithImpl<$Res, _$BookingItemImpl>
    implements _$$BookingItemImplCopyWith<$Res> {
  __$$BookingItemImplCopyWithImpl(
    _$BookingItemImpl _value,
    $Res Function(_$BookingItemImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of BookingItem
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? date = null,
    Object? endDate = freezed,
    Object? status = null,
    Object? clientName = null,
    Object? clientEmail = null,
    Object? clientPhone = freezed,
    Object? guestCount = freezed,
    Object? totalAmount = freezed,
    Object? paymentStatus = freezed,
    Object? serviceId = null,
    Object? service = freezed,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _$BookingItemImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        date: null == date
            ? _value.date
            : date // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        endDate: freezed == endDate
            ? _value.endDate
            : endDate // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        status: null == status
            ? _value.status
            : status // ignore: cast_nullable_to_non_nullable
                  as String,
        clientName: null == clientName
            ? _value.clientName
            : clientName // ignore: cast_nullable_to_non_nullable
                  as String,
        clientEmail: null == clientEmail
            ? _value.clientEmail
            : clientEmail // ignore: cast_nullable_to_non_nullable
                  as String,
        clientPhone: freezed == clientPhone
            ? _value.clientPhone
            : clientPhone // ignore: cast_nullable_to_non_nullable
                  as String?,
        guestCount: freezed == guestCount
            ? _value.guestCount
            : guestCount // ignore: cast_nullable_to_non_nullable
                  as int?,
        totalAmount: freezed == totalAmount
            ? _value.totalAmount
            : totalAmount // ignore: cast_nullable_to_non_nullable
                  as String?,
        paymentStatus: freezed == paymentStatus
            ? _value.paymentStatus
            : paymentStatus // ignore: cast_nullable_to_non_nullable
                  as String?,
        serviceId: null == serviceId
            ? _value.serviceId
            : serviceId // ignore: cast_nullable_to_non_nullable
                  as String,
        service: freezed == service
            ? _value.service
            : service // ignore: cast_nullable_to_non_nullable
                  as BookingService?,
        createdAt: null == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        updatedAt: null == updatedAt
            ? _value.updatedAt
            : updatedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$BookingItemImpl implements _BookingItem {
  const _$BookingItemImpl({
    required this.id,
    required this.date,
    this.endDate,
    this.status = 'PENDING',
    required this.clientName,
    required this.clientEmail,
    this.clientPhone,
    this.guestCount,
    this.totalAmount,
    this.paymentStatus,
    required this.serviceId,
    this.service,
    required this.createdAt,
    required this.updatedAt,
  });

  factory _$BookingItemImpl.fromJson(Map<String, dynamic> json) =>
      _$$BookingItemImplFromJson(json);

  @override
  final String id;
  @override
  final DateTime date;
  @override
  final DateTime? endDate;
  @override
  @JsonKey()
  final String status;
  @override
  final String clientName;
  @override
  final String clientEmail;
  @override
  final String? clientPhone;
  @override
  final int? guestCount;
  @override
  final String? totalAmount;
  @override
  final String? paymentStatus;
  @override
  final String serviceId;
  @override
  final BookingService? service;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  @override
  String toString() {
    return 'BookingItem(id: $id, date: $date, endDate: $endDate, status: $status, clientName: $clientName, clientEmail: $clientEmail, clientPhone: $clientPhone, guestCount: $guestCount, totalAmount: $totalAmount, paymentStatus: $paymentStatus, serviceId: $serviceId, service: $service, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$BookingItemImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.date, date) || other.date == date) &&
            (identical(other.endDate, endDate) || other.endDate == endDate) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.clientName, clientName) ||
                other.clientName == clientName) &&
            (identical(other.clientEmail, clientEmail) ||
                other.clientEmail == clientEmail) &&
            (identical(other.clientPhone, clientPhone) ||
                other.clientPhone == clientPhone) &&
            (identical(other.guestCount, guestCount) ||
                other.guestCount == guestCount) &&
            (identical(other.totalAmount, totalAmount) ||
                other.totalAmount == totalAmount) &&
            (identical(other.paymentStatus, paymentStatus) ||
                other.paymentStatus == paymentStatus) &&
            (identical(other.serviceId, serviceId) ||
                other.serviceId == serviceId) &&
            (identical(other.service, service) || other.service == service) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    date,
    endDate,
    status,
    clientName,
    clientEmail,
    clientPhone,
    guestCount,
    totalAmount,
    paymentStatus,
    serviceId,
    service,
    createdAt,
    updatedAt,
  );

  /// Create a copy of BookingItem
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$BookingItemImplCopyWith<_$BookingItemImpl> get copyWith =>
      __$$BookingItemImplCopyWithImpl<_$BookingItemImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$BookingItemImplToJson(this);
  }
}

abstract class _BookingItem implements BookingItem {
  const factory _BookingItem({
    required final String id,
    required final DateTime date,
    final DateTime? endDate,
    final String status,
    required final String clientName,
    required final String clientEmail,
    final String? clientPhone,
    final int? guestCount,
    final String? totalAmount,
    final String? paymentStatus,
    required final String serviceId,
    final BookingService? service,
    required final DateTime createdAt,
    required final DateTime updatedAt,
  }) = _$BookingItemImpl;

  factory _BookingItem.fromJson(Map<String, dynamic> json) =
      _$BookingItemImpl.fromJson;

  @override
  String get id;
  @override
  DateTime get date;
  @override
  DateTime? get endDate;
  @override
  String get status;
  @override
  String get clientName;
  @override
  String get clientEmail;
  @override
  String? get clientPhone;
  @override
  int? get guestCount;
  @override
  String? get totalAmount;
  @override
  String? get paymentStatus;
  @override
  String get serviceId;
  @override
  BookingService? get service;
  @override
  DateTime get createdAt;
  @override
  DateTime get updatedAt;

  /// Create a copy of BookingItem
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$BookingItemImplCopyWith<_$BookingItemImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

BookingDetail _$BookingDetailFromJson(Map<String, dynamic> json) {
  return _BookingDetail.fromJson(json);
}

/// @nodoc
mixin _$BookingDetail {
  String get id => throw _privateConstructorUsedError;
  DateTime get date => throw _privateConstructorUsedError;
  DateTime? get endDate => throw _privateConstructorUsedError;
  String get status => throw _privateConstructorUsedError;
  String get clientName => throw _privateConstructorUsedError;
  String get clientEmail => throw _privateConstructorUsedError;
  String? get clientPhone => throw _privateConstructorUsedError;
  String? get clientNotes => throw _privateConstructorUsedError;
  int get guestCount => throw _privateConstructorUsedError;
  String? get adminNotes => throw _privateConstructorUsedError;
  DateTime? get confirmedAt => throw _privateConstructorUsedError;
  String? get confirmedBy => throw _privateConstructorUsedError;
  DateTime? get cancelledAt => throw _privateConstructorUsedError;
  String? get cancelledBy => throw _privateConstructorUsedError;
  String? get cancellationReason => throw _privateConstructorUsedError;
  String? get totalAmount => throw _privateConstructorUsedError;
  String? get paidAmount => throw _privateConstructorUsedError;
  String? get paymentStatus => throw _privateConstructorUsedError;
  String? get paymentMethod => throw _privateConstructorUsedError;
  String? get paymentRef => throw _privateConstructorUsedError;
  DateTime? get reminderSentAt => throw _privateConstructorUsedError;
  int get reminderCount => throw _privateConstructorUsedError;
  bool get feedbackSent => throw _privateConstructorUsedError;
  int? get feedbackRating => throw _privateConstructorUsedError;
  String? get feedbackText => throw _privateConstructorUsedError;
  String get serviceId => throw _privateConstructorUsedError;
  BookingService? get service => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  DateTime get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this BookingDetail to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of BookingDetail
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $BookingDetailCopyWith<BookingDetail> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $BookingDetailCopyWith<$Res> {
  factory $BookingDetailCopyWith(
    BookingDetail value,
    $Res Function(BookingDetail) then,
  ) = _$BookingDetailCopyWithImpl<$Res, BookingDetail>;
  @useResult
  $Res call({
    String id,
    DateTime date,
    DateTime? endDate,
    String status,
    String clientName,
    String clientEmail,
    String? clientPhone,
    String? clientNotes,
    int guestCount,
    String? adminNotes,
    DateTime? confirmedAt,
    String? confirmedBy,
    DateTime? cancelledAt,
    String? cancelledBy,
    String? cancellationReason,
    String? totalAmount,
    String? paidAmount,
    String? paymentStatus,
    String? paymentMethod,
    String? paymentRef,
    DateTime? reminderSentAt,
    int reminderCount,
    bool feedbackSent,
    int? feedbackRating,
    String? feedbackText,
    String serviceId,
    BookingService? service,
    DateTime createdAt,
    DateTime updatedAt,
  });

  $BookingServiceCopyWith<$Res>? get service;
}

/// @nodoc
class _$BookingDetailCopyWithImpl<$Res, $Val extends BookingDetail>
    implements $BookingDetailCopyWith<$Res> {
  _$BookingDetailCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of BookingDetail
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? date = null,
    Object? endDate = freezed,
    Object? status = null,
    Object? clientName = null,
    Object? clientEmail = null,
    Object? clientPhone = freezed,
    Object? clientNotes = freezed,
    Object? guestCount = null,
    Object? adminNotes = freezed,
    Object? confirmedAt = freezed,
    Object? confirmedBy = freezed,
    Object? cancelledAt = freezed,
    Object? cancelledBy = freezed,
    Object? cancellationReason = freezed,
    Object? totalAmount = freezed,
    Object? paidAmount = freezed,
    Object? paymentStatus = freezed,
    Object? paymentMethod = freezed,
    Object? paymentRef = freezed,
    Object? reminderSentAt = freezed,
    Object? reminderCount = null,
    Object? feedbackSent = null,
    Object? feedbackRating = freezed,
    Object? feedbackText = freezed,
    Object? serviceId = null,
    Object? service = freezed,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            date: null == date
                ? _value.date
                : date // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            endDate: freezed == endDate
                ? _value.endDate
                : endDate // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            status: null == status
                ? _value.status
                : status // ignore: cast_nullable_to_non_nullable
                      as String,
            clientName: null == clientName
                ? _value.clientName
                : clientName // ignore: cast_nullable_to_non_nullable
                      as String,
            clientEmail: null == clientEmail
                ? _value.clientEmail
                : clientEmail // ignore: cast_nullable_to_non_nullable
                      as String,
            clientPhone: freezed == clientPhone
                ? _value.clientPhone
                : clientPhone // ignore: cast_nullable_to_non_nullable
                      as String?,
            clientNotes: freezed == clientNotes
                ? _value.clientNotes
                : clientNotes // ignore: cast_nullable_to_non_nullable
                      as String?,
            guestCount: null == guestCount
                ? _value.guestCount
                : guestCount // ignore: cast_nullable_to_non_nullable
                      as int,
            adminNotes: freezed == adminNotes
                ? _value.adminNotes
                : adminNotes // ignore: cast_nullable_to_non_nullable
                      as String?,
            confirmedAt: freezed == confirmedAt
                ? _value.confirmedAt
                : confirmedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            confirmedBy: freezed == confirmedBy
                ? _value.confirmedBy
                : confirmedBy // ignore: cast_nullable_to_non_nullable
                      as String?,
            cancelledAt: freezed == cancelledAt
                ? _value.cancelledAt
                : cancelledAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            cancelledBy: freezed == cancelledBy
                ? _value.cancelledBy
                : cancelledBy // ignore: cast_nullable_to_non_nullable
                      as String?,
            cancellationReason: freezed == cancellationReason
                ? _value.cancellationReason
                : cancellationReason // ignore: cast_nullable_to_non_nullable
                      as String?,
            totalAmount: freezed == totalAmount
                ? _value.totalAmount
                : totalAmount // ignore: cast_nullable_to_non_nullable
                      as String?,
            paidAmount: freezed == paidAmount
                ? _value.paidAmount
                : paidAmount // ignore: cast_nullable_to_non_nullable
                      as String?,
            paymentStatus: freezed == paymentStatus
                ? _value.paymentStatus
                : paymentStatus // ignore: cast_nullable_to_non_nullable
                      as String?,
            paymentMethod: freezed == paymentMethod
                ? _value.paymentMethod
                : paymentMethod // ignore: cast_nullable_to_non_nullable
                      as String?,
            paymentRef: freezed == paymentRef
                ? _value.paymentRef
                : paymentRef // ignore: cast_nullable_to_non_nullable
                      as String?,
            reminderSentAt: freezed == reminderSentAt
                ? _value.reminderSentAt
                : reminderSentAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            reminderCount: null == reminderCount
                ? _value.reminderCount
                : reminderCount // ignore: cast_nullable_to_non_nullable
                      as int,
            feedbackSent: null == feedbackSent
                ? _value.feedbackSent
                : feedbackSent // ignore: cast_nullable_to_non_nullable
                      as bool,
            feedbackRating: freezed == feedbackRating
                ? _value.feedbackRating
                : feedbackRating // ignore: cast_nullable_to_non_nullable
                      as int?,
            feedbackText: freezed == feedbackText
                ? _value.feedbackText
                : feedbackText // ignore: cast_nullable_to_non_nullable
                      as String?,
            serviceId: null == serviceId
                ? _value.serviceId
                : serviceId // ignore: cast_nullable_to_non_nullable
                      as String,
            service: freezed == service
                ? _value.service
                : service // ignore: cast_nullable_to_non_nullable
                      as BookingService?,
            createdAt: null == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            updatedAt: null == updatedAt
                ? _value.updatedAt
                : updatedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
          )
          as $Val,
    );
  }

  /// Create a copy of BookingDetail
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $BookingServiceCopyWith<$Res>? get service {
    if (_value.service == null) {
      return null;
    }

    return $BookingServiceCopyWith<$Res>(_value.service!, (value) {
      return _then(_value.copyWith(service: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$BookingDetailImplCopyWith<$Res>
    implements $BookingDetailCopyWith<$Res> {
  factory _$$BookingDetailImplCopyWith(
    _$BookingDetailImpl value,
    $Res Function(_$BookingDetailImpl) then,
  ) = __$$BookingDetailImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    DateTime date,
    DateTime? endDate,
    String status,
    String clientName,
    String clientEmail,
    String? clientPhone,
    String? clientNotes,
    int guestCount,
    String? adminNotes,
    DateTime? confirmedAt,
    String? confirmedBy,
    DateTime? cancelledAt,
    String? cancelledBy,
    String? cancellationReason,
    String? totalAmount,
    String? paidAmount,
    String? paymentStatus,
    String? paymentMethod,
    String? paymentRef,
    DateTime? reminderSentAt,
    int reminderCount,
    bool feedbackSent,
    int? feedbackRating,
    String? feedbackText,
    String serviceId,
    BookingService? service,
    DateTime createdAt,
    DateTime updatedAt,
  });

  @override
  $BookingServiceCopyWith<$Res>? get service;
}

/// @nodoc
class __$$BookingDetailImplCopyWithImpl<$Res>
    extends _$BookingDetailCopyWithImpl<$Res, _$BookingDetailImpl>
    implements _$$BookingDetailImplCopyWith<$Res> {
  __$$BookingDetailImplCopyWithImpl(
    _$BookingDetailImpl _value,
    $Res Function(_$BookingDetailImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of BookingDetail
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? date = null,
    Object? endDate = freezed,
    Object? status = null,
    Object? clientName = null,
    Object? clientEmail = null,
    Object? clientPhone = freezed,
    Object? clientNotes = freezed,
    Object? guestCount = null,
    Object? adminNotes = freezed,
    Object? confirmedAt = freezed,
    Object? confirmedBy = freezed,
    Object? cancelledAt = freezed,
    Object? cancelledBy = freezed,
    Object? cancellationReason = freezed,
    Object? totalAmount = freezed,
    Object? paidAmount = freezed,
    Object? paymentStatus = freezed,
    Object? paymentMethod = freezed,
    Object? paymentRef = freezed,
    Object? reminderSentAt = freezed,
    Object? reminderCount = null,
    Object? feedbackSent = null,
    Object? feedbackRating = freezed,
    Object? feedbackText = freezed,
    Object? serviceId = null,
    Object? service = freezed,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _$BookingDetailImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        date: null == date
            ? _value.date
            : date // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        endDate: freezed == endDate
            ? _value.endDate
            : endDate // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        status: null == status
            ? _value.status
            : status // ignore: cast_nullable_to_non_nullable
                  as String,
        clientName: null == clientName
            ? _value.clientName
            : clientName // ignore: cast_nullable_to_non_nullable
                  as String,
        clientEmail: null == clientEmail
            ? _value.clientEmail
            : clientEmail // ignore: cast_nullable_to_non_nullable
                  as String,
        clientPhone: freezed == clientPhone
            ? _value.clientPhone
            : clientPhone // ignore: cast_nullable_to_non_nullable
                  as String?,
        clientNotes: freezed == clientNotes
            ? _value.clientNotes
            : clientNotes // ignore: cast_nullable_to_non_nullable
                  as String?,
        guestCount: null == guestCount
            ? _value.guestCount
            : guestCount // ignore: cast_nullable_to_non_nullable
                  as int,
        adminNotes: freezed == adminNotes
            ? _value.adminNotes
            : adminNotes // ignore: cast_nullable_to_non_nullable
                  as String?,
        confirmedAt: freezed == confirmedAt
            ? _value.confirmedAt
            : confirmedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        confirmedBy: freezed == confirmedBy
            ? _value.confirmedBy
            : confirmedBy // ignore: cast_nullable_to_non_nullable
                  as String?,
        cancelledAt: freezed == cancelledAt
            ? _value.cancelledAt
            : cancelledAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        cancelledBy: freezed == cancelledBy
            ? _value.cancelledBy
            : cancelledBy // ignore: cast_nullable_to_non_nullable
                  as String?,
        cancellationReason: freezed == cancellationReason
            ? _value.cancellationReason
            : cancellationReason // ignore: cast_nullable_to_non_nullable
                  as String?,
        totalAmount: freezed == totalAmount
            ? _value.totalAmount
            : totalAmount // ignore: cast_nullable_to_non_nullable
                  as String?,
        paidAmount: freezed == paidAmount
            ? _value.paidAmount
            : paidAmount // ignore: cast_nullable_to_non_nullable
                  as String?,
        paymentStatus: freezed == paymentStatus
            ? _value.paymentStatus
            : paymentStatus // ignore: cast_nullable_to_non_nullable
                  as String?,
        paymentMethod: freezed == paymentMethod
            ? _value.paymentMethod
            : paymentMethod // ignore: cast_nullable_to_non_nullable
                  as String?,
        paymentRef: freezed == paymentRef
            ? _value.paymentRef
            : paymentRef // ignore: cast_nullable_to_non_nullable
                  as String?,
        reminderSentAt: freezed == reminderSentAt
            ? _value.reminderSentAt
            : reminderSentAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        reminderCount: null == reminderCount
            ? _value.reminderCount
            : reminderCount // ignore: cast_nullable_to_non_nullable
                  as int,
        feedbackSent: null == feedbackSent
            ? _value.feedbackSent
            : feedbackSent // ignore: cast_nullable_to_non_nullable
                  as bool,
        feedbackRating: freezed == feedbackRating
            ? _value.feedbackRating
            : feedbackRating // ignore: cast_nullable_to_non_nullable
                  as int?,
        feedbackText: freezed == feedbackText
            ? _value.feedbackText
            : feedbackText // ignore: cast_nullable_to_non_nullable
                  as String?,
        serviceId: null == serviceId
            ? _value.serviceId
            : serviceId // ignore: cast_nullable_to_non_nullable
                  as String,
        service: freezed == service
            ? _value.service
            : service // ignore: cast_nullable_to_non_nullable
                  as BookingService?,
        createdAt: null == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        updatedAt: null == updatedAt
            ? _value.updatedAt
            : updatedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$BookingDetailImpl implements _BookingDetail {
  const _$BookingDetailImpl({
    required this.id,
    required this.date,
    this.endDate,
    this.status = 'PENDING',
    required this.clientName,
    required this.clientEmail,
    this.clientPhone,
    this.clientNotes,
    this.guestCount = 1,
    this.adminNotes,
    this.confirmedAt,
    this.confirmedBy,
    this.cancelledAt,
    this.cancelledBy,
    this.cancellationReason,
    this.totalAmount,
    this.paidAmount,
    this.paymentStatus,
    this.paymentMethod,
    this.paymentRef,
    this.reminderSentAt,
    this.reminderCount = 0,
    this.feedbackSent = false,
    this.feedbackRating,
    this.feedbackText,
    required this.serviceId,
    this.service,
    required this.createdAt,
    required this.updatedAt,
  });

  factory _$BookingDetailImpl.fromJson(Map<String, dynamic> json) =>
      _$$BookingDetailImplFromJson(json);

  @override
  final String id;
  @override
  final DateTime date;
  @override
  final DateTime? endDate;
  @override
  @JsonKey()
  final String status;
  @override
  final String clientName;
  @override
  final String clientEmail;
  @override
  final String? clientPhone;
  @override
  final String? clientNotes;
  @override
  @JsonKey()
  final int guestCount;
  @override
  final String? adminNotes;
  @override
  final DateTime? confirmedAt;
  @override
  final String? confirmedBy;
  @override
  final DateTime? cancelledAt;
  @override
  final String? cancelledBy;
  @override
  final String? cancellationReason;
  @override
  final String? totalAmount;
  @override
  final String? paidAmount;
  @override
  final String? paymentStatus;
  @override
  final String? paymentMethod;
  @override
  final String? paymentRef;
  @override
  final DateTime? reminderSentAt;
  @override
  @JsonKey()
  final int reminderCount;
  @override
  @JsonKey()
  final bool feedbackSent;
  @override
  final int? feedbackRating;
  @override
  final String? feedbackText;
  @override
  final String serviceId;
  @override
  final BookingService? service;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  @override
  String toString() {
    return 'BookingDetail(id: $id, date: $date, endDate: $endDate, status: $status, clientName: $clientName, clientEmail: $clientEmail, clientPhone: $clientPhone, clientNotes: $clientNotes, guestCount: $guestCount, adminNotes: $adminNotes, confirmedAt: $confirmedAt, confirmedBy: $confirmedBy, cancelledAt: $cancelledAt, cancelledBy: $cancelledBy, cancellationReason: $cancellationReason, totalAmount: $totalAmount, paidAmount: $paidAmount, paymentStatus: $paymentStatus, paymentMethod: $paymentMethod, paymentRef: $paymentRef, reminderSentAt: $reminderSentAt, reminderCount: $reminderCount, feedbackSent: $feedbackSent, feedbackRating: $feedbackRating, feedbackText: $feedbackText, serviceId: $serviceId, service: $service, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$BookingDetailImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.date, date) || other.date == date) &&
            (identical(other.endDate, endDate) || other.endDate == endDate) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.clientName, clientName) ||
                other.clientName == clientName) &&
            (identical(other.clientEmail, clientEmail) ||
                other.clientEmail == clientEmail) &&
            (identical(other.clientPhone, clientPhone) ||
                other.clientPhone == clientPhone) &&
            (identical(other.clientNotes, clientNotes) ||
                other.clientNotes == clientNotes) &&
            (identical(other.guestCount, guestCount) ||
                other.guestCount == guestCount) &&
            (identical(other.adminNotes, adminNotes) ||
                other.adminNotes == adminNotes) &&
            (identical(other.confirmedAt, confirmedAt) ||
                other.confirmedAt == confirmedAt) &&
            (identical(other.confirmedBy, confirmedBy) ||
                other.confirmedBy == confirmedBy) &&
            (identical(other.cancelledAt, cancelledAt) ||
                other.cancelledAt == cancelledAt) &&
            (identical(other.cancelledBy, cancelledBy) ||
                other.cancelledBy == cancelledBy) &&
            (identical(other.cancellationReason, cancellationReason) ||
                other.cancellationReason == cancellationReason) &&
            (identical(other.totalAmount, totalAmount) ||
                other.totalAmount == totalAmount) &&
            (identical(other.paidAmount, paidAmount) ||
                other.paidAmount == paidAmount) &&
            (identical(other.paymentStatus, paymentStatus) ||
                other.paymentStatus == paymentStatus) &&
            (identical(other.paymentMethod, paymentMethod) ||
                other.paymentMethod == paymentMethod) &&
            (identical(other.paymentRef, paymentRef) ||
                other.paymentRef == paymentRef) &&
            (identical(other.reminderSentAt, reminderSentAt) ||
                other.reminderSentAt == reminderSentAt) &&
            (identical(other.reminderCount, reminderCount) ||
                other.reminderCount == reminderCount) &&
            (identical(other.feedbackSent, feedbackSent) ||
                other.feedbackSent == feedbackSent) &&
            (identical(other.feedbackRating, feedbackRating) ||
                other.feedbackRating == feedbackRating) &&
            (identical(other.feedbackText, feedbackText) ||
                other.feedbackText == feedbackText) &&
            (identical(other.serviceId, serviceId) ||
                other.serviceId == serviceId) &&
            (identical(other.service, service) || other.service == service) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hashAll([
    runtimeType,
    id,
    date,
    endDate,
    status,
    clientName,
    clientEmail,
    clientPhone,
    clientNotes,
    guestCount,
    adminNotes,
    confirmedAt,
    confirmedBy,
    cancelledAt,
    cancelledBy,
    cancellationReason,
    totalAmount,
    paidAmount,
    paymentStatus,
    paymentMethod,
    paymentRef,
    reminderSentAt,
    reminderCount,
    feedbackSent,
    feedbackRating,
    feedbackText,
    serviceId,
    service,
    createdAt,
    updatedAt,
  ]);

  /// Create a copy of BookingDetail
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$BookingDetailImplCopyWith<_$BookingDetailImpl> get copyWith =>
      __$$BookingDetailImplCopyWithImpl<_$BookingDetailImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$BookingDetailImplToJson(this);
  }
}

abstract class _BookingDetail implements BookingDetail {
  const factory _BookingDetail({
    required final String id,
    required final DateTime date,
    final DateTime? endDate,
    final String status,
    required final String clientName,
    required final String clientEmail,
    final String? clientPhone,
    final String? clientNotes,
    final int guestCount,
    final String? adminNotes,
    final DateTime? confirmedAt,
    final String? confirmedBy,
    final DateTime? cancelledAt,
    final String? cancelledBy,
    final String? cancellationReason,
    final String? totalAmount,
    final String? paidAmount,
    final String? paymentStatus,
    final String? paymentMethod,
    final String? paymentRef,
    final DateTime? reminderSentAt,
    final int reminderCount,
    final bool feedbackSent,
    final int? feedbackRating,
    final String? feedbackText,
    required final String serviceId,
    final BookingService? service,
    required final DateTime createdAt,
    required final DateTime updatedAt,
  }) = _$BookingDetailImpl;

  factory _BookingDetail.fromJson(Map<String, dynamic> json) =
      _$BookingDetailImpl.fromJson;

  @override
  String get id;
  @override
  DateTime get date;
  @override
  DateTime? get endDate;
  @override
  String get status;
  @override
  String get clientName;
  @override
  String get clientEmail;
  @override
  String? get clientPhone;
  @override
  String? get clientNotes;
  @override
  int get guestCount;
  @override
  String? get adminNotes;
  @override
  DateTime? get confirmedAt;
  @override
  String? get confirmedBy;
  @override
  DateTime? get cancelledAt;
  @override
  String? get cancelledBy;
  @override
  String? get cancellationReason;
  @override
  String? get totalAmount;
  @override
  String? get paidAmount;
  @override
  String? get paymentStatus;
  @override
  String? get paymentMethod;
  @override
  String? get paymentRef;
  @override
  DateTime? get reminderSentAt;
  @override
  int get reminderCount;
  @override
  bool get feedbackSent;
  @override
  int? get feedbackRating;
  @override
  String? get feedbackText;
  @override
  String get serviceId;
  @override
  BookingService? get service;
  @override
  DateTime get createdAt;
  @override
  DateTime get updatedAt;

  /// Create a copy of BookingDetail
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$BookingDetailImplCopyWith<_$BookingDetailImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
