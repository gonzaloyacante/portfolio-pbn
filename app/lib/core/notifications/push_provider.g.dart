// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'push_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$pushServiceHash() => r'b144a7c50304589ce14e07a2732188ea5958dfaa';

/// Proveedor del servicio Push singleton.
///
/// Copied from [pushService].
@ProviderFor(pushService)
final pushServiceProvider = AutoDisposeProvider<PushService>.internal(
  pushService,
  name: r'pushServiceProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$pushServiceHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef PushServiceRef = AutoDisposeProviderRef<PushService>;
String _$pushRegistrationNotifierHash() =>
    r'86fc4dbd9ea195dd8ed25d8b3fe663d5771af513';

/// Gestiona el registro/desregistro del token FCM en el backend.
///
/// - [register]: llama a POST /api/admin/push/register
/// - [unregister]: llama a POST /api/admin/push/unregister
/// - Suscribe al stream [PushService.onTokenRefresh] para re-registrar
///   automáticamente cuando FCM rota el token.
///
/// Copied from [PushRegistrationNotifier].
@ProviderFor(PushRegistrationNotifier)
final pushRegistrationNotifierProvider =
    AutoDisposeNotifierProvider<PushRegistrationNotifier, String?>.internal(
      PushRegistrationNotifier.new,
      name: r'pushRegistrationNotifierProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$pushRegistrationNotifierHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

typedef _$PushRegistrationNotifier = AutoDisposeNotifier<String?>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
