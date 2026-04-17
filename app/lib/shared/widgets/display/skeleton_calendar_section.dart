import 'package:flutter/material.dart';

import 'shimmer_loader.dart';
import 'skeleton_booking_card.dart';

class SkeletonCalendarSection extends StatelessWidget {
  const SkeletonCalendarSection({super.key, this.bookingsPerSection = 2});
  final int bookingsPerSection;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.only(bottom: 8),
          child: ShimmerBox(width: 140, height: 14, borderRadius: 6),
        ),
        ...List.generate(
          bookingsPerSection,
          (_) => const Padding(
            padding: EdgeInsets.only(bottom: 8),
            child: SkeletonBookingCard(),
          ),
        ),
      ],
    );
  }
}
