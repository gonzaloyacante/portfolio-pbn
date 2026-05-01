part of 'category_form_page.dart';

// ── Slug helpers ──────────────────────────────────────────────────────────────

/// Convierte un nombre legible en un slug URL-safe.
String _toSlug(String input) {
  const accents = <String, String>{
    'á': 'a',
    'à': 'a',
    'â': 'a',
    'ä': 'a',
    'é': 'e',
    'è': 'e',
    'ê': 'e',
    'ë': 'e',
    'í': 'i',
    'ì': 'i',
    'î': 'i',
    'ï': 'i',
    'ó': 'o',
    'ò': 'o',
    'ô': 'o',
    'ö': 'o',
    'ú': 'u',
    'ù': 'u',
    'û': 'u',
    'ü': 'u',
    'ñ': 'n',
  };
  var s = input.toLowerCase();
  for (final entry in accents.entries) {
    s = s.replaceAll(entry.key, entry.value);
  }
  // ignore: deprecated_member_use
  s = s.replaceAll(RegExp(r'[^a-z0-9\s-]'), '').trim();
  // ignore: deprecated_member_use
  return s.replaceAll(RegExp(r'\s+'), '-');
}

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

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (bool didPop, dynamic result) =>
          _maybeLeave(context),
      child: AppScaffold(
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
                if (_hasDraft)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: DraftRestoreBanner(
                      onRestore: _restoreDraft,
                      onDiscard: _discardDraft,
                    ),
                  ), // Nombre + Switch + Descripción (responsivo)
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
                        onChanged: (v) => _rebuild(() {
                          _isActive = v;
                          _isDirty = true;
                        }),
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
                                  hintText:
                                      'Breve descripción de esta categoría',
                                  helperText:
                                      'Se muestra en la página de la categoría',
                                ),
                                maxLength: 500,
                                maxLines: null,
                                expands: true,
                                onChanged: (_) => _markDirty(),
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
                            helperText:
                                'Se muestra en la página de la categoría',
                          ),
                          maxLength: 500,
                          maxLines: 3,
                          onChanged: (_) => _markDirty(),
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
                      _rebuild(() {
                        _pendingThumbnail = file;
                        _isDirty = true;
                      });
                    },
                    onImageRemoved: () {
                      _rebuild(() {
                        _pendingThumbnail = null;
                        _coverImageCtrl.clear();
                        _isDirty = true;
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

                // Sección separada para gestionar la galería (no confundir con la portada)
                const SizedBox(height: 16),
                Text('Galería', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 8),
                OutlinedButton.icon(
                  icon: const Icon(Icons.photo_album_outlined, size: 18),
                  label: const Text('Gestionar galería'),
                  onPressed: _loading
                      ? null
                      : () async {
                          if (!_isEdit) return;
                          final result = await context.pushNamed(
                            RouteNames.categoryGallery,
                            pathParameters: {'id': widget.categoryId!},
                            queryParameters: {'name': _nameCtrl.text},
                          );

                          if (result == true) {
                            if (!mounted) return;
                            // Usar post-frame callback para evitar advertencias de
                            // uso de BuildContext tras await.
                            WidgetsBinding.instance.addPostFrameCallback((_) {
                              try {
                                ref.invalidate(
                                  categoryDetailProvider(widget.categoryId!),
                                );
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text(
                                      'Galería actualizada, recargando...',
                                    ),
                                  ),
                                );
                              } catch (_) {}
                            });
                          }
                        },

                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 44),
                  ),
                ),

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
      ),
    );
  }

  Future<void> _pickFromGallery() async {
    if (!_isEdit) return;
    try {
      final images = await ref
          .read(categoriesRepositoryProvider)
          .getCategoryGallery(widget.categoryId!);
      if (!mounted) return;
      if (images.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('No hay imágenes en la galería de esta categoría.'),
          ),
        );
        return;
      }
      await showModalBottomSheet<void>(
        context: context,
        isScrollControlled: true,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        builder: (ctx) {
          return DraggableScrollableSheet(
            expand: false,
            initialChildSize: 0.6,
            maxChildSize: 0.9,
            builder: (BuildContext _, ScrollController scrollCtrl) {
              return Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    child: Row(
                      children: [
                        const Expanded(
                          child: Text(
                            'Seleccionar de la galería',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () => ctx.pop(),
                        ),
                      ],
                    ),
                  ),
                  const Divider(height: 1),
                  Expanded(
                    child: GridView.builder(
                      controller: scrollCtrl,
                      padding: const EdgeInsets.all(AppSpacing.sm),
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 3,
                            crossAxisSpacing: 6,
                            mainAxisSpacing: 6,
                          ),
                      itemCount: images.length,
                      itemBuilder: (BuildContext _, int i) {
                        final img = images[i];
                        return RepaintBoundary(
                          child: GestureDetector(
                            onTap: () {
                              setState(() {
                                _coverImageCtrl.text = img.url;
                                _pendingThumbnail = null;
                                _isDirty = true;
                              });
                              ctx.pop();
                            },
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: AppNetworkImage(
                                imageUrl: img.url,
                                fit: BoxFit.cover,
                                placeholder: const ColoredBox(
                                  color: AppColors.lightBorder,
                                ),
                                errorWidget: const Icon(
                                  Icons.broken_image,
                                  color: AppColors.neutralMedium,
                                ),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              );
            },
          );
        },
      );
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('No se pudo cargar la galería. Inténtalo de nuevo.'),
          ),
        );
      }
    }
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  void _populateForm(CategoryDetail detail) {
    if (_populatedFor == widget.categoryId) return;
    _populatedFor = widget.categoryId;
    _nameCtrl.text = detail.name;
    _slugCtrl.text = detail.slug;
    _descriptionCtrl.text = detail.description ?? '';
    _coverImageCtrl.text = detail.coverImageUrl ?? '';
    setState(() {
      _isActive = detail.isActive;
    });
  }

  Future<void> _maybeLeave(BuildContext context) async {
    if (!_isDirty) {
      context.pop();
      return;
    }
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => const ConfirmDialog(
        title: '¿Salir sin guardar?',
        message: 'Tienes cambios sin guardar.',
        confirmLabel: 'Salir',
        cancelLabel: 'Continuar editando',
      ),
    );
    if (confirmed == true && context.mounted) context.pop();
  }

  void _autoSlug(String name) {
    _markDirty();
    if (_isEdit) return;
    _slugCtrl.text = _toSlug(name);
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    setState(() => _loading = true);
    try {
      if (_pendingThumbnail != null) {
        final uploadSvc = ref.read(uploadServiceProvider);
        final result = await uploadSvc.uploadImageFull(
          _pendingThumbnail!,
          folder: 'portfolio/categories',
        );
        _coverImageCtrl.text = result.url;
      }

      final repo = ref.read(categoriesRepositoryProvider);
      final formData = CategoryFormData(
        name: _nameCtrl.text.trim(),
        slug: _slugCtrl.text.trim(),
        description: _descriptionCtrl.text.trim().isEmpty
            ? null
            : _descriptionCtrl.text.trim(),
        coverImageUrl: _coverImageCtrl.text.trim().isEmpty
            ? null
            : _coverImageCtrl.text.trim(),
        isActive: _isActive,
      );

      if (_isEdit) {
        await repo.updateCategory(widget.categoryId!, formData.toJson());
        ref.invalidate(categoryDetailProvider(widget.categoryId!));
      } else {
        await repo.createCategory(formData);
      }

      ref.invalidate(categoriesListProvider);
      if (mounted) {
        unawaited(ref.read(draftServiceProvider).clear(_draftScope));
        HapticFeedback.lightImpact();
        context.pop();
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error al guardar: $e')));
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }
}
