import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/shared/widgets/fade_slide_in.dart';

Widget _wrap(Widget child) => MaterialApp(home: Scaffold(body: child));

void main() {
  group('FadeSlideIn — renders child', () {
    testWidgets('child is visible after animation', (tester) async {
      await tester.pumpWidget(_wrap(const FadeSlideIn(child: Text('Hola'))));
      await tester.pumpAndSettle();
      expect(find.text('Hola'), findsOneWidget);
    });

    testWidgets('uses FadeTransition and SlideTransition', (tester) async {
      await tester.pumpWidget(_wrap(const FadeSlideIn(child: Text('Animado'))));
      expect(find.byType(FadeTransition), findsAtLeastNWidgets(1));
      expect(find.byType(SlideTransition), findsAtLeastNWidgets(1));
    });
  });

  group('FadeSlideIn — no delay', () {
    testWidgets('starts animation immediately without delay', (tester) async {
      await tester.pumpWidget(_wrap(const FadeSlideIn(child: Text('Rápido'))));
      await tester.pump(const Duration(milliseconds: 350));
      expect(find.text('Rápido'), findsOneWidget);
    });
  });

  group('FadeSlideIn — with delay', () {
    testWidgets('child is present after delay + animation duration', (
      tester,
    ) async {
      await tester.pumpWidget(
        _wrap(
          const FadeSlideIn(
            delay: Duration(milliseconds: 100),
            child: Text('Retrasado'),
          ),
        ),
      );
      await tester.pumpAndSettle();
      expect(find.text('Retrasado'), findsOneWidget);
    });
  });

  group('FadeSlideIn — custom duration', () {
    testWidgets('custom duration is accepted without error', (tester) async {
      await tester.pumpWidget(
        _wrap(
          const FadeSlideIn(
            duration: Duration(seconds: 1),
            child: Text('Lento'),
          ),
        ),
      );
      await tester.pumpAndSettle();
      expect(find.text('Lento'), findsOneWidget);
    });
  });

  group('FadeSlideIn — multiple instances', () {
    testWidgets('multiple FadeSlideIn widgets render independently', (
      tester,
    ) async {
      await tester.pumpWidget(
        _wrap(
          const Column(
            children: [
              FadeSlideIn(
                delay: Duration(milliseconds: 0),
                child: Text('Item 1'),
              ),
              FadeSlideIn(
                delay: Duration(milliseconds: 50),
                child: Text('Item 2'),
              ),
              FadeSlideIn(
                delay: Duration(milliseconds: 100),
                child: Text('Item 3'),
              ),
            ],
          ),
        ),
      );
      await tester.pumpAndSettle();
      expect(find.text('Item 1'), findsOneWidget);
      expect(find.text('Item 2'), findsOneWidget);
      expect(find.text('Item 3'), findsOneWidget);
    });
  });
}
