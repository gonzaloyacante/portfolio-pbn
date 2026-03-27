import 'package:flutter/material.dart';

import '../../../core/router/route_names.dart';

// ── NavItem ───────────────────────────────────────────────────────────────────

class NavItem {
  const NavItem({
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
  final List<NavItem> children;

  /// Devuelve `true` si este item o alguna subruta coincide con [currentRoute].
  bool isActive(String currentRoute) {
    if (routeName == currentRoute) return true;
    if (childRoutes.contains(currentRoute)) return true;
    return children.any((c) => c.routeName == currentRoute);
  }
}

// ── Navigation Items ──────────────────────────────────────────────────────────

const List<NavItem> kAppNavItems = [
  NavItem(
    routeName: RouteNames.dashboard,
    icon: Icons.dashboard_outlined,
    selectedIcon: Icons.dashboard,
    label: 'Dashboard',
    isMainNav: true,
  ),
  NavItem(
    routeName: RouteNames.projects,
    icon: Icons.photo_library_outlined,
    selectedIcon: Icons.photo_library,
    label: 'Proyectos',
    isMainNav: true,
    childRoutes: [RouteNames.projectNew, RouteNames.projectEdit],
  ),
  NavItem(
    routeName: RouteNames.categories,
    icon: Icons.category_outlined,
    selectedIcon: Icons.category,
    label: 'Categorías',
    childRoutes: [RouteNames.categoryNew, RouteNames.categoryEdit],
  ),
  NavItem(
    routeName: RouteNames.services,
    icon: Icons.design_services_outlined,
    selectedIcon: Icons.design_services,
    label: 'Servicios',
    childRoutes: [RouteNames.serviceNew, RouteNames.serviceEdit],
  ),
  NavItem(
    routeName: RouteNames.testimonials,
    icon: Icons.star_outline,
    selectedIcon: Icons.star,
    label: 'Testimonios',
    childRoutes: [RouteNames.testimonialNew, RouteNames.testimonialEdit],
  ),
  NavItem(
    routeName: RouteNames.contacts,
    icon: Icons.mail_outline,
    selectedIcon: Icons.mail,
    label: 'Contactos',
    isMainNav: true,
    childRoutes: [RouteNames.contactDetail],
  ),
  NavItem(
    routeName: RouteNames.calendar,
    icon: Icons.calendar_month_outlined,
    selectedIcon: Icons.calendar_month,
    label: 'Agenda',
    isMainNav: true,
    childRoutes: [RouteNames.bookingNew, RouteNames.bookingDetail],
  ),
  NavItem(
    routeName: RouteNames.settings,
    icon: Icons.settings_outlined,
    selectedIcon: Icons.settings,
    label: 'Ajustes del Sitio',
    children: [
      NavItem(
        routeName: RouteNames.settingsHome,
        icon: Icons.home_outlined,
        selectedIcon: Icons.home,
        label: 'Inicio',
      ),
      NavItem(
        routeName: RouteNames.settingsAbout,
        icon: Icons.person_outline,
        selectedIcon: Icons.person,
        label: 'Sobre mí',
      ),
      NavItem(
        routeName: RouteNames.settingsContact,
        icon: Icons.contact_page_outlined,
        selectedIcon: Icons.contact_page,
        label: 'Contacto',
      ),
      NavItem(
        routeName: RouteNames.settingsTheme,
        icon: Icons.palette_outlined,
        selectedIcon: Icons.palette,
        label: 'Tema',
      ),
      NavItem(
        routeName: RouteNames.settingsSite,
        icon: Icons.language_outlined,
        selectedIcon: Icons.language,
        label: 'Sitio',
      ),
      NavItem(
        routeName: RouteNames.settingsSocial,
        icon: Icons.share_outlined,
        selectedIcon: Icons.share,
        label: 'Redes Sociales',
      ),
    ],
  ),
  NavItem(
    routeName: RouteNames.trash,
    icon: Icons.delete_outline,
    selectedIcon: Icons.delete,
    label: 'Papelera',
    childRoutes: [RouteNames.trashDetail],
  ),
  NavItem(
    routeName: RouteNames.appSettings,
    icon: Icons.tune_outlined,
    selectedIcon: Icons.tune,
    label: 'Preferencias',
  ),
  NavItem(
    routeName: RouteNames.account,
    icon: Icons.person_outline,
    selectedIcon: Icons.person,
    label: 'Mi cuenta',
  ),
];
