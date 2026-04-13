// ignore_for_file: use_null_aware_elements

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/router/route_names.dart';
import '../../../core/utils/currency_helper.dart';
import '../../../shared/widgets/widgets.dart';
import '../data/booking_model.dart';
import '../providers/calendar_provider.dart';
import 'widgets/google_calendar_section.dart';
import 'widgets/info_row.dart';
import 'widgets/section_card.dart';

part 'booking_detail_page_builders.dart';

class BookingDetailPage extends ConsumerStatefulWidget {
  const BookingDetailPage({super.key, required this.bookingId});

  final String bookingId;

  @override
  ConsumerState<BookingDetailPage> createState() => _BookingDetailPageState();
}

class _BookingDetailPageState extends ConsumerState<BookingDetailPage> {
  bool _saving = false;
  String? _status;
  final _notesController = TextEditingController();

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  void _populate(BookingDetail detail) {
    if (_status != null) return; // ya inicializado
    _status = detail.status;
    _notesController.text = detail.adminNotes ?? '';
  }

  // ── Guardar ───────────────────────────────────────────────────────────────

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

  // ── Eliminar ──────────────────────────────────────────────────────────────

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

  // ── UI ────────────────────────────────────────────────────────────────────

  void _rebuild(VoidCallback fn) => setState(fn);

  @override
  Widget build(BuildContext context) => _buildContent(context);
}
