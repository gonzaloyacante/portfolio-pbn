import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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
    this.childRoutes = const [],
    this.children = const [],
  });

  final String routeName;
  final IconData icon;
  final IconData selectedIcon;
  final String label;

  /// Si `true`, aparece en la barra de navegación inferior (móvil).
  final bool isMainNav;

  /// Rutas hijas que activan el highlight del padre (ej. project-new → projects).
  final List<String> childRoutes;

  /// Sub-items de navegación anidada (se muestran expandibles en el drawer).
  final List<_NavItem> children;

  /// Devuelve `true` si este item o alguna subruta coincide con [currentRoute].
  bool isActive(String currentRoute) {
    if (routeName == currentRoute) return true;
    if (childRoutes.contains(currentRoute)) return true;
    return children.any((c) => c.routeName == currentRoute);
  }
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
    childRoutes: [RouteNames.projectNew, RouteNames.projectEdit],
  ),
  _NavItem(
    routeName: RouteNames.categories,
    icon: Icons.category_outlined,
    selectedIcon: Icons.category,
    label: 'Categorías',
    childRoutes: [RouteNames.categoryNew, RouteNames.categoryEdit],
  ),
  _NavItem(
    routeName: RouteNames.services,
    icon: Icons.design_services_outlined,
    selectedIcon: Icons.design_services,
    label: 'Servicios',
    childRoutes: [RouteNames.serviceNew, RouteNames.serviceEdit],
  ),
  _NavItem(
    routeName: RouteNames.testimonials,
    icon: Icons.star_outline,
    selectedIcon: Icons.star,
    label: 'Testimonios',
    childRoutes: [RouteNames.testimonialNew, RouteNames.testimonialEdit],
  ),
  _NavItem(
    routeName: RouteNames.contacts,
    icon: Icons.mail_outline,
    selectedIcon: Icons.mail,
    label: 'Contactos',
    isMainNav: true,
    childRoutes: [RouteNames.contactDetail],
  ),
  _NavItem(
    routeName: RouteNames.calendar,
    icon: Icons.calendar_month_outlined,
    selectedIcon: Icons.calendar_month,
    label: 'Agenda',
    isMainNav: true,
    childRoutes: [RouteNames.bookingNew, RouteNames.bookingDetail],
  ),
  _NavItem(
    routeName: RouteNames.settings,
    icon: Icons.settings_outlined,
    selectedIcon: Icons.settings,
    label: 'Ajustes del Sitio',
    children: [
      _NavItem(
        routeName: RouteNames.settingsHome,
        icon: Icons.home_outlined,
        selectedIcon: Icons.home,
        label: 'Inicio',
      ),
      _NavItem(
        routeName: RouteNames.settingsAbout,
        icon: Icons.person_outline,
        selectedIcon: Icons.person,
        label: 'Sobre mí',
      ),
      _NavItem(
        routeName: RouteNames.settingsContact,
        icon: Icons.contact_page_outlined,
        selectedIcon: Icons.contact_page,
        label: 'Contacto',
      ),
      _NavItem(
        routeName: RouteNames.settingsTheme,
        icon: Icons.palette_outlined,
        selectedIcon: Icons.palette,
        label: 'Tema',
      ),
      _NavItem(
        routeName: RouteNames.settingsSite,
        icon: Icons.language_outlined,
        selectedIcon: Icons.language,
        label: 'Sitio',
      ),
      _NavItem(
        routeName: RouteNames.settingsSocial,
        icon: Icons.share_outlined,
        selectedIcon: Icons.share,
        label: 'Redes Sociales',
      ),
    ],
  ),
  _NavItem(
    routeName: RouteNames.trash,
    icon: Icons.delete_outline,
    selectedIcon: Icons.delete,
    label: 'Papelera',
    childRoutes: [RouteNames.trashDetail],
  ),
  _NavItem(
    routeName: RouteNames.appSettings,
    icon: Icons.tune_outlined,
    selectedIcon: Icons.tune,
    label: 'Preferencias',
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
    final currentRoute = GoRouterState.of(context).name ?? '';
    final isOnDashboard = currentRoute == RouteNames.dashboard;

    Widget child;
    if (AppBreakpoints.isExpanded(context)) {
      child = _ExpandedScaffold(
        title: title,
        actions: actions,
        floatingActionButton: floatingActionButton,
        floatingActionButtonLocation: floatingActionButtonLocation,
        resizeToAvoidBottomInset: resizeToAvoidBottomInset,
        body: body,
      );
    } else if (AppBreakpoints.isMedium(context)) {
      child = _MediumScaffold(
        title: title,
        actions: actions,
        floatingActionButton: floatingActionButton,
        floatingActionButtonLocation: floatingActionButtonLocation,
        resizeToAvoidBottomInset: resizeToAvoidBottomInset,
        body: body,
      );
    } else {
      child = _CompactScaffold(
        title: title,
        actions: actions,
        floatingActionButton: floatingActionButton,
        floatingActionButtonLocation: floatingActionButtonLocation,
        resizeToAvoidBottomInset: resizeToAvoidBottomInset,
        body: body,
      );
    }

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) async {
        if (didPop) return;
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

    // Índice activo entre todos los items (soporta sub-rutas)
    final activeIndex = _allNavItems.indexWhere(
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
      destinations: _allNavItems.map((item) {
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
                  const _SectionLabel(label: 'CONTENIDO'),
                  ..._buildItems(
                    context,
                    items: _allNavItems.sublist(0, 9),
                    currentRoute: currentRoute,
                    isExpanded: isExpanded,
                    badgeCounts: badgeCounts,
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  const _SectionLabel(label: 'CONFIGURACIÓN'),
                  ..._buildItems(
                    context,
                    items: _allNavItems.sublist(9),
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
      final isSelected = item.isActive(currentRoute);

      // Si tiene children → expandable group
      if (item.children.isNotEmpty) {
        return _DrawerExpandableItem(
          item: item,
          isSelected: isSelected,
          isExpanded: isExpanded,
          currentRoute: currentRoute,
          onChildTap: (child) {
            if (!isExpanded) Navigator.of(context).pop();
            context.goNamed(child.routeName);
          },
          onTap: () {
            if (!isExpanded) Navigator.of(context).pop();
            context.goNamed(item.routeName);
          },
        );
      }

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
      padding: EdgeInsets.fromLTRB(
        AppSpacing.base,
        AppSpacing.xl + MediaQuery.paddingOf(context).top,
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
        style: Theme.of(context).textTheme.labelLarge?.copyWith(
          color: Theme.of(context).colorScheme.primary,
          letterSpacing: 1.2,
        ),
      ),
    );
  }
}

class _DrawerExpandableItem extends StatefulWidget {
  const _DrawerExpandableItem({
    required this.item,
    required this.isSelected,
    required this.isExpanded,
    required this.currentRoute,
    required this.onChildTap,
    required this.onTap,
  });

  final _NavItem item;
  final bool isSelected;
  final bool isExpanded;
  final String currentRoute;
  final void Function(_NavItem child) onChildTap;
  final VoidCallback onTap;

  @override
  State<_DrawerExpandableItem> createState() => _DrawerExpandableItemState();
}

class _DrawerExpandableItemState extends State<_DrawerExpandableItem>
    with SingleTickerProviderStateMixin {
  late bool _expanded;
  late AnimationController _iconCtrl;

  @override
  void initState() {
    super.initState();
    _expanded = widget.isSelected;
    _iconCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 200),
      value: _expanded ? 1.0 : 0.0,
    );
  }

  @override
  void didUpdateWidget(covariant _DrawerExpandableItem old) {
    super.didUpdateWidget(old);
    if (widget.isSelected && !_expanded) {
      _expanded = true;
      _iconCtrl.forward();
    }
  }

  @override
  void dispose() {
    _iconCtrl.dispose();
    super.dispose();
  }

  void _toggle() {
    setState(() => _expanded = !_expanded);
    if (_expanded) {
      _iconCtrl.forward();
    } else {
      _iconCtrl.reverse();
    }
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        ListTile(
          dense: true,
          shape: RoundedRectangleBorder(borderRadius: AppRadius.forTile),
          selected: widget.isSelected,
          selectedTileColor: colorScheme.primaryContainer.withValues(
            alpha: 0.5,
          ),
          leading: Icon(
            widget.isSelected ? widget.item.selectedIcon : widget.item.icon,
            color: widget.isSelected
                ? colorScheme.primary
                : colorScheme.onSurfaceVariant,
            size: 22,
          ),
          title: Text(
            widget.item.label,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: widget.isSelected
                  ? colorScheme.primary
                  : colorScheme.onSurface,
              fontWeight: widget.isSelected
                  ? FontWeight.w600
                  : FontWeight.normal,
            ),
          ),
          trailing: RotationTransition(
            turns: Tween(begin: 0.0, end: 0.5).animate(
              CurvedAnimation(parent: _iconCtrl, curve: Curves.easeInOut),
            ),
            child: Icon(
              Icons.expand_more,
              size: 20,
              color: colorScheme.onSurfaceVariant,
            ),
          ),
          onTap: _toggle,
        ),
        AnimatedCrossFade(
          firstChild: const SizedBox.shrink(),
          secondChild: Padding(
            padding: const EdgeInsets.only(left: 16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: widget.item.children.map((child) {
                final childSelected = child.routeName == widget.currentRoute;
                return ListTile(
                  dense: true,
                  visualDensity: const VisualDensity(vertical: -3),
                  shape: RoundedRectangleBorder(
                    borderRadius: AppRadius.forTile,
                  ),
                  selected: childSelected,
                  selectedTileColor: colorScheme.primaryContainer.withValues(
                    alpha: 0.3,
                  ),
                  leading: Icon(
                    childSelected ? child.selectedIcon : child.icon,
                    color: childSelected
                        ? colorScheme.primary
                        : colorScheme.onSurfaceVariant,
                    size: 18,
                  ),
                  title: Text(
                    child.label,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: childSelected
                          ? colorScheme.primary
                          : colorScheme.onSurface,
                      fontWeight: childSelected
                          ? FontWeight.w600
                          : FontWeight.normal,
                    ),
                  ),
                  onTap: () => widget.onChildTap(child),
                );
              }).toList(),
            ),
          ),
          crossFadeState: _expanded
              ? CrossFadeState.showSecond
              : CrossFadeState.showFirst,
          duration: const Duration(milliseconds: 200),
        ),
      ],
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
                style: Theme.of(context).textTheme.labelMedium?.copyWith(
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
