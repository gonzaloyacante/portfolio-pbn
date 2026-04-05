part of 'booking_form_page.dart';

extension _BookingFormPageBuilders on _BookingFormPageState {
  Widget _buildServiceSelector() {
    final servicesAsync = ref.watch(servicesListProvider());
    return servicesAsync.when(
      loading: () => const ShimmerBox(
        width: double.infinity,
        height: 56,
        borderRadius: 12,
      ),
      error: (err, _) => ErrorState(
        message: 'No se pudieron cargar los servicios',
        onRetry: () => ref.invalidate(servicesListProvider()),
      ),
      data: (paginated) {
        final services = paginated.data;
        if (services.isEmpty) {
          return const Text('No hay servicios disponibles');
        }
        return DropdownButtonFormField<String>(
          value: _serviceId,
          decoration: const InputDecoration(
            labelText: 'Servicio *',
            hintText: 'Selecciona un servicio',
          ),
          isExpanded: true,
          items: services
              .map(
                (s) => DropdownMenuItem(
                  value: s.id,
                  child: Text(s.name, overflow: TextOverflow.ellipsis),
                ),
              )
              .toList(),
          onChanged: (v) => setState(() => _serviceId = v),
          validator: (v) => v == null ? 'Selecciona un servicio' : null,
        );
      },
    );
  }

  Widget _buildFormScaffold(BuildContext context) {
    final dateLabel = _date == null
        ? 'Seleccionar fecha y hora'
        : '${_date!.day}/${_date!.month}/${_date!.year}  '
              '${_date!.hour.toString().padLeft(2, '0')}:'
              '${_date!.minute.toString().padLeft(2, '0')}';

    return LoadingOverlay(
      isLoading: _saving,
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
            title: Text(_isEdit ? 'Editar reserva' : 'Nueva reserva'),
            centerTitle: false,
            actions: [
              TextButton(onPressed: _submit, child: const Text('GUARDAR')),
            ],
          ),
          body: Form(
            key: _formKey,
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // ── Datos del cliente ────────────────────────────────────────
                AppCard(
                  borderRadius: AppRadius.forCard,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Datos del cliente',
                        style: Theme.of(context).textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _clientNameCtrl,
                        decoration: const InputDecoration(
                          labelText: 'Nombre *',
                        ),
                        textCapitalization: TextCapitalization.words,
                        onChanged: (_) => _markDirty(),
                        validator: (v) {
                          if (v == null || v.trim().isEmpty) {
                            return 'Obligatorio';
                          }
                          if (v.trim().length < 2) return 'Mínimo 2 caracteres';
                          return null;
                        },
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _clientEmailCtrl,
                        keyboardType: TextInputType.emailAddress,
                        decoration: const InputDecoration(labelText: 'Email *'),
                        validator: AppValidators.email,
                      ),
                      const SizedBox(height: 12),
                      IntlPhoneField(
                        decoration: const InputDecoration(
                          labelText: 'Teléfono',
                          counterText: '',
                        ),
                        initialCountryCode: 'ES',
                        invalidNumberMessage: 'Número de teléfono inválido',
                        keyboardType: TextInputType.phone,
                        onChanged: (phone) {
                          _completeClientPhone = phone.completeNumber;
                        },
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _guestCountCtrl,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(
                          labelText: 'Nº de asistentes',
                        ),
                        validator: (v) {
                          if (v == null || v.trim().isEmpty) return null;
                          final n = int.tryParse(v.trim());
                          if (n == null || n < 1) return 'Mínimo 1 asistente';
                          if (n > 999) return 'Máximo 999 asistentes';
                          return null;
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                // ── Fecha y hora ─────────────────────────────────────────────
                AppCard(
                  borderRadius: AppRadius.forCard,
                  padding: EdgeInsets.zero,
                  child: ListTile(
                    leading: const Icon(Icons.calendar_month_outlined),
                    title: Text(dateLabel),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: _pickDateTime,
                  ),
                ),
                const SizedBox(height: 12),
                // ── Servicio ─────────────────────────────────────────────────
                AppCard(
                  borderRadius: AppRadius.forCard,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Servicio',
                        style: Theme.of(context).textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      _buildServiceSelector(),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                // ── Notas ────────────────────────────────────────────────────
                AppCard(
                  borderRadius: AppRadius.forCard,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Notas',
                        style: Theme.of(context).textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _notesCtrl,
                        maxLines: 4,
                        decoration: const InputDecoration(
                          hintText: 'Observaciones, peticiones especiales…',
                          border: OutlineInputBorder(),
                          labelText: 'Notas del cliente',
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _adminNotesCtrl,
                        maxLines: 3,
                        decoration: const InputDecoration(
                          hintText: 'Notas internas de administración…',
                          border: OutlineInputBorder(),
                          labelText: 'Notas internas (admin)',
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                FilledButton.icon(
                  onPressed: _submit,
                  icon: const Icon(Icons.save_outlined),
                  label: Text(_isEdit ? 'Guardar cambios' : 'Crear reserva'),
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
