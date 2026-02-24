import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/route_names.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/confirm_dialog.dart';
import '../../../shared/widgets/empty_state.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../data/contact_model.dart';
import '../providers/contacts_provider.dart';

const _kStatuses = ['NEW', 'IN_PROGRESS', 'REPLIED', 'CLOSED', 'SPAM'];

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
    } catch (e) {
      if (ctx.mounted) {
        ScaffoldMessenger.of(
          ctx,
        ).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    }
  }

  Color _priorityColor(BuildContext context, String priority) =>
      switch (priority) {
        'URGENT' => Colors.red,
        'HIGH' => Colors.orange,
        'LOW' => Colors.grey,
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

    return AppScaffold(
      title: 'Contactos',
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                SearchBar(
                  controller: _searchController,
                  hintText: 'Buscar por nombre, email…',
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
                const SizedBox(height: 10),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _FilterChip(
                        label: 'Todos',
                        selected: _statusFilter == null && !_unreadOnly,
                        onTap: () => setState(() {
                          _statusFilter = null;
                          _unreadOnly = false;
                        }),
                      ),
                      const SizedBox(width: 8),
                      _FilterChip(
                        label: 'No leídos',
                        selected: _unreadOnly,
                        onTap: () => setState(() {
                          _unreadOnly = !_unreadOnly;
                          _statusFilter = null;
                        }),
                        icon: Icons.mark_email_unread_outlined,
                      ),
                      const SizedBox(width: 8),
                      for (final s in _kStatuses) ...[
                        _FilterChip(
                          label: _statusLabel(s),
                          selected: _statusFilter == s,
                          onTap: () => setState(() {
                            _statusFilter = s;
                            _unreadOnly = false;
                          }),
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
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        itemCount: paginated.data.length,
                        separatorBuilder: (_, _) => const SizedBox(height: 6),
                        itemBuilder: (ctx, i) {
                          final item = paginated.data[i];
                          return _ContactTile(
                            item: item,
                            priorityColor: _priorityColor(ctx, item.priority),
                            statusIcon: _statusIcon(item.status),
                            onDelete: _delete,
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

// ── Filter chip ───────────────────────────────────────────────────────────────

class _FilterChip extends StatelessWidget {
  const _FilterChip({
    required this.label,
    required this.selected,
    required this.onTap,
    this.icon,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    final color = Theme.of(context).colorScheme.primary;
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: selected ? color : color.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (icon != null) ...[
              Icon(icon, size: 14, color: selected ? Colors.white : color),
              const SizedBox(width: 4),
            ],
            Text(
              label,
              style: TextStyle(
                color: selected ? Colors.white : color,
                fontWeight: FontWeight.w600,
                fontSize: 13,
              ),
            ),
          ],
        ),
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
    final unread = !item.isRead;

    return Card(
      child: ListTile(
        leading: Stack(
          children: [
            CircleAvatar(
              backgroundColor: theme.colorScheme.primary.withValues(alpha: 0.1),
              child: Icon(statusIcon, color: theme.colorScheme.primary),
            ),
            if (unread)
              Positioned(
                right: 0,
                top: 0,
                child: Container(
                  width: 10,
                  height: 10,
                  decoration: BoxDecoration(
                    color: theme.colorScheme.error,
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: theme.scaffoldBackgroundColor,
                      width: 1.5,
                    ),
                  ),
                ),
              ),
          ],
        ),
        title: Row(
          children: [
            Expanded(
              child: Text(
                item.name,
                style: TextStyle(
                  fontWeight: unread ? FontWeight.bold : FontWeight.w500,
                ),
              ),
            ),
            Container(
              width: 8,
              height: 8,
              decoration: BoxDecoration(
                color: priorityColor,
                shape: BoxShape.circle,
              ),
            ),
          ],
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(item.email, style: theme.textTheme.bodySmall),
            if (item.subject != null)
              Text(
                item.subject!,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: theme.textTheme.labelSmall,
              ),
          ],
        ),
        trailing: PopupMenuButton<String>(
          itemBuilder: (_) => [
            const PopupMenuItem(value: 'view', child: Text('Ver detalle')),
            const PopupMenuItem(
              value: 'delete',
              child: Text('Eliminar', style: TextStyle(color: Colors.red)),
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
        onTap: () => context.pushNamed(
          RouteNames.contactDetail,
          pathParameters: {'id': item.id},
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
    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      itemCount: 10,
      separatorBuilder: (_, _) => const SizedBox(height: 6),
      itemBuilder: (_, _) =>
          ShimmerBox(width: double.infinity, height: 72, borderRadius: 12),
    );
  }
}
