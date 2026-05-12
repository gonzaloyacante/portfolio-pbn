import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/features/settings/presentation/widgets/theme_color_preview.dart';

Widget _wrap(Widget child) => MaterialApp(
  home: Scaffold(body: SingleChildScrollView(child: child)),
);

void main() {
  group('ThemeColorPreview', () {
    testWidgets('shows all semantic surfaces and typography roles', (
      tester,
    ) async {
      await tester.pumpWidget(
        _wrap(
          const ThemeColorPreview(
            lightPrimary: '#6c0a0a',
            lightSecondary: '#fce7f3',
            lightAccent: '#fff1f9',
            lightBg: '#fff8fc',
            lightText: '#1a050a',
            lightCard: '#ffffff',
            darkPrimary: '#fb7185',
            darkSecondary: '#881337',
            darkAccent: '#2a1015',
            darkBg: '#0f0505',
            darkText: '#fafafa',
            darkCard: '#1c0a0f',
            headingFont: 'Poppins',
            bodyFont: 'Open Sans',
            scriptFont: 'Great Vibes',
            borderRadius: 40,
          ),
        ),
      );

      expect(find.text('Canvas de página'), findsWidgets);
      expect(find.text('Superficie / tarjetas'), findsWidgets);
      expect(find.text('Navegación'), findsWidgets);
      expect(find.text('Botones y enlaces'), findsWidgets);
      expect(find.text('Formulario'), findsWidgets);
      expect(find.text('Tipografías'), findsOneWidget);
      expect(find.text('Títulos / Cuerpo / Marca'), findsOneWidget);
    });
  });
}
