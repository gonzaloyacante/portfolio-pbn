import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shimmer/shimmer.dart';

import '../../../features/app_settings/providers/app_preferences_provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../app_card.dart';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BASE LAYER — ShimmerLoader + ShimmerBox
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/// Envuelve su hijo con el efecto shimmer.
///
/// Todos los skeleton widgets deben estar dentro de un [ShimmerLoader].
/// Cuando [isLoading] es `false` el hijo se renderiza sin efecto.
/// Cuando las animaciones están deshabilitadas en preferencias, muestra
/// el hijo con un fondo estático en lugar del efecto animado.
class ShimmerLoader extends ConsumerWidget {
  const ShimmerLoader({super.key, required this.child, this.isLoading = true});

  final Widget child;
  final bool isLoading;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (!isLoading) return child;

    final animationsEnabled = ref.watch(animationsEnabledProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    // Sin animaciones: caja estática con el color base del skeleton.
    if (!animationsEnabled) {
      return ColorFiltered(
        colorFilter: ColorFilter.mode(
          isDark ? AppColors.darkMuted : AppColors.lightBorder,
          BlendMode.srcATop,
        ),
        child: child,
      );
    }

    return Shimmer.fromColors(
      baseColor: isDark ? AppColors.darkMuted : AppColors.lightBorder,
      highlightColor: isDark
          ? AppColors.darkShimmerHighlight
          : AppColors.lightMuted,
      child: child,
    );
  }
}

/// Caja rectangular shimmer — el átomo de todo skeleton.
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GENERIC LAYER (backward-compatible)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/// Tarjeta esqueleto genérica — icono circular + 3 líneas de texto.
class SkeletonCard extends StatelessWidget {
  const SkeletonCard({super.key, this.hasImage = true});

  final bool hasImage;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(
        horizontal: AppBreakpoints.pageMargin(context),
        vertical: AppSpacing.xs + 2,
      ),
      child: AppCard(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (hasImage) ...[
              const ShimmerBox(
                width: 60,
                height: 60,
                borderRadius: AppRadius.tile,
              ),
              const SizedBox(width: AppSpacing.md),
            ],
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ShimmerBox(width: double.infinity, height: 16),
                  SizedBox(height: AppSpacing.sm),
                  ShimmerBox(width: 200, height: 12),
                  SizedBox(height: AppSpacing.xs + 2),
                  ShimmerBox(width: 140, height: 12),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Tarjeta esqueleto para grids — imagen + título + tags.
class SkeletonGridCard extends StatelessWidget {
  const SkeletonGridCard({super.key, this.hasImage = true});

  final bool hasImage;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: EdgeInsets.zero,
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
                child: ColoredBox(
                  color: Theme.of(context).brightness == Brightness.dark
                      ? AppColors.darkMuted
                      : AppColors.lightBorder,
                ),
              ),
            ),
          ],
          const Padding(
            padding: EdgeInsets.all(AppSpacing.md),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                ShimmerBox(width: double.infinity, height: 14),
                SizedBox(height: AppSpacing.xs + 2),
                ShimmerBox(width: 100, height: 11),
                SizedBox(height: AppSpacing.sm),
                Row(
                  children: [
                    ShimmerBox(width: 48, height: 20),
                    SizedBox(width: AppSpacing.xs),
                    ShimmerBox(width: 48, height: 20),
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

/// Grid de [SkeletonGridCard] envuelto en [ShimmerLoader].
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
