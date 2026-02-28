import 'package:extension_google_sign_in_as_googleapis_auth/extension_google_sign_in_as_googleapis_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:googleapis/calendar/v3.dart' as gcal;

import '../../../core/utils/app_logger.dart';
import 'google_calendar_models.dart';

// ── GoogleCalendarService ──────────────────────────────────────────────────────

/// Integración con Google Calendar mediante OAuth2 (`google_sign_in`).
///
/// Permite a la administradora:
/// - Conectar su cuenta Google para sincronizar reservas.
/// - Crear eventos en su calendario primario desde [BookingDetailPage].
/// - Desconectar su cuenta Google desde la pantalla de cuenta.
///
/// El token OAuth es gestionado internamente por el package `google_sign_in`
/// (refresh automático), no se almacena manualmente.
class GoogleCalendarService {
  GoogleCalendarService() : _googleSignIn = GoogleSignIn.instance;

  final GoogleSignIn _googleSignIn;

  // ── signIn ─────────────────────────────────────────────────────────────────

  /// Solicita autorización OAuth2 a Google.
  ///
  /// Abre el flujo de selección de cuenta en un WebView nativo.
  /// Retorna `true` si el usuario completa el proceso correctamente.
  Future<bool> signIn() async {
    try {
      // Interactive authenticate: may throw a GoogleSignInException on failure.
      final account = await _googleSignIn.authenticate(
        scopeHint: [gcal.CalendarApi.calendarEventsScope],
      );
      AppLogger.info('GoogleCalendarService: conectado como ${account.email}');
      return true;
    } catch (e, st) {
      AppLogger.error('GoogleCalendarService: error en signIn()', e, st);
      return false;
    }
  }

  // ── signOut ────────────────────────────────────────────────────────────────

  /// Desconecta la cuenta Google y revoca permisos.
  Future<void> signOut() async {
    try {
      await _googleSignIn.disconnect();
      AppLogger.info('GoogleCalendarService: cuenta desconectada');
    } catch (e, st) {
      AppLogger.error('GoogleCalendarService: error en signOut()', e, st);
    }
  }

  // ── isSignedIn ─────────────────────────────────────────────────────────────

  /// Comprueba si hay una sesión Google activa (silenciosa).
  Future<bool> isSignedIn() async {
    try {
      // Intenta reconectar en silencio si ya estaba autenticado antes.
      final account = await _googleSignIn.attemptLightweightAuthentication();
      // attemptLightweightAuthentication may return null if no silent session.
      return account != null;
    } catch (_) {
      return false;
    }
  }

  // ── connectedEmail ─────────────────────────────────────────────────────────

  /// Retorna el email de la cuenta Google conectada, o `null` si no hay sesión.
  Future<String?> getConnectedEmail() async {
    try {
      final account = await _googleSignIn.attemptLightweightAuthentication();
      return account?.email;
    } catch (_) {
      return null;
    }
  }

  // ── createEvent ────────────────────────────────────────────────────────────

  /// Crea un evento en el calendario primario del usuario autenticado.
  ///
  /// Lanza [Exception] si el usuario no está autenticado en Google o si
  /// la API de Calendar devuelve un error.
  Future<void> createEvent(GoogleCalendarEvent event) async {
    // Obtain a signed-in account (silent attempt). If none, signal the caller.
    final account = await _googleSignIn.attemptLightweightAuthentication();
    if (account == null) {
      throw Exception(
        'No hay cuenta Google conectada. Conecta tu cuenta primero.',
      );
    }

    // Request client authorization tokens for the required scopes.
    final clientAuth = await account.authorizationClient.authorizationForScopes(
      [gcal.CalendarApi.calendarEventsScope],
    );

    if (clientAuth == null) {
      throw Exception('No se pudo obtener autorización para Google Calendar.');
    }

    final authClient = clientAuth.authClient(
      scopes: [gcal.CalendarApi.calendarEventsScope],
    );

    try {
      final calendarApi = gcal.CalendarApi(authClient);

      final gcalEvent = gcal.Event(
        summary: event.title,
        description: event.description,
        start: gcal.EventDateTime(
          dateTime: event.startDateTime.toUtc(),
          timeZone: 'UTC',
        ),
        end: gcal.EventDateTime(
          dateTime: event.endDateTime.toUtc(),
          timeZone: 'UTC',
        ),
        reminders: gcal.EventReminders(
          useDefault: false,
          overrides: [
            gcal.EventReminder(method: 'popup', minutes: event.reminderMinutes),
          ],
        ),
        attendees: event.attendeeEmail != null
            ? [gcal.EventAttendee(email: event.attendeeEmail)]
            : null,
      );

      await calendarApi.events.insert(gcalEvent, 'primary');
      AppLogger.info('GoogleCalendarService: evento creado — "${event.title}"');
    } finally {
      authClient.close();
    }
  }
}
