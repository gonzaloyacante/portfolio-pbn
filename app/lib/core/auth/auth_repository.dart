import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../api/api_client.dart';
import '../api/api_exceptions.dart';
import '../api/endpoints.dart';
import '../utils/app_logger.dart';
import 'auth_state.dart';
import 'token_storage.dart';

part 'auth_repository.g.dart';

// ── Provider ──────────────────────────────────────────────────────────────────

@riverpod
AuthRepository authRepository(Ref ref) {
  return AuthRepository(
    apiClient: ref.watch(apiClientProvider),
    tokenStorage: ref.watch(tokenStorageProvider),
  );
}

// ── AuthRepository ────────────────────────────────────────────────────────────

/// Maneja las operaciones de autenticación contra la API de administración.
///
/// Responsabilidades:
/// - Login con email/password → guarda tokens.
/// - Refresh del access token.
/// - Logout (local + revocación en servidor).
/// - Obtener el perfil del usuario autenticado (GET /me).
class AuthRepository {
  const AuthRepository({
    required ApiClient apiClient,
    required TokenStorage tokenStorage,
  }) : _api = apiClient,
       _storage = tokenStorage;

  final ApiClient _api;
  final TokenStorage _storage;

  // ── login ──────────────────────────────────────────────────────────────────

  /// Inicia sesión con [email] y [password].
  ///
  /// Guarda el access token y refresh token en [TokenStorage].
  /// Devuelve el [UserProfile] si tiene éxito.
  /// Lanza [UnauthorizedException] si las credenciales son incorrectas.
  /// Lanza [RateLimitException] si la cuenta ha sido bloqueada.
  Future<UserProfile> login({
    required String email,
    required String password,
    String? fcmToken,
  }) async {
    AppLogger.info('AuthRepository: login attempt for $email');

    final payload = <String, dynamic>{'email': email, 'password': password};
    if (fcmToken != null) payload['pushToken'] = fcmToken;

    final raw = await _api.post<Map<String, dynamic>>(
      Endpoints.authLogin,
      data: payload,
    );

    // El backend devuelve { success: true, data: { accessToken, refreshToken, user } }
    // pero mantenemos compatibilidad si la respuesta viene con los campos al tope.
    final body = (raw['data'] is Map<String, dynamic>)
        ? raw['data'] as Map<String, dynamic>
        : raw;

    final accessToken = body['accessToken'] as String?;
    final refreshToken = body['refreshToken'] as String?;
    final userData = body['user'] as Map<String, dynamic>?;

    if (accessToken == null || refreshToken == null || userData == null) {
      throw const ServerException(message: 'Respuesta de login inválida');
    }

    await Future.wait([
      _storage.saveAccessToken(accessToken),
      _storage.saveRefreshToken(refreshToken),
    ]);

    final profile = UserProfile.fromJson(userData);
    AppLogger.info('AuthRepository: login successful for ${profile.email}');
    return profile;
  }

  // ── logout ─────────────────────────────────────────────────────────────────

  /// Cierra la sesión del usuario.
  ///
  /// [everywhere] = true revoca todos los dispositivos.
  /// Siempre limpia el almacenamiento local, incluso si el servidor falla.
  Future<void> logout({bool everywhere = false}) async {
    AppLogger.info('AuthRepository: logout (everywhere=$everywhere)');

    try {
      final refreshToken = await _storage.getRefreshToken();
      if (refreshToken != null) {
        await _api.post<void>(
          Endpoints.authLogout,
          data: {'refreshToken': refreshToken, 'everywhere': everywhere},
        );
      }
    } catch (e) {
      // Siempre limpiar localmente aunque el servidor falle.
      AppLogger.warn('AuthRepository: logout server call failed: $e');
    } finally {
      await _storage.clearAll();
    }
  }

  // ── getMe ──────────────────────────────────────────────────────────────────

  /// Obtiene el perfil del usuario actualmente autenticado.
  /// Útil para restaurar la sesión al arrancar la app.
  Future<UserProfile> getMe() async {
    final raw = await _api.get<Map<String, dynamic>>(Endpoints.authMe);

    // Backend returns { success: true, data: <user> }
    final body = (raw['data'] is Map<String, dynamic>)
        ? raw['data'] as Map<String, dynamic>
        : raw;

    // body may be either the user map directly or { user: { ... } }
    final userData = (body['user'] is Map<String, dynamic>)
        ? body['user'] as Map<String, dynamic>
        : body;

    if (userData.isEmpty) {
      throw const ServerException(message: 'Respuesta de /me inválida');
    }

    return UserProfile.fromJson(userData);
  }

  // ── hasSession ─────────────────────────────────────────────────────────────

  /// Verifica si existe una sesión guardada localmente.
  Future<bool> hasSession() => _storage.hasSession();
}
