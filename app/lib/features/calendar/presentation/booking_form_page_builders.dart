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
                if (_hasDraft)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: DraftRestoreBanner(
                      onRestore: _restoreDraft,
                      onDiscard: _discardDraft,
                    ),
                  ),
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
                      PhoneInputField(
                        controller: _phoneCtrl,
                        label: 'Teléfono',
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
                const SizedBox(height: 12),
                // ── Pago ─────────────────────────────────────────────────────
                AppCard(
                  borderRadius: AppRadius.forCard,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Pago',
                        style: Theme.of(context).textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _totalAmountCtrl,
                        keyboardType: const TextInputType.numberWithOptions(
                          decimal: true,
                        ),
                        decoration: const InputDecoration(
                          labelText: 'Precio acordado (€)',
                          hintText: '0.00',
                          prefixIcon: Icon(Icons.euro_outlined),
                        ),
                        onChanged: (_) => _markDirty(),
                        validator: (v) {
                          if (v == null || v.trim().isEmpty) return null;
                          if (double.tryParse(v.trim()) == null) {
                            return 'Introduce un número válido';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        value: _paymentStatus,
                        decoration: const InputDecoration(
                          labelText: 'Estado de pago',
                          prefixIcon: Icon(Icons.payment_outlined),
                        ),
                        items: const [
                          DropdownMenuItem(
                            value: 'PENDING',
                            child: Text('Pendiente'),
                          ),
                          DropdownMenuItem(
                            value: 'PARTIAL',
                            child: Text('Pago parcial'),
                          ),
                          DropdownMenuItem(
                            value: 'PAID',
                            child: Text('Pagado'),
                          ),
                          DropdownMenuItem(
                            value: 'REFUNDED',
                            child: Text('Reembolsado'),
                          ),
                        ],
                        onChanged: (v) =>
                            setState(() => _paymentStatus = v ?? 'PENDING'),
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        value: _paymentMethod,
                        decoration: const InputDecoration(
                          labelText: 'Método de pago (opcional)',
                          prefixIcon: Icon(Icons.credit_card_outlined),
                        ),
                        items: const [
                          DropdownMenuItem(
                            value: null,
                            child: Text('Sin especificar'),
                          ),
                          DropdownMenuItem(
                            value: 'cash',
                            child: Text('Efectivo'),
                          ),
                          DropdownMenuItem(
                            value: 'transfer',
                            child: Text('Transferencia'),
                          ),
                          DropdownMenuItem(
                            value: 'mercadopago',
                            child: Text('MercadoPago'),
                          ),
                        ],
                        onChanged: (v) => setState(() => _paymentMethod = v),
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

  // ── Page builder ──────────────────────────────────────────────────────────

  Widget _buildPage(BuildContext context) {
    if (_isEdit && !_prefilled) {
      final bookingId = widget.bookingId!;
      final async = ref.watch(bookingDetailProvider(bookingId));
      ref.listen<AsyncValue<BookingDetail>>(bookingDetailProvider(bookingId), (
        _,
        next,
      ) {
        next.whenData((detail) {
          if (!mounted || _prefilled || _isDirty) {
            return;
          }
          _populate(detail);
        });
      });
      return async.when(
        loading: () => Scaffold(
          appBar: AppBar(
            leading: IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: () => context.pop(),
              tooltip: 'Volver',
            ),
            title: const Text('Editar reserva'),
          ),
          body: const SkeletonSettingsPage(cardCount: 3, fieldsPerCard: 3),
        ),
        error: (e, _) => Scaffold(
          appBar: AppBar(
            leading: IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: () => context.pop(),
              tooltip: 'Volver',
            ),
            title: const Text('Editar reserva'),
          ),
          body: ErrorState(
            message: 'No se pudo cargar la reserva',
            onRetry: () =>
                ref.invalidate(bookingDetailProvider(widget.bookingId!)),
          ),
        ),
        data: (detail) {
          return _buildFormScaffold(context);
        },
      );
    }
    return _buildFormScaffold(context);
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  void _populate(BookingDetail detail) {
    _clientNameCtrl.text = detail.clientName;
    _clientEmailCtrl.text = detail.clientEmail;
    _guestCountCtrl.text = detail.guestCount > 1 ? '${detail.guestCount}' : '';
    _notesCtrl.text = detail.clientNotes ?? '';
    _adminNotesCtrl.text = detail.adminNotes ?? '';
    _phoneCtrl.text = detail.clientPhone ?? '';
    _totalAmountCtrl.text = detail.totalAmount ?? '';
    _date = detail.date;
    _serviceId = detail.serviceId;
    _currentStatus = detail.status;
    setState(() {
      _paymentMethod = detail.paymentMethod;
      _paymentStatus = detail.paymentStatus ?? 'PENDING';
    });
    _prefilled = true;
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

  Future<void> _pickDateTime() async {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final pickedDate = await showDatePicker(
      context: context,
      initialDate: _date ?? today,
      firstDate: _isEdit ? DateTime(2020) : today,
      lastDate: DateTime(2035),
    );
    if (pickedDate == null || !mounted) return;

    final pickedTime = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.fromDateTime(_date ?? now),
    );
    if (pickedTime == null || !mounted) return;

    setState(() {
      _date = DateTime(
        pickedDate.year,
        pickedDate.month,
        pickedDate.day,
        pickedTime.hour,
        pickedTime.minute,
      );
    });
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_date == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Selecciona la fecha y hora')),
      );
      return;
    }
    if (_serviceId == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Selecciona un servicio')));
      return;
    }

    setState(() => _saving = true);
    try {
      final repo = ref.read(bookingsRepositoryProvider);
      final data = BookingFormData(
        date: _date!,
        clientName: _clientNameCtrl.text.trim(),
        clientEmail: _clientEmailCtrl.text.trim(),
        clientPhone: (_phoneCtrl.text.trim().isEmpty)
            ? null
            : _phoneCtrl.text.trim(),
        guestCount: int.tryParse(_guestCountCtrl.text.trim()) ?? 1,
        clientNotes: _notesCtrl.text.trim().isEmpty
            ? null
            : _notesCtrl.text.trim(),
        adminNotes: _adminNotesCtrl.text.trim().isEmpty
            ? null
            : _adminNotesCtrl.text.trim(),
        serviceId: _serviceId!,
        status: _currentStatus ?? 'PENDING',
        totalAmount: _totalAmountCtrl.text.trim().isEmpty
            ? null
            : _totalAmountCtrl.text.trim(),
        paymentMethod: _paymentMethod,
        paymentStatus: _paymentStatus,
      );
      if (_isEdit) {
        await repo.updateBooking(widget.bookingId!, data.toJson());
        ref.invalidate(bookingDetailProvider(widget.bookingId!));
      } else {
        await repo.createBooking(data);
      }
      ref.invalidate(bookingsListProvider);
      if (mounted) {
        unawaited(ref.read(draftServiceProvider).clear(_draftScope));
        HapticFeedback.lightImpact();
        context.pop();
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              _isEdit
                  ? 'No se pudo actualizar la reserva. Inténtalo de nuevo.'
                  : 'No se pudo crear la reserva. Inténtalo de nuevo.',
            ),
          ),
        );
        setState(() => _saving = false);
      }
    }
  }
}
