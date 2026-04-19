part of 'categories_list_page.dart';

extension _CategoriesListPageBuilders on _CategoriesListPageState {
  void showCategoryActions(BuildContext ctx, CategoryItem item) {
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
                  RouteNames.categoryEdit,
                  pathParameters: {'id': item.id},
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
                _toggleCategoryActive(ctx, item);
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

  Future<void> showSettingsDialog(BuildContext context) async {
    CategoryDisplaySettings current;
    try {
      current = await ref.read(categoryDisplaySettingsProvider.future);
    } catch (e, st) {
      AppLogger.warn(
        'CategoriesListPage: error loading display settings, using defaults — $e',
      );
      Sentry.captureException(e, stackTrace: st);
      current = const CategoryDisplaySettings();
    }
    if (!context.mounted) return;

    final isMobile = AppBreakpoints.isMobile(context);

    if (isMobile) {
      await showModalBottomSheet<void>(
        context: context,
        isScrollControlled: true,
        backgroundColor: Theme.of(context).colorScheme.surface,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
        ),
        builder: (ctx) {
          return Padding(
            padding: EdgeInsets.only(
              bottom: MediaQuery.of(ctx).viewInsets.bottom,
            ),
            child: DraggableScrollableSheet(
              initialChildSize: 0.7,
              minChildSize: 0.4,
              maxChildSize: 0.95,
              expand: false,
              builder: (BuildContext _, ScrollController controller) {
                return SingleChildScrollView(
                  controller: controller,
                  child: CategorySettingsDialog(
                    initial: current,
                    fullWidth: true,
                    onSave: (updated) async {
                      await ref
                          .read(settingsRepositoryProvider)
                          .updateCategorySettings({
                            'showDescription': updated.showDescription,
                            'gridColumns': updated.gridColumns,
                          });
                      ref.invalidate(categoryDisplaySettingsProvider);
                    },
                  ),
                );
              },
            ),
          );
        },
      );
    } else {
      await showDialog<void>(
        context: context,
        builder: (ctx) {
          final screenW = MediaQuery.of(ctx).size.width;
          final maxW = screenW * 0.92;
          final dialogW = maxW > 760 ? 760.0 : maxW;
          return Center(
            child: ConstrainedBox(
              constraints: BoxConstraints(maxWidth: dialogW),
              child: CategorySettingsDialog(
                initial: current,
                onSave: (updated) async {
                  await ref
                      .read(settingsRepositoryProvider)
                      .updateCategorySettings({
                        'showDescription': updated.showDescription,
                        'gridColumns': updated.gridColumns,
                      });
                  ref.invalidate(categoryDisplaySettingsProvider);
                },
              ),
            ),
          );
        },
      );
    }
  }

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
                showCategoryActions(ctx, items[i]);
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
              showCategoryActions(ctx, items[i]);
            },
            child: CategoryGridCard(item: items[i], onDelete: _delete),
          ),
        ),
      ),
    );
  }

  Future<void> _delete(BuildContext ctx, CategoryItem item) async {
    final confirmed = await ConfirmDialog.show(
      ctx,
      title: 'Eliminar categoría',
      message: '¿Eliminar "${item.name}"? Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar',
      isDestructive: true,
    );
    if (!confirmed || !ctx.mounted) return;

    try {
      await ref.read(categoriesRepositoryProvider).deleteCategory(item.id);
      ref.invalidate(categoriesListProvider);
      if (ctx.mounted) {
        ScaffoldMessenger.of(
          ctx,
        ).showSnackBar(const SnackBar(content: Text('Categoría eliminada')));
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (ctx.mounted) {
        ScaffoldMessenger.of(
          ctx,
        ).showSnackBar(SnackBar(content: Text('Error al eliminar: $e')));
      }
    }
  }

  Future<void> _toggleCategoryActive(
    BuildContext ctx,
    CategoryItem item,
  ) async {
    try {
      await ref.read(categoriesRepositoryProvider).updateCategory(item.id, {
        'isActive': !item.isActive,
      });
      ref.invalidate(categoriesListProvider);
      if (ctx.mounted) {
        ScaffoldMessenger.of(ctx).showSnackBar(
          SnackBar(
            content: Text(
              item.isActive ? 'Categoría desactivada' : 'Categoría activada',
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
