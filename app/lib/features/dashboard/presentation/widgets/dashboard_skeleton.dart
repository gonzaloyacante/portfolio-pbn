import 'package:flutter/material.dart';

import '../../../../core/theme/app_breakpoints.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../shared/widgets/widgets.dart';

class DashboardSkeleton extends StatelessWidget {
  const DashboardSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    final padding = AppBreakpoints.pagePadding(context);
    final isExpanded = AppBreakpoints.isExpanded(context);
    final cols = AppBreakpoints.gridColumns(
      context,
      compact: 2,
      medium: 4,
      expanded: 4,
    );
    final gutter = AppBreakpoints.gutter(context);
    final margin = AppBreakpoints.pageMargin(context);

    return ShimmerLoader(
      child: SingleChildScrollView(
        physics: const NeverScrollableScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Estadísticas ──────────────────────────────────────────────
            Padding(
              padding: padding.copyWith(bottom: AppSpacing.sm),
              child: const ShimmerBox(width: 160, height: 18, borderRadius: 6),
            ),
            Padding(
              padding: EdgeInsets.fromLTRB(margin, 0, margin, 0),
              child: GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: cols,
                  mainAxisSpacing: gutter,
                  crossAxisSpacing: gutter,
                  childAspectRatio: 2.6,
                ),
                itemCount: 8,
                itemBuilder: (_, _) => const SkeletonStatCard(),
              ),
            ),
            const SizedBox(height: AppSpacing.xl),

            // ── Tendencias (charts) ────────────────────────────────────────
            Padding(
              padding: padding.copyWith(bottom: AppSpacing.sm),
              child: const ShimmerBox(width: 140, height: 18, borderRadius: 6),
            ),
            Padding(
              padding: padding.copyWith(top: 0),
              child: isExpanded
                  ? Row(
                      children: [
                        const Expanded(
                          child: ShimmerBox(
                            width: double.infinity,
                            height: 180,
                            borderRadius: 16,
                          ),
                        ),
                        SizedBox(width: gutter),
                        const Expanded(
                          child: ShimmerBox(
                            width: double.infinity,
                            height: 180,
                            borderRadius: 16,
                          ),
                        ),
                      ],
                    )
                  : const Column(
                      children: [
                        ShimmerBox(
                          width: double.infinity,
                          height: 180,
                          borderRadius: 16,
                        ),
                        SizedBox(height: AppSpacing.base),
                        ShimmerBox(
                          width: double.infinity,
                          height: 180,
                          borderRadius: 16,
                        ),
                      ],
                    ),
            ),
            const SizedBox(height: AppSpacing.xl),

            // ── Top categorías (ranking) ────────────────────────────────────
            Padding(
              padding: padding.copyWith(bottom: AppSpacing.sm),
              child: const ShimmerBox(width: 120, height: 18, borderRadius: 6),
            ),
            Padding(
              padding: padding.copyWith(top: 0),
              child: Column(
                children: List.generate(
                  5,
                  (_) => const Padding(
                    padding: EdgeInsets.only(bottom: AppSpacing.sm),
                    child: SkeletonRankingItem(),
                  ),
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.xxxl),
          ],
        ),
      ),
    );
  }
}
