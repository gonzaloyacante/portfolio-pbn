part of 'booking_form_page.dart';

extension _BookingFormPageShell on _BookingFormPageState {
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
          body: ErrorState.forFailure(
            e,
            fallbackMessage: 'No se pudo cargar la reserva',
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
