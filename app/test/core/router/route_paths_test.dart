import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/core/router/route_names.dart';

void main() {
  // ── RoutePaths — format validation ───────────────────────────────────────

  group('RoutePaths — all start with /', () {
    test('login', () => expect(RoutePaths.login.startsWith('/'), isTrue));
    test('splash', () => expect(RoutePaths.splash.startsWith('/'), isTrue));
    test(
      'dashboard',
      () => expect(RoutePaths.dashboard.startsWith('/'), isTrue),
    );
    test('projects', () => expect(RoutePaths.projects.startsWith('/'), isTrue));
    test(
      'projectNew',
      () => expect(RoutePaths.projectNew.startsWith('/'), isTrue),
    );
    test(
      'projectEdit',
      () => expect(RoutePaths.projectEdit.startsWith('/'), isTrue),
    );
    test(
      'categories',
      () => expect(RoutePaths.categories.startsWith('/'), isTrue),
    );
    test(
      'categoryNew',
      () => expect(RoutePaths.categoryNew.startsWith('/'), isTrue),
    );
    test(
      'categoryEdit',
      () => expect(RoutePaths.categoryEdit.startsWith('/'), isTrue),
    );
    test('services', () => expect(RoutePaths.services.startsWith('/'), isTrue));
    test(
      'serviceNew',
      () => expect(RoutePaths.serviceNew.startsWith('/'), isTrue),
    );
    test(
      'serviceEdit',
      () => expect(RoutePaths.serviceEdit.startsWith('/'), isTrue),
    );
    test(
      'testimonials',
      () => expect(RoutePaths.testimonials.startsWith('/'), isTrue),
    );
    test(
      'testimonialNew',
      () => expect(RoutePaths.testimonialNew.startsWith('/'), isTrue),
    );
    test(
      'testimonialEdit',
      () => expect(RoutePaths.testimonialEdit.startsWith('/'), isTrue),
    );
    test('contacts', () => expect(RoutePaths.contacts.startsWith('/'), isTrue));
    test(
      'contactDetail',
      () => expect(RoutePaths.contactDetail.startsWith('/'), isTrue),
    );
    test('calendar', () => expect(RoutePaths.calendar.startsWith('/'), isTrue));
    test(
      'bookingNew',
      () => expect(RoutePaths.bookingNew.startsWith('/'), isTrue),
    );
    test(
      'bookingDetail',
      () => expect(RoutePaths.bookingDetail.startsWith('/'), isTrue),
    );
    test('settings', () => expect(RoutePaths.settings.startsWith('/'), isTrue));
    test(
      'settingsHome',
      () => expect(RoutePaths.settingsHome.startsWith('/'), isTrue),
    );
    test(
      'settingsAbout',
      () => expect(RoutePaths.settingsAbout.startsWith('/'), isTrue),
    );
    test(
      'settingsContact',
      () => expect(RoutePaths.settingsContact.startsWith('/'), isTrue),
    );
    test(
      'settingsTheme',
      () => expect(RoutePaths.settingsTheme.startsWith('/'), isTrue),
    );
    test(
      'settingsSite',
      () => expect(RoutePaths.settingsSite.startsWith('/'), isTrue),
    );
    test(
      'settingsSocial',
      () => expect(RoutePaths.settingsSocial.startsWith('/'), isTrue),
    );
    test('trash', () => expect(RoutePaths.trash.startsWith('/'), isTrue));
    test('account', () => expect(RoutePaths.account.startsWith('/'), isTrue));
    test('help', () => expect(RoutePaths.help.startsWith('/'), isTrue));
    test(
      'appSettings',
      () => expect(RoutePaths.appSettings.startsWith('/'), isTrue),
    );
  });

  group('RoutePaths — exact values', () {
    test('login is /login', () => expect(RoutePaths.login, '/login'));
    test('splash is /splash', () => expect(RoutePaths.splash, '/splash'));
    test(
      'dashboard is /dashboard',
      () => expect(RoutePaths.dashboard, '/dashboard'),
    );
    test(
      'projects is /projects',
      () => expect(RoutePaths.projects, '/projects'),
    );
    test(
      'projectNew is /projects/new',
      () => expect(RoutePaths.projectNew, '/projects/new'),
    );
    test(
      'projectEdit has :id param',
      () => expect(RoutePaths.projectEdit.contains(':id'), isTrue),
    );
    test(
      'categories is /categories',
      () => expect(RoutePaths.categories, '/categories'),
    );
    test(
      'categoryNew is /categories/new',
      () => expect(RoutePaths.categoryNew, '/categories/new'),
    );
    test(
      'categoryEdit has :id param',
      () => expect(RoutePaths.categoryEdit.contains(':id'), isTrue),
    );
    test(
      'services is /services',
      () => expect(RoutePaths.services, '/services'),
    );
    test(
      'serviceNew is /services/new',
      () => expect(RoutePaths.serviceNew, '/services/new'),
    );
    test(
      'serviceEdit has :id param',
      () => expect(RoutePaths.serviceEdit.contains(':id'), isTrue),
    );
    test(
      'testimonials is /testimonials',
      () => expect(RoutePaths.testimonials, '/testimonials'),
    );
    test(
      'testimonialNew is /testimonials/new',
      () => expect(RoutePaths.testimonialNew, '/testimonials/new'),
    );
    test(
      'testimonialEdit has :id param',
      () => expect(RoutePaths.testimonialEdit.contains(':id'), isTrue),
    );
    test(
      'contacts is /contacts',
      () => expect(RoutePaths.contacts, '/contacts'),
    );
    test(
      'contactDetail has :id param',
      () => expect(RoutePaths.contactDetail.contains(':id'), isTrue),
    );
    test(
      'calendar is /calendar',
      () => expect(RoutePaths.calendar, '/calendar'),
    );
    test(
      'bookingNew is /calendar/new',
      () => expect(RoutePaths.bookingNew, '/calendar/new'),
    );
    test(
      'bookingDetail has :id param',
      () => expect(RoutePaths.bookingDetail.contains(':id'), isTrue),
    );
    test(
      'settings is /settings',
      () => expect(RoutePaths.settings, '/settings'),
    );
    test(
      'settingsHome is /settings/home',
      () => expect(RoutePaths.settingsHome, '/settings/home'),
    );
    test(
      'settingsAbout is /settings/about',
      () => expect(RoutePaths.settingsAbout, '/settings/about'),
    );
    test(
      'settingsContact is /settings/contact',
      () => expect(RoutePaths.settingsContact, '/settings/contact'),
    );
    test(
      'settingsTheme is /settings/theme',
      () => expect(RoutePaths.settingsTheme, '/settings/theme'),
    );
    test(
      'settingsSite is /settings/site',
      () => expect(RoutePaths.settingsSite, '/settings/site'),
    );
    test(
      'settingsSocial is /settings/social',
      () => expect(RoutePaths.settingsSocial, '/settings/social'),
    );
    test('trash is /trash', () => expect(RoutePaths.trash, '/trash'));
    test('account is /account', () => expect(RoutePaths.account, '/account'));
    test('help is /help', () => expect(RoutePaths.help, '/help'));
    test(
      'appSettings is /app-settings',
      () => expect(RoutePaths.appSettings, '/app-settings'),
    );
  });

  group('RoutePaths — parent-child relationships', () {
    test('projectNew starts with projectsPath', () {
      expect(RoutePaths.projectNew.startsWith(RoutePaths.projects), isTrue);
    });
    test('projectEdit starts with projectsPath', () {
      expect(RoutePaths.projectEdit.startsWith(RoutePaths.projects), isTrue);
    });
    test('categoryNew starts with categoriesPath', () {
      expect(RoutePaths.categoryNew.startsWith(RoutePaths.categories), isTrue);
    });
    test('categoryEdit starts with categoriesPath', () {
      expect(RoutePaths.categoryEdit.startsWith(RoutePaths.categories), isTrue);
    });
    test('serviceNew starts with servicesPath', () {
      expect(RoutePaths.serviceNew.startsWith(RoutePaths.services), isTrue);
    });
    test('serviceEdit starts with servicesPath', () {
      expect(RoutePaths.serviceEdit.startsWith(RoutePaths.services), isTrue);
    });
    test('testimonialNew starts with testimonialsPath', () {
      expect(
        RoutePaths.testimonialNew.startsWith(RoutePaths.testimonials),
        isTrue,
      );
    });
    test('bookingNew starts with calendarPath', () {
      expect(RoutePaths.bookingNew.startsWith(RoutePaths.calendar), isTrue);
    });
    test('settingsHome starts with settingsPath', () {
      expect(RoutePaths.settingsHome.startsWith(RoutePaths.settings), isTrue);
    });
    test('settingsAbout starts with settingsPath', () {
      expect(RoutePaths.settingsAbout.startsWith(RoutePaths.settings), isTrue);
    });
  });

  // ── RouteNames — additional ───────────────────────────────────────────────

  group('RouteNames — settings routes', () {
    test('settings', () => expect(RouteNames.settings, 'settings'));
    test(
      'settingsHome',
      () => expect(RouteNames.settingsHome, 'settings-home'),
    );
    test(
      'settingsAbout',
      () => expect(RouteNames.settingsAbout, 'settings-about'),
    );
    test(
      'settingsContact',
      () => expect(RouteNames.settingsContact, 'settings-contact'),
    );
    test(
      'settingsTheme',
      () => expect(RouteNames.settingsTheme, 'settings-theme'),
    );
    test(
      'settingsSite',
      () => expect(RouteNames.settingsSite, 'settings-site'),
    );
    test(
      'settingsSocial',
      () => expect(RouteNames.settingsSocial, 'settings-social'),
    );
  });

  group('RouteNames — utility routes', () {
    test('trash', () => expect(RouteNames.trash, 'trash'));
    test('account', () => expect(RouteNames.account, 'account'));
    test('help', () => expect(RouteNames.help, 'help'));
    test('appSettings', () => expect(RouteNames.appSettings, 'app-settings'));
  });

  group('RouteNames — no spaces or slashes', () {
    final names = [
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
      RouteNames.trash,
      RouteNames.account,
    ];
    test('none contain /', () {
      for (final name in names) {
        expect(
          name.contains('/'),
          isFalse,
          reason: '$name should not contain /',
        );
      }
    });
    test('none contain spaces', () {
      for (final name in names) {
        expect(
          name.contains(' '),
          isFalse,
          reason: '$name should not contain spaces',
        );
      }
    });
    test('all non-empty', () {
      for (final name in names) {
        expect(name.isNotEmpty, isTrue);
      }
    });
  });
}
