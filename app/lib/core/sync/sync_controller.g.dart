// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sync_controller.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(syncController)
final syncControllerProvider = SyncControllerProvider._();

final class SyncControllerProvider
    extends $FunctionalProvider<SyncController, SyncController, SyncController>
    with $Provider<SyncController> {
  SyncControllerProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'syncControllerProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$syncControllerHash();

  @$internal
  @override
  $ProviderElement<SyncController> $createElement($ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  SyncController create(Ref ref) {
    return syncController(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(SyncController value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<SyncController>(value),
    );
  }
}

String _$syncControllerHash() => r'ed182dbb0f47981ebcf2a64dc8f71c6ccd645793';
