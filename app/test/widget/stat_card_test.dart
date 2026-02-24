import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/shared/widgets/stat_card.dart';

void main() {
  Widget buildCard({
    IconData icon = Icons.star,
    String label = 'Proyectos',
    String value = '12',
    String? trend,
    bool? trendPositive,
    VoidCallback? onTap,
    Color? color,
  }) {
    return MaterialApp(
      home: Scaffold(
        body: StatCard(
          icon: icon,
          label: label,
          value: value,
          trend: trend,
          trendPositive: trendPositive,
          onTap: onTap,
          color: color,
        ),
      ),
    );
  }

  group('StatCard', () {
    testWidgets('muestra el label y el value', (tester) async {
      await tester.pumpWidget(buildCard(label: 'Contactos', value: '42'));
      expect(find.text('Contactos'), findsOneWidget);
      expect(find.text('42'), findsOneWidget);
    });

    testWidgets('muestra el ícono', (tester) async {
      await tester.pumpWidget(buildCard(icon: Icons.photo_library));
      expect(find.byIcon(Icons.photo_library), findsOneWidget);
    });

    testWidgets('muestra trend cuando se proporciona', (tester) async {
      await tester.pumpWidget(
        buildCard(trend: '+3 este mes', trendPositive: true),
      );
      expect(find.text('+3 este mes'), findsOneWidget);
    });

    testWidgets('no muestra trend cuando es null', (tester) async {
      await tester.pumpWidget(buildCard());
      // No debe haber texto de tendencia
      expect(find.text('+3 este mes'), findsNothing);
    });

    testWidgets('es tappable cuando se proporciona onTap', (tester) async {
      var tapped = false;
      await tester.pumpWidget(buildCard(onTap: () => tapped = true));
      await tester.tap(find.byType(InkWell));
      expect(tapped, isTrue);
    });

    testWidgets('renderiza sin valor de color explícito', (tester) async {
      await tester.pumpWidget(buildCard());
      expect(find.byType(StatCard), findsOneWidget);
    });

    testWidgets('renderiza con color personalizado', (tester) async {
      await tester.pumpWidget(buildCard(color: Colors.red));
      expect(find.byType(StatCard), findsOneWidget);
    });
  });
}
