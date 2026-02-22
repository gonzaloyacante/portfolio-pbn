import 'package:flutter_riverpod/flutter_riverpod.dart';
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
@riverpod
class PushRegistrationNotifier extends _$PushRegistrationNotifier {
  @override
  String? build() {
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
      final token = await service.getToken();

      if (token == null) {
        AppLogger.warn('PushRegistration: no se obtuvo token FCM');
        return;
      }

      await _sendTokenToBackend(token, service.platform);
      state = token;

      // Escuchar rotación de tokens y re-registrar automáticamente.
      service.onTokenRefresh.listen((newToken) {
        AppLogger.info('PushRegistration: token rotado, re-registrando…');
        _sendTokenToBackend(newToken, service.platform).ignore();
        state = newToken;
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
      await client.post<void>(
        Endpoints.pushUnregister,
        data: {'token': token},
      );
      state = null;
      AppLogger.info('PushRegistration: token desactivado en backend');
    } catch (e) {
      // No es crítico si falla — el token expirará naturalmente.
      AppLogger.warn('PushRegistration: error al desregistrar token: $e');
    }
  }

  // ── private ────────────────────────────────────────────────────────────────

  Future<void> _sendTokenToBackend(String token, String platform) async {
    try {
      final client = ref.read(apiClientProvider);
      await client.post<void>(
        Endpoints.pushRegister,
        data: {'token': token, 'platform': platform},
      );
      AppLogger.info('PushRegistration: token registrado en backend');
    } on UnauthorizedException {
      // La sesión expiró — no reintentar; el siguiente login re-registrará.
      AppLogger.warn('PushRegistration: sesión expirada al registrar token');
    } catch (e) {
      AppLogger.warn('PushRegistration: error al enviar token al backend: $e');
    }
  }
}
