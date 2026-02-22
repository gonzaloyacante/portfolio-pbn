// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'categories_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$categoriesListHash() => r'870928df3fabe9b0ed2255a8d1b5fd12ed7bd91c';

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

/// See also [categoriesList].
@ProviderFor(categoriesList)
const categoriesListProvider = CategoriesListFamily();

/// See also [categoriesList].
class CategoriesListFamily
    extends Family<AsyncValue<PaginatedResponse<CategoryItem>>> {
  /// See also [categoriesList].
  const CategoriesListFamily();

  /// See also [categoriesList].
  CategoriesListProvider call({int page = 1, String? search, bool? isActive}) {
    return CategoriesListProvider(
      page: page,
      search: search,
      isActive: isActive,
    );
  }

  @override
  CategoriesListProvider getProviderOverride(
    covariant CategoriesListProvider provider,
  ) {
    return call(
      page: provider.page,
      search: provider.search,
      isActive: provider.isActive,
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
  String? get name => r'categoriesListProvider';
}

/// See also [categoriesList].
class CategoriesListProvider
    extends AutoDisposeFutureProvider<PaginatedResponse<CategoryItem>> {
  /// See also [categoriesList].
  CategoriesListProvider({int page = 1, String? search, bool? isActive})
    : this._internal(
        (ref) => categoriesList(
          ref as CategoriesListRef,
          page: page,
          search: search,
          isActive: isActive,
        ),
        from: categoriesListProvider,
        name: r'categoriesListProvider',
        debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
            ? null
            : _$categoriesListHash,
        dependencies: CategoriesListFamily._dependencies,
        allTransitiveDependencies:
            CategoriesListFamily._allTransitiveDependencies,
        page: page,
        search: search,
        isActive: isActive,
      );

  CategoriesListProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.page,
    required this.search,
    required this.isActive,
  }) : super.internal();

  final int page;
  final String? search;
  final bool? isActive;

  @override
  Override overrideWith(
    FutureOr<PaginatedResponse<CategoryItem>> Function(
      CategoriesListRef provider,
    )
    create,
  ) {
    return ProviderOverride(
      origin: this,
      override: CategoriesListProvider._internal(
        (ref) => create(ref as CategoriesListRef),
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        page: page,
        search: search,
        isActive: isActive,
      ),
    );
  }

  @override
  AutoDisposeFutureProviderElement<PaginatedResponse<CategoryItem>>
  createElement() {
    return _CategoriesListProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is CategoriesListProvider &&
        other.page == page &&
        other.search == search &&
        other.isActive == isActive;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, page.hashCode);
    hash = _SystemHash.combine(hash, search.hashCode);
    hash = _SystemHash.combine(hash, isActive.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin CategoriesListRef
    on AutoDisposeFutureProviderRef<PaginatedResponse<CategoryItem>> {
  /// The parameter `page` of this provider.
  int get page;

  /// The parameter `search` of this provider.
  String? get search;

  /// The parameter `isActive` of this provider.
  bool? get isActive;
}

class _CategoriesListProviderElement
    extends AutoDisposeFutureProviderElement<PaginatedResponse<CategoryItem>>
    with CategoriesListRef {
  _CategoriesListProviderElement(super.provider);

  @override
  int get page => (origin as CategoriesListProvider).page;
  @override
  String? get search => (origin as CategoriesListProvider).search;
  @override
  bool? get isActive => (origin as CategoriesListProvider).isActive;
}

String _$categoryDetailHash() => r'429be3e222910125a614d7b5c5912a8c34bbcdd0';

/// See also [categoryDetail].
@ProviderFor(categoryDetail)
const categoryDetailProvider = CategoryDetailFamily();

/// See also [categoryDetail].
class CategoryDetailFamily extends Family<AsyncValue<CategoryDetail>> {
  /// See also [categoryDetail].
  const CategoryDetailFamily();

  /// See also [categoryDetail].
  CategoryDetailProvider call(String id) {
    return CategoryDetailProvider(id);
  }

  @override
  CategoryDetailProvider getProviderOverride(
    covariant CategoryDetailProvider provider,
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
  String? get name => r'categoryDetailProvider';
}

/// See also [categoryDetail].
class CategoryDetailProvider extends AutoDisposeFutureProvider<CategoryDetail> {
  /// See also [categoryDetail].
  CategoryDetailProvider(String id)
    : this._internal(
        (ref) => categoryDetail(ref as CategoryDetailRef, id),
        from: categoryDetailProvider,
        name: r'categoryDetailProvider',
        debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
            ? null
            : _$categoryDetailHash,
        dependencies: CategoryDetailFamily._dependencies,
        allTransitiveDependencies:
            CategoryDetailFamily._allTransitiveDependencies,
        id: id,
      );

  CategoryDetailProvider._internal(
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
    FutureOr<CategoryDetail> Function(CategoryDetailRef provider) create,
  ) {
    return ProviderOverride(
      origin: this,
      override: CategoryDetailProvider._internal(
        (ref) => create(ref as CategoryDetailRef),
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
  AutoDisposeFutureProviderElement<CategoryDetail> createElement() {
    return _CategoryDetailProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is CategoryDetailProvider && other.id == id;
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
mixin CategoryDetailRef on AutoDisposeFutureProviderRef<CategoryDetail> {
  /// The parameter `id` of this provider.
  String get id;
}

class _CategoryDetailProviderElement
    extends AutoDisposeFutureProviderElement<CategoryDetail>
    with CategoryDetailRef {
  _CategoryDetailProviderElement(super.provider);

  @override
  String get id => (origin as CategoryDetailProvider).id;
}

// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
