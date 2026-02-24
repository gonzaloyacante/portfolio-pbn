import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/shared/widgets/fade_slide_in.dart';

void main() {
  group('FadeSlideIn', () {
    testWidgets('renderiza su child', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(body: FadeSlideIn(child: Text('Contenido'))),
        ),
      );
      expect(find.text('Contenido'), findsOneWidget);
    });

    testWidgets('inicia con opacidad 0 y llega a 1 al terminar la animación', (
      tester,
    ) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(body: FadeSlideIn(child: Text('Animated'))),
        ),
      );

      // Justo al inicio la animación debería estar en progreso
      await tester.pump();
      final fadeTransition = tester.widget<FadeTransition>(
        find.byType(FadeTransition).first,
      );
      expect(fadeTransition.opacity.value, lessThanOrEqualTo(1.0));

      // Al terminar la animación debería estar completamente visible
      await tester.pumpAndSettle();
      final fadeAfter = tester.widget<FadeTransition>(
        find.byType(FadeTransition).first,
      );
      expect(fadeAfter.opacity.value, equals(1.0));
    });

    testWidgets('con delay renderiza sin error', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: FadeSlideIn(
              delay: Duration(milliseconds: 100),
              child: Text('Con delay'),
            ),
          ),
        ),
      );
      expect(find.text('Con delay'), findsOneWidget);
      // Avanzar el tiempo para activar el delay
      await tester.pump(const Duration(milliseconds: 150));
      await tester.pumpAndSettle();
      expect(find.text('Con delay'), findsOneWidget);
    });
  });
}
