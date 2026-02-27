import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/features/settings/data/settings_model.dart';

void main() {
  // ── AboutSettings ───────────────────────────────────────────────────────

  group('AboutSettings — defaults', () {
    const s = AboutSettings();

    test('skills defaults to empty list', () => expect(s.skills, isEmpty));
    test(
      'certifications defaults to empty list',
      () => expect(s.certifications, isEmpty),
    );
    test('isActive defaults to true', () => expect(s.isActive, true));
    test('bioTitle defaults to null', () => expect(s.bioTitle, isNull));
    test(
      'profileImageUrl defaults to null',
      () => expect(s.profileImageUrl, isNull),
    );
    test(
      'yearsExperience defaults to null',
      () => expect(s.yearsExperience, isNull),
    );
  });

  group('AboutSettings — with values', () {
    const s = AboutSettings(
      bioTitle: 'Sobre mí',
      yearsExperience: 10,
      skills: ['Maquillaje', 'Fotografía'],
    );

    test('stores bioTitle', () => expect(s.bioTitle, 'Sobre mí'));
    test('stores yearsExperience', () => expect(s.yearsExperience, 10));
    test('stores skills', () => expect(s.skills, ['Maquillaje', 'Fotografía']));
  });

  group('AboutSettings — equality', () {
    test('same values are equal', () {
      const a = AboutSettings(bioTitle: 'T');
      const b = AboutSettings(bioTitle: 'T');
      expect(a, equals(b));
    });

    test('different bioTitle makes not equal', () {
      const a = AboutSettings(bioTitle: 'T1');
      const b = AboutSettings(bioTitle: 'T2');
      expect(a, isNot(equals(b)));
    });
  });

  // ── ContactSettings ─────────────────────────────────────────────────────

  group('ContactSettings — defaults', () {
    const s = ContactSettings();

    test(
      'showSocialLinks defaults to true',
      () => expect(s.showSocialLinks, true),
    );
    test('isActive defaults to true', () => expect(s.isActive, true));
    test('email defaults to null', () => expect(s.email, isNull));
    test('phone defaults to null', () => expect(s.phone, isNull));
    test('whatsapp defaults to null', () => expect(s.whatsapp, isNull));
  });

  group('ContactSettings — with values', () {
    const s = ContactSettings(
      pageTitle: 'Contacto',
      email: 'paola@example.com',
      phone: '666123456',
    );

    test('stores pageTitle', () => expect(s.pageTitle, 'Contacto'));
    test('stores email', () => expect(s.email, 'paola@example.com'));
    test('stores phone', () => expect(s.phone, '666123456'));
  });

  // ── ThemeSettings ───────────────────────────────────────────────────────

  group('ThemeSettings — defaults', () {
    const s = ThemeSettings();

    test(
      'primaryColor defaults to #6c0a0a',
      () => expect(s.primaryColor, '#6c0a0a'),
    );
    test(
      'headingFont defaults to Poppins',
      () => expect(s.headingFont, 'Poppins'),
    );
    test(
      'bodyFont defaults to Open Sans',
      () => expect(s.bodyFont, 'Open Sans'),
    );
    test(
      'scriptFont defaults to Great Vibes',
      () => expect(s.scriptFont, 'Great Vibes'),
    );
    test('borderRadius defaults to 40', () => expect(s.borderRadius, 40));
    test('isActive defaults to true', () => expect(s.isActive, true));
    test(
      'darkPrimaryColor defaults to #ffaadd',
      () => expect(s.darkPrimaryColor, '#ffaadd'),
    );
  });

  group('ThemeSettings — with custom colors', () {
    const s = ThemeSettings(primaryColor: '#FF0000', borderRadius: 20);

    test('stores custom primaryColor', () => expect(s.primaryColor, '#FF0000'));
    test('stores custom borderRadius', () => expect(s.borderRadius, 20));
    test('other defaults unchanged', () => expect(s.headingFont, 'Poppins'));
  });

  group('ThemeSettings — copyWith', () {
    test('copyWith updates primaryColor', () {
      const s = ThemeSettings();
      final updated = s.copyWith(primaryColor: '#123456');
      expect(updated.primaryColor, '#123456');
      expect(updated.bodyFont, 'Open Sans');
    });
  });

  // ── SiteSettings ────────────────────────────────────────────────────────

  group('SiteSettings — defaults', () {
    const s = SiteSettings();

    test('siteName has default value', () {
      expect(s.siteName, contains('Paola'));
    });
    test(
      'maintenanceMode defaults to false',
      () => expect(s.maintenanceMode, false),
    );
    test('allowIndexing defaults to true', () => expect(s.allowIndexing, true));
    test('isActive defaults to true', () => expect(s.isActive, true));
    test('showAboutPage defaults to true', () => expect(s.showAboutPage, true));
    test(
      'showServicesPage defaults to false',
      () => expect(s.showServicesPage, false),
    );
    test(
      'showProjectsPage defaults to true',
      () => expect(s.showProjectsPage, true),
    );
    test(
      'showContactPage defaults to true',
      () => expect(s.showContactPage, true),
    );
  });

  group('SiteSettings — maintenance mode', () {
    const s = SiteSettings(
      maintenanceMode: true,
      maintenanceMessage: 'Volvemos pronto.',
    );

    test('maintenanceMode is true', () => expect(s.maintenanceMode, true));
    test(
      'maintenanceMessage stored',
      () => expect(s.maintenanceMessage, 'Volvemos pronto.'),
    );
  });

  // ── SocialLink ──────────────────────────────────────────────────────────

  group('SocialLink — construction', () {
    const link = SocialLink(
      id: 'sl1',
      platform: 'instagram',
      url: 'https://instagram.com/user',
    );

    test('stores id', () => expect(link.id, 'sl1'));
    test('stores platform', () => expect(link.platform, 'instagram'));
    test('stores url', () => expect(link.url, 'https://instagram.com/user'));
    test('username defaults to null', () => expect(link.username, isNull));
    test('icon defaults to null', () => expect(link.icon, isNull));
    test('isActive defaults to true', () => expect(link.isActive, true));
    test('sortOrder defaults to 0', () => expect(link.sortOrder, 0));
    test('createdAt defaults to null', () => expect(link.createdAt, isNull));
  });

  group('SocialLink — equality', () {
    test('same values are equal', () {
      const a = SocialLink(id: 'sl1', platform: 'ig', url: 'url');
      const b = SocialLink(id: 'sl1', platform: 'ig', url: 'url');
      expect(a, equals(b));
    });
  });
}
