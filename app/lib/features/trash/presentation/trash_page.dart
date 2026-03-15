// ignore_for_file: use_null_aware_elements
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../shared/widgets/app_scaffold.dart';
import 'package:intl/intl.dart';

import '../../../core/router/route_names.dart';
import '../../../shared/widgets/confirm_dialog.dart';
import '../../../shared/widgets/empty_state.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../../calendar/providers/calendar_provider.dart';
import '../../categories/providers/categories_provider.dart';
import '../../contacts/providers/contacts_provider.dart';
import '../../projects/providers/projects_provider.dart';
import '../../services/providers/services_provider.dart';
import '../../testimonials/providers/testimonials_provider.dart';
import '../data/trash_model.dart';
import '../providers/trash_provider.dart';
import '../../../shared/widgets/app_card.dart';

final _dateFmt = DateFormat('d MMM yyyy', 'es');

class TrashPage extends ConsumerWidget {
  const TrashPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final trashAsync = ref.watch(trashItemsProvider);

    return AppScaffold(
      title: 'Papelera',
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
          final sections = grouped.entries
              .where((e) => e.value.isNotEmpty)
              .toList();

          return LayoutBuilder(
            builder: (context, constraints) {
              final isWide = constraints.maxWidth > 600;
              final List<Widget> rows = [];

              if (!isWide) {
                // Mobile: secciones apiladas verticalmente
                for (final entry in sections) {
                  rows.add(
                    _TrashSection(
                      type: entry.key,
                      items: entry.value,
                      isNarrow: false,
                      onTap: (item) => context.pushNamed(
                        RouteNames.trashDetail,
                        extra: item,
                      ),
                      onRestore: (item) => _restore(context, ref, item),
                      onPurge: (item) => _purge(context, ref, item),
                    ),
                  );
                }
              } else {
                // Tablet: secciones con 1 item se emparejan (50/50).
                // Secciones con 2+ items ocupan el ancho completo.
                int i = 0;
                while (i < sections.length) {
                  final cur = sections[i];
                  final curIsNarrow = cur.value.length == 1;
                  final hasNext = i + 1 < sections.length;
                  final nextIsNarrow =
                      hasNext && sections[i + 1].value.length == 1;

                  if (curIsNarrow && hasNext && nextIsNarrow) {
                    // Dos secciones de 1 item → lado a lado
                    final next = sections[i + 1];
                    rows.add(
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: _TrashSection(
                              type: cur.key,
                              items: cur.value,
                              isNarrow: true,
                              onTap: (item) => context.pushNamed(
                                RouteNames.trashDetail,
                                extra: item,
                              ),
                              onRestore: (item) => _restore(context, ref, item),
                              onPurge: (item) => _purge(context, ref, item),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _TrashSection(
                              type: next.key,
                              items: next.value,
                              isNarrow: true,
                              onTap: (item) => context.pushNamed(
                                RouteNames.trashDetail,
                                extra: item,
                              ),
                              onRestore: (item) => _restore(context, ref, item),
                              onPurge: (item) => _purge(context, ref, item),
                            ),
                          ),
                        ],
                      ),
                    );
                    i += 2;
                  } else {
                    // Sección con 2+ items (o impar sin par) → ancho completo
                    rows.add(
                      _TrashSection(
                        type: cur.key,
                        items: cur.value,
                        isNarrow: false,
                        onTap: (item) => context.pushNamed(
                          RouteNames.trashDetail,
                          extra: item,
                        ),
                        onRestore: (item) => _restore(context, ref, item),
                        onPurge: (item) => _purge(context, ref, item),
                      ),
                    );
                    i++;
                  }
                }
              }

              return ListView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                children: rows,
              );
            },
          );
        },
      ),
    );
  }

  /// Invalida el provider de lista correspondiente al tipo de elemento,
  /// para que las listas reflejen la restauración o eliminación.
  void _invalidateListByType(WidgetRef ref, String type) {
    switch (type) {
      case 'project':
        ref.invalidate(projectsListProvider);
      case 'category':
        ref.invalidate(categoriesListProvider);
      case 'service':
        ref.invalidate(servicesListProvider);
      case 'testimonial':
        ref.invalidate(testimonialsListProvider);
      case 'contact':
        ref.invalidate(contactsListProvider);
      case 'booking':
        ref.invalidate(bookingsListProvider);
    }
  }

  Future<void> _restore(
    BuildContext context,
    WidgetRef ref,
    TrashItem item,
  ) async {
    final confirmed = await ConfirmDialog.show(
      context,
      title: 'Restaurar elemento',
      message:
          '¿Restaurar "${item.displayName}"? Volverá a aparecer en su sección original.',
      confirmLabel: 'Restaurar',
      isDestructive: false,
    );
    if (!confirmed) return;

    try {
      await ref
          .read(trashRepositoryProvider)
          .restore(type: item.type, id: item.id);
      ref.invalidate(trashItemsProvider);
      _invalidateListByType(ref, item.type);
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('${item.displayName} restaurado correctamente'),
          ),
        );
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('No se pudo restaurar: $e')));
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
      _invalidateListByType(ref, item.type);
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

// ── Helper: icono por tipo ─────────────────────────────────────────────────────

IconData _trashTypeIcon(String type) => switch (type) {
  'project' => Icons.work_outline,
  'category' => Icons.category_outlined,
  'service' => Icons.home_repair_service_outlined,
  'testimonial' => Icons.star_border,
  'contact' => Icons.mail_outline,
  'booking' => Icons.event_outlined,
  _ => Icons.delete_outline,
};

// ── Sección por tipo ───────────────────────────────────────────────────────────

class _TrashSection extends StatelessWidget {
  const _TrashSection({
    required this.type,
    required this.items,
    required this.isNarrow,
    required this.onTap,
    required this.onRestore,
    required this.onPurge,
  });

  final String type;
  final List<TrashItem> items;

  /// true cuando la sección ocupa ~50 % del ancho (tablet, emparejada con otra).
  /// false cuando ocupa el 100 % del ancho disponible.
  final bool isNarrow;

  final void Function(TrashItem) onTap;
  final void Function(TrashItem) onRestore;
  final void Function(TrashItem) onPurge;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: const EdgeInsets.only(top: 4, bottom: 12),
          child: Row(
            children: [
              Icon(_trashTypeIcon(type), size: 16, color: colorScheme.primary),
              const SizedBox(width: 6),
              Text(
                trashTypeLabel(type),
                style: Theme.of(
                  context,
                ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: colorScheme.onSurface.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  '${items.length}',
                  style: Theme.of(context).textTheme.labelSmall,
                ),
              ),
            ],
          ),
        ),
        // ── Cuando es narrow (50 %) o hay 1 solo item: columna vertical ──────
        if (isNarrow || items.length == 1)
          Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              for (final item in items)
                Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: SizedBox(
                    width: double.infinity,
                    child: _TrashCard(
                      item: item,
                      onTap: () => onTap(item),
                      onRestore: () => onRestore(item),
                      onPurge: () => onPurge(item),
                    ),
                  ),
                ),
            ],
          )
        // ── Cuando es ancho completo con 2+ items: grilla de 2 columnas ──────
        else ...[
          for (var i = 0; i < items.length; i += 2) ...[
            IntrinsicHeight(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Expanded(
                    child: _TrashCard(
                      item: items[i],
                      onTap: () => onTap(items[i]),
                      onRestore: () => onRestore(items[i]),
                      onPurge: () => onPurge(items[i]),
                    ),
                  ),
                  const SizedBox(width: 12),
                  if (i + 1 < items.length)
                    Expanded(
                      child: _TrashCard(
                        item: items[i + 1],
                        onTap: () => onTap(items[i + 1]),
                        onRestore: () => onRestore(items[i + 1]),
                        onPurge: () => onPurge(items[i + 1]),
                      ),
                    )
                  else
                    const Expanded(child: SizedBox()),
                ],
              ),
            ),
            if (i + 2 < items.length) const SizedBox(height: 10),
          ],
        ],
        const SizedBox(height: 20),
      ],
    );
  }
}

// ── Card de item ───────────────────────────────────────────────────────────────

class _TrashCard extends StatelessWidget {
  const _TrashCard({
    required this.item,
    required this.onTap,
    required this.onRestore,
    required this.onPurge,
  });

  final TrashItem item;
  final VoidCallback onTap;
  final VoidCallback onRestore;
  final VoidCallback onPurge;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    final deletedStr = _dateFmt.format(item.deletedAt.toLocal());
    final daysElapsed = DateTime.now().difference(item.deletedAt).inDays;
    final daysLeft = (30 - daysElapsed).clamp(0, 30);
    final isExpiringSoon = daysLeft <= 7;

    return AppCard(
      borderRadius: BorderRadius.circular(16),
      padding: const EdgeInsets.all(16),
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Icono + nombre
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              CircleAvatar(
                radius: 22,
                backgroundColor: colorScheme.primaryContainer,
                child: Icon(
                  _trashTypeIcon(item.type),
                  size: 20,
                  color: colorScheme.onPrimaryContainer,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.displayName,
                      style: textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      trashTypeLabel(item.type),
                      style: textTheme.labelSmall?.copyWith(
                        color: colorScheme.onSurface.withValues(alpha: 0.6),
                      ),
                    ),
                  ],
                ),
              ),
              Icon(
                Icons.chevron_right,
                size: 18,
                color: colorScheme.onSurface.withValues(alpha: 0.35),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Divider(
            height: 1,
            color: colorScheme.onSurface.withValues(alpha: 0.08),
          ),
          const SizedBox(height: 10),
          // Fecha eliminado + badge expiración
          Row(
            children: [
              Icon(
                Icons.calendar_today_outlined,
                size: 13,
                color: colorScheme.onSurface.withValues(alpha: 0.5),
              ),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  deletedStr,
                  style: textTheme.bodySmall?.copyWith(
                    color: colorScheme.onSurface.withValues(alpha: 0.6),
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: isExpiringSoon
                      ? colorScheme.errorContainer
                      : colorScheme.onSurface.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  daysLeft == 0 ? 'Hoy expira' : '$daysLeft d restantes',
                  style: textTheme.labelSmall?.copyWith(
                    color: isExpiringSoon
                        ? colorScheme.onErrorContainer
                        : colorScheme.onSurface.withValues(alpha: 0.7),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Acciones rápidas
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: onRestore,
                  icon: const Icon(Icons.restore, size: 16),
                  label: const Text('Restaurar'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: colorScheme.primary,
                    side: BorderSide(color: colorScheme.primary),
                    padding: const EdgeInsets.symmetric(vertical: 8),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                onPressed: onPurge,
                icon: const Icon(Icons.delete_forever, size: 20),
                tooltip: 'Eliminar permanentemente',
                style: IconButton.styleFrom(
                  backgroundColor: colorScheme.errorContainer,
                  foregroundColor: colorScheme.onErrorContainer,
                  minimumSize: const Size(40, 40),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ── Shimmer skeleton ───────────────────────────────────────────────────────────

class _TrashShimmer extends StatelessWidget {
  const _TrashShimmer();

  @override
  Widget build(BuildContext context) {
    return ShimmerLoader(
      child: Padding(
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
      ),
    );
  }
}
