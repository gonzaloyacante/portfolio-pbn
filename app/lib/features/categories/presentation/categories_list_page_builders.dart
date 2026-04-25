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
          child: GestureDetector(
            onLongPress: () {
              HapticFeedback.mediumImpact();
              showCategoryActions(ctx, items[i]);
            },
            child: CategoryTile(item: items[i]),
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
            child: CategoryGridCard(item: items[i]),
          ),
        ),
      ),
    );
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

  Widget _buildPage(BuildContext context) {
    final hPad = AppBreakpoints.pageMargin(context);
    final viewMode = ref.watch(categoriesViewModeProvider);
    final async = ref.watch(
      categoriesListProvider(search: _search.isEmpty ? null : _search),
    );

    return AppScaffold(
      title: 'Categorías',
      actions: [
        IconButton(
          icon: const Icon(Icons.tune_rounded),
          tooltip: 'Configurar visualización',
          onPressed: () => showSettingsDialog(context),
        ),
        IconButton(
          icon: Icon(
            viewMode == ViewMode.grid
                ? Icons.view_list_rounded
                : Icons.grid_view_rounded,
          ),
          tooltip: viewMode == ViewMode.grid ? 'Vista lista' : 'Vista grid',
          onPressed: () =>
              ref.read(categoriesViewModeProvider.notifier).toggle(),
        ),
        IconButton(
          icon: const Icon(Icons.add),
          tooltip: 'Nueva categoría',
          onPressed: () => context.pushNamed(RouteNames.categoryNew),
        ),
      ],
      body: PaginatedListView<CategoryItem>(
        asyncValue: async,
        loadingWidget: viewMode == ViewMode.grid
            ? const SkeletonCategoriesGrid()
            : const SkeletonCategoriesList(),
        emptyState: const EmptyState(
          icon: Icons.category_outlined,
          title: 'Sin categorías',
          subtitle: 'Agrega la primera categoría',
        ),
        onRetry: () => ref.invalidate(categoriesListProvider),
        onRefresh: () async => ref.invalidate(categoriesListProvider),
        headerWidget: AppSearchBar(
          hint: 'Buscar categorías…',
          controller: _searchController,
          onChanged: _onSearch,
          padding: EdgeInsets.fromLTRB(
            hPad,
            AppSpacing.base,
            hPad,
            AppSpacing.base,
          ),
        ),
        dataBuilder: (items) => viewMode == ViewMode.grid
            ? _buildGrid(items, hPad)
            : _buildList(items, hPad),
      ),
    );
  }
}
