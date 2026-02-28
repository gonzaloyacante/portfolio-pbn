import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../features/app_settings/presentation/app_settings_page.dart';
import '../../features/account/presentation/account_page.dart';
import '../../features/auth/presentation/login_page.dart';
import '../../features/auth/presentation/splash_page.dart';
import '../../features/help/presentation/help_page.dart';
import '../../features/trash/presentation/trash_page.dart';
import '../../features/categories/presentation/categories_list_page.dart';
import '../../features/categories/presentation/category_form_page.dart';
import '../../features/dashboard/presentation/dashboard_page.dart';
import '../../features/projects/presentation/project_form_page.dart';
import '../../features/projects/presentation/projects_list_page.dart';
import '../../features/calendar/presentation/booking_detail_page.dart';
import '../../features/calendar/presentation/booking_form_page.dart';
import '../../features/calendar/presentation/calendar_page.dart';
import '../../features/contacts/presentation/contact_detail_page.dart';
import '../../features/contacts/presentation/contacts_list_page.dart';
import '../../features/settings/presentation/settings_home_page.dart';
import '../../features/settings/presentation/settings_about_page.dart';
import '../../features/settings/presentation/settings_contact_page.dart';
import '../../features/settings/presentation/settings_page.dart';
import '../../features/settings/presentation/settings_site_page.dart';
import '../../features/settings/presentation/settings_social_page.dart';
import '../../features/settings/presentation/settings_theme_page.dart';
import '../../features/services/presentation/service_form_page.dart';
import '../../features/services/presentation/services_list_page.dart';
import '../../features/testimonials/presentation/testimonial_form_page.dart';
import '../../features/testimonials/presentation/testimonials_list_page.dart';
import '../auth/auth_provider.dart';
import '../auth/auth_state.dart';
import 'route_names.dart';

// ── Provider ──────────────────────────────────────────────────────────────────

/// Clave global del NavigatorState raíz del router.
/// Usada por [NotificationHandler] para navegar sin BuildContext.
final GlobalKey<NavigatorState> routerNavigatorKey = GlobalKey<NavigatorState>(
  debugLabel: 'rootNavigator',
);

/// Señal que indica si la animación de splash terminó. El router espera
/// a que sea true antes de redirigir desde la ruta de splash.
final ValueNotifier<bool> splashAnimationFinished = ValueNotifier<bool>(false);

/// Instancia global del router. GoRouter escucha [RouterNotifier] para
/// reevaluar las redirecciones cada vez que cambia el estado de autenticación.
final routerProvider = Provider<GoRouter>((ref) {
  final notifier = RouterNotifier(ref);
  ref.onDispose(notifier.dispose);

  return GoRouter(
    navigatorKey: routerNavigatorKey,
    initialLocation: RoutePaths.splash,
    debugLogDiagnostics: false,
    observers: [SentryNavigatorObserver()],
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
    // Escuchar al authProvider y notificar al router ante cualquier cambio.
    _subscription = _ref.listen<AsyncValue<AuthState>>(
      authProvider,
      (_, _) => notifyListeners(),
    );
    // Escuchar la señal de animación del splash para forzar reevaluación
    splashAnimationFinished.addListener(notifyListeners);
  }

  final Ref _ref;
  late final ProviderSubscription<AsyncValue<AuthState>> _subscription;

  @override
  void dispose() {
    _subscription.close();
    splashAnimationFinished.removeListener(notifyListeners);
    super.dispose();
  }

  // ── Guard de autenticación ────────────────────────────────────────────────

  /// Redirige según el estado de autenticación actual.
  ///
  /// - Mientras carga → null (sin redirigir, mostrar splash)
  /// - Autenticado + en login → /dashboard
  /// - No autenticado + fuera de login → /login
  String? redirect(BuildContext context, GoRouterState state) {
    final authAsync = _ref.read(authProvider);
    final isLoginRoute = state.matchedLocation == RoutePaths.login;
    final isSplashRoute = state.matchedLocation == RoutePaths.splash;

    // Mientras se restaura la sesión → no interrumpir.
    if (authAsync.isLoading) return null;

    // Si todavía no terminó la animación del splash y estamos en la ruta
    // splash, esperar antes de redirigir.
    if (!splashAnimationFinished.value && isSplashRoute) return null;

    final authState = authAsync.whenOrNull(data: (v) => v);

    // Estado de error o no autenticado → ir al login si no está ya ahí.
    if (authState == null ||
        authState is Unauthenticated ||
        authState is AuthError) {
      return isLoginRoute ? null : RoutePaths.login;
    }

    // Autenticando → sin redirigir (mostrar estado transitorio en login).
    if (authState is Authenticating) return null;

    // Autenticado → si está en login o en splash, ir al dashboard.
    if (authState is Authenticated) {
      return (isLoginRoute || isSplashRoute) ? RoutePaths.dashboard : null;
    }

    return null;
  }
}

// ── Helpers de transición ─────────────────────────────────────────────────────

/// Página con transición de fade suave (200 ms) para formularios y detalles.
CustomTransitionPage<void> _fadePage({
  required GoRouterState state,
  required Widget child,
}) => CustomTransitionPage<void>(
  key: state.pageKey,
  child: child,
  transitionDuration: const Duration(milliseconds: 200),
  transitionsBuilder: (context, animation, secondaryAnimation, child) =>
      FadeTransition(opacity: animation, child: child),
);

// ── Rutas ─────────────────────────────────────────────────────────────────────

final List<RouteBase> _routes = [
  GoRoute(
    path: RoutePaths.splash,
    name: RouteNames.splash,
    builder: (context, state) => const SplashPage(),
  ),
  GoRoute(
    path: RoutePaths.login,
    name: RouteNames.login,
    builder: (context, state) => const LoginPage(),
  ),
  GoRoute(
    path: RoutePaths.dashboard,
    name: RouteNames.dashboard,
    pageBuilder: (context, state) =>
        _fadePage(state: state, child: const DashboardPage()),
  ),
  GoRoute(
    path: RoutePaths.projects,
    name: RouteNames.projects,
    pageBuilder: (context, state) =>
        _fadePage(state: state, child: const ProjectsListPage()),
  ),
  GoRoute(
    path: RoutePaths.projectNew,
    name: RouteNames.projectNew,
    pageBuilder: (context, state) =>
        _fadePage(state: state, child: const ProjectFormPage()),
  ),
  GoRoute(
    path: RoutePaths.projectEdit,
    name: RouteNames.projectEdit,
    pageBuilder: (context, state) => _fadePage(
      state: state,
      child: ProjectFormPage(projectId: state.pathParameters['id']),
    ),
  ),
  // ── Categorías ────────────────────────────────────────────────────────────
  GoRoute(
    path: RoutePaths.categories,
    name: RouteNames.categories,
    pageBuilder: (context, state) =>
        _fadePage(state: state, child: const CategoriesListPage()),
  ),
  GoRoute(
    path: RoutePaths.categoryNew,
    name: RouteNames.categoryNew,
    pageBuilder: (context, state) =>
        _fadePage(state: state, child: const CategoryFormPage()),
  ),
  GoRoute(
    path: RoutePaths.categoryEdit,
    name: RouteNames.categoryEdit,
    pageBuilder: (context, state) => _fadePage(
      state: state,
      child: CategoryFormPage(categoryId: state.pathParameters['id']),
    ),
  ),
  // ── Servicios ────────────────────────────────────────────────────────────
  GoRoute(
    path: RoutePaths.services,
    name: RouteNames.services,
    pageBuilder: (context, state) =>
        _fadePage(state: state, child: const ServicesListPage()),
  ),
  GoRoute(
    path: RoutePaths.serviceNew,
    name: RouteNames.serviceNew,
    pageBuilder: (context, state) =>
        _fadePage(state: state, child: const ServiceFormPage()),
  ),
  GoRoute(
    path: RoutePaths.serviceEdit,
    name: RouteNames.serviceEdit,
    pageBuilder: (context, state) => _fadePage(
      state: state,
      child: ServiceFormPage(serviceId: state.pathParameters['id']),
    ),
  ),
  // ── Testimonios ───────────────────────────────────────────────────────────
  GoRoute(
    path: RoutePaths.testimonials,
    name: RouteNames.testimonials,
    pageBuilder: (context, state) =>
        _fadePage(state: state, child: const TestimonialsListPage()),
  ),
  GoRoute(
    path: RoutePaths.testimonialNew,
    name: RouteNames.testimonialNew,
    pageBuilder: (context, state) =>
        _fadePage(state: state, child: const TestimonialFormPage()),
  ),
  GoRoute(
    path: RoutePaths.testimonialEdit,
    name: RouteNames.testimonialEdit,
    pageBuilder: (context, state) => _fadePage(
      state: state,
      child: TestimonialFormPage(testimonialId: state.pathParameters['id']),
    ),
  ),
  // ── Contactos ─────────────────────────────────────────────────────────────
  GoRoute(
    path: RoutePaths.contacts,
    name: RouteNames.contacts,
    pageBuilder: (context, state) =>
        _fadePage(state: state, child: const ContactsListPage()),
  ),
  GoRoute(
    path: RoutePaths.contactDetail,
    name: RouteNames.contactDetail,
    pageBuilder: (context, state) => _fadePage(
      state: state,
      child: ContactDetailPage(contactId: state.pathParameters['id']!),
    ),
  ),
  // ── Calendario / Reservas ─────────────────────────────────────────────────
  GoRoute(
    path: RoutePaths.calendar,
    name: RouteNames.calendar,
    pageBuilder: (context, state) =>
        _fadePage(state: state, child: const CalendarPage()),
  ),
  GoRoute(
    path: RoutePaths.bookingNew,
    name: RouteNames.bookingNew,
    pageBuilder: (context, state) =>
        _fadePage(state: state, child: const BookingFormPage()),
  ),
  GoRoute(
    path: RoutePaths.bookingDetail,
    name: RouteNames.bookingDetail,
    pageBuilder: (context, state) => _fadePage(
      state: state,
      child: BookingDetailPage(bookingId: state.pathParameters['id']!),
    ),
  ),
  // ── Settings ──────────────────────────────────────────────────────────────
  GoRoute(
    path: RoutePaths.settings,
    name: RouteNames.settings,
    pageBuilder: (context, state) =>
        _fadePage(state: state, child: const SettingsPage()),
  ),
  GoRoute(
    path: RoutePaths.settingsHome,
    name: RouteNames.settingsHome,
    pageBuilder: (context, state) =>
        _fadePage(state: state, child: const SettingsHomePage()),
  ),
  GoRoute(
    path: RoutePaths.settingsAbout,
    name: RouteNames.settingsAbout,
    pageBuilder: (context, state) =>
        _fadePage(state: state, child: const SettingsAboutPage()),
  ),
  GoRoute(
    path: RoutePaths.settingsContact,
    name: RouteNames.settingsContact,
    pageBuilder: (context, state) =>
        _fadePage(state: state, child: const SettingsContactPage()),
  ),
  GoRoute(
    path: RoutePaths.settingsTheme,
    name: RouteNames.settingsTheme,
    pageBuilder: (context, state) =>
        _fadePage(state: state, child: const SettingsThemePage()),
  ),
  GoRoute(
    path: RoutePaths.settingsSite,
    name: RouteNames.settingsSite,
    pageBuilder: (context, state) =>
        _fadePage(state: state, child: const SettingsSitePage()),
  ),
  GoRoute(
    path: RoutePaths.settingsSocial,
    name: RouteNames.settingsSocial,
    pageBuilder: (context, state) =>
        _fadePage(state: state, child: const SettingsSocialPage()),
  ),
  // ── Cuenta ────────────────────────────────────────────────────────────────
  GoRoute(
    path: RoutePaths.account,
    name: RouteNames.account,
    pageBuilder: (context, state) =>
        _fadePage(state: state, child: const AccountPage()),
  ),
  // ── Papelera ──────────────────────────────────────────────────────────────
  GoRoute(
    path: RoutePaths.trash,
    name: RouteNames.trash,
    pageBuilder: (context, state) =>
        _fadePage(state: state, child: const TrashPage()),
  ),
  // ── Ayuda ───────────────────────────────────────────────────────────────
  GoRoute(
    path: RoutePaths.help,
    name: RouteNames.help,
    pageBuilder: (context, state) =>
        _fadePage(state: state, child: const HelpPage()),
  ),
  // ── Preferencias de la App ───────────────────────────────────────────────
  GoRoute(
    path: RoutePaths.appSettings,
    name: RouteNames.appSettings,
    pageBuilder: (context, state) =>
        _fadePage(state: state, child: const AppSettingsPage()),
  ),
];
