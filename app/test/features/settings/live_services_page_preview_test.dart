import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/features/settings/presentation/widgets/live_services_page_preview.dart';

Widget _wrap(Widget child) => MaterialApp(home: Scaffold(body: child));

void main() {
  group('LiveServicesPagePreview', () {
    testWidgets('muestra título, intro y etiqueta de preview', (tester) async {
      await tester.pumpWidget(
        _wrap(
          const LiveServicesPagePreview(
            listTitle: 'Mis Servicios',
            listIntro: 'Novias, editorial y caracterización.',
            listTitleFont: 'Poppins',
            listTitleFontSize: 36,
            listTitleMobileFontSize: 28,
            listTitleColorHex: '#6C0A0A',
            listTitleColorDarkHex: '#FB7185',
            isDarkMode: false,
          ),
        ),
      );

      expect(find.text('Mis Servicios'), findsOneWidget);
      expect(find.text('Novias, editorial y caracterización.'), findsOneWidget);
      expect(find.text('Vista previa de /servicios'), findsOneWidget);
    });

    testWidgets('permite alternar entre modo claro y oscuro', (tester) async {
      var isDark = false;

      await tester.pumpWidget(
        _wrap(
          StatefulBuilder(
            builder: (context, setState) {
              return LiveServicesPagePreview(
                listTitle: 'Servicios',
                listIntro: 'Intro',
                listTitleFont: 'Poppins',
                listTitleFontSize: 32,
                listTitleMobileFontSize: 26,
                listTitleColorHex: '#6C0A0A',
                listTitleColorDarkHex: '#FB7185',
                isDarkMode: isDark,
                onToggleDark: (value) => setState(() => isDark = value),
              );
            },
          ),
        ),
      );

      expect(find.text('Claro'), findsOneWidget);
      await tester.tap(find.text('Claro'));
      await tester.pumpAndSettle();

      expect(find.text('Oscuro'), findsOneWidget);
    });
  });
}
