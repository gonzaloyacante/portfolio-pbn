import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:portfolio_pbn/core/theme/app_typography.dart';
import 'package:portfolio_pbn/core/theme/app_colors.dart';

/// Typography tests use testWidgets context so GoogleFonts can use
/// the widget binding + disable network fetching correctly.
void main() {
  setUpAll(() {
    GoogleFonts.config.allowRuntimeFetching = false;
  });

  // ── API surface ───────────────────────────────────────────────────────────

  group('AppTypography — API surface', () {
    testWidgets('textTheme returns TextTheme for light', (tester) async {
      final theme = AppTypography.textTheme(Brightness.light);
      expect(theme, isA<TextTheme>());
    });

    testWidgets('textTheme returns TextTheme for dark', (tester) async {
      final theme = AppTypography.textTheme(Brightness.dark);
      expect(theme, isA<TextTheme>());
    });

    testWidgets('decorativeTitle returns TextStyle', (tester) async {
      final style = AppTypography.decorativeTitle(const Color(0xFF000000));
      expect(style, isA<TextStyle>());
    });

    testWidgets('light and dark themes have different colors', (tester) async {
      final light = AppTypography.textTheme(Brightness.light);
      final dark = AppTypography.textTheme(Brightness.dark);
      expect(light.headlineLarge!.color, isNot(dark.headlineLarge!.color));
    });
  });

  // ── Light theme font sizes ────────────────────────────────────────────────

  group('AppTypography.textTheme light — font sizes', () {
    testWidgets('displayLarge fontSize == 57', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).displayLarge!.fontSize,
        57,
      );
    });
    testWidgets('displayMedium fontSize == 45', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).displayMedium!.fontSize,
        45,
      );
    });
    testWidgets('displaySmall fontSize == 36', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).displaySmall!.fontSize,
        36,
      );
    });
    testWidgets('headlineLarge fontSize == 32', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).headlineLarge!.fontSize,
        32,
      );
    });
    testWidgets('headlineMedium fontSize == 28', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).headlineMedium!.fontSize,
        28,
      );
    });
    testWidgets('headlineSmall fontSize == 24', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).headlineSmall!.fontSize,
        24,
      );
    });
    testWidgets('titleLarge fontSize == 22', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).titleLarge!.fontSize,
        22,
      );
    });
    testWidgets('titleMedium fontSize == 16', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).titleMedium!.fontSize,
        16,
      );
    });
    testWidgets('titleSmall fontSize == 14', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).titleSmall!.fontSize,
        14,
      );
    });
    testWidgets('bodyLarge fontSize == 16', (tester) async {
      expect(AppTypography.textTheme(Brightness.light).bodyLarge!.fontSize, 16);
    });
    testWidgets('bodyMedium fontSize == 14', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).bodyMedium!.fontSize,
        14,
      );
    });
    testWidgets('bodySmall fontSize == 12', (tester) async {
      expect(AppTypography.textTheme(Brightness.light).bodySmall!.fontSize, 12);
    });
    testWidgets('labelLarge fontSize == 14', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).labelLarge!.fontSize,
        14,
      );
    });
    testWidgets('labelMedium fontSize == 12', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).labelMedium!.fontSize,
        12,
      );
    });
    testWidgets('labelSmall fontSize == 11', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).labelSmall!.fontSize,
        11,
      );
    });
  });

  // ── Light theme fontWeights ───────────────────────────────────────────────

  group('AppTypography.textTheme light — font weights', () {
    testWidgets('displayLarge fontWeight == w400', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).displayLarge!.fontWeight,
        FontWeight.w400,
      );
    });
    testWidgets('headlineLarge fontWeight == w700', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).headlineLarge!.fontWeight,
        FontWeight.w700,
      );
    });
    testWidgets('headlineMedium fontWeight == w700', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).headlineMedium!.fontWeight,
        FontWeight.w700,
      );
    });
    testWidgets('headlineSmall fontWeight == w600', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).headlineSmall!.fontWeight,
        FontWeight.w600,
      );
    });
    testWidgets('titleLarge fontWeight == w600', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).titleLarge!.fontWeight,
        FontWeight.w600,
      );
    });
    testWidgets('bodyLarge fontWeight == w400', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).bodyLarge!.fontWeight,
        FontWeight.w400,
      );
    });
    testWidgets('labelLarge fontWeight == w600', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).labelLarge!.fontWeight,
        FontWeight.w600,
      );
    });
    testWidgets('labelSmall fontWeight == w500', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).labelSmall!.fontWeight,
        FontWeight.w500,
      );
    });
  });

  // ── Light theme colors ────────────────────────────────────────────────────

  group('AppTypography.textTheme light — colors', () {
    testWidgets('headlineLarge color == lightForeground', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).headlineLarge!.color,
        AppColors.lightForeground,
      );
    });
    testWidgets('bodyLarge color == lightForeground', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).bodyLarge!.color,
        AppColors.lightForeground,
      );
    });
    testWidgets('displayLarge color == lightForeground', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).displayLarge!.color,
        AppColors.lightForeground,
      );
    });
    testWidgets('bodySmall color is muted (alpha < 255)', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).bodySmall!.color!.alpha,
        lessThan(255),
      );
    });
    testWidgets('labelSmall color is muted (alpha < 255)', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.light).labelSmall!.color!.alpha,
        lessThan(255),
      );
    });
  });

  // ── Dark theme ────────────────────────────────────────────────────────────

  group('AppTypography.textTheme dark', () {
    testWidgets('headlineLarge color == darkForeground', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.dark).headlineLarge!.color,
        AppColors.darkForeground,
      );
    });
    testWidgets('bodyLarge color == darkForeground', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.dark).bodyLarge!.color,
        AppColors.darkForeground,
      );
    });
    testWidgets('bodySmall is muted (alpha < 255)', (tester) async {
      expect(
        AppTypography.textTheme(Brightness.dark).bodySmall!.color!.alpha,
        lessThan(255),
      );
    });
    testWidgets('font sizes equal in light and dark', (tester) async {
      final light = AppTypography.textTheme(Brightness.light);
      final dark = AppTypography.textTheme(Brightness.dark);
      expect(dark.headlineLarge!.fontSize, light.headlineLarge!.fontSize);
    });
  });

  // ── Font size hierarchy ───────────────────────────────────────────────────

  group('AppTypography.textTheme — size hierarchy', () {
    testWidgets('display: Large > Medium > Small', (tester) async {
      final t = AppTypography.textTheme(Brightness.light);
      expect(t.displayLarge!.fontSize, greaterThan(t.displayMedium!.fontSize!));
      expect(t.displayMedium!.fontSize, greaterThan(t.displaySmall!.fontSize!));
    });
    testWidgets('headline: Large > Medium > Small', (tester) async {
      final t = AppTypography.textTheme(Brightness.light);
      expect(
        t.headlineLarge!.fontSize,
        greaterThan(t.headlineMedium!.fontSize!),
      );
      expect(
        t.headlineMedium!.fontSize,
        greaterThan(t.headlineSmall!.fontSize!),
      );
    });
    testWidgets('title: Large > Medium > Small', (tester) async {
      final t = AppTypography.textTheme(Brightness.light);
      expect(t.titleLarge!.fontSize, greaterThan(t.titleMedium!.fontSize!));
      expect(t.titleMedium!.fontSize, greaterThan(t.titleSmall!.fontSize!));
    });
    testWidgets('body: Large > Medium > Small', (tester) async {
      final t = AppTypography.textTheme(Brightness.light);
      expect(t.bodyLarge!.fontSize, greaterThan(t.bodyMedium!.fontSize!));
      expect(t.bodyMedium!.fontSize, greaterThan(t.bodySmall!.fontSize!));
    });
    testWidgets('label: Large > Medium > Small', (tester) async {
      final t = AppTypography.textTheme(Brightness.light);
      expect(t.labelLarge!.fontSize, greaterThan(t.labelMedium!.fontSize!));
      expect(t.labelMedium!.fontSize, greaterThan(t.labelSmall!.fontSize!));
    });
  });

  // ── decorativeTitle ───────────────────────────────────────────────────────

  group('AppTypography.decorativeTitle', () {
    testWidgets('uses provided color', (tester) async {
      const color = Color(0xFFFF0000);
      final style = AppTypography.decorativeTitle(color);
      expect(style.color, color);
    });

    testWidgets('default fontSize is 48', (tester) async {
      final style = AppTypography.decorativeTitle(const Color(0xFF000000));
      expect(style.fontSize, 48);
    });

    testWidgets('custom fontSize is respected', (tester) async {
      final style = AppTypography.decorativeTitle(
        const Color(0xFF000000),
        fontSize: 64,
      );
      expect(style.fontSize, 64);
    });

    testWidgets('different fontSize inputs produce different sizes', (
      tester,
    ) async {
      final s1 = AppTypography.decorativeTitle(
        const Color(0xFF000000),
        fontSize: 32,
      );
      final s2 = AppTypography.decorativeTitle(
        const Color(0xFF000000),
        fontSize: 64,
      );
      expect(s1.fontSize, isNot(s2.fontSize));
    });

    testWidgets('different colors produce different styles', (tester) async {
      final s1 = AppTypography.decorativeTitle(const Color(0xFFFF0000));
      final s2 = AppTypography.decorativeTitle(const Color(0xFF0000FF));
      expect(s1.color, isNot(s2.color));
    });
  });
}
