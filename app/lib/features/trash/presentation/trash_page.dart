// ignore_for_file: use_null_aware_elements
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/utils/app_logger.dart';

import '../../../core/router/route_names.dart';
import '../../../shared/widgets/widgets.dart';
import '../../calendar/providers/calendar_provider.dart';
import '../../categories/providers/categories_provider.dart';
import '../../contacts/providers/contacts_provider.dart';
import '../../projects/providers/projects_provider.dart';
import '../../services/providers/services_provider.dart';
import '../../testimonials/providers/testimonials_provider.dart';
import '../data/trash_model.dart';
import '../providers/trash_provider.dart';
import 'widgets/trash_section.dart';

class TrashPage extends ConsumerWidget {
  const TrashPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final trashAsync = ref.watch(trashItemsProvider);

    return AppScaffold(
      title: 'Papelera',
      body: trashAsync.when(
        loading: () => const SkeletonTrashList(),
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
                    TrashSection(
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
                            child: TrashSection(
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
                            child: TrashSection(
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
                      TrashSection(
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
    } catch (e, st) {
      AppLogger.error('TrashPage: error al restaurar elemento', e, st);
      Sentry.captureException(e, stackTrace: st);
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
    } catch (e, st) {
      AppLogger.error('TrashPage: error al eliminar permanentemente', e, st);
      Sentry.captureException(e, stackTrace: st);
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('No se pudo eliminar el elemento')),
        );
      }
    }
  }
}
