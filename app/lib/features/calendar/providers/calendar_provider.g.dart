// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'calendar_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$bookingsRepositoryHash() =>
    r'99621fd214e4b8e635d313fc215878dd2048390a';

/// See also [bookingsRepository].
@ProviderFor(bookingsRepository)
final bookingsRepositoryProvider =
    AutoDisposeProvider<BookingsRepository>.internal(
      bookingsRepository,
      name: r'bookingsRepositoryProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$bookingsRepositoryHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef BookingsRepositoryRef = AutoDisposeProviderRef<BookingsRepository>;
String _$bookingsListHash() => r'987b8aeda9c525e0ccd09039f7510a372a3adcd3';

/// Copied from Dart SDK
class _SystemHash {
  _SystemHash._();

  static int combine(int hash, int value) {
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + value);
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + ((0x0007ffff & hash) << 10));
    return hash ^ (hash >> 6);
  }

  static int finish(int hash) {
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + ((0x03ffffff & hash) << 3));
    // ignore: parameter_assignments
    hash = hash ^ (hash >> 11);
    return 0x1fffffff & (hash + ((0x00003fff & hash) << 15));
  }
}

/// See also [bookingsList].
@ProviderFor(bookingsList)
const bookingsListProvider = BookingsListFamily();

/// See also [bookingsList].
class BookingsListFamily
    extends Family<AsyncValue<PaginatedResponse<BookingItem>>> {
  /// See also [bookingsList].
  const BookingsListFamily();

  /// See also [bookingsList].
  BookingsListProvider call({
    int page = 1,
    String? search,
    String? status,
    DateTime? dateFrom,
    DateTime? dateTo,
  }) {
    return BookingsListProvider(
      page: page,
      search: search,
      status: status,
      dateFrom: dateFrom,
      dateTo: dateTo,
    );
  }

  @override
  BookingsListProvider getProviderOverride(
    covariant BookingsListProvider provider,
  ) {
    return call(
      page: provider.page,
      search: provider.search,
      status: provider.status,
      dateFrom: provider.dateFrom,
      dateTo: provider.dateTo,
    );
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  static const Iterable<ProviderOrFamily>? _allTransitiveDependencies = null;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies =>
      _allTransitiveDependencies;

  @override
  String? get name => r'bookingsListProvider';
}

/// See also [bookingsList].
class BookingsListProvider
    extends AutoDisposeFutureProvider<PaginatedResponse<BookingItem>> {
  /// See also [bookingsList].
  BookingsListProvider({
    int page = 1,
    String? search,
    String? status,
    DateTime? dateFrom,
    DateTime? dateTo,
  }) : this._internal(
         (ref) => bookingsList(
           ref as BookingsListRef,
           page: page,
           search: search,
           status: status,
           dateFrom: dateFrom,
           dateTo: dateTo,
         ),
         from: bookingsListProvider,
         name: r'bookingsListProvider',
         debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
             ? null
             : _$bookingsListHash,
         dependencies: BookingsListFamily._dependencies,
         allTransitiveDependencies:
             BookingsListFamily._allTransitiveDependencies,
         page: page,
         search: search,
         status: status,
         dateFrom: dateFrom,
         dateTo: dateTo,
       );

  BookingsListProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.page,
    required this.search,
    required this.status,
    required this.dateFrom,
    required this.dateTo,
  }) : super.internal();

  final int page;
  final String? search;
  final String? status;
  final DateTime? dateFrom;
  final DateTime? dateTo;

  @override
  Override overrideWith(
    FutureOr<PaginatedResponse<BookingItem>> Function(BookingsListRef provider)
    create,
  ) {
    return ProviderOverride(
      origin: this,
      override: BookingsListProvider._internal(
        (ref) => create(ref as BookingsListRef),
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        page: page,
        search: search,
        status: status,
        dateFrom: dateFrom,
        dateTo: dateTo,
      ),
    );
  }

  @override
  AutoDisposeFutureProviderElement<PaginatedResponse<BookingItem>>
  createElement() {
    return _BookingsListProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is BookingsListProvider &&
        other.page == page &&
        other.search == search &&
        other.status == status &&
        other.dateFrom == dateFrom &&
        other.dateTo == dateTo;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, page.hashCode);
    hash = _SystemHash.combine(hash, search.hashCode);
    hash = _SystemHash.combine(hash, status.hashCode);
    hash = _SystemHash.combine(hash, dateFrom.hashCode);
    hash = _SystemHash.combine(hash, dateTo.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin BookingsListRef
    on AutoDisposeFutureProviderRef<PaginatedResponse<BookingItem>> {
  /// The parameter `page` of this provider.
  int get page;

  /// The parameter `search` of this provider.
  String? get search;

  /// The parameter `status` of this provider.
  String? get status;

  /// The parameter `dateFrom` of this provider.
  DateTime? get dateFrom;

  /// The parameter `dateTo` of this provider.
  DateTime? get dateTo;
}

class _BookingsListProviderElement
    extends AutoDisposeFutureProviderElement<PaginatedResponse<BookingItem>>
    with BookingsListRef {
  _BookingsListProviderElement(super.provider);

  @override
  int get page => (origin as BookingsListProvider).page;
  @override
  String? get search => (origin as BookingsListProvider).search;
  @override
  String? get status => (origin as BookingsListProvider).status;
  @override
  DateTime? get dateFrom => (origin as BookingsListProvider).dateFrom;
  @override
  DateTime? get dateTo => (origin as BookingsListProvider).dateTo;
}

String _$bookingDetailHash() => r'7aa60430a7ad1d870bb57b587a67d97a820d914c';

/// See also [bookingDetail].
@ProviderFor(bookingDetail)
const bookingDetailProvider = BookingDetailFamily();

/// See also [bookingDetail].
class BookingDetailFamily extends Family<AsyncValue<BookingDetail>> {
  /// See also [bookingDetail].
  const BookingDetailFamily();

  /// See also [bookingDetail].
  BookingDetailProvider call(String id) {
    return BookingDetailProvider(id);
  }

  @override
  BookingDetailProvider getProviderOverride(
    covariant BookingDetailProvider provider,
  ) {
    return call(provider.id);
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  static const Iterable<ProviderOrFamily>? _allTransitiveDependencies = null;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies =>
      _allTransitiveDependencies;

  @override
  String? get name => r'bookingDetailProvider';
}

/// See also [bookingDetail].
class BookingDetailProvider extends AutoDisposeFutureProvider<BookingDetail> {
  /// See also [bookingDetail].
  BookingDetailProvider(String id)
    : this._internal(
        (ref) => bookingDetail(ref as BookingDetailRef, id),
        from: bookingDetailProvider,
        name: r'bookingDetailProvider',
        debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
            ? null
            : _$bookingDetailHash,
        dependencies: BookingDetailFamily._dependencies,
        allTransitiveDependencies:
            BookingDetailFamily._allTransitiveDependencies,
        id: id,
      );

  BookingDetailProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.id,
  }) : super.internal();

  final String id;

  @override
  Override overrideWith(
    FutureOr<BookingDetail> Function(BookingDetailRef provider) create,
  ) {
    return ProviderOverride(
      origin: this,
      override: BookingDetailProvider._internal(
        (ref) => create(ref as BookingDetailRef),
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        id: id,
      ),
    );
  }

  @override
  AutoDisposeFutureProviderElement<BookingDetail> createElement() {
    return _BookingDetailProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is BookingDetailProvider && other.id == id;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, id.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin BookingDetailRef on AutoDisposeFutureProviderRef<BookingDetail> {
  /// The parameter `id` of this provider.
  String get id;
}

class _BookingDetailProviderElement
    extends AutoDisposeFutureProviderElement<BookingDetail>
    with BookingDetailRef {
  _BookingDetailProviderElement(super.provider);

  @override
  String get id => (origin as BookingDetailProvider).id;
}

// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
