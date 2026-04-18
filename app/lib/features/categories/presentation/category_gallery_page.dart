import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../features/app_settings/providers/app_preferences_provider.dart';
import '../../../core/api/upload_service.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/widgets.dart';
import '../data/categories_repository.dart';
import '../data/category_model.dart';
import 'widgets/gallery_image_viewer.dart';
import 'widgets/gallery_list_view.dart';
import 'widgets/gallery_grid_view.dart';
import 'widgets/gallery_skeleton.dart';
import 'widgets/gallery_tile.dart';
import 'widgets/gallery_upload_fab.dart';

part 'category_gallery_page_widgets.dart';
part 'category_gallery_page_builders.dart';

// ── Provider ──────────────────────────────────────────────────────────────────

final _categoryGalleryProvider =
    FutureProvider.family<List<GalleryImageItem>, String>(
      (Ref ref, String categoryId) =>
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

  /// ID del ítem que acaba de ser soltado — activa la animación de drop.
  String? _lastDroppedId;

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
      floatingActionButton: _buildFAB(context),
      actions: _buildActions(context, viewMode),
      body: _buildBody(context, async, viewMode),
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

  // ── Toggle isFeatured ─────────────────────────────────────────────────────────

  Future<void> _toggleImageFeatured(GalleryImageItem item) async {
    final newValue = !item.isFeatured;
    setState(() {
      _items = _items
          ?.map((i) => i.id == item.id ? i.copyWith(isFeatured: newValue) : i)
          .toList();
    });

    try {
      await ref
          .read(categoriesRepositoryProvider)
          .toggleImageFeatured(
            widget.categoryId,
            item.id,
            isFeatured: newValue,
          );
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      setState(() {
        _items = _items
            ?.map(
              (i) => i.id == item.id ? i.copyWith(isFeatured: !newValue) : i,
            )
            .toList();
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('No se pudo actualizar la imagen destacada.'),
          ),
        );
      }
    }
  }

  // ── Helpers de arrastre (grid) ───────────────────────────────────────────────

  void _swapItems(int fromIdx, int toIdx) {
    setState(() {
      final item = _items!.removeAt(fromIdx);
      _items!.insert(toIdx, item);
      _dirty = true;
      _lastDroppedId = item.id;
    });
    // Clear the drop marker after the bounce animation finishes.
    Future.delayed(const Duration(milliseconds: 500), () {
      if (mounted) setState(() => _lastDroppedId = null);
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
          .map((e) => (id: e.value.id, order: e.key))
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
    context.pop(true);
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
