import 'package:flutter/material.dart';
import 'package:portfolio_pbn/features/app_settings/providers/app_preferences_provider.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

/// Shows the appropriate loading skeleton based on the current [viewMode].
class GallerySkeleton extends StatelessWidget {
  const GallerySkeleton({super.key, required this.viewMode});

  final ViewMode viewMode;

  @override
  Widget build(BuildContext context) {
    if (viewMode == ViewMode.grid) {
      return const SkeletonCategoriesGrid();
    }
    return const SkeletonCategoriesList();
  }
}
