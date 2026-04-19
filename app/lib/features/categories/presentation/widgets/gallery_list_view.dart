import 'package:flutter/material.dart';
import 'package:portfolio_pbn/core/theme/app_spacing.dart';
import 'package:portfolio_pbn/features/categories/data/category_model.dart';

import 'gallery_image_viewer.dart';
import 'gallery_tile.dart';
import 'instruction_banner.dart';

/// Reorderable list view for gallery images.
class GalleryListView extends StatelessWidget {
  const GalleryListView({
    super.key,
    required this.items,
    required this.onReorder,
    required this.onDelete,
  });

  final List<GalleryImageItem> items;
  final void Function(int oldIndex, int newIndex) onReorder;
  final void Function(GalleryImageItem item) onDelete;

  @override
  Widget build(BuildContext context) {
    return Column(
      key: const ValueKey('list'),
      children: [
        const Padding(
          padding: EdgeInsets.fromLTRB(
            AppSpacing.base,
            AppSpacing.base,
            AppSpacing.base,
            0,
          ),
          child: InstructionBanner(
            icon: Icons.drag_indicator_rounded,
            text:
                'Mantené presionado y arrastrá para reordenar. '
                'Los cambios se guardan solo al presionar "Guardar orden".',
          ),
        ),
        const SizedBox(height: 8),
        Expanded(
          child: ReorderableListView.builder(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.base,
              vertical: 4,
            ),
            itemCount: items.length,
            onReorder: onReorder,
            itemBuilder: (context, index) {
              final img = items[index];
              return RepaintBoundary(
                key: ValueKey(img.id),
                child: GalleryTile(
                  key: ValueKey('tile_${img.id}'),
                  item: img,
                  index: index,
                  total: items.length,
                  onTap: () => GalleryImageViewer.show(
                    context,
                    img.url,
                    position: index + 1,
                  ),
                  onDelete: () => onDelete(img),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
