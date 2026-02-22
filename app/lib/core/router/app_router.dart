import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/login_page.dart';
import '../../features/dashboard/presentation/dashboard_page.dart';
import '../../features/projects/presentation/project_form_page.dart';
import '../../features/projects/presentation/projects_list_page.dart';
import '../auth/auth_provider.dart';
import '../auth/auth_state.dart';
import 'route_names.dart';

// ── Provider ──────────────────────────────────────────────────────────────────

/// Instancia global del router. GoRouter escucha [RouterNotifier] para
/// reevaluar las redirecciones cada vez que cambia el estado de autenticación.
final routerProvider = Provider<GoRouter>((ref) {
  final notifier = RouterNotifier(ref);
  ref.onDispose(notifier.dispose);

  return GoRouter(
    initialLocation: RoutePaths.login,
    debugLogDiagnostics: false,
    refreshListenable: notifier,
    redirect: notifier.redirect,
    routes: _routes,
  );
});

// ── RouterNotifier ───────────────────────────────────────────────────────────

/// [ChangeNotifier] que conecta Riverpod con el `refreshListenable` de GoRouter.
///
/// Cuando el estado de auth cambia (login/logout), notifica a GoRouter para
/// que reevalúe el guard de redirección.
class RouterNotifier extends ChangeNotifier {
  RouterNotifier(this._ref) {
    // Escuchar al authNotifierProvider y notificar al router ante cualquier cambio.
    _subscription = _ref.listen<AsyncValue<AuthState>>(
      authNotifierProvider,
      (_, _) => notifyListeners(),
    );
  }

  final Ref _ref;
  late final ProviderSubscription<AsyncValue<AuthState>> _subscription;

  @override
  void dispose() {
    _subscription.close();
    super.dispose();
  }

  // ── Guard de autenticación ────────────────────────────────────────────────

  /// Redirige según el estado de autenticación actual.
  ///
  /// - Mientras carga → null (sin redirigir, mostrar splash)
  /// - Autenticado + en login → /dashboard
  /// - No autenticado + fuera de login → /login
  String? redirect(BuildContext context, GoRouterState state) {
    final authAsync = _ref.read(authNotifierProvider);
    final isLoginRoute = state.matchedLocation == RoutePaths.login;

    // Mientras se restaura la sesión → no interrumpir.
    if (authAsync.isLoading) return null;

    final authState = authAsync.valueOrNull;

    // Estado de error o no autenticado → ir al login si no está ya ahí.
    if (authState == null ||
        authState is Unauthenticated ||
        authState is AuthError) {
      return isLoginRoute ? null : RoutePaths.login;
    }

    // Autenticando → sin redirigir (mostrar estado transitorio en login).
    if (authState is Authenticating) return null;

    // Autenticado → si está en login, ir al dashboard.
    if (authState is Authenticated) {
      return isLoginRoute ? RoutePaths.dashboard : null;
    }

    return null;
  }
}

// ── Rutas ─────────────────────────────────────────────────────────────────────

final List<RouteBase> _routes = [
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
  GoRoute(
    path: RoutePaths.projects,
    name: RouteNames.projects,
    builder: (context, state) => const ProjectsListPage(),
  ),
  GoRoute(
    path: RoutePaths.projectNew,
    name: RouteNames.projectNew,
    builder: (context, state) => const ProjectFormPage(),
  ),
  GoRoute(
    path: RoutePaths.projectEdit,
    name: RouteNames.projectEdit,
    builder: (context, state) =>
        ProjectFormPage(projectId: state.pathParameters['id']),
  ),
  // TODO (Fases 7–10): Agregar rutas de categorías, servicios,
  // testimonios, contactos, calendario, settings, papelera, cuenta, ayuda.
];
