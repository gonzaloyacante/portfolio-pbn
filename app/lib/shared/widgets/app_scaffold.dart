import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/router/route_names.dart';
import '../../core/theme/app_typography.dart';

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
/// - **Tablet (≥600px)**: Drawer persistente lateral (réplica del AdminSidebar web).
/// - **Móvil (<600px)**: BottomNavigationBar con las 4 secciones principales.
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
    this.resizeToAvoidBottomInset = true,
  });

  final Widget body;
  final String? title;
  final List<Widget>? actions;
  final Widget? floatingActionButton;
  final bool resizeToAvoidBottomInset;

  @override
  Widget build(BuildContext context) {
    final isTablet = MediaQuery.sizeOf(context).width >= 600;

    if (isTablet) {
      return _TabletScaffold(
        title: title,
        actions: actions,
        floatingActionButton: floatingActionButton,
        resizeToAvoidBottomInset: resizeToAvoidBottomInset,
        body: body,
      );
    }

    return _MobileScaffold(
      title: title,
      actions: actions,
      floatingActionButton: floatingActionButton,
      resizeToAvoidBottomInset: resizeToAvoidBottomInset,
      body: body,
    );
  }
}

// ── _TabletScaffold ───────────────────────────────────────────────────────────

class _TabletScaffold extends StatelessWidget {
  const _TabletScaffold({
    required this.body,
    this.title,
    this.actions,
    this.floatingActionButton,
    this.resizeToAvoidBottomInset = true,
  });

  final Widget body;
  final String? title;
  final List<Widget>? actions;
  final Widget? floatingActionButton;
  final bool resizeToAvoidBottomInset;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: resizeToAvoidBottomInset,
      floatingActionButton: floatingActionButton,
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

// ── _MobileScaffold ───────────────────────────────────────────────────────────

class _MobileScaffold extends StatefulWidget {
  const _MobileScaffold({
    required this.body,
    this.title,
    this.actions,
    this.floatingActionButton,
    this.resizeToAvoidBottomInset = true,
  });

  final Widget body;
  final String? title;
  final List<Widget>? actions;
  final Widget? floatingActionButton;
  final bool resizeToAvoidBottomInset;

  @override
  State<_MobileScaffold> createState() => _MobileScaffoldState();
}

class _MobileScaffoldState extends State<_MobileScaffold> {
  final _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    final canPop = GoRouter.of(context).canPop();

    return Scaffold(
      key: _scaffoldKey,
      resizeToAvoidBottomInset: widget.resizeToAvoidBottomInset,
      floatingActionButton: widget.floatingActionButton,
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

// ── AppDrawer ─────────────────────────────────────────────────────────────────

/// Drawer lateral de administración.
/// En tablet se usa como NavigationRail fijo; en móvil como Drawer deslizable.
class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    final currentRoute = GoRouterState.of(context).name ?? '';
    final isTablet = MediaQuery.sizeOf(context).width >= 600;

    final content = Container(
      width: 260,
      color: colorScheme.surface,
      child: SafeArea(
        top: false,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header: logo + nombre
            _DrawerHeader(textTheme: textTheme, colorScheme: colorScheme),
            const Divider(height: 1),
            const SizedBox(height: 8),

            // Items principales de navegación
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 8),
                children: [
                  _SectionLabel(label: 'CONTENIDO'),
                  ..._buildItems(
                    context,
                    items: _allNavItems.sublist(0, 8),
                    currentRoute: currentRoute,
                    isTablet: isTablet,
                  ),
                  const SizedBox(height: 8),
                  _SectionLabel(label: 'CONFIGURACIÓN'),
                  ..._buildItems(
                    context,
                    items: _allNavItems.sublist(8),
                    currentRoute: currentRoute,
                    isTablet: isTablet,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );

    if (isTablet) return content;

    return Drawer(child: content);
  }

  List<Widget> _buildItems(
    BuildContext context, {
    required List<_NavItem> items,
    required String currentRoute,
    required bool isTablet,
  }) {
    return items.map((item) {
      final isSelected = item.routeName == currentRoute;
      return _DrawerNavItem(
        item: item,
        isSelected: isSelected,
        isTablet: isTablet,
        onTap: () {
          if (!isTablet) Navigator.of(context).pop();
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
        16,
        24 + MediaQuery.of(context).padding.top,
        16,
        20,
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
              borderRadius: BorderRadius.circular(14),
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
          const SizedBox(width: 12),
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
                    horizontal: 7,
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
    required this.isTablet,
    required this.onTap,
  });

  final _NavItem item;
  final bool isSelected;
  final bool isTablet;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return ListTile(
      dense: true,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
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
      onTap: onTap,
    );
  }
}
