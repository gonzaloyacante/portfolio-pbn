import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/providers/app_preferences_provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../data/categories_repository.dart';
import '../data/category_model.dart';
import 'widgets/gallery_grid_tile.dart';
import 'widgets/gallery_tile.dart';
import 'widgets/instruction_banner.dart';

// ── Provider ──────────────────────────────────────────────────────────────────

final _categoryGalleryProvider =
    FutureProvider.family<List<GalleryImageItem>, String>(
      (ref, categoryId) =>
          ref.read(categoriesRepositoryProvider).getCategoryGallery(categoryId),
    );

// ── Page ──────────────────────────────────────────────────────────────────────

class CategoryGalleryPage extends ConsumerStatefulWidget {
  const CategoryGalleryPage({
    super.key,
    required this.categoryId,
    required this.categoryName,
  });

  final String categoryId;
  final String categoryName;

  @override
  ConsumerState<CategoryGalleryPage> createState() =>
      _CategoryGalleryPageState();
}

class _CategoryGalleryPageState extends ConsumerState<CategoryGalleryPage> {
  /// Estado local del orden mientras el usuario arrastra.
  List<GalleryImageItem>? _items;
  bool _dirty = false;
  bool _saving = false;

  /// ID del ítem actualmente arrastrado en la vista de cuadrícula.
  String? _draggingId;

  @override
  Widget build(BuildContext context) {
    final async = ref.watch(_categoryGalleryProvider(widget.categoryId));
    final viewMode = ref.watch(categoryGalleryViewModeProvider);

    return AppScaffold(
      title: 'Galería — ${widget.categoryName}',
      actions: [
        // Toggle lista / cuadrícula
        IconButton(
          icon: Icon(
            viewMode == ViewMode.list
                ? Icons.grid_view_rounded
                : Icons.list_rounded,
          ),
          tooltip: viewMode == ViewMode.list
              ? 'Vista en cuadrícula'
              : 'Vista en lista',
          onPressed: () =>
              ref.read(categoryGalleryViewModeProvider.notifier).toggle(),
        ),
        if (_dirty)
          TextButton.icon(
            onPressed: _saving ? null : _saveOrder,
            icon: _saving
                ? const SizedBox.square(
                    dimension: 16,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.save_outlined, size: 18),
            label: const Text('Guardar orden'),
          ),
        if (_items != null && _items!.isNotEmpty)
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            tooltip: 'Restablecer orden predeterminado',
            onPressed: _saving ? null : _resetOrder,
          ),
      ],
      body: async.when(
        loading: () => _GallerySkeleton(viewMode: viewMode),
        error: (e, _) => ErrorState(
          message: e.toString(),
          onRetry: () =>
              ref.invalidate(_categoryGalleryProvider(widget.categoryId)),
        ),
        data: (images) {
          // Inicializar estado local solo la primera vez o cuando el backend
          // devuelve datos frescos (ej.: después de un reset).
          if (_items == null) {
            WidgetsBinding.instance.addPostFrameCallback((_) {
              if (mounted) setState(() => _items = List.of(images));
            });
            return _GallerySkeleton(viewMode: viewMode);
          }

          if (_items!.isEmpty) {
            return const Center(
              child: Padding(
                padding: EdgeInsets.all(AppSpacing.xl),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.photo_library_outlined,
                      size: 64,
                      color: Colors.grey,
                    ),
                    SizedBox(height: 12),
                    Text(
                      'Esta categoría no tiene imágenes de proyectos todavía.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.grey),
                    ),
                  ],
                ),
              ),
            );
          }

          return AnimatedSwitcher(
            duration: const Duration(milliseconds: 300),
            switchInCurve: Curves.easeOut,
            switchOutCurve: Curves.easeIn,
            transitionBuilder: (child, animation) =>
                FadeTransition(opacity: animation, child: child),
            child: viewMode == ViewMode.list
                ? _buildListView(context)
                : _buildGridView(context),
          );
        },
      ),
    );
  }

  // ── Vista lista ─────────────────────────────────────────────────────────────

  Widget _buildListView(BuildContext context) {
    return Column(
      key: const ValueKey('list'),
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(
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
    final screenWidth = MediaQuery.of(context).size.width;
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
        Padding(
          padding: const EdgeInsets.fromLTRB(
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
              onDragStarted: () => setState(() => _draggingId = img.id),
              onDragEnd: (_) => setState(() => _draggingId = null),
              onDraggableCanceled: (_, _) => setState(() => _draggingId = null),
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

  // ── Helpers de arrastre (grid) ───────────────────────────────────────────────

  void _swapItems(int fromIdx, int toIdx) {
    setState(() {
      final item = _items!.removeAt(fromIdx);
      _items!.insert(toIdx, item);
      _dirty = true;
    });
  }

  // ── Reordenar / guardar / restablecer ────────────────────────────────────────

  void _onReorder(int oldIndex, int newIndex) {
    setState(() {
      if (newIndex > oldIndex) newIndex -= 1;
      final item = _items!.removeAt(oldIndex);
      _items!.insert(newIndex, item);
      _dirty = true;
    });
  }

  Future<void> _saveOrder() async {
    if (_items == null || !_dirty) return;
    setState(() => _saving = true);

    try {
      final orderItems = _items!
          .asMap()
          .entries
          .map((e) => (id: e.value.id, order: e.key + 1))
          .toList();

      await ref
          .read(categoriesRepositoryProvider)
          .updateGalleryOrder(widget.categoryId, orderItems);

      // El orden en _items ya es el correcto; solo limpiamos el flag.
      // Invalidamos el caché para que otras pantallas obtengan datos frescos.
      ref.invalidate(_categoryGalleryProvider(widget.categoryId));
      setState(() => _dirty = false);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Orden guardado correctamente')),
        );
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('No se pudo guardar el orden. Intentá de nuevo.'),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Future<void> _resetOrder() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Restablecer orden'),
        content: const Text(
          '¿Restablecer al orden predeterminado (por orden dentro del proyecto)?'
          '\nSe perderá el orden personalizado.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: Text(
              'Restablecer',
              style: TextStyle(color: AppColors.destructive),
            ),
          ),
        ],
      ),
    );

    if (confirmed != true || !mounted) return;
    setState(() => _saving = true);

    try {
      // Enviar order = null para todos → se logra enviando orden vacío
      // El backend interpreta "vacío" como reset (eliminar categoryGalleryOrder)
      await ref
          .read(categoriesRepositoryProvider)
          .updateGalleryOrder(widget.categoryId, []);

      ref.invalidate(_categoryGalleryProvider(widget.categoryId));
      final fresh = await ref.read(
        _categoryGalleryProvider(widget.categoryId).future,
      );
      if (!mounted) return;
      setState(() {
        _dirty = false;
        _items = List.of(fresh);
      });

      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Orden restablecido')));
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('No se pudo restablecer el orden.')),
        );
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

class _GallerySkeleton extends StatelessWidget {
  const _GallerySkeleton({required this.viewMode});

  final ViewMode viewMode;

  @override
  Widget build(BuildContext context) {
    if (viewMode == ViewMode.grid) {
      return const SkeletonCategoriesGrid();
    }
    return const SkeletonCategoriesList();
  }
}
