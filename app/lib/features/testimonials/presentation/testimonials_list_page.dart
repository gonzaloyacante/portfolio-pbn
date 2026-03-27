import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/route_names.dart';
import '../../../core/theme/app_breakpoints.dart';

import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/widgets.dart';
import '../data/testimonial_model.dart';
import '../providers/testimonials_provider.dart';
import 'widgets/testimonial_tile.dart';

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
    } catch (e) {
      if (ctx.mounted) {
        ScaffoldMessenger.of(
          ctx,
        ).showSnackBar(SnackBar(content: Text('Error al eliminar: $e')));
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
              loading: () => const SkeletonTestimonialsList(),
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
                        itemBuilder: (ctx, i) => RepaintBoundary(
                          child: FadeSlideIn(
                            delay: Duration(
                              milliseconds: (i * 40).clamp(0, 300),
                            ),
                            child: TestimonialTile(
                              item: paginated.data[i],
                              statusOf: _statusFromString,
                              onDelete: _delete,
                            ),
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
