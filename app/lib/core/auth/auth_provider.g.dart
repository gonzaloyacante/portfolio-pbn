// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'auth_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$authNotifierHash() => r'dc11b5990da90e5c1940d31a7017abe0320b730e';

/// Controla el estado de autenticación global de la app.
///
/// El router escucha este notifier para proteger rutas:
/// - [Unauthenticated] → redirige a `/login`
/// - [Authenticated]   → permite acceso al panel de administración
///
/// Uso:
/// ```dart
/// // Login
/// await ref.read(authProvider.notifier).login(email: '...', password: '...');
///
/// // Leer estado
/// final authState = ref.watch(authProvider);
/// authState.when(
///   authenticated: (user) => Text(user.name),
///   unauthenticated: () => LoginPage(),
///   authenticating: () => CircularProgressIndicator(),
///   error: (msg) => Text(msg),
/// );
/// ```
///
/// Copied from [AuthNotifier].
@ProviderFor(AuthNotifier)
final authNotifierProvider =
    AutoDisposeAsyncNotifierProvider<AuthNotifier, AuthState>.internal(
      AuthNotifier.new,
      name: r'authNotifierProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$authNotifierHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

typedef _$AuthNotifier = AutoDisposeAsyncNotifier<AuthState>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
