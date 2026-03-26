part of 'project_form_page.dart';

extension _ProjectFormPageBuilders on _ProjectFormPageState {
  Widget _buildForm(BuildContext context) {
    return LoadingOverlay(
      isLoading: _isLoading,
      child: Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => context.pop(),
            tooltip: 'Volver',
          ),
          title: Text(widget.isEditing ? 'Editar proyecto' : 'Nuevo proyecto'),
          actions: [
            if (widget.isEditing)
              IconButton(
                tooltip: 'Eliminar',
                icon: const Icon(Icons.delete_outline),
                onPressed: _isLoading ? null : _confirmAndDelete,
              ),
            TextButton.icon(
              onPressed: _isLoading ? null : _submit,
              icon: const Icon(Icons.check_rounded),
              label: Text(widget.isEditing ? 'Guardar' : 'Crear'),
            ),
          ],
        ),
        body: LayoutBuilder(
          builder: (context, constraints) {
            final isTablet = constraints.maxWidth >= 700;
            return Form(
              key: _formKey,
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 16,
                ),
                child: isTablet
                    ? _buildTabletLayout(context)
                    : _buildPhoneLayout(context),
              ),
            );
          },
        ),
      ),
    );
  }

  // ── Layouts ──────────────────────────────────────────────────────────────

  Widget _buildPhoneLayout(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (_errorMsg != null) ...[
          InlineError(message: _errorMsg!),
          const SizedBox(height: 16),
        ],
        _gallerySection(),
        const SizedBox(height: 20),
        _titleField(),
        const SizedBox(height: 12),
        _categoryField(),
        const SizedBox(height: 12),
        _descriptionField(),
        const SizedBox(height: 12),
        _excerptField(),
        const SizedBox(height: 12),
        _clientDurationRow(),
        const SizedBox(height: 12),
        _dateField(),
        const SizedBox(height: 16),
        _featuredPinnedRow(),
        const SizedBox(height: 20),
        _gallerySection(),
        const SizedBox(height: 24),
        _submitButton(),
      ],
    );
  }

  Widget _buildTabletLayout(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (_errorMsg != null) ...[
          InlineError(message: _errorMsg!),
          const SizedBox(height: 16),
        ],
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _descriptionField(),
                  const SizedBox(height: 12),
                  _excerptField(),
                ],
              ),
            ),
            const SizedBox(width: 24),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _titleField(),
                  const SizedBox(height: 12),
                  _categoryField(),
                  const SizedBox(height: 12),
                  _clientDurationRow(),
                  const SizedBox(height: 12),
                  _dateField(),
                  const SizedBox(height: 16),
                  _featuredPinnedRow(),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),
        _gallerySection(),
        const SizedBox(height: 24),
        _submitButton(),
      ],
    );
  }

  // ── Campos individuales ───────────────────────────────────────────────────

  // Nota: el campo de portada grande fue eliminado en favor de la galería.

  Widget _titleField() => TextFormField(
    initialValue: _data.title,
    decoration: const InputDecoration(
      labelText: 'Título *',
      helperText: 'Nombre del proyecto en el portfolio',
    ),
    textInputAction: TextInputAction.next,
    onChanged: _autoSlug,
    onSaved: (v) => _data.title = v?.trim() ?? '',
    validator: (v) =>
        (v == null || v.trim().isEmpty) ? 'El título es requerido' : null,
  );

  Widget _descriptionField() => TextFormField(
    initialValue: _data.description,
    maxLines: 5,
    decoration: const InputDecoration(
      labelText: 'Descripción *',
      alignLabelWithHint: true,
      helperText: 'Texto completo visible en la página del proyecto',
    ),
    onSaved: (v) => _data.description = v?.trim() ?? '',
    validator: (v) =>
        (v == null || v.trim().isEmpty) ? 'La descripción es requerida' : null,
  );

  Widget _excerptField() => TextFormField(
    initialValue: _data.excerpt,
    maxLines: 2,
    decoration: const InputDecoration(
      labelText: 'Extracto (opcional)',
      alignLabelWithHint: true,
      helperText: 'Resumen corto para listados y tarjetas',
    ),
    onSaved: (v) =>
        _data.excerpt = (v?.trim().isEmpty ?? true) ? null : v!.trim(),
  );

  Widget _clientDurationRow() => Row(
    children: [
      Expanded(
        child: TextFormField(
          initialValue: _data.client,
          decoration: const InputDecoration(labelText: 'Cliente'),
          textInputAction: TextInputAction.next,
          onSaved: (v) =>
              _data.client = (v?.trim().isEmpty ?? true) ? null : v!.trim(),
        ),
      ),
      const SizedBox(width: 12),
      Expanded(
        child: TextFormField(
          initialValue: _data.duration,
          decoration: const InputDecoration(
            labelText: 'Duración',
            hintText: '2 semanas',
          ),
          textInputAction: TextInputAction.next,
          onSaved: (v) =>
              _data.duration = (v?.trim().isEmpty ?? true) ? null : v!.trim(),
        ),
      ),
    ],
  );

  Widget _dateField() => Builder(
    builder: (context) {
      final d = _data.date ?? DateTime.now();
      final label =
          '${d.day.toString().padLeft(2, '0')} / ${d.month.toString().padLeft(2, '0')} / ${d.year}';
      return InkWell(
        onTap: () async {
          final picked = await showDatePicker(
            context: context,
            initialDate: _data.date ?? DateTime.now(),
            firstDate: DateTime(2000),
            lastDate: DateTime.now().add(const Duration(days: 365 * 2)),
          );
          if (picked != null) _rebuild(() => _data.date = picked);
        },
        borderRadius: BorderRadius.circular(4),
        child: InputDecorator(
          decoration: const InputDecoration(
            labelText: 'Fecha del proyecto',
            helperText: 'Fecha en que se realizó el trabajo',
            suffixIcon: Icon(Icons.calendar_today_outlined, size: 20),
          ),
          child: Text(label),
        ),
      );
    },
  );

  Widget _categoryField() {
    final categoriesAsync = ref.watch(categoriesListProvider());
    return categoriesAsync.when(
      loading: () => const LinearProgressIndicator(),
      error: (err, _) => const Text('Error cargando categorías'),
      data: (paginated) {
        final categories = paginated.data;
        if (categories.isEmpty) {
          return Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Theme.of(
                context,
              ).colorScheme.errorContainer.withValues(alpha: 0.3),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: Theme.of(
                  context,
                ).colorScheme.error.withValues(alpha: 0.5),
              ),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.warning_amber_rounded,
                  color: Theme.of(context).colorScheme.error,
                  size: 20,
                ),
                const SizedBox(width: 10),
                const Expanded(
                  child: Text(
                    'No hay categorías disponibles. Crea una en la sección de Categorías antes de crear un proyecto.',
                    style: TextStyle(fontSize: 13),
                  ),
                ),
              ],
            ),
          );
        }
        return DropdownButtonFormField<String>(
          value:
              _data.categoryId.isNotEmpty &&
                  categories.any((c) => c.id == _data.categoryId)
              ? _data.categoryId
              : null,
          decoration: const InputDecoration(
            labelText: 'Categoría *',
            helperText: 'Categoría principal del proyecto',
          ),
          items: categories.map((c) {
            return DropdownMenuItem(
              value: c.id,
              child: Text(c.name, overflow: TextOverflow.ellipsis),
            );
          }).toList(),
          onChanged: (v) => _rebuild(() => _data.categoryId = v ?? ''),
          onSaved: (v) => _data.categoryId = v ?? '',
          validator: (v) =>
              (v == null || v.isEmpty) ? 'Selecciona una categoría' : null,
        );
      },
    );
  }

  Widget _featuredPinnedRow() => Column(
    children: [
      SwitchListTile(
        title: const Text('Destacado'),
        subtitle: const Text('Aparece en galería principal'),
        value: _data.isFeatured,
        onChanged: (v) => _rebuild(() => _data.isFeatured = v),
        contentPadding: EdgeInsets.zero,
      ),
      SwitchListTile(
        title: const Text('Fijado'),
        subtitle: const Text('Siempre al inicio'),
        value: _data.isPinned,
        onChanged: (v) => _rebuild(() => _data.isPinned = v),
        contentPadding: EdgeInsets.zero,
      ),
      SwitchListTile(
        title: const Text('Activo'),
        subtitle: const Text('Visibilidad pública del proyecto'),
        value: _data.isActive,
        onChanged: (v) => _rebuild(() => _data.isActive = v),
        contentPadding: EdgeInsets.zero,
      ),
    ],
  );

  Widget _gallerySection() {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;
    final allImages = _existingImages.length + _pendingNewImages.length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              'Galería de imágenes',
              style: theme.textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            if (allImages > 0) ...[
              const SizedBox(width: 8),
              CountBadge(count: allImages, scheme: scheme),
            ],
            const Spacer(),
            if (allImages > 1)
              Text(
                'Mantén pulsado para reordenar',
                style: theme.textTheme.bodySmall?.copyWith(
                  color: scheme.onSurfaceVariant,
                ),
              ),
          ],
        ),
        const SizedBox(height: 10),
        SizedBox(
          height: 100,
          child: Row(
            children: [
              Expanded(
                child: ReorderableListView.builder(
                  scrollDirection: Axis.horizontal,
                  buildDefaultDragHandles: true,
                  itemCount: _existingImages.length + _pendingNewImages.length,
                  onReorder: _onGalleryReorder,
                  proxyDecorator: (child, _, animation) {
                    return Material(
                      elevation: 4 * animation.value,
                      borderRadius: BorderRadius.circular(8),
                      color: Colors.transparent,
                      child: child,
                    );
                  },
                  itemBuilder: (context, index) {
                    // Imágenes ya guardadas
                    if (index < _existingImages.length) {
                      final img = _existingImages[index];
                      return RepaintBoundary(
                        key: ValueKey('existing-${img.id}'),
                        child: Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: GalleryThumb.network(
                            url: img.imageUrl,
                            onRemove: () => _rebuild(() {
                              _removedImageIds.add(img.id);
                              _existingImages.removeAt(index);
                            }),
                            onSetCover: () => _rebuild(() {
                              _data.thumbnailUrl = img.imageUrl;
                              _pendingCoverIndex = null;
                            }),
                            isCover: _data.thumbnailUrl == img.imageUrl,
                          ),
                        ),
                      );
                    }

                    // Imágenes nuevas pendientes de subir
                    final pi = index - _existingImages.length;
                    return RepaintBoundary(
                      key: ValueKey(
                        'pending-$pi-${_pendingNewImages[pi].path}',
                      ),
                      child: Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: GalleryThumb.file(
                          file: _pendingNewImages[pi],
                          onRemove: () =>
                              _rebuild(() => _pendingNewImages.removeAt(pi)),
                          onSetCover: () => _rebuild(() {
                            _pendingCoverIndex = pi;
                            _data.thumbnailUrl = '';
                          }),
                          isCover: _pendingCoverIndex == pi,
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(width: 8),
              RepaintBoundary(
                child: AddImageButton(
                  scheme: scheme,
                  onTap: _isLoading ? null : _pickGalleryImage,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  void _onGalleryReorder(int oldIndex, int newIndex) {
    _rebuild(() {
      if (newIndex > oldIndex) newIndex--;
      final totalExisting = _existingImages.length;

      if (oldIndex < totalExisting && newIndex < totalExisting) {
        // Both in existing images
        final item = _existingImages.removeAt(oldIndex);
        _existingImages.insert(newIndex, item);
        _galleryReordered = true;
      } else if (oldIndex >= totalExisting && newIndex >= totalExisting) {
        // Both in pending images
        final pi = oldIndex - totalExisting;
        final ni = newIndex - totalExisting;
        final item = _pendingNewImages.removeAt(pi);
        _pendingNewImages.insert(ni, item);
      }
      // Cross-list moves are ignored (existing → pending or vice versa)
    });
  }

  Widget _submitButton() => SizedBox(
    width: double.infinity,
    child: FilledButton.icon(
      onPressed: _isLoading ? null : _submit,
      icon: Icon(widget.isEditing ? Icons.save_rounded : Icons.add_rounded),
      label: Text(widget.isEditing ? 'Guardar cambios' : 'Crear proyecto'),
      style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(52)),
    ),
  );
}
