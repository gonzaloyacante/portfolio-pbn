part of 'category_gallery_page.dart';

// ── Skeleton ──────────────────────────────────────────────────────────────────

class _GallerySkeleton extends StatelessWidget {
  const _GallerySkeleton({required this.viewMode});

  final ViewMode viewMode;

  @override
  Widget build(BuildContext context) {
    if (viewMode == ViewMode.grid) {
      return const SkeletonCategoriesGrid();
    }
    return const SkeletonCategoriesList();
  }
}
