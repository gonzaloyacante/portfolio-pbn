import 'package:flutter/material.dart';

import '../../../core/theme/app_radius.dart';
import '../app_card.dart';
import 'shimmer_loader.dart';

class SkeletonBookingCard extends StatelessWidget {
  const SkeletonBookingCard({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      borderRadius: AppRadius.forTile,
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
      child: const Row(
        children: [
          ShimmerBox(width: 46, height: 46, borderRadius: 14),
          SizedBox(width: 12),
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
                    SizedBox(width: 8),
                    ShimmerBox(width: 56, height: 20, borderRadius: 10),
                  ],
                ),
                SizedBox(height: 4),
                Row(
                  children: [
                    ShimmerBox(width: 13, height: 13, borderRadius: 4),
                    SizedBox(width: 4),
                    ShimmerBox(width: 140, height: 11, borderRadius: 5),
                  ],
                ),
              ],
            ),
          ),
          SizedBox(width: 8),
          ShimmerBox(width: 20, height: 20, borderRadius: 4),
        ],
      ),
    );
  }
}
