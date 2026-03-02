import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/shared/widgets/status_badge.dart';

Widget _wrap(Widget child) => MaterialApp(home: Scaffold(body: child));

void main() {
  // ── appStatusFromString ─────────────────────────────────────────────────

  group('appStatusFromString', () {
    test('ACTIVE → AppStatus.active', () {
      expect(appStatusFromString('ACTIVE'), AppStatus.active);
    });

    test('INACTIVE → AppStatus.inactive', () {
      expect(appStatusFromString('INACTIVE'), AppStatus.inactive);
    });

    test('PENDING → AppStatus.pending', () {
      expect(appStatusFromString('PENDING'), AppStatus.pending);
    });

    test('APPROVED → AppStatus.approved', () {
      expect(appStatusFromString('APPROVED'), AppStatus.approved);
    });

    test('REJECTED → AppStatus.rejected', () {
      expect(appStatusFromString('REJECTED'), AppStatus.rejected);
    });

    test('CONFIRMED → AppStatus.confirmed', () {
      expect(appStatusFromString('CONFIRMED'), AppStatus.confirmed);
    });

    test('CANCELLED → AppStatus.cancelled', () {
      expect(appStatusFromString('CANCELLED'), AppStatus.cancelled);
    });

    test('CANCELED (alt spelling) → AppStatus.cancelled', () {
      expect(appStatusFromString('CANCELED'), AppStatus.cancelled);
    });

    test('FEATURED → AppStatus.featured', () {
      expect(appStatusFromString('FEATURED'), AppStatus.featured);
    });

    test('DRAFT → AppStatus.draft', () {
      expect(appStatusFromString('DRAFT'), AppStatus.draft);
    });

    test('PUBLISHED → AppStatus.published', () {
      expect(appStatusFromString('PUBLISHED'), AppStatus.published);
    });

    test('TRUE → AppStatus.published', () {
      expect(appStatusFromString('TRUE'), AppStatus.published);
    });

    test('lowercase works (active → active)', () {
      expect(appStatusFromString('active'), AppStatus.active);
    });

    test('null → AppStatus.pending (default)', () {
      expect(appStatusFromString(null), AppStatus.pending);
    });

    test('unknown string → AppStatus.pending (default)', () {
      expect(appStatusFromString('UNKNOWN_VALUE'), AppStatus.pending);
    });

    test('empty string → AppStatus.pending (default)', () {
      expect(appStatusFromString(''), AppStatus.pending);
    });
  });

  // ── StatusBadge widget ──────────────────────────────────────────────────

  group('StatusBadge — renders default label', () {
    testWidgets('active shows Activo', (tester) async {
      await tester.pumpWidget(
        _wrap(const StatusBadge(status: AppStatus.active)),
      );
      expect(find.text('Activo'), findsOneWidget);
    });

    testWidgets('inactive shows Inactivo', (tester) async {
      await tester.pumpWidget(
        _wrap(const StatusBadge(status: AppStatus.inactive)),
      );
      expect(find.text('Inactivo'), findsOneWidget);
    });

    testWidgets('pending shows Pendiente', (tester) async {
      await tester.pumpWidget(
        _wrap(const StatusBadge(status: AppStatus.pending)),
      );
      expect(find.text('Pendiente'), findsOneWidget);
    });

    testWidgets('cancelled shows Cancelada', (tester) async {
      await tester.pumpWidget(
        _wrap(const StatusBadge(status: AppStatus.cancelled)),
      );
      expect(find.text('Cancelada'), findsOneWidget);
    });

    testWidgets('featured shows Destacado', (tester) async {
      await tester.pumpWidget(
        _wrap(const StatusBadge(status: AppStatus.featured)),
      );
      expect(find.text('Destacado'), findsOneWidget);
    });

    testWidgets('draft shows Borrador', (tester) async {
      await tester.pumpWidget(
        _wrap(const StatusBadge(status: AppStatus.draft)),
      );
      expect(find.text('Borrador'), findsOneWidget);
    });

    testWidgets('published shows Publicado', (tester) async {
      await tester.pumpWidget(
        _wrap(const StatusBadge(status: AppStatus.published)),
      );
      expect(find.text('Publicado'), findsOneWidget);
    });

    testWidgets('approved shows Aprobado', (tester) async {
      await tester.pumpWidget(
        _wrap(const StatusBadge(status: AppStatus.approved)),
      );
      expect(find.text('Aprobado'), findsOneWidget);
    });

    testWidgets('rejected shows Rechazado', (tester) async {
      await tester.pumpWidget(
        _wrap(const StatusBadge(status: AppStatus.rejected)),
      );
      expect(find.text('Rechazado'), findsOneWidget);
    });
  });

  group('StatusBadge — custom label', () {
    testWidgets('uses custom label when provided', (tester) async {
      await tester.pumpWidget(
        _wrap(
          const StatusBadge(status: AppStatus.active, label: 'Mi etiqueta'),
        ),
      );
      expect(find.text('Mi etiqueta'), findsOneWidget);
      expect(find.text('Activo'), findsNothing);
    });
  });

  group('StatusBadge — compact mode', () {
    testWidgets('compact does not show text', (tester) async {
      await tester.pumpWidget(
        _wrap(const StatusBadge(status: AppStatus.active, compact: true)),
      );
      expect(find.text('Activo'), findsNothing);
    });

    testWidgets('compact renders a Container (dot)', (tester) async {
      await tester.pumpWidget(
        _wrap(const StatusBadge(status: AppStatus.pending, compact: true)),
      );
      expect(find.byType(Container), findsWidgets);
    });
  });

  group('StatusBadge — small mode', () {
    testWidgets('small still renders the label', (tester) async {
      await tester.pumpWidget(
        _wrap(const StatusBadge(status: AppStatus.active, small: true)),
      );
      expect(find.text('Activo'), findsOneWidget);
    });
  });
}
