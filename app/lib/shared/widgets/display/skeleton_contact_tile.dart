import 'package:flutter/material.dart';

import '../../../core/theme/app_radius.dart';
import '../app_card.dart';
import 'shimmer_loader.dart';

class SkeletonContactTile extends StatelessWidget {
  const SkeletonContactTile({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      borderRadius: AppRadius.forTile,
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
      child: const Row(
        children: [
          ShimmerBox(width: 44, height: 44, borderRadius: 14),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ShimmerBox(width: double.infinity, height: 13, borderRadius: 6),
                SizedBox(height: 5),
                ShimmerBox(width: 160, height: 11, borderRadius: 5),
                SizedBox(height: 4),
                ShimmerBox(width: 220, height: 11, borderRadius: 5),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
