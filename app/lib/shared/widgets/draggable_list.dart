import 'package:flutter/material.dart';

// ── DraggableList ─────────────────────────────────────────────────────────────

/// Lista reordenable mediante drag-and-drop.
///
/// Envuelve [ReorderableListView] con feedback visual mejorado y
/// constrained para no ocupar todo el espacio disponible.
///
/// Uso:
/// ```dart
/// DraggableList<Project>(
///   items: projects,
///   onReorder: (oldIndex, newIndex) {
///     ref.read(projectsProvider.notifier).reorder(oldIndex, newIndex);
///   },
///   itemBuilder: (item, index, isDragging) => ProjectListTile(project: item),
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
        return KeyedSubtree(key: keyBuilder(item), child: itemBuilder(item, index, false));
      },
    );
  }

  Widget _proxyDecorator(Widget child, int index, Animation<double> animation) {
    return AnimatedBuilder(
      animation: animation,
      builder: (context, child) {
        final elevation = Tween<double>(
          begin: 0,
          end: 8,
        ).animate(CurvedAnimation(parent: animation, curve: Curves.easeInOut)).value;

        return Material(
          elevation: elevation,
          color: Colors.transparent,
          shadowColor: Colors.black.withValues(alpha: 0.2),
          borderRadius: BorderRadius.circular(12),
          child: child,
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
    return Icon(Icons.drag_handle_rounded, color: Theme.of(context).colorScheme.outline, size: 22);
  }
}
