import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../features/app_settings/providers/app_preferences_provider.dart';
import '../../../core/utils/app_logger.dart';
import '../../../core/router/route_names.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/widgets.dart';

import '../data/categories_repository.dart';
import '../data/category_model.dart';
import '../providers/categories_provider.dart';
import '../../settings/data/settings_model.dart';
import '../../settings/providers/settings_provider.dart';
import 'widgets/category_grid_card.dart';
import 'widgets/category_settings_dialog.dart';
import 'widgets/category_tile.dart';

class CategoriesListPage extends ConsumerStatefulWidget {
  const CategoriesListPage({super.key});

  @override
  ConsumerState<CategoriesListPage> createState() => _CategoriesListPageState();
}

class _CategoriesListPageState extends ConsumerState<CategoriesListPage> {
  final _searchController = TextEditingController();
  String _search = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearch(String value) {
    setState(() => _search = value.trim());
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

  Future<void> _showSettingsDialog(BuildContext context) async {
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
              builder: (_, controller) {
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

  @override
  Widget build(BuildContext context) {
    final async = ref.watch(
      categoriesListProvider(search: _search.isEmpty ? null : _search),
    );
    final viewMode = ref.watch(categoriesViewModeProvider);
    final hPad = AppBreakpoints.pageMargin(context);

    return AppScaffold(
      title: 'Categorías',
      actions: [
        IconButton(
          icon: const Icon(Icons.tune_rounded),
          tooltip: 'Configurar visualización',
          onPressed: () => _showSettingsDialog(context),
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
      body: Column(
        children: [
          Padding(
            padding: EdgeInsets.fromLTRB(
              hPad,
              AppSpacing.base,
              hPad,
              AppSpacing.base,
            ),
            child: AppSearchBar(
              hint: 'Buscar categorías…',
              controller: _searchController,
              onChanged: _onSearch,
            ),
          ),
          Expanded(
            child: async.when(
              loading: () => viewMode == ViewMode.grid
                  ? const SkeletonCategoriesGrid()
                  : const SkeletonCategoriesList(),
              error: (e, _) => ErrorState(
                message: e.toString(),
                onRetry: () => ref.invalidate(categoriesListProvider),
              ),
              data: (paginated) => paginated.data.isEmpty
                  ? const EmptyState(
                      icon: Icons.category_outlined,
                      title: 'Sin categorías',
                      subtitle: 'Crea tu primera categoría',
                    )
                  : RefreshIndicator(
                      onRefresh: () async =>
                          ref.invalidate(categoriesListProvider),
                      child: viewMode == ViewMode.grid
                          ? _buildGrid(paginated.data, hPad)
                          : _buildList(paginated.data, hPad),
                    ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildList(List<CategoryItem> items, double hPad) {
    return ListView.separated(
      padding: EdgeInsets.symmetric(horizontal: hPad),
      itemCount: items.length,
      separatorBuilder: (_, _) => const SizedBox(height: 8),
      itemBuilder: (ctx, i) => RepaintBoundary(
        child: FadeSlideIn(
          delay: Duration(milliseconds: (i * 40).clamp(0, 300)),
          child: CategoryTile(item: items[i], onDelete: _delete),
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
          child: CategoryGridCard(item: items[i], onDelete: _delete),
        ),
      ),
    );
  }
}
