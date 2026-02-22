import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/router/app_router.dart';
import 'core/theme/theme_provider.dart';

/// Widget raíz de la aplicación.
/// Conecta el router (GoRouter) con el sistema de temas (light/dark).
class App extends ConsumerWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    final themeMode = ref.watch(themeModeProvider);

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
