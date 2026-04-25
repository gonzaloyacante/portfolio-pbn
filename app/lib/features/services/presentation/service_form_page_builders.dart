part of 'service_form_page.dart';

extension _ServiceFormPageBuilders on _ServiceFormPageState {
  Widget _buildContent(BuildContext context) {
    if (_isEdit) {
      final detailAsync = ref.watch(serviceDetailProvider(widget.serviceId!));
      detailAsync.whenData(_populateForm);
    }

    return LoadingOverlay(
      isLoading: _loading,
      child: PopScope(
        canPop: false,
        onPopInvokedWithResult: (bool didPop, dynamic result) =>
            _maybeLeave(context),
        child: Scaffold(
          appBar: AppBar(
            leading: IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: () => _maybeLeave(context),
              tooltip: 'Volver',
            ),
            title: Text(_isEdit ? 'Editar servicio' : 'Nuevo servicio'),
            actions: [
              TextButton(
                onPressed: _loading ? null : _submit,
                child: const Text('Guardar'),
              ),
            ],
          ),
          body: Form(
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
                  ),
                // Nombre
                TextFormField(
                  controller: _nameCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Nombre *',
                    helperText: 'Nombre público del servicio',
                  ),
                  textCapitalization: TextCapitalization.words,
                  onChanged: _autoSlug,
                  validator: (v) => (v == null || v.trim().isEmpty)
                      ? 'Nombre requerido'
                      : null,
                ),
                const SizedBox(height: 16),

                // Descripción corta
                TextFormField(
                  controller: _shortDescCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Descripción corta',
                    helperText: 'Se muestra en tarjetas y listados',
                  ),
                  maxLines: 2,
                ),
                const SizedBox(height: 16),

                // Descripción larga
                TextFormField(
                  controller: _descCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Descripción detallada',
                    helperText: 'Visible en la página del servicio',
                  ),
                  maxLines: 4,
                ),
                const SizedBox(height: 16),

                // Precio + etiqueta
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _priceCtrl,
                        decoration: const InputDecoration(labelText: 'Precio'),
                        keyboardType: const TextInputType.numberWithOptions(
                          decimal: true,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    SizedBox(
                      width: 110,
                      child: DropdownButtonFormField<String>(
                        value: _priceLabel,
                        decoration: const InputDecoration(labelText: 'Tipo'),
                        items: const [
                          DropdownMenuItem(
                            value: 'desde',
                            child: Text('desde'),
                          ),
                          DropdownMenuItem(value: 'fijo', child: Text('fijo')),
                          DropdownMenuItem(
                            value: 'consultar',
                            child: Text('consultar'),
                          ),
                          DropdownMenuItem(
                            value: 'gratis',
                            child: Text('gratis'),
                          ),
                        ],
                        onChanged: (v) =>
                            _rebuild(() => _priceLabel = v ?? 'desde'),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Duración
                DurationPickerField(
                  controller: _durationCtrl,
                  label: 'Duración',
                ),
                const SizedBox(height: 16),

                // Imagen del servicio
                ImageUploadWidget(
                  label: 'Imagen del servicio',
                  currentImageUrl: _imageCtrl.text.isNotEmpty
                      ? _imageCtrl.text
                      : null,
                  onImageSelected: (file) {
                    _rebuild(() => _pendingImage = file);
                  },
                  onImageRemoved: () {
                    _rebuild(() {
                      _pendingImage = null;
                      _imageCtrl.clear();
                    });
                  },
                  height: 160,
                ),
                const SizedBox(height: 16),

                // URL de video externo (YouTube, Vimeo, etc.)
                VideoUrlField(
                  controller: _videoUrlCtrl,
                  onChanged: (_) => _markDirty(),
                ),
                const SizedBox(height: 16),

                // Tarifas / Pricing tiers
                PricingTiersEditor(
                  tiers: _pricingTiers,
                  onChanged: (tiers) => _rebuild(() {
                    _pricingTiers = tiers;
                    _isDirty = true;
                  }),
                ),
                const SizedBox(height: 16),

                // Switches
                SwitchListTile(
                  title: const Text('Servicio activo'),
                  subtitle: const Text('Visible en el portfolio público'),
                  value: _isActive,
                  onChanged: (v) => _rebuild(() => _isActive = v),
                ),
                SwitchListTile(
                  title: const Text('Destacado'),
                  subtitle: const Text('Aparece en la sección principal'),
                  value: _isFeatured,
                  onChanged: (v) => _rebuild(() => _isFeatured = v),
                ),

                // ── Horario y Disponibilidad ──────────────────────────────
                const Divider(height: 32),
                Text(
                  'Horario y Disponibilidad',
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                    color: Theme.of(context).colorScheme.primary,
                  ),
                ),
                const SizedBox(height: 12),
                SwitchListTile(
                  title: const Text('Disponible para reservas'),
                  subtitle: const Text(
                    'Permite que los clientes soliciten este servicio',
                  ),
                  value: _isAvailable,
                  onChanged: (v) => _rebuild(() => _isAvailable = v),
                ),
                const SizedBox(height: 12),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _durationMinutesCtrl,
                        decoration: const InputDecoration(
                          labelText: 'Duración (minutos)',
                          hintText: 'ej. 60',
                        ),
                        keyboardType: TextInputType.number,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextFormField(
                        controller: _maxBookingsCtrl,
                        decoration: const InputDecoration(
                          labelText: 'Máx. reservas / día',
                          hintText: 'ej. 3',
                        ),
                        keyboardType: TextInputType.number,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _advanceNoticeCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Días de antelación mínima',
                    hintText: 'ej. 2',
                    helperText: 'Días de aviso previo que necesita el cliente',
                  ),
                  keyboardType: TextInputType.number,
                ),

                // ── Detalles adicionales ──────────────────────────────────
                const Divider(height: 32),
                Text(
                  'Detalles adicionales',
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                    color: Theme.of(context).colorScheme.primary,
                  ),
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _requirementsCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Requisitos para el cliente',
                    hintText: 'Qué debe traer o saber el cliente...',
                  ),
                  maxLines: 3,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _cancellationPolicyCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Política de cancelación',
                    hintText: 'Condiciones de cancelación y reembolso...',
                  ),
                  maxLines: 3,
                ),

                const SizedBox(height: 32),

                FilledButton(
                  onPressed: _loading ? null : _submit,
                  child: Text(
                    _isEdit ? 'Actualizar servicio' : 'Crear servicio',
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  void _populateForm(ServiceDetail detail) {
    if (_populated) return;
    _populated = true;
    _nameCtrl.text = detail.name;
    _slugCtrl.text = detail.slug;
    _descCtrl.text = detail.description ?? '';
    _shortDescCtrl.text = detail.shortDesc ?? '';
    _priceCtrl.text = detail.price ?? '';
    _durationCtrl.text = detail.duration ?? '';
    _durationMinutesCtrl.text = detail.durationMinutes?.toString() ?? '';
    _maxBookingsCtrl.text = detail.maxBookingsPerDay?.toString() ?? '';
    _advanceNoticeCtrl.text = detail.advanceNoticeDays?.toString() ?? '';
    _requirementsCtrl.text = detail.requirements ?? '';
    _cancellationPolicyCtrl.text = detail.cancellationPolicy ?? '';
    _imageCtrl.text = detail.imageUrl ?? '';
    _videoUrlCtrl.text = detail.videoUrl ?? '';
    setState(() {
      _priceLabel = detail.priceLabel ?? 'desde';
      _currency = detail.currency;
      _isActive = detail.isActive;
      _isFeatured = detail.isFeatured;
      _isAvailable = detail.isAvailable;
      _pricingTiers = detail.pricingTiers;
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
    final slug = name
        .toLowerCase()
        .replaceAll(_reServiceWhitespace, '-')
        .replaceAll(_reServiceNonSlug, '');
    _slugCtrl.text = slug;
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    setState(() => _loading = true);
    try {
      if (_pendingImage != null) {
        final uploadSvc = ref.read(uploadServiceProvider);
        final result = await uploadSvc.uploadImageFull(
          _pendingImage!,
          folder: 'portfolio/services',
        );
        _imageCtrl.text = result.url;
      }

      final repo = ref.read(servicesRepositoryProvider);
      final formData = ServiceFormData(
        name: _nameCtrl.text.trim(),
        slug: _slugCtrl.text.trim(),
        description: _descCtrl.text.trim().isEmpty
            ? null
            : _descCtrl.text.trim(),
        shortDesc: _shortDescCtrl.text.trim().isEmpty
            ? null
            : _shortDescCtrl.text.trim(),
        price: _priceCtrl.text.trim().isEmpty ? null : _priceCtrl.text.trim(),
        priceLabel: _priceLabel,
        currency: _currency,
        duration: _durationCtrl.text.trim().isEmpty
            ? null
            : _durationCtrl.text.trim(),
        durationMinutes: int.tryParse(_durationMinutesCtrl.text.trim()),
        imageUrl: _imageCtrl.text.trim().isEmpty
            ? null
            : _imageCtrl.text.trim(),
        videoUrl: _videoUrlCtrl.text.trim().isEmpty
            ? null
            : _videoUrlCtrl.text.trim(),
        isActive: _isActive,
        isFeatured: _isFeatured,
        isAvailable: _isAvailable,
        maxBookingsPerDay: int.tryParse(_maxBookingsCtrl.text.trim()),
        advanceNoticeDays: int.tryParse(_advanceNoticeCtrl.text.trim()),
        pricingTiers: _pricingTiers,
        requirements: _requirementsCtrl.text.trim().isEmpty
            ? null
            : _requirementsCtrl.text.trim(),
        cancellationPolicy: _cancellationPolicyCtrl.text.trim().isEmpty
            ? null
            : _cancellationPolicyCtrl.text.trim(),
      );

      if (_isEdit) {
        await repo.updateService(widget.serviceId!, formData.toJson());
        ref.invalidate(serviceDetailProvider(widget.serviceId!));
      } else {
        await repo.createService(formData);
      }

      ref.invalidate(servicesListProvider);
      if (mounted) {
        unawaited(ref.read(draftServiceProvider).clear(_draftScope));
        HapticFeedback.lightImpact();
        context.pop();
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'No se pudo guardar el servicio. Inténtalo de nuevo.',
            ),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }
}
