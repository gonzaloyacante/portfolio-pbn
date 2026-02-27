import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/shared/widgets/confirm_dialog.dart';

Widget _wrap(Widget child) => MaterialApp(home: child);

void main() {
  group('ConfirmDialog — construction', () {
    testWidgets('shows title text', (tester) async {
      await tester.pumpWidget(
        _wrap(
          const ConfirmDialog(
            title: 'Eliminar proyecto',
            message: '¿Confirmar eliminación?',
          ),
        ),
      );
      expect(find.text('Eliminar proyecto'), findsOneWidget);
    });

    testWidgets('shows message text', (tester) async {
      await tester.pumpWidget(
        _wrap(
          const ConfirmDialog(
            title: 'Título',
            message: 'Mensaje de confirmación',
          ),
        ),
      );
      expect(find.text('Mensaje de confirmación'), findsOneWidget);
    });

    testWidgets('shows default cancelLabel Cancelar', (tester) async {
      await tester.pumpWidget(
        _wrap(const ConfirmDialog(title: 'Título', message: 'Mensaje')),
      );
      expect(find.text('Cancelar'), findsOneWidget);
    });

    testWidgets('shows default confirmLabel Confirmar', (tester) async {
      await tester.pumpWidget(
        _wrap(const ConfirmDialog(title: 'Título', message: 'Mensaje')),
      );
      expect(find.text('Confirmar'), findsOneWidget);
    });

    testWidgets('shows custom cancelLabel', (tester) async {
      await tester.pumpWidget(
        _wrap(
          const ConfirmDialog(
            title: 'Título',
            message: 'Mensaje',
            cancelLabel: 'No, volver',
          ),
        ),
      );
      expect(find.text('No, volver'), findsOneWidget);
    });

    testWidgets('shows custom confirmLabel', (tester) async {
      await tester.pumpWidget(
        _wrap(
          const ConfirmDialog(
            title: 'Título',
            message: 'Mensaje',
            confirmLabel: 'Sí, eliminar',
          ),
        ),
      );
      expect(find.text('Sí, eliminar'), findsOneWidget);
    });
  });

  group('ConfirmDialog — icon', () {
    testWidgets('shows warning icon when isDestructive=true', (tester) async {
      await tester.pumpWidget(
        _wrap(
          const ConfirmDialog(
            title: 'Eliminar',
            message: '¿Segura?',
            isDestructive: true,
          ),
        ),
      );
      expect(find.byIcon(Icons.warning_amber_rounded), findsOneWidget);
    });

    testWidgets('shows custom icon when provided', (tester) async {
      await tester.pumpWidget(
        _wrap(
          const ConfirmDialog(
            title: 'Título',
            message: 'Mensaje',
            icon: Icons.logout,
          ),
        ),
      );
      expect(find.byIcon(Icons.logout), findsOneWidget);
    });

    testWidgets('no icon shown when isDestructive=false and icon=null', (
      tester,
    ) async {
      await tester.pumpWidget(
        _wrap(const ConfirmDialog(title: 'Título', message: 'Mensaje')),
      );
      expect(find.byType(Icon), findsNothing);
    });
  });

  group('ConfirmDialog — button interaction', () {
    testWidgets('cancel button is tappable', (tester) async {
      bool? result;
      await tester.pumpWidget(
        MaterialApp(
          home: Builder(
            builder: (ctx) => ElevatedButton(
              onPressed: () async {
                result = await ConfirmDialog.show(
                  ctx,
                  title: 'Test',
                  message: '¿Confirmar?',
                );
              },
              child: const Text('Abrir diálogo'),
            ),
          ),
        ),
      );
      await tester.tap(find.text('Abrir diálogo'));
      await tester.pumpAndSettle();
      expect(find.text('Cancelar'), findsOneWidget);
      await tester.tap(find.text('Cancelar'));
      await tester.pumpAndSettle();
      expect(result, false);
    });

    testWidgets('confirm button is tappable', (tester) async {
      bool? result;
      await tester.pumpWidget(
        MaterialApp(
          home: Builder(
            builder: (ctx) => ElevatedButton(
              onPressed: () async {
                result = await ConfirmDialog.show(
                  ctx,
                  title: 'Test',
                  message: '¿Confirmar?',
                );
              },
              child: const Text('Abrir diálogo'),
            ),
          ),
        ),
      );
      await tester.tap(find.text('Abrir diálogo'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Confirmar'));
      await tester.pumpAndSettle();
      expect(result, true);
    });
  });

  group('ConfirmDialog — AlertDialog structure', () {
    testWidgets('renders as AlertDialog', (tester) async {
      await tester.pumpWidget(
        _wrap(const ConfirmDialog(title: 'Título', message: 'Mensaje')),
      );
      expect(find.byType(AlertDialog), findsOneWidget);
    });

    testWidgets('contains OutlinedButton for cancel', (tester) async {
      await tester.pumpWidget(
        _wrap(const ConfirmDialog(title: 'Título', message: 'Mensaje')),
      );
      expect(find.byType(OutlinedButton), findsOneWidget);
    });

    testWidgets('contains FilledButton for confirm', (tester) async {
      await tester.pumpWidget(
        _wrap(const ConfirmDialog(title: 'Título', message: 'Mensaje')),
      );
      expect(find.byType(FilledButton), findsOneWidget);
    });
  });
}
