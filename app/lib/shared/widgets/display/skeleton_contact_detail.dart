import 'package:flutter/material.dart';

import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_spacing.dart';
import 'shimmer_loader.dart';

class SkeletonContactDetail extends StatelessWidget {
  const SkeletonContactDetail({super.key});

  @override
  Widget build(BuildContext context) {
    final padding = AppBreakpoints.pagePadding(context);
    return ShimmerLoader(
      child: SingleChildScrollView(
        padding: padding,
        child: const Column(
          children: [
            ShimmerBox(width: double.infinity, height: 160, borderRadius: 16),
            SizedBox(height: AppSpacing.base),
            ShimmerBox(width: double.infinity, height: 120, borderRadius: 16),
            SizedBox(height: AppSpacing.base),
            ShimmerBox(width: double.infinity, height: 100, borderRadius: 16),
            SizedBox(height: AppSpacing.base),
            ShimmerBox(width: double.infinity, height: 100, borderRadius: 16),
          ],
        ),
      ),
    );
  }
}
