// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'performance_prefs_pod.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(AnimationsEnabled)
final animationsEnabledProvider = AnimationsEnabledProvider._();

final class AnimationsEnabledProvider
    extends $NotifierProvider<AnimationsEnabled, bool> {
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

String _$animationsEnabledHash() => r'f6b9745b3cc611e5f296ccf836dcc97293006c7a';

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

@ProviderFor(AnimationSpeedPref)
final animationSpeedPrefProvider = AnimationSpeedPrefProvider._();

final class AnimationSpeedPrefProvider
    extends $NotifierProvider<AnimationSpeedPref, AnimationSpeed> {
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
    r'8c02f6b0ffa57ca7746e4b72fbc02071589f7d94';

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

@ProviderFor(CompactMode)
final compactModeProvider = CompactModeProvider._();

final class CompactModeProvider extends $NotifierProvider<CompactMode, bool> {
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

String _$compactModeHash() => r'8bb99839f407528cc72bad9a158609732a6d7dc2';

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
