import 'package:flutter/material.dart';

import '../../core/theme/app_breakpoints.dart';
import '../../core/theme/app_radius.dart';
import '../../core/theme/app_spacing.dart';
import 'app_card.dart';
import 'shimmer_loader.dart';

// ── Projects ──────────────────────────────────────────────────────────────────

/// Réplica exacta de `_ProjectTile`:
/// thumbnail 80×90 + título + categoría + tags.
class SkeletonProjectTile extends StatelessWidget {
  const SkeletonProjectTile({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      borderRadius: AppRadius.forTile,
      padding: EdgeInsets.zero,
      child: const SizedBox(
        height: 90,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(AppRadius.tile),
                bottomLeft: Radius.circular(AppRadius.tile),
              ),
              child: ShimmerBox(width: 80, height: 90, borderRadius: 0),
            ),
            Expanded(
              child: Padding(
                padding: EdgeInsets.fromLTRB(14, 10, 4, 10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
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
                        SizedBox(width: 8),
                        ShimmerBox(width: 52, height: 20, borderRadius: 10),
                      ],
                    ),
                    SizedBox(height: 5),
                    ShimmerBox(width: 110, height: 11, borderRadius: 5),
                    SizedBox(height: 6),
                    Row(
                      children: [
                        ShimmerBox(width: 44, height: 18, borderRadius: 9),
                        SizedBox(width: 4),
                        ShimmerBox(width: 44, height: 18, borderRadius: 9),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            ShimmerBox(width: 20, height: 20, borderRadius: 4),
            SizedBox(width: 8),
          ],
        ),
      ),
    );
  }
}

/// Réplica exacta de `_ProjectGridCard`:
/// imagen 140px + nombre + categoría + tags.
class SkeletonProjectGridCard extends StatelessWidget {
  const SkeletonProjectGridCard({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      borderRadius: AppRadius.forTile,
      padding: EdgeInsets.zero,
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.vertical(
              top: Radius.circular(AppRadius.tile),
            ),
            child: ShimmerBox(
              width: double.infinity,
              height: 140,
              borderRadius: 0,
            ),
          ),
          Padding(
            padding: EdgeInsets.fromLTRB(12, 8, 12, 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ShimmerBox(width: double.infinity, height: 13, borderRadius: 6),
                SizedBox(height: 4),
                ShimmerBox(width: 90, height: 11, borderRadius: 5),
                SizedBox(height: 8),
                Row(
                  children: [
                    ShimmerBox(width: 44, height: 18, borderRadius: 9),
                    SizedBox(width: 4),
                    ShimmerBox(width: 44, height: 18, borderRadius: 9),
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

// ── Projects composite ────────────────────────────────────────────────────────

/// Lista shimmer de proyectos — replica `_ProjectTile` × N.
class SkeletonProjectsList extends StatelessWidget {
  const SkeletonProjectsList({super.key, this.itemCount = 8});
  final int itemCount;

  @override
  Widget build(BuildContext context) {
    final hPad = AppBreakpoints.pageMargin(context);
    return ShimmerLoader(
      child: ListView.separated(
        padding: EdgeInsets.symmetric(horizontal: hPad),
        itemCount: itemCount,
        separatorBuilder: (_, _) => const SizedBox(height: 8),
        itemBuilder: (_, _) => const SkeletonProjectTile(),
      ),
    );
  }
}

/// Grid shimmer de proyectos — replica `_ProjectGridCard` × N.
class SkeletonProjectsGrid extends StatelessWidget {
  const SkeletonProjectsGrid({super.key, this.itemCount = 8});
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
          childAspectRatio: 0.78,
        ),
        itemCount: itemCount,
        itemBuilder: (_, _) => const SkeletonProjectGridCard(),
      ),
    );
  }
}
