// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'connectivity_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
/// Stream reactivo del estado de conectividad del dispositivo.
/// Emite [ConnectivityResult] cada vez que cambia la red.

@ProviderFor(connectivity)
final connectivityProvider = ConnectivityProvider._();

/// Stream reactivo del estado de conectividad del dispositivo.
/// Emite [ConnectivityResult] cada vez que cambia la red.

final class ConnectivityProvider
    extends $FunctionalProvider<AsyncValue<ConnectivityResult>, ConnectivityResult, Stream<ConnectivityResult>>
    with $FutureModifier<ConnectivityResult>, $StreamProvider<ConnectivityResult> {
  /// Stream reactivo del estado de conectividad del dispositivo.
  /// Emite [ConnectivityResult] cada vez que cambia la red.
  ConnectivityProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'connectivityProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$connectivityHash();

  @$internal
  @override
  $StreamProviderElement<ConnectivityResult> $createElement($ProviderPointer pointer) =>
      $StreamProviderElement(pointer);

  @override
  Stream<ConnectivityResult> create(Ref ref) {
    return connectivity(ref);
  }
}

String _$connectivityHash() => r'abebaf300d2d7ed73aa20f7f1793756ecde25810';

/// `true` si el dispositivo tiene algún tipo de conexión activa.
///
/// Por defecto asume `true` (optimista) hasta tener el primer resultado.
/// Esto evita bloquear la UI en el arranque por razones de red.

@ProviderFor(isOnline)
final isOnlineProvider = IsOnlineProvider._();

/// `true` si el dispositivo tiene algún tipo de conexión activa.
///
/// Por defecto asume `true` (optimista) hasta tener el primer resultado.
/// Esto evita bloquear la UI en el arranque por razones de red.

final class IsOnlineProvider extends $FunctionalProvider<bool, bool, bool> with $Provider<bool> {
  /// `true` si el dispositivo tiene algún tipo de conexión activa.
  ///
  /// Por defecto asume `true` (optimista) hasta tener el primer resultado.
  /// Esto evita bloquear la UI en el arranque por razones de red.
  IsOnlineProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'isOnlineProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$isOnlineHash();

  @$internal
  @override
  $ProviderElement<bool> $createElement($ProviderPointer pointer) => $ProviderElement(pointer);

  @override
  bool create(Ref ref) {
    return isOnline(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(bool value) {
    return $ProviderOverride(origin: this, providerOverride: $SyncValueProvider<bool>(value));
  }
}

String _$isOnlineHash() => r'ea7a79482fd851aa1a2ae3d778d77068100ae4b3';
