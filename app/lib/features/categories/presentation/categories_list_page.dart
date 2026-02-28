import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

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

  @override
  Widget build(BuildContext context) {
    final async = ref.watch(
      categoriesListProvider(search: _search.isEmpty ? null : _search),
    );
    final hPad = AppBreakpoints.pageMargin(context);

    return AppScaffold(
      title: 'Categorías',
      actions: [
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
                      child: ListView.separated(
                        padding: EdgeInsets.symmetric(horizontal: hPad),
                        itemCount: paginated.data.length,
                        separatorBuilder: (_, _) => const SizedBox(height: 8),
                        itemBuilder: (ctx, i) => FadeSlideIn(
                          delay: Duration(milliseconds: (i * 40).clamp(0, 300)),
                          child: _CategoryTile(
                            item: paginated.data[i],
                            onDelete: _delete,
                          ),
                        ),
                      ),
                    ),
            ),
          ),
        ],
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
    final color = item.color != null
        ? Color(
            int.tryParse('0xFF${item.color!.replaceFirst('#', '')}') ??
                0xFF6C0A0A,
          )
        : scheme.primary;

    return Card(
      margin: EdgeInsets.zero,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(borderRadius: AppRadius.forTile),
      child: InkWell(
        borderRadius: AppRadius.forTile,
        onTap: () => context.pushNamed(
          RouteNames.categoryEdit,
          pathParameters: {'id': item.id},
        ),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(14, 12, 4, 12),
          child: Row(
            children: [
              // Icon
              Container(
                width: 46,
                height: 46,
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Center(
                  child: item.iconName != null
                      ? item.iconName!.runes.length <= 2
                            ? Text(
                                item.iconName!,
                                style: theme.textTheme.titleLarge?.copyWith(
                                  height: 1.2,
                                ),
                                textAlign: TextAlign.center,
                              )
                            : Icon(Icons.category, color: color, size: 22)
                      : Text(
                          item.name.isNotEmpty
                              ? item.name[0].toUpperCase()
                              : '?',
                          style: theme.textTheme.titleMedium?.copyWith(
                            color: color,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                ),
              ),
              const SizedBox(width: 12),
              // Content
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
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
                          color: scheme.outline,
                        ),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            '/${item.slug}',
                            style: theme.textTheme.bodySmall?.copyWith(
                              color: scheme.outline,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Icon(
                          Icons.photo_library_outlined,
                          size: 13,
                          color: scheme.outline,
                        ),
                        const SizedBox(width: 3),
                        Text(
                          '${item.projectCount}',
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: scheme.outline,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              // Menu
              PopupMenuButton<String>(
                iconSize: 20,
                padding: EdgeInsets.zero,
                icon: Icon(
                  Icons.more_vert_rounded,
                  size: 20,
                  color: scheme.outline,
                ),
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
                onSelected: (action) {
                  if (action == 'edit') {
                    context.pushNamed(
                      RouteNames.categoryEdit,
                      pathParameters: {'id': item.id},
                    );
                  } else if (action == 'delete') {
                    onDelete(context, item);
                  }
                },
              ),
            ],
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
    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.base),
      itemCount: 8,
      separatorBuilder: (_, _) => const SizedBox(height: 8),
      itemBuilder: (_, _) => const ShimmerBox(
        width: double.infinity,
        height: 72,
        borderRadius: 12,
      ),
    );
  }
}
