import 'package:flutter/material.dart';

import '../../../core/theme/app_spacing.dart';
import 'shimmer_loader.dart';
import 'skeleton_trash_card.dart';

class SkeletonTrashList extends StatelessWidget {
  const SkeletonTrashList({super.key, this.itemCount = 6});
  final int itemCount;

  @override
  Widget build(BuildContext context) {
    return ShimmerLoader(
      child: ListView.separated(
        padding: const EdgeInsets.all(AppSpacing.base),
        itemCount: itemCount,
        separatorBuilder: (_, _) => const SizedBox(height: 10),
        itemBuilder: (_, _) => const SkeletonTrashCard(),
      ),
    );
  }
}
