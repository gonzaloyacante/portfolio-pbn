import 'dart:io';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../utils/app_logger.dart';
import 'app_release_model.dart';
import 'app_update_repository.dart';

// ── appUpdateRepositoryProvider ───────────────────────────────────────────────

/// Singleton del repositorio de actualizaciones.
/// Usa su propio Dio sin interceptores de auth (el endpoint es público).
final appUpdateRepositoryProvider = Provider<AppUpdateRepository>((ref) {
  return AppUpdateRepository();
});

// ── appUpdateTriggerProvider ──────────────────────────────────────────────────

// ── AppUpdateTriggerNotifier ─────────────────────────────────────────────────

/// Notifier simple que mantiene un contador entero.
/// Incrementar el estado fuerza una nueva ejecución de [appUpdateStatusProvider].
///
/// Riverpod 3 eliminó [StateProvider]; se usa [NotifierProvider] en su lugar.
class AppUpdateTriggerNotifier extends Notifier<int> {
  @override
  int build() => 0;

  /// Incrementa el contador, disparando una nueva comprobación de actualización.
  ///
  /// Uso:
  /// ```dart
  /// ref.read(appUpdateTriggerProvider.notifier).trigger();
  /// ```
  void trigger() => state++;
}

/// Provider del contador de disparo de comprobación de actualizaciones.
///
/// Se usa en dos casos:
/// 1. Al iniciar sesión (desde [app.dart])
/// 2. Al recibir una notificación FCM de tipo `app_update`
final appUpdateTriggerProvider = NotifierProvider<AppUpdateTriggerNotifier, int>(AppUpdateTriggerNotifier.new);

// ── appUpdateStatusProvider ───────────────────────────────────────────────────

/// Comprueba si hay una actualización disponible.
///
/// Se reactiva cuando [appUpdateTriggerProvider] cambia.
/// Devuelve [AppUpToDate], [AppUpdateAvailable] o [AppUpdateCheckFailed].
///
/// NUNCA lanza si falla — retorna [AppUpdateCheckFailed] silenciosamente
/// para no interrumpir el flujo de la app.
final appUpdateStatusProvider = FutureProvider.autoDispose<AppUpdateStatus>((ref) async {
  // Observar el trigger para reejecutar cuando se incremente
  ref.watch(appUpdateTriggerProvider);

  // Solo Android: en iOS las actualizaciones van por App Store
  if (!Platform.isAndroid) return const AppUpToDate();

  final repo = ref.watch(appUpdateRepositoryProvider);

  AppLogger.debug('appUpdateStatusProvider: iniciando comprobación…');
  final status = await repo.checkForUpdate();

  AppLogger.info('appUpdateStatusProvider: resultado → ${status.runtimeType}');

  return status;
});

// ── Global trigger helper ─────────────────────────────────────────────────────

/// Referencia global al contenedor Riverpod.
/// Se setea en [App.initState] para permitir triggers desde fuera del árbol
/// de widgets (ej. FCM background handler).
ProviderContainer? _globalContainer;

/// Inicializa la referencia global al contenedor de Riverpod.
/// Llamar una sola vez desde [App.initState] o [bootstrap].
void initAppUpdateContainer(ProviderContainer container) {
  _globalContainer = container;
}

/// Dispara una nueva comprobación de actualizaciones desde cualquier contexto
/// (incluso fuera del árbol de widgets, ej. handler de FCM).
///
/// Si no hay contenedor disponible, loguea un warning y no hace nada.
void triggerUpdateCheckGlobal() {
  final container = _globalContainer;
  if (container == null) {
    AppLogger.warn('triggerUpdateCheckGlobal: contenedor no disponible — ignorado');
    return;
  }
  try {
    container.read(appUpdateTriggerProvider.notifier).trigger();
    AppLogger.info('triggerUpdateCheckGlobal: comprobación de update disparada');
  } catch (e) {
    AppLogger.warn('triggerUpdateCheckGlobal: error — $e');
  }
}

// ── Callback para mostrar diálogo desde fuera del árbol de widgets ────────────

/// Callback registrado por [App] para mostrar el diálogo de actualización
/// desde el notification handler cuando llega un FCM de tipo `app_update`.
///
/// Firma: `void Function(AppRelease release, bool mandatory)`
void Function(AppRelease, bool)? _showUpdateDialogCallback;

/// Registra el callback que muestra el diálogo de actualización.
/// Llamar desde [App.initState] tras montar el Navigator.
void setShowUpdateDialogCallback(void Function(AppRelease, bool) callback) {
  _showUpdateDialogCallback = callback;
}

/// Limpia el callback al desmontar la app.
void clearShowUpdateDialogCallback() {
  _showUpdateDialogCallback = null;
}

/// Muestra el diálogo de actualización con los datos de [release] y [mandatory].
/// Si el callback no está registrado (app no montada), dispara una comprobación
/// al servidor como fallback.
void showUpdateDialogFromData(AppRelease release, bool mandatory) {
  final callback = _showUpdateDialogCallback;
  if (callback != null) {
    callback(release, mandatory);
  } else {
    AppLogger.warn(
      'showUpdateDialogFromData: callback no registrado — '
      'usando trigger global como fallback',
    );
    triggerUpdateCheckGlobal();
  }
}
