part of 'booking_detail_page.dart';

extension _BookingDetailPageActions on _BookingDetailPageState {
  Future<void> _save() async {
    setState(() => _saving = true);
    try {
      await ref
          .read(bookingsRepositoryProvider)
          .updateBooking(widget.bookingId, {
            'status': _status,
            'adminNotes': _notesController.text.trim().isEmpty
                ? null
                : _notesController.text.trim(),
          });
      ref.invalidate(bookingDetailProvider(widget.bookingId));
      ref.invalidate(bookingsListProvider);
      if (mounted) {
        HapticFeedback.lightImpact();
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Reserva actualizada')));
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'No fue posible completar la accion. Intentalo de nuevo.',
            ),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  Future<void> _delete() async {
    final confirmed = await ConfirmDialog.show(
      context,
      title: 'Eliminar reserva',
      message:
          '¿Seguro que deseas eliminar esta reserva? Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar',
      isDestructive: true,
    );
    if (!confirmed || !mounted) return;

    setState(() => _saving = true);
    try {
      await ref
          .read(bookingsRepositoryProvider)
          .deleteBooking(widget.bookingId);
      ref.invalidate(bookingDetailProvider(widget.bookingId));
      ref.invalidate(bookingsListProvider);
      if (mounted) {
        HapticFeedback.lightImpact();
        context.pop();
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'No fue posible completar la accion. Intentalo de nuevo.',
            ),
          ),
        );
        setState(() => _saving = false);
      }
    }
  }
}
