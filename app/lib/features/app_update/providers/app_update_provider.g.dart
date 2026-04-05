// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'app_update_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(AppUpdatePageNotifier)
final appUpdatePageProvider = AppUpdatePageNotifierProvider._();

final class AppUpdatePageNotifierProvider
    extends $NotifierProvider<AppUpdatePageNotifier, AppUpdateState> {
  AppUpdatePageNotifierProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'appUpdatePageProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$appUpdatePageNotifierHash();

  @$internal
  @override
  AppUpdatePageNotifier create() => AppUpdatePageNotifier();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(AppUpdateState value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<AppUpdateState>(value),
    );
  }
}

String _$appUpdatePageNotifierHash() =>
    r'6fd79968932c7c2f4e844fcc79904739272f5411';

abstract class _$AppUpdatePageNotifier extends $Notifier<AppUpdateState> {
  AppUpdateState build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<AppUpdateState, AppUpdateState>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AppUpdateState, AppUpdateState>,
              AppUpdateState,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}
