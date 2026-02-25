// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'auth_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning
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

@ProviderFor(AuthNotifier)
final authProvider = AuthNotifierProvider._();

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
final class AuthNotifierProvider
    extends $AsyncNotifierProvider<AuthNotifier, AuthState> {
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
  AuthNotifierProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'authProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$authNotifierHash();

  @$internal
  @override
  AuthNotifier create() => AuthNotifier();
}

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

abstract class _$AuthNotifier extends $AsyncNotifier<AuthState> {
  FutureOr<AuthState> build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<AsyncValue<AuthState>, AuthState>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AsyncValue<AuthState>, AuthState>,
              AsyncValue<AuthState>,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}
