import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_colors.dart';
import '../../../shared/widgets/widgets.dart';
import '../data/contact_model.dart';
import '../providers/contacts_provider.dart';
import 'widgets/contact_tile.dart';
import 'widgets/contacts_list_header.dart';

part 'contacts_list_page_builders.dart';

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

    return AppScaffold(
      title: 'Contactos',
      body: Column(
        children: [
          ContactsListHeader(
            controller: _searchController,
            onSearch: _onSearch,
            statusFilter: _statusFilter,
            unreadOnly: _unreadOnly,
            hPad: hPad,
            onFilterChanged: (s) => setState(() {
              if (s == 'UNREAD') {
                _unreadOnly = true;
                _statusFilter = null;
              } else {
                _unreadOnly = false;
                _statusFilter = s;
              }
            }),
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
                  : _buildList(paginated.data, hPad),
            ),
          ),
        ],
      ),
    );
  }
}

// ── Tile ──────────────────────────────────────────────────────────────────────
