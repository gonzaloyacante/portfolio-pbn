import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../utils/app_logger.dart';

part 'connectivity_provider.g.dart';

// ── connectivityProvider ──────────────────────────────────────────────────────

/// Stream reactivo del estado de conectividad del dispositivo.
/// Emite [ConnectivityResult] cada vez que cambia la red.
@riverpod
Stream<ConnectivityResult> connectivity(Ref ref) {
  AppLogger.debug('ConnectivityProvider: listening to network changes');
  return Connectivity()
      .onConnectivityChanged
      .map((results) => results.isNotEmpty ? results.first : ConnectivityResult.none);
}

// ── isOnlineProvider ──────────────────────────────────────────────────────────

/// `true` si el dispositivo tiene algún tipo de conexión activa.
///
/// Por defecto asume `true` (optimista) hasta tener el primer resultado.
/// Esto evita bloquear la UI en el arranque por razones de red.
@riverpod
bool isOnline(Ref ref) {
  final status = ref.watch(connectivityProvider).valueOrNull;
  // Mientras no haya dato, asumir online (optimista).
  if (status == null) return true;
  return status != ConnectivityResult.none;
}
