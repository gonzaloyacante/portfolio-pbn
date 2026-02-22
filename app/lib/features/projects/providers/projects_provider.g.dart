// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'projects_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$projectsListHash() => r'ccb415e6c4a5f682f7ae278a16bbab0d31840585';

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

/// Lista paginada de proyectos con parámetros de filtro.
///
/// Copied from [projectsList].
@ProviderFor(projectsList)
const projectsListProvider = ProjectsListFamily();

/// Lista paginada de proyectos con parámetros de filtro.
///
/// Copied from [projectsList].
class ProjectsListFamily
    extends Family<AsyncValue<PaginatedResponse<ProjectListItem>>> {
  /// Lista paginada de proyectos con parámetros de filtro.
  ///
  /// Copied from [projectsList].
  const ProjectsListFamily();

  /// Lista paginada de proyectos con parámetros de filtro.
  ///
  /// Copied from [projectsList].
  ProjectsListProvider call({
    int page = 1,
    String? search,
    String? categoryId,
  }) {
    return ProjectsListProvider(
      page: page,
      search: search,
      categoryId: categoryId,
    );
  }

  @override
  ProjectsListProvider getProviderOverride(
    covariant ProjectsListProvider provider,
  ) {
    return call(
      page: provider.page,
      search: provider.search,
      categoryId: provider.categoryId,
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
  String? get name => r'projectsListProvider';
}

/// Lista paginada de proyectos con parámetros de filtro.
///
/// Copied from [projectsList].
class ProjectsListProvider
    extends AutoDisposeFutureProvider<PaginatedResponse<ProjectListItem>> {
  /// Lista paginada de proyectos con parámetros de filtro.
  ///
  /// Copied from [projectsList].
  ProjectsListProvider({int page = 1, String? search, String? categoryId})
    : this._internal(
        (ref) => projectsList(
          ref as ProjectsListRef,
          page: page,
          search: search,
          categoryId: categoryId,
        ),
        from: projectsListProvider,
        name: r'projectsListProvider',
        debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
            ? null
            : _$projectsListHash,
        dependencies: ProjectsListFamily._dependencies,
        allTransitiveDependencies:
            ProjectsListFamily._allTransitiveDependencies,
        page: page,
        search: search,
        categoryId: categoryId,
      );

  ProjectsListProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.page,
    required this.search,
    required this.categoryId,
  }) : super.internal();

  final int page;
  final String? search;
  final String? categoryId;

  @override
  Override overrideWith(
    FutureOr<PaginatedResponse<ProjectListItem>> Function(
      ProjectsListRef provider,
    )
    create,
  ) {
    return ProviderOverride(
      origin: this,
      override: ProjectsListProvider._internal(
        (ref) => create(ref as ProjectsListRef),
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        page: page,
        search: search,
        categoryId: categoryId,
      ),
    );
  }

  @override
  AutoDisposeFutureProviderElement<PaginatedResponse<ProjectListItem>>
  createElement() {
    return _ProjectsListProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is ProjectsListProvider &&
        other.page == page &&
        other.search == search &&
        other.categoryId == categoryId;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, page.hashCode);
    hash = _SystemHash.combine(hash, search.hashCode);
    hash = _SystemHash.combine(hash, categoryId.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin ProjectsListRef
    on AutoDisposeFutureProviderRef<PaginatedResponse<ProjectListItem>> {
  /// The parameter `page` of this provider.
  int get page;

  /// The parameter `search` of this provider.
  String? get search;

  /// The parameter `categoryId` of this provider.
  String? get categoryId;
}

class _ProjectsListProviderElement
    extends AutoDisposeFutureProviderElement<PaginatedResponse<ProjectListItem>>
    with ProjectsListRef {
  _ProjectsListProviderElement(super.provider);

  @override
  int get page => (origin as ProjectsListProvider).page;
  @override
  String? get search => (origin as ProjectsListProvider).search;
  @override
  String? get categoryId => (origin as ProjectsListProvider).categoryId;
}

String _$projectDetailHash() => r'0f04fbc526c36e4c939ecf4e1f6cb45b7e0de7d1';

/// Detalle completo de un proyecto.
///
/// Copied from [projectDetail].
@ProviderFor(projectDetail)
const projectDetailProvider = ProjectDetailFamily();

/// Detalle completo de un proyecto.
///
/// Copied from [projectDetail].
class ProjectDetailFamily extends Family<AsyncValue<ProjectDetail>> {
  /// Detalle completo de un proyecto.
  ///
  /// Copied from [projectDetail].
  const ProjectDetailFamily();

  /// Detalle completo de un proyecto.
  ///
  /// Copied from [projectDetail].
  ProjectDetailProvider call(String id) {
    return ProjectDetailProvider(id);
  }

  @override
  ProjectDetailProvider getProviderOverride(
    covariant ProjectDetailProvider provider,
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
  String? get name => r'projectDetailProvider';
}

/// Detalle completo de un proyecto.
///
/// Copied from [projectDetail].
class ProjectDetailProvider extends AutoDisposeFutureProvider<ProjectDetail> {
  /// Detalle completo de un proyecto.
  ///
  /// Copied from [projectDetail].
  ProjectDetailProvider(String id)
    : this._internal(
        (ref) => projectDetail(ref as ProjectDetailRef, id),
        from: projectDetailProvider,
        name: r'projectDetailProvider',
        debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
            ? null
            : _$projectDetailHash,
        dependencies: ProjectDetailFamily._dependencies,
        allTransitiveDependencies:
            ProjectDetailFamily._allTransitiveDependencies,
        id: id,
      );

  ProjectDetailProvider._internal(
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
    FutureOr<ProjectDetail> Function(ProjectDetailRef provider) create,
  ) {
    return ProviderOverride(
      origin: this,
      override: ProjectDetailProvider._internal(
        (ref) => create(ref as ProjectDetailRef),
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
  AutoDisposeFutureProviderElement<ProjectDetail> createElement() {
    return _ProjectDetailProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is ProjectDetailProvider && other.id == id;
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
mixin ProjectDetailRef on AutoDisposeFutureProviderRef<ProjectDetail> {
  /// The parameter `id` of this provider.
  String get id;
}

class _ProjectDetailProviderElement
    extends AutoDisposeFutureProviderElement<ProjectDetail>
    with ProjectDetailRef {
  _ProjectDetailProviderElement(super.provider);

  @override
  String get id => (origin as ProjectDetailProvider).id;
}

// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
