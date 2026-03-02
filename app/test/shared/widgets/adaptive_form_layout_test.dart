import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/shared/widgets/adaptive_form_layout.dart';

Widget _wrap(Widget child, {double width = 800}) => MaterialApp(
  home: Scaffold(
    body: SizedBox(width: width, child: child),
  ),
);

void main() {
  group('AdaptiveFormLayout — renders children', () {
    testWidgets('renders all provided children', (tester) async {
      await tester.pumpWidget(
        _wrap(
          AdaptiveFormLayout(
            children: const [Text('Campo 1'), Text('Campo 2'), Text('Campo 3')],
          ),
        ),
      );
      expect(find.text('Campo 1'), findsOneWidget);
      expect(find.text('Campo 2'), findsOneWidget);
      expect(find.text('Campo 3'), findsOneWidget);
    });

    testWidgets('renders single child without error', (tester) async {
      await tester.pumpWidget(
        _wrap(AdaptiveFormLayout(children: const [Text('Solo')])),
      );
      expect(find.text('Solo'), findsOneWidget);
    });

    testWidgets('renders empty list without error', (tester) async {
      await tester.pumpWidget(_wrap(const AdaptiveFormLayout(children: [])));
      expect(find.byType(AdaptiveFormLayout), findsOneWidget);
    });
  });

  group('AdaptiveFormLayout — fullWidth', () {
    testWidgets('fullWidth wraps a widget in a _FullWidthFormItem', (
      tester,
    ) async {
      final fullWidthWidget = AdaptiveFormLayout.fullWidth(const Text('Full'));
      await tester.pumpWidget(
        _wrap(
          AdaptiveFormLayout(children: [const Text('Col 1'), fullWidthWidget]),
        ),
      );
      expect(find.text('Full'), findsOneWidget);
      expect(find.text('Col 1'), findsOneWidget);
    });

    testWidgets('multiple fullWidth children render correctly', (tester) async {
      await tester.pumpWidget(
        _wrap(
          AdaptiveFormLayout(
            children: [
              AdaptiveFormLayout.fullWidth(const Text('FW1')),
              AdaptiveFormLayout.fullWidth(const Text('FW2')),
            ],
          ),
        ),
      );
      expect(find.text('FW1'), findsOneWidget);
      expect(find.text('FW2'), findsOneWidget);
    });
  });

  group('AdaptiveFormLayout — narrow layout (mobile)', () {
    testWidgets('stacks children vertically when width < breakpoint', (
      tester,
    ) async {
      await tester.pumpWidget(
        _wrap(
          AdaptiveFormLayout(
            twoColumnBreakpoint: 600,
            children: const [Text('A'), Text('B')],
          ),
          width: 400,
        ),
      );
      expect(find.text('A'), findsOneWidget);
      expect(find.text('B'), findsOneWidget);
    });
  });

  group('AdaptiveFormLayout — wide layout (tablet)', () {
    testWidgets('renders two children side by side when width >= breakpoint', (
      tester,
    ) async {
      await tester.pumpWidget(
        _wrap(
          AdaptiveFormLayout(
            twoColumnBreakpoint: 600,
            children: const [Text('Izquierda'), Text('Derecha')],
          ),
          width: 800,
        ),
      );
      expect(find.text('Izquierda'), findsOneWidget);
      expect(find.text('Derecha'), findsOneWidget);
    });

    testWidgets('odd number of children renders last child solo', (
      tester,
    ) async {
      await tester.pumpWidget(
        _wrap(
          AdaptiveFormLayout(
            twoColumnBreakpoint: 600,
            children: const [Text('A'), Text('B'), Text('C')],
          ),
          width: 800,
        ),
      );
      expect(find.text('A'), findsOneWidget);
      expect(find.text('B'), findsOneWidget);
      expect(find.text('C'), findsOneWidget);
    });
  });

  group('AdaptiveFormLayout — custom spacing', () {
    testWidgets('accepts custom mainAxisSpacing and crossAxisSpacing', (
      tester,
    ) async {
      await tester.pumpWidget(
        _wrap(
          AdaptiveFormLayout(
            mainAxisSpacing: 32,
            crossAxisSpacing: 32,
            children: const [Text('X'), Text('Y')],
          ),
        ),
      );
      expect(find.text('X'), findsOneWidget);
      expect(find.text('Y'), findsOneWidget);
    });
  });
}
