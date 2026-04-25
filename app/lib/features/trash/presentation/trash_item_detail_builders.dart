part of 'trash_item_detail_page.dart';

extension _TrashItemDetailBuilders on TrashItemDetailPage {
  // ── Body ─────────────────────────────────────────────────────────────────

  Widget _buildBody(BuildContext context, WidgetRef ref) {
    final daysElapsed = DateTime.now().difference(item.deletedAt).inDays;
    final daysLeft = (30 - daysElapsed).clamp(0, 30);
    final isExpiringSoon = daysLeft <= 7;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          TrashHeroCard(item: item),
          const SizedBox(height: 12),
          TrashDeletionCard(
            deletedAt: item.deletedAt,
            formattedDate: TrashItemDetailPage._dateFmt.format(
              item.deletedAt.toLocal(),
            ),
            isExpiringSoon: isExpiringSoon,
            daysLeft: daysLeft,
          ),
          const SizedBox(height: 12),
          _buildInfoCard(context),
          const SizedBox(height: 28),
          TrashItemActions(
            onRestore: () => _restore(context, ref),
            onDelete: () => _confirmDelete(context, ref),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  // ── Info card con campos dinámicos ────────────────────────────────────────
  // Stays here because it uses private _FieldDef from trash_field_defs.dart

  Widget _buildInfoCard(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;
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
              color: value ? AppColors.success : AppColors.destructive,
            ),
            const SizedBox(width: 4),
            Text(
              value ? 'Sí' : 'No',
              style: TextStyle(
                color: value ? AppColors.success : AppColors.destructive,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        );
      case 'date':
        try {
          final dt = DateTime.parse(raw.toString()).toLocal();
          return Text(TrashItemDetailPage._dateFmt.format(dt));
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
              color: AppColors.warning,
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

  // ── Acciones ─────────────────────────────────────────────────────────────

  void _invalidateListByType(WidgetRef ref) {
    switch (item.type) {
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
    final first = await ConfirmDialog.show(
      context,
      title: 'Eliminar permanentemente',
      message:
          '¿Eliminar "${item.displayName}" de forma permanente?\nEsta acción no se puede deshacer.',
      confirmLabel: 'Continuar',
      isDestructive: true,
    );
    if (!first || !context.mounted) return;

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
