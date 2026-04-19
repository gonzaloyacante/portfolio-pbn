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
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  Widget _buildList(List<TestimonialItem> items, double hPad) {
    return ListView.separated(
      padding: EdgeInsets.symmetric(horizontal: hPad),
      itemCount: items.length,
      separatorBuilder: (BuildContext _, int _) => const SizedBox(height: 8),
      itemBuilder: (ctx, i) => RepaintBoundary(
        child: FadeSlideIn(
          delay: Duration(milliseconds: (i * 40).clamp(0, 300)),
          child: GestureDetector(
            onLongPress: () {
              HapticFeedback.mediumImpact();
              _showTestimonialActions(ctx, items[i]);
            },
            child: TestimonialTile(item: items[i], statusOf: _statusFromString),
          ),
        ),
      ),
    );
  }

  AppStatus _statusFromString(String status) => switch (status) {
    'APPROVED' => AppStatus.approved,
    'REJECTED' => AppStatus.rejected,
    _ => AppStatus.pending,
  };

  Future<void> _changeTestimonialStatus(
    BuildContext ctx,
    TestimonialItem item,
    String newStatus,
  ) async {
    try {
      await ref.read(testimonialsRepositoryProvider).updateTestimonial(
        item.id,
        {'status': newStatus},
      );
      ref.invalidate(testimonialsListProvider);
      if (ctx.mounted) {
        ScaffoldMessenger.of(ctx).showSnackBar(
          SnackBar(
            content: Text(
              newStatus == 'APPROVED'
                  ? 'Testimonio aprobado'
                  : 'Testimonio rechazado',
            ),
          ),
        );
      }
    } catch (e) {
      if (ctx.mounted) {
        ScaffoldMessenger.of(
          ctx,
        ).showSnackBar(SnackBar(content: Text('Error al actualizar: $e')));
      }
    }
  }
}
