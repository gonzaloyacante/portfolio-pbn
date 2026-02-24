import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/route_names.dart';
import '../../../shared/widgets/app_scaffold.dart';
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
    } catch (e) {
      if (ctx.mounted) {
        ScaffoldMessenger.of(
          ctx,
        ).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final async = ref.watch(
      servicesListProvider(search: _search.isEmpty ? null : _search),
    );

    return AppScaffold(
      title: 'Servicios',
      actions: [
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
                      child: ListView.separated(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        itemCount: paginated.data.length,
                        separatorBuilder: (_, _) => const SizedBox(height: 8),
                        itemBuilder: (ctx, i) => _ServiceTile(
                          item: paginated.data[i],
                          onDelete: _delete,
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

class _ServiceTile extends StatelessWidget {
  const _ServiceTile({required this.item, required this.onDelete});

  final ServiceItem item;
  final Future<void> Function(BuildContext, ServiceItem) onDelete;

  @override
  Widget build(BuildContext context) {
    final color = item.color != null
        ? Color(
            int.tryParse('0xFF${item.color!.replaceFirst('#', '')}') ??
                0xFF6C0A0A,
          )
        : Theme.of(context).colorScheme.primary;

    final priceText = item.price != null
        ? '${item.priceLabel ?? 'desde'} \$${item.price} ${item.currency}'
        : 'Sin precio';

    return Card(
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: color.withValues(alpha: 0.15),
          child: Icon(Icons.design_services, color: color),
        ),
        title: Text(
          item.name,
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        subtitle: Text(
          '$priceText${item.duration != null ? ' · ${item.duration}' : ''}',
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
        onTap: () => context.pushNamed(
          RouteNames.serviceEdit,
          pathParameters: {'id': item.id},
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
