// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'connectivity_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$connectivityHash() => r'abebaf300d2d7ed73aa20f7f1793756ecde25810';

/// Stream reactivo del estado de conectividad del dispositivo.
/// Emite [ConnectivityResult] cada vez que cambia la red.
///
/// Copied from [connectivity].
@ProviderFor(connectivity)
final connectivityProvider =
    AutoDisposeStreamProvider<ConnectivityResult>.internal(
      connectivity,
      name: r'connectivityProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$connectivityHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef ConnectivityRef = AutoDisposeStreamProviderRef<ConnectivityResult>;
String _$isOnlineHash() => r'ea7a79482fd851aa1a2ae3d778d77068100ae4b3';

/// `true` si el dispositivo tiene algún tipo de conexión activa.
///
/// Por defecto asume `true` (optimista) hasta tener el primer resultado.
/// Esto evita bloquear la UI en el arranque por razones de red.
///
/// Copied from [isOnline].
@ProviderFor(isOnline)
final isOnlineProvider = AutoDisposeProvider<bool>.internal(
  isOnline,
  name: r'isOnlineProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$isOnlineHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef IsOnlineRef = AutoDisposeProviderRef<bool>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
