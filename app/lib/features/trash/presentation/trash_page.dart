// ignore_for_file: use_null_aware_elements
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../../shared/widgets/confirm_dialog.dart';
import '../../../shared/widgets/empty_state.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../data/trash_model.dart';
import '../providers/trash_provider.dart';

final _dateFmt = DateFormat('d MMM yyyy', 'es');

class TrashPage extends ConsumerWidget {
  const TrashPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final trashAsync = ref.watch(trashItemsProvider);

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
          tooltip: 'Volver',
        ),
        title: const Text('Papelera'),
      ),
      body: trashAsync.when(
        loading: () => const _TrashShimmer(),
        error: (e, _) => ErrorState(
          message: e.toString(),
          onRetry: () => ref.invalidate(trashItemsProvider),
        ),
        data: (grouped) {
          final allItems = grouped.values.expand((list) => list).toList();
          if (allItems.isEmpty) {
            return const EmptyState(
              icon: Icons.delete_outline,
              title: 'Papelera vacía',
              subtitle: 'No hay elementos eliminados',
            );
          }
          return ListView(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            children: grouped.entries
                .where((e) => e.value.isNotEmpty)
                .map(
                  (entry) => _TrashSection(
                    type: entry.key,
                    items: entry.value,
                    onRestore: (item) => _restore(context, ref, item),
                    onPurge: (item) => _purge(context, ref, item),
                  ),
                )
                .toList(),
          );
        },
      ),
    );
  }

  Future<void> _restore(
    BuildContext context,
    WidgetRef ref,
    TrashItem item,
  ) async {
    try {
      await ref
          .read(trashRepositoryProvider)
          .restore(type: item.type, id: item.id);
      ref.invalidate(trashItemsProvider);
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('${item.displayName} restaurado correctamente'),
          ),
        );
      }
    } catch (_) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('No se pudo restaurar el elemento')),
        );
      }
    }
  }

  Future<void> _purge(
    BuildContext context,
    WidgetRef ref,
    TrashItem item,
  ) async {
    final confirmed = await ConfirmDialog.show(
      context,
      title: 'Eliminar permanentemente',
      message:
          '¿Eliminar "${item.displayName}" de forma permanente? Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar',
      isDestructive: true,
    );
    if (!confirmed) return;

    try {
      await ref
          .read(trashRepositoryProvider)
          .purge(type: item.type, id: item.id);
      ref.invalidate(trashItemsProvider);
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('${item.displayName} eliminado permanentemente'),
          ),
        );
      }
    } catch (_) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('No se pudo eliminar el elemento')),
        );
      }
    }
  }
}

// ── Sección por tipo ───────────────────────────────────────────────────────────

class _TrashSection extends StatelessWidget {
  const _TrashSection({
    required this.type,
    required this.items,
    required this.onRestore,
    required this.onPurge,
  });

  final String type;
  final List<TrashItem> items;
  final void Function(TrashItem) onRestore;
  final void Function(TrashItem) onPurge;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Text(
            trashTypeLabel(type),
            style: Theme.of(
              context,
            ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
          ),
        ),
        ...items.map(
          (item) => _TrashCard(
            item: item,
            onRestore: () => onRestore(item),
            onPurge: () => onPurge(item),
          ),
        ),
        const SizedBox(height: 8),
      ],
    );
  }
}

// ── Card de item ───────────────────────────────────────────────────────────────

class _TrashCard extends StatelessWidget {
  const _TrashCard({
    required this.item,
    required this.onRestore,
    required this.onPurge,
  });

  final TrashItem item;
  final VoidCallback onRestore;
  final VoidCallback onPurge;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final deletedStr = _dateFmt.format(item.deletedAt.toLocal());

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.displayName,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Eliminado: $deletedStr',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
            TextButton(onPressed: onRestore, child: const Text('Restaurar')),
            IconButton(
              icon: Icon(Icons.delete_forever, color: colorScheme.error),
              onPressed: onPurge,
              tooltip: 'Eliminar permanentemente',
            ),
          ],
        ),
      ),
    );
  }
}

// ── Shimmer skeleton ───────────────────────────────────────────────────────────

class _TrashShimmer extends StatelessWidget {
  const _TrashShimmer();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: List.generate(
          6,
          (_) => Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: ShimmerBox(
              width: double.infinity,
              height: 72,
              borderRadius: 16,
            ),
          ),
        ),
      ),
    );
  }
}
