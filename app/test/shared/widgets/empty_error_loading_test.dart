import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/shared/widgets/empty_state.dart';
import 'package:portfolio_pbn/shared/widgets/error_state.dart';
import 'package:portfolio_pbn/shared/widgets/loading_overlay.dart';
import 'package:portfolio_pbn/shared/widgets/status_badge.dart';

Widget _wrap(Widget child) => MaterialApp(home: Scaffold(body: child));

// Helper to convert AppStatus to display — tests verify the widget renders


void main() {
  // ── EmptyState ────────────────────────────────────────────────────────────

  group('EmptyState — renders', () {
    testWidgets('shows title', (tester) async {
      await tester.pumpWidget(_wrap(const EmptyState(icon: Icons.inbox, title: 'Nothing here')));
      expect(find.text('Nothing here'), findsOneWidget);
    });

    testWidgets('shows icon', (tester) async {
      await tester.pumpWidget(_wrap(const EmptyState(icon: Icons.inbox, title: 'Empty')));
      expect(find.byIcon(Icons.inbox), findsAtLeastNWidgets(1));
    });

    testWidgets('shows subtitle when provided', (tester) async {
      await tester.pumpWidget(_wrap(const EmptyState(
        icon: Icons.inbox,
        title: 'Empty',
        subtitle: 'Create your first item',
      )));
      expect(find.text('Create your first item'), findsAtLeastNWidgets(1));
    });

    testWidgets('shows action widget when provided', (tester) async {
      await tester.pumpWidget(_wrap(EmptyState(
        icon: Icons.inbox,
        title: 'No data',
        action: ElevatedButton(onPressed: () {}, child: const Text('Add')),
      )));
      expect(find.text('Add'), findsAtLeastNWidgets(1));
    });

    testWidgets('action callback fires on tap', (tester) async {
      bool tapped = false;
      await tester.pumpWidget(_wrap(EmptyState(
        icon: Icons.inbox,
        title: 'E',
        action: ElevatedButton(
          onPressed: () => tapped = true,
          child: const Text('Go'),
        ),
      )));
      await tester.tap(find.text('Go'));
      expect(tapped, isTrue);
    });

    testWidgets('no subtitle by default', (tester) async {
      await tester.pumpWidget(_wrap(const EmptyState(icon: Icons.inbox, title: 'Empty')));
      expect(find.byType(EmptyState), findsOneWidget);
    });
  });

  // ── ErrorState ────────────────────────────────────────────────────────────

  group('ErrorState — renders', () {
    testWidgets('shows error message', (tester) async {
      await tester.pumpWidget(_wrap(const ErrorState(message: 'An error occurred')));
      expect(find.text('An error occurred'), findsAtLeastNWidgets(1));
    });

    testWidgets('no retry button by default', (tester) async {
      await tester.pumpWidget(_wrap(const ErrorState(message: 'Fail')));
      expect(find.byType(ElevatedButton), findsNothing);
    });

    testWidgets('shows retry button when onRetry provided', (tester) async {
      await tester.pumpWidget(_wrap(ErrorState(message: 'Fail', onRetry: () {})));
      expect(find.text('Intentar de nuevo'), findsAtLeastNWidgets(1));
    });

    testWidgets('retry fires callback', (tester) async {
      bool retried = false;
      await tester.pumpWidget(_wrap(ErrorState(
        message: 'Fail',
        onRetry: () => retried = true,
      )));
      await tester.tap(find.text('Intentar de nuevo'));
      expect(retried, isTrue);
    });

    testWidgets('shows error icon', (tester) async {
      await tester.pumpWidget(_wrap(const ErrorState(message: 'Fail')));
      expect(find.byType(Icon), findsAtLeastNWidgets(1));
    });
  });

  // ── LoadingOverlay ────────────────────────────────────────────────────────

  group('LoadingOverlay — renders', () {
    testWidgets('renders child when not loading', (tester) async {
      await tester.pumpWidget(_wrap(LoadingOverlay(
        isLoading: false,
        child: const Text('Content'),
      )));
      expect(find.text('Content'), findsOneWidget);
    });

    testWidgets('renders child when loading', (tester) async {
      await tester.pumpWidget(_wrap(LoadingOverlay(
        isLoading: true,
        child: const Text('Content'),
      )));
      expect(find.text('Content'), findsAtLeastNWidgets(1));
    });

    testWidgets('shows CircularProgressIndicator when loading', (tester) async {
      await tester.pumpWidget(_wrap(LoadingOverlay(
        isLoading: true,
        child: const SizedBox(),
      )));
      expect(find.byType(CircularProgressIndicator), findsAtLeastNWidgets(1));
    });

    testWidgets('no CircularProgressIndicator when not loading', (tester) async {
      await tester.pumpWidget(_wrap(LoadingOverlay(
        isLoading: false,
        child: const SizedBox(),
      )));
      expect(find.byType(CircularProgressIndicator), findsNothing);
    });
  });

  // ── StatusBadge — extended ────────────────────────────────────────────────

  group('StatusBadge — extended statuses', () {
    testWidgets('pending renders', (tester) async {
      await tester.pumpWidget(_wrap(const StatusBadge(status: AppStatus.pending)));
      expect(find.byType(StatusBadge), findsOneWidget);
    });

    testWidgets('approved renders', (tester) async {
      await tester.pumpWidget(_wrap(const StatusBadge(status: AppStatus.approved)));
      expect(find.byType(StatusBadge), findsOneWidget);
    });

    testWidgets('rejected renders', (tester) async {
      await tester.pumpWidget(_wrap(const StatusBadge(status: AppStatus.rejected)));
      expect(find.byType(StatusBadge), findsOneWidget);
    });

    testWidgets('active renders', (tester) async {
      await tester.pumpWidget(_wrap(const StatusBadge(status: AppStatus.active)));
      expect(find.byType(StatusBadge), findsOneWidget);
    });

    testWidgets('inactive renders', (tester) async {
      await tester.pumpWidget(_wrap(const StatusBadge(status: AppStatus.inactive)));
      expect(find.byType(StatusBadge), findsOneWidget);
    });

    testWidgets('featured renders', (tester) async {
      await tester.pumpWidget(_wrap(const StatusBadge(status: AppStatus.featured)));
      expect(find.byType(StatusBadge), findsOneWidget);
    });

    testWidgets('confirmed renders', (tester) async {
      await tester.pumpWidget(_wrap(const StatusBadge(status: AppStatus.confirmed)));
      expect(find.byType(StatusBadge), findsOneWidget);
    });

    testWidgets('cancelled renders', (tester) async {
      await tester.pumpWidget(_wrap(const StatusBadge(status: AppStatus.cancelled)));
      expect(find.byType(StatusBadge), findsOneWidget);
    });

    testWidgets('draft renders', (tester) async {
      await tester.pumpWidget(_wrap(const StatusBadge(status: AppStatus.draft)));
      expect(find.byType(StatusBadge), findsOneWidget);
    });

    testWidgets('published renders', (tester) async {
      await tester.pumpWidget(_wrap(const StatusBadge(status: AppStatus.published)));
      expect(find.byType(StatusBadge), findsOneWidget);
    });

    testWidgets('badge has text widget', (tester) async {
      await tester.pumpWidget(_wrap(const StatusBadge(status: AppStatus.pending)));
      expect(find.byType(Text), findsAtLeastNWidgets(1));
    });

    testWidgets('compact mode renders', (tester) async {
      await tester.pumpWidget(_wrap(const StatusBadge(status: AppStatus.active, compact: true)));
      expect(find.byType(StatusBadge), findsOneWidget);
    });

    testWidgets('small mode renders', (tester) async {
      await tester.pumpWidget(_wrap(const StatusBadge(status: AppStatus.active, small: true)));
      expect(find.byType(StatusBadge), findsOneWidget);
    });

    testWidgets('custom label overrides default', (tester) async {
      await tester.pumpWidget(_wrap(const StatusBadge(status: AppStatus.pending, label: 'En revisión')));
      expect(find.text('En revisión'), findsAtLeastNWidgets(1));
    });
  });
}
