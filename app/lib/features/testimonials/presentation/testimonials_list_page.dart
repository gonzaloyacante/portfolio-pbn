import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/router/route_names.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/app_filter_chips.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/app_search_bar.dart';
import '../../../shared/widgets/fade_slide_in.dart';
import '../../../shared/widgets/confirm_dialog.dart';
import '../../../shared/widgets/empty_state.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../../../shared/widgets/status_badge.dart';
import '../data/testimonial_model.dart';
import '../providers/testimonials_provider.dart';

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
    'APPROVED' => AppStatus.approved,
    'REJECTED' => AppStatus.rejected,
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
    final hPad = AppBreakpoints.pageMargin(context);
    const filterOptions = <String?>[null, 'PENDING', 'APPROVED', 'REJECTED'];

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
            padding: EdgeInsets.fromLTRB(hPad, AppSpacing.base, hPad, 0),
            child: Column(
              children: [
                AppSearchBar(
                  hint: 'Buscar testimonios…',
                  controller: _searchController,
                  onChanged: _onSearch,
                ),
                const SizedBox(height: AppSpacing.sm),
                AppFilterChips<String?>(
                  options: filterOptions,
                  selected: _statusFilter,
                  labelBuilder: (s) => s == null ? 'Todos' : _statusLabel(s),
                  onSelected: (s) => setState(() => _statusFilter = s),
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
                        padding: EdgeInsets.symmetric(horizontal: hPad),
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
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Card(
      margin: EdgeInsets.zero,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(borderRadius: AppRadius.forTile),
      child: InkWell(
        borderRadius: AppRadius.forTile,
        onTap: () => context.pushNamed(
          RouteNames.testimonialEdit,
          pathParameters: {'id': item.id},
        ),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(14, 12, 4, 12),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Avatar ──────────────────────────────────────
              _buildAvatar(colorScheme),
              const SizedBox(width: 12),
              // ── Info ────────────────────────────────────────
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Name + stars
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            item.name,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: theme.textTheme.titleSmall?.copyWith(
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                        const SizedBox(width: 6),
                        _StarRating(rating: item.rating),
                      ],
                    ),
                    // Position / Company
                    if (item.position != null || item.company != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 2),
                        child: Text(
                          [
                            item.position,
                            item.company,
                          ].where((s) => s != null).join(' · '),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: colorScheme.outline,
                          ),
                        ),
                      ),
                    // Excerpt — styled like a quote
                    if (item.excerpt != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 6),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Icon(
                              Icons.format_quote_rounded,
                              size: 14,
                              color: colorScheme.primary.withValues(alpha: 0.5),
                            ),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                item.excerpt!,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: theme.textTheme.bodySmall?.copyWith(
                                  fontStyle: FontStyle.italic,
                                  color: colorScheme.onSurface.withValues(
                                    alpha: 0.7,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    // Status + featured badge row
                    Padding(
                      padding: const EdgeInsets.only(top: 6),
                      child: Row(
                        children: [
                          StatusBadge(
                            status: statusOf(item.status),
                            small: true,
                          ),
                          if (item.featured) ...[
                            const SizedBox(width: 6),
                            Icon(
                              Icons.star_rounded,
                              size: 14,
                              color: AppColors.warning,
                            ),
                            const SizedBox(width: 2),
                            Text(
                              'Destacado',
                              style: theme.textTheme.labelSmall?.copyWith(
                                color: AppColors.warning,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                          if (item.verified) ...[
                            const SizedBox(width: 6),
                            Icon(
                              Icons.verified_rounded,
                              size: 14,
                              color: colorScheme.primary,
                            ),
                          ],
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              // ── Menu ────────────────────────────────────────
              PopupMenuButton<String>(
                iconSize: 20,
                itemBuilder: (_) => [
                  const PopupMenuItem(
                    value: 'edit',
                    child: Row(
                      children: [
                        Icon(Icons.edit_outlined, size: 18),
                        SizedBox(width: 8),
                        Text('Editar'),
                      ],
                    ),
                  ),
                  if (item.status != 'APPROVED')
                    const PopupMenuItem(
                      value: 'approve',
                      child: Row(
                        children: [
                          Icon(Icons.check_circle_outline, size: 18),
                          SizedBox(width: 8),
                          Text('Aprobar'),
                        ],
                      ),
                    ),
                  if (item.status != 'REJECTED')
                    const PopupMenuItem(
                      value: 'reject',
                      child: Row(
                        children: [
                          Icon(Icons.cancel_outlined, size: 18),
                          SizedBox(width: 8),
                          Text('Rechazar'),
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
                          color: colorScheme.error,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Eliminar',
                          style: TextStyle(color: colorScheme.error),
                        ),
                      ],
                    ),
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
        ),
      ),
    );
  }

  Widget _buildAvatar(ColorScheme colorScheme) {
    return Container(
      width: 46,
      height: 46,
      decoration: BoxDecoration(
        color: colorScheme.primary.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(14),
      ),
      clipBehavior: Clip.antiAlias,
      child: item.avatarUrl != null
          ? Image.network(
              item.avatarUrl!,
              fit: BoxFit.cover,
              errorBuilder: (_, _, _) => _initialsWidget(colorScheme),
            )
          : _initialsWidget(colorScheme),
    );
  }

  Widget _initialsWidget(ColorScheme colorScheme) {
    return Center(
      child: Text(
        item.name.isNotEmpty ? item.name[0].toUpperCase() : '?',
        style: TextStyle(
          fontWeight: FontWeight.w700,
          color: colorScheme.primary,
          fontSize: 18,
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
          color: AppColors.warning,
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
    return ShimmerLoader(
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.base),
        itemCount: 8,
        separatorBuilder: (_, _) => const SizedBox(height: 8),
        itemBuilder: (_, _) =>
            ShimmerBox(width: double.infinity, height: 80, borderRadius: 12),
      ),
    );
  }
}
