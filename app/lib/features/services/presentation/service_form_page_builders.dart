part of 'service_form_page.dart';

extension _ServiceFormPageBuilders on _ServiceFormPageState {
  Widget _buildContent(BuildContext context) {
    if (_isEdit) {
      final detailAsync = ref.watch(serviceDetailProvider(widget.serviceId!));
      detailAsync.whenData(_populateForm);
    }

    return LoadingOverlay(
      isLoading: _loading,
      child: Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => context.pop(),
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
              // Nombre
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
                        DropdownMenuItem(value: 'desde', child: Text('desde')),
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
              DurationPickerField(controller: _durationCtrl, label: 'Duración'),
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

              // ── SEO ───────────────────────────────────────────────────
              const Divider(height: 32),
              Text(
                'SEO',
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                  color: Theme.of(context).colorScheme.primary,
                ),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _metaTitleCtrl,
                decoration: const InputDecoration(
                  labelText: 'Meta Título',
                  helperText: 'Título para buscadores (50-60 caracteres)',
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _metaDescCtrl,
                decoration: const InputDecoration(
                  labelText: 'Meta Descripción',
                  helperText:
                      'Descripción para buscadores (150-160 caracteres)',
                ),
                maxLines: 2,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _metaKeywordsCtrl,
                decoration: const InputDecoration(
                  labelText: 'Keywords',
                  hintText: 'fotografía, retrato, sesión...',
                  helperText: 'Separadas por coma',
                ),
              ),

              const SizedBox(height: 32),

              FilledButton(
                onPressed: _loading ? null : _submit,
                child: Text(_isEdit ? 'Actualizar servicio' : 'Crear servicio'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
