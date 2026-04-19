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
            child: ServiceGridCard(item: items[i]),
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
          child: GestureDetector(
            onLongPress: () {
              HapticFeedback.mediumImpact();
              _showServiceActions(ctx, items[i]);
            },
            child: ServiceTile(item: items[i]),
          ),
        ),
      ),
    );
  }

  void _showServiceActions(BuildContext ctx, ServiceItem item) {
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
                  RouteNames.serviceEdit,
                  pathParameters: {'id': item.id},
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.calendar_today_outlined),
              title: const Text('Nueva reserva'),
              onTap: () {
                Navigator.of(sheetCtx).pop();
                ctx.pushNamed(
                  RouteNames.bookingNew,
                  extra: {'serviceId': item.id},
                );
              },
            ),
            ListTile(
              leading: Icon(
                item.isActive
                    ? Icons.visibility_off_outlined
                    : Icons.visibility_outlined,
              ),
              title: Text(item.isActive ? 'Desactivar' : 'Activar'),
              onTap: () {
                Navigator.of(sheetCtx).pop();
                _toggleServiceActive(ctx, item);
              },
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  Future<void> _toggleServiceActive(BuildContext ctx, ServiceItem item) async {
    try {
      await ref.read(servicesRepositoryProvider).updateService(item.id, {
        'isActive': !item.isActive,
      });
      ref.invalidate(servicesListProvider);
      if (ctx.mounted) {
        ScaffoldMessenger.of(ctx).showSnackBar(
          SnackBar(
            content: Text(
              item.isActive ? 'Servicio desactivado' : 'Servicio activado',
            ),
          ),
        );
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (ctx.mounted) {
        ScaffoldMessenger.of(
          ctx,
        ).showSnackBar(SnackBar(content: Text('Error al actualizar: $e')));
      }
    }
  }
}
