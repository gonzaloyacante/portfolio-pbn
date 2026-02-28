import 'package:flutter/material.dart';

import '../../core/theme/app_breakpoints.dart';
import '../../core/theme/app_spacing.dart';

/// Grid adaptativo basado en [AppBreakpoints].
///
/// Uso en Sliver (dentro de CustomScrollView):
/// ```dart
/// SliverAdaptiveGrid(
///   compactCols: 2,
///   mediumCols: 3,
///   expandedCols: 4,
///   childAspectRatio: 0.85,
///   children: items.map((i) => ProjectCard(i)).toList(),
/// )
/// ```
///
/// Uso estándar (reemplaza GridView):
/// ```dart
/// AdaptiveGrid(
///   compactCols: 2,
///   childAspectRatio: 1.0,
///   children: [...],
/// )
/// ```
class AdaptiveGrid extends StatelessWidget {
  const AdaptiveGrid({
    super.key,
    required this.children,
    this.compactCols = 2,
    this.mediumCols,
    this.expandedCols,
    this.childAspectRatio = 1.0,
    this.padding,
    this.mainAxisSpacing,
    this.crossAxisSpacing,
    this.shrinkWrap = false,
    this.physics,
  });

  final List<Widget> children;
  final int compactCols;
  final int? mediumCols;
  final int? expandedCols;
  final double childAspectRatio;
  final EdgeInsetsGeometry? padding;
  final double? mainAxisSpacing;
  final double? crossAxisSpacing;
  final bool shrinkWrap;
  final ScrollPhysics? physics;

  int _cols(BuildContext context) {
    return AppBreakpoints.gridColumns(
      context,
      compact: compactCols,
      medium: mediumCols ?? (compactCols + 1),
      expanded: expandedCols ?? (compactCols + 2),
    );
  }

  double _spacing(BuildContext context) {
    return AppBreakpoints.gutter(context);
  }

  @override
  Widget build(BuildContext context) {
    final spacing = crossAxisSpacing ?? _spacing(context);
    final mainSpacing = mainAxisSpacing ?? spacing;

    return GridView.builder(
      shrinkWrap: shrinkWrap,
      physics: physics,
      padding: padding ?? EdgeInsets.symmetric(horizontal: AppBreakpoints.pageMargin(context), vertical: AppSpacing.sm),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: _cols(context),
        mainAxisSpacing: mainSpacing,
        crossAxisSpacing: spacing,
        childAspectRatio: childAspectRatio,
      ),
      itemCount: children.length,
      itemBuilder: (_, i) => children[i],
    );
  }
}

/// Versión Sliver de [AdaptiveGrid] para usar dentro de [CustomScrollView].
class SliverAdaptiveGrid extends StatelessWidget {
  const SliverAdaptiveGrid({
    super.key,
    required this.children,
    this.compactCols = 2,
    this.mediumCols,
    this.expandedCols,
    this.childAspectRatio = 1.0,
    this.padding,
    this.mainAxisSpacing,
    this.crossAxisSpacing,
  });

  final List<Widget> children;
  final int compactCols;
  final int? mediumCols;
  final int? expandedCols;
  final double childAspectRatio;
  final EdgeInsetsGeometry? padding;
  final double? mainAxisSpacing;
  final double? crossAxisSpacing;

  int _cols(BuildContext context) {
    return AppBreakpoints.gridColumns(
      context,
      compact: compactCols,
      medium: mediumCols ?? (compactCols + 1),
      expanded: expandedCols ?? (compactCols + 2),
    );
  }

  double _spacing(BuildContext context) => AppBreakpoints.gutter(context);

  @override
  Widget build(BuildContext context) {
    final spacing = crossAxisSpacing ?? _spacing(context);
    final mainSpacing = mainAxisSpacing ?? spacing;
    final hPad = AppBreakpoints.pageMargin(context);

    return SliverPadding(
      padding: padding ?? EdgeInsets.symmetric(horizontal: hPad, vertical: AppSpacing.sm),
      sliver: SliverGrid(
        delegate: SliverChildBuilderDelegate((_, i) => children[i], childCount: children.length),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: _cols(context),
          mainAxisSpacing: mainSpacing,
          crossAxisSpacing: spacing,
          childAspectRatio: childAspectRatio,
        ),
      ),
    );
  }
}
