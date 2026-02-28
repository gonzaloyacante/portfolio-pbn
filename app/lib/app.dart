import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/auth/auth_provider.dart';
import 'core/auth/auth_state.dart';
import 'core/debug/debug_panel.dart';
import 'core/notifications/notification_handler.dart';
import 'core/notifications/push_provider.dart';
import 'core/router/app_router.dart';
import 'core/theme/theme_provider.dart';
import 'core/updates/app_release_model.dart';
import 'core/updates/app_update_provider.dart';
import 'core/utils/app_logger.dart';
import 'shared/widgets/app_update_dialog.dart';

/// Widget raíz de la aplicación.
/// Conecta el router (GoRouter) con el sistema de temas (light/dark).
/// Gestiona las notificaciones push y el registro FCM.
class App extends ConsumerStatefulWidget {
  const App({super.key});

  @override
  ConsumerState<App> createState() => _AppState();
}

class _AppState extends ConsumerState<App> {
  NotificationHandler? _notifHandler;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final router = ref.read(routerProvider);
      _notifHandler = NotificationHandler(router: router);
      _notifHandler!.init();

      // ── Registrar la referencia global al contenedor Riverpod ──────────
      // Permite disparar checks de actualización desde el FCM handler,
      // que corre fuera del árbol de widgets.
      initAppUpdateContainer(ProviderScope.containerOf(context));

      // ── Registrar callback para mostrar el diálogo de actualización ────
      // La notification_handler llama a showUpdateDialogFromData() cuando
      // recibe un FCM de tipo 'app_update' con datos completos.
      setShowUpdateDialogCallback((AppRelease release, bool mandatory) {
        _showUpdateDialog(release, mandatory: mandatory);
      });
    });
  }

  @override
  void dispose() {
    clearShowUpdateDialogCallback();
    super.dispose();
  }

  // ── _showUpdateDialog ────────────────────────────────────────────────────

  /// Muestra el diálogo de actualización in-app.
  /// Verifica que el contexto del Navigator esté disponible antes de llamar.
  Future<void> _showUpdateDialog(AppRelease release, {required bool mandatory}) async {
    final context = routerNavigatorKey.currentContext;
    if (context == null || !context.mounted) {
      AppLogger.warn('App._showUpdateDialog: contexto no disponible');
      return;
    }
    AppLogger.info('App: mostrando diálogo de actualización para v${release.version}');
    await AppUpdateDialog.show(context, release: release, forceUpdate: mandatory);
  }

  @override
  Widget build(BuildContext context) {
    final router = ref.watch(routerProvider);
    final themeMode = ref.watch(themeModeProvider);

    // Escuchar cambios de auth para registrar/desregistrar token FCM
    // y disparar el check de actualizaciones al iniciar sesión.
    ref.listen<AsyncValue<AuthState>>(authProvider, (previous, next) {
      final prevState = previous?.whenOrNull(data: (v) => v);
      final nextState = next.whenOrNull(data: (v) => v);

      // Login exitoso → registrar token FCM + verificar actualizaciones
      if (nextState is Authenticated && prevState is! Authenticated) {
        ref.read(pushRegistrationProvider.notifier).register();

        // Pequeño delay para no solapar con la animación de navegación.
        Future.delayed(const Duration(seconds: 3), () {
          if (mounted) {
            AppLogger.info('App: disparando check de actualización post-login');
            ref.read(appUpdateTriggerProvider.notifier).trigger();
          }
        });
      }

      // Logout → desregistrar token FCM
      if (nextState is Unauthenticated && prevState is Authenticated) {
        ref.read(pushRegistrationProvider.notifier).unregister();
      }
    });

    // Escuchar el resultado del check de actualización y mostrar diálogo.
    // autoDispose implica que se recalcula solo cuando hay suscriptores;
    // este listen actúa como "suscriptor permanente" mientras App esté vivo.
    ref.listen<AsyncValue<AppUpdateStatus>>(appUpdateStatusProvider, (previous, next) {
      next.whenData((status) {
        if (status is AppUpdateAvailable) {
          AppLogger.info(
            'App: nueva versión detectada v${status.release.version}'
            ' (forzada: ${status.forceUpdate})',
          );
          _showUpdateDialog(status.release, mandatory: status.forceUpdate);
        }
      });
      next.whenOrNull(error: (e, _) => AppLogger.error('App: error al verificar actualizaciones: $e'));
    });

    return MaterialApp.router(
      title: 'Portfolio PBN Admin',
      debugShowCheckedModeBanner: false,

      // ── Tema ──────────────────────────────────────────────────────────────
      theme: lightTheme,
      darkTheme: darkTheme,
      themeMode: themeMode,

      // ── Router ────────────────────────────────────────────────────────────
      routerConfig: router,
      // ── Debug overlay (solo debug/profile) ───────────────────────────
      builder: kReleaseMode
          ? null
          : (context, child) {
              return Stack(
                children: [
                  child ?? const SizedBox.shrink(),
                  // Badge flotante de entorno (esquina inferior derecha)
                  const _DebugEnvBadge(),
                ],
              );
            },
    );
  }
}

// ── _DebugEnvBadge ───────────────────────────────────────────────────────────

/// Badge flotante que indica el entorno (DEV/STAGING/PROD).
/// Solo visible en debug/profile mode. Un tap abre el [DebugPanel].
/// Guard interno evita abrir múltiples instancias simultáneas.
class _DebugEnvBadge extends StatefulWidget {
  const _DebugEnvBadge();

  @override
  State<_DebugEnvBadge> createState() => _DebugEnvBadgeState();
}

class _DebugEnvBadgeState extends State<_DebugEnvBadge> {
  bool _isOpen = false;

  Future<void> _handleTap() async {
    if (_isOpen) return; // Evita múltiples aperturas
    setState(() => _isOpen = true);
    final ctx = routerNavigatorKey.currentContext ?? context;
    await DebugPanel.show(ctx);
    if (mounted) setState(() => _isOpen = false);
  }

  @override
  Widget build(BuildContext context) {
    return Positioned(
      bottom: MediaQuery.of(context).padding.bottom + 16,
      right: 12,
      child: GestureDetector(
        onTap: _handleTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
          decoration: BoxDecoration(
            color: _isOpen
                ? Colors.green.shade900.withValues(alpha: 0.95)
                : Colors.green.shade800.withValues(alpha: 0.9),
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(color: Colors.black.withValues(alpha: 0.25), blurRadius: 6, offset: const Offset(0, 2)),
            ],
          ),
          child: const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.developer_mode, size: 12, color: Colors.white),
              SizedBox(width: 4),
              Text(
                'DEV',
                style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 0.5),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
