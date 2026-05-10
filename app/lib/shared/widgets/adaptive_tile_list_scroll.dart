import 'package:flutter/material.dart';

import '../../core/theme/app_breakpoints.dart';

/// Scroll de tiles: una columna salvo [AppBreakpoints.isTabletLandscapeWide] → dos columnas.
class AdaptiveTileListScroll extends StatelessWidget {
  const AdaptiveTileListScroll({
    super.key,
    required this.itemCount,
    required this.itemBuilder,
    required this.horizontalPadding,
    this.scrollPadding,
    this.separatorExtent = 8,
    this.estimatedTileHeight = 88,
    this.physics,
  });

  final int itemCount;
  final IndexedWidgetBuilder itemBuilder;
  final double horizontalPadding;

  /// Si es null → solo horizontal [horizontalPadding].
  final EdgeInsets? scrollPadding;

  final double separatorExtent;
  final double estimatedTileHeight;
  final ScrollPhysics? physics;

  EdgeInsets _padding() =>
      scrollPadding ?? EdgeInsets.symmetric(horizontal: horizontalPadding);

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final twoCol = AppBreakpoints.isTabletLandscapeWide(context);
        final pad = _padding();

        if (!twoCol || itemCount == 0) {
          return ListView.separated(
            physics: physics,
            padding: pad,
            itemCount: itemCount,
            separatorBuilder: (_, _) => SizedBox(height: separatorExtent),
            itemBuilder: itemBuilder,
          );
        }

        final gutter = AppBreakpoints.gutter(context);
        final inner = constraints.maxWidth - pad.horizontal;
        final cellW = (inner - gutter) / 2;
        final aspect = (cellW / estimatedTileHeight).clamp(2.1, 12.0);

        return GridView.builder(
          physics: physics,
          padding: pad,
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            mainAxisSpacing: separatorExtent,
            crossAxisSpacing: gutter,
            childAspectRatio: aspect,
          ),
          itemCount: itemCount,
          itemBuilder: itemBuilder,
        );
      },
    );
  }
}

/// Centra y limita ancho del body en tablet landscape ancha (legibilidad sin tiles gigantes).
class ExpandedLandscapeBody extends StatelessWidget {
  const ExpandedLandscapeBody({
    super.key,
    required this.child,
    this.maxWidth = 960,
  });

  final Widget child;
  final double maxWidth;

  @override
  Widget build(BuildContext context) {
    if (!AppBreakpoints.isTabletLandscapeWide(context)) return child;
    return Align(
      alignment: Alignment.topCenter,
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: maxWidth),
        child: child,
      ),
    );
  }
}
