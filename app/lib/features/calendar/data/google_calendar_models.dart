/// Modelo para crear un evento en Google Calendar.
class GoogleCalendarEvent {
  const GoogleCalendarEvent({
    required this.title,
    required this.description,
    required this.startDateTime,
    required this.endDateTime,
    this.attendeeEmail,
    this.reminderMinutes = 60,
  });

  /// Título del evento (ej. "Reserva — Fotografía de bodas — Juan Pérez").
  final String title;

  /// Descripción del evento con los detalles de la reserva.
  final String description;

  /// Fecha y hora de inicio de la reserva.
  final DateTime startDateTime;

  /// Fecha y hora de fin de la reserva.
  final DateTime endDateTime;

  /// Email del cliente para añadir como asistente (opcional).
  final String? attendeeEmail;

  /// Minutos de antelación para el recordatorio (por defecto: 60 min).
  final int reminderMinutes;
}

// ── GoogleAuthState ────────────────────────────────────────────────────────────

/// Estado de la integración con Google Calendar.
sealed class GoogleAuthState {
  const GoogleAuthState();

  /// No hay cuenta Google conectada.
  const factory GoogleAuthState.disconnected() = GoogleAuthDisconnected;

  /// Proceso de autenticación OAuth en curso.
  const factory GoogleAuthState.connecting() = GoogleAuthConnecting;

  /// Cuenta Google conectada y validada.
  const factory GoogleAuthState.connected({required String email}) =
      GoogleAuthConnected;

  /// Error durante la autenticación.
  const factory GoogleAuthState.error({required String message}) =
      GoogleAuthError;
}

/// Estado: sin cuenta Google conectada.
class GoogleAuthDisconnected extends GoogleAuthState {
  const GoogleAuthDisconnected();
}

/// Estado: conectando con Google OAuth.
class GoogleAuthConnecting extends GoogleAuthState {
  const GoogleAuthConnecting();
}

/// Estado: cuenta Google conectada.
class GoogleAuthConnected extends GoogleAuthState {
  const GoogleAuthConnected({required this.email});
  final String email;
}

/// Estado: error en la autenticación de Google.
class GoogleAuthError extends GoogleAuthState {
  const GoogleAuthError({required this.message});
  final String message;
}
