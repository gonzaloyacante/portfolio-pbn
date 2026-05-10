import 'package:flutter/material.dart';

/// Duración alineada con huecos de drop en rejilla (galería admin).
const Duration kDragReorderSlotDuration = Duration(milliseconds: 150);

/// Escala del tile durante drag: el hueco candidato se agranda; el resto se “corre”.
double dragReorderTileScale({
  required bool dragActive,
  required bool isDraggingThis,
  required bool isDropCandidate,
}) {
  if (!dragActive || isDraggingThis) return 1.0;
  return isDropCandidate ? 1.04 : 0.96;
}

/// Preview semitransparente de la imagen arrastrada sobre el hueco destino.
class DragReorderGhostPreview extends StatelessWidget {
  const DragReorderGhostPreview({
    super.key,
    required this.imageUrl,
    required this.aspectRatio,
    required this.borderRadius,
    this.opacity = 0.45,
  });

  final String imageUrl;
  final double aspectRatio;
  final BorderRadius borderRadius;
  final double opacity;

  @override
  Widget build(BuildContext context) {
    final surface = Theme.of(context).colorScheme.surfaceContainerHighest;

    return ClipRRect(
      borderRadius: borderRadius,
      child: AspectRatio(
        aspectRatio: aspectRatio,
        child: Stack(
          fit: StackFit.expand,
          children: [
            Opacity(
              opacity: opacity,
              child: Image.network(
                imageUrl,
                fit: BoxFit.cover,
                gaplessPlayback: true,
                errorBuilder: (_, _, _) =>
                    ColoredBox(color: surface.withValues(alpha: 0.5)),
              ),
            ),
            DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.black.withValues(alpha: 0),
                    Colors.black.withValues(alpha: 0.25),
                  ],
                ),
              ),
            ),
            Center(
              child: Icon(
                Icons.vertical_align_center_rounded,
                color: Theme.of(
                  context,
                ).colorScheme.primary.withValues(alpha: 0.85),
                size: 28,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── DraggableList ─────────────────────────────────────────────────────────────

/// Lista reordenable mediante drag-and-drop.
///
/// Envuelve [ReorderableListView] con feedback visual mejorado y
/// constrained para no ocupar todo el espacio disponible.
///
/// Uso:
/// ```dart
/// DraggableList<Category>(
///   items: categories,
///   onReorder: (oldIndex, newIndex) {
///     ref.read(categoriesProvider.notifier).reorder(oldIndex, newIndex);
///   },
///   itemBuilder: (item, index, isDragging) => CategoryTile(category: item),
///   keyBuilder: (item) => item.id,
/// )
/// ```
class DraggableList<T> extends StatelessWidget {
  const DraggableList({
    super.key,
    required this.items,
    required this.onReorder,
    required this.itemBuilder,
    required this.keyBuilder,
    this.padding,
    this.shrinkWrap = false,
  });

  final List<T> items;
  final void Function(int oldIndex, int newIndex) onReorder;
  final Widget Function(T item, int index, bool isSelected) itemBuilder;
  final Key Function(T item) keyBuilder;
  final EdgeInsets? padding;
  final bool shrinkWrap;

  @override
  Widget build(BuildContext context) {
    return ReorderableListView.builder(
      padding: padding,
      shrinkWrap: shrinkWrap,
      physics: shrinkWrap ? const NeverScrollableScrollPhysics() : null,
      onReorder: onReorder,
      itemCount: items.length,
      proxyDecorator: _proxyDecorator,
      itemBuilder: (context, index) {
        final item = items[index];
        return RepaintBoundary(
          key: keyBuilder(item),
          child: itemBuilder(item, index, false),
        );
      },
    );
  }

  Widget _proxyDecorator(Widget child, int index, Animation<double> animation) {
    return AnimatedBuilder(
      animation: animation,
      builder: (context, child) {
        final curved = CurvedAnimation(
          parent: animation,
          curve: Curves.easeOut,
        );
        final elevation = Tween<double>(begin: 0, end: 10).evaluate(curved);
        final scale = Tween<double>(begin: 1.0, end: 1.03).evaluate(curved);

        return Transform.scale(
          scale: scale,
          alignment: Alignment.center,
          child: Material(
            elevation: elevation,
            color: Colors.transparent,
            shadowColor: Colors.black.withValues(alpha: 0.22),
            borderRadius: BorderRadius.circular(12),
            child: child,
          ),
        );
      },
      child: child,
    );
  }
}

// ── DragHandle ────────────────────────────────────────────────────────────────

/// Icono de arrastre para usar en los items de [DraggableList].
///
/// Se debe incluir en el child del item con [ReorderableDragStartListener].
class DragHandle extends StatelessWidget {
  const DragHandle({super.key});

  @override
  Widget build(BuildContext context) {
    return Icon(
      Icons.drag_handle_rounded,
      color: Theme.of(context).colorScheme.outline,
      size: 22,
    );
  }
}
