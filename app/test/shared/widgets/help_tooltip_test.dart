import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/shared/widgets/help_tooltip.dart';

Widget _wrap(Widget child) => MaterialApp(home: Scaffold(body: child));

void main() {
  // ── HelpTooltip ─────────────────────────────────────────────────────────

  group('HelpTooltip', () {
    testWidgets('renders help icon', (tester) async {
      await tester.pumpWidget(_wrap(const HelpTooltip('Texto de ayuda')));
      expect(find.byIcon(Icons.help_outline_rounded), findsOneWidget);
    });

    testWidgets('uses default iconSize of 16', (tester) async {
      await tester.pumpWidget(_wrap(const HelpTooltip('Ayuda')));
      final icon = tester.widget<Icon>(find.byIcon(Icons.help_outline_rounded));
      expect(icon.size, 16);
    });

    testWidgets('uses custom iconSize when provided', (tester) async {
      await tester.pumpWidget(_wrap(const HelpTooltip('Ayuda', iconSize: 24)));
      final icon = tester.widget<Icon>(find.byIcon(Icons.help_outline_rounded));
      expect(icon.size, 24);
    });

    testWidgets('wraps icon in Tooltip widget', (tester) async {
      await tester.pumpWidget(_wrap(const HelpTooltip('Mi mensaje de ayuda')));
      expect(find.byType(Tooltip), findsOneWidget);
    });
  });

  // ── FormFieldLabel ──────────────────────────────────────────────────────

  group('FormFieldLabel', () {
    testWidgets('shows label text', (tester) async {
      await tester.pumpWidget(_wrap(const FormFieldLabel('Nombre')));
      expect(find.text('Nombre'), findsOneWidget);
    });

    testWidgets('shows required asterisk when required=true', (tester) async {
      await tester.pumpWidget(
        _wrap(const FormFieldLabel('Campo', required: true)),
      );
      expect(find.text(' *'), findsOneWidget);
    });

    testWidgets('does not show asterisk when required=false (default)', (
      tester,
    ) async {
      await tester.pumpWidget(_wrap(const FormFieldLabel('Campo')));
      expect(find.text(' *'), findsNothing);
    });

    testWidgets('shows HelpTooltip icon when help is provided', (tester) async {
      await tester.pumpWidget(
        _wrap(const FormFieldLabel('Campo', help: 'Descripción del campo')),
      );
      expect(find.byIcon(Icons.help_outline_rounded), findsOneWidget);
    });

    testWidgets('does not show HelpTooltip when help is null', (tester) async {
      await tester.pumpWidget(_wrap(const FormFieldLabel('Campo')));
      expect(find.byIcon(Icons.help_outline_rounded), findsNothing);
    });
  });
}
