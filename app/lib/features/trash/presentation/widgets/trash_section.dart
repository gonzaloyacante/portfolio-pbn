import 'package:flutter/material.dart';

import '../../data/trash_model.dart';
import 'trash_card.dart';

class TrashSection extends StatelessWidget {
  const TrashSection({
    super.key,
    required this.type,
    required this.items,
    required this.isNarrow,
    required this.onTap,
  });

  final String type;
  final List<TrashItem> items;

  /// true cuando la sección ocupa ~50 % del ancho (tablet, emparejada con otra).
  /// false cuando ocupa el 100 % del ancho disponible.
  final bool isNarrow;

  final void Function(TrashItem) onTap;

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
              Icon(trashTypeIcon(type), size: 16, color: colorScheme.primary),
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
                    child: TrashCard(item: item, onTap: () => onTap(item)),
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
                    child: TrashCard(
                      item: items[i],
                      onTap: () => onTap(items[i]),
                    ),
                  ),
                  const SizedBox(width: 12),
                  if (i + 1 < items.length)
                    Expanded(
                      child: TrashCard(
                        item: items[i + 1],
                        onTap: () => onTap(items[i + 1]),
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
