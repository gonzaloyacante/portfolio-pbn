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

/// Habilita o deshabilita todas las animaciones de la app.
///
/// Cuando está en `false` se usa un [timeDilation] próximo a cero y
/// [MediaQueryData.disableAnimations] = true, lo que detiene todos los
/// cursores, transiciones y efectos shimmer.

@ProviderFor(AnimationsEnabled)
final animationsEnabledProvider = AnimationsEnabledProvider._();

/// Habilita o deshabilita todas las animaciones de la app.
///
/// Cuando está en `false` se usa un [timeDilation] próximo a cero y
/// [MediaQueryData.disableAnimations] = true, lo que detiene todos los
/// cursores, transiciones y efectos shimmer.
final class AnimationsEnabledProvider
    extends $NotifierProvider<AnimationsEnabled, bool> {
  /// Habilita o deshabilita todas las animaciones de la app.
  ///
  /// Cuando está en `false` se usa un [timeDilation] próximo a cero y
  /// [MediaQueryData.disableAnimations] = true, lo que detiene todos los
  /// cursores, transiciones y efectos shimmer.
  AnimationsEnabledProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'animationsEnabledProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$animationsEnabledHash();

  @$internal
  @override
  AnimationsEnabled create() => AnimationsEnabled();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(bool value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<bool>(value),
    );
  }
}

String _$animationsEnabledHash() => r'6591200701ce67731789fcfd50bb478a97c8c104';

/// Habilita o deshabilita todas las animaciones de la app.
///
/// Cuando está en `false` se usa un [timeDilation] próximo a cero y
/// [MediaQueryData.disableAnimations] = true, lo que detiene todos los
/// cursores, transiciones y efectos shimmer.

abstract class _$AnimationsEnabled extends $Notifier<bool> {
  bool build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<bool, bool>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<bool, bool>,
              bool,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}

/// Velocidad global de las animaciones cuando están habilitadas.
///
/// Se mapea a [timeDilation] para ralentizar o acelerar todas las
/// animaciones de Flutter sin tocar cada widget individualmente.

@ProviderFor(AnimationSpeedPref)
final animationSpeedPrefProvider = AnimationSpeedPrefProvider._();

/// Velocidad global de las animaciones cuando están habilitadas.
///
/// Se mapea a [timeDilation] para ralentizar o acelerar todas las
/// animaciones de Flutter sin tocar cada widget individualmente.
final class AnimationSpeedPrefProvider
    extends $NotifierProvider<AnimationSpeedPref, AnimationSpeed> {
  /// Velocidad global de las animaciones cuando están habilitadas.
  ///
  /// Se mapea a [timeDilation] para ralentizar o acelerar todas las
  /// animaciones de Flutter sin tocar cada widget individualmente.
  AnimationSpeedPrefProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'animationSpeedPrefProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$animationSpeedPrefHash();

  @$internal
  @override
  AnimationSpeedPref create() => AnimationSpeedPref();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(AnimationSpeed value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<AnimationSpeed>(value),
    );
  }
}

String _$animationSpeedPrefHash() =>
    r'e4e3476fc5c672999d8878745856dfbe26914a9d';

/// Velocidad global de las animaciones cuando están habilitadas.
///
/// Se mapea a [timeDilation] para ralentizar o acelerar todas las
/// animaciones de Flutter sin tocar cada widget individualmente.

abstract class _$AnimationSpeedPref extends $Notifier<AnimationSpeed> {
  AnimationSpeed build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<AnimationSpeed, AnimationSpeed>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AnimationSpeed, AnimationSpeed>,
              AnimationSpeed,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}

/// Modo compacto: reduce la densidad visual (padding, altura de tiles).
///
/// Útil en dispositivos con pantallas pequeñas o para usuarios que
/// prefieren ver más contenido sin hacer scroll.

@ProviderFor(CompactMode)
final compactModeProvider = CompactModeProvider._();

/// Modo compacto: reduce la densidad visual (padding, altura de tiles).
///
/// Útil en dispositivos con pantallas pequeñas o para usuarios que
/// prefieren ver más contenido sin hacer scroll.
final class CompactModeProvider extends $NotifierProvider<CompactMode, bool> {
  /// Modo compacto: reduce la densidad visual (padding, altura de tiles).
  ///
  /// Útil en dispositivos con pantallas pequeñas o para usuarios que
  /// prefieren ver más contenido sin hacer scroll.
  CompactModeProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'compactModeProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$compactModeHash();

  @$internal
  @override
  CompactMode create() => CompactMode();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(bool value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<bool>(value),
    );
  }
}

String _$compactModeHash() => r'2fad3085471ad9f6de59071a787bf7f5f674a839';

/// Modo compacto: reduce la densidad visual (padding, altura de tiles).
///
/// Útil en dispositivos con pantallas pequeñas o para usuarios que
/// prefieren ver más contenido sin hacer scroll.

abstract class _$CompactMode extends $Notifier<bool> {
  bool build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<bool, bool>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<bool, bool>,
              bool,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}
