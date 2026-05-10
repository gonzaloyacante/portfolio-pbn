part of 'service_form_page.dart';

extension _ServiceFormFields on _ServiceFormPageState {
  List<Widget> _serviceFormAdaptiveChildren(BuildContext context) {
    final theme = Theme.of(context);
    return [
      if (_hasDraft)
        AdaptiveFormLayout.fullWidth(
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: DraftRestoreBanner(
              onRestore: () => restoreDraft(),
              onDiscard: () => discardDraft(),
            ),
          ),
        ),
      TextFormField(
        controller: _nameCtrl,
        decoration: const InputDecoration(
          labelText: 'Nombre *',
          helperText: 'Nombre público del servicio',
        ),
        textCapitalization: TextCapitalization.words,
        onChanged: _autoSlug,
        validator: (v) =>
            (v == null || v.trim().isEmpty) ? 'Nombre requerido' : null,
      ),
      TextFormField(
        controller: _shortDescCtrl,
        decoration: const InputDecoration(
          labelText: 'Descripción corta',
          helperText: 'Se muestra en tarjetas y listados',
        ),
        maxLines: 2,
      ),
      AdaptiveFormLayout.fullWidth(
        TextFormField(
          controller: _descCtrl,
          decoration: const InputDecoration(
            labelText: 'Descripción detallada',
            helperText: 'Visible en la página del servicio',
          ),
          maxLines: 4,
        ),
      ),
      AdaptiveFormLayout.fullWidth(
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
                  DropdownMenuItem(value: 'desde', child: Text('desde')),
                  DropdownMenuItem(value: 'fijo', child: Text('fijo')),
                  DropdownMenuItem(
                    value: 'consultar',
                    child: Text('consultar'),
                  ),
                  DropdownMenuItem(value: 'gratis', child: Text('gratis')),
                ],
                onChanged: (v) => _rebuild(() => _priceLabel = v ?? 'desde'),
              ),
            ),
          ],
        ),
      ),
      AdaptiveFormLayout.fullWidth(
        DurationPickerField(controller: _durationCtrl, label: 'Duración'),
      ),
      AdaptiveFormLayout.fullWidth(
        ImageUploadWidget(
          label: 'Imagen del servicio',
          currentImageUrl: _imageCtrl.text.isNotEmpty ? _imageCtrl.text : null,
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
      ),
      AdaptiveFormLayout.fullWidth(
        VideoUrlField(
          controller: _videoUrlCtrl,
          onChanged: (_) => _markDirty(),
        ),
      ),
      AdaptiveFormLayout.fullWidth(
        PricingTiersEditor(
          tiers: _pricingTiers,
          onChanged: (tiers) => _rebuild(() {
            _pricingTiers = tiers;
            _isDirty = true;
          }),
        ),
      ),
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
      AdaptiveFormLayout.fullWidth(
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Divider(height: 32),
            Text(
              'Horario y Disponibilidad',
              style: theme.textTheme.titleSmall?.copyWith(
                color: theme.colorScheme.primary,
              ),
            ),
          ],
        ),
      ),
      AdaptiveFormLayout.fullWidth(
        SwitchListTile(
          title: const Text('Disponible para reservas'),
          subtitle: const Text(
            'Permite que los clientes soliciten este servicio',
          ),
          value: _isAvailable,
          onChanged: (v) => _rebuild(() => _isAvailable = v),
        ),
      ),
      TextFormField(
        controller: _durationMinutesCtrl,
        decoration: const InputDecoration(
          labelText: 'Duración (minutos)',
          hintText: 'ej. 60',
        ),
        keyboardType: TextInputType.number,
      ),
      TextFormField(
        controller: _maxBookingsCtrl,
        decoration: const InputDecoration(
          labelText: 'Máx. reservas / día',
          hintText: 'ej. 3',
        ),
        keyboardType: TextInputType.number,
      ),
      AdaptiveFormLayout.fullWidth(
        TextFormField(
          controller: _advanceNoticeCtrl,
          decoration: const InputDecoration(
            labelText: 'Días de antelación mínima',
            hintText: 'ej. 2',
            helperText: 'Días de aviso previo que necesita el cliente',
          ),
          keyboardType: TextInputType.number,
        ),
      ),
      AdaptiveFormLayout.fullWidth(
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Divider(height: 32),
            Text(
              'Detalles adicionales',
              style: theme.textTheme.titleSmall?.copyWith(
                color: theme.colorScheme.primary,
              ),
            ),
          ],
        ),
      ),
      TextFormField(
        controller: _requirementsCtrl,
        decoration: const InputDecoration(
          labelText: 'Requisitos para el cliente',
          hintText: 'Qué debe traer o saber el cliente...',
        ),
        maxLines: 3,
      ),
      TextFormField(
        controller: _cancellationPolicyCtrl,
        decoration: const InputDecoration(
          labelText: 'Política de cancelación',
          hintText: 'Condiciones de cancelación y reembolso...',
        ),
        maxLines: 3,
      ),
      AdaptiveFormLayout.fullWidth(
        FilledButton(
          onPressed: _loading ? null : _submit,
          child: Text(_isEdit ? 'Actualizar servicio' : 'Crear servicio'),
        ),
      ),
    ];
  }
}
