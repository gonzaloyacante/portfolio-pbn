import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/login_page.dart';
import '../../features/dashboard/presentation/dashboard_page.dart';
import 'route_names.dart';

// ── Provider ──────────────────────────────────────────────────────────────────

/// Instancia global del router. Se reevalúa cuando el estado de auth cambia.
final routerProvider = Provider<GoRouter>((ref) {
  return AppRouter.create(ref);
});

// ── Router ────────────────────────────────────────────────────────────────────

class AppRouter {
  AppRouter._();

  static GoRouter create(Ref ref) {
    return GoRouter(
      initialLocation: RoutePaths.login,
      debugLogDiagnostics: false,
      redirect: _guard,
      routes: _routes,
    );
  }

  // ── Guard de autenticación ────────────────────────────────────────────────
  static String? _guard(BuildContext context, GoRouterState state) {
    // TODO (Fase 2): Implementar guard con authProvider
    // Por ahora deja pasar todo — se implementa en Fase 4 (Auth).
    return null;
  }

  // ── Definición de rutas ───────────────────────────────────────────────────
  static final List<RouteBase> _routes = [
    GoRoute(
      path: RoutePaths.login,
      name: RouteNames.login,
      builder: (context, state) => const LoginPage(),
    ),
    GoRoute(
      path: RoutePaths.dashboard,
      name: RouteNames.dashboard,
      builder: (context, state) => const DashboardPage(),
    ),
    // TODO (Fases 5–10): Agregar rutas de proyectos, categorías, servicios,
    // testimonios, contactos, calendario, settings, papelera, cuenta, ayuda.
  ];
}
