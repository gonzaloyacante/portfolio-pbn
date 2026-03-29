part of 'category_form_page.dart';

extension _CategoryFormPageBuilders on _CategoryFormPageState {
  Widget _buildContent(BuildContext context) {
    if (_isEdit) {
      final detailAsync = ref.watch(categoryDetailProvider(widget.categoryId!));
      detailAsync.whenData(_populateForm);
    }

    final mediaSize = MediaQuery.sizeOf(context);
    final mediaPadding = MediaQuery.paddingOf(context);
    const appBarApprox = 100.0;
    final fallbackHeight =
        (mediaSize.height -
                mediaPadding.top -
                mediaPadding.bottom -
                appBarApprox)
            .clamp(200.0, 1200.0);
    final imageHeight = _calculatedImageHeight ?? fallbackHeight;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      final ctx = _imageSlotKey.currentContext;
      if (ctx == null) return;
      final box = ctx.findRenderObject() as RenderBox?;
      if (box == null || !box.attached) return;
      final dy = box.localToGlobal(Offset.zero).dy;
      final usable = mediaSize.height - mediaPadding.bottom - dy - appBarApprox;
      final newH = usable.clamp(200.0, 1200.0);
      if ((_calculatedImageHeight == null) ||
          ((_calculatedImageHeight! - newH).abs() > 1.0)) {
        _rebuild(() => _calculatedImageHeight = newH);
      }
    });

    return AppScaffold(
      title: _isEdit ? 'Editar categoría' : 'Nueva categoría',
      actions: [
        TextButton(
          onPressed: _loading ? null : _submit,
          child: const Text('Guardar'),
        ),
      ],
      body: LoadingOverlay(
        isLoading: _loading,
        child: Form(
          key: _formKey,
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // Nombre + Switch + Descripción (responsivo)
              Builder(
                builder: (ctx) {
                  final colorScheme = Theme.of(ctx).colorScheme;
                  final isTablet = mediaSize.width >= 600;

                  final nameField = TextFormField(
                    controller: _nameCtrl,
                    decoration: const InputDecoration(
                      labelText: 'Nombre *',
                      hintText: 'ej. Fotografía',
                      helperText: 'Nombre público de la categoría',
                    ),
                    textCapitalization: TextCapitalization.words,
                    maxLength: 100,
                    onChanged: _autoSlug,
                    validator: (v) => (v == null || v.trim().isEmpty)
                        ? 'Nombre requerido'
                        : null,
                  );

                  final switchTile = DecoratedBox(
                    decoration: BoxDecoration(
                      color: colorScheme.surfaceContainerHighest,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: colorScheme.outline.withValues(alpha: 0.3),
                      ),
                    ),
                    child: SwitchListTile(
                      title: const Text('Categoría activa'),
                      subtitle: const Text('Visible en el portfolio'),
                      value: _isActive,
                      onChanged: (v) => _rebuild(() => _isActive = v),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 12,
                      ),
                      visualDensity: VisualDensity.compact,
                      controlAffinity: ListTileControlAffinity.trailing,
                    ),
                  );

                  if (isTablet) {
                    return IntrinsicHeight(
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                nameField,
                                const SizedBox(height: 8),
                                switchTile,
                              ],
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: TextFormField(
                              controller: _descriptionCtrl,
                              decoration: const InputDecoration(
                                labelText: 'Descripción',
                                hintText: 'Breve descripción de esta categoría',
                                helperText:
                                    'Se muestra en la página de la categoría',
                              ),
                              maxLength: 500,
                              maxLines: null,
                              expands: true,
                            ),
                          ),
                        ],
                      ),
                    );
                  }

                  // Mobile: apilado
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      nameField,
                      const SizedBox(height: 8),
                      switchTile,
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _descriptionCtrl,
                        decoration: const InputDecoration(
                          labelText: 'Descripción',
                          hintText: 'Breve descripción de esta categoría',
                          helperText: 'Se muestra en la página de la categoría',
                        ),
                        maxLength: 500,
                        maxLines: 3,
                      ),
                    ],
                  );
                },
              ),
              const SizedBox(height: 16),

              // Thumbnail
              // Wrapper con key para medir su posición en pantalla
              Container(
                key: _imageSlotKey,
                child: ImageUploadWidget(
                  label: 'Imagen de portada',
                  currentImageUrl: _coverImageCtrl.text.isNotEmpty
                      ? _coverImageCtrl.text
                      : null,
                  onImageSelected: (file) {
                    _rebuild(() => _pendingThumbnail = file);
                  },
                  onImageRemoved: () {
                    _rebuild(() {
                      _pendingThumbnail = null;
                      _coverImageCtrl.clear();
                    });
                  },
                  height: imageHeight,
                ),
              ),

              if (_isEdit) ...[
                const SizedBox(height: 8),
                OutlinedButton.icon(
                  icon: const Icon(Icons.photo_library_outlined, size: 18),
                  label: const Text('Seleccionar de la galería'),
                  onPressed: _loading ? null : _pickFromGallery,
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 44),
                  ),
                ),
              ],

              const SizedBox(height: 24),

              FilledButton(
                onPressed: _loading ? null : _submit,
                child: Text(
                  _isEdit ? 'Actualizar categoría' : 'Crear categoría',
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
