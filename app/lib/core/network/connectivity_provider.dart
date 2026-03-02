import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../utils/app_logger.dart';

part 'connectivity_provider.g.dart';

// ── connectivityProvider ──────────────────────────────────────────────────────

/// Stream reactivo del estado de conectividad del dispositivo.
/// Emite [ConnectivityResult] cada vez que cambia la red.
@riverpod
Stream<ConnectivityResult> connectivity(Ref ref) {
  AppLogger.debug('ConnectivityProvider: listening to network changes');
  // Normalize events: some platform versions may emit a List<ConnectivityResult>
  // while others emit a single ConnectivityResult. Map to a canonical
  // ConnectivityResult for downstream consumers.
  // The `connectivity_plus` package may provide a stream of
  // `List<ConnectivityResult>` on some platforms; treat the event as a
  // `List<ConnectivityResult>` and map to a single `ConnectivityResult`.
  return Connectivity().onConnectivityChanged.map((
    List<ConnectivityResult> event,
  ) {
    return event.isNotEmpty ? event.first : ConnectivityResult.none;
  });
}

// ── isOnlineProvider ──────────────────────────────────────────────────────────

/// `true` si el dispositivo tiene algún tipo de conexión activa.
///
/// Por defecto asume `true` (optimista) hasta tener el primer resultado.
/// Esto evita bloquear la UI en el arranque por razones de red.
@riverpod
bool isOnline(Ref ref) {
  final status = ref.watch(connectivityProvider).whenOrNull(data: (v) => v);
  // Mientras no haya dato, asumir online (optimista).
  if (status == null) return true;
  return status != ConnectivityResult.none;
}
