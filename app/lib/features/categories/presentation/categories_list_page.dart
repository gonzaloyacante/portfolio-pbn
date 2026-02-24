import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/router/route_names.dart';
import '../../../shared/widgets/app_scaffold.dart';
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
            padding: const EdgeInsets.all(16),
            child: SearchBar(
              controller: _searchController,
              hintText: 'Buscar categorías…',
              leading: const Icon(Icons.search),
              trailing: [
                if (_search.isNotEmpty)
                  IconButton(
                    icon: const Icon(Icons.clear),
                    onPressed: () {
                      _searchController.clear();
                      _onSearch('');
                    },
                  ),
              ],
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
                        padding: const EdgeInsets.symmetric(horizontal: 16),
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
    final color = item.color != null
        ? Color(
            int.tryParse('0xFF${item.color!.replaceFirst('#', '')}') ??
                0xFF6C0A0A,
          )
        : Theme.of(context).colorScheme.primary;

    return Card(
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: color.withValues(alpha: 0.15),
          child: item.iconName != null
              ? Icon(Icons.category, color: color)
              : Text(
                  item.name.isNotEmpty ? item.name[0].toUpperCase() : '?',
                  style: TextStyle(color: color, fontWeight: FontWeight.bold),
                ),
        ),
        title: Text(
          item.name,
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        subtitle: Text(
          '/${item.slug} · ${item.projectCount} proyectos',
          style: Theme.of(context).textTheme.bodySmall,
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            StatusBadge(
              status: item.isActive ? AppStatus.active : AppStatus.inactive,
              compact: true,
            ),
            const SizedBox(width: 4),
            PopupMenuButton<String>(
              itemBuilder: (_) => [
                const PopupMenuItem(value: 'edit', child: Text('Editar')),
                const PopupMenuItem(
                  value: 'delete',
                  child: Text('Eliminar', style: TextStyle(color: Colors.red)),
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
        onTap: () => context.pushNamed(
          RouteNames.categoryEdit,
          pathParameters: {'id': item.id},
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
      padding: const EdgeInsets.symmetric(horizontal: 16),
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
