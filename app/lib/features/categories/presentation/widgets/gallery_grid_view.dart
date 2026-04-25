import 'package:flutter/material.dart';
import 'package:portfolio_pbn/core/theme/app_spacing.dart';
import 'package:portfolio_pbn/features/categories/data/category_model.dart';

import 'gallery_draggable_tile.dart';
import 'instruction_banner.dart';

/// Masonry-style grid view with drag-to-reorder support.
class GalleryGridView extends StatelessWidget {
  const GalleryGridView({
    super.key,
    required this.items,
    this.draggingId,
    this.lastDroppedId,
    required this.onSwap,
    required this.onDragStart,
    required this.onDragEnd,
    required this.onDelete,
    required this.onToggleFeatured,
  });

  final List<GalleryImageItem> items;
  final String? draggingId;
  final String? lastDroppedId;
  final void Function(int fromIdx, int toIdx) onSwap;
  final void Function(String id) onDragStart;
  final VoidCallback onDragEnd;
  final void Function(GalleryImageItem item) onDelete;
  final void Function(GalleryImageItem item) onToggleFeatured;

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.sizeOf(context).width;
    final columnCount = screenWidth >= 600 ? 3 : 2;
    const gap = 8.0;
    const padding = AppSpacing.base;
    final colWidth =
        (screenWidth - padding * 2 - gap * (columnCount - 1)) / columnCount;

    // Round-robin distribution: position 0→col0, 1→col1, 2→col2…
    // Ensures left→right visual order matches assigned order.
    final columns = List.generate(columnCount, (int _) => <int>[]);
    for (var i = 0; i < items.length; i++) {
      columns[i % columnCount].add(i);
    }

    return Column(
      key: const ValueKey('grid'),
      children: [
        const Padding(
          padding: EdgeInsets.fromLTRB(
            AppSpacing.base,
            AppSpacing.base,
            AppSpacing.base,
            0,
          ),
          child: InstructionBanner(
            icon: Icons.touch_app_rounded,
            text:
                'Mantené presionado y arrastrá para reordenar las fotos. '
                'Los cambios se guardan solo al presionar "Guardar orden".',
          ),
        ),
        const SizedBox(height: 8),
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(padding, 0, padding, padding),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: List.generate(columnCount, (int colIdx) {
                return Expanded(
                  child: Padding(
                    padding: EdgeInsets.only(
                      left: colIdx == 0 ? 0 : gap / 2,
                      right: colIdx == columnCount - 1 ? 0 : gap / 2,
                    ),
                    child: Column(
                      children: columns[colIdx]
                          .map(
                            (int itemIdx) => GalleryDraggableTile(
                              items: items,
                              item: items[itemIdx],
                              index: itemIdx,
                              colWidth: colWidth,
                              position: itemIdx + 1,
                              draggingId: draggingId,
                              lastDroppedId: lastDroppedId,
                              onSwap: onSwap,
                              onDragStart: onDragStart,
                              onDragEnd: onDragEnd,
                              onDelete: onDelete,
                              onToggleFeatured: onToggleFeatured,
                            ),
                          )
                          .toList(),
                    ),
                  ),
                );
              }),
            ),
          ),
        ),
      ],
    );
  }
}
