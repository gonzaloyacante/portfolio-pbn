import 'package:flutter/material.dart';

import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../app_card.dart';
import 'shimmer_loader.dart';

// ── Services ──────────────────────────────────────────────────────────────────

/// Réplica exacta de `_ServiceTile`:
/// icono 46×46 + nombre + precio + estado.
class SkeletonServiceTile extends StatelessWidget {
  const SkeletonServiceTile({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      borderRadius: AppRadius.forTile,
      padding: const EdgeInsets.fromLTRB(14, 12, 4, 12),
      child: const Row(
        children: [
          ShimmerBox(width: 46, height: 46, borderRadius: 14),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: ShimmerBox(
                        width: double.infinity,
                        height: 13,
                        borderRadius: 6,
                      ),
                    ),
                    const SizedBox(width: 8),
                    ShimmerBox(width: 52, height: 20, borderRadius: 10),
                  ],
                ),
                const SizedBox(height: 5),
                ShimmerBox(width: 130, height: 11, borderRadius: 5),
                const SizedBox(height: 3),
                ShimmerBox(width: 180, height: 11, borderRadius: 5),
              ],
            ),
          ),
          const SizedBox(width: 4),
          ShimmerBox(width: 20, height: 20, borderRadius: 4),
          const SizedBox(width: 8),
        ],
      ),
    );
  }
}

/// Réplica exacta de `_ServiceGridCard`:
/// icono + nombre + precio + badge de estado.
class SkeletonServiceGridCard extends StatelessWidget {
  const SkeletonServiceGridCard({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      borderRadius: AppRadius.forTile,
      padding: const EdgeInsets.fromLTRB(12, 14, 4, 12),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              ShimmerBox(width: 46, height: 46, borderRadius: 14),
              Spacer(),
              ShimmerBox(width: 18, height: 18, borderRadius: 4),
              const SizedBox(width: 8),
            ],
          ),
          const SizedBox(height: 10),
          ShimmerBox(width: double.infinity, height: 13, borderRadius: 6),
          const SizedBox(height: 4),
          ShimmerBox(width: 60, height: 11, borderRadius: 5),
          Spacer(),
          ShimmerBox(width: 54, height: 20, borderRadius: 10),
        ],
      ),
    );
  }
}

// ── Services composite ────────────────────────────────────────────────────────

/// Lista shimmer de servicios — replica `_ServiceTile` × N.
class SkeletonServicesList extends StatelessWidget {
  const SkeletonServicesList({super.key, this.itemCount = 6});
  final int itemCount;

  @override
  Widget build(BuildContext context) {
    final hPad = AppBreakpoints.pageMargin(context);
    return ShimmerLoader(
      child: ListView.separated(
        padding: EdgeInsets.symmetric(horizontal: hPad),
        itemCount: itemCount,
        separatorBuilder: (_, _) => const SizedBox(height: 8),
        itemBuilder: (_, _) => const SkeletonServiceTile(),
      ),
    );
  }
}

/// Grid shimmer de servicios — replica `_ServiceGridCard` × N.
class SkeletonServicesGrid extends StatelessWidget {
  const SkeletonServicesGrid({super.key, this.itemCount = 6});
  final int itemCount;

  @override
  Widget build(BuildContext context) {
    final hPad = AppBreakpoints.pageMargin(context);
    final spacing = AppBreakpoints.gutter(context);
    final cols = AppBreakpoints.gridColumns(
      context,
      compact: 2,
      medium: 3,
      expanded: 4,
    );
    return ShimmerLoader(
      child: GridView.builder(
        padding: EdgeInsets.fromLTRB(hPad, 0, hPad, AppSpacing.base),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: cols,
          crossAxisSpacing: spacing,
          mainAxisSpacing: spacing,
          childAspectRatio: 1.05,
        ),
        itemCount: itemCount,
        itemBuilder: (_, _) => const SkeletonServiceGridCard(),
      ),
    );
  }
}
