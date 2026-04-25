import 'package:flutter/material.dart';

import '../app_card.dart';
import 'shimmer_loader.dart';

class SkeletonTrashCard extends StatelessWidget {
  const SkeletonTrashCard({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppCard(
      borderRadius: BorderRadius.all(Radius.circular(16)),
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              ShimmerBox(width: 44, height: 44, borderRadius: 22),
              SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ShimmerBox(
                      width: double.infinity,
                      height: 13,
                      borderRadius: 6,
                    ),
                    SizedBox(height: 4),
                    ShimmerBox(width: 80, height: 11, borderRadius: 5),
                  ],
                ),
              ),
              SizedBox(width: 8),
              ShimmerBox(width: 60, height: 20, borderRadius: 10),
            ],
          ),
          SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              ShimmerBox(width: 80, height: 30, borderRadius: 12),
              SizedBox(width: 8),
              ShimmerBox(width: 80, height: 30, borderRadius: 12),
            ],
          ),
        ],
      ),
    );
  }
}
