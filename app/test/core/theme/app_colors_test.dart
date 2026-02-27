import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/core/theme/app_colors.dart';

void main() {
  group('AppColors — lightPrimary', () {
    test(
      'is Color(0xFF6C0A0A)',
      () => expect(AppColors.lightPrimary, const Color(0xFF6C0A0A)),
    );
    test('is fully opaque', () => expect(AppColors.lightPrimary.alpha, 255));
    test(
      'has red > green',
      () => expect(
        AppColors.lightPrimary.red,
        greaterThan(AppColors.lightPrimary.green),
      ),
    );
    test(
      'has red > blue',
      () => expect(
        AppColors.lightPrimary.red,
        greaterThan(AppColors.lightPrimary.blue),
      ),
    );
  });

  group('AppColors — lightBackground', () {
    test(
      'is Color(0xFFFFF8FC)',
      () => expect(AppColors.lightBackground, const Color(0xFFFFF8FC)),
    );
    test(
      'is near white (red > 250)',
      () => expect(AppColors.lightBackground.red, greaterThan(250)),
    );
    test(
      'is near white (green > 245)',
      () => expect(AppColors.lightBackground.green, greaterThan(245)),
    );
    test(
      'is near white (blue > 248)',
      () => expect(AppColors.lightBackground.blue, greaterThan(248)),
    );
    test('is fully opaque', () => expect(AppColors.lightBackground.alpha, 255));
  });

  group('AppColors — lightForeground', () {
    test(
      'is Color(0xFF1A050A)',
      () => expect(AppColors.lightForeground, const Color(0xFF1A050A)),
    );
    test(
      'is dark (red < 30)',
      () => expect(AppColors.lightForeground.red, lessThan(30)),
    );
    test('is fully opaque', () => expect(AppColors.lightForeground.alpha, 255));
  });

  group('AppColors — lightCard', () {
    test(
      'is white',
      () => expect(AppColors.lightCard, const Color(0xFFFFFFFF)),
    );
    test('red is 255', () => expect(AppColors.lightCard.red, 255));
    test('green is 255', () => expect(AppColors.lightCard.green, 255));
    test('blue is 255', () => expect(AppColors.lightCard.blue, 255));
    test('alpha is 255', () => expect(AppColors.lightCard.alpha, 255));
  });

  group('AppColors — lightSecondary', () {
    test(
      'is Color(0xFFFCE7F3)',
      () => expect(AppColors.lightSecondary, const Color(0xFFFCE7F3)),
    );
    test(
      'is pinkish (blue > green roughly)',
      () => expect(AppColors.lightSecondary.blue, greaterThan(230)),
    );
    test('is fully opaque', () => expect(AppColors.lightSecondary.alpha, 255));
  });

  group('AppColors — lightMuted', () {
    test(
      'is Color(0xFFF5F5F5)',
      () => expect(AppColors.lightMuted, const Color(0xFFF5F5F5)),
    );
    test('red equals green equals blue (neutral)', () {
      expect(AppColors.lightMuted.red, AppColors.lightMuted.green);
      expect(AppColors.lightMuted.green, AppColors.lightMuted.blue);
    });
  });

  group('AppColors — lightAccent', () {
    test(
      'is Color(0xFFFFF1F9)',
      () => expect(AppColors.lightAccent, const Color(0xFFFFF1F9)),
    );
    test(
      'is light pinkish',
      () => expect(AppColors.lightAccent.blue, greaterThan(240)),
    );
  });

  group('AppColors — lightBorder', () {
    test(
      'is Color(0xFFE5E5E5)',
      () => expect(AppColors.lightBorder, const Color(0xFFE5E5E5)),
    );
    test('is neutral gray (r==g==b)', () {
      expect(AppColors.lightBorder.red, AppColors.lightBorder.green);
      expect(AppColors.lightBorder.green, AppColors.lightBorder.blue);
    });
    test('is fully opaque', () => expect(AppColors.lightBorder.alpha, 255));
    test(
      'is light (red > 200)',
      () => expect(AppColors.lightBorder.red, greaterThan(200)),
    );
  });

  group('AppColors — darkPrimary', () {
    test(
      'is Color(0xFFFB7185)',
      () => expect(AppColors.darkPrimary, const Color(0xFFFB7185)),
    );
    test(
      'is a rose/pink (red > 200)',
      () => expect(AppColors.darkPrimary.red, greaterThan(200)),
    );
    test('is fully opaque', () => expect(AppColors.darkPrimary.alpha, 255));
    test(
      'differs from lightPrimary',
      () => expect(AppColors.darkPrimary, isNot(AppColors.lightPrimary)),
    );
  });

  group('AppColors — darkBackground', () {
    test(
      'is Color(0xFF0F0505)',
      () => expect(AppColors.darkBackground, const Color(0xFF0F0505)),
    );
    test(
      'is near black (red < 20)',
      () => expect(AppColors.darkBackground.red, lessThan(20)),
    );
    test(
      'is near black (green < 10)',
      () => expect(AppColors.darkBackground.green, lessThan(10)),
    );
    test(
      'is near black (blue < 10)',
      () => expect(AppColors.darkBackground.blue, lessThan(10)),
    );
    test(
      'differs from lightBackground',
      () => expect(AppColors.darkBackground, isNot(AppColors.lightBackground)),
    );
  });

  group('AppColors — darkForeground', () {
    test(
      'is Color(0xFFFAFAFA)',
      () => expect(AppColors.darkForeground, const Color(0xFFFAFAFA)),
    );
    test(
      'is near white (red >= 250)',
      () => expect(AppColors.darkForeground.red, greaterThanOrEqualTo(250)),
    );
    test(
      'differs from lightForeground',
      () => expect(AppColors.darkForeground, isNot(AppColors.lightForeground)),
    );
  });

  group('AppColors — darkCard', () {
    test(
      'is Color(0xFF1C0A0F)',
      () => expect(AppColors.darkCard, const Color(0xFF1C0A0F)),
    );
    test('is dark', () => expect(AppColors.darkCard.red, lessThan(30)));
  });

  group('AppColors — darkSecondary', () {
    test(
      'is Color(0xFF881337)',
      () => expect(AppColors.darkSecondary, const Color(0xFF881337)),
    );
    test(
      'is deep red',
      () => expect(AppColors.darkSecondary.red, greaterThan(100)),
    );
    test(
      'has low blue',
      () => expect(AppColors.darkSecondary.blue, lessThan(60)),
    );
  });

  group('AppColors — darkMuted / darkAccent / darkBorder are same', () {
    test(
      'darkMuted == darkAccent',
      () => expect(AppColors.darkMuted, AppColors.darkAccent),
    );
    test(
      'darkMuted == darkBorder',
      () => expect(AppColors.darkMuted, AppColors.darkBorder),
    );
    test('all are Color(0xFF2A1015)', () {
      const expected = Color(0xFF2A1015);
      expect(AppColors.darkMuted, expected);
      expect(AppColors.darkAccent, expected);
      expect(AppColors.darkBorder, expected);
    });
  });

  group('AppColors — success', () {
    test(
      'is Color(0xFF10B981)',
      () => expect(AppColors.success, const Color(0xFF10B981)),
    );
    test(
      'green channel dominates',
      () => expect(AppColors.success.green, greaterThan(AppColors.success.red)),
    );
    test('is fully opaque', () => expect(AppColors.success.alpha, 255));
  });

  group('AppColors — warning', () {
    test(
      'is Color(0xFFF59E0B)',
      () => expect(AppColors.warning, const Color(0xFFF59E0B)),
    );
    test(
      'red channel is high',
      () => expect(AppColors.warning.red, greaterThan(200)),
    );
    test('is fully opaque', () => expect(AppColors.warning.alpha, 255));
  });

  group('AppColors — destructive', () {
    test(
      'is Color(0xFFEF4444)',
      () => expect(AppColors.destructive, const Color(0xFFEF4444)),
    );
    test(
      'red channel dominates',
      () => expect(
        AppColors.destructive.red,
        greaterThan(AppColors.destructive.green),
      ),
    );
    test('is fully opaque', () => expect(AppColors.destructive.alpha, 255));
  });

  group('AppColors — info', () {
    test(
      'is Color(0xFF3B82F6)',
      () => expect(AppColors.info, const Color(0xFF3B82F6)),
    );
    test(
      'blue channel is high',
      () => expect(AppColors.info.blue, greaterThan(200)),
    );
    test('is fully opaque', () => expect(AppColors.info.alpha, 255));
  });

  group('AppColors — entity category colors', () {
    test(
      'categoriesColor is Color(0xFF7C3AED)',
      () => expect(AppColors.categoriesColor, const Color(0xFF7C3AED)),
    );
    test(
      'servicesColor is Color(0xFF0891B2)',
      () => expect(AppColors.servicesColor, const Color(0xFF0891B2)),
    );
    test('categoriesColor and servicesColor are different', () {
      expect(AppColors.categoriesColor, isNot(AppColors.servicesColor));
    });
    test('categoriesColor is purple (blue > red for visual)', () {
      expect(
        AppColors.categoriesColor.blue,
        greaterThan(AppColors.categoriesColor.red),
      );
    });
    test('servicesColor is cyan (blue > red)', () {
      expect(
        AppColors.servicesColor.blue,
        greaterThan(AppColors.servicesColor.red),
      );
    });
  });

  group('AppColors — light semantic variants', () {
    test(
      'successLight is Color(0xFFD1FAE5)',
      () => expect(AppColors.successLight, const Color(0xFFD1FAE5)),
    );
    test(
      'warningLight is Color(0xFFFEF3C7)',
      () => expect(AppColors.warningLight, const Color(0xFFFEF3C7)),
    );
    test(
      'destructiveLight is Color(0xFFFEE2E2)',
      () => expect(AppColors.destructiveLight, const Color(0xFFFEE2E2)),
    );
    test(
      'infoLight is Color(0xFFDBEAFE)',
      () => expect(AppColors.infoLight, const Color(0xFFDBEAFE)),
    );
    test('successLight is lighter than success (higher green channel)', () {
      expect(
        AppColors.successLight.green,
        greaterThan(AppColors.success.green),
      );
    });
    test(
      'destructiveLight is lighter than destructive (higher blue channel)',
      () {
        expect(
          AppColors.destructiveLight.blue,
          greaterThan(AppColors.destructive.blue),
        );
      },
    );
    test('warningLight is lighter than warning (higher blue channel)', () {
      expect(AppColors.warningLight.blue, greaterThan(AppColors.warning.blue));
    });
    test('infoLight is lighter than info (higher red channel)', () {
      expect(AppColors.infoLight.red, greaterThan(AppColors.info.red));
    });
  });

  group('AppColors — has correct contrast pairing (light vs dark)', () {
    test('lightBackground is lighter than darkBackground', () {
      final lightBrightness =
          AppColors.lightBackground.red +
          AppColors.lightBackground.green +
          AppColors.lightBackground.blue;
      final darkBrightness =
          AppColors.darkBackground.red +
          AppColors.darkBackground.green +
          AppColors.darkBackground.blue;
      expect(lightBrightness, greaterThan(darkBrightness));
    });

    test('darkForeground is lighter than lightForeground', () {
      final darkBrightness =
          AppColors.darkForeground.red +
          AppColors.darkForeground.green +
          AppColors.darkForeground.blue;
      final lightBrightness =
          AppColors.lightForeground.red +
          AppColors.lightForeground.green +
          AppColors.lightForeground.blue;
      expect(darkBrightness, greaterThan(lightBrightness));
    });

    test('darkBackground has warmth (red > blue)', () {
      expect(
        AppColors.darkBackground.red,
        greaterThanOrEqualTo(AppColors.darkBackground.blue),
      );
    });

    test('lightBackground has warmth (blue > green slightly)', () {
      expect(
        AppColors.lightBackground.blue,
        greaterThanOrEqualTo(AppColors.lightBackground.green),
      );
    });
  });

  group('AppColors — priority colors', () {
    test(
      'priorityHigh is Color(0xFFEF4444)',
      () => expect(AppColors.priorityHigh, const Color(0xFFEF4444)),
    );
    test(
      'priorityMedium is Color(0xFFF59E0B)',
      () => expect(AppColors.priorityMedium, const Color(0xFFF59E0B)),
    );
    test(
      'priorityLow is Color(0xFF9CA3AF)',
      () => expect(AppColors.priorityLow, const Color(0xFF9CA3AF)),
    );
    test(
      'priorityHigh == destructive',
      () => expect(AppColors.priorityHigh, AppColors.destructive),
    );
    test(
      'priorityMedium == warning',
      () => expect(AppColors.priorityMedium, AppColors.warning),
    );
    test(
      'priorityHighLight is Color(0xFFFEE2E2)',
      () => expect(AppColors.priorityHighLight, const Color(0xFFFEE2E2)),
    );
    test(
      'priorityMediumLight is Color(0xFFFEF3C7)',
      () => expect(AppColors.priorityMediumLight, const Color(0xFFFEF3C7)),
    );
    test(
      'priorityLowLight is Color(0xFFF3F4F6)',
      () => expect(AppColors.priorityLowLight, const Color(0xFFF3F4F6)),
    );
    test(
      'priorityHighLight == destructiveLight',
      () => expect(AppColors.priorityHighLight, AppColors.destructiveLight),
    );
    test('priority colors are all distinct', () {
      expect(AppColors.priorityHigh, isNot(AppColors.priorityMedium));
      expect(AppColors.priorityMedium, isNot(AppColors.priorityLow));
    });
  });

  group('AppColors — general opaqueness', () {
    test('all semantic colors are fully opaque', () {
      const semanticColors = [
        AppColors.success,
        AppColors.warning,
        AppColors.destructive,
        AppColors.info,
        AppColors.successLight,
        AppColors.warningLight,
        AppColors.destructiveLight,
        AppColors.infoLight,
      ];
      for (final color in semanticColors) {
        expect(color.alpha, 255);
      }
    });

    test('all light theme colors are fully opaque', () {
      const lightColors = [
        AppColors.lightPrimary,
        AppColors.lightBackground,
        AppColors.lightForeground,
        AppColors.lightCard,
        AppColors.lightSecondary,
        AppColors.lightMuted,
        AppColors.lightAccent,
        AppColors.lightBorder,
      ];
      for (final color in lightColors) {
        expect(color.alpha, 255);
      }
    });

    test('all dark theme colors are fully opaque', () {
      const darkColors = [
        AppColors.darkPrimary,
        AppColors.darkBackground,
        AppColors.darkForeground,
        AppColors.darkCard,
        AppColors.darkSecondary,
        AppColors.darkMuted,
        AppColors.darkAccent,
        AppColors.darkBorder,
      ];
      for (final color in darkColors) {
        expect(color.alpha, 255);
      }
    });
  });
}
