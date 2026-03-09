import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/providers/app_preferences_provider.dart';
import '../../../core/router/route_names.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/app_search_bar.dart';
import '../../../shared/widgets/fade_slide_in.dart';
import '../../../shared/widgets/confirm_dialog.dart';
import '../../../shared/widgets/empty_state.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../../../shared/widgets/status_badge.dart';
import '../data/categories_repository.dart';
import '../data/category_model.dart';
import '../providers/categories_provider.dart';
import '../../settings/data/settings_model.dart';
import '../../settings/providers/settings_provider.dart';

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
        ScaffoldMessenger.of(ctx).showSnackBar(
          const SnackBar(
            content: Text(
              'No fue posible completar la accion. Intentalo de nuevo.',
            ),
          ),
        );
      }
    }
  }

  Future<void> _showSettingsDialog(BuildContext context) async {
    CategoryDisplaySettings current;
    try {
      current = await ref.read(categoryDisplaySettingsProvider.future);
    } catch (_) {
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
                  child: _CategorySettingsDialog(
                    initial: current,
                    fullWidth: true,
                    onSave: (updated) async {
                      await ref
                          .read(settingsRepositoryProvider)
                          .updateCategorySettings({
                            'showDescription': updated.showDescription,
                            'showProjectCount': updated.showProjectCount,
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
              child: _CategorySettingsDialog(
                initial: current,
                onSave: (updated) async {
                  await ref
                      .read(settingsRepositoryProvider)
                      .updateCategorySettings({
                        'showDescription': updated.showDescription,
                        'showProjectCount': updated.showProjectCount,
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
              loading: () => const _CategoriesSkeleton(),
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
      itemBuilder: (ctx, i) => FadeSlideIn(
        delay: Duration(milliseconds: (i * 40).clamp(0, 300)),
        child: _CategoryTile(item: items[i], onDelete: _delete),
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
      itemBuilder: (ctx, i) => FadeSlideIn(
        delay: Duration(milliseconds: (i * 40).clamp(0, 300)),
        child: _CategoryGridCard(item: items[i], onDelete: _delete),
      ),
    );
  }
}

// ── Grid Card ─────────────────────────────────────────────────────────────────

class _CategoryGridCard extends StatelessWidget {
  const _CategoryGridCard({required this.item, required this.onDelete});

  final CategoryItem item;
  final Future<void> Function(BuildContext, CategoryItem) onDelete;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;
    return Card(
      margin: EdgeInsets.zero,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      child: InkWell(
        onTap: () => context.pushNamed(
          RouteNames.categoryEdit,
          pathParameters: {'id': item.id},
        ),
        child: Stack(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Thumbnail (fixed height to avoid collapsing when image missing)
                SizedBox(
                  height: 100,
                  width: double.infinity,
                  child: ClipRRect(
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(8),
                    ),
                    child:
                        item.thumbnailUrl != null &&
                            item.thumbnailUrl!.isNotEmpty
                        ? CachedNetworkImage(
                            imageUrl: item.thumbnailUrl!,
                            width: double.infinity,
                            height: double.infinity,
                            fit: BoxFit.cover,
                            placeholder: (context, url) => Container(
                              color: scheme.surfaceContainerHighest,
                              child: Icon(
                                Icons.image_outlined,
                                color: scheme.outlineVariant,
                                size: 36,
                              ),
                            ),
                            errorWidget: (context, url, error) => Container(
                              color: scheme.surfaceContainerHighest,
                              child: Icon(
                                Icons.broken_image_outlined,
                                color: scheme.outlineVariant,
                                size: 36,
                              ),
                            ),
                          )
                        : Container(
                            color: scheme.surfaceContainerHighest,
                            child: Center(
                              child: Icon(
                                Icons.photo_library_outlined,
                                color: scheme.outlineVariant,
                                size: 36,
                              ),
                            ),
                          ),
                  ),
                ),
                // Info
                Padding(
                  padding: const EdgeInsets.fromLTRB(10, 8, 10, 12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item.name,
                        style: theme.textTheme.labelLarge?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${item.projectCount} proyecto${item.projectCount == 1 ? '' : 's'}',
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: scheme.onSurface,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            // Status badge top-right with solid background for readability
            Positioned(
              top: 8,
              right: 8,
              child: Container(
                padding: EdgeInsets.zero,
                decoration: BoxDecoration(
                  color: scheme.surface,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: StatusBadge(
                  status: item.isActive ? AppStatus.active : AppStatus.inactive,
                  small: true,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Tile ──────────────────────────────────────────────────────────────────────

class _CategoryTile extends StatelessWidget {
  const _CategoryTile({required this.item, required this.onDelete});

  final CategoryItem item;
  final Future<void> Function(BuildContext, CategoryItem) onDelete;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;

    return Card(
      margin: EdgeInsets.zero,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(borderRadius: AppRadius.forTile),
      child: InkWell(
        onTap: () => context.pushNamed(
          RouteNames.categoryEdit,
          pathParameters: {'id': item.id},
        ),
        child: ConstrainedBox(
          constraints: const BoxConstraints(minHeight: 88),
          child: IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Thumbnail (like projects list)
                SizedBox(
                  width: 90,
                  child:
                      item.thumbnailUrl != null && item.thumbnailUrl!.isNotEmpty
                      ? CachedNetworkImage(
                          imageUrl: item.thumbnailUrl!,
                          fit: BoxFit.cover,
                          placeholder: (context, url) => Container(
                            color: scheme.surfaceContainerHighest,
                            child: Icon(
                              Icons.image_outlined,
                              color: scheme.outlineVariant,
                              size: 28,
                            ),
                          ),
                          errorWidget: (context, url, error) => Container(
                            color: scheme.surfaceContainerHighest,
                            child: Icon(
                              Icons.broken_image_outlined,
                              color: scheme.outlineVariant,
                              size: 28,
                            ),
                          ),
                        )
                      : Container(
                          color: scheme.surfaceContainerHighest,
                          child: Icon(
                            Icons.photo_library_outlined,
                            color: scheme.outlineVariant,
                            size: 28,
                          ),
                        ),
                ),
                // Content
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(14, 12, 4, 12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                item.name,
                                style: theme.textTheme.titleSmall?.copyWith(
                                  fontWeight: FontWeight.w700,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const SizedBox(width: 4),
                            StatusBadge(
                              small: true,
                              status: item.isActive
                                  ? AppStatus.active
                                  : AppStatus.inactive,
                            ),
                          ],
                        ),
                        const SizedBox(height: 3),
                        Row(
                          children: [
                            Icon(
                              Icons.link_rounded,
                              size: 13,
                              color: scheme.onSurface,
                            ),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                '/${item.slug}',
                                style: theme.textTheme.bodySmall?.copyWith(
                                  color: scheme.onSurface,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Icon(
                              Icons.photo_library_outlined,
                              size: 13,
                              color: scheme.onSurface,
                            ),
                            const SizedBox(width: 3),
                            Text(
                              '${item.projectCount}',
                              style: theme.textTheme.bodySmall?.copyWith(
                                color: scheme.onSurface,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                // Menu
                PopupMenuButton<String>(
                  icon: Icon(
                    Icons.more_vert_rounded,
                    size: 20,
                    color: scheme.outline,
                  ),
                  onSelected: (action) {
                    if (action == 'edit') {
                      context.pushNamed(
                        RouteNames.categoryEdit,
                        pathParameters: {'id': item.id},
                      );
                    } else if (action == 'gallery') {
                      context.pushNamed(
                        RouteNames.categoryGallery,
                        pathParameters: {'id': item.id},
                        queryParameters: {'name': item.name},
                      );
                    } else if (action == 'delete') {
                      onDelete(context, item);
                    }
                  },
                  itemBuilder: (_) => [
                    PopupMenuItem(
                      value: 'edit',
                      child: Row(
                        children: [
                          Icon(
                            Icons.edit_outlined,
                            size: 18,
                            color: scheme.onSurface,
                          ),
                          const SizedBox(width: 10),
                          const Text('Editar'),
                        ],
                      ),
                    ),
                    if (item.projectCount > 0)
                      PopupMenuItem(
                        value: 'gallery',
                        child: Row(
                          children: [
                            Icon(
                              Icons.photo_library_outlined,
                              size: 18,
                              color: scheme.onSurface,
                            ),
                            const SizedBox(width: 10),
                            const Text('Ver galería'),
                          ],
                        ),
                      ),
                    PopupMenuItem(
                      value: 'delete',
                      child: Row(
                        children: [
                          Icon(
                            Icons.delete_outline,
                            size: 18,
                            color: AppColors.destructive,
                          ),
                          SizedBox(width: 10),
                          Text(
                            'Eliminar',
                            style: TextStyle(color: AppColors.destructive),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

class _CategoriesSkeleton extends StatelessWidget {
  const _CategoriesSkeleton();

  @override
  Widget build(BuildContext context) {
    return ShimmerLoader(
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.base),
        itemCount: 8,
        separatorBuilder: (_, _) => const SizedBox(height: 8),
        itemBuilder: (_, _) => const ShimmerBox(
          width: double.infinity,
          height: 72,
          borderRadius: 12,
        ),
      ),
    );
  }
}

// ── Settings Dialog ───────────────────────────────────────────────────────────

class _CategorySettingsDialog extends StatefulWidget {
  const _CategorySettingsDialog({
    required this.initial,
    required this.onSave,
    this.fullWidth = false,
  });

  final CategoryDisplaySettings initial;
  final Future<void> Function(CategoryDisplaySettings) onSave;
  final bool fullWidth;

  @override
  State<_CategorySettingsDialog> createState() =>
      _CategorySettingsDialogState();
}

class _CategorySettingsDialogState extends State<_CategorySettingsDialog> {
  late bool _showDescription;
  late bool _showProjectCount;
  late int _gridColumns;
  late bool _isActive;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _showDescription = widget.initial.showDescription;
    _showProjectCount = widget.initial.showProjectCount;
    _gridColumns = widget.initial.gridColumns;
    _isActive = widget.initial.isActive;
  }

  Future<void> _save() async {
    setState(() => _saving = true);
    try {
      await widget.onSave(
        CategoryDisplaySettings(
          showDescription: _showDescription,
          showProjectCount: _showProjectCount,
          gridColumns: _gridColumns,
          isActive: _isActive,
        ),
      );
      if (mounted) Navigator.of(context).pop();
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('No se pudieron guardar los cambios')),
        );
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    // Reduce padding when shown as fullWidth (bottom sheet on mobile)
    final inset = widget.fullWidth
        ? const EdgeInsets.symmetric(horizontal: 12, vertical: 10)
        : null;
    final contentPadding = widget.fullWidth
        ? const EdgeInsets.symmetric(horizontal: 8)
        : null;

    return AlertDialog(
      insetPadding: inset,
      titlePadding: widget.fullWidth
          ? const EdgeInsets.fromLTRB(16, 18, 16, 0)
          : null,
      contentPadding: contentPadding,
      actionsPadding: widget.fullWidth
          ? const EdgeInsets.fromLTRB(8, 4, 12, 12)
          : null,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(widget.fullWidth ? 12 : 20),
      ),
      title: const Text('Visualizaci\u00f3n de categor\u00edas'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          SwitchListTile(
            title: const Text('Secci\u00f3n activa'),
            subtitle: const Text(
              'Controla si la categor\u00eda se muestra p\u00fablicamente',
            ),
            value: _isActive,
            onChanged: (v) => setState(() => _isActive = v),
          ),
          SwitchListTile(
            title: const Text('Mostrar descripci\u00f3n'),
            subtitle: const Text(
              'Muestra el texto descriptivo en cada tarjeta',
            ),
            value: _showDescription,
            onChanged: (v) => setState(() => _showDescription = v),
          ),
          SwitchListTile(
            title: const Text('Mostrar cantidad de proyectos'),
            subtitle: const Text(
              'N\u00famero de proyectos en cada categor\u00eda',
            ),
            value: _showProjectCount,
            onChanged: (v) => setState(() => _showProjectCount = v),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Expanded(
                child: Text(
                  'Columnas en el grid',
                  style: TextStyle(fontSize: 14),
                ),
              ),
              DropdownButton<int>(
                value: _gridColumns,
                items: [1, 2, 3, 4, 5]
                    .map((n) => DropdownMenuItem(value: n, child: Text('$n')))
                    .toList(),
                onChanged: (v) {
                  if (v != null) setState(() => _gridColumns = v);
                },
              ),
            ],
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: _saving ? null : () => Navigator.of(context).pop(),
          child: const Text('Cancelar'),
        ),
        FilledButton(
          onPressed: _saving ? null : _save,
          child: _saving
              ? const SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Text('Guardar'),
        ),
      ],
    );
  }
}
