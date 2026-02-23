// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'services_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$servicesListHash() => r'2b4e00b4dde5960e6397cef5e8f2b5082f04fd02';

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

/// See also [servicesList].
@ProviderFor(servicesList)
const servicesListProvider = ServicesListFamily();

/// See also [servicesList].
class ServicesListFamily
    extends Family<AsyncValue<PaginatedResponse<ServiceItem>>> {
  /// See also [servicesList].
  const ServicesListFamily();

  /// See also [servicesList].
  ServicesListProvider call({
    int page = 1,
    String? search,
    bool? isActive,
    bool? isFeatured,
  }) {
    return ServicesListProvider(
      page: page,
      search: search,
      isActive: isActive,
      isFeatured: isFeatured,
    );
  }

  @override
  ServicesListProvider getProviderOverride(
    covariant ServicesListProvider provider,
  ) {
    return call(
      page: provider.page,
      search: provider.search,
      isActive: provider.isActive,
      isFeatured: provider.isFeatured,
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
  String? get name => r'servicesListProvider';
}

/// See also [servicesList].
class ServicesListProvider
    extends AutoDisposeFutureProvider<PaginatedResponse<ServiceItem>> {
  /// See also [servicesList].
  ServicesListProvider({
    int page = 1,
    String? search,
    bool? isActive,
    bool? isFeatured,
  }) : this._internal(
         (ref) => servicesList(
           ref as ServicesListRef,
           page: page,
           search: search,
           isActive: isActive,
           isFeatured: isFeatured,
         ),
         from: servicesListProvider,
         name: r'servicesListProvider',
         debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
             ? null
             : _$servicesListHash,
         dependencies: ServicesListFamily._dependencies,
         allTransitiveDependencies:
             ServicesListFamily._allTransitiveDependencies,
         page: page,
         search: search,
         isActive: isActive,
         isFeatured: isFeatured,
       );

  ServicesListProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.page,
    required this.search,
    required this.isActive,
    required this.isFeatured,
  }) : super.internal();

  final int page;
  final String? search;
  final bool? isActive;
  final bool? isFeatured;

  @override
  Override overrideWith(
    FutureOr<PaginatedResponse<ServiceItem>> Function(ServicesListRef provider)
    create,
  ) {
    return ProviderOverride(
      origin: this,
      override: ServicesListProvider._internal(
        (ref) => create(ref as ServicesListRef),
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        page: page,
        search: search,
        isActive: isActive,
        isFeatured: isFeatured,
      ),
    );
  }

  @override
  AutoDisposeFutureProviderElement<PaginatedResponse<ServiceItem>>
  createElement() {
    return _ServicesListProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is ServicesListProvider &&
        other.page == page &&
        other.search == search &&
        other.isActive == isActive &&
        other.isFeatured == isFeatured;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, page.hashCode);
    hash = _SystemHash.combine(hash, search.hashCode);
    hash = _SystemHash.combine(hash, isActive.hashCode);
    hash = _SystemHash.combine(hash, isFeatured.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin ServicesListRef
    on AutoDisposeFutureProviderRef<PaginatedResponse<ServiceItem>> {
  /// The parameter `page` of this provider.
  int get page;

  /// The parameter `search` of this provider.
  String? get search;

  /// The parameter `isActive` of this provider.
  bool? get isActive;

  /// The parameter `isFeatured` of this provider.
  bool? get isFeatured;
}

class _ServicesListProviderElement
    extends AutoDisposeFutureProviderElement<PaginatedResponse<ServiceItem>>
    with ServicesListRef {
  _ServicesListProviderElement(super.provider);

  @override
  int get page => (origin as ServicesListProvider).page;
  @override
  String? get search => (origin as ServicesListProvider).search;
  @override
  bool? get isActive => (origin as ServicesListProvider).isActive;
  @override
  bool? get isFeatured => (origin as ServicesListProvider).isFeatured;
}

String _$serviceDetailHash() => r'a03140d01f272a761fa0ea8736435948504f3180';

/// See also [serviceDetail].
@ProviderFor(serviceDetail)
const serviceDetailProvider = ServiceDetailFamily();

/// See also [serviceDetail].
class ServiceDetailFamily extends Family<AsyncValue<ServiceDetail>> {
  /// See also [serviceDetail].
  const ServiceDetailFamily();

  /// See also [serviceDetail].
  ServiceDetailProvider call(String id) {
    return ServiceDetailProvider(id);
  }

  @override
  ServiceDetailProvider getProviderOverride(
    covariant ServiceDetailProvider provider,
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
  String? get name => r'serviceDetailProvider';
}

/// See also [serviceDetail].
class ServiceDetailProvider extends AutoDisposeFutureProvider<ServiceDetail> {
  /// See also [serviceDetail].
  ServiceDetailProvider(String id)
    : this._internal(
        (ref) => serviceDetail(ref as ServiceDetailRef, id),
        from: serviceDetailProvider,
        name: r'serviceDetailProvider',
        debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
            ? null
            : _$serviceDetailHash,
        dependencies: ServiceDetailFamily._dependencies,
        allTransitiveDependencies:
            ServiceDetailFamily._allTransitiveDependencies,
        id: id,
      );

  ServiceDetailProvider._internal(
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
    FutureOr<ServiceDetail> Function(ServiceDetailRef provider) create,
  ) {
    return ProviderOverride(
      origin: this,
      override: ServiceDetailProvider._internal(
        (ref) => create(ref as ServiceDetailRef),
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
  AutoDisposeFutureProviderElement<ServiceDetail> createElement() {
    return _ServiceDetailProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is ServiceDetailProvider && other.id == id;
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
mixin ServiceDetailRef on AutoDisposeFutureProviderRef<ServiceDetail> {
  /// The parameter `id` of this provider.
  String get id;
}

class _ServiceDetailProviderElement
    extends AutoDisposeFutureProviderElement<ServiceDetail>
    with ServiceDetailRef {
  _ServiceDetailProviderElement(super.provider);

  @override
  String get id => (origin as ServiceDetailProvider).id;
}

// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
