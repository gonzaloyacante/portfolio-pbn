import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../api/api_exceptions.dart';
import '../utils/app_logger.dart';
import 'auth_repository.dart';
import 'auth_state.dart';

part 'auth_provider.g.dart';

// ── AuthNotifier ──────────────────────────────────────────────────────────────

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
@riverpod
class AuthNotifier extends _$AuthNotifier {
  @override
  Future<AuthState> build() async {
    AppLogger.info('AuthNotifier: initializing...');
    return _restoreSession();
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /// Inicia sesión con email y password.
  /// Opcionalmente registra el [fcmToken] del dispositivo para push notifications.
  Future<void> login({
    required String email,
    required String password,
    String? fcmToken,
  }) async {
    state = const AsyncData(AuthState.authenticating());

    try {
      final repo = ref.read(authRepositoryProvider);
      final user = await repo.login(
        email: email,
        password: password,
        fcmToken: fcmToken,
      );
      AppLogger.info('AuthNotifier: login success → ${user.email}');
      state = AsyncData(AuthState.authenticated(user: user));
      // Asociar usuario a eventos de Sentry.
      Sentry.configureScope(
        (scope) => scope.setUser(
          SentryUser(id: user.id, email: user.email, name: user.name),
        ),
      );
    } on UnauthorizedException catch (e) {
      AppLogger.warn('AuthNotifier: login failed → ${e.message}');
      state = AsyncData(AuthState.error(message: e.message));
    } on RateLimitException catch (_) {
      state = const AsyncData(
        AuthState.error(
          message: 'Demasiados intentos fallidos. Inténtalo en 15 minutos.',
        ),
      );
    } on NetworkException catch (_) {
      state = const AsyncData(
        AuthState.error(message: 'Sin conexión a internet. Verifica tu red.'),
      );
    } catch (e, st) {
      AppLogger.error('AuthNotifier: unexpected login error', e, st);
      state = const AsyncData(
        AuthState.error(message: 'Error inesperado. Inténtalo de nuevo.'),
      );
    }
  }

  /// Cierra la sesión del usuario.
  /// [everywhere] = true revoca todos los dispositivos.
  Future<void> logout({bool everywhere = false}) async {
    AppLogger.info('AuthNotifier: logout (everywhere=$everywhere)');
    try {
      final repo = ref.read(authRepositoryProvider);
      await repo.logout(everywhere: everywhere);
    } catch (e) {
      AppLogger.error('AuthNotifier: logout error (tokens cleared anyway)', e);
    } finally {
      state = const AsyncData(AuthState.unauthenticated());
      // Limpiar usuario de Sentry al cerrar sesión.
      Sentry.configureScope((scope) => scope.setUser(null));
    }
  }

  /// Limpia el estado de error para volver al estado unauthenticated (login form).
  void clearError() {
    state = const AsyncData(AuthState.unauthenticated());
  }

  // ── Private ────────────────────────────────────────────────────────────────

  /// Intenta restaurar la sesión existente al arrancar la app.
  /// Si hay tokens guardados, valida con GET /me. Si falla, limpia tokens.
  Future<AuthState> _restoreSession() async {
    try {
      final repo = ref.read(authRepositoryProvider);
      final hasSession = await repo.hasSession();

      if (!hasSession) {
        AppLogger.info('AuthNotifier: no stored session → unauthenticated');
        return const AuthState.unauthenticated();
      }

      AppLogger.info(
        'AuthNotifier: stored session found → validating with /me',
      );
      final user = await repo.getMe();
      AppLogger.info('AuthNotifier: session restored for ${user.email}');
      // Re-asociar usuario a Sentry al restaurar sesión.
      Sentry.configureScope(
        (scope) => scope.setUser(
          SentryUser(id: user.id, email: user.email, name: user.name),
        ),
      );
      return AuthState.authenticated(user: user);
    } on UnauthorizedException catch (_) {
      AppLogger.warn('AuthNotifier: stored session expired → unauthenticated');
      // Los tokens ya fueron limpiados por el AuthInterceptor.
      return const AuthState.unauthenticated();
    } catch (e) {
      AppLogger.error('AuthNotifier: session restore failed', e);
      return const AuthState.unauthenticated();
    }
  }
}

// Nota: el provider `authProvider` es generado por `riverpod_generator`.
// Antes se usaba un alias manual; se eliminó para evitar definiciones duplicadas.
