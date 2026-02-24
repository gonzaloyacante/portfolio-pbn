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
import '../data/testimonial_model.dart';
import '../providers/testimonials_provider.dart';

const _kStatuses = ['PENDING', 'APPROVED', 'REJECTED'];

class TestimonialsListPage extends ConsumerStatefulWidget {
  const TestimonialsListPage({super.key});

  @override
  ConsumerState<TestimonialsListPage> createState() =>
      _TestimonialsListPageState();
}

class _TestimonialsListPageState extends ConsumerState<TestimonialsListPage> {
  final _searchController = TextEditingController();
  String _search = '';
  String? _statusFilter;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearch(String value) => setState(() => _search = value.trim());

  Future<void> _delete(BuildContext ctx, TestimonialItem item) async {
    final confirmed = await ConfirmDialog.show(
      ctx,
      title: 'Eliminar testimonio',
      message:
          '¿Eliminar el testimonio de "${item.name}"? Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar',
      isDestructive: true,
    );
    if (!confirmed || !ctx.mounted) return;

    try {
      await ref.read(testimonialsRepositoryProvider).deleteTestimonial(item.id);
      ref.invalidate(testimonialsListProvider);
      if (ctx.mounted) {
        ScaffoldMessenger.of(
          ctx,
        ).showSnackBar(const SnackBar(content: Text('Testimonio eliminado')));
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

  Future<void> _moderate(
    BuildContext ctx,
    TestimonialItem item,
    String newStatus,
  ) async {
    try {
      await ref.read(testimonialsRepositoryProvider).updateTestimonial(
        item.id,
        {'status': newStatus},
      );
      ref.invalidate(testimonialsListProvider);
      if (ctx.mounted) {
        final label = newStatus == 'APPROVED' ? 'aprobado' : 'rechazado';
        ScaffoldMessenger.of(
          ctx,
        ).showSnackBar(SnackBar(content: Text('Testimonio $label')));
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

  AppStatus _statusFromString(String status) => switch (status) {
    'APPROVED' => AppStatus.active,
    'REJECTED' => AppStatus.inactive,
    _ => AppStatus.pending,
  };

  @override
  Widget build(BuildContext context) {
    final async = ref.watch(
      testimonialsListProvider(
        search: _search.isEmpty ? null : _search,
        status: _statusFilter,
      ),
    );

    return AppScaffold(
      title: 'Testimonios',
      actions: [
        IconButton(
          icon: const Icon(Icons.add),
          tooltip: 'Nuevo testimonio',
          onPressed: () => context.pushNamed(RouteNames.testimonialNew),
        ),
      ],
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                SearchBar(
                  controller: _searchController,
                  hintText: 'Buscar testimonios…',
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
                const SizedBox(height: 12),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _FilterChip(
                        label: 'Todos',
                        selected: _statusFilter == null,
                        onTap: () => setState(() => _statusFilter = null),
                      ),
                      const SizedBox(width: 8),
                      for (final s in _kStatuses) ...[
                        _FilterChip(
                          label: _statusLabel(s),
                          selected: _statusFilter == s,
                          onTap: () => setState(() => _statusFilter = s),
                        ),
                        const SizedBox(width: 8),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: async.when(
              loading: () => const _TestimonialsSkeleton(),
              error: (e, _) => ErrorState(
                message: e.toString(),
                onRetry: () => ref.invalidate(testimonialsListProvider),
              ),
              data: (paginated) => paginated.data.isEmpty
                  ? const EmptyState(
                      icon: Icons.format_quote_outlined,
                      title: 'Sin testimonios',
                      subtitle: 'Agrega el primer testimonio',
                    )
                  : RefreshIndicator(
                      onRefresh: () async =>
                          ref.invalidate(testimonialsListProvider),
                      child: ListView.separated(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        itemCount: paginated.data.length,
                        separatorBuilder: (_, _) => const SizedBox(height: 8),
                        itemBuilder: (ctx, i) => FadeSlideIn(
                          delay: Duration(milliseconds: (i * 40).clamp(0, 300)),
                          child: _TestimonialTile(
                            item: paginated.data[i],
                            statusOf: _statusFromString,
                            onDelete: _delete,
                            onModerate: _moderate,
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

  String _statusLabel(String s) => switch (s) {
    'APPROVED' => 'Aprobados',
    'REJECTED' => 'Rechazados',
    _ => 'Pendientes',
  };
}

// ── Filter chip ───────────────────────────────────────────────────────────────

class _FilterChip extends StatelessWidget {
  const _FilterChip({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final color = Theme.of(context).colorScheme.primary;
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        decoration: BoxDecoration(
          color: selected ? color : color.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: selected ? Colors.white : color,
            fontWeight: FontWeight.w600,
            fontSize: 13,
          ),
        ),
      ),
    );
  }
}

// ── Tile ──────────────────────────────────────────────────────────────────────

class _TestimonialTile extends StatelessWidget {
  const _TestimonialTile({
    required this.item,
    required this.statusOf,
    required this.onDelete,
    required this.onModerate,
  });

  final TestimonialItem item;
  final AppStatus Function(String) statusOf;
  final Future<void> Function(BuildContext, TestimonialItem) onDelete;
  final Future<void> Function(BuildContext, TestimonialItem, String) onModerate;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: item.avatarUrl != null
            ? CircleAvatar(backgroundImage: NetworkImage(item.avatarUrl!))
            : CircleAvatar(
                child: Text(
                  item.name.isNotEmpty ? item.name[0].toUpperCase() : '?',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
        title: Row(
          children: [
            Expanded(
              child: Text(
                item.name,
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
            ),
            _StarRating(rating: item.rating),
          ],
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (item.excerpt != null)
              Text(
                item.excerpt!,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: Theme.of(context).textTheme.bodySmall,
              ),
            if (item.position != null || item.company != null)
              Text(
                [
                  item.position,
                  item.company,
                ].where((s) => s != null).join(' · '),
                style: Theme.of(context).textTheme.labelSmall,
              ),
          ],
        ),
        isThreeLine: item.excerpt != null,
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            StatusBadge(status: statusOf(item.status), compact: true),
            const SizedBox(width: 4),
            PopupMenuButton<String>(
              itemBuilder: (_) => [
                const PopupMenuItem(value: 'edit', child: Text('Editar')),
                if (item.status != 'APPROVED')
                  const PopupMenuItem(value: 'approve', child: Text('Aprobar')),
                if (item.status != 'REJECTED')
                  const PopupMenuItem(value: 'reject', child: Text('Rechazar')),
                const PopupMenuItem(
                  value: 'delete',
                  child: Text('Eliminar', style: TextStyle(color: Colors.red)),
                ),
              ],
              onSelected: (action) {
                switch (action) {
                  case 'edit':
                    context.pushNamed(
                      RouteNames.testimonialEdit,
                      pathParameters: {'id': item.id},
                    );
                  case 'approve':
                    onModerate(context, item, 'APPROVED');
                  case 'reject':
                    onModerate(context, item, 'REJECTED');
                  case 'delete':
                    onDelete(context, item);
                }
              },
            ),
          ],
        ),
        onTap: () => context.pushNamed(
          RouteNames.testimonialEdit,
          pathParameters: {'id': item.id},
        ),
      ),
    );
  }
}

// ── Star rating ───────────────────────────────────────────────────────────────

class _StarRating extends StatelessWidget {
  const _StarRating({required this.rating});
  final int rating;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(
        5,
        (i) => Icon(
          i < rating ? Icons.star : Icons.star_border,
          size: 14,
          color: Colors.amber,
        ),
      ),
    );
  }
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

class _TestimonialsSkeleton extends StatelessWidget {
  const _TestimonialsSkeleton();

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      itemCount: 8,
      separatorBuilder: (_, _) => const SizedBox(height: 8),
      itemBuilder: (_, _) =>
          ShimmerBox(width: double.infinity, height: 80, borderRadius: 12),
    );
  }
}
