// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'testimonials_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$testimonialsRepositoryHash() =>
    r'016a3202f34acbfaf728bd69f2bd807bc02fe661';

/// See also [testimonialsRepository].
@ProviderFor(testimonialsRepository)
final testimonialsRepositoryProvider =
    AutoDisposeProvider<TestimonialsRepository>.internal(
      testimonialsRepository,
      name: r'testimonialsRepositoryProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$testimonialsRepositoryHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef TestimonialsRepositoryRef =
    AutoDisposeProviderRef<TestimonialsRepository>;
String _$testimonialsListHash() => r'dfc32a75d54ac5627113561ef12258587b8c050f';

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

/// See also [testimonialsList].
@ProviderFor(testimonialsList)
const testimonialsListProvider = TestimonialsListFamily();

/// See also [testimonialsList].
class TestimonialsListFamily
    extends Family<AsyncValue<PaginatedResponse<TestimonialItem>>> {
  /// See also [testimonialsList].
  const TestimonialsListFamily();

  /// See also [testimonialsList].
  TestimonialsListProvider call({
    int page = 1,
    String? search,
    String? status,
    bool? isFeatured,
  }) {
    return TestimonialsListProvider(
      page: page,
      search: search,
      status: status,
      isFeatured: isFeatured,
    );
  }

  @override
  TestimonialsListProvider getProviderOverride(
    covariant TestimonialsListProvider provider,
  ) {
    return call(
      page: provider.page,
      search: provider.search,
      status: provider.status,
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
  String? get name => r'testimonialsListProvider';
}

/// See also [testimonialsList].
class TestimonialsListProvider
    extends AutoDisposeFutureProvider<PaginatedResponse<TestimonialItem>> {
  /// See also [testimonialsList].
  TestimonialsListProvider({
    int page = 1,
    String? search,
    String? status,
    bool? isFeatured,
  }) : this._internal(
         (ref) => testimonialsList(
           ref as TestimonialsListRef,
           page: page,
           search: search,
           status: status,
           isFeatured: isFeatured,
         ),
         from: testimonialsListProvider,
         name: r'testimonialsListProvider',
         debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
             ? null
             : _$testimonialsListHash,
         dependencies: TestimonialsListFamily._dependencies,
         allTransitiveDependencies:
             TestimonialsListFamily._allTransitiveDependencies,
         page: page,
         search: search,
         status: status,
         isFeatured: isFeatured,
       );

  TestimonialsListProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.page,
    required this.search,
    required this.status,
    required this.isFeatured,
  }) : super.internal();

  final int page;
  final String? search;
  final String? status;
  final bool? isFeatured;

  @override
  Override overrideWith(
    FutureOr<PaginatedResponse<TestimonialItem>> Function(
      TestimonialsListRef provider,
    )
    create,
  ) {
    return ProviderOverride(
      origin: this,
      override: TestimonialsListProvider._internal(
        (ref) => create(ref as TestimonialsListRef),
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        page: page,
        search: search,
        status: status,
        isFeatured: isFeatured,
      ),
    );
  }

  @override
  AutoDisposeFutureProviderElement<PaginatedResponse<TestimonialItem>>
  createElement() {
    return _TestimonialsListProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is TestimonialsListProvider &&
        other.page == page &&
        other.search == search &&
        other.status == status &&
        other.isFeatured == isFeatured;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, page.hashCode);
    hash = _SystemHash.combine(hash, search.hashCode);
    hash = _SystemHash.combine(hash, status.hashCode);
    hash = _SystemHash.combine(hash, isFeatured.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin TestimonialsListRef
    on AutoDisposeFutureProviderRef<PaginatedResponse<TestimonialItem>> {
  /// The parameter `page` of this provider.
  int get page;

  /// The parameter `search` of this provider.
  String? get search;

  /// The parameter `status` of this provider.
  String? get status;

  /// The parameter `isFeatured` of this provider.
  bool? get isFeatured;
}

class _TestimonialsListProviderElement
    extends AutoDisposeFutureProviderElement<PaginatedResponse<TestimonialItem>>
    with TestimonialsListRef {
  _TestimonialsListProviderElement(super.provider);

  @override
  int get page => (origin as TestimonialsListProvider).page;
  @override
  String? get search => (origin as TestimonialsListProvider).search;
  @override
  String? get status => (origin as TestimonialsListProvider).status;
  @override
  bool? get isFeatured => (origin as TestimonialsListProvider).isFeatured;
}

String _$testimonialDetailHash() => r'28e06a9459a01de458f3bf8a15e630b5e73028e3';

/// See also [testimonialDetail].
@ProviderFor(testimonialDetail)
const testimonialDetailProvider = TestimonialDetailFamily();

/// See also [testimonialDetail].
class TestimonialDetailFamily extends Family<AsyncValue<TestimonialDetail>> {
  /// See also [testimonialDetail].
  const TestimonialDetailFamily();

  /// See also [testimonialDetail].
  TestimonialDetailProvider call(String id) {
    return TestimonialDetailProvider(id);
  }

  @override
  TestimonialDetailProvider getProviderOverride(
    covariant TestimonialDetailProvider provider,
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
  String? get name => r'testimonialDetailProvider';
}

/// See also [testimonialDetail].
class TestimonialDetailProvider
    extends AutoDisposeFutureProvider<TestimonialDetail> {
  /// See also [testimonialDetail].
  TestimonialDetailProvider(String id)
    : this._internal(
        (ref) => testimonialDetail(ref as TestimonialDetailRef, id),
        from: testimonialDetailProvider,
        name: r'testimonialDetailProvider',
        debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
            ? null
            : _$testimonialDetailHash,
        dependencies: TestimonialDetailFamily._dependencies,
        allTransitiveDependencies:
            TestimonialDetailFamily._allTransitiveDependencies,
        id: id,
      );

  TestimonialDetailProvider._internal(
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
    FutureOr<TestimonialDetail> Function(TestimonialDetailRef provider) create,
  ) {
    return ProviderOverride(
      origin: this,
      override: TestimonialDetailProvider._internal(
        (ref) => create(ref as TestimonialDetailRef),
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
  AutoDisposeFutureProviderElement<TestimonialDetail> createElement() {
    return _TestimonialDetailProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is TestimonialDetailProvider && other.id == id;
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
mixin TestimonialDetailRef on AutoDisposeFutureProviderRef<TestimonialDetail> {
  /// The parameter `id` of this provider.
  String get id;
}

class _TestimonialDetailProviderElement
    extends AutoDisposeFutureProviderElement<TestimonialDetail>
    with TestimonialDetailRef {
  _TestimonialDetailProviderElement(super.provider);

  @override
  String get id => (origin as TestimonialDetailProvider).id;
}

// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
