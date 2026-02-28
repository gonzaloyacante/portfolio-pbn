// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'projects_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// Lista paginada de proyectos con parámetros de filtro.

@ProviderFor(projectsList)
final projectsListProvider = ProjectsListFamily._();

/// Lista paginada de proyectos con parámetros de filtro.

final class ProjectsListProvider
    extends
        $FunctionalProvider<
          AsyncValue<PaginatedResponse<ProjectListItem>>,
          PaginatedResponse<ProjectListItem>,
          FutureOr<PaginatedResponse<ProjectListItem>>
        >
    with $FutureModifier<PaginatedResponse<ProjectListItem>>, $FutureProvider<PaginatedResponse<ProjectListItem>> {
  /// Lista paginada de proyectos con parámetros de filtro.
  ProjectsListProvider._({
    required ProjectsListFamily super.from,
    required ({int page, String? search, String? categoryId}) super.argument,
  }) : super(
         retry: null,
         name: r'projectsListProvider',
         isAutoDispose: true,
         dependencies: null,
         $allTransitiveDependencies: null,
       );

  @override
  String debugGetCreateSourceHash() => _$projectsListHash();

  @override
  String toString() {
    return r'projectsListProvider'
        ''
        '$argument';
  }

  @$internal
  @override
  $FutureProviderElement<PaginatedResponse<ProjectListItem>> $createElement($ProviderPointer pointer) =>
      $FutureProviderElement(pointer);

  @override
  FutureOr<PaginatedResponse<ProjectListItem>> create(Ref ref) {
    final argument = this.argument as ({int page, String? search, String? categoryId});
    return projectsList(ref, page: argument.page, search: argument.search, categoryId: argument.categoryId);
  }

  @override
  bool operator ==(Object other) {
    return other is ProjectsListProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$projectsListHash() => r'ccb415e6c4a5f682f7ae278a16bbab0d31840585';

/// Lista paginada de proyectos con parámetros de filtro.

final class ProjectsListFamily extends $Family
    with
        $FunctionalFamilyOverride<
          FutureOr<PaginatedResponse<ProjectListItem>>,
          ({int page, String? search, String? categoryId})
        > {
  ProjectsListFamily._()
    : super(
        retry: null,
        name: r'projectsListProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  /// Lista paginada de proyectos con parámetros de filtro.

  ProjectsListProvider call({int page = 1, String? search, String? categoryId}) =>
      ProjectsListProvider._(argument: (page: page, search: search, categoryId: categoryId), from: this);

  @override
  String toString() => r'projectsListProvider';
}

/// Detalle completo de un proyecto.

@ProviderFor(projectDetail)
final projectDetailProvider = ProjectDetailFamily._();

/// Detalle completo de un proyecto.

final class ProjectDetailProvider
    extends $FunctionalProvider<AsyncValue<ProjectDetail>, ProjectDetail, FutureOr<ProjectDetail>>
    with $FutureModifier<ProjectDetail>, $FutureProvider<ProjectDetail> {
  /// Detalle completo de un proyecto.
  ProjectDetailProvider._({required ProjectDetailFamily super.from, required String super.argument})
    : super(
        retry: null,
        name: r'projectDetailProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$projectDetailHash();

  @override
  String toString() {
    return r'projectDetailProvider'
        ''
        '($argument)';
  }

  @$internal
  @override
  $FutureProviderElement<ProjectDetail> $createElement($ProviderPointer pointer) => $FutureProviderElement(pointer);

  @override
  FutureOr<ProjectDetail> create(Ref ref) {
    final argument = this.argument as String;
    return projectDetail(ref, argument);
  }

  @override
  bool operator ==(Object other) {
    return other is ProjectDetailProvider && other.argument == argument;
  }

  @override
  int get hashCode {
    return argument.hashCode;
  }
}

String _$projectDetailHash() => r'0f04fbc526c36e4c939ecf4e1f6cb45b7e0de7d1';

/// Detalle completo de un proyecto.

final class ProjectDetailFamily extends $Family with $FunctionalFamilyOverride<FutureOr<ProjectDetail>, String> {
  ProjectDetailFamily._()
    : super(
        retry: null,
        name: r'projectDetailProvider',
        dependencies: null,
        $allTransitiveDependencies: null,
        isAutoDispose: true,
      );

  /// Detalle completo de un proyecto.

  ProjectDetailProvider call(String id) => ProjectDetailProvider._(argument: id, from: this);

  @override
  String toString() => r'projectDetailProvider';
}
