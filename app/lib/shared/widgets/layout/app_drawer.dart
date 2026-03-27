import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/route_names.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../features/dashboard/providers/dashboard_provider.dart';
import 'nav_items.dart';

part 'app_drawer_widgets.dart';
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
                    items: kAppNavItems.sublist(0, 9),
                    currentRoute: currentRoute,
                    isExpanded: isExpanded,
                    badgeCounts: badgeCounts,
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  const _SectionLabel(label: 'CONFIGURACIÓN'),
                  ..._buildItems(
                    context,
                    items: kAppNavItems.sublist(9),
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
    required List<NavItem> items,
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
