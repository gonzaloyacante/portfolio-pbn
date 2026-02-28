// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sync_manager.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// Procesa la cola de operaciones pendientes cuando hay conectividad.
///
/// Se activa automáticamente al recuperar la conexión a internet.
/// Procesa las operaciones en orden FIFO con reintento.

@ProviderFor(SyncManager)
final syncManagerProvider = SyncManagerProvider._();

/// Procesa la cola de operaciones pendientes cuando hay conectividad.
///
/// Se activa automáticamente al recuperar la conexión a internet.
/// Procesa las operaciones en orden FIFO con reintento.
final class SyncManagerProvider extends $NotifierProvider<SyncManager, SyncStatus> {
  /// Procesa la cola de operaciones pendientes cuando hay conectividad.
  ///
  /// Se activa automáticamente al recuperar la conexión a internet.
  /// Procesa las operaciones en orden FIFO con reintento.
  SyncManagerProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'syncManagerProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$syncManagerHash();

  @$internal
  @override
  SyncManager create() => SyncManager();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(SyncStatus value) {
    return $ProviderOverride(origin: this, providerOverride: $SyncValueProvider<SyncStatus>(value));
  }
}

String _$syncManagerHash() => r'09bafdd21baf3a766c4d3d44e4b5aaab30375899';

/// Procesa la cola de operaciones pendientes cuando hay conectividad.
///
/// Se activa automáticamente al recuperar la conexión a internet.
/// Procesa las operaciones en orden FIFO con reintento.

abstract class _$SyncManager extends $Notifier<SyncStatus> {
  SyncStatus build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<SyncStatus, SyncStatus>;
    final element =
        ref.element as $ClassProviderElement<AnyNotifier<SyncStatus, SyncStatus>, SyncStatus, Object?, Object?>;
    element.handleCreate(ref, build);
  }
}

/// Estado actual del proceso de sincronización.

@ProviderFor(syncStatus)
final syncStatusProvider = SyncStatusProvider._();

/// Estado actual del proceso de sincronización.

final class SyncStatusProvider extends $FunctionalProvider<SyncStatus, SyncStatus, SyncStatus>
    with $Provider<SyncStatus> {
  /// Estado actual del proceso de sincronización.
  SyncStatusProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'syncStatusProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$syncStatusHash();

  @$internal
  @override
  $ProviderElement<SyncStatus> $createElement($ProviderPointer pointer) => $ProviderElement(pointer);

  @override
  SyncStatus create(Ref ref) {
    return syncStatus(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(SyncStatus value) {
    return $ProviderOverride(origin: this, providerOverride: $SyncValueProvider<SyncStatus>(value));
  }
}

String _$syncStatusHash() => r'036326cca393b9f2d1857c96284d6886b6af3e67';
