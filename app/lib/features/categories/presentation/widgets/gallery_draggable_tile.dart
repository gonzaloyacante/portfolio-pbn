import 'package:flutter/material.dart';
import 'package:portfolio_pbn/core/theme/app_radius.dart';
import 'package:portfolio_pbn/features/categories/data/category_model.dart';

import 'drag_placeholder.dart';
import 'dropped_animator.dart';
import 'gallery_grid_tile.dart';
import 'gallery_image_viewer.dart';

/// A single draggable tile in the gallery grid view.
class GalleryDraggableTile extends StatelessWidget {
  const GalleryDraggableTile({
    super.key,
    required this.items,
    required this.item,
    required this.index,
    required this.colWidth,
    required this.position,
    this.draggingId,
    this.lastDroppedId,
    required this.onSwap,
    required this.onDragStart,
    required this.onDragEnd,
    required this.onDelete,
    required this.onToggleFeatured,
  });

  final List<GalleryImageItem> items;
  final GalleryImageItem item;
  final int index;
  final double colWidth;
  final int position;
  final String? draggingId;
  final String? lastDroppedId;
  final void Function(int fromIdx, int toIdx) onSwap;
  final void Function(String id) onDragStart;
  final VoidCallback onDragEnd;
  final void Function(GalleryImageItem item) onDelete;
  final void Function(GalleryImageItem item) onToggleFeatured;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final double aspectRatio = item.aspectRatio;
    final isDraggingThis = draggingId == item.id;

    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: DragTarget<String>(
        onWillAcceptWithDetails: (DragTargetDetails<String> details) =>
            details.data != item.id,
        onAcceptWithDetails: (DragTargetDetails<String> details) {
          final fromIdx = items.indexWhere((i) => i.id == details.data);
          final toIdx = index;
          if (fromIdx != -1 && toIdx != -1 && fromIdx != toIdx) {
            onSwap(fromIdx, toIdx);
          }
        },
        builder:
            (
              BuildContext context,
              List<String?> candidateData,
              List<dynamic> _,
            ) {
              final isHovered = candidateData.isNotEmpty;

              return AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                curve: Curves.easeOut,
                decoration: BoxDecoration(
                  borderRadius: AppRadius.asRounded(AppRadius.md),
                  border: isHovered
                      ? Border.all(color: scheme.primary, width: 3)
                      : null,
                  boxShadow: isHovered
                      ? [
                          BoxShadow(
                            color: scheme.primary.withValues(alpha: 0.35),
                            blurRadius: 18,
                            spreadRadius: 2,
                          ),
                        ]
                      : isDraggingThis
                      ? null
                      : [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.1),
                            blurRadius: 6,
                            offset: const Offset(0, 3),
                          ),
                        ],
                ),
                child: LongPressDraggable<String>(
                  data: item.id,
                  hapticFeedbackOnStart: true,
                  onDragStarted: () => onDragStart(item.id),
                  onDragEnd: (DraggableDetails _) => onDragEnd(),
                  onDraggableCanceled: (Velocity _, Offset _) => onDragEnd(),
                  feedback: Transform.rotate(
                    angle: 0.07,
                    child: SizedBox(
                      width: colWidth * 1.05,
                      child: Material(
                        elevation: 24,
                        borderRadius: AppRadius.asRounded(AppRadius.md),
                        clipBehavior: Clip.antiAlias,
                        child: Stack(
                          children: [
                            GalleryGridTile(item: item, position: position),
                            Positioned.fill(
                              child: DecoratedBox(
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.topCenter,
                                    end: Alignment.bottomCenter,
                                    colors: [
                                      Colors.transparent,
                                      Colors.black.withValues(alpha: 0.3),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                            const Center(
                              child: Icon(
                                Icons.open_with_rounded,
                                color: Colors.white,
                                size: 30,
                                shadows: [
                                  Shadow(blurRadius: 8, color: Colors.black),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  childWhenDragging: DragPlaceholder(
                    borderRadius: AppRadius.asRounded(AppRadius.md),
                    aspectRatio: aspectRatio,
                    color: scheme.primary,
                  ),
                  child: DroppedAnimator(
                    dropped: lastDroppedId == item.id,
                    child: ClipRRect(
                      borderRadius: AppRadius.asRounded(AppRadius.md),
                      child: GalleryGridTile(
                        item: item,
                        position: position,
                        onTap: () => GalleryImageViewer.show(
                          context,
                          item.url,
                          position: position,
                        ),
                        onDelete: () => onDelete(item),
                        onToggleFeatured: () => onToggleFeatured(item),
                      ),
                    ),
                  ),
                ),
              );
            },
      ),
    );
  }
}
