// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sync_manager.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$syncStatusHash() => r'036326cca393b9f2d1857c96284d6886b6af3e67';

/// Estado actual del proceso de sincronización.
///
/// Copied from [syncStatus].
@ProviderFor(syncStatus)
final syncStatusProvider = AutoDisposeProvider<SyncStatus>.internal(
  syncStatus,
  name: r'syncStatusProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$syncStatusHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef SyncStatusRef = AutoDisposeProviderRef<SyncStatus>;
String _$syncManagerHash() => r'09bafdd21baf3a766c4d3d44e4b5aaab30375899';

/// Procesa la cola de operaciones pendientes cuando hay conectividad.
///
/// Se activa automáticamente al recuperar la conexión a internet.
/// Procesa las operaciones en orden FIFO con reintento.
///
/// Copied from [SyncManager].
@ProviderFor(SyncManager)
final syncManagerProvider =
    AutoDisposeNotifierProvider<SyncManager, SyncStatus>.internal(
      SyncManager.new,
      name: r'syncManagerProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$syncManagerHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

typedef _$SyncManager = AutoDisposeNotifier<SyncStatus>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
