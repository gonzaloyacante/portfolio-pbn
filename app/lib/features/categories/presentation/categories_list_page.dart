import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../features/app_settings/providers/app_preferences_provider.dart';
import '../../../core/utils/app_logger.dart';
import '../../../core/router/route_names.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_colors.dart';
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

part 'categories_list_page_builders.dart';

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

  void _showCategoryActions(BuildContext ctx, CategoryItem item) =>
      showCategoryActions(ctx, item);

  Future<void> _showSettingsDialog(BuildContext context) =>
      showSettingsDialog(context);

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
}
