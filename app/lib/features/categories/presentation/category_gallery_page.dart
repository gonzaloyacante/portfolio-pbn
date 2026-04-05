import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../features/app_settings/providers/app_preferences_provider.dart';
import '../../../core/api/upload_service.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/widgets.dart';
import '../data/categories_repository.dart';
import '../data/category_model.dart';
import 'widgets/gallery_grid_tile.dart';
import 'widgets/gallery_tile.dart';
import 'widgets/instruction_banner.dart';

part 'category_gallery_page_widgets.dart';
part 'category_gallery_page_builders.dart';

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
  bool _uploading = false;
  String _searchQuery = '';

  /// ID del ítem actualmente arrastrado en la vista de cuadrícula.
  String? _draggingId;

  void _rebuild(VoidCallback fn) => setState(fn);

  void _onSearch(String value) => setState(() => _searchQuery = value.trim());

  Future<void> _onRefresh() async {
    setState(() => _items = null);
    ref.invalidate(_categoryGalleryProvider(widget.categoryId));
    await ref.read(_categoryGalleryProvider(widget.categoryId).future);
  }

  List<GalleryImageItem> get _displayItems {
    if (_items == null) return const [];
    if (_searchQuery.isEmpty) return _items!;
    final query = _searchQuery.toLowerCase();
    return _items!
        .where((img) => img.publicId?.toLowerCase().contains(query) ?? false)
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    final async = ref.watch(_categoryGalleryProvider(widget.categoryId));
    final viewMode = ref.watch(categoryGalleryViewModeProvider);

    return AppScaffold(
      title: 'Galería — ${widget.categoryName}',
      floatingActionButton: FloatingActionButton.extended(
        onPressed: (_saving || _uploading) ? null : _showUploadSheet,
        icon: _uploading
            ? const SizedBox.square(
                dimension: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: Colors.white,
                ),
              )
            : const Icon(Icons.add_photo_alternate_outlined),
        label: Text(_uploading ? 'Subiendo...' : 'Agregar foto'),
      ),
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
        if (_dirty) ...[
          TextButton.icon(
            onPressed: _saving ? null : _saveAndReturn,
            icon: _saving
                ? const SizedBox.square(
                    dimension: 16,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.save_outlined, size: 18),
            label: const Text('Guardar'),
          ),
          const SizedBox(width: 8),
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
        ],
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
            return RefreshIndicator(
              onRefresh: _onRefresh,
              child: Column(
                children: [
                  AppSearchBar(
                    hint: 'Buscar imágenes...',
                    onChanged: _onSearch,
                  ),
                  const Expanded(
                    child: SingleChildScrollView(
                      physics: AlwaysScrollableScrollPhysics(),
                      child: SizedBox(
                        height: 400,
                        child: EmptyState(
                          icon: Icons.photo_library_outlined,
                          title: 'Sin imágenes',
                          subtitle: 'Esta categoría no tiene imágenes todavía.',
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: _onRefresh,
            child: Column(
              children: [
                AppSearchBar(hint: 'Buscar imágenes...', onChanged: _onSearch),
                Expanded(
                  child: _displayItems.isEmpty
                      ? const EmptyState(
                          icon: Icons.search_off_outlined,
                          title: 'Sin resultados',
                          subtitle:
                              'No hay imágenes que coincidan con la búsqueda',
                        )
                      : _searchQuery.isNotEmpty
                      ? _buildSearchResults(context)
                      : AnimatedSwitcher(
                          duration: const Duration(milliseconds: 300),
                          switchInCurve: Curves.easeOut,
                          switchOutCurve: Curves.easeIn,
                          transitionBuilder: (child, animation) =>
                              FadeTransition(opacity: animation, child: child),
                          child: viewMode == ViewMode.list
                              ? _buildListView(context)
                              : _buildGridView(context),
                        ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  // ── Upload ────────────────────────────────────────────────────────────────

  Future<void> _showUploadSheet() async {
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          left: 24,
          right: 24,
          top: 24,
          bottom: MediaQuery.viewInsetsOf(ctx).bottom + 24,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Agregar foto a la galería',
              style: Theme.of(
                ctx,
              ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 16),
            ImageUploadWidget(
              label: 'Seleccionar foto',
              hint: 'Toca para seleccionar una imagen',
              height: 240,
              onImageSelected: (file) async {
                Navigator.pop(ctx);
                setState(() => _uploading = true);
                try {
                  final uploadSvc = ref.read(uploadServiceProvider);
                  final result = await uploadSvc.uploadImageFull(file);
                  await ref.read(categoriesRepositoryProvider).addGalleryImages(
                    widget.categoryId,
                    [(url: result.url, publicId: result.publicId)],
                  );
                  ref.invalidate(_categoryGalleryProvider(widget.categoryId));
                  setState(() => _items = null);
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Imagen agregada correctamente'),
                      ),
                    );
                  }
                } catch (e, st) {
                  Sentry.captureException(e, stackTrace: st);
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('No se pudo agregar la imagen.'),
                      ),
                    );
                  }
                } finally {
                  if (mounted) setState(() => _uploading = false);
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  Future<void> _deleteImage(GalleryImageItem item) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Eliminar imagen'),
        content: const Text(
          '¿Eliminar esta imagen de la galería? Esta acción no se puede deshacer.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text(
              'Eliminar',
              style: TextStyle(color: AppColors.destructive),
            ),
          ),
        ],
      ),
    );

    if (confirmed != true || !mounted) return;
    setState(() => _saving = true);

    try {
      await ref
          .read(categoriesRepositoryProvider)
          .deleteGalleryImage(widget.categoryId, item.id, item.publicId ?? '');
      setState(() {
        _items?.removeWhere((i) => i.id == item.id);
      });
      ref.invalidate(_categoryGalleryProvider(widget.categoryId));
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Imagen eliminada')));
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('No se pudo eliminar la imagen.')),
        );
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
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

  Future<void> _saveAndReturn() async {
    // Guarda el orden (si es necesario) y vuelve a la pantalla previa.
    await _saveOrder();
    if (!mounted) return;

    // Al volver, la página de formulario quedará tal como estaba en la pila
    // (estado preservado). Enviamos true como resultado para que el form
    // pueda refrescar si lo necesita.
    Navigator.of(context).pop(true);
  }

  Future<void> _resetOrder() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Restablecer orden'),
        content: const Text(
          '¿Restablecer al orden predeterminado (por orden de subida)?'
          '\nSe perderá el orden personalizado.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text(
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
