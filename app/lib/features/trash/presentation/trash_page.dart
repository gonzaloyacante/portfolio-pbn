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
part 'trash_page_builders.dart';

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
        data: (grouped) => _buildContent(context, grouped),
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
          const SnackBar(content: const Text('No se pudo eliminar el elemento')),
        );
      }
    }
  }
}
