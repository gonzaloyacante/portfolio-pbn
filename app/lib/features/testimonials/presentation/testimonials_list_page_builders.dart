part of 'testimonials_list_page.dart';

extension _TestimonialsListPageBuilders on _TestimonialsListPageState {
  void _showTestimonialActions(BuildContext ctx, TestimonialItem item) {
    showModalBottomSheet<void>(
      context: ctx,
      builder: (sheetCtx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.edit_outlined),
              title: const Text('Editar'),
              onTap: () {
                Navigator.of(sheetCtx).pop();
                ctx.pushNamed(
                  RouteNames.testimonialEdit,
                  pathParameters: {'id': item.id},
                );
              },
            ),
            if (item.status != 'APPROVED')
              ListTile(
                leading: const Icon(Icons.check_circle_outline),
                title: const Text('Aprobar'),
                onTap: () {
                  Navigator.of(sheetCtx).pop();
                  _changeTestimonialStatus(ctx, item, 'APPROVED');
                },
              ),
            if (item.status != 'REJECTED')
              ListTile(
                leading: const Icon(
                  Icons.cancel_outlined,
                  color: AppColors.destructive,
                ),
                title: const Text('Rechazar'),
                onTap: () {
                  Navigator.of(sheetCtx).pop();
                  _changeTestimonialStatus(ctx, item, 'REJECTED');
                },
              ),
            ListTile(
              leading: const Icon(
                Icons.delete_outline,
                color: AppColors.destructive,
              ),
              title: const Text(
                'Eliminar',
                style: TextStyle(color: AppColors.destructive),
              ),
              onTap: () {
                Navigator.of(sheetCtx).pop();
                _delete(ctx, item);
              },
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  Widget _buildList(List<TestimonialItem> items, double hPad) {
    return RefreshIndicator(
      onRefresh: () async => ref.invalidate(testimonialsListProvider),
      child: ListView.separated(
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
                  _showTestimonialActions(ctx, items[i]);
                },
                child: TestimonialTile(
                  item: items[i],
                  statusOf: _statusFromString,
                  onDelete: _delete,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
