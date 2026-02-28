// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sync_queue.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// Gestiona la cola de operaciones pendientes de sincronizar con el servidor.
///
/// Patrón: cuando la app está offline, las mutaciones se guardan aquí.
/// [SyncManager] lee esta cola y la procesa al recuperar la conexión.

@ProviderFor(syncQueue)
final syncQueueProvider = SyncQueueProvider._();

/// Gestiona la cola de operaciones pendientes de sincronizar con el servidor.
///
/// Patrón: cuando la app está offline, las mutaciones se guardan aquí.
/// [SyncManager] lee esta cola y la procesa al recuperar la conexión.

final class SyncQueueProvider extends $FunctionalProvider<SyncQueueRepository, SyncQueueRepository, SyncQueueRepository>
    with $Provider<SyncQueueRepository> {
  /// Gestiona la cola de operaciones pendientes de sincronizar con el servidor.
  ///
  /// Patrón: cuando la app está offline, las mutaciones se guardan aquí.
  /// [SyncManager] lee esta cola y la procesa al recuperar la conexión.
  SyncQueueProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'syncQueueProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$syncQueueHash();

  @$internal
  @override
  $ProviderElement<SyncQueueRepository> $createElement($ProviderPointer pointer) => $ProviderElement(pointer);

  @override
  SyncQueueRepository create(Ref ref) {
    return syncQueue(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(SyncQueueRepository value) {
    return $ProviderOverride(origin: this, providerOverride: $SyncValueProvider<SyncQueueRepository>(value));
  }
}

String _$syncQueueHash() => r'b9959bb666542f309bc480569d06ae1980f9d2a7';
