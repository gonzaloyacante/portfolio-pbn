import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_colors.dart';

import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/app_filter_chips.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/app_search_bar.dart';
import '../../../shared/widgets/fade_slide_in.dart';
import '../../../shared/widgets/confirm_dialog.dart';
import '../../../shared/widgets/empty_state.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../data/contact_model.dart';
import '../providers/contacts_provider.dart';
import 'widgets/contact_tile.dart';

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
              loading: () => const SkeletonContactsList(),
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
                          return RepaintBoundary(
                            child: FadeSlideIn(
                              delay: Duration(
                                milliseconds: (i * 40).clamp(0, 300),
                              ),
                              child: ContactTile(
                                item: item,
                                priorityColor: _priorityColor(
                                  ctx,
                                  item.priority,
                                ),
                                statusIcon: _statusIcon(item.status),
                                onDelete: _delete,
                              ),
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
