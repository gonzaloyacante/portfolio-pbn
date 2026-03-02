import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/core/api/endpoints.dart';

void main() {
  group('Endpoints — auth', () {
    test('authLogin is correct', () {
      expect(Endpoints.authLogin, '/api/admin/auth/login');
    });

    test('authRefresh is correct', () {
      expect(Endpoints.authRefresh, '/api/admin/auth/refresh');
    });

    test('authLogout is correct', () {
      expect(Endpoints.authLogout, '/api/admin/auth/logout');
    });

    test('authMe is correct', () {
      expect(Endpoints.authMe, '/api/admin/auth/me');
    });
  });

  group('Endpoints — projects', () {
    test('projects constant is correct', () {
      expect(Endpoints.projects, '/api/admin/projects');
    });

    test('project(id) returns correct URL', () {
      expect(Endpoints.project('abc123'), '/api/admin/projects/abc123');
    });

    test('projectsReorder is correct', () {
      expect(Endpoints.projectsReorder, '/api/admin/projects/reorder');
    });

    test('projectImages(id) returns correct URL', () {
      expect(Endpoints.projectImages('p1'), '/api/admin/projects/p1/images');
    });

    test('projectImage(id, imageId) returns correct URL', () {
      expect(
        Endpoints.projectImage('p1', 'img1'),
        '/api/admin/projects/p1/images/img1',
      );
    });
  });

  group('Endpoints — categories', () {
    test('categories constant is correct', () {
      expect(Endpoints.categories, '/api/admin/categories');
    });

    test('category(id) returns correct URL', () {
      expect(Endpoints.category('cat1'), '/api/admin/categories/cat1');
    });
  });

  group('Endpoints — services', () {
    test('services constant is correct', () {
      expect(Endpoints.services, '/api/admin/services');
    });

    test('service(id) returns correct URL', () {
      expect(Endpoints.service('s1'), '/api/admin/services/s1');
    });
  });

  group('Endpoints — testimonials', () {
    test('testimonials constant is correct', () {
      expect(Endpoints.testimonials, '/api/admin/testimonials');
    });

    test('testimonial(id) returns correct URL', () {
      expect(Endpoints.testimonial('t1'), '/api/admin/testimonials/t1');
    });
  });

  group('Endpoints — contacts', () {
    test('contacts constant is correct', () {
      expect(Endpoints.contacts, '/api/admin/contacts');
    });

    test('contact(id) returns correct URL', () {
      expect(Endpoints.contact('c1'), '/api/admin/contacts/c1');
    });
  });

  group('Endpoints — bookings', () {
    test('bookings constant is correct', () {
      expect(Endpoints.bookings, '/api/admin/bookings');
    });

    test('booking(id) returns correct URL', () {
      expect(Endpoints.booking('b1'), '/api/admin/bookings/b1');
    });
  });

  group('Endpoints — settings', () {
    test('settings constant is correct', () {
      expect(Endpoints.settings, '/api/admin/settings');
    });

    test('settingsSection(section) returns correct URL', () {
      expect(Endpoints.settingsSection('theme'), '/api/admin/settings/theme');
    });

    test('socialLinks is correct', () {
      expect(Endpoints.socialLinks, '/api/admin/settings/social');
    });
  });

  group('Endpoints — analytics', () {
    test('analytics constant is correct', () {
      expect(Endpoints.analytics, '/api/admin/analytics');
    });

    test('analyticsOverview is correct', () {
      expect(Endpoints.analyticsOverview, '/api/admin/analytics/overview');
    });

    test('analyticsCharts is correct', () {
      expect(Endpoints.analyticsCharts, '/api/admin/analytics/charts');
    });
  });

  group('Endpoints — trash', () {
    test('trash constant is correct', () {
      expect(Endpoints.trash, '/api/admin/trash');
    });

    test('trashItem(id) returns correct URL', () {
      expect(Endpoints.trashItem('item1'), '/api/admin/trash/item1');
    });

    test('trashTypedItem returns correct URL', () {
      expect(
        Endpoints.trashTypedItem('project', 'p1'),
        '/api/admin/trash/project/p1',
      );
    });
  });

  group('Endpoints — push', () {
    test('pushRegister is correct', () {
      expect(Endpoints.pushRegister, '/api/admin/push/register');
    });

    test('pushUnregister is correct', () {
      expect(Endpoints.pushUnregister, '/api/admin/push/unregister');
    });
  });

  group('Endpoints — upload', () {
    test('adminUpload is correct', () {
      expect(Endpoints.adminUpload, '/api/admin/upload');
    });
  });

  group('Endpoints — app updates', () {
    test('appLatestRelease is correct', () {
      expect(Endpoints.appLatestRelease, '/api/admin/app/latest-release');
    });
  });

  group('Endpoints — consistent prefix', () {
    test('all constants start with /api/admin', () {
      final constants = [
        Endpoints.authLogin,
        Endpoints.authRefresh,
        Endpoints.projects,
        Endpoints.categories,
        Endpoints.services,
        Endpoints.testimonials,
        Endpoints.contacts,
        Endpoints.bookings,
        Endpoints.settings,
        Endpoints.analytics,
        Endpoints.analyticsOverview,
        Endpoints.analyticsCharts,
        Endpoints.socialLinks,
        Endpoints.trash,
        Endpoints.pushRegister,
        Endpoints.adminUpload,
        Endpoints.appLatestRelease,
      ];
      for (final c in constants) {
        expect(
          c,
          startsWith('/api/admin'),
          reason: '$c should start with /api/admin',
        );
      }
    });

    test('dynamic functions produce URLs starting with /api/admin', () {
      expect(Endpoints.project('x'), startsWith('/api/admin'));
      expect(Endpoints.category('x'), startsWith('/api/admin'));
      expect(Endpoints.service('x'), startsWith('/api/admin'));
      expect(Endpoints.testimonial('x'), startsWith('/api/admin'));
      expect(Endpoints.contact('x'), startsWith('/api/admin'));
      expect(Endpoints.booking('x'), startsWith('/api/admin'));
    });
  });
}
