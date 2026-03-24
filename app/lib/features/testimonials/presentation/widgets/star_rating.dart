import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';

class StarRating extends StatelessWidget {
  const StarRating({super.key, required this.rating});

  final int rating;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(
        5,
        (i) => Icon(
          i < rating ? Icons.star : Icons.star_border,
          size: 14,
          color: AppColors.warning,
        ),
      ),
    );
  }
}
