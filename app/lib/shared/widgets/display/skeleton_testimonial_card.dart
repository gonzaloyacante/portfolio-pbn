import 'package:flutter/material.dart';

import '../../../core/theme/app_radius.dart';
import '../app_card.dart';
import 'shimmer_loader.dart';

class SkeletonTestimonialCard extends StatelessWidget {
  const SkeletonTestimonialCard({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      borderRadius: AppRadius.forTile,
      padding: const EdgeInsets.fromLTRB(14, 12, 4, 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const ShimmerBox(width: 44, height: 44, borderRadius: 22),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Expanded(
                      child: ShimmerBox(
                        width: double.infinity,
                        height: 13,
                        borderRadius: 6,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Row(
                      children: List.generate(
                        5,
                        (_) => const Padding(
                          padding: EdgeInsets.only(left: 2),
                          child: ShimmerBox(
                            width: 12,
                            height: 12,
                            borderRadius: 3,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                const ShimmerBox(width: 140, height: 11, borderRadius: 5),
                const SizedBox(height: 8),
                const ShimmerBox(
                  width: double.infinity,
                  height: 11,
                  borderRadius: 5,
                ),
                const SizedBox(height: 3),
                const ShimmerBox(width: 200, height: 11, borderRadius: 5),
                const SizedBox(height: 8),
                const ShimmerBox(width: 68, height: 20, borderRadius: 10),
              ],
            ),
          ),
          const SizedBox(width: 4),
          const ShimmerBox(width: 20, height: 20, borderRadius: 4),
          const SizedBox(width: 8),
        ],
      ),
    );
  }
}
