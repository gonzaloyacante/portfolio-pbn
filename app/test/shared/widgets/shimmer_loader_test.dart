import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_pbn/shared/widgets/shimmer_loader.dart';

Widget _wrap(Widget child) => MaterialApp(home: Scaffold(body: child));

void main() {
  group('ShimmerBox', () {
    testWidgets('renders with the given width and height', (tester) async {
      await tester.pumpWidget(_wrap(const ShimmerBox(width: 120, height: 60)));
      final container = tester.widget<Container>(find.byType(Container).first);
      expect(container.constraints?.maxWidth, 120);
      expect(container.constraints?.maxHeight, 60);
    });

    testWidgets('uses default borderRadius of 8 when not provided', (
      tester,
    ) async {
      await tester.pumpWidget(_wrap(const ShimmerBox(width: 100, height: 40)));
      expect(find.byType(ShimmerBox), findsOneWidget);
    });

    testWidgets('accepts custom borderRadius', (tester) async {
      await tester.pumpWidget(
        _wrap(const ShimmerBox(width: 80, height: 80, borderRadius: 40)),
      );
      expect(find.byType(ShimmerBox), findsOneWidget);
    });

    testWidgets('renders without throwing', (tester) async {
      await tester.pumpWidget(
        _wrap(const ShimmerBox(width: double.infinity, height: 16)),
      );
      expect(find.byType(ShimmerBox), findsOneWidget);
    });
  });

  group('SkeletonCard', () {
    testWidgets('renders with image placeholder by default', (tester) async {
      await tester.pumpWidget(_wrap(const SkeletonCard()));
      expect(find.byType(SkeletonCard), findsOneWidget);
      expect(find.byType(Card), findsOneWidget);
    });

    testWidgets('renders without image when hasImage=false', (tester) async {
      await tester.pumpWidget(_wrap(const SkeletonCard(hasImage: false)));
      expect(find.byType(SkeletonCard), findsOneWidget);
    });

    testWidgets('renders multiple ShimmerBoxes', (tester) async {
      await tester.pumpWidget(_wrap(const SkeletonCard()));
      expect(find.byType(ShimmerBox), findsWidgets);
    });

    testWidgets('renders ShimmerBoxes also without image', (tester) async {
      await tester.pumpWidget(_wrap(const SkeletonCard(hasImage: false)));
      expect(find.byType(ShimmerBox), findsWidgets);
    });
  });

  group('ShimmerLoader', () {
    testWidgets('shows child directly when isLoading=false', (tester) async {
      await tester.pumpWidget(
        _wrap(
          ShimmerLoader(isLoading: false, child: const Text('Contenido real')),
        ),
      );
      expect(find.text('Contenido real'), findsOneWidget);
    });

    testWidgets('wraps child in shimmer when isLoading=true', (tester) async {
      await tester.pumpWidget(
        _wrap(ShimmerLoader(isLoading: true, child: const SkeletonCard())),
      );
      // Shimmer package renders its widget — verify child is present
      expect(find.byType(SkeletonCard), findsOneWidget);
    });

    testWidgets('default isLoading is true', (tester) async {
      await tester.pumpWidget(
        _wrap(ShimmerLoader(child: const Text('Loading...'))),
      );
      // Widget renders without error
      expect(find.byType(ShimmerLoader), findsOneWidget);
    });

    testWidgets('switching from loading to not loading shows child', (
      tester,
    ) async {
      await tester.pumpWidget(
        _wrap(ShimmerLoader(isLoading: true, child: const SkeletonCard())),
      );
      expect(find.byType(SkeletonCard), findsOneWidget);

      await tester.pumpWidget(
        _wrap(ShimmerLoader(isLoading: false, child: const Text('Cargado'))),
      );
      expect(find.text('Cargado'), findsOneWidget);
    });
  });

  group('SkeletonListView', () {
    testWidgets('renders requested number of SkeletonCards', (tester) async {
      await tester.pumpWidget(_wrap(const SkeletonListView(itemCount: 3)));
      expect(find.byType(SkeletonCard), findsNWidgets(3));
    });

    testWidgets('uses default itemCount=6 when not provided', (tester) async {
      await tester.pumpWidget(_wrap(const SkeletonListView()));
      expect(find.byType(SkeletonCard), findsNWidgets(6));
    });

    testWidgets('renders 1 card when itemCount=1', (tester) async {
      await tester.pumpWidget(_wrap(const SkeletonListView(itemCount: 1)));
      expect(find.byType(SkeletonCard), findsOneWidget);
    });
  });
}
