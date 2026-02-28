import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/router/route_names.dart';
import '../../core/theme/app_breakpoints.dart';
import '../../core/theme/app_radius.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import '../../features/dashboard/providers/dashboard_provider.dart';

// ── NavItem ───────────────────────────────────────────────────────────────────

class _NavItem {
  const _NavItem({
    required this.routeName,
    required this.icon,
    required this.selectedIcon,
    required this.label,
    this.isMainNav = false,
  });

  final String routeName;
  final IconData icon;
  final IconData selectedIcon;
  final String label;

  /// Si `true`, aparece en la barra de navegación inferior (móvil).
  final bool isMainNav;
}

// ── Navigation Items ──────────────────────────────────────────────────────────

const List<_NavItem> _allNavItems = [
  _NavItem(
    routeName: RouteNames.dashboard,
    icon: Icons.dashboard_outlined,
    selectedIcon: Icons.dashboard,
    label: 'Dashboard',
    isMainNav: true,
  ),
  _NavItem(
    routeName: RouteNames.projects,
    icon: Icons.photo_library_outlined,
    selectedIcon: Icons.photo_library,
    label: 'Proyectos',
    isMainNav: true,
  ),
  _NavItem(
    routeName: RouteNames.categories,
    icon: Icons.category_outlined,
    selectedIcon: Icons.category,
    label: 'Categorías',
  ),
  _NavItem(
    routeName: RouteNames.services,
    icon: Icons.design_services_outlined,
    selectedIcon: Icons.design_services,
    label: 'Servicios',
  ),
  _NavItem(
    routeName: RouteNames.testimonials,
    icon: Icons.star_outline,
    selectedIcon: Icons.star,
    label: 'Testimonios',
  ),
  _NavItem(
    routeName: RouteNames.contacts,
    icon: Icons.mail_outline,
    selectedIcon: Icons.mail,
    label: 'Contactos',
    isMainNav: true,
  ),
  _NavItem(
    routeName: RouteNames.calendar,
    icon: Icons.calendar_month_outlined,
    selectedIcon: Icons.calendar_month,
    label: 'Agenda',
    isMainNav: true,
  ),
  _NavItem(
    routeName: RouteNames.settings,
    icon: Icons.settings_outlined,
    selectedIcon: Icons.settings,
    label: 'Ajustes del Sitio',
  ),
  _NavItem(
    routeName: RouteNames.appSettings,
    icon: Icons.tune_outlined,
    selectedIcon: Icons.tune,
    label: 'Preferencias',
  ),
  _NavItem(
    routeName: RouteNames.trash,
    icon: Icons.delete_outline,
    selectedIcon: Icons.delete,
    label: 'Papelera',
  ),
  _NavItem(
    routeName: RouteNames.account,
    icon: Icons.person_outline,
    selectedIcon: Icons.person,
    label: 'Mi cuenta',
  ),
];

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
class AppScaffold extends StatelessWidget {
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
  Widget build(BuildContext context) {
    if (AppBreakpoints.isExpanded(context)) {
      return _ExpandedScaffold(
        title: title,
        actions: actions,
        floatingActionButton: floatingActionButton,
        floatingActionButtonLocation: floatingActionButtonLocation,
        resizeToAvoidBottomInset: resizeToAvoidBottomInset,
        body: body,
      );
    }

    if (AppBreakpoints.isMedium(context)) {
      return _MediumScaffold(
        title: title,
        actions: actions,
        floatingActionButton: floatingActionButton,
        floatingActionButtonLocation: floatingActionButtonLocation,
        resizeToAvoidBottomInset: resizeToAvoidBottomInset,
        body: body,
      );
    }

    return _CompactScaffold(
      title: title,
      actions: actions,
      floatingActionButton: floatingActionButton,
      floatingActionButtonLocation: floatingActionButtonLocation,
      resizeToAvoidBottomInset: resizeToAvoidBottomInset,
      body: body,
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
          const AppDrawer(),
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
          _AppNavigationRail(),
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
      drawer: const AppDrawer(),
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
    final stats = ref.watch(dashboardStatsProvider).value;
    final badgeCounts = <String, int>{
      if (stats != null && stats.newContacts > 0)
        RouteNames.contacts: stats.newContacts,
      if (stats != null && stats.pendingBookings > 0)
        RouteNames.calendar: stats.pendingBookings,
    };

    // Índice activo entre todos los items
    final activeIndex = _allNavItems.indexWhere(
      (item) => item.routeName == currentRoute,
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
      destinations: _allNavItems
          .map(
            (item) {
              final count = badgeCounts[item.routeName] ?? 0;
              return NavigationRailDestination(
                icon: Tooltip(
                  message: item.label,
                  preferBelow: false,
                  child: count > 0
                      ? Badge.count(
                          count: count,
                          child: Icon(item.icon),
                        )
                      : Icon(item.icon),
                ),
                selectedIcon: Tooltip(
                  message: item.label,
                  preferBelow: false,
                  child: count > 0
                      ? Badge.count(
                          count: count,
                          child: Icon(item.selectedIcon),
                        )
                      : Icon(item.selectedIcon),
                ),
                label: Text(item.label),
                padding: const EdgeInsets.symmetric(vertical: 2),
              );
            },
          )
          .toList(),
      onDestinationSelected: (index) {
        context.goNamed(_allNavItems[index].routeName);
      },
      groupAlignment: -1.0,
    );
  }
}

// ── AppDrawer ─────────────────────────────────────────────────────────────────

/// Drawer lateral de administración.
/// En expanded (≥840px) se usa como NavigationDrawer fijo; en compact/medium
/// como Drawer deslizable o botón en modal.
///
/// Muestra badges con contadores para Contactos (no leídos) y Agenda
/// (reservas pendientes) usando datos del [dashboardStatsProvider].
class AppDrawer extends ConsumerWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    final currentRoute = GoRouterState.of(context).name ?? '';
    final isExpanded = AppBreakpoints.isExpanded(context);

    // Badge counts — silently 0 if data isn't loaded yet
    final stats = ref.watch(dashboardStatsProvider).value;
    final badgeCounts = <String, int>{
      if (stats != null && stats.newContacts > 0)
        RouteNames.contacts: stats.newContacts,
      if (stats != null && stats.pendingBookings > 0)
        RouteNames.calendar: stats.pendingBookings,
    };

    final content = Container(
      width: AppBreakpoints.drawerWidth,
      color: colorScheme.surface,
      child: SafeArea(
        top: false,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header: logo + nombre
            _DrawerHeader(textTheme: textTheme, colorScheme: colorScheme),
            const Divider(height: 1),
            const SizedBox(height: AppSpacing.sm),

            // Items principales de navegación
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm),
                children: [
                  _SectionLabel(label: 'CONTENIDO'),
                  ..._buildItems(
                    context,
                    items: _allNavItems.sublist(0, 8),
                    currentRoute: currentRoute,
                    isExpanded: isExpanded,
                    badgeCounts: badgeCounts,
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  _SectionLabel(label: 'CONFIGURACIÓN'),
                  ..._buildItems(
                    context,
                    items: _allNavItems.sublist(8),
                    currentRoute: currentRoute,
                    isExpanded: isExpanded,
                    badgeCounts: badgeCounts,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );

    if (isExpanded) return content;

    return Drawer(child: content);
  }

  List<Widget> _buildItems(
    BuildContext context, {
    required List<_NavItem> items,
    required String currentRoute,
    required bool isExpanded,
    required Map<String, int> badgeCounts,
  }) {
    return items.map((item) {
      final isSelected = item.routeName == currentRoute;
      return _DrawerNavItem(
        item: item,
        isSelected: isSelected,
        isExpanded: isExpanded,
        badgeCount: badgeCounts[item.routeName] ?? 0,
        onTap: () {
          if (!isExpanded) Navigator.of(context).pop();
          context.goNamed(item.routeName);
        },
      );
    }).toList();
  }
}

// ── Sub-widgets del Drawer ────────────────────────────────────────────────────

class _DrawerHeader extends StatelessWidget {
  const _DrawerHeader({required this.textTheme, required this.colorScheme});

  final TextTheme textTheme;
  final ColorScheme colorScheme;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            colorScheme.primary.withValues(alpha: 0.12),
            colorScheme.primary.withValues(alpha: 0.04),
          ],
        ),
      ),
      padding: EdgeInsets.fromLTRB(
        AppSpacing.base,
        AppSpacing.xl + MediaQuery.of(context).padding.top,
        AppSpacing.base,
        AppSpacing.lg,
      ),
      child: Row(
        children: [
          Container(
            width: 46,
            height: 46,
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
                  fontSize: 24,
                ),
              ),
            ),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Paola BN',
                  style: textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 3),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.sm - 1,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: colorScheme.primary.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    'Admin',
                    style: textTheme.labelSmall?.copyWith(
                      color: colorScheme.primary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  const _SectionLabel({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(12, 12, 12, 4),
      child: Text(
        label,
        style: Theme.of(context).textTheme.labelSmall?.copyWith(
          color: Theme.of(context).colorScheme.outline,
          letterSpacing: 1.2,
        ),
      ),
    );
  }
}

class _DrawerNavItem extends StatelessWidget {
  const _DrawerNavItem({
    required this.item,
    required this.isSelected,
    required this.isExpanded,
    required this.onTap,
    this.badgeCount = 0,
  });

  final _NavItem item;
  final bool isSelected;
  final bool isExpanded;
  final VoidCallback onTap;
  final int badgeCount;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return ListTile(
      dense: true,
      shape: RoundedRectangleBorder(borderRadius: AppRadius.forTile),
      selected: isSelected,
      selectedTileColor: colorScheme.primaryContainer.withValues(alpha: 0.5),
      leading: Icon(
        isSelected ? item.selectedIcon : item.icon,
        color: isSelected ? colorScheme.primary : colorScheme.onSurfaceVariant,
        size: 22,
      ),
      title: Text(
        item.label,
        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
          color: isSelected ? colorScheme.primary : colorScheme.onSurface,
          fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
        ),
      ),
      trailing: badgeCount > 0
          ? Container(
              padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
              decoration: BoxDecoration(
                color: colorScheme.primary,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                badgeCount > 99 ? '99+' : badgeCount.toString(),
                style: Theme.of(context).textTheme.labelSmall?.copyWith(
                  color: colorScheme.onPrimary,
                  fontWeight: FontWeight.w600,
                  fontSize: 11,
                ),
              ),
            )
          : null,
      onTap: onTap,
    );
  }
}
