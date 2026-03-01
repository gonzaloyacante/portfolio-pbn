import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_breakpoints.dart';
import '../../core/theme/app_radius.dart';
import '../../core/theme/app_spacing.dart';

// ── ShimmerLoader ─────────────────────────────────────────────────────────────

/// Skeleton loader con efecto shimmer para estados de carga.
///
/// Uso:
/// ```dart
/// ShimmerLoader(
///   child: ListView.builder(
///     itemCount: 5,
///     itemBuilder: (_, __) => const SkeletonCard(),
///   ),
/// )
/// ```
class ShimmerLoader extends StatelessWidget {
  const ShimmerLoader({super.key, required this.child, this.isLoading = true});

  final Widget child;
  final bool isLoading;

  @override
  Widget build(BuildContext context) {
    if (!isLoading) return child;

    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Shimmer.fromColors(
      baseColor: isDark ? AppColors.darkMuted : AppColors.lightBorder,
      highlightColor: isDark ? const Color(0xFF3A2020) : AppColors.lightMuted,
      child: child,
    );
  }
}

// ── ShimmerBox ────────────────────────────────────────────────────────────────

/// Caja rectangular shimmer para usar como placeholder.
class ShimmerBox extends StatelessWidget {
  const ShimmerBox({
    super.key,
    required this.width,
    required this.height,
    this.borderRadius,
  });

  final double width;
  final double height;
  final double? borderRadius;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkMuted : AppColors.lightCard,
        borderRadius: BorderRadius.circular(borderRadius ?? AppRadius.sm),
      ),
    );
  }
}

// ── SkeletonCard ──────────────────────────────────────────────────────────────

/// Tarjeta esqueleto genérica para listas de contenido.
class SkeletonCard extends StatelessWidget {
  const SkeletonCard({super.key, this.hasImage = true});

  final bool hasImage;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.symmetric(
        horizontal: AppBreakpoints.pageMargin(context),
        vertical: AppSpacing.xs + 2,
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (hasImage) ...[
              ShimmerBox(width: 60, height: 60, borderRadius: AppRadius.tile),
              const SizedBox(width: AppSpacing.md),
            ],
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const ShimmerBox(width: double.infinity, height: 16),
                  const SizedBox(height: AppSpacing.sm),
                  const ShimmerBox(width: 200, height: 12),
                  const SizedBox(height: AppSpacing.xs + 2),
                  const ShimmerBox(width: 140, height: 12),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── SkeletonGridCard ──────────────────────────────────────────────────────────

/// Tarjeta esqueleto para grids. Réplica de la forma visual de ProjectCard/ServiceCard.
class SkeletonGridCard extends StatelessWidget {
  const SkeletonGridCard({super.key, this.hasImage = true});

  final bool hasImage;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (hasImage) ...[
            Expanded(
              child: ClipRRect(
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(AppRadius.card),
                  topRight: Radius.circular(AppRadius.card),
                ),
                child: Container(
                  width: double.infinity,
                  color: Colors.white,
                ),
              ),
            ),
          ],
          Padding(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                const ShimmerBox(width: double.infinity, height: 14),
                const SizedBox(height: AppSpacing.xs + 2),
                const ShimmerBox(width: 100, height: 11),
                const SizedBox(height: AppSpacing.sm),
                Row(
                  children: [
                    const ShimmerBox(width: 48, height: 20),
                    const SizedBox(width: AppSpacing.xs),
                    const ShimmerBox(width: 48, height: 20),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── SkeletonListView ──────────────────────────────────────────────────────────

/// Lista de [SkeletonCard] envuelta en [ShimmerLoader].
class SkeletonListView extends StatelessWidget {
  const SkeletonListView({super.key, this.itemCount = 6, this.hasImage = true});

  final int itemCount;
  final bool hasImage;

  @override
  Widget build(BuildContext context) {
    return ShimmerLoader(
      child: ListView.builder(
        itemCount: itemCount,
        itemBuilder: (_, _) => SkeletonCard(hasImage: hasImage),
      ),
    );
  }
}

// ── SkeletonGridView ──────────────────────────────────────────────────────────

/// Grid de [SkeletonGridCard] envuelto en [ShimmerLoader].
/// Se adapta automáticamente al breakpoint actual.
class SkeletonGridView extends StatelessWidget {
  const SkeletonGridView({
    super.key,
    this.itemCount = 6,
    this.childAspectRatio = 0.85,
    this.compactCols = 2,
    this.hasImage = true,
  });

  final int itemCount;
  final double childAspectRatio;
  final int compactCols;
  final bool hasImage;

  @override
  Widget build(BuildContext context) {
    final cols = AppBreakpoints.gridColumns(
      context,
      compact: compactCols,
      medium: compactCols + 1,
      expanded: compactCols + 2,
    );
    final spacing = AppBreakpoints.gutter(context);
    final hPad = AppBreakpoints.pageMargin(context);

    return ShimmerLoader(
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        padding: EdgeInsets.symmetric(
          horizontal: hPad,
          vertical: AppSpacing.sm,
        ),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: cols,
          mainAxisSpacing: spacing,
          crossAxisSpacing: spacing,
          childAspectRatio: childAspectRatio,
        ),
        itemCount: itemCount,
        itemBuilder: (_, _) => SkeletonGridCard(hasImage: hasImage),
      ),
    );
  }
}
