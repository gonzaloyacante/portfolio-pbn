import 'package:flutter/material.dart';

import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_radius.dart';
import '../app_card.dart';
import 'shimmer_loader.dart';

// ── Categories ────────────────────────────────────────────────────────────────

/// Réplica exacta de `_CategoryTile`:
/// thumbnail 80×80 en full-height + nombre + count.
class SkeletonCategoryTile extends StatelessWidget {
  const SkeletonCategoryTile({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      borderRadius: AppRadius.forTile,
      padding: EdgeInsets.zero,
      child: const SizedBox(
        height: 80,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(AppRadius.tile),
                bottomLeft: Radius.circular(AppRadius.tile),
              ),
              child: ShimmerBox(width: 80, height: 80, borderRadius: 0),
            ),
            Expanded(
              child: Padding(
                padding: EdgeInsets.fromLTRB(14, 12, 4, 12),
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
                    ShimmerBox(width: 100, height: 11, borderRadius: 5),
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

/// Réplica exacta de `_CategoryGridCard`:
/// imagen 100px + nombre + count + badge.
class SkeletonCategoryGridCard extends StatelessWidget {
  const SkeletonCategoryGridCard({super.key});

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
              height: 100,
              borderRadius: 0,
            ),
          ),
          Padding(
            padding: EdgeInsets.fromLTRB(10, 8, 10, 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ShimmerBox(width: double.infinity, height: 13, borderRadius: 6),
                SizedBox(height: 4),
                ShimmerBox(width: 80, height: 11, borderRadius: 5),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── Categories composite ──────────────────────────────────────────────────────

/// Lista shimmer de categorías — replica `_CategoryTile` × N.
class SkeletonCategoriesList extends StatelessWidget {
  const SkeletonCategoriesList({super.key, this.itemCount = 8});
  final int itemCount;

  @override
  Widget build(BuildContext context) {
    final hPad = AppBreakpoints.pageMargin(context);
    return ShimmerLoader(
      child: ListView.separated(
        padding: EdgeInsets.symmetric(horizontal: hPad),
        itemCount: itemCount,
        separatorBuilder: (_, _) => const SizedBox(height: 8),
        itemBuilder: (_, _) => const SkeletonCategoryTile(),
      ),
    );
  }
}

/// Grid shimmer de categorías — replica `_CategoryGridCard` × N.
class SkeletonCategoriesGrid extends StatelessWidget {
  const SkeletonCategoriesGrid({super.key, this.itemCount = 8});
  final int itemCount;

  @override
  Widget build(BuildContext context) {
    final hPad = AppBreakpoints.pageMargin(context);
    final width = MediaQuery.sizeOf(context).width;
    final cols = width >= 900 ? 3 : 2;
    return ShimmerLoader(
      child: GridView.builder(
        padding: EdgeInsets.symmetric(horizontal: hPad),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: cols,
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 1.1,
        ),
        itemCount: itemCount,
        itemBuilder: (_, _) => const SkeletonCategoryGridCard(),
      ),
    );
  }
}
