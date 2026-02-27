import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/core/router/route_names.dart';

void main() {
  // ── RouteNames ──────────────────────────────────────────────────────────────

  group('RouteNames — auth', () {
    test('login == "login"', () => expect(RouteNames.login, 'login'));
    test('splash == "splash"', () => expect(RouteNames.splash, 'splash'));
  });

  group('RouteNames — dashboard', () {
    test(
      'dashboard == "dashboard"',
      () => expect(RouteNames.dashboard, 'dashboard'),
    );
  });

  group('RouteNames — projects', () {
    test(
      'projects == "projects"',
      () => expect(RouteNames.projects, 'projects'),
    );
    test(
      'projectNew == "project-new"',
      () => expect(RouteNames.projectNew, 'project-new'),
    );
    test(
      'projectEdit == "project-edit"',
      () => expect(RouteNames.projectEdit, 'project-edit'),
    );
  });

  group('RouteNames — categories', () {
    test(
      'categories == "categories"',
      () => expect(RouteNames.categories, 'categories'),
    );
    test(
      'categoryNew == "category-new"',
      () => expect(RouteNames.categoryNew, 'category-new'),
    );
    test(
      'categoryEdit == "category-edit"',
      () => expect(RouteNames.categoryEdit, 'category-edit'),
    );
  });

  group('RouteNames — services', () {
    test(
      'services == "services"',
      () => expect(RouteNames.services, 'services'),
    );
    test(
      'serviceNew == "service-new"',
      () => expect(RouteNames.serviceNew, 'service-new'),
    );
    test(
      'serviceEdit == "service-edit"',
      () => expect(RouteNames.serviceEdit, 'service-edit'),
    );
  });

  group('RouteNames — testimonials', () {
    test(
      'testimonials == "testimonials"',
      () => expect(RouteNames.testimonials, 'testimonials'),
    );
    test(
      'testimonialNew == "testimonial-new"',
      () => expect(RouteNames.testimonialNew, 'testimonial-new'),
    );
    test(
      'testimonialEdit == "testimonial-edit"',
      () => expect(RouteNames.testimonialEdit, 'testimonial-edit'),
    );
  });

  group('RouteNames — contacts', () {
    test(
      'contacts == "contacts"',
      () => expect(RouteNames.contacts, 'contacts'),
    );
    test(
      'contactDetail == "contact-detail"',
      () => expect(RouteNames.contactDetail, 'contact-detail'),
    );
  });

  group('RouteNames — calendar', () {
    test(
      'calendar == "calendar"',
      () => expect(RouteNames.calendar, 'calendar'),
    );
    test(
      'bookingNew == "booking-new"',
      () => expect(RouteNames.bookingNew, 'booking-new'),
    );
    test(
      'bookingDetail == "booking-detail"',
      () => expect(RouteNames.bookingDetail, 'booking-detail'),
    );
  });

  group('RouteNames — settings', () {
    test(
      'settings == "settings"',
      () => expect(RouteNames.settings, 'settings'),
    );
    test(
      'settingsHome == "settings-home"',
      () => expect(RouteNames.settingsHome, 'settings-home'),
    );
    test(
      'settingsAbout == "settings-about"',
      () => expect(RouteNames.settingsAbout, 'settings-about'),
    );
    test(
      'settingsContact == "settings-contact"',
      () => expect(RouteNames.settingsContact, 'settings-contact'),
    );
    test(
      'settingsTheme == "settings-theme"',
      () => expect(RouteNames.settingsTheme, 'settings-theme'),
    );
    test(
      'settingsSite == "settings-site"',
      () => expect(RouteNames.settingsSite, 'settings-site'),
    );
    test(
      'settingsSocial == "settings-social"',
      () => expect(RouteNames.settingsSocial, 'settings-social'),
    );
  });

  group('RouteNames — other', () {
    test('trash == "trash"', () => expect(RouteNames.trash, 'trash'));
    test('account == "account"', () => expect(RouteNames.account, 'account'));
    test('help == "help"', () => expect(RouteNames.help, 'help'));
    test(
      'appSettings == "app-settings"',
      () => expect(RouteNames.appSettings, 'app-settings'),
    );
  });

  group('RouteNames — collection constraints', () {
    late List<String> allNames;
    setUp(() {
      allNames = [
        RouteNames.login,
        RouteNames.splash,
        RouteNames.dashboard,
        RouteNames.projects,
        RouteNames.projectNew,
        RouteNames.projectEdit,
        RouteNames.categories,
        RouteNames.categoryNew,
        RouteNames.categoryEdit,
        RouteNames.services,
        RouteNames.serviceNew,
        RouteNames.serviceEdit,
        RouteNames.testimonials,
        RouteNames.testimonialNew,
        RouteNames.testimonialEdit,
        RouteNames.contacts,
        RouteNames.contactDetail,
        RouteNames.calendar,
        RouteNames.bookingNew,
        RouteNames.bookingDetail,
        RouteNames.settings,
        RouteNames.settingsHome,
        RouteNames.settingsAbout,
        RouteNames.settingsContact,
        RouteNames.settingsTheme,
        RouteNames.settingsSite,
        RouteNames.settingsSocial,
        RouteNames.trash,
        RouteNames.account,
        RouteNames.help,
        RouteNames.appSettings,
      ];
    });

    test('all route names are unique', () {
      expect(allNames.toSet().length, allNames.length);
    });

    test('all route names are non-empty', () {
      for (final name in allNames) {
        expect(name, isNotEmpty);
      }
    });

    test('no route name starts with /', () {
      for (final name in allNames) {
        expect(
          name.startsWith('/'),
          false,
          reason: '$name should not start with /',
        );
      }
    });

    test('all route names are lowercase', () {
      for (final name in allNames) {
        expect(name, equals(name.toLowerCase()));
      }
    });

    test('no route name contains spaces', () {
      for (final name in allNames) {
        expect(name.contains(' '), false);
      }
    });
  });

  // ── RoutePaths ──────────────────────────────────────────────────────────────

  group('RoutePaths — auth', () {
    test('login == "/login"', () => expect(RoutePaths.login, '/login'));
    test('splash == "/splash"', () => expect(RoutePaths.splash, '/splash'));
  });

  group('RoutePaths — dashboard', () {
    test(
      'dashboard == "/dashboard"',
      () => expect(RoutePaths.dashboard, '/dashboard'),
    );
  });

  group('RoutePaths — projects', () {
    test(
      'projects == "/projects"',
      () => expect(RoutePaths.projects, '/projects'),
    );
    test(
      'projectNew == "/projects/new"',
      () => expect(RoutePaths.projectNew, '/projects/new'),
    );
    test(
      'projectEdit contains ":id"',
      () => expect(RoutePaths.projectEdit, contains(':id')),
    );
    test(
      'projectEdit starts with "/projects/"',
      () => expect(RoutePaths.projectEdit.startsWith('/projects/'), true),
    );
  });

  group('RoutePaths — categories', () {
    test(
      'categories == "/categories"',
      () => expect(RoutePaths.categories, '/categories'),
    );
    test(
      'categoryNew == "/categories/new"',
      () => expect(RoutePaths.categoryNew, '/categories/new'),
    );
    test(
      'categoryEdit contains ":id"',
      () => expect(RoutePaths.categoryEdit, contains(':id')),
    );
  });

  group('RoutePaths — services', () {
    test(
      'services == "/services"',
      () => expect(RoutePaths.services, '/services'),
    );
    test(
      'serviceNew == "/services/new"',
      () => expect(RoutePaths.serviceNew, '/services/new'),
    );
    test(
      'serviceEdit contains ":id"',
      () => expect(RoutePaths.serviceEdit, contains(':id')),
    );
  });

  group('RoutePaths — testimonials', () {
    test(
      'testimonials == "/testimonials"',
      () => expect(RoutePaths.testimonials, '/testimonials'),
    );
    test(
      'testimonialNew == "/testimonials/new"',
      () => expect(RoutePaths.testimonialNew, '/testimonials/new'),
    );
    test(
      'testimonialEdit contains ":id"',
      () => expect(RoutePaths.testimonialEdit, contains(':id')),
    );
  });

  group('RoutePaths — contacts', () {
    test(
      'contacts == "/contacts"',
      () => expect(RoutePaths.contacts, '/contacts'),
    );
    test(
      'contactDetail contains ":id"',
      () => expect(RoutePaths.contactDetail, contains(':id')),
    );
  });

  group('RoutePaths — calendar', () {
    test(
      'calendar == "/calendar"',
      () => expect(RoutePaths.calendar, '/calendar'),
    );
    test(
      'bookingNew == "/calendar/new"',
      () => expect(RoutePaths.bookingNew, '/calendar/new'),
    );
    test(
      'bookingDetail contains ":id"',
      () => expect(RoutePaths.bookingDetail, contains(':id')),
    );
  });

  group('RoutePaths — settings', () {
    test(
      'settings == "/settings"',
      () => expect(RoutePaths.settings, '/settings'),
    );
    test(
      'settingsHome == "/settings/home"',
      () => expect(RoutePaths.settingsHome, '/settings/home'),
    );
    test(
      'settingsAbout == "/settings/about"',
      () => expect(RoutePaths.settingsAbout, '/settings/about'),
    );
    test(
      'settingsContact == "/settings/contact"',
      () => expect(RoutePaths.settingsContact, '/settings/contact'),
    );
    test(
      'settingsTheme == "/settings/theme"',
      () => expect(RoutePaths.settingsTheme, '/settings/theme'),
    );
    test(
      'settingsSite == "/settings/site"',
      () => expect(RoutePaths.settingsSite, '/settings/site'),
    );
    test(
      'settingsSocial == "/settings/social"',
      () => expect(RoutePaths.settingsSocial, '/settings/social'),
    );
    test('all settings subpaths start with /settings/', () {
      final subPaths = [
        RoutePaths.settingsHome,
        RoutePaths.settingsAbout,
        RoutePaths.settingsContact,
        RoutePaths.settingsTheme,
        RoutePaths.settingsSite,
        RoutePaths.settingsSocial,
      ];
      for (final p in subPaths) {
        expect(p.startsWith('/settings/'), true);
      }
    });
  });

  group('RoutePaths — other', () {
    test('trash == "/trash"', () => expect(RoutePaths.trash, '/trash'));
    test('account == "/account"', () => expect(RoutePaths.account, '/account'));
    test('help == "/help"', () => expect(RoutePaths.help, '/help'));
    test(
      'appSettings == "/app-settings"',
      () => expect(RoutePaths.appSettings, '/app-settings'),
    );
  });

  group('RoutePaths — collection constraints', () {
    late List<String> allPaths;
    setUp(() {
      allPaths = [
        RoutePaths.login,
        RoutePaths.splash,
        RoutePaths.dashboard,
        RoutePaths.projects,
        RoutePaths.projectNew,
        RoutePaths.projectEdit,
        RoutePaths.categories,
        RoutePaths.categoryNew,
        RoutePaths.categoryEdit,
        RoutePaths.services,
        RoutePaths.serviceNew,
        RoutePaths.serviceEdit,
        RoutePaths.testimonials,
        RoutePaths.testimonialNew,
        RoutePaths.testimonialEdit,
        RoutePaths.contacts,
        RoutePaths.contactDetail,
        RoutePaths.calendar,
        RoutePaths.bookingNew,
        RoutePaths.bookingDetail,
        RoutePaths.settings,
        RoutePaths.settingsHome,
        RoutePaths.settingsAbout,
        RoutePaths.settingsContact,
        RoutePaths.settingsTheme,
        RoutePaths.settingsSite,
        RoutePaths.settingsSocial,
        RoutePaths.trash,
        RoutePaths.account,
        RoutePaths.help,
        RoutePaths.appSettings,
      ];
    });

    test('all paths are unique', () {
      expect(allPaths.toSet().length, allPaths.length);
    });

    test('all paths start with /', () {
      for (final path in allPaths) {
        expect(path.startsWith('/'), true, reason: '$path must start with /');
      }
    });

    test('all paths are non-empty strings', () {
      for (final path in allPaths) {
        expect(path.length, greaterThan(1));
      }
    });

    test('no path ends with /', () {
      for (final path in allPaths) {
        expect(path.endsWith('/'), false, reason: '$path must not end with /');
      }
    });

    test('all paths are lowercase', () {
      for (final path in allPaths) {
        // Parametrized parts like :id are also lowercase
        expect(path, equals(path.toLowerCase()));
      }
    });
  });

  group('RoutePaths — parametrized path helpers', () {
    test('projectEdit pattern is /projects/:id/edit', () {
      expect(RoutePaths.projectEdit, '/projects/:id/edit');
    });

    test('categoryEdit pattern is /categories/:id/edit', () {
      expect(RoutePaths.categoryEdit, '/categories/:id/edit');
    });

    test('serviceEdit pattern is /services/:id/edit', () {
      expect(RoutePaths.serviceEdit, '/services/:id/edit');
    });

    test('testimonialEdit pattern is /testimonials/:id/edit', () {
      expect(RoutePaths.testimonialEdit, '/testimonials/:id/edit');
    });

    test('contactDetail pattern is /contacts/:id', () {
      expect(RoutePaths.contactDetail, '/contacts/:id');
    });

    test('bookingDetail pattern is /calendar/:id', () {
      expect(RoutePaths.bookingDetail, '/calendar/:id');
    });
  });
}
