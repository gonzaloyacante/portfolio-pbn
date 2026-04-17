import 'package:flutter/material.dart';

import '../../../core/theme/app_breakpoints.dart';
import 'shimmer_loader.dart';
import 'skeleton_testimonial_card.dart';

class SkeletonTestimonialsList extends StatelessWidget {
  const SkeletonTestimonialsList({super.key, this.itemCount = 6});
  final int itemCount;

  @override
  Widget build(BuildContext context) {
    final hPad = AppBreakpoints.pageMargin(context);
    return ShimmerLoader(
      child: ListView.separated(
        padding: EdgeInsets.symmetric(horizontal: hPad),
        itemCount: itemCount,
        separatorBuilder: (_, _) => const SizedBox(height: 8),
        itemBuilder: (_, _) => const SkeletonTestimonialCard(),
      ),
    );
  }
}
