part of 'category_gallery_page.dart';

extension _CategoryGalleryPageActions on _CategoryGalleryPageState {
  // ── Delete ──────────────────────────────────────────────────────────────────

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

  // ── Toggle isFeatured ───────────────────────────────────────────────────────

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

  // ── Drag / Reorder ──────────────────────────────────────────────────────────

  void _swapItems(int fromIdx, int toIdx) {
    setState(() {
      final item = _items!.removeAt(fromIdx);
      _items!.insert(toIdx, item);
      _dirty = true;
      _lastDroppedId = item.id;
    });
    Future.delayed(const Duration(milliseconds: 500), () {
      if (mounted) setState(() => _lastDroppedId = null);
    });
  }

  void _onReorder(int oldIndex, int newIndex) {
    setState(() {
      if (newIndex > oldIndex) newIndex -= 1;
      final item = _items!.removeAt(oldIndex);
      _items!.insert(newIndex, item);
      _dirty = true;
    });
  }

  // ── Save / Reset order ──────────────────────────────────────────────────────

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
    await _saveOrder();
    if (!mounted) return;
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
