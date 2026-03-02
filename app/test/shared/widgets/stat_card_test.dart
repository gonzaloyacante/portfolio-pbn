import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/shared/widgets/stat_card.dart';

Widget _wrap(Widget child) => MaterialApp(home: Scaffold(body: child));

void main() {
  group('StatCard — renders label and value', () {
    testWidgets('shows label text', (tester) async {
      await tester.pumpWidget(
        _wrap(
          const StatCard(icon: Icons.star, label: 'Proyectos', value: '24'),
        ),
      );
      expect(find.text('Proyectos'), findsOneWidget);
    });

    testWidgets('shows value text', (tester) async {
      await tester.pumpWidget(
        _wrap(
          const StatCard(icon: Icons.star, label: 'Proyectos', value: '24'),
        ),
      );
      expect(find.text('24'), findsOneWidget);
    });

    testWidgets('does not show trend when not set', (tester) async {
      await tester.pumpWidget(
        _wrap(const StatCard(icon: Icons.star, label: 'L', value: 'V')),
      );
      expect(find.text('+3 este mes'), findsNothing);
    });
  });

  group('StatCard — trend badge', () {
    testWidgets('shows trend text when provided', (tester) async {
      await tester.pumpWidget(
        _wrap(
          const StatCard(
            icon: Icons.star,
            label: 'Proyectos',
            value: '42',
            trend: '+3 este mes',
            trendPositive: true,
          ),
        ),
      );
      expect(find.text('+3 este mes'), findsOneWidget);
    });

    testWidgets('shows negative trend text', (tester) async {
      await tester.pumpWidget(
        _wrap(
          const StatCard(
            icon: Icons.star,
            label: 'Proyectos',
            value: '42',
            trend: '-2 este mes',
            trendPositive: false,
          ),
        ),
      );
      expect(find.text('-2 este mes'), findsOneWidget);
    });
  });

  group('StatCard — icon', () {
    testWidgets('renders icon widget', (tester) async {
      await tester.pumpWidget(
        _wrap(
          const StatCard(
            icon: Icons.photo_library_outlined,
            label: 'Galería',
            value: '100',
          ),
        ),
      );
      expect(find.byIcon(Icons.photo_library_outlined), findsOneWidget);
    });
  });

  group('StatCard — tap', () {
    testWidgets('onTap is triggered', (tester) async {
      var tapped = false;
      await tester.pumpWidget(
        _wrap(
          StatCard(
            icon: Icons.star,
            label: 'L',
            value: 'V',
            onTap: () => tapped = true,
          ),
        ),
      );
      await tester.tap(find.byType(InkWell));
      expect(tapped, true);
    });

    testWidgets('shows arrow icon when onTap is set and no trend', (
      tester,
    ) async {
      await tester.pumpWidget(
        _wrap(StatCard(icon: Icons.star, label: 'L', value: 'V', onTap: () {})),
      );
      expect(find.byIcon(Icons.arrow_forward_ios_rounded), findsOneWidget);
    });
  });
}
