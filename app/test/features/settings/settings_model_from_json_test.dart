import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/features/settings/data/settings_model.dart';

void main() {
  // ── AboutSettings ─────────────────────────────────────────────────────────

  group('AboutSettings.fromJson — required fields', () {
    test('empty JSON parses with all nulls', () {
      final s = AboutSettings.fromJson({});
      expect(s.id, isNull);
      expect(s.bioTitle, isNull);
      expect(s.bioDescription, isNull);
      expect(s.profileImageUrl, isNull);
    });

    test(
      'defaults: skills is empty list',
      () => expect(AboutSettings.fromJson({}).skills, isEmpty),
    );
    test(
      'defaults: certifications is empty list',
      () => expect(AboutSettings.fromJson({}).certifications, isEmpty),
    );
    test(
      'defaults: isActive is true',
      () => expect(AboutSettings.fromJson({}).isActive, isTrue),
    );

    test('parses id', () {
      expect(AboutSettings.fromJson({'id': 'about-1'}).id, 'about-1');
    });
    test('parses bioTitle', () {
      expect(
        AboutSettings.fromJson({'bioTitle': 'About Me'}).bioTitle,
        'About Me',
      );
    });
    test('parses bioDescription', () {
      expect(
        AboutSettings.fromJson({'bioDescription': 'Desc text'}).bioDescription,
        'Desc text',
      );
    });
    test('parses profileImageUrl', () {
      expect(
        AboutSettings.fromJson({
          'profileImageUrl': 'https://x.com/img.jpg',
        }).profileImageUrl,
        'https://x.com/img.jpg',
      );
    });
    test('parses skills list', () {
      expect(
        AboutSettings.fromJson({
          'skills': ['Flutter', 'Dart'],
        }).skills,
        ['Flutter', 'Dart'],
      );
    });
    test('parses certifications list', () {
      expect(
        AboutSettings.fromJson({
          'certifications': ['cert1'],
        }).certifications,
        ['cert1'],
      );
    });
    test('parses yearsExperience', () {
      expect(AboutSettings.fromJson({'yearsExperience': 5}).yearsExperience, 5);
    });
    test('parses isActive = false', () {
      expect(AboutSettings.fromJson({'isActive': false}).isActive, isFalse);
    });
  });

  group('AboutSettings — copyWith', () {
    const settings = AboutSettings(bioTitle: 'Original');
    test('copyWith bioTitle changes', () {
      expect(settings.copyWith(bioTitle: 'Updated').bioTitle, 'Updated');
    });
    test('copyWith other fields unchanged', () {
      expect(settings.copyWith(bioTitle: 'Updated').id, isNull);
    });
    test('equality for same values', () {
      expect(
        const AboutSettings(bioTitle: 'Same'),
        const AboutSettings(bioTitle: 'Same'),
      );
    });
  });

  // ── ContactSettings ───────────────────────────────────────────────────────

  group('ContactSettings.fromJson', () {
    test('empty JSON has sensible defaults', () {
      final s = ContactSettings.fromJson({});
      expect(s.id, isNull);
      expect(s.showSocialLinks, isTrue);
      expect(s.isActive, isTrue);
    });

    test('parses pageTitle', () {
      expect(
        ContactSettings.fromJson({'pageTitle': 'Contact'}).pageTitle,
        'Contact',
      );
    });
    test('parses ownerName', () {
      expect(
        ContactSettings.fromJson({'ownerName': 'Paola'}).ownerName,
        'Paola',
      );
    });
    test('parses email', () {
      expect(
        ContactSettings.fromJson({'email': 'p@test.com'}).email,
        'p@test.com',
      );
    });
    test('parses phone', () {
      expect(
        ContactSettings.fromJson({'phone': '+34 600 000 000'}).phone,
        '+34 600 000 000',
      );
    });
    test('parses whatsapp', () {
      expect(
        ContactSettings.fromJson({'whatsapp': '+34 600 000 001'}).whatsapp,
        '+34 600 000 001',
      );
    });
    test('parses location', () {
      expect(
        ContactSettings.fromJson({'location': 'Madrid, Spain'}).location,
        'Madrid, Spain',
      );
    });
    test('parses showSocialLinks = false', () {
      expect(
        ContactSettings.fromJson({'showSocialLinks': false}).showSocialLinks,
        isFalse,
      );
    });
    test('parses successMessage', () {
      expect(
        ContactSettings.fromJson({'successMessage': 'Thanks!'}).successMessage,
        'Thanks!',
      );
    });
  });

  // ── ThemeSettings ─────────────────────────────────────────────────────────

  group('ThemeSettings.fromJson', () {
    test('defaults primaryColor to "#6c0a0a"', () {
      expect(ThemeSettings.fromJson({}).primaryColor, '#6c0a0a');
    });
    test('defaults headingFont to "Poppins"', () {
      expect(ThemeSettings.fromJson({}).headingFont, 'Poppins');
    });
    test('defaults bodyFont to "Open Sans"', () {
      expect(ThemeSettings.fromJson({}).bodyFont, 'Open Sans');
    });
    test('defaults scriptFont to "Great Vibes"', () {
      expect(ThemeSettings.fromJson({}).scriptFont, 'Great Vibes');
    });
    test('defaults borderRadius to 40', () {
      expect(ThemeSettings.fromJson({}).borderRadius, 40);
    });
    test('defaults isActive to true', () {
      expect(ThemeSettings.fromJson({}).isActive, isTrue);
    });
    test('parses primaryColor', () {
      expect(
        ThemeSettings.fromJson({'primaryColor': '#FF0000'}).primaryColor,
        '#FF0000',
      );
    });
    test('parses borderRadius', () {
      expect(ThemeSettings.fromJson({'borderRadius': 24}).borderRadius, 24);
    });
    test('parses all font fields', () {
      final s = ThemeSettings.fromJson({
        'headingFont': 'Inter',
        'bodyFont': 'Roboto',
        'scriptFont': 'Dancing Script',
      });
      expect(s.headingFont, 'Inter');
      expect(s.bodyFont, 'Roboto');
      expect(s.scriptFont, 'Dancing Script');
    });
  });

  group('ThemeSettings — copyWith and equality', () {
    test('copyWith primaryColor', () {
      const t = ThemeSettings();
      expect(t.copyWith(primaryColor: '#000000').primaryColor, '#000000');
    });
    test('two defaults are equal', () {
      expect(const ThemeSettings(), const ThemeSettings());
    });
    test('different primaryColor → different instances', () {
      expect(
        const ThemeSettings(primaryColor: '#fff'),
        isNot(const ThemeSettings()),
      );
    });
  });

  // ── SiteSettings ──────────────────────────────────────────────────────────

  group('SiteSettings.fromJson', () {
    test('default siteName is Paola\'s name', () {
      expect(
        SiteSettings.fromJson({}).siteName,
        'Paola Bolívar Nievas - Make-up Artist',
      );
    });
    test('parses custom siteName', () {
      expect(
        SiteSettings.fromJson({'siteName': 'My Site'}).siteName,
        'My Site',
      );
    });
    test('defaults maintenanceMode to false', () {
      expect(SiteSettings.fromJson({}).maintenanceMode, isFalse);
    });
    test('defaults showAboutPage to true', () {
      expect(SiteSettings.fromJson({}).showAboutPage, isTrue);
    });
    test('defaults showProjectsPage to true', () {
      expect(SiteSettings.fromJson({}).showProjectsPage, isTrue);
    });
    test('parses maintenanceMode = true', () {
      expect(
        SiteSettings.fromJson({'maintenanceMode': true}).maintenanceMode,
        isTrue,
      );
    });
    test('parses googleAnalyticsId', () {
      expect(
        SiteSettings.fromJson({
          'googleAnalyticsId': 'G-XXXX',
        }).googleAnalyticsId,
        'G-XXXX',
      );
    });
    test('logoUrl is null when not provided', () {
      expect(SiteSettings.fromJson({}).logoUrl, isNull);
    });
  });

  group('SiteSettings — copyWith', () {
    test('copyWith siteName', () {
      const s = SiteSettings();
      expect(s.copyWith(siteName: 'New Name').siteName, 'New Name');
    });
    test('copyWith maintenanceMode', () {
      const s = SiteSettings();
      expect(s.copyWith(maintenanceMode: true).maintenanceMode, isTrue);
    });
    test('default instances are equal', () {
      expect(const SiteSettings(), const SiteSettings());
    });
  });
}
