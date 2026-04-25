import 'package:flutter/material.dart';

import '../../../core/theme/app_breakpoints.dart';
import 'shimmer_loader.dart';
import 'skeleton_contact_tile.dart';

class SkeletonContactsList extends StatelessWidget {
  const SkeletonContactsList({super.key, this.itemCount = 8});
  final int itemCount;

  @override
  Widget build(BuildContext context) {
    final hPad = AppBreakpoints.pageMargin(context);
    return ShimmerLoader(
      child: ListView.separated(
        padding: EdgeInsets.symmetric(horizontal: hPad),
        itemCount: itemCount,
        separatorBuilder: (_, _) => const SizedBox(height: 6),
        itemBuilder: (_, _) => const SkeletonContactTile(),
      ),
    );
  }
}
