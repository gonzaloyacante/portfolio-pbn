part of 'trash_item_detail_page.dart';

extension _TrashItemDetailBuilders on TrashItemDetailPage {
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
      borderRadius: const BorderRadius.circular(16),
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

  // ── Acciones ───────────────────────────────────────────────────────────────
}
