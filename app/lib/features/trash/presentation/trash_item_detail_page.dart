import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../core/utils/app_logger.dart';
import '../../../core/theme/app_colors.dart';

import '../../calendar/providers/calendar_provider.dart';
import '../../categories/providers/categories_provider.dart';
import '../../contacts/providers/contacts_provider.dart';
import '../../projects/providers/projects_provider.dart';
import '../../services/providers/services_provider.dart';
import '../../testimonials/providers/testimonials_provider.dart';
import '../data/trash_model.dart';
import '../providers/trash_provider.dart';

part 'trash_field_defs.dart';
part 'trash_item_detail_builders.dart';

// ── Pantalla de detalle ────────────────────────────────────────────────────────

class TrashItemDetailPage extends ConsumerWidget {
  const TrashItemDetailPage({super.key, required this.item});

  final TrashItem item;

  static final _dateFmt = DateFormat("d 'de' MMMM yyyy, HH:mm", 'es');

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;
    final daysElapsed = DateTime.now().difference(item.deletedAt).inDays;
    final daysLeft = (30 - daysElapsed).clamp(0, 30);
    final isExpiringSoon = daysLeft <= 7;

    return AppScaffold(
      title: trashTypeLabel(item.type),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // ── Hero ──────────────────────────────────────────────────────────
            AppCard(
              borderRadius: BorderRadius.circular(20),
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 32,
                    backgroundColor: cs.primaryContainer,
                    child: Icon(
                      _trashTypeIcon(item.type),
                      size: 28,
                      color: cs.onPrimaryContainer,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item.displayName,
                          style: tt.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 3,
                              ),
                              decoration: BoxDecoration(
                                color: cs.secondaryContainer,
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                trashTypeLabel(item.type),
                                style: tt.labelSmall?.copyWith(
                                  color: cs.onSecondaryContainer,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // ── Eliminado + Expiración ────────────────────────────────────────
            AppCard(
              borderRadius: BorderRadius.circular(16),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              child: Row(
                children: [
                  Icon(
                    Icons.delete_outline,
                    size: 18,
                    color: cs.onSurface.withValues(alpha: 0.5),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Eliminado el',
                          style: tt.labelSmall?.copyWith(
                            color: cs.onSurface.withValues(alpha: 0.55),
                          ),
                        ),
                        Text(
                          _dateFmt.format(item.deletedAt.toLocal()),
                          style: tt.bodyMedium,
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: isExpiringSoon
                          ? cs.errorContainer
                          : cs.onSurface.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      daysLeft == 0 ? 'Expira hoy' : '$daysLeft días restantes',
                      style: tt.labelSmall?.copyWith(
                        color: isExpiringSoon
                            ? cs.onErrorContainer
                            : cs.onSurface.withValues(alpha: 0.7),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // ── Campos dinámicos por tipo ─────────────────────────────────────
            _buildInfoCard(context, cs, tt),
            const SizedBox(height: 28),

            // ── Acciones ─────────────────────────────────────────────────────
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => _restore(context, ref),
                    icon: const Icon(Icons.restore),
                    label: const Text('Restaurar'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: cs.primary,
                      side: BorderSide(color: cs.primary),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: FilledButton.icon(
                    onPressed: () => _confirmDelete(context, ref),
                    icon: const Icon(Icons.delete_forever),
                    label: const Text('Eliminar'),
                    style: FilledButton.styleFrom(
                      backgroundColor: cs.error,
                      foregroundColor: cs.onError,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  void _invalidateListByType(WidgetRef ref) {
    switch (item.type) {
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

  Future<void> _restore(BuildContext context, WidgetRef ref) async {
    final confirm = await ConfirmDialog.show(
      context,
      title: 'Restaurar elemento',
      message:
          '¿Restaurar "${item.displayName}"?\nEl elemento volverá a estar disponible.',
      confirmLabel: 'Restaurar',
      isDestructive: false,
    );
    if (!confirm || !context.mounted) return;

    try {
      await ref
          .read(trashRepositoryProvider)
          .restore(type: item.type, id: item.id);
      ref.invalidate(trashItemsProvider);
      _invalidateListByType(ref);
      if (context.mounted) {
        context.pop();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('${item.displayName} restaurado correctamente'),
          ),
        );
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('No se pudo restaurar: $e'),
            backgroundColor: Theme.of(context).colorScheme.error,
          ),
        );
      }
    }
  }

  Future<void> _confirmDelete(BuildContext context, WidgetRef ref) async {
    // Primera confirmación
    final first = await ConfirmDialog.show(
      context,
      title: 'Eliminar permanentemente',
      message:
          '¿Eliminar "${item.displayName}" de forma permanente?\nEsta acción no se puede deshacer.',
      confirmLabel: 'Continuar',
      isDestructive: true,
    );
    if (!first || !context.mounted) return;

    // Segunda confirmación (doble verificación)
    final second = await ConfirmDialog.show(
      context,
      title: '¿Estás seguro/a?',
      message:
          'Esta es tu última oportunidad. "${item.displayName}" se eliminará para siempre.',
      confirmLabel: 'Eliminar definitivamente',
      isDestructive: true,
    );
    if (!second || !context.mounted) return;

    try {
      await ref
          .read(trashRepositoryProvider)
          .purge(type: item.type, id: item.id);
      ref.invalidate(trashItemsProvider);
      _invalidateListByType(ref);
      if (context.mounted) {
        context.pop();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('${item.displayName} eliminado permanentemente'),
          ),
        );
      }
    } catch (e, st) {
      AppLogger.error(
        'TrashItemDetailPage: error al eliminar permanentemente',
        e,
        st,
      );
      Sentry.captureException(e, stackTrace: st);
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
