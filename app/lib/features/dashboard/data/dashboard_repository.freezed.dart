// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'dashboard_repository.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$DashboardStats {

 int get totalProjects; int get totalCategories; int get totalServices; int get totalTestimonials; int get newContacts; int get pendingBookings; int get pendingTestimonials; int get trashCount; int get pageViews30d;
/// Create a copy of DashboardStats
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$DashboardStatsCopyWith<DashboardStats> get copyWith => _$DashboardStatsCopyWithImpl<DashboardStats>(this as DashboardStats, _$identity);

  /// Serializes this DashboardStats to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is DashboardStats&&(identical(other.totalProjects, totalProjects) || other.totalProjects == totalProjects)&&(identical(other.totalCategories, totalCategories) || other.totalCategories == totalCategories)&&(identical(other.totalServices, totalServices) || other.totalServices == totalServices)&&(identical(other.totalTestimonials, totalTestimonials) || other.totalTestimonials == totalTestimonials)&&(identical(other.newContacts, newContacts) || other.newContacts == newContacts)&&(identical(other.pendingBookings, pendingBookings) || other.pendingBookings == pendingBookings)&&(identical(other.pendingTestimonials, pendingTestimonials) || other.pendingTestimonials == pendingTestimonials)&&(identical(other.trashCount, trashCount) || other.trashCount == trashCount)&&(identical(other.pageViews30d, pageViews30d) || other.pageViews30d == pageViews30d));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,totalProjects,totalCategories,totalServices,totalTestimonials,newContacts,pendingBookings,pendingTestimonials,trashCount,pageViews30d);

@override
String toString() {
  return 'DashboardStats(totalProjects: $totalProjects, totalCategories: $totalCategories, totalServices: $totalServices, totalTestimonials: $totalTestimonials, newContacts: $newContacts, pendingBookings: $pendingBookings, pendingTestimonials: $pendingTestimonials, trashCount: $trashCount, pageViews30d: $pageViews30d)';
}


}

/// @nodoc
abstract mixin class $DashboardStatsCopyWith<$Res>  {
  factory $DashboardStatsCopyWith(DashboardStats value, $Res Function(DashboardStats) _then) = _$DashboardStatsCopyWithImpl;
@useResult
$Res call({
 int totalProjects, int totalCategories, int totalServices, int totalTestimonials, int newContacts, int pendingBookings, int pendingTestimonials, int trashCount, int pageViews30d
});




}
/// @nodoc
class _$DashboardStatsCopyWithImpl<$Res>
    implements $DashboardStatsCopyWith<$Res> {
  _$DashboardStatsCopyWithImpl(this._self, this._then);

  final DashboardStats _self;
  final $Res Function(DashboardStats) _then;

/// Create a copy of DashboardStats
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? totalProjects = null,Object? totalCategories = null,Object? totalServices = null,Object? totalTestimonials = null,Object? newContacts = null,Object? pendingBookings = null,Object? pendingTestimonials = null,Object? trashCount = null,Object? pageViews30d = null,}) {
  return _then(_self.copyWith(
totalProjects: null == totalProjects ? _self.totalProjects : totalProjects // ignore: cast_nullable_to_non_nullable
as int,totalCategories: null == totalCategories ? _self.totalCategories : totalCategories // ignore: cast_nullable_to_non_nullable
as int,totalServices: null == totalServices ? _self.totalServices : totalServices // ignore: cast_nullable_to_non_nullable
as int,totalTestimonials: null == totalTestimonials ? _self.totalTestimonials : totalTestimonials // ignore: cast_nullable_to_non_nullable
as int,newContacts: null == newContacts ? _self.newContacts : newContacts // ignore: cast_nullable_to_non_nullable
as int,pendingBookings: null == pendingBookings ? _self.pendingBookings : pendingBookings // ignore: cast_nullable_to_non_nullable
as int,pendingTestimonials: null == pendingTestimonials ? _self.pendingTestimonials : pendingTestimonials // ignore: cast_nullable_to_non_nullable
as int,trashCount: null == trashCount ? _self.trashCount : trashCount // ignore: cast_nullable_to_non_nullable
as int,pageViews30d: null == pageViews30d ? _self.pageViews30d : pageViews30d // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [DashboardStats].
extension DashboardStatsPatterns on DashboardStats {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _DashboardStats value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _DashboardStats() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _DashboardStats value)  $default,){
final _that = this;
switch (_that) {
case _DashboardStats():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _DashboardStats value)?  $default,){
final _that = this;
switch (_that) {
case _DashboardStats() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int totalProjects,  int totalCategories,  int totalServices,  int totalTestimonials,  int newContacts,  int pendingBookings,  int pendingTestimonials,  int trashCount,  int pageViews30d)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _DashboardStats() when $default != null:
return $default(_that.totalProjects,_that.totalCategories,_that.totalServices,_that.totalTestimonials,_that.newContacts,_that.pendingBookings,_that.pendingTestimonials,_that.trashCount,_that.pageViews30d);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int totalProjects,  int totalCategories,  int totalServices,  int totalTestimonials,  int newContacts,  int pendingBookings,  int pendingTestimonials,  int trashCount,  int pageViews30d)  $default,) {final _that = this;
switch (_that) {
case _DashboardStats():
return $default(_that.totalProjects,_that.totalCategories,_that.totalServices,_that.totalTestimonials,_that.newContacts,_that.pendingBookings,_that.pendingTestimonials,_that.trashCount,_that.pageViews30d);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int totalProjects,  int totalCategories,  int totalServices,  int totalTestimonials,  int newContacts,  int pendingBookings,  int pendingTestimonials,  int trashCount,  int pageViews30d)?  $default,) {final _that = this;
switch (_that) {
case _DashboardStats() when $default != null:
return $default(_that.totalProjects,_that.totalCategories,_that.totalServices,_that.totalTestimonials,_that.newContacts,_that.pendingBookings,_that.pendingTestimonials,_that.trashCount,_that.pageViews30d);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _DashboardStats implements DashboardStats {
  const _DashboardStats({this.totalProjects = 0, this.totalCategories = 0, this.totalServices = 0, this.totalTestimonials = 0, this.newContacts = 0, this.pendingBookings = 0, this.pendingTestimonials = 0, this.trashCount = 0, this.pageViews30d = 0});
  factory _DashboardStats.fromJson(Map<String, dynamic> json) => _$DashboardStatsFromJson(json);

@override@JsonKey() final  int totalProjects;
@override@JsonKey() final  int totalCategories;
@override@JsonKey() final  int totalServices;
@override@JsonKey() final  int totalTestimonials;
@override@JsonKey() final  int newContacts;
@override@JsonKey() final  int pendingBookings;
@override@JsonKey() final  int pendingTestimonials;
@override@JsonKey() final  int trashCount;
@override@JsonKey() final  int pageViews30d;

/// Create a copy of DashboardStats
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$DashboardStatsCopyWith<_DashboardStats> get copyWith => __$DashboardStatsCopyWithImpl<_DashboardStats>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$DashboardStatsToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _DashboardStats&&(identical(other.totalProjects, totalProjects) || other.totalProjects == totalProjects)&&(identical(other.totalCategories, totalCategories) || other.totalCategories == totalCategories)&&(identical(other.totalServices, totalServices) || other.totalServices == totalServices)&&(identical(other.totalTestimonials, totalTestimonials) || other.totalTestimonials == totalTestimonials)&&(identical(other.newContacts, newContacts) || other.newContacts == newContacts)&&(identical(other.pendingBookings, pendingBookings) || other.pendingBookings == pendingBookings)&&(identical(other.pendingTestimonials, pendingTestimonials) || other.pendingTestimonials == pendingTestimonials)&&(identical(other.trashCount, trashCount) || other.trashCount == trashCount)&&(identical(other.pageViews30d, pageViews30d) || other.pageViews30d == pageViews30d));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,totalProjects,totalCategories,totalServices,totalTestimonials,newContacts,pendingBookings,pendingTestimonials,trashCount,pageViews30d);

@override
String toString() {
  return 'DashboardStats(totalProjects: $totalProjects, totalCategories: $totalCategories, totalServices: $totalServices, totalTestimonials: $totalTestimonials, newContacts: $newContacts, pendingBookings: $pendingBookings, pendingTestimonials: $pendingTestimonials, trashCount: $trashCount, pageViews30d: $pageViews30d)';
}


}

/// @nodoc
abstract mixin class _$DashboardStatsCopyWith<$Res> implements $DashboardStatsCopyWith<$Res> {
  factory _$DashboardStatsCopyWith(_DashboardStats value, $Res Function(_DashboardStats) _then) = __$DashboardStatsCopyWithImpl;
@override @useResult
$Res call({
 int totalProjects, int totalCategories, int totalServices, int totalTestimonials, int newContacts, int pendingBookings, int pendingTestimonials, int trashCount, int pageViews30d
});




}
/// @nodoc
class __$DashboardStatsCopyWithImpl<$Res>
    implements _$DashboardStatsCopyWith<$Res> {
  __$DashboardStatsCopyWithImpl(this._self, this._then);

  final _DashboardStats _self;
  final $Res Function(_DashboardStats) _then;

/// Create a copy of DashboardStats
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? totalProjects = null,Object? totalCategories = null,Object? totalServices = null,Object? totalTestimonials = null,Object? newContacts = null,Object? pendingBookings = null,Object? pendingTestimonials = null,Object? trashCount = null,Object? pageViews30d = null,}) {
  return _then(_DashboardStats(
totalProjects: null == totalProjects ? _self.totalProjects : totalProjects // ignore: cast_nullable_to_non_nullable
as int,totalCategories: null == totalCategories ? _self.totalCategories : totalCategories // ignore: cast_nullable_to_non_nullable
as int,totalServices: null == totalServices ? _self.totalServices : totalServices // ignore: cast_nullable_to_non_nullable
as int,totalTestimonials: null == totalTestimonials ? _self.totalTestimonials : totalTestimonials // ignore: cast_nullable_to_non_nullable
as int,newContacts: null == newContacts ? _self.newContacts : newContacts // ignore: cast_nullable_to_non_nullable
as int,pendingBookings: null == pendingBookings ? _self.pendingBookings : pendingBookings // ignore: cast_nullable_to_non_nullable
as int,pendingTestimonials: null == pendingTestimonials ? _self.pendingTestimonials : pendingTestimonials // ignore: cast_nullable_to_non_nullable
as int,trashCount: null == trashCount ? _self.trashCount : trashCount // ignore: cast_nullable_to_non_nullable
as int,pageViews30d: null == pageViews30d ? _self.pageViews30d : pageViews30d // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}


/// @nodoc
mixin _$ChartDataPoint {

 String get label; int get count;
/// Create a copy of ChartDataPoint
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ChartDataPointCopyWith<ChartDataPoint> get copyWith => _$ChartDataPointCopyWithImpl<ChartDataPoint>(this as ChartDataPoint, _$identity);

  /// Serializes this ChartDataPoint to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ChartDataPoint&&(identical(other.label, label) || other.label == label)&&(identical(other.count, count) || other.count == count));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,label,count);

@override
String toString() {
  return 'ChartDataPoint(label: $label, count: $count)';
}


}

/// @nodoc
abstract mixin class $ChartDataPointCopyWith<$Res>  {
  factory $ChartDataPointCopyWith(ChartDataPoint value, $Res Function(ChartDataPoint) _then) = _$ChartDataPointCopyWithImpl;
@useResult
$Res call({
 String label, int count
});




}
/// @nodoc
class _$ChartDataPointCopyWithImpl<$Res>
    implements $ChartDataPointCopyWith<$Res> {
  _$ChartDataPointCopyWithImpl(this._self, this._then);

  final ChartDataPoint _self;
  final $Res Function(ChartDataPoint) _then;

/// Create a copy of ChartDataPoint
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? label = null,Object? count = null,}) {
  return _then(_self.copyWith(
label: null == label ? _self.label : label // ignore: cast_nullable_to_non_nullable
as String,count: null == count ? _self.count : count // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [ChartDataPoint].
extension ChartDataPointPatterns on ChartDataPoint {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ChartDataPoint value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ChartDataPoint() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ChartDataPoint value)  $default,){
final _that = this;
switch (_that) {
case _ChartDataPoint():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ChartDataPoint value)?  $default,){
final _that = this;
switch (_that) {
case _ChartDataPoint() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String label,  int count)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ChartDataPoint() when $default != null:
return $default(_that.label,_that.count);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String label,  int count)  $default,) {final _that = this;
switch (_that) {
case _ChartDataPoint():
return $default(_that.label,_that.count);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String label,  int count)?  $default,) {final _that = this;
switch (_that) {
case _ChartDataPoint() when $default != null:
return $default(_that.label,_that.count);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ChartDataPoint implements ChartDataPoint {
  const _ChartDataPoint({required this.label, required this.count});
  factory _ChartDataPoint.fromJson(Map<String, dynamic> json) => _$ChartDataPointFromJson(json);

@override final  String label;
@override final  int count;

/// Create a copy of ChartDataPoint
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ChartDataPointCopyWith<_ChartDataPoint> get copyWith => __$ChartDataPointCopyWithImpl<_ChartDataPoint>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ChartDataPointToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ChartDataPoint&&(identical(other.label, label) || other.label == label)&&(identical(other.count, count) || other.count == count));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,label,count);

@override
String toString() {
  return 'ChartDataPoint(label: $label, count: $count)';
}


}

/// @nodoc
abstract mixin class _$ChartDataPointCopyWith<$Res> implements $ChartDataPointCopyWith<$Res> {
  factory _$ChartDataPointCopyWith(_ChartDataPoint value, $Res Function(_ChartDataPoint) _then) = __$ChartDataPointCopyWithImpl;
@override @useResult
$Res call({
 String label, int count
});




}
/// @nodoc
class __$ChartDataPointCopyWithImpl<$Res>
    implements _$ChartDataPointCopyWith<$Res> {
  __$ChartDataPointCopyWithImpl(this._self, this._then);

  final _ChartDataPoint _self;
  final $Res Function(_ChartDataPoint) _then;

/// Create a copy of ChartDataPoint
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? label = null,Object? count = null,}) {
  return _then(_ChartDataPoint(
label: null == label ? _self.label : label // ignore: cast_nullable_to_non_nullable
as String,count: null == count ? _self.count : count // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}


/// @nodoc
mixin _$DashboardCharts {

 List<ChartDataPoint> get dailyPageViews; List<ChartDataPoint> get monthlyBookings;
/// Create a copy of DashboardCharts
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$DashboardChartsCopyWith<DashboardCharts> get copyWith => _$DashboardChartsCopyWithImpl<DashboardCharts>(this as DashboardCharts, _$identity);

  /// Serializes this DashboardCharts to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is DashboardCharts&&const DeepCollectionEquality().equals(other.dailyPageViews, dailyPageViews)&&const DeepCollectionEquality().equals(other.monthlyBookings, monthlyBookings));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,const DeepCollectionEquality().hash(dailyPageViews),const DeepCollectionEquality().hash(monthlyBookings));

@override
String toString() {
  return 'DashboardCharts(dailyPageViews: $dailyPageViews, monthlyBookings: $monthlyBookings)';
}


}

/// @nodoc
abstract mixin class $DashboardChartsCopyWith<$Res>  {
  factory $DashboardChartsCopyWith(DashboardCharts value, $Res Function(DashboardCharts) _then) = _$DashboardChartsCopyWithImpl;
@useResult
$Res call({
 List<ChartDataPoint> dailyPageViews, List<ChartDataPoint> monthlyBookings
});




}
/// @nodoc
class _$DashboardChartsCopyWithImpl<$Res>
    implements $DashboardChartsCopyWith<$Res> {
  _$DashboardChartsCopyWithImpl(this._self, this._then);

  final DashboardCharts _self;
  final $Res Function(DashboardCharts) _then;

/// Create a copy of DashboardCharts
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? dailyPageViews = null,Object? monthlyBookings = null,}) {
  return _then(_self.copyWith(
dailyPageViews: null == dailyPageViews ? _self.dailyPageViews : dailyPageViews // ignore: cast_nullable_to_non_nullable
as List<ChartDataPoint>,monthlyBookings: null == monthlyBookings ? _self.monthlyBookings : monthlyBookings // ignore: cast_nullable_to_non_nullable
as List<ChartDataPoint>,
  ));
}

}


/// Adds pattern-matching-related methods to [DashboardCharts].
extension DashboardChartsPatterns on DashboardCharts {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _DashboardCharts value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _DashboardCharts() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _DashboardCharts value)  $default,){
final _that = this;
switch (_that) {
case _DashboardCharts():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _DashboardCharts value)?  $default,){
final _that = this;
switch (_that) {
case _DashboardCharts() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<ChartDataPoint> dailyPageViews,  List<ChartDataPoint> monthlyBookings)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _DashboardCharts() when $default != null:
return $default(_that.dailyPageViews,_that.monthlyBookings);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<ChartDataPoint> dailyPageViews,  List<ChartDataPoint> monthlyBookings)  $default,) {final _that = this;
switch (_that) {
case _DashboardCharts():
return $default(_that.dailyPageViews,_that.monthlyBookings);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<ChartDataPoint> dailyPageViews,  List<ChartDataPoint> monthlyBookings)?  $default,) {final _that = this;
switch (_that) {
case _DashboardCharts() when $default != null:
return $default(_that.dailyPageViews,_that.monthlyBookings);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _DashboardCharts implements DashboardCharts {
  const _DashboardCharts({final  List<ChartDataPoint> dailyPageViews = const [], final  List<ChartDataPoint> monthlyBookings = const []}): _dailyPageViews = dailyPageViews,_monthlyBookings = monthlyBookings;
  factory _DashboardCharts.fromJson(Map<String, dynamic> json) => _$DashboardChartsFromJson(json);

 final  List<ChartDataPoint> _dailyPageViews;
@override@JsonKey() List<ChartDataPoint> get dailyPageViews {
  if (_dailyPageViews is EqualUnmodifiableListView) return _dailyPageViews;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_dailyPageViews);
}

 final  List<ChartDataPoint> _monthlyBookings;
@override@JsonKey() List<ChartDataPoint> get monthlyBookings {
  if (_monthlyBookings is EqualUnmodifiableListView) return _monthlyBookings;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_monthlyBookings);
}


/// Create a copy of DashboardCharts
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$DashboardChartsCopyWith<_DashboardCharts> get copyWith => __$DashboardChartsCopyWithImpl<_DashboardCharts>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$DashboardChartsToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _DashboardCharts&&const DeepCollectionEquality().equals(other._dailyPageViews, _dailyPageViews)&&const DeepCollectionEquality().equals(other._monthlyBookings, _monthlyBookings));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,const DeepCollectionEquality().hash(_dailyPageViews),const DeepCollectionEquality().hash(_monthlyBookings));

@override
String toString() {
  return 'DashboardCharts(dailyPageViews: $dailyPageViews, monthlyBookings: $monthlyBookings)';
}


}

/// @nodoc
abstract mixin class _$DashboardChartsCopyWith<$Res> implements $DashboardChartsCopyWith<$Res> {
  factory _$DashboardChartsCopyWith(_DashboardCharts value, $Res Function(_DashboardCharts) _then) = __$DashboardChartsCopyWithImpl;
@override @useResult
$Res call({
 List<ChartDataPoint> dailyPageViews, List<ChartDataPoint> monthlyBookings
});




}
/// @nodoc
class __$DashboardChartsCopyWithImpl<$Res>
    implements _$DashboardChartsCopyWith<$Res> {
  __$DashboardChartsCopyWithImpl(this._self, this._then);

  final _DashboardCharts _self;
  final $Res Function(_DashboardCharts) _then;

/// Create a copy of DashboardCharts
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? dailyPageViews = null,Object? monthlyBookings = null,}) {
  return _then(_DashboardCharts(
dailyPageViews: null == dailyPageViews ? _self._dailyPageViews : dailyPageViews // ignore: cast_nullable_to_non_nullable
as List<ChartDataPoint>,monthlyBookings: null == monthlyBookings ? _self._monthlyBookings : monthlyBookings // ignore: cast_nullable_to_non_nullable
as List<ChartDataPoint>,
  ));
}


}

// dart format on
