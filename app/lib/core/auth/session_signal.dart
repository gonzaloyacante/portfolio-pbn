import 'package:flutter_riverpod/flutter_riverpod.dart';

// ── _SessionExpiredNotifier ───────────────────────────────────────────────────

/// Notifier interno que mantiene un contador de expiración de sesión.
/// Solo expone un método [increment] para que el contador pueda incrementarse
/// desde fuera de la clase sin exponer el setter de [state].
class _SessionExpiredNotifier extends Notifier<int> {
  @override
  int build() => 0;

  /// Incrementa la señal. Llamado por [AuthInterceptor] cuando el refresh
  /// token falla y la sesión ha sido limpiada.
  void increment() => state++;
}

// ── sessionExpiredSignal ──────────────────────────────────────────────────────

/// Señal de expiración de sesión.
///
/// Incrementada por [AuthInterceptor] cuando el refresh token falla y los
/// tokens han sido limpiados. No puede importar `auth_provider.dart`
/// directamente por la dependencia circular:
///   auth_interceptor → auth_provider → auth_repository → api_client → auth_interceptor
///
/// [AuthNotifier] escucha este provider en su `build()` y transiciona a
/// [AuthState.unauthenticated()] cuando el contador aumenta, lo que hace
/// que [RouterNotifier] redirija automáticamente al login.
final sessionExpiredSignal = NotifierProvider<_SessionExpiredNotifier, int>(
  _SessionExpiredNotifier.new,
);
