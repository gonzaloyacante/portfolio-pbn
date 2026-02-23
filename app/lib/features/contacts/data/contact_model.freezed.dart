// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'contact_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

ContactItem _$ContactItemFromJson(Map<String, dynamic> json) {
  return _ContactItem.fromJson(json);
}

/// @nodoc
mixin _$ContactItem {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  String? get phone => throw _privateConstructorUsedError;
  String? get subject => throw _privateConstructorUsedError;
  String get status => throw _privateConstructorUsedError;
  String get priority => throw _privateConstructorUsedError;
  bool get isRead => throw _privateConstructorUsedError;
  bool get isReplied => throw _privateConstructorUsedError;
  DateTime? get readAt => throw _privateConstructorUsedError;
  DateTime? get repliedAt => throw _privateConstructorUsedError;
  int? get leadScore => throw _privateConstructorUsedError;
  String? get leadSource => throw _privateConstructorUsedError;
  List<String> get tags => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  DateTime get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this ContactItem to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ContactItem
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ContactItemCopyWith<ContactItem> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ContactItemCopyWith<$Res> {
  factory $ContactItemCopyWith(
    ContactItem value,
    $Res Function(ContactItem) then,
  ) = _$ContactItemCopyWithImpl<$Res, ContactItem>;
  @useResult
  $Res call({
    String id,
    String name,
    String email,
    String? phone,
    String? subject,
    String status,
    String priority,
    bool isRead,
    bool isReplied,
    DateTime? readAt,
    DateTime? repliedAt,
    int? leadScore,
    String? leadSource,
    List<String> tags,
    DateTime createdAt,
    DateTime updatedAt,
  });
}

/// @nodoc
class _$ContactItemCopyWithImpl<$Res, $Val extends ContactItem>
    implements $ContactItemCopyWith<$Res> {
  _$ContactItemCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ContactItem
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? email = null,
    Object? phone = freezed,
    Object? subject = freezed,
    Object? status = null,
    Object? priority = null,
    Object? isRead = null,
    Object? isReplied = null,
    Object? readAt = freezed,
    Object? repliedAt = freezed,
    Object? leadScore = freezed,
    Object? leadSource = freezed,
    Object? tags = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            name: null == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String,
            email: null == email
                ? _value.email
                : email // ignore: cast_nullable_to_non_nullable
                      as String,
            phone: freezed == phone
                ? _value.phone
                : phone // ignore: cast_nullable_to_non_nullable
                      as String?,
            subject: freezed == subject
                ? _value.subject
                : subject // ignore: cast_nullable_to_non_nullable
                      as String?,
            status: null == status
                ? _value.status
                : status // ignore: cast_nullable_to_non_nullable
                      as String,
            priority: null == priority
                ? _value.priority
                : priority // ignore: cast_nullable_to_non_nullable
                      as String,
            isRead: null == isRead
                ? _value.isRead
                : isRead // ignore: cast_nullable_to_non_nullable
                      as bool,
            isReplied: null == isReplied
                ? _value.isReplied
                : isReplied // ignore: cast_nullable_to_non_nullable
                      as bool,
            readAt: freezed == readAt
                ? _value.readAt
                : readAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            repliedAt: freezed == repliedAt
                ? _value.repliedAt
                : repliedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            leadScore: freezed == leadScore
                ? _value.leadScore
                : leadScore // ignore: cast_nullable_to_non_nullable
                      as int?,
            leadSource: freezed == leadSource
                ? _value.leadSource
                : leadSource // ignore: cast_nullable_to_non_nullable
                      as String?,
            tags: null == tags
                ? _value.tags
                : tags // ignore: cast_nullable_to_non_nullable
                      as List<String>,
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
}

/// @nodoc
abstract class _$$ContactItemImplCopyWith<$Res>
    implements $ContactItemCopyWith<$Res> {
  factory _$$ContactItemImplCopyWith(
    _$ContactItemImpl value,
    $Res Function(_$ContactItemImpl) then,
  ) = __$$ContactItemImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String name,
    String email,
    String? phone,
    String? subject,
    String status,
    String priority,
    bool isRead,
    bool isReplied,
    DateTime? readAt,
    DateTime? repliedAt,
    int? leadScore,
    String? leadSource,
    List<String> tags,
    DateTime createdAt,
    DateTime updatedAt,
  });
}

/// @nodoc
class __$$ContactItemImplCopyWithImpl<$Res>
    extends _$ContactItemCopyWithImpl<$Res, _$ContactItemImpl>
    implements _$$ContactItemImplCopyWith<$Res> {
  __$$ContactItemImplCopyWithImpl(
    _$ContactItemImpl _value,
    $Res Function(_$ContactItemImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ContactItem
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? email = null,
    Object? phone = freezed,
    Object? subject = freezed,
    Object? status = null,
    Object? priority = null,
    Object? isRead = null,
    Object? isReplied = null,
    Object? readAt = freezed,
    Object? repliedAt = freezed,
    Object? leadScore = freezed,
    Object? leadSource = freezed,
    Object? tags = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _$ContactItemImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        name: null == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String,
        email: null == email
            ? _value.email
            : email // ignore: cast_nullable_to_non_nullable
                  as String,
        phone: freezed == phone
            ? _value.phone
            : phone // ignore: cast_nullable_to_non_nullable
                  as String?,
        subject: freezed == subject
            ? _value.subject
            : subject // ignore: cast_nullable_to_non_nullable
                  as String?,
        status: null == status
            ? _value.status
            : status // ignore: cast_nullable_to_non_nullable
                  as String,
        priority: null == priority
            ? _value.priority
            : priority // ignore: cast_nullable_to_non_nullable
                  as String,
        isRead: null == isRead
            ? _value.isRead
            : isRead // ignore: cast_nullable_to_non_nullable
                  as bool,
        isReplied: null == isReplied
            ? _value.isReplied
            : isReplied // ignore: cast_nullable_to_non_nullable
                  as bool,
        readAt: freezed == readAt
            ? _value.readAt
            : readAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        repliedAt: freezed == repliedAt
            ? _value.repliedAt
            : repliedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        leadScore: freezed == leadScore
            ? _value.leadScore
            : leadScore // ignore: cast_nullable_to_non_nullable
                  as int?,
        leadSource: freezed == leadSource
            ? _value.leadSource
            : leadSource // ignore: cast_nullable_to_non_nullable
                  as String?,
        tags: null == tags
            ? _value._tags
            : tags // ignore: cast_nullable_to_non_nullable
                  as List<String>,
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
class _$ContactItemImpl implements _ContactItem {
  const _$ContactItemImpl({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
    this.subject,
    this.status = 'NEW',
    this.priority = 'MEDIUM',
    this.isRead = false,
    this.isReplied = false,
    this.readAt,
    this.repliedAt,
    this.leadScore,
    this.leadSource,
    final List<String> tags = const [],
    required this.createdAt,
    required this.updatedAt,
  }) : _tags = tags;

  factory _$ContactItemImpl.fromJson(Map<String, dynamic> json) =>
      _$$ContactItemImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String email;
  @override
  final String? phone;
  @override
  final String? subject;
  @override
  @JsonKey()
  final String status;
  @override
  @JsonKey()
  final String priority;
  @override
  @JsonKey()
  final bool isRead;
  @override
  @JsonKey()
  final bool isReplied;
  @override
  final DateTime? readAt;
  @override
  final DateTime? repliedAt;
  @override
  final int? leadScore;
  @override
  final String? leadSource;
  final List<String> _tags;
  @override
  @JsonKey()
  List<String> get tags {
    if (_tags is EqualUnmodifiableListView) return _tags;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_tags);
  }

  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  @override
  String toString() {
    return 'ContactItem(id: $id, name: $name, email: $email, phone: $phone, subject: $subject, status: $status, priority: $priority, isRead: $isRead, isReplied: $isReplied, readAt: $readAt, repliedAt: $repliedAt, leadScore: $leadScore, leadSource: $leadSource, tags: $tags, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ContactItemImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.phone, phone) || other.phone == phone) &&
            (identical(other.subject, subject) || other.subject == subject) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.priority, priority) ||
                other.priority == priority) &&
            (identical(other.isRead, isRead) || other.isRead == isRead) &&
            (identical(other.isReplied, isReplied) ||
                other.isReplied == isReplied) &&
            (identical(other.readAt, readAt) || other.readAt == readAt) &&
            (identical(other.repliedAt, repliedAt) ||
                other.repliedAt == repliedAt) &&
            (identical(other.leadScore, leadScore) ||
                other.leadScore == leadScore) &&
            (identical(other.leadSource, leadSource) ||
                other.leadSource == leadSource) &&
            const DeepCollectionEquality().equals(other._tags, _tags) &&
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
    name,
    email,
    phone,
    subject,
    status,
    priority,
    isRead,
    isReplied,
    readAt,
    repliedAt,
    leadScore,
    leadSource,
    const DeepCollectionEquality().hash(_tags),
    createdAt,
    updatedAt,
  );

  /// Create a copy of ContactItem
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ContactItemImplCopyWith<_$ContactItemImpl> get copyWith =>
      __$$ContactItemImplCopyWithImpl<_$ContactItemImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ContactItemImplToJson(this);
  }
}

abstract class _ContactItem implements ContactItem {
  const factory _ContactItem({
    required final String id,
    required final String name,
    required final String email,
    final String? phone,
    final String? subject,
    final String status,
    final String priority,
    final bool isRead,
    final bool isReplied,
    final DateTime? readAt,
    final DateTime? repliedAt,
    final int? leadScore,
    final String? leadSource,
    final List<String> tags,
    required final DateTime createdAt,
    required final DateTime updatedAt,
  }) = _$ContactItemImpl;

  factory _ContactItem.fromJson(Map<String, dynamic> json) =
      _$ContactItemImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get email;
  @override
  String? get phone;
  @override
  String? get subject;
  @override
  String get status;
  @override
  String get priority;
  @override
  bool get isRead;
  @override
  bool get isReplied;
  @override
  DateTime? get readAt;
  @override
  DateTime? get repliedAt;
  @override
  int? get leadScore;
  @override
  String? get leadSource;
  @override
  List<String> get tags;
  @override
  DateTime get createdAt;
  @override
  DateTime get updatedAt;

  /// Create a copy of ContactItem
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ContactItemImplCopyWith<_$ContactItemImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

ContactDetail _$ContactDetailFromJson(Map<String, dynamic> json) {
  return _ContactDetail.fromJson(json);
}

/// @nodoc
mixin _$ContactDetail {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  String? get phone => throw _privateConstructorUsedError;
  String get message => throw _privateConstructorUsedError;
  String? get subject => throw _privateConstructorUsedError;
  String get responsePreference => throw _privateConstructorUsedError;
  int? get leadScore => throw _privateConstructorUsedError;
  String? get leadSource => throw _privateConstructorUsedError;
  String get status => throw _privateConstructorUsedError;
  String get priority => throw _privateConstructorUsedError;
  String? get assignedTo => throw _privateConstructorUsedError;
  bool get isRead => throw _privateConstructorUsedError;
  DateTime? get readAt => throw _privateConstructorUsedError;
  String? get readBy => throw _privateConstructorUsedError;
  bool get isReplied => throw _privateConstructorUsedError;
  DateTime? get repliedAt => throw _privateConstructorUsedError;
  String? get repliedBy => throw _privateConstructorUsedError;
  String? get replyText => throw _privateConstructorUsedError;
  String? get adminNote => throw _privateConstructorUsedError;
  List<String> get tags => throw _privateConstructorUsedError;
  String? get ipAddress => throw _privateConstructorUsedError;
  String? get referrer => throw _privateConstructorUsedError;
  String? get utmSource => throw _privateConstructorUsedError;
  String? get utmMedium => throw _privateConstructorUsedError;
  String? get utmCampaign => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  DateTime get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this ContactDetail to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ContactDetail
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ContactDetailCopyWith<ContactDetail> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ContactDetailCopyWith<$Res> {
  factory $ContactDetailCopyWith(
    ContactDetail value,
    $Res Function(ContactDetail) then,
  ) = _$ContactDetailCopyWithImpl<$Res, ContactDetail>;
  @useResult
  $Res call({
    String id,
    String name,
    String email,
    String? phone,
    String message,
    String? subject,
    String responsePreference,
    int? leadScore,
    String? leadSource,
    String status,
    String priority,
    String? assignedTo,
    bool isRead,
    DateTime? readAt,
    String? readBy,
    bool isReplied,
    DateTime? repliedAt,
    String? repliedBy,
    String? replyText,
    String? adminNote,
    List<String> tags,
    String? ipAddress,
    String? referrer,
    String? utmSource,
    String? utmMedium,
    String? utmCampaign,
    DateTime createdAt,
    DateTime updatedAt,
  });
}

/// @nodoc
class _$ContactDetailCopyWithImpl<$Res, $Val extends ContactDetail>
    implements $ContactDetailCopyWith<$Res> {
  _$ContactDetailCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ContactDetail
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? email = null,
    Object? phone = freezed,
    Object? message = null,
    Object? subject = freezed,
    Object? responsePreference = null,
    Object? leadScore = freezed,
    Object? leadSource = freezed,
    Object? status = null,
    Object? priority = null,
    Object? assignedTo = freezed,
    Object? isRead = null,
    Object? readAt = freezed,
    Object? readBy = freezed,
    Object? isReplied = null,
    Object? repliedAt = freezed,
    Object? repliedBy = freezed,
    Object? replyText = freezed,
    Object? adminNote = freezed,
    Object? tags = null,
    Object? ipAddress = freezed,
    Object? referrer = freezed,
    Object? utmSource = freezed,
    Object? utmMedium = freezed,
    Object? utmCampaign = freezed,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            name: null == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String,
            email: null == email
                ? _value.email
                : email // ignore: cast_nullable_to_non_nullable
                      as String,
            phone: freezed == phone
                ? _value.phone
                : phone // ignore: cast_nullable_to_non_nullable
                      as String?,
            message: null == message
                ? _value.message
                : message // ignore: cast_nullable_to_non_nullable
                      as String,
            subject: freezed == subject
                ? _value.subject
                : subject // ignore: cast_nullable_to_non_nullable
                      as String?,
            responsePreference: null == responsePreference
                ? _value.responsePreference
                : responsePreference // ignore: cast_nullable_to_non_nullable
                      as String,
            leadScore: freezed == leadScore
                ? _value.leadScore
                : leadScore // ignore: cast_nullable_to_non_nullable
                      as int?,
            leadSource: freezed == leadSource
                ? _value.leadSource
                : leadSource // ignore: cast_nullable_to_non_nullable
                      as String?,
            status: null == status
                ? _value.status
                : status // ignore: cast_nullable_to_non_nullable
                      as String,
            priority: null == priority
                ? _value.priority
                : priority // ignore: cast_nullable_to_non_nullable
                      as String,
            assignedTo: freezed == assignedTo
                ? _value.assignedTo
                : assignedTo // ignore: cast_nullable_to_non_nullable
                      as String?,
            isRead: null == isRead
                ? _value.isRead
                : isRead // ignore: cast_nullable_to_non_nullable
                      as bool,
            readAt: freezed == readAt
                ? _value.readAt
                : readAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            readBy: freezed == readBy
                ? _value.readBy
                : readBy // ignore: cast_nullable_to_non_nullable
                      as String?,
            isReplied: null == isReplied
                ? _value.isReplied
                : isReplied // ignore: cast_nullable_to_non_nullable
                      as bool,
            repliedAt: freezed == repliedAt
                ? _value.repliedAt
                : repliedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            repliedBy: freezed == repliedBy
                ? _value.repliedBy
                : repliedBy // ignore: cast_nullable_to_non_nullable
                      as String?,
            replyText: freezed == replyText
                ? _value.replyText
                : replyText // ignore: cast_nullable_to_non_nullable
                      as String?,
            adminNote: freezed == adminNote
                ? _value.adminNote
                : adminNote // ignore: cast_nullable_to_non_nullable
                      as String?,
            tags: null == tags
                ? _value.tags
                : tags // ignore: cast_nullable_to_non_nullable
                      as List<String>,
            ipAddress: freezed == ipAddress
                ? _value.ipAddress
                : ipAddress // ignore: cast_nullable_to_non_nullable
                      as String?,
            referrer: freezed == referrer
                ? _value.referrer
                : referrer // ignore: cast_nullable_to_non_nullable
                      as String?,
            utmSource: freezed == utmSource
                ? _value.utmSource
                : utmSource // ignore: cast_nullable_to_non_nullable
                      as String?,
            utmMedium: freezed == utmMedium
                ? _value.utmMedium
                : utmMedium // ignore: cast_nullable_to_non_nullable
                      as String?,
            utmCampaign: freezed == utmCampaign
                ? _value.utmCampaign
                : utmCampaign // ignore: cast_nullable_to_non_nullable
                      as String?,
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
}

/// @nodoc
abstract class _$$ContactDetailImplCopyWith<$Res>
    implements $ContactDetailCopyWith<$Res> {
  factory _$$ContactDetailImplCopyWith(
    _$ContactDetailImpl value,
    $Res Function(_$ContactDetailImpl) then,
  ) = __$$ContactDetailImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String name,
    String email,
    String? phone,
    String message,
    String? subject,
    String responsePreference,
    int? leadScore,
    String? leadSource,
    String status,
    String priority,
    String? assignedTo,
    bool isRead,
    DateTime? readAt,
    String? readBy,
    bool isReplied,
    DateTime? repliedAt,
    String? repliedBy,
    String? replyText,
    String? adminNote,
    List<String> tags,
    String? ipAddress,
    String? referrer,
    String? utmSource,
    String? utmMedium,
    String? utmCampaign,
    DateTime createdAt,
    DateTime updatedAt,
  });
}

/// @nodoc
class __$$ContactDetailImplCopyWithImpl<$Res>
    extends _$ContactDetailCopyWithImpl<$Res, _$ContactDetailImpl>
    implements _$$ContactDetailImplCopyWith<$Res> {
  __$$ContactDetailImplCopyWithImpl(
    _$ContactDetailImpl _value,
    $Res Function(_$ContactDetailImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ContactDetail
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? email = null,
    Object? phone = freezed,
    Object? message = null,
    Object? subject = freezed,
    Object? responsePreference = null,
    Object? leadScore = freezed,
    Object? leadSource = freezed,
    Object? status = null,
    Object? priority = null,
    Object? assignedTo = freezed,
    Object? isRead = null,
    Object? readAt = freezed,
    Object? readBy = freezed,
    Object? isReplied = null,
    Object? repliedAt = freezed,
    Object? repliedBy = freezed,
    Object? replyText = freezed,
    Object? adminNote = freezed,
    Object? tags = null,
    Object? ipAddress = freezed,
    Object? referrer = freezed,
    Object? utmSource = freezed,
    Object? utmMedium = freezed,
    Object? utmCampaign = freezed,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _$ContactDetailImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        name: null == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String,
        email: null == email
            ? _value.email
            : email // ignore: cast_nullable_to_non_nullable
                  as String,
        phone: freezed == phone
            ? _value.phone
            : phone // ignore: cast_nullable_to_non_nullable
                  as String?,
        message: null == message
            ? _value.message
            : message // ignore: cast_nullable_to_non_nullable
                  as String,
        subject: freezed == subject
            ? _value.subject
            : subject // ignore: cast_nullable_to_non_nullable
                  as String?,
        responsePreference: null == responsePreference
            ? _value.responsePreference
            : responsePreference // ignore: cast_nullable_to_non_nullable
                  as String,
        leadScore: freezed == leadScore
            ? _value.leadScore
            : leadScore // ignore: cast_nullable_to_non_nullable
                  as int?,
        leadSource: freezed == leadSource
            ? _value.leadSource
            : leadSource // ignore: cast_nullable_to_non_nullable
                  as String?,
        status: null == status
            ? _value.status
            : status // ignore: cast_nullable_to_non_nullable
                  as String,
        priority: null == priority
            ? _value.priority
            : priority // ignore: cast_nullable_to_non_nullable
                  as String,
        assignedTo: freezed == assignedTo
            ? _value.assignedTo
            : assignedTo // ignore: cast_nullable_to_non_nullable
                  as String?,
        isRead: null == isRead
            ? _value.isRead
            : isRead // ignore: cast_nullable_to_non_nullable
                  as bool,
        readAt: freezed == readAt
            ? _value.readAt
            : readAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        readBy: freezed == readBy
            ? _value.readBy
            : readBy // ignore: cast_nullable_to_non_nullable
                  as String?,
        isReplied: null == isReplied
            ? _value.isReplied
            : isReplied // ignore: cast_nullable_to_non_nullable
                  as bool,
        repliedAt: freezed == repliedAt
            ? _value.repliedAt
            : repliedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        repliedBy: freezed == repliedBy
            ? _value.repliedBy
            : repliedBy // ignore: cast_nullable_to_non_nullable
                  as String?,
        replyText: freezed == replyText
            ? _value.replyText
            : replyText // ignore: cast_nullable_to_non_nullable
                  as String?,
        adminNote: freezed == adminNote
            ? _value.adminNote
            : adminNote // ignore: cast_nullable_to_non_nullable
                  as String?,
        tags: null == tags
            ? _value._tags
            : tags // ignore: cast_nullable_to_non_nullable
                  as List<String>,
        ipAddress: freezed == ipAddress
            ? _value.ipAddress
            : ipAddress // ignore: cast_nullable_to_non_nullable
                  as String?,
        referrer: freezed == referrer
            ? _value.referrer
            : referrer // ignore: cast_nullable_to_non_nullable
                  as String?,
        utmSource: freezed == utmSource
            ? _value.utmSource
            : utmSource // ignore: cast_nullable_to_non_nullable
                  as String?,
        utmMedium: freezed == utmMedium
            ? _value.utmMedium
            : utmMedium // ignore: cast_nullable_to_non_nullable
                  as String?,
        utmCampaign: freezed == utmCampaign
            ? _value.utmCampaign
            : utmCampaign // ignore: cast_nullable_to_non_nullable
                  as String?,
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
class _$ContactDetailImpl implements _ContactDetail {
  const _$ContactDetailImpl({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
    required this.message,
    this.subject,
    this.responsePreference = 'EMAIL',
    this.leadScore,
    this.leadSource,
    this.status = 'NEW',
    this.priority = 'MEDIUM',
    this.assignedTo,
    this.isRead = false,
    this.readAt,
    this.readBy,
    this.isReplied = false,
    this.repliedAt,
    this.repliedBy,
    this.replyText,
    this.adminNote,
    final List<String> tags = const [],
    this.ipAddress,
    this.referrer,
    this.utmSource,
    this.utmMedium,
    this.utmCampaign,
    required this.createdAt,
    required this.updatedAt,
  }) : _tags = tags;

  factory _$ContactDetailImpl.fromJson(Map<String, dynamic> json) =>
      _$$ContactDetailImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String email;
  @override
  final String? phone;
  @override
  final String message;
  @override
  final String? subject;
  @override
  @JsonKey()
  final String responsePreference;
  @override
  final int? leadScore;
  @override
  final String? leadSource;
  @override
  @JsonKey()
  final String status;
  @override
  @JsonKey()
  final String priority;
  @override
  final String? assignedTo;
  @override
  @JsonKey()
  final bool isRead;
  @override
  final DateTime? readAt;
  @override
  final String? readBy;
  @override
  @JsonKey()
  final bool isReplied;
  @override
  final DateTime? repliedAt;
  @override
  final String? repliedBy;
  @override
  final String? replyText;
  @override
  final String? adminNote;
  final List<String> _tags;
  @override
  @JsonKey()
  List<String> get tags {
    if (_tags is EqualUnmodifiableListView) return _tags;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_tags);
  }

  @override
  final String? ipAddress;
  @override
  final String? referrer;
  @override
  final String? utmSource;
  @override
  final String? utmMedium;
  @override
  final String? utmCampaign;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  @override
  String toString() {
    return 'ContactDetail(id: $id, name: $name, email: $email, phone: $phone, message: $message, subject: $subject, responsePreference: $responsePreference, leadScore: $leadScore, leadSource: $leadSource, status: $status, priority: $priority, assignedTo: $assignedTo, isRead: $isRead, readAt: $readAt, readBy: $readBy, isReplied: $isReplied, repliedAt: $repliedAt, repliedBy: $repliedBy, replyText: $replyText, adminNote: $adminNote, tags: $tags, ipAddress: $ipAddress, referrer: $referrer, utmSource: $utmSource, utmMedium: $utmMedium, utmCampaign: $utmCampaign, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ContactDetailImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.phone, phone) || other.phone == phone) &&
            (identical(other.message, message) || other.message == message) &&
            (identical(other.subject, subject) || other.subject == subject) &&
            (identical(other.responsePreference, responsePreference) ||
                other.responsePreference == responsePreference) &&
            (identical(other.leadScore, leadScore) ||
                other.leadScore == leadScore) &&
            (identical(other.leadSource, leadSource) ||
                other.leadSource == leadSource) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.priority, priority) ||
                other.priority == priority) &&
            (identical(other.assignedTo, assignedTo) ||
                other.assignedTo == assignedTo) &&
            (identical(other.isRead, isRead) || other.isRead == isRead) &&
            (identical(other.readAt, readAt) || other.readAt == readAt) &&
            (identical(other.readBy, readBy) || other.readBy == readBy) &&
            (identical(other.isReplied, isReplied) ||
                other.isReplied == isReplied) &&
            (identical(other.repliedAt, repliedAt) ||
                other.repliedAt == repliedAt) &&
            (identical(other.repliedBy, repliedBy) ||
                other.repliedBy == repliedBy) &&
            (identical(other.replyText, replyText) ||
                other.replyText == replyText) &&
            (identical(other.adminNote, adminNote) ||
                other.adminNote == adminNote) &&
            const DeepCollectionEquality().equals(other._tags, _tags) &&
            (identical(other.ipAddress, ipAddress) ||
                other.ipAddress == ipAddress) &&
            (identical(other.referrer, referrer) ||
                other.referrer == referrer) &&
            (identical(other.utmSource, utmSource) ||
                other.utmSource == utmSource) &&
            (identical(other.utmMedium, utmMedium) ||
                other.utmMedium == utmMedium) &&
            (identical(other.utmCampaign, utmCampaign) ||
                other.utmCampaign == utmCampaign) &&
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
    name,
    email,
    phone,
    message,
    subject,
    responsePreference,
    leadScore,
    leadSource,
    status,
    priority,
    assignedTo,
    isRead,
    readAt,
    readBy,
    isReplied,
    repliedAt,
    repliedBy,
    replyText,
    adminNote,
    const DeepCollectionEquality().hash(_tags),
    ipAddress,
    referrer,
    utmSource,
    utmMedium,
    utmCampaign,
    createdAt,
    updatedAt,
  ]);

  /// Create a copy of ContactDetail
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ContactDetailImplCopyWith<_$ContactDetailImpl> get copyWith =>
      __$$ContactDetailImplCopyWithImpl<_$ContactDetailImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ContactDetailImplToJson(this);
  }
}

abstract class _ContactDetail implements ContactDetail {
  const factory _ContactDetail({
    required final String id,
    required final String name,
    required final String email,
    final String? phone,
    required final String message,
    final String? subject,
    final String responsePreference,
    final int? leadScore,
    final String? leadSource,
    final String status,
    final String priority,
    final String? assignedTo,
    final bool isRead,
    final DateTime? readAt,
    final String? readBy,
    final bool isReplied,
    final DateTime? repliedAt,
    final String? repliedBy,
    final String? replyText,
    final String? adminNote,
    final List<String> tags,
    final String? ipAddress,
    final String? referrer,
    final String? utmSource,
    final String? utmMedium,
    final String? utmCampaign,
    required final DateTime createdAt,
    required final DateTime updatedAt,
  }) = _$ContactDetailImpl;

  factory _ContactDetail.fromJson(Map<String, dynamic> json) =
      _$ContactDetailImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get email;
  @override
  String? get phone;
  @override
  String get message;
  @override
  String? get subject;
  @override
  String get responsePreference;
  @override
  int? get leadScore;
  @override
  String? get leadSource;
  @override
  String get status;
  @override
  String get priority;
  @override
  String? get assignedTo;
  @override
  bool get isRead;
  @override
  DateTime? get readAt;
  @override
  String? get readBy;
  @override
  bool get isReplied;
  @override
  DateTime? get repliedAt;
  @override
  String? get repliedBy;
  @override
  String? get replyText;
  @override
  String? get adminNote;
  @override
  List<String> get tags;
  @override
  String? get ipAddress;
  @override
  String? get referrer;
  @override
  String? get utmSource;
  @override
  String? get utmMedium;
  @override
  String? get utmCampaign;
  @override
  DateTime get createdAt;
  @override
  DateTime get updatedAt;

  /// Create a copy of ContactDetail
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ContactDetailImplCopyWith<_$ContactDetailImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
