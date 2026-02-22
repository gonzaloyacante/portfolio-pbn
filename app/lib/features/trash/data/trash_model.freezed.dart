// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'trash_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

/// @nodoc
mixin _$TrashItem {
  String get id => throw _privateConstructorUsedError;
  String get type => throw _privateConstructorUsedError;
  String get displayName => throw _privateConstructorUsedError;
  DateTime get deletedAt => throw _privateConstructorUsedError;

  /// Create a copy of TrashItem
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $TrashItemCopyWith<TrashItem> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $TrashItemCopyWith<$Res> {
  factory $TrashItemCopyWith(TrashItem value, $Res Function(TrashItem) then) =
      _$TrashItemCopyWithImpl<$Res, TrashItem>;
  @useResult
  $Res call({String id, String type, String displayName, DateTime deletedAt});
}

/// @nodoc
class _$TrashItemCopyWithImpl<$Res, $Val extends TrashItem>
    implements $TrashItemCopyWith<$Res> {
  _$TrashItemCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of TrashItem
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? type = null,
    Object? displayName = null,
    Object? deletedAt = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            type: null == type
                ? _value.type
                : type // ignore: cast_nullable_to_non_nullable
                      as String,
            displayName: null == displayName
                ? _value.displayName
                : displayName // ignore: cast_nullable_to_non_nullable
                      as String,
            deletedAt: null == deletedAt
                ? _value.deletedAt
                : deletedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$TrashItemImplCopyWith<$Res>
    implements $TrashItemCopyWith<$Res> {
  factory _$$TrashItemImplCopyWith(
    _$TrashItemImpl value,
    $Res Function(_$TrashItemImpl) then,
  ) = __$$TrashItemImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String id, String type, String displayName, DateTime deletedAt});
}

/// @nodoc
class __$$TrashItemImplCopyWithImpl<$Res>
    extends _$TrashItemCopyWithImpl<$Res, _$TrashItemImpl>
    implements _$$TrashItemImplCopyWith<$Res> {
  __$$TrashItemImplCopyWithImpl(
    _$TrashItemImpl _value,
    $Res Function(_$TrashItemImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of TrashItem
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? type = null,
    Object? displayName = null,
    Object? deletedAt = null,
  }) {
    return _then(
      _$TrashItemImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        type: null == type
            ? _value.type
            : type // ignore: cast_nullable_to_non_nullable
                  as String,
        displayName: null == displayName
            ? _value.displayName
            : displayName // ignore: cast_nullable_to_non_nullable
                  as String,
        deletedAt: null == deletedAt
            ? _value.deletedAt
            : deletedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
      ),
    );
  }
}

/// @nodoc

class _$TrashItemImpl implements _TrashItem {
  const _$TrashItemImpl({
    required this.id,
    required this.type,
    required this.displayName,
    required this.deletedAt,
  });

  @override
  final String id;
  @override
  final String type;
  @override
  final String displayName;
  @override
  final DateTime deletedAt;

  @override
  String toString() {
    return 'TrashItem(id: $id, type: $type, displayName: $displayName, deletedAt: $deletedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$TrashItemImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.displayName, displayName) ||
                other.displayName == displayName) &&
            (identical(other.deletedAt, deletedAt) ||
                other.deletedAt == deletedAt));
  }

  @override
  int get hashCode =>
      Object.hash(runtimeType, id, type, displayName, deletedAt);

  /// Create a copy of TrashItem
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$TrashItemImplCopyWith<_$TrashItemImpl> get copyWith =>
      __$$TrashItemImplCopyWithImpl<_$TrashItemImpl>(this, _$identity);
}

abstract class _TrashItem implements TrashItem {
  const factory _TrashItem({
    required final String id,
    required final String type,
    required final String displayName,
    required final DateTime deletedAt,
  }) = _$TrashItemImpl;

  @override
  String get id;
  @override
  String get type;
  @override
  String get displayName;
  @override
  DateTime get deletedAt;

  /// Create a copy of TrashItem
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$TrashItemImplCopyWith<_$TrashItemImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
