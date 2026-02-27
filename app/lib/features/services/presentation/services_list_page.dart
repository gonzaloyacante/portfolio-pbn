import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/providers/app_preferences_provider.dart';
import '../../../core/router/route_names.dart';
import '../../../core/utils/currency_helper.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/fade_slide_in.dart';
import '../../../shared/widgets/confirm_dialog.dart';
import '../../../shared/widgets/empty_state.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../../../shared/widgets/status_badge.dart';
import '../data/service_model.dart';
import '../data/services_repository.dart';
import '../providers/services_provider.dart';

class ServicesListPage extends ConsumerStatefulWidget {
  const ServicesListPage({super.key});

  @override
  ConsumerState<ServicesListPage> createState() => _ServicesListPageState();
}

class _ServicesListPageState extends ConsumerState<ServicesListPage> {
  final _searchController = TextEditingController();
  String _search = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearch(String value) => setState(() => _search = value.trim());

  Future<void> _delete(BuildContext ctx, ServiceItem item) async {
    final confirmed = await ConfirmDialog.show(
      ctx,
      title: 'Eliminar servicio',
      message: '¿Eliminar "${item.name}"? Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar',
      isDestructive: true,
    );
    if (!confirmed || !ctx.mounted) return;

    try {
      await ref.read(servicesRepositoryProvider).deleteService(item.id);
      ref.invalidate(servicesListProvider);
      if (ctx.mounted) {
        ScaffoldMessenger.of(
          ctx,
        ).showSnackBar(const SnackBar(content: Text('Servicio eliminado')));
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
    final viewMode = ref.watch(servicesViewModeProvider);
    final async = ref.watch(
      servicesListProvider(search: _search.isEmpty ? null : _search),
    );

    return AppScaffold(
      title: 'Servicios',
      actions: [
        IconButton(
          icon: Icon(
            viewMode == ViewMode.grid
                ? Icons.view_list_rounded
                : Icons.grid_view_rounded,
          ),
          tooltip: viewMode == ViewMode.grid
              ? 'Vista lista'
              : 'Vista cuadrícula',
          onPressed: () => ref.read(servicesViewModeProvider.notifier).toggle(),
        ),
        IconButton(
          icon: const Icon(Icons.add),
          tooltip: 'Nuevo servicio',
          onPressed: () => context.pushNamed(RouteNames.serviceNew),
        ),
      ],
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: SearchBar(
              controller: _searchController,
              hintText: 'Buscar servicios…',
              leading: const Icon(Icons.search_rounded),
              trailing: [
                if (_search.isNotEmpty)
                  IconButton(
                    icon: const Icon(Icons.clear_rounded),
                    onPressed: () {
                      _searchController.clear();
                      _onSearch('');
                    },
                  ),
              ],
              onChanged: _onSearch,
              elevation: const WidgetStatePropertyAll(0),
            ),
          ),
          Expanded(
            child: async.when(
              loading: () => const _ServicesSkeleton(),
              error: (e, _) => ErrorState(
                message: e.toString(),
                onRetry: () => ref.invalidate(servicesListProvider),
              ),
              data: (paginated) => paginated.data.isEmpty
                  ? const EmptyState(
                      icon: Icons.design_services_outlined,
                      title: 'Sin servicios',
                      subtitle: 'Crea tu primer servicio',
                    )
                  : RefreshIndicator(
                      onRefresh: () async =>
                          ref.invalidate(servicesListProvider),
                      child: viewMode == ViewMode.grid
                          ? GridView.builder(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 8,
                              ),
                              gridDelegate:
                                  const SliverGridDelegateWithFixedCrossAxisCount(
                                    crossAxisCount: 2,
                                    crossAxisSpacing: 10,
                                    mainAxisSpacing: 10,
                                    childAspectRatio: 1.05,
                                  ),
                              itemCount: paginated.data.length,
                              itemBuilder: (ctx, i) => FadeSlideIn(
                                delay: Duration(
                                  milliseconds: (i * 40).clamp(0, 300),
                                ),
                                child: _ServiceGridCard(
                                  item: paginated.data[i],
                                  onDelete: _delete,
                                ),
                              ),
                            )
                          : ListView.separated(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                              ),
                              itemCount: paginated.data.length,
                              separatorBuilder: (_, _) =>
                                  const SizedBox(height: 8),
                              itemBuilder: (ctx, i) => FadeSlideIn(
                                delay: Duration(
                                  milliseconds: (i * 40).clamp(0, 300),
                                ),
                                child: _ServiceTile(
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

// ── Grid Card ─────────────────────────────────────────────────────────────────

class _ServiceGridCard extends StatelessWidget {
  const _ServiceGridCard({required this.item, required this.onDelete});

  final ServiceItem item;
  final Future<void> Function(BuildContext, ServiceItem) onDelete;

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

    final priceText = item.price != null
        ? '${currencySymbol(item.currency)}${item.price}'
        : null;

    return Card(
      margin: EdgeInsets.zero,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () => context.pushNamed(
          RouteNames.serviceEdit,
          pathParameters: {'id': item.id},
        ),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(12, 14, 4, 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Icon + menu row
              Row(
                children: [
                  Container(
                    width: 46,
                    height: 46,
                    decoration: BoxDecoration(
                      color: color.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Icon(Icons.design_services, color: color, size: 22),
                  ),
                  const Spacer(),
                  PopupMenuButton<String>(
                    iconSize: 18,
                    padding: EdgeInsets.zero,
                    icon: Icon(
                      Icons.more_vert_rounded,
                      size: 18,
                      color: scheme.outline,
                    ),
                    itemBuilder: (_) => const [
                      PopupMenuItem(
                        value: 'edit',
                        child: Row(
                          children: [
                            Icon(Icons.edit_outlined, size: 18),
                            SizedBox(width: 10),
                            Text('Editar'),
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
                              color: Colors.red,
                            ),
                            SizedBox(width: 10),
                            Text(
                              'Eliminar',
                              style: TextStyle(color: Colors.red),
                            ),
                          ],
                        ),
                      ),
                    ],
                    onSelected: (action) {
                      if (action == 'edit') {
                        context.pushNamed(
                          RouteNames.serviceEdit,
                          pathParameters: {'id': item.id},
                        );
                      } else if (action == 'delete') {
                        onDelete(context, item);
                      }
                    },
                  ),
                ],
              ),
              const SizedBox(height: 10),
              // Name
              Text(
                item.name,
                style: theme.textTheme.titleSmall?.copyWith(
                  fontWeight: FontWeight.w700,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 4),
              // Price
              if (priceText != null)
                Text(
                  priceText,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: scheme.outline,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              const Spacer(),
              // Status
              StatusBadge(
                status: item.isActive ? AppStatus.active : AppStatus.inactive,
                small: true,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Tile ──────────────────────────────────────────────────────────────────────

class _ServiceTile extends StatelessWidget {
  const _ServiceTile({required this.item, required this.onDelete});

  final ServiceItem item;
  final Future<void> Function(BuildContext, ServiceItem) onDelete;

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

    final priceText = item.price != null
        ? '${item.priceLabel ?? 'desde'} ${currencySymbol(item.currency)}${item.price}'
        : 'Sin precio';

    return Card(
      margin: EdgeInsets.zero,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () => context.pushNamed(
          RouteNames.serviceEdit,
          pathParameters: {'id': item.id},
        ),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(14, 12, 4, 12),
          child: Row(
            children: [
              // Icon container
              Container(
                width: 46,
                height: 46,
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(Icons.design_services, color: color, size: 22),
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
                    Text(
                      '$priceText${item.duration != null ? ' · ${item.duration}' : ''}',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: scheme.outline,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    if (item.shortDesc != null &&
                        item.shortDesc!.isNotEmpty) ...[
                      const SizedBox(height: 2),
                      Text(
                        item.shortDesc!,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: scheme.onSurfaceVariant,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
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
                  const PopupMenuItem(
                    value: 'delete',
                    child: Row(
                      children: [
                        Icon(Icons.delete_outline, size: 18, color: Colors.red),
                        SizedBox(width: 10),
                        Text('Eliminar', style: TextStyle(color: Colors.red)),
                      ],
                    ),
                  ),
                ],
                onSelected: (action) {
                  if (action == 'edit') {
                    context.pushNamed(
                      RouteNames.serviceEdit,
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

class _ServicesSkeleton extends StatelessWidget {
  const _ServicesSkeleton();

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      itemCount: 6,
      separatorBuilder: (_, _) => const SizedBox(height: 8),
      itemBuilder: (_, _) => const ShimmerBox(
        width: double.infinity,
        height: 72,
        borderRadius: 12,
      ),
    );
  }
}
