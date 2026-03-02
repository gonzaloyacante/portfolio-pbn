import 'dart:async';

import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../api/api_client.dart';
import '../api/api_exceptions.dart';
import '../api/endpoints.dart';
import '../utils/app_logger.dart';
import 'push_service.dart';

part 'push_provider.g.dart';

// ── pushServiceProvider ───────────────────────────────────────────────────────

/// Proveedor del servicio Push singleton.
@riverpod
PushService pushService(Ref ref) => PushService();

// ── PushRegistrationNotifier ──────────────────────────────────────────────────

/// Gestiona el registro/desregistro del token FCM en el backend.
///
/// - [register]: llama a POST /api/admin/push/register
/// - [unregister]: llama a POST /api/admin/push/unregister
/// - Suscribe al stream [PushService.onTokenRefresh] para re-registrar
///   automáticamente cuando FCM rota el token.
///
/// IMPORTANTE: keepAlive=true para que no se destruya antes de completar
/// el registro asíncrono.
@Riverpod(keepAlive: true)
class PushRegistrationNotifier extends _$PushRegistrationNotifier {
  StreamSubscription<String>? _tokenRefreshSub;

  @override
  String? build() {
    // Cancelar suscripción cuando el provider se destruye (aunque es keepAlive,
    // puede ocurrir en logout explícito con ref.invalidate).
    ref.onDispose(() => _tokenRefreshSub?.cancel());
    // Devuelve el token actual (null mientras no se haya registrado).
    return null;
  }

  // ── register ───────────────────────────────────────────────────────────────

  /// Obtiene el token FCM e intenta registrarlo en el backend.
  ///
  /// Silencia errores de red: las notificaciones push no son críticas
  /// para el funcionamiento de la app.
  Future<void> register() async {
    final service = ref.read(pushServiceProvider);

    try {
      await service.init();
      if (!ref.mounted) return;

      final token = await service.getToken();
      if (!ref.mounted) return;

      if (token == null) {
        AppLogger.warn('PushRegistration: no se obtuvo token FCM');
        return;
      }

      await _sendTokenToBackend(token, service.platform);
      if (!ref.mounted) return;

      state = token;

      // Escuchar rotación de tokens y re-registrar automáticamente.
      // Guardamos la suscripción para cancelarla en dispose.
      _tokenRefreshSub?.cancel();
      _tokenRefreshSub = service.onTokenRefresh.listen((newToken) {
        AppLogger.info('PushRegistration: token rotado, re-registrando…');
        _sendTokenToBackend(newToken, service.platform).ignore();
        if (ref.mounted) state = newToken;
      });
    } catch (e, st) {
      AppLogger.error('PushRegistration: error al registrar token', e, st);
    }
  }

  // ── unregister ─────────────────────────────────────────────────────────────

  /// Desactiva el token FCM en el backend (llamar al cerrar sesión).
  Future<void> unregister() async {
    final token = state;
    if (token == null) return;

    try {
      final client = ref.read(apiClientProvider);
      await client.post<void>(Endpoints.pushUnregister, data: {'token': token});
      if (!ref.mounted) return;
      state = null;
      AppLogger.info('PushRegistration: token desactivado en backend');
    } catch (e) {
      // No es crítico si falla — el token expirará naturalmente.
      AppLogger.warn('PushRegistration: error al desregistrar token: $e');
    }
  }

  // ── private ────────────────────────────────────────────────────────────────

  Future<void> _sendTokenToBackend(String token, String platform) async {
    const maxAttempts = 3;
    const delays = [
      Duration(seconds: 2),
      Duration(seconds: 4),
      Duration(seconds: 8),
    ];

    for (var attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        final client = ref.read(apiClientProvider);
        await client.post<void>(
          Endpoints.pushRegister,
          data: {'token': token, 'platform': platform},
        );
        AppLogger.info(
          'PushRegistration: token registrado en backend (intento $attempt)',
        );
        return;
      } on UnauthorizedException {
        // La sesión expiró — no reintentar; el siguiente login re-registrará.
        AppLogger.warn('PushRegistration: sesión expirada al registrar token');
        return;
      } catch (e) {
        AppLogger.warn(
          'PushRegistration: error al enviar token (intento $attempt/$maxAttempts): $e',
        );
        if (attempt < maxAttempts) {
          await Future<void>.delayed(delays[attempt - 1]);
        }
      }
    }
    AppLogger.error(
      'PushRegistration: falló registro de token tras $maxAttempts intentos',
    );
  }
}

// Nota: `pushRegistrationProvider` es generado por `riverpod_generator`.
// Se eliminó el alias manual para evitar duplicados generados.
