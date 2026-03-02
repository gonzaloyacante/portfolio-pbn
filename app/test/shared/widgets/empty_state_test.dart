import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/shared/widgets/empty_state.dart';

Widget _wrap(Widget child) => MaterialApp(home: Scaffold(body: child));

void main() {
  group('EmptyState — renders required content', () {
    testWidgets('shows title', (tester) async {
      await tester.pumpWidget(
        _wrap(
          const EmptyState(
            icon: Icons.photo_library_outlined,
            title: 'Sin proyectos',
          ),
        ),
      );
      expect(find.text('Sin proyectos'), findsOneWidget);
    });

    testWidgets('renders icon', (tester) async {
      await tester.pumpWidget(
        _wrap(
          const EmptyState(
            icon: Icons.photo_library_outlined,
            title: 'Sin proyectos',
          ),
        ),
      );
      expect(find.byIcon(Icons.photo_library_outlined), findsOneWidget);
    });
  });

  group('EmptyState — subtitle', () {
    testWidgets('shows subtitle when provided', (tester) async {
      await tester.pumpWidget(
        _wrap(
          const EmptyState(
            icon: Icons.star,
            title: 'Vacío',
            subtitle: 'No hay elementos todavía.',
          ),
        ),
      );
      expect(find.text('No hay elementos todavía.'), findsOneWidget);
    });

    testWidgets('does not show subtitle when not provided', (tester) async {
      await tester.pumpWidget(
        _wrap(const EmptyState(icon: Icons.star, title: 'Vacío')),
      );
      expect(find.text('No hay elementos todavía.'), findsNothing);
    });
  });

  group('EmptyState — action', () {
    testWidgets('shows action widget when provided', (tester) async {
      await tester.pumpWidget(
        _wrap(
          EmptyState(
            icon: Icons.star,
            title: 'Sin datos',
            action: ElevatedButton(
              onPressed: () {},
              child: const Text('Crear'),
            ),
          ),
        ),
      );
      expect(find.text('Crear'), findsOneWidget);
    });

    testWidgets('does not crash when action is null', (tester) async {
      await tester.pumpWidget(
        _wrap(const EmptyState(icon: Icons.star, title: 'Vacío')),
      );
      expect(tester.takeException(), isNull);
    });

    testWidgets('action button is tappable', (tester) async {
      var tapped = false;
      await tester.pumpWidget(
        _wrap(
          EmptyState(
            icon: Icons.star,
            title: 'Vacío',
            action: TextButton(
              onPressed: () => tapped = true,
              child: const Text('Acción'),
            ),
          ),
        ),
      );
      await tester.tap(find.text('Acción'));
      expect(tapped, true);
    });
  });
}
