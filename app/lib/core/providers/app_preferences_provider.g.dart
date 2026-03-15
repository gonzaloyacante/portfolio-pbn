// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'app_preferences_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(sharedPreferences)
final sharedPreferencesProvider = SharedPreferencesProvider._();

final class SharedPreferencesProvider
    extends
        $FunctionalProvider<
          AsyncValue<SharedPreferences>,
          SharedPreferences,
          FutureOr<SharedPreferences>
        >
    with
        $FutureModifier<SharedPreferences>,
        $FutureProvider<SharedPreferences> {
  SharedPreferencesProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'sharedPreferencesProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$sharedPreferencesHash();

  @$internal
  @override
  $FutureProviderElement<SharedPreferences> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<SharedPreferences> create(Ref ref) {
    return sharedPreferences(ref);
  }
}

String _$sharedPreferencesHash() => r'ad13470fe866595ad0f58a3e26f11048d94ef22e';

/// Vista seleccionada para la lista de proyectos (grid o list).

@ProviderFor(ProjectsViewMode)
final projectsViewModeProvider = ProjectsViewModeProvider._();

/// Vista seleccionada para la lista de proyectos (grid o list).
final class ProjectsViewModeProvider
    extends $NotifierProvider<ProjectsViewMode, ViewMode> {
  /// Vista seleccionada para la lista de proyectos (grid o list).
  ProjectsViewModeProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'projectsViewModeProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$projectsViewModeHash();

  @$internal
  @override
  ProjectsViewMode create() => ProjectsViewMode();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(ViewMode value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<ViewMode>(value),
    );
  }
}

String _$projectsViewModeHash() => r'131d9bbb41d33df080f3be5fab711b2e5add1bae';

/// Vista seleccionada para la lista de proyectos (grid o list).

abstract class _$ProjectsViewMode extends $Notifier<ViewMode> {
  ViewMode build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<ViewMode, ViewMode>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<ViewMode, ViewMode>,
              ViewMode,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}

/// Vista seleccionada para la lista de servicios (grid o list).

@ProviderFor(ServicesViewMode)
final servicesViewModeProvider = ServicesViewModeProvider._();

/// Vista seleccionada para la lista de servicios (grid o list).
final class ServicesViewModeProvider
    extends $NotifierProvider<ServicesViewMode, ViewMode> {
  /// Vista seleccionada para la lista de servicios (grid o list).
  ServicesViewModeProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'servicesViewModeProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$servicesViewModeHash();

  @$internal
  @override
  ServicesViewMode create() => ServicesViewMode();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(ViewMode value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<ViewMode>(value),
    );
  }
}

String _$servicesViewModeHash() => r'665ed8f1974e0c6b91ed62183b8e5bbbe4103650';

/// Vista seleccionada para la lista de servicios (grid o list).

abstract class _$ServicesViewMode extends $Notifier<ViewMode> {
  ViewMode build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<ViewMode, ViewMode>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<ViewMode, ViewMode>,
              ViewMode,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}

/// Vista seleccionada para la lista de categorías (grid o list).

@ProviderFor(CategoriesViewMode)
final categoriesViewModeProvider = CategoriesViewModeProvider._();

/// Vista seleccionada para la lista de categorías (grid o list).
final class CategoriesViewModeProvider
    extends $NotifierProvider<CategoriesViewMode, ViewMode> {
  /// Vista seleccionada para la lista de categorías (grid o list).
  CategoriesViewModeProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'categoriesViewModeProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$categoriesViewModeHash();

  @$internal
  @override
  CategoriesViewMode create() => CategoriesViewMode();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(ViewMode value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<ViewMode>(value),
    );
  }
}

String _$categoriesViewModeHash() =>
    r'2057b59614916296b847bcf60e682fc8238ac2d5';

/// Vista seleccionada para la lista de categorías (grid o list).

abstract class _$CategoriesViewMode extends $Notifier<ViewMode> {
  ViewMode build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<ViewMode, ViewMode>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<ViewMode, ViewMode>,
              ViewMode,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}

/// Vista seleccionada para la galería de proyectos de una categoría (grid o list).

@ProviderFor(CategoryGalleryViewMode)
final categoryGalleryViewModeProvider = CategoryGalleryViewModeProvider._();

/// Vista seleccionada para la galería de proyectos de una categoría (grid o list).
final class CategoryGalleryViewModeProvider
    extends $NotifierProvider<CategoryGalleryViewMode, ViewMode> {
  /// Vista seleccionada para la galería de proyectos de una categoría (grid o list).
  CategoryGalleryViewModeProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'categoryGalleryViewModeProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$categoryGalleryViewModeHash();

  @$internal
  @override
  CategoryGalleryViewMode create() => CategoryGalleryViewMode();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(ViewMode value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<ViewMode>(value),
    );
  }
}

String _$categoryGalleryViewModeHash() =>
    r'dadc16b272fc42df2efdc36b64e9a7dc457ab4e4';

/// Vista seleccionada para la galería de proyectos de una categoría (grid o list).

abstract class _$CategoryGalleryViewMode extends $Notifier<ViewMode> {
  ViewMode build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<ViewMode, ViewMode>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<ViewMode, ViewMode>,
              ViewMode,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}

/// Vista seleccionada para la lista de testimonios (grid o list).

@ProviderFor(TestimonialsViewMode)
final testimonialsViewModeProvider = TestimonialsViewModeProvider._();

/// Vista seleccionada para la lista de testimonios (grid o list).
final class TestimonialsViewModeProvider
    extends $NotifierProvider<TestimonialsViewMode, ViewMode> {
  /// Vista seleccionada para la lista de testimonios (grid o list).
  TestimonialsViewModeProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'testimonialsViewModeProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$testimonialsViewModeHash();

  @$internal
  @override
  TestimonialsViewMode create() => TestimonialsViewMode();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(ViewMode value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<ViewMode>(value),
    );
  }
}

String _$testimonialsViewModeHash() =>
    r'98202ae2bfa45e03ef507e73153cd3bfb6c214a6';

/// Vista seleccionada para la lista de testimonios (grid o list).

abstract class _$TestimonialsViewMode extends $Notifier<ViewMode> {
  ViewMode build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<ViewMode, ViewMode>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<ViewMode, ViewMode>,
              ViewMode,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}
