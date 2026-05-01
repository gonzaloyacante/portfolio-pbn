import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/core/api/api_exceptions.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

Widget _wrap(Widget child) => MaterialApp(home: Scaffold(body: child));

void main() {
  // ── ErrorState ──────────────────────────────────────────────────────────

  group('ErrorState — renders required content', () {
    testWidgets('shows message text', (tester) async {
      await tester.pumpWidget(
        _wrap(const ErrorState(message: 'No se pudo cargar las imágenes')),
      );
      expect(find.text('No se pudo cargar las imágenes'), findsOneWidget);
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

  group('ErrorState — offline / forFailure', () {
    testWidgets('Offline constructor shows Sin conexión heading', (
      tester,
    ) async {
      await tester.pumpWidget(_wrap(const ErrorState.offline()));
      expect(find.text('Sin conexión'), findsOneWidget);
      expect(find.byIcon(Icons.wifi_off_rounded), findsOneWidget);
    });

    testWidgets('forFailure maps NetworkException to offline UI', (
      tester,
    ) async {
      await tester.pumpWidget(
        _wrap(ErrorState.forFailure(const NetworkException())),
      );
      expect(find.text('Sin conexión'), findsOneWidget);
    });

    testWidgets('forFailure maps DioException+NetworkException to offline UI', (
      tester,
    ) async {
      await tester.pumpWidget(
        _wrap(
          ErrorState.forFailure(
            DioException(
              requestOptions: RequestOptions(path: '/'),
              type: DioExceptionType.connectionError,
              error: const NetworkException(),
            ),
          ),
        ),
      );
      expect(find.text('Sin conexión'), findsOneWidget);
    });

    testWidgets('forFailure uses fallbackMessage for other errors', (
      tester,
    ) async {
      await tester.pumpWidget(
        _wrap(
          ErrorState.forFailure(
            Exception('boom'),
            fallbackMessage: 'Falló la carga',
          ),
        ),
      );
      expect(find.text('Falló la carga'), findsOneWidget);
      expect(find.text('Algo salió mal'), findsOneWidget);
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
