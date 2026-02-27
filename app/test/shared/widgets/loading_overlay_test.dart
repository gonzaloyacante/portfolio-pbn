import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/shared/widgets/loading_overlay.dart';

Widget _wrap(Widget child) => MaterialApp(home: Scaffold(body: child));

void main() {
  // ── LoadingOverlay ──────────────────────────────────────────────────────

  group('LoadingOverlay — not loading', () {
    testWidgets('renders child when not loading', (tester) async {
      await tester.pumpWidget(
        _wrap(const LoadingOverlay(isLoading: false, child: Text('Contenido'))),
      );
      expect(find.text('Contenido'), findsOneWidget);
    });

    testWidgets('does not show CircularProgressIndicator when not loading', (
      tester,
    ) async {
      await tester.pumpWidget(
        _wrap(const LoadingOverlay(isLoading: false, child: Text('X'))),
      );
      expect(find.byType(CircularProgressIndicator), findsNothing);
    });
  });

  group('LoadingOverlay — loading', () {
    testWidgets('shows CircularProgressIndicator when loading', (tester) async {
      await tester.pumpWidget(
        _wrap(const LoadingOverlay(isLoading: true, child: Text('Formulario'))),
      );
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });

    testWidgets('still renders child underneath overlay', (tester) async {
      await tester.pumpWidget(
        _wrap(const LoadingOverlay(isLoading: true, child: Text('Formulario'))),
      );
      expect(find.text('Formulario'), findsOneWidget);
    });

    testWidgets('shows message when provided', (tester) async {
      await tester.pumpWidget(
        _wrap(
          const LoadingOverlay(
            isLoading: true,
            child: Text('X'),
            message: 'Guardando...',
          ),
        ),
      );
      expect(find.text('Guardando...'), findsOneWidget);
    });

    testWidgets('does not show message when not provided', (tester) async {
      await tester.pumpWidget(
        _wrap(const LoadingOverlay(isLoading: true, child: Text('X'))),
      );
      expect(find.text('Guardando...'), findsNothing);
    });
  });

  // ── AppLoadingIndicator ─────────────────────────────────────────────────

  group('AppLoadingIndicator', () {
    testWidgets('shows CircularProgressIndicator', (tester) async {
      await tester.pumpWidget(_wrap(const AppLoadingIndicator()));
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });

    testWidgets('shows message when provided', (tester) async {
      await tester.pumpWidget(
        _wrap(const AppLoadingIndicator(message: 'Cargando datos...')),
      );
      expect(find.text('Cargando datos...'), findsOneWidget);
    });

    testWidgets('does not show message when null', (tester) async {
      await tester.pumpWidget(_wrap(const AppLoadingIndicator()));
      expect(find.text('Cargando datos...'), findsNothing);
    });
  });
}
