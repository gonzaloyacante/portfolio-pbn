import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/shared/widgets/error_state.dart';

Widget _wrap(Widget child) => MaterialApp(home: Scaffold(body: child));

void main() {
  // ── ErrorState ──────────────────────────────────────────────────────────

  group('ErrorState — renders required content', () {
    testWidgets('shows message text', (tester) async {
      await tester.pumpWidget(
        _wrap(const ErrorState(message: 'No se pudo cargar los proyectos')),
      );
      expect(find.text('No se pudo cargar los proyectos'), findsOneWidget);
    });

    testWidgets('shows static heading "Algo salió mal"', (tester) async {
      await tester.pumpWidget(_wrap(const ErrorState(message: 'Error de red')));
      expect(find.text('Algo salió mal'), findsOneWidget);
    });

    testWidgets('renders default error icon when none provided', (
      tester,
    ) async {
      await tester.pumpWidget(_wrap(const ErrorState(message: 'Error')));
      expect(find.byIcon(Icons.error_outline_rounded), findsOneWidget);
    });
  });

  group('ErrorState — custom icon', () {
    testWidgets('renders custom icon when provided', (tester) async {
      await tester.pumpWidget(
        _wrap(
          const ErrorState(
            message: 'Sin conexión',
            icon: Icons.wifi_off_rounded,
          ),
        ),
      );
      expect(find.byIcon(Icons.wifi_off_rounded), findsOneWidget);
    });

    testWidgets('does not render default icon when custom icon provided', (
      tester,
    ) async {
      await tester.pumpWidget(
        _wrap(const ErrorState(message: 'Error', icon: Icons.wifi_off_rounded)),
      );
      expect(find.byIcon(Icons.error_outline_rounded), findsNothing);
    });
  });

  group('ErrorState — retry button', () {
    testWidgets('shows retry button when onRetry is set', (tester) async {
      await tester.pumpWidget(
        _wrap(ErrorState(message: 'Error', onRetry: () {})),
      );
      expect(find.text('Intentar de nuevo'), findsOneWidget);
    });

    testWidgets('does not show retry button when onRetry is null', (
      tester,
    ) async {
      await tester.pumpWidget(_wrap(const ErrorState(message: 'Error')));
      expect(find.text('Intentar de nuevo'), findsNothing);
    });

    testWidgets('onRetry callback is triggered on tap', (tester) async {
      var retried = false;
      await tester.pumpWidget(
        _wrap(ErrorState(message: 'Error', onRetry: () => retried = true)),
      );
      await tester.tap(find.text('Intentar de nuevo'));
      expect(retried, true);
    });
  });

  // ── InlineError ─────────────────────────────────────────────────────────

  group('InlineError', () {
    testWidgets('shows message text', (tester) async {
      await tester.pumpWidget(
        _wrap(const InlineError(message: 'Email inválido')),
      );
      expect(find.text('Email inválido'), findsOneWidget);
    });

    testWidgets('renders error icon', (tester) async {
      await tester.pumpWidget(_wrap(const InlineError(message: 'Error')));
      expect(find.byIcon(Icons.error_outline), findsOneWidget);
    });
  });
}
