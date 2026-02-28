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
import '../../../core/utils/date_utils.dart';
import '../data/contact_model.dart';
import '../providers/contacts_provider.dart';

class ContactsListPage extends ConsumerStatefulWidget {
  const ContactsListPage({super.key});

  @override
  ConsumerState<ContactsListPage> createState() => _ContactsListPageState();
}

class _ContactsListPageState extends ConsumerState<ContactsListPage> {
  final _searchController = TextEditingController();
  String _search = '';
  String? _statusFilter;
  bool _unreadOnly = false;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearch(String value) => setState(() => _search = value.trim());

  Future<void> _delete(BuildContext ctx, ContactItem item) async {
    final confirmed = await ConfirmDialog.show(
      ctx,
      title: 'Eliminar contacto',
      message:
          '¿Eliminar el mensaje de "${item.name}"? Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar',
      isDestructive: true,
    );
    if (!confirmed || !ctx.mounted) return;

    try {
      await ref.read(contactsRepositoryProvider).deleteContact(item.id);
      ref.invalidate(contactsListProvider);
      if (ctx.mounted) {
        ScaffoldMessenger.of(
          ctx,
        ).showSnackBar(const SnackBar(content: Text('Contacto eliminado')));
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

  Color _priorityColor(BuildContext context, String priority) =>
      switch (priority) {
        'URGENT' => AppColors.priorityHigh,
        'HIGH' => AppColors.priorityMedium,
        'LOW' => AppColors.priorityLow,
        _ => Theme.of(context).colorScheme.secondary,
      };

  IconData _statusIcon(String status) => switch (status) {
    'REPLIED' => Icons.reply,
    'CLOSED' => Icons.check_circle_outline,
    'SPAM' => Icons.block,
    'IN_PROGRESS' => Icons.pending_outlined,
    _ => Icons.mail_outline,
  };

  String _statusLabel(String s) => switch (s) {
    'IN_PROGRESS' => 'En curso',
    'REPLIED' => 'Respondidos',
    'CLOSED' => 'Cerrados',
    'SPAM' => 'Spam',
    _ => 'Nuevos',
  };

  @override
  Widget build(BuildContext context) {
    final async = ref.watch(
      contactsListProvider(
        search: _search.isEmpty ? null : _search,
        status: _statusFilter,
        unreadOnly: _unreadOnly ? true : null,
      ),
    );
    final hPad = AppBreakpoints.pageMargin(context);

    // Opciones de filtro: null=Todos, 'UNREAD'=No leídos, valores de _kStatuses
    final selectedChip = _unreadOnly ? 'UNREAD' : _statusFilter;
    const filterOptions = <String?>[
      null,
      'UNREAD',
      'NEW',
      'IN_PROGRESS',
      'REPLIED',
      'CLOSED',
      'SPAM',
    ];

    return AppScaffold(
      title: 'Contactos',
      body: Column(
        children: [
          Padding(
            padding: EdgeInsets.fromLTRB(hPad, AppSpacing.base, hPad, 0),
            child: Column(
              children: [
                AppSearchBar(
                  hint: 'Buscar por nombre, email…',
                  controller: _searchController,
                  onChanged: _onSearch,
                ),
                const SizedBox(height: AppSpacing.sm),
                AppFilterChips<String?>(
                  options: filterOptions,
                  selected: selectedChip,
                  labelBuilder: (s) => switch (s) {
                    null => 'Todos',
                    'UNREAD' => 'No leídos',
                    _ => _statusLabel(s),
                  },
                  onSelected: (s) => setState(() {
                    if (s == 'UNREAD') {
                      _unreadOnly = true;
                      _statusFilter = null;
                    } else {
                      _unreadOnly = false;
                      _statusFilter = s;
                    }
                  }),
                ),
              ],
            ),
          ),
          Expanded(
            child: async.when(
              loading: () => const _ContactsSkeleton(),
              error: (e, _) => ErrorState(
                message: e.toString(),
                onRetry: () => ref.invalidate(contactsListProvider),
              ),
              data: (paginated) => paginated.data.isEmpty
                  ? const EmptyState(
                      icon: Icons.mail_outline,
                      title: 'Sin mensajes',
                      subtitle:
                          'Aquí aparecen los mensajes del formulario de contacto',
                    )
                  : RefreshIndicator(
                      onRefresh: () async =>
                          ref.invalidate(contactsListProvider),
                      child: ListView.separated(
                        padding: EdgeInsets.symmetric(horizontal: hPad),
                        itemCount: paginated.data.length,
                        separatorBuilder: (_, _) => const SizedBox(height: 6),
                        itemBuilder: (ctx, i) {
                          final item = paginated.data[i];
                          return FadeSlideIn(
                            delay: Duration(
                              milliseconds: (i * 40).clamp(0, 300),
                            ),
                            child: _ContactTile(
                              item: item,
                              priorityColor: _priorityColor(ctx, item.priority),
                              statusIcon: _statusIcon(item.status),
                              onDelete: _delete,
                            ),
                          );
                        },
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

class _ContactTile extends StatelessWidget {
  const _ContactTile({
    required this.item,
    required this.priorityColor,
    required this.statusIcon,
    required this.onDelete,
  });

  final ContactItem item;
  final Color priorityColor;
  final IconData statusIcon;
  final Future<void> Function(BuildContext, ContactItem) onDelete;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;
    final unread = !item.isRead;

    return Card(
      margin: EdgeInsets.zero,
      elevation: unread ? 2 : 0,
      shape: RoundedRectangleBorder(borderRadius: AppRadius.forTile),
      color: unread ? scheme.surfaceVariant.withOpacity(0.03) : null,
      child: InkWell(
        borderRadius: AppRadius.forTile,
        onTap: () => context.pushNamed(
          RouteNames.contactDetail,
          pathParameters: {'id': item.id},
        ),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(14, 12, 12, 12),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Avatar with unread dot
              Stack(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: scheme.primary.withValues(
                        alpha: unread ? 0.15 : 0.07,
                      ),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Icon(
                      statusIcon,
                      color: unread ? scheme.primary : scheme.outline,
                      size: 20,
                    ),
                  ),
                  if (unread)
                    Positioned(
                      right: 0,
                      top: 0,
                      child: Container(
                        width: 10,
                        height: 10,
                        decoration: BoxDecoration(
                          color: scheme.error,
                          shape: BoxShape.circle,
                          border: Border.all(color: scheme.surface, width: 1.5),
                        ),
                      ),
                    ),
                ],
              ),
              const SizedBox(width: 12),
              // Content
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Text(
                            item.name,
                            style: theme.textTheme.titleSmall?.copyWith(
                              fontWeight: unread
                                  ? FontWeight.w700
                                  : FontWeight.w600,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          AppDateUtils.toRelative(item.createdAt),
                          style: theme.textTheme.labelSmall?.copyWith(
                            color: scheme.outline,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      item.email,
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: scheme.outline,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    if (item.subject != null && item.subject!.isNotEmpty) ...[
                      const SizedBox(height: 6),
                      Text(
                        item.subject!,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: unread
                              ? scheme.onSurface
                              : scheme.onSurfaceVariant,
                          fontWeight: unread
                              ? FontWeight.w600
                              : FontWeight.w500,
                        ),
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
                  const PopupMenuItem(
                    value: 'view',
                    child: Text('Ver detalle'),
                  ),
                  const PopupMenuItem(
                    value: 'delete',
                    child: Text(
                      'Eliminar',
                      style: TextStyle(color: AppColors.destructive),
                    ),
                  ),
                ],
                onSelected: (action) {
                  if (action == 'view') {
                    context.pushNamed(
                      RouteNames.contactDetail,
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

class _ContactsSkeleton extends StatelessWidget {
  const _ContactsSkeleton();

  @override
  Widget build(BuildContext context) {
    return ShimmerLoader(
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.base),
        itemCount: 8,
        separatorBuilder: (_, _) => const SizedBox(height: 6),
        itemBuilder: (_, _) => Card(
          margin: EdgeInsets.zero,
          shape: RoundedRectangleBorder(borderRadius: AppRadius.forTile),
          child: const Padding(
            padding: EdgeInsets.fromLTRB(14, 12, 14, 12),
            child: Row(
              children: [
                ShimmerBox(width: 44, height: 44, borderRadius: 14),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ShimmerBox(width: double.infinity, height: 13),
                      SizedBox(height: 6),
                      ShimmerBox(width: 160, height: 11),
                      SizedBox(height: 5),
                      ShimmerBox(width: 220, height: 11),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
