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
    // Inicializar NotificationHandler con el router y la key global.
    // Se hace en initState para que los listeners se registren solo una vez.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final router = ref.read(routerProvider);
      _notifHandler = NotificationHandler(
        router: router,
        navigatorKey: routerNavigatorKey,
      );
      _notifHandler!.init();
    });
  }

  @override
  Widget build(BuildContext context) {
    final router = ref.watch(routerProvider);
    final themeMode = ref.watch(themeModeProvider);

    // Escuchar cambios de auth para registrar/desregistrar token FCM.
    ref.listen<AsyncValue<AuthState>>(authNotifierProvider, (previous, next) {
      final prevState = previous?.valueOrNull;
      final nextState = next.valueOrNull;

      // Login exitoso → registrar token FCM
      if (nextState is Authenticated && prevState is! Authenticated) {
        ref.read(pushRegistrationNotifierProvider.notifier).register();
      }

      // Logout → desregistrar token FCM
      if (nextState is Unauthenticated && prevState is Authenticated) {
        ref.read(pushRegistrationNotifierProvider.notifier).unregister();
      }
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
class _DebugEnvBadge extends StatelessWidget {
  const _DebugEnvBadge();

  @override
  Widget build(BuildContext context) {
    return Positioned(
      bottom: MediaQuery.of(context).padding.bottom + 72,
      right: 12,
      child: SafeArea(
        child: GestureDetector(
          onTap: () => DebugPanel.show(context),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: Colors.green.shade800.withValues(alpha: 0.9),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.25),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.developer_mode, size: 12, color: Colors.white),
                SizedBox(width: 4),
                Text(
                  'DEV',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),    );
  }
}
