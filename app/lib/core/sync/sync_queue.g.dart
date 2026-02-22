// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sync_queue.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$syncQueueHash() => r'b9959bb666542f309bc480569d06ae1980f9d2a7';

/// Gestiona la cola de operaciones pendientes de sincronizar con el servidor.
///
/// Patrón: cuando la app está offline, las mutaciones se guardan aquí.
/// [SyncManager] lee esta cola y la procesa al recuperar la conexión.
///
/// Copied from [syncQueue].
@ProviderFor(syncQueue)
final syncQueueProvider = AutoDisposeProvider<SyncQueueRepository>.internal(
  syncQueue,
  name: r'syncQueueProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$syncQueueHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef SyncQueueRef = AutoDisposeProviderRef<SyncQueueRepository>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
