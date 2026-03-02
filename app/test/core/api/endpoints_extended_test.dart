import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/core/api/endpoints.dart';

void main() {
  // ── Auth endpoints ────────────────────────────────────────────────────────

  group('Endpoints — Auth', () {
    test(
      'authLogin starts with /api/admin',
      () => expect(Endpoints.authLogin, startsWith('/api/admin')),
    );
    test(
      'authLogin ends with /login',
      () => expect(Endpoints.authLogin, endsWith('/login')),
    );
    test(
      'authRefresh contains refresh',
      () => expect(Endpoints.authRefresh, contains('refresh')),
    );
    test(
      'authLogout contains logout',
      () => expect(Endpoints.authLogout, contains('logout')),
    );
    test(
      'authMe contains /me',
      () => expect(Endpoints.authMe, contains('/me')),
    );
    test('all auth endpoints contain /auth/', () {
      expect(Endpoints.authLogin, contains('/auth/'));
      expect(Endpoints.authRefresh, contains('/auth/'));
      expect(Endpoints.authLogout, contains('/auth/'));
      expect(Endpoints.authMe, contains('/auth/'));
    });
  });

  // ── Project endpoints ─────────────────────────────────────────────────────

  group('Endpoints — Projects', () {
    test(
      'projects static constant',
      () => expect(Endpoints.projects, '/api/admin/projects'),
    );
    test('project(id) returns correct path', () {
      expect(Endpoints.project('p-1'), '/api/admin/projects/p-1');
    });
    test('project(id) with special char id', () {
      expect(Endpoints.project('abc-123'), '/api/admin/projects/abc-123');
    });
    test('projectsReorder contains reorder', () {
      expect(Endpoints.projectsReorder, contains('reorder'));
    });
    test('projectImages(id) returns correct path', () {
      expect(Endpoints.projectImages('p-2'), '/api/admin/projects/p-2/images');
    });
    test('projectImage(id, imageId) returns correct path', () {
      expect(
        Endpoints.projectImage('p-2', 'img-1'),
        '/api/admin/projects/p-2/images/img-1',
      );
    });
    test('project path includes id', () {
      const id = 'unique-project-id';
      expect(Endpoints.project(id), contains(id));
    });
    test('projectImages path includes id', () {
      const id = 'proj-99';
      expect(Endpoints.projectImages(id), contains(id));
    });
  });

  // ── Category endpoints ────────────────────────────────────────────────────

  group('Endpoints — Categories', () {
    test(
      'categories constant',
      () => expect(Endpoints.categories, '/api/admin/categories'),
    );
    test('category(id) correct path', () {
      expect(Endpoints.category('cat-5'), '/api/admin/categories/cat-5');
    });
    test('category path includes admin prefix', () {
      expect(Endpoints.category('x'), startsWith('/api/admin'));
    });
    test(
      'categories path contains admin',
      () => expect(Endpoints.categories, contains('/admin/')),
    );
  });

  // ── Services endpoints ────────────────────────────────────────────────────

  group('Endpoints — Services', () {
    test(
      'services constant',
      () => expect(Endpoints.services, '/api/admin/services'),
    );
    test('service(id) correct path', () {
      expect(Endpoints.service('srv-3'), '/api/admin/services/srv-3');
    });
    test('service path includes id', () {
      expect(Endpoints.service('my-service'), contains('my-service'));
    });
  });

  // ── Testimonial endpoints ─────────────────────────────────────────────────

  group('Endpoints — Testimonials', () {
    test(
      'testimonials constant',
      () => expect(Endpoints.testimonials, '/api/admin/testimonials'),
    );
    test('testimonial(id) correct path', () {
      expect(Endpoints.testimonial('t-10'), '/api/admin/testimonials/t-10');
    });
    test('testimonial path starts with base', () {
      expect(
        Endpoints.testimonial('x'),
        startsWith('/api/admin/testimonials/'),
      );
    });
  });

  // ── Contact endpoints ─────────────────────────────────────────────────────

  group('Endpoints — Contacts', () {
    test(
      'contacts constant',
      () => expect(Endpoints.contacts, '/api/admin/contacts'),
    );
    test('contact(id) correct path', () {
      expect(Endpoints.contact('c-7'), '/api/admin/contacts/c-7');
    });
    test('contact path includes id', () {
      expect(Endpoints.contact('cid123'), contains('cid123'));
    });
  });

  // ── Booking endpoints ─────────────────────────────────────────────────────

  group('Endpoints — Bookings', () {
    test(
      'bookings constant',
      () => expect(Endpoints.bookings, '/api/admin/bookings'),
    );
    test('booking(id) correct path', () {
      expect(Endpoints.booking('bk-15'), '/api/admin/bookings/bk-15');
    });
    test('booking path starts correctly', () {
      expect(Endpoints.booking('x'), startsWith('/api/admin/bookings/'));
    });
  });

  // ── Settings endpoints ────────────────────────────────────────────────────

  group('Endpoints — Settings', () {
    test(
      'settings constant',
      () => expect(Endpoints.settings, '/api/admin/settings'),
    );
    test('settingsSection(section) correct path', () {
      expect(Endpoints.settingsSection('theme'), '/api/admin/settings/theme');
    });
    test('settingsSection about', () {
      expect(Endpoints.settingsSection('about'), '/api/admin/settings/about');
    });
    test('settingsSection contact', () {
      expect(
        Endpoints.settingsSection('contact'),
        '/api/admin/settings/contact',
      );
    });
    test('settingsSection includes section name', () {
      expect(Endpoints.settingsSection('custom'), contains('custom'));
    });
  });

  // ── Analytics endpoints ───────────────────────────────────────────────────

  group('Endpoints — Analytics', () {
    test(
      'analytics constant',
      () => expect(Endpoints.analytics, '/api/admin/analytics'),
    );
    test('analyticsOverview contains overview', () {
      expect(Endpoints.analyticsOverview, contains('overview'));
    });
    test('analyticsCharts contains charts', () {
      expect(Endpoints.analyticsCharts, contains('charts'));
    });
  });

  // ── Social Links endpoints ────────────────────────────────────────────────

  group('Endpoints — Social Links', () {
    test('socialLinks contains social', () {
      expect(Endpoints.socialLinks, contains('social'));
    });
    test('socialLinks starts with /api/admin', () {
      expect(Endpoints.socialLinks, startsWith('/api/admin'));
    });
  });

  // ── Trash endpoints ───────────────────────────────────────────────────────

  group('Endpoints — Trash', () {
    test('trash constant', () => expect(Endpoints.trash, '/api/admin/trash'));
    test('trashItem(id) correct path', () {
      expect(Endpoints.trashItem('ti-1'), '/api/admin/trash/ti-1');
    });
    test('trashTypedItem(type, id) correct path', () {
      expect(
        Endpoints.trashTypedItem('project', 'p-5'),
        '/api/admin/trash/project/p-5',
      );
    });
    test('trashTypedItem includes type and id', () {
      final path = Endpoints.trashTypedItem('booking', 'bk-99');
      expect(path, contains('booking'));
      expect(path, contains('bk-99'));
    });
  });

  // ── Push endpoints ────────────────────────────────────────────────────────

  group('Endpoints — Push Notifications', () {
    test('pushRegister contains register', () {
      expect(Endpoints.pushRegister, contains('register'));
    });
    test('pushUnregister contains unregister', () {
      expect(Endpoints.pushUnregister, contains('unregister'));
    });
    test('both push endpoints start with /api/admin/push', () {
      expect(Endpoints.pushRegister, contains('/push/'));
      expect(Endpoints.pushUnregister, contains('/push/'));
    });
  });

  // ── Upload and App endpoints ──────────────────────────────────────────────

  group('Endpoints — Upload', () {
    test('adminUpload contains upload', () {
      expect(Endpoints.adminUpload, contains('upload'));
    });
    test('adminUpload starts with /api/admin', () {
      expect(Endpoints.adminUpload, startsWith('/api/admin'));
    });
  });

  group('Endpoints — App Latest Release', () {
    test('appLatestRelease contains latest-release', () {
      expect(Endpoints.appLatestRelease, contains('latest-release'));
    });
    test('appLatestRelease starts with /api/admin', () {
      expect(Endpoints.appLatestRelease, startsWith('/api/admin'));
    });
  });

  // ── General contract ──────────────────────────────────────────────────────

  group('Endpoints — General contract', () {
    test('all dynamic methods return non-empty strings', () {
      expect(Endpoints.project('x'), isNotEmpty);
      expect(Endpoints.category('x'), isNotEmpty);
      expect(Endpoints.service('x'), isNotEmpty);
      expect(Endpoints.testimonial('x'), isNotEmpty);
      expect(Endpoints.contact('x'), isNotEmpty);
      expect(Endpoints.booking('x'), isNotEmpty);
      expect(Endpoints.settingsSection('x'), isNotEmpty);
      expect(Endpoints.trashItem('x'), isNotEmpty);
    });
    test('dynamic methods with empty id produce slash', () {
      expect(Endpoints.project(''), endsWith('/'));
      expect(Endpoints.category(''), endsWith('/'));
    });
  });
}
