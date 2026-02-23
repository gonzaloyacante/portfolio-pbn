import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/auth/auth_provider.dart';
import 'core/auth/auth_state.dart';
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
    );
  }
}
