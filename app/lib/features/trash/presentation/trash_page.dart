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
import '../../services/providers/services_provider.dart';
import '../../testimonials/providers/testimonials_provider.dart';
import '../data/trash_model.dart';
import '../providers/trash_provider.dart';
import 'widgets/trash_section.dart';

class TrashPage extends ConsumerStatefulWidget {
  const TrashPage({super.key});

  @override
  ConsumerState<TrashPage> createState() => _TrashPageState();
}

class _TrashPageState extends ConsumerState<TrashPage> {
  String _searchQuery = '';

  void _onSearch(String value) => setState(() => _searchQuery = value.trim());

  @override
  Widget build(BuildContext context) {
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
          final normalizedQuery = _searchQuery.toLowerCase();
          final filteredGrouped = normalizedQuery.isEmpty
              ? grouped
              : Map.fromEntries(
                  grouped.entries
                      .map(
                        (e) => MapEntry(
                          e.key,
                          e.value
                              .where(
                                (item) => item.displayName
                                    .toLowerCase()
                                    .contains(normalizedQuery),
                              )
                              .toList(),
                        ),
                      )
                      .where((e) => e.value.isNotEmpty),
                );
          final allItems = filteredGrouped.values
              .expand((list) => list)
              .toList();
          if (allItems.isEmpty) {
            if (normalizedQuery.isNotEmpty) {
              return Column(
                children: [
                  AppSearchBar(
                    hint: 'Buscar en papelera...',
                    onChanged: _onSearch,
                  ),
                  const Expanded(
                    child: EmptyState(
                      icon: Icons.search_off_outlined,
                      title: 'Sin resultados',
                      subtitle:
                          'No hay elementos que coincidan con la búsqueda',
                    ),
                  ),
                ],
              );
            }
            return const EmptyState(
              icon: Icons.delete_outline,
              title: 'Papelera vacía',
              subtitle: 'No hay elementos eliminados',
            );
          }
          final sections = filteredGrouped.entries
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
                      onRestore: (item) => _restore(context, item),
                      onPurge: (item) => _purge(context, item),
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
                              onRestore: (item) => _restore(context, item),
                              onPurge: (item) => _purge(context, item),
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
                              onRestore: (item) => _restore(context, item),
                              onPurge: (item) => _purge(context, item),
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
                        onRestore: (item) => _restore(context, item),
                        onPurge: (item) => _purge(context, item),
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
                children: [
                  AppSearchBar(
                    hint: 'Buscar en papelera...',
                    onChanged: _onSearch,
                  ),
                  const SizedBox(height: 8),
                  ...rows,
                ],
              );
            },
          );
        },
      ),
    );
  }

  /// Invalida el provider de lista correspondiente al tipo de elemento,
  /// para que las listas reflejen la restauración o eliminación.
  void _invalidateListByType(String type) {
    switch (type) {
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

  Future<void> _restore(BuildContext context, TrashItem item) async {
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
      _invalidateListByType(item.type);
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

  Future<void> _purge(BuildContext context, TrashItem item) async {
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
      _invalidateListByType(item.type);
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
