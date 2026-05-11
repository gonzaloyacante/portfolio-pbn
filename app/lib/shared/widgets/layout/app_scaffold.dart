import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/network/connectivity_provider.dart';
import '../../../core/router/route_names.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../features/dashboard/providers/dashboard_provider.dart';
import '../feedback/offline_connectivity_banner.dart';
import 'app_drawer.dart';
import 'nav_items.dart';

// ── AppScaffold ───────────────────────────────────────────────────────────────

/// Scaffold adaptativo de la app de administración.
///
/// - **Compact (<600px)**: Drawer deslizable con hamburger en AppBar.
/// - **Medium (600-839px)**: NavigationRail fijo (72px, íconos + tooltip).
/// - **Expanded (≥840px)**: Drawer persistente lateral (280px).
///
/// Uso:
/// ```dart
/// AppScaffold(
///   title: 'Dashboard',
///   actions: [IconButton(...)],
///   body: MyPage(),
/// )
/// ```
///
/// Cuando [isOnlineProvider] es false, muestra [OfflineConnectivityBanner] encima del body.
class AppScaffold extends ConsumerWidget {
  const AppScaffold({
    super.key,
    required this.body,
    this.title,
    this.actions,
    this.floatingActionButton,
    this.floatingActionButtonLocation,
    this.resizeToAvoidBottomInset = true,
  });

  final Widget body;
  final String? title;
  final List<Widget>? actions;
  final Widget? floatingActionButton;
  final FloatingActionButtonLocation? floatingActionButtonLocation;
  final bool resizeToAvoidBottomInset;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final online = ref.watch(isOnlineProvider);
    final wrappedBody = online
        ? body
        : Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const OfflineConnectivityBanner(),
              Expanded(child: body),
            ],
          );

    Widget child;
    if (AppBreakpoints.isExpanded(context)) {
      child = _ExpandedScaffold(
        title: title,
        actions: actions,
        floatingActionButton: floatingActionButton,
        floatingActionButtonLocation: floatingActionButtonLocation,
        resizeToAvoidBottomInset: resizeToAvoidBottomInset,
        body: wrappedBody,
      );
    } else if (AppBreakpoints.isMedium(context)) {
      child = _MediumScaffold(
        title: title,
        actions: actions,
        floatingActionButton: floatingActionButton,
        floatingActionButtonLocation: floatingActionButtonLocation,
        resizeToAvoidBottomInset: resizeToAvoidBottomInset,
        body: wrappedBody,
      );
    } else {
      child = _CompactScaffold(
        title: title,
        actions: actions,
        floatingActionButton: floatingActionButton,
        floatingActionButtonLocation: floatingActionButtonLocation,
        resizeToAvoidBottomInset: resizeToAvoidBottomInset,
        body: wrappedBody,
      );
    }

    // Allow natural GoRouter pop for pushed routes (e.g. gallery page).
    // Only intercept when canPop is false (root-level pages).
    final canGoBack = GoRouter.of(context).canPop();
    return PopScope(
      canPop: canGoBack,
      onPopInvokedWithResult: (didPop, _) async {
        if (didPop) return;
        // Evaluate route at callback time — avoids subscribing scaffold to route changes
        final isOnDashboard =
            GoRouterState.of(context).name == RouteNames.dashboard;
        if (!isOnDashboard) {
          context.goNamed(RouteNames.dashboard);
          return;
        }
        // En dashboard → pedir confirmación para salir
        final exit = await showDialog<bool>(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('¿Salir de la app?'),
            content: const Text('¿Deseas cerrar la aplicación?'),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(ctx).pop(false),
                child: const Text('Cancelar'),
              ),
              FilledButton(
                onPressed: () => Navigator.of(ctx).pop(true),
                child: const Text('Salir'),
              ),
            ],
          ),
        );
        if (exit ?? false) {
          SystemNavigator.pop();
        }
      },
      child: child,
    );
  }
}

// ── _ExpandedScaffold (≥840px) ────────────────────────────────────────────────

class _ExpandedScaffold extends StatelessWidget {
  const _ExpandedScaffold({
    required this.body,
    this.title,
    this.actions,
    this.floatingActionButton,
    this.floatingActionButtonLocation,
    this.resizeToAvoidBottomInset = true,
  });

  final Widget body;
  final String? title;
  final List<Widget>? actions;
  final Widget? floatingActionButton;
  final FloatingActionButtonLocation? floatingActionButtonLocation;
  final bool resizeToAvoidBottomInset;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: resizeToAvoidBottomInset,
      floatingActionButton: floatingActionButton,
      floatingActionButtonLocation: floatingActionButtonLocation,
      body: Row(
        children: [
          const RepaintBoundary(child: AppDrawer()),
          VerticalDivider(
            width: 1,
            thickness: 1,
            color: Theme.of(context).colorScheme.outline.withValues(alpha: 0.2),
          ),
          Expanded(
            child: Scaffold(
              resizeToAvoidBottomInset: resizeToAvoidBottomInset,
              appBar: title != null
                  ? AppBar(
                      leading: GoRouter.of(context).canPop()
                          ? IconButton(
                              icon: const Icon(
                                Icons.arrow_back_ios_new_rounded,
                              ),
                              onPressed: () => context.pop(),
                              tooltip: 'Volver',
                            )
                          : null,
                      automaticallyImplyLeading: false,
                      title: Text(title!),
                      actions: actions,
                    )
                  : null,
              body: body,
            ),
          ),
        ],
      ),
    );
  }
}

// ── _MediumScaffold (600-839px) ───────────────────────────────────────────────

class _MediumScaffold extends StatelessWidget {
  const _MediumScaffold({
    required this.body,
    this.title,
    this.actions,
    this.floatingActionButton,
    this.floatingActionButtonLocation,
    this.resizeToAvoidBottomInset = true,
  });

  final Widget body;
  final String? title;
  final List<Widget>? actions;
  final Widget? floatingActionButton;
  final FloatingActionButtonLocation? floatingActionButtonLocation;
  final bool resizeToAvoidBottomInset;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: resizeToAvoidBottomInset,
      floatingActionButton: floatingActionButton,
      floatingActionButtonLocation: floatingActionButtonLocation,
      body: Row(
        children: [
          RepaintBoundary(child: _AppNavigationRail()),
          VerticalDivider(
            width: 1,
            thickness: 1,
            color: Theme.of(context).colorScheme.outline.withValues(alpha: 0.2),
          ),
          Expanded(
            child: Scaffold(
              resizeToAvoidBottomInset: resizeToAvoidBottomInset,
              appBar: title != null
                  ? AppBar(
                      leading: GoRouter.of(context).canPop()
                          ? IconButton(
                              icon: const Icon(
                                Icons.arrow_back_ios_new_rounded,
                              ),
                              onPressed: () => context.pop(),
                              tooltip: 'Volver',
                            )
                          : null,
                      automaticallyImplyLeading: false,
                      title: Text(title!),
                      actions: actions,
                    )
                  : null,
              body: body,
            ),
          ),
        ],
      ),
    );
  }
}

// ── _CompactScaffold (<600px) ─────────────────────────────────────────────────

class _CompactScaffold extends StatefulWidget {
  const _CompactScaffold({
    required this.body,
    this.title,
    this.actions,
    this.floatingActionButton,
    this.floatingActionButtonLocation,
    this.resizeToAvoidBottomInset = true,
  });

  final Widget body;
  final String? title;
  final List<Widget>? actions;
  final Widget? floatingActionButton;
  final FloatingActionButtonLocation? floatingActionButtonLocation;
  final bool resizeToAvoidBottomInset;

  @override
  State<_CompactScaffold> createState() => _CompactScaffoldState();
}

class _CompactScaffoldState extends State<_CompactScaffold> {
  final _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    final canPop = GoRouter.of(context).canPop();

    return Scaffold(
      key: _scaffoldKey,
      resizeToAvoidBottomInset: widget.resizeToAvoidBottomInset,
      floatingActionButton: widget.floatingActionButton,
      floatingActionButtonLocation: widget.floatingActionButtonLocation,
      appBar: widget.title != null
          ? AppBar(
              leading: canPop
                  ? IconButton(
                      icon: const Icon(Icons.arrow_back_ios_new_rounded),
                      onPressed: () => context.pop(),
                      tooltip: 'Volver',
                    )
                  : IconButton(
                      icon: const Icon(Icons.menu_rounded),
                      onPressed: () => _scaffoldKey.currentState?.openDrawer(),
                      tooltip: 'Menú',
                    ),
              automaticallyImplyLeading: false,
              title: Text(widget.title!),
              actions: widget.actions,
            )
          : null,
      body: widget.body,
      drawer: const RepaintBoundary(child: AppDrawer()),
    );
  }
}

// ── _AppNavigationRail ────────────────────────────────────────────────────────

/// NavigationRail para breakpoint medium (600-839px).
/// Muestra íconos con tooltip y resalta la sección activa.
/// Incluye badges con contadores para Contactos y Agenda.
class _AppNavigationRail extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colorScheme = Theme.of(context).colorScheme;
    final currentRoute = GoRouterState.of(context).name ?? '';

    // Badge counts
    final pendingBookings = ref.watch(
      dashboardStatsProvider.select((v) => v.value?.pendingBookings ?? 0),
    );
    final newContacts = ref.watch(
      dashboardStatsProvider.select((v) => v.value?.newContacts ?? 0),
    );
    final badgeCounts = <String, int>{
      if (newContacts > 0) RouteNames.contacts: newContacts,
      if (pendingBookings > 0) RouteNames.calendar: pendingBookings,
    };

    // Índice activo entre todos los items (soporta sub-rutas)
    final activeIndex = kAppNavItems.indexWhere(
      (item) => item.isActive(currentRoute),
    );

    return NavigationRail(
      backgroundColor: colorScheme.surface,
      selectedIndex: activeIndex < 0 ? null : activeIndex,
      useIndicator: true,
      indicatorColor: colorScheme.primaryContainer,
      minWidth: AppBreakpoints.railWidth,
      labelType: NavigationRailLabelType.none,
      leading: Padding(
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.base),
        child: Tooltip(
          message: 'Menú',
          child: Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  colorScheme.primary,
                  colorScheme.primary.withValues(alpha: 0.75),
                ],
              ),
              borderRadius: AppRadius.forIconContainer,
              boxShadow: [
                BoxShadow(
                  color: colorScheme.primary.withValues(alpha: 0.3),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Center(
              child: Text(
                'P',
                style: AppTypography.decorativeTitle(
                  Colors.white,
                  fontSize: 20,
                ),
              ),
            ),
          ),
        ),
      ),
      destinations: kAppNavItems.map((item) {
        final count = badgeCounts[item.routeName] ?? 0;
        return NavigationRailDestination(
          icon: Tooltip(
            message: item.label,
            preferBelow: false,
            child: count > 0
                ? Badge.count(count: count, child: Icon(item.icon))
                : Icon(item.icon),
          ),
          selectedIcon: Tooltip(
            message: item.label,
            preferBelow: false,
            child: count > 0
                ? Badge.count(count: count, child: Icon(item.selectedIcon))
                : Icon(item.selectedIcon),
          ),
          label: Text(item.label),
          padding: const EdgeInsets.symmetric(vertical: 2),
        );
      }).toList(),
      onDestinationSelected: (index) {
        context.goNamed(kAppNavItems[index].routeName);
      },
      groupAlignment: -1.0,
    );
  }
}

// ── AppDrawer ─────────────────────────────────────────────────────────────────
