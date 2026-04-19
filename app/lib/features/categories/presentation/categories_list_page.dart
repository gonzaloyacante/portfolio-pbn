import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/utils/app_logger.dart';
import '../../../core/router/route_names.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../features/app_settings/providers/app_preferences_provider.dart';
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

  void _onSearch(String v) => setState(() => _search = v.trim());

  @override
  Widget build(BuildContext context) {
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
