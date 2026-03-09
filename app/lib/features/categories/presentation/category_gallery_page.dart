import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../data/categories_repository.dart';
import '../data/category_model.dart';

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

  @override
  Widget build(BuildContext context) {
    final async = ref.watch(_categoryGalleryProvider(widget.categoryId));

    return AppScaffold(
      title: 'Galería — ${widget.categoryName}',
      actions: [
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
        loading: () => const _GallerySkeleton(),
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
            return const _GallerySkeleton();
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

          return Column(
            children: [
              // Instrucción
              Padding(
                padding: const EdgeInsets.fromLTRB(
                  AppSpacing.base,
                  AppSpacing.base,
                  AppSpacing.base,
                  0,
                ),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: Theme.of(
                      context,
                    ).colorScheme.primaryContainer.withValues(alpha: 0.5),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.drag_indicator_rounded,
                        size: 18,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Mantené presionado y arrastrá para reordenar. '
                          'Los cambios se guardan solo al presionar "Guardar orden".',
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 8),
              // Lista reordenable
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
                    return _GalleryTile(
                      key: ValueKey(img.id),
                      item: img,
                      index: index,
                      total: _items!.length,
                    );
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }

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

      // Refrescar desde el backend para sincronizar
      ref.invalidate(_categoryGalleryProvider(widget.categoryId));
      setState(() {
        _dirty = false;
        _items = null; // se reiniializará desde el backend
      });

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
          '¿Restablecer el orden predeterminado (por fecha de carga)?'
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
      setState(() {
        _dirty = false;
        _items = null;
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

// ── Tile ──────────────────────────────────────────────────────────────────────

class _GalleryTile extends StatelessWidget {
  const _GalleryTile({
    super.key,
    required this.item,
    required this.index,
    required this.total,
  });

  final GalleryImageItem item;
  final int index;
  final int total;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 4),
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: Row(
        children: [
          // Número de orden
          SizedBox(
            width: 36,
            child: Center(
              child: Text(
                '${index + 1}',
                style: theme.textTheme.labelMedium?.copyWith(
                  color: scheme.onSurface.withValues(alpha: 0.5),
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ),
          // Thumbnail
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: SizedBox(
              width: 72,
              height: 72,
              child: CachedNetworkImage(
                imageUrl: item.thumbnailUrl,
                fit: BoxFit.cover,
                placeholder: (ctx2, url) => Container(
                  color: scheme.surfaceContainerHighest,
                  child: Icon(
                    Icons.image_outlined,
                    color: scheme.outlineVariant,
                    size: 28,
                  ),
                ),
                errorWidget: (ctx2, url, err) => Container(
                  color: scheme.surfaceContainerHighest,
                  child: Icon(
                    Icons.broken_image_outlined,
                    color: scheme.outlineVariant,
                    size: 28,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          // Info
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.alt ?? item.projectTitle,
                    style: theme.textTheme.labelLarge?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 3),
                  Row(
                    children: [
                      Icon(
                        Icons.folder_outlined,
                        size: 12,
                        color: scheme.onSurface.withValues(alpha: 0.5),
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          item.projectTitle,
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: scheme.onSurface.withValues(alpha: 0.5),
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  if (item.isCover || item.isHero)
                    Padding(
                      padding: const EdgeInsets.only(top: 3),
                      child: Wrap(
                        spacing: 4,
                        children: [
                          if (item.isCover)
                            _Badge(label: 'Portada', color: scheme.primary),
                          if (item.isHero)
                            _Badge(label: 'Hero', color: scheme.tertiary),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          ),
          // Drag handle
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: Icon(
              Icons.drag_handle_rounded,
              color: scheme.onSurface.withValues(alpha: 0.3),
              size: 22,
            ),
          ),
        ],
      ),
    );
  }
}

// ── Mini badge ────────────────────────────────────────────────────────────────

class _Badge extends StatelessWidget {
  const _Badge({required this.label, required this.color});

  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 10,
          color: color,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

class _GallerySkeleton extends StatelessWidget {
  const _GallerySkeleton();

  @override
  Widget build(BuildContext context) {
    return ShimmerLoader(
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.base,
          vertical: AppSpacing.base,
        ),
        itemCount: 8,
        separatorBuilder: (_, _) => const SizedBox(height: 8),
        itemBuilder: (_, _) => const ShimmerBox(
          width: double.infinity,
          height: 80,
          borderRadius: 10,
        ),
      ),
    );
  }
}
