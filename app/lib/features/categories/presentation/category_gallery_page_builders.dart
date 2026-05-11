part of 'category_gallery_page.dart';

extension _CategoryGalleryPageBuilders on _CategoryGalleryPageState {
  Widget _buildSearchResults(BuildContext context) {
    return ListView.builder(
      key: const ValueKey('search'),
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.base,
        vertical: 4,
      ),
      itemCount: _displayItems.length,
      itemBuilder: (context, index) {
        final img = _displayItems[index];
        return GalleryTile(
          key: ValueKey('search_${img.id}'),
          item: img,
          index: index,
          total: _displayItems.length,
          onTap: () =>
              GalleryImageViewer.show(context, img.url, position: index + 1),
          onDelete: () => _deleteImage(img),
        );
      },
    );
  }

  Widget _buildListView(BuildContext context) => GalleryListView(
    items: _items!,
    onReorder: _onReorder,
    onDelete: _deleteImage,
  );

  Widget _buildGridView(BuildContext context) => GalleryGridView(
    items: _items!,
    draggingId: _draggingId,
    lastDroppedId: _lastDroppedId,
    onSwap: _swapItems,
    onDragStart: (id) => _rebuild(() => _draggingId = id),
    onDragEnd: () => _rebuild(() => _draggingId = null),
    onDelete: _deleteImage,
    onToggleFeatured: _toggleImageFeatured,
  );

  Widget _buildFAB(BuildContext context) => GalleryUploadFAB(
    isUploading: _uploading,
    isSaving: _saving,
    onPressed: _showUploadSheet,
  );

  List<Widget> _buildActions(BuildContext context, ViewMode viewMode) {
    return [
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
    ];
  }

  Widget _buildBody(
    BuildContext context,
    AsyncValue<List<GalleryImageItem>> async,
    ViewMode viewMode,
  ) {
    return async.when(
      loading: () => GallerySkeleton(viewMode: viewMode),
      error: (e, _) => ErrorState.forFailure(
        e,
        onRetry: () =>
            ref.invalidate(_categoryGalleryProvider(widget.categoryId)),
      ),
      data: (_) {
        if (_items == null) {
          return GallerySkeleton(viewMode: viewMode);
        }

        if (_items!.isEmpty) {
          return RefreshIndicator(
            onRefresh: _onRefresh,
            child: Column(
              children: [
                AppSearchBar(hint: 'Buscar imágenes...', onChanged: _onSearch),
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
                        transitionBuilder:
                            (Widget child, Animation<double> animation) =>
                                FadeTransition(
                                  opacity: animation,
                                  child: child,
                                ),
                        child: viewMode == ViewMode.list
                            ? _buildListView(context)
                            : _buildGridView(context),
                      ),
              ),
            ],
          ),
        );
      },
    );
  }

  // ── Upload sheet ─────────────────────────────────────────────────────────────

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
              allowMultiple: true,
              onImageSelected: (file) async {
                Navigator.pop(ctx);
                setState(() => _uploading = true);
                try {
                  final uploadSvc = ref.read(uploadServiceProvider);
                  final result = await uploadSvc.uploadImageFull(file);
                  await ref
                      .read(categoriesRepositoryProvider)
                      .addGalleryImages(widget.categoryId, [
                        (
                          url: result.url,
                          publicId: result.publicId,
                          width: result.width,
                          height: result.height,
                        ),
                      ]);
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
              onImagesSelected: (files) async {
                Navigator.pop(ctx);
                setState(() => _uploading = true);
                try {
                  final uploadSvc = ref.read(uploadServiceProvider);
                  final uploads =
                      <
                        ({String url, String publicId, int? width, int? height})
                      >[];
                  for (final f in files) {
                    final result = await uploadSvc.uploadImageFull(f);
                    uploads.add((
                      url: result.url,
                      publicId: result.publicId,
                      width: result.width,
                      height: result.height,
                    ));
                  }
                  await ref
                      .read(categoriesRepositoryProvider)
                      .addGalleryImages(widget.categoryId, uploads);
                  ref.invalidate(_categoryGalleryProvider(widget.categoryId));
                  setState(() => _items = null);
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Imágenes agregadas correctamente'),
                      ),
                    );
                  }
                } catch (e, st) {
                  Sentry.captureException(e, stackTrace: st);
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('No se pudieron agregar las imágenes.'),
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
}
