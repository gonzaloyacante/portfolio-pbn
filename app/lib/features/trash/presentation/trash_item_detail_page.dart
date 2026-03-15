import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/confirm_dialog.dart';
import '../../calendar/providers/calendar_provider.dart';
import '../../categories/providers/categories_provider.dart';
import '../../contacts/providers/contacts_provider.dart';
import '../../projects/providers/projects_provider.dart';
import '../../services/providers/services_provider.dart';
import '../../testimonials/providers/testimonials_provider.dart';
import '../data/trash_model.dart';
import '../providers/trash_provider.dart';
import '../../../shared/widgets/app_card.dart';

// ── Definición de campos por tipo ─────────────────────────────────────────────

class _FieldDef {
  const _FieldDef(this.key, this.label, this.icon, {this.fieldType});
  final String key;
  final String label;
  final IconData icon;

  /// null = texto plano, 'bool', 'date', 'rating', 'price'
  final String? fieldType;
}

const _fieldsByType = <String, List<_FieldDef>>{
  'project': [
    _FieldDef('description', 'Descripción', Icons.description_outlined),
    _FieldDef(
      'isActive',
      'Activo',
      Icons.toggle_on_outlined,
      fieldType: 'bool',
    ),
    _FieldDef('isFeatured', 'Destacado', Icons.star_border, fieldType: 'bool'),
    _FieldDef(
      'createdAt',
      'Creado',
      Icons.calendar_today_outlined,
      fieldType: 'date',
    ),
  ],
  'category': [
    _FieldDef('description', 'Descripción', Icons.description_outlined),
    _FieldDef(
      'isActive',
      'Activo',
      Icons.toggle_on_outlined,
      fieldType: 'bool',
    ),
    _FieldDef(
      'createdAt',
      'Creado',
      Icons.calendar_today_outlined,
      fieldType: 'date',
    ),
  ],
  'service': [
    _FieldDef('description', 'Descripción', Icons.description_outlined),
    _FieldDef('price', 'Precio', Icons.euro_outlined, fieldType: 'price'),
    _FieldDef('duration', 'Duración (min)', Icons.timer_outlined),
    _FieldDef(
      'isAvailable',
      'Disponible',
      Icons.check_circle_outline,
      fieldType: 'bool',
    ),
    _FieldDef(
      'isActive',
      'Activo',
      Icons.toggle_on_outlined,
      fieldType: 'bool',
    ),
    _FieldDef(
      'createdAt',
      'Creado',
      Icons.calendar_today_outlined,
      fieldType: 'date',
    ),
  ],
  'testimonial': [
    _FieldDef('text', 'Testimonio', Icons.format_quote_outlined),
    _FieldDef('position', 'Cargo', Icons.work_outline),
    _FieldDef('company', 'Empresa', Icons.business_outlined),
    _FieldDef('rating', 'Valoración', Icons.star_outline, fieldType: 'rating'),
    _FieldDef(
      'verified',
      'Verificado',
      Icons.verified_outlined,
      fieldType: 'bool',
    ),
    _FieldDef(
      'createdAt',
      'Creado',
      Icons.calendar_today_outlined,
      fieldType: 'date',
    ),
  ],
  'contact': [
    _FieldDef('email', 'Email', Icons.email_outlined),
    _FieldDef('phone', 'Teléfono', Icons.phone_outlined),
    _FieldDef('subject', 'Asunto', Icons.subject_outlined),
    _FieldDef('message', 'Mensaje', Icons.message_outlined),
    _FieldDef('status', 'Estado', Icons.info_outline),
    _FieldDef(
      'createdAt',
      'Recibido',
      Icons.calendar_today_outlined,
      fieldType: 'date',
    ),
  ],
  'booking': [
    _FieldDef('email', 'Email', Icons.email_outlined),
    _FieldDef('phone', 'Teléfono', Icons.phone_outlined),
    _FieldDef('notes', 'Notas', Icons.note_outlined),
    _FieldDef('status', 'Estado', Icons.info_outline),
    _FieldDef(
      'startTime',
      'Inicio',
      Icons.schedule_outlined,
      fieldType: 'date',
    ),
    _FieldDef('endTime', 'Fin', Icons.schedule_outlined, fieldType: 'date'),
    _FieldDef(
      'createdAt',
      'Creado',
      Icons.calendar_today_outlined,
      fieldType: 'date',
    ),
  ],
};

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

  // ── Info card con campos dinámicos ────────────────────────────────────────

  Widget _buildInfoCard(BuildContext context, ColorScheme cs, TextTheme tt) {
    final fields = _fieldsByType[item.type] ?? [];
    final rows = <Widget>[];

    for (final field in fields) {
      final raw = item.rawData[field.key];
      if (raw == null) continue;
      final rendered = _renderField(field, raw);
      if (rendered == null) continue;

      if (rows.isNotEmpty) {
        rows.add(
          Divider(
            height: 1,
            indent: 44,
            color: cs.onSurface.withValues(alpha: 0.07),
          ),
        );
      }
      rows.add(
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 12),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(
                field.icon,
                size: 18,
                color: cs.primary.withValues(alpha: 0.75),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      field.label,
                      style: tt.labelSmall?.copyWith(
                        color: cs.onSurface.withValues(alpha: 0.55),
                      ),
                    ),
                    const SizedBox(height: 2),
                    rendered,
                  ],
                ),
              ),
            ],
          ),
        ),
      );
    }

    if (rows.isEmpty) return const SizedBox.shrink();

    return AppCard(
      borderRadius: BorderRadius.circular(16),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: rows,
      ),
    );
  }

  /// Convierte el valor de `rawData` en un widget legible según el tipo de campo.
  Widget? _renderField(_FieldDef field, dynamic raw) {
    switch (field.fieldType) {
      case 'bool':
        final value = raw == true || raw == 1 || raw == 'true';
        return Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              value ? Icons.check_circle_outline : Icons.cancel_outlined,
              size: 16,
              color: value ? Colors.green.shade600 : Colors.red.shade400,
            ),
            const SizedBox(width: 4),
            Text(
              value ? 'Sí' : 'No',
              style: TextStyle(
                color: value ? Colors.green.shade700 : Colors.red.shade500,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        );
      case 'date':
        try {
          final dt = DateTime.parse(raw.toString()).toLocal();
          return Text(_dateFmt.format(dt));
        } catch (_) {
          return Text(raw.toString());
        }
      case 'rating':
        final rating =
            (raw is num ? raw.toDouble() : double.tryParse(raw.toString())) ??
            0.0;
        return Row(
          children: List.generate(5, (i) {
            return Icon(
              i < rating.round()
                  ? Icons.star_rounded
                  : Icons.star_outline_rounded,
              size: 18,
              color: Colors.amber.shade600,
            );
          }),
        );
      case 'price':
        final amount = raw is num ? raw : num.tryParse(raw.toString());
        if (amount == null) return Text(raw.toString());
        final currency = item.rawData['currency'] as String? ?? '€';
        return Text(
          '$currency ${amount.toStringAsFixed(2)}',
          style: const TextStyle(fontWeight: FontWeight.w600),
        );
      default:
        final text = raw.toString().trim();
        if (text.isEmpty) return null;
        return Text(text);
    }
  }

  // ── Acciones ───────────────────────────────────────────────────────────────

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
        Navigator.of(context).pop();
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
            content: Text('No se pudo restaurar: ${e.toString()}'),
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
        Navigator.of(context).pop();
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
