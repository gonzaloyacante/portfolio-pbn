import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../core/utils/app_logger.dart';
import '../data/google_calendar_models.dart';
import '../data/google_calendar_service.dart';

part 'google_calendar_provider.g.dart';

// ── googleCalendarServiceProvider ─────────────────────────────────────────────

@riverpod
GoogleCalendarService googleCalendarService(Ref ref) => GoogleCalendarService();

// ── GoogleCalendarNotifier ─────────────────────────────────────────────────────

/// Gestiona el estado de autenticación de Google Calendar y la creación
/// de eventos en el calendario del usuario.
///
/// Estados posibles:
/// - [GoogleAuthDisconnected]: sin cuenta conectada.
/// - [GoogleAuthConnecting]: flujo OAuth en curso.
/// - [GoogleAuthConnected(email)]: cuenta conectada y operativa.
/// - [GoogleAuthError(message)]: error en el proceso.
@riverpod
class GoogleCalendarNotifier extends _$GoogleCalendarNotifier {
  @override
  Future<GoogleAuthState> build() async {
    final service = ref.read(googleCalendarServiceProvider);

    // Intentar restaurar sesión silenciosa al arrancar.
    final email = await service.getConnectedEmail();
    if (email != null) {
      AppLogger.info('GoogleCalendarNotifier: sesión restaurada → $email');
      return GoogleAuthState.connected(email: email);
    }

    return const GoogleAuthState.disconnected();
  }

  // ── signIn ─────────────────────────────────────────────────────────────────

  /// Inicia el flujo OAuth para conectar la cuenta Google.
  Future<void> signIn() async {
    state = const AsyncData(GoogleAuthState.connecting());

    try {
      final service = ref.read(googleCalendarServiceProvider);
      final success = await service.signIn();

      if (!success) {
        state = const AsyncData(GoogleAuthState.disconnected());
        return;
      }

      final email = await service.getConnectedEmail();
      if (email == null) {
        state = const AsyncData(
          GoogleAuthState.error(message: 'No se pudo obtener el email'),
        );
        return;
      }

      state = AsyncData(GoogleAuthState.connected(email: email));
    } catch (e, st) {
      AppLogger.error('GoogleCalendarNotifier: error en signIn()', e, st);
      state = AsyncData(
        GoogleAuthState.error(message: 'Error al conectar con Google: $e'),
      );
    }
  }

  // ── signOut ────────────────────────────────────────────────────────────────

  /// Desconecta la cuenta Google y revoca permisos.
  Future<void> signOut() async {
    try {
      final service = ref.read(googleCalendarServiceProvider);
      await service.signOut();
      state = const AsyncData(GoogleAuthState.disconnected());
    } catch (e, st) {
      AppLogger.error('GoogleCalendarNotifier: error en signOut()', e, st);
    }
  }

  // ── createEvent ────────────────────────────────────────────────────────────

  /// Crea un evento en Google Calendar.
  ///
  /// Retorna `true` si se creó correctamente, `false` si no hay sesión activa.
  /// Lanza [Exception] si la API devuelve error.
  Future<bool> createEvent(GoogleCalendarEvent event) async {
    final currentState = state.valueOrNull;
    if (currentState is! GoogleAuthConnected) {
      AppLogger.warn('GoogleCalendarNotifier: createEvent sin sesión activa');
      return false;
    }

    final service = ref.read(googleCalendarServiceProvider);
    await service.createEvent(event);
    return true;
  }
}
