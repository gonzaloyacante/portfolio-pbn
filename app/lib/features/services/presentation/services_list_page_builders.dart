part of 'services_list_page.dart';

extension _ServicesListPageBuilders on _ServicesListPageState {
  Widget _buildGrid(List<ServiceItem> items, double hPad) {
    return GridView.builder(
      padding: EdgeInsets.fromLTRB(hPad, 0, hPad, AppSpacing.base),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: AppBreakpoints.gridColumns(
          context,
          compact: 2,
          medium: 3,
          expanded: 4,
        ),
        crossAxisSpacing: AppBreakpoints.gutter(context),
        mainAxisSpacing: AppBreakpoints.gutter(context),
        childAspectRatio: 1.05,
      ),
      itemCount: items.length,
      itemBuilder: (ctx, i) => RepaintBoundary(
        child: FadeSlideIn(
          delay: Duration(milliseconds: (i * 40).clamp(0, 300)),
          child: GestureDetector(
            onLongPress: () {
              HapticFeedback.mediumImpact();
              _showServiceActions(ctx, items[i]);
            },
            child: ServiceGridCard(item: items[i], onDelete: _delete),
          ),
        ),
      ),
    );
  }

  Widget _buildList(List<ServiceItem> items, double hPad) {
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
                _showServiceActions(ctx, items[i]);
              },
              child: ServiceTile(item: items[i], onDelete: _delete),
            ),
          ),
        ),
      ),
    );
  }
}
