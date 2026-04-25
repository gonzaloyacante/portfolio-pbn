import 'package:flutter/material.dart';

import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_spacing.dart';
import 'shimmer_loader.dart';
import 'skeleton_calendar_section.dart';

class SkeletonCalendarList extends StatelessWidget {
  const SkeletonCalendarList({super.key, this.sectionCount = 3});
  final int sectionCount;

  @override
  Widget build(BuildContext context) {
    final hPad = AppBreakpoints.pageMargin(context);
    return ShimmerLoader(
      child: ListView.separated(
        padding: EdgeInsets.fromLTRB(hPad, 0, hPad, AppSpacing.xl),
        itemCount: sectionCount,
        separatorBuilder: (_, _) => const SizedBox(height: 16),
        itemBuilder: (_, _) => const SkeletonCalendarSection(),
      ),
    );
  }
}
