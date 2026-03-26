part of 'category_gallery_page.dart';

extension _CategoryGalleryPageBuilders on _CategoryGalleryPageState {
  // ── Vista lista ─────────────────────────────────────────────────────────────

  Widget _buildListView(BuildContext context) {
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
            itemCount: _items!.length,
            onReorder: _onReorder,
            itemBuilder: (context, index) {
              final img = _items![index];
              return RepaintBoundary(
                key: ValueKey(img.id),
                child: GalleryTile(
                  key: ValueKey('tile_${img.id}'),
                  item: img,
                  index: index,
                  total: _items!.length,
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  // ── Vista cuadrícula masonry ────────────────────────────────────────────────

  Widget _buildGridView(BuildContext context) {
    final screenWidth = MediaQuery.sizeOf(context).width;
    final columnCount = screenWidth >= 600 ? 3 : 2;
    const gap = 8.0;
    const padding = AppSpacing.base;
    final colWidth =
        (screenWidth - padding * 2 - gap * (columnCount - 1)) / columnCount;

    // Distribución round-robin (secuencial): posición 0→col0, 1→col1, 2→col2...
    // Garantiza que el orden visual izquierda→derecha coincide con el orden asignado.
    final columns = List.generate(columnCount, (_) => <int>[]);
    for (var i = 0; i < _items!.length; i++) {
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
              children: List.generate(columnCount, (colIdx) {
                return Expanded(
                  child: Padding(
                    padding: EdgeInsets.only(
                      left: colIdx == 0 ? 0 : gap / 2,
                      right: colIdx == columnCount - 1 ? 0 : gap / 2,
                    ),
                    child: Column(
                      children: columns[colIdx]
                          .map(
                            (itemIdx) => _buildDraggableTile(
                              context,
                              itemIdx,
                              colWidth,
                              itemIdx + 1,
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

  Widget _buildDraggableTile(
    BuildContext context,
    int index,
    double colWidth,
    int position,
  ) {
    final img = _items![index];
    final scheme = Theme.of(context).colorScheme;
    final aspectRatio =
        (img.width != null && img.height != null && img.height! > 0)
        ? img.width! / img.height!
        : 0.8;

    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: DragTarget<String>(
        onWillAcceptWithDetails: (details) => details.data != img.id,
        onAcceptWithDetails: (details) {
          final fromIdx = _items!.indexWhere((i) => i.id == details.data);
          final toIdx = _items!.indexOf(img);
          if (fromIdx != -1 && toIdx != -1 && fromIdx != toIdx) {
            _swapItems(fromIdx, toIdx);
          }
        },
        builder: (context, candidateData, _) {
          final isHovered = candidateData.isNotEmpty;
          final isDraggingThis = _draggingId == img.id;

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
              data: img.id,
              hapticFeedbackOnStart: true,
              onDragStarted: () => _rebuild(() => _draggingId = img.id),
              onDragEnd: (_) => _rebuild(() => _draggingId = null),
              onDraggableCanceled: (_, _) => _rebuild(() => _draggingId = null),
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
                        GalleryGridTile(item: img, position: position),
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
              childWhenDragging: ClipRRect(
                borderRadius: AppRadius.asRounded(AppRadius.md),
                child: AspectRatio(
                  aspectRatio: aspectRatio,
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      color: scheme.primary.withValues(alpha: 0.06),
                      border: Border.all(
                        color: scheme.primary.withValues(alpha: 0.3),
                        width: 2,
                      ),
                    ),
                    child: Center(
                      child: Icon(
                        Icons.swap_vert_rounded,
                        color: scheme.primary.withValues(alpha: 0.5),
                        size: 32,
                      ),
                    ),
                  ),
                ),
              ),
              child: ClipRRect(
                borderRadius: AppRadius.asRounded(AppRadius.md),
                child: GalleryGridTile(item: img, position: position),
              ),
            ),
          );
        },
      ),
    );
  }
}
