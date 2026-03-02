// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'push_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// Proveedor del servicio Push singleton.

@ProviderFor(pushService)
final pushServiceProvider = PushServiceProvider._();

/// Proveedor del servicio Push singleton.

final class PushServiceProvider
    extends $FunctionalProvider<PushService, PushService, PushService>
    with $Provider<PushService> {
  /// Proveedor del servicio Push singleton.
  PushServiceProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'pushServiceProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$pushServiceHash();

  @$internal
  @override
  $ProviderElement<PushService> $createElement($ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  PushService create(Ref ref) {
    return pushService(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(PushService value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<PushService>(value),
    );
  }
}

String _$pushServiceHash() => r'b144a7c50304589ce14e07a2732188ea5958dfaa';

/// Gestiona el registro/desregistro del token FCM en el backend.
///
/// - [register]: llama a POST /api/admin/push/register
/// - [unregister]: llama a POST /api/admin/push/unregister
/// - Suscribe al stream [PushService.onTokenRefresh] para re-registrar
///   automáticamente cuando FCM rota el token.
///
/// IMPORTANTE: keepAlive=true para que no se destruya antes de completar
/// el registro asíncrono.

@ProviderFor(PushRegistrationNotifier)
final pushRegistrationProvider = PushRegistrationNotifierProvider._();

/// Gestiona el registro/desregistro del token FCM en el backend.
///
/// - [register]: llama a POST /api/admin/push/register
/// - [unregister]: llama a POST /api/admin/push/unregister
/// - Suscribe al stream [PushService.onTokenRefresh] para re-registrar
///   automáticamente cuando FCM rota el token.
///
/// IMPORTANTE: keepAlive=true para que no se destruya antes de completar
/// el registro asíncrono.
final class PushRegistrationNotifierProvider
    extends $NotifierProvider<PushRegistrationNotifier, String?> {
  /// Gestiona el registro/desregistro del token FCM en el backend.
  ///
  /// - [register]: llama a POST /api/admin/push/register
  /// - [unregister]: llama a POST /api/admin/push/unregister
  /// - Suscribe al stream [PushService.onTokenRefresh] para re-registrar
  ///   automáticamente cuando FCM rota el token.
  ///
  /// IMPORTANTE: keepAlive=true para que no se destruya antes de completar
  /// el registro asíncrono.
  PushRegistrationNotifierProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'pushRegistrationProvider',
        isAutoDispose: false,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$pushRegistrationNotifierHash();

  @$internal
  @override
  PushRegistrationNotifier create() => PushRegistrationNotifier();

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(String? value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<String?>(value),
    );
  }
}

String _$pushRegistrationNotifierHash() =>
    r'47a0f61172572203352245e053f43a40597cfcf9';

/// Gestiona el registro/desregistro del token FCM en el backend.
///
/// - [register]: llama a POST /api/admin/push/register
/// - [unregister]: llama a POST /api/admin/push/unregister
/// - Suscribe al stream [PushService.onTokenRefresh] para re-registrar
///   automáticamente cuando FCM rota el token.
///
/// IMPORTANTE: keepAlive=true para que no se destruya antes de completar
/// el registro asíncrono.

abstract class _$PushRegistrationNotifier extends $Notifier<String?> {
  String? build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<String?, String?>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<String?, String?>,
              String?,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}
