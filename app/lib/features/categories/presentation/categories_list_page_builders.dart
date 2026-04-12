part of 'categories_list_page.dart';

extension _CategoriesListPageBuilders on _CategoriesListPageState {
  Widget _buildList(List<CategoryItem> items, double hPad) {
    return ListView.separated(
      padding: EdgeInsets.symmetric(horizontal: hPad),
      itemCount: items.length,
      separatorBuilder: (BuildContext _, int _) => const SizedBox(height: 8),
      itemBuilder: (ctx, i) => RepaintBoundary(
        child: FadeSlideIn(
          delay: Duration(milliseconds: (i * 40).clamp(0, 300)),
          child: Dismissible(
            key: Key(items[i].id),
            direction: DismissDirection.endToStart,
            background: Container(
              color: AppColors.destructive,
              alignment: Alignment.centerRight,
              padding: const EdgeInsets.only(right: AppSpacing.lg),
              child: const Icon(Icons.delete_outline, color: Colors.white),
            ),
            confirmDismiss: (DismissDirection _) async {
              HapticFeedback.mediumImpact();
              await _delete(ctx, items[i]);
              return false;
            },
            child: GestureDetector(
              onLongPress: () {
                HapticFeedback.mediumImpact();
                _showCategoryActions(ctx, items[i]);
              },
              child: CategoryTile(item: items[i], onDelete: _delete),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildGrid(List<CategoryItem> items, double hPad) {
    final width = MediaQuery.sizeOf(context).width;
    final cols = width >= 900 ? 3 : 2;
    return GridView.builder(
      padding: EdgeInsets.symmetric(horizontal: hPad),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: cols,
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        childAspectRatio: 1.1,
      ),
      itemCount: items.length,
      itemBuilder: (ctx, i) => RepaintBoundary(
        child: FadeSlideIn(
          delay: Duration(milliseconds: (i * 40).clamp(0, 300)),
          child: GestureDetector(
            onLongPress: () {
              HapticFeedback.mediumImpact();
              _showCategoryActions(ctx, items[i]);
            },
            child: CategoryGridCard(item: items[i], onDelete: _delete),
          ),
        ),
      ),
    );
  }
}
