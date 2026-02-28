// ignore_for_file: use_null_aware_elements

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/utils/currency_helper.dart';
import '../../../shared/widgets/confirm_dialog.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/loading_overlay.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../data/booking_model.dart';
import '../data/google_calendar_models.dart';
import '../providers/calendar_provider.dart';
import '../providers/google_calendar_provider.dart';

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
      await ref.read(bookingsRepositoryProvider).updateBooking(widget.bookingId, {
        'status': _status,
        'adminNotes': _notesController.text.trim().isEmpty ? null : _notesController.text.trim(),
      });
      ref.invalidate(bookingDetailProvider(widget.bookingId));
      ref.invalidate(bookingsListProvider);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Reserva actualizada')));
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('No fue posible completar la accion. Intentalo de nuevo.')));
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
      message: '¿Seguro que deseas eliminar esta reserva? Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar',
      isDestructive: true,
    );
    if (!confirmed || !mounted) return;

    setState(() => _saving = true);
    try {
      await ref.read(bookingsRepositoryProvider).deleteBooking(widget.bookingId);
      ref.invalidate(bookingsListProvider);
      if (mounted) context.pop();
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('No fue posible completar la accion. Intentalo de nuevo.')));
        setState(() => _saving = false);
      }
    }
  }

  // ── UI ────────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final async = ref.watch(bookingDetailProvider(widget.bookingId));

    return LoadingOverlay(
      isLoading: _saving,
      child: Scaffold(
        appBar: AppBar(
          leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => context.pop(), tooltip: 'Volver'),
          title: const Text('Detalle de reserva'),
          centerTitle: false,
          actions: [
            IconButton(icon: const Icon(Icons.delete_outline), tooltip: 'Eliminar', onPressed: _delete),
            IconButton(icon: const Icon(Icons.save_outlined), tooltip: 'Guardar', onPressed: _save),
          ],
        ),
        body: async.when(
          loading: () => _buildShimmer(),
          error: (e, _) =>
              ErrorState(message: e.toString(), onRetry: () => ref.invalidate(bookingDetailProvider(widget.bookingId))),
          data: (detail) {
            _populate(detail);
            return _buildDetail(context, detail);
          },
        ),
      ),
    );
  }

  Widget _buildShimmer() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: List.generate(
        5,
        (_) => Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: ShimmerLoader(child: ShimmerBox(width: double.infinity, height: 56, borderRadius: 12)),
        ),
      ),
    );
  }

  Widget _buildDetail(BuildContext context, BookingDetail detail) {
    final theme = Theme.of(context);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Cabecera ──────────────────────────────────────────────────────
          _SectionCard(
            children: [
              _InfoRow(icon: Icons.person_outline, label: 'Cliente', value: detail.clientName),
              _InfoRow(icon: Icons.email_outlined, label: 'Email', value: detail.clientEmail),
              if (detail.clientPhone != null)
                _InfoRow(icon: Icons.phone_outlined, label: 'Teléfono', value: detail.clientPhone!),
              if (detail.guestCount > 0)
                _InfoRow(icon: Icons.people_outline, label: 'Asistentes', value: '${detail.guestCount}'),
            ],
          ),
          const SizedBox(height: 12),
          // ── Servicio y fecha ──────────────────────────────────────────────
          _SectionCard(
            children: [
              _InfoRow(icon: Icons.design_services_outlined, label: 'Servicio', value: detail.service?.name ?? '—'),
              _InfoRow(icon: Icons.calendar_today_outlined, label: 'Fecha', value: _formatDate(detail.date)),
              if (detail.endDate != null)
                _InfoRow(icon: Icons.schedule_outlined, label: 'Fin', value: _formatDate(detail.endDate!)),
            ],
          ),
          const SizedBox(height: 12),
          // ── Pago ─────────────────────────────────────────────────────────
          _SectionCard(
            title: 'Pago',
            children: [
              _InfoRow(
                icon: Icons.euro_outlined,
                label: 'Total',
                value: detail.totalAmount != null ? '${currencySymbol(null)}${detail.totalAmount}' : '—',
              ),
              _InfoRow(
                icon: Icons.paid_outlined,
                label: 'Pagado',
                value: detail.paidAmount != null ? '${currencySymbol(null)}${detail.paidAmount}' : '—',
              ),
              _InfoRow(icon: Icons.receipt_outlined, label: 'Estado pago', value: _paymentLabel(detail.paymentStatus)),
              if (detail.paymentMethod != null)
                _InfoRow(icon: Icons.credit_card_outlined, label: 'Método', value: detail.paymentMethod!),
            ],
          ),
          const SizedBox(height: 12),
          // ── Estado ────────────────────────────────────────────────────────
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Estado de la reserva',
                    style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _kStatuses
                        .map(
                          (s) => ChoiceChip(
                            label: Text(s.$1),
                            selected: _status == s.$2,
                            onSelected: (_) => setState(() => _status = s.$2),
                          ),
                        )
                        .toList(),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          // ── Notas admin ───────────────────────────────────────────────────
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Notas internas', style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _notesController,
                    maxLines: 4,
                    decoration: const InputDecoration(
                      hintText: 'Añade notas internas sobre esta reserva…',
                      border: OutlineInputBorder(),
                    ),
                  ),
                ],
              ),
            ),
          ),
          if (detail.clientNotes != null && detail.clientNotes!.isNotEmpty) ...[
            const SizedBox(height: 12),
            _SectionCard(
              title: 'Notas del cliente',
              children: [Text(detail.clientNotes!, style: theme.textTheme.bodyMedium)],
            ),
          ],
          const SizedBox(height: 24),
          // ── Botón guardar ─────────────────────────────────────────────────
          SizedBox(
            width: double.infinity,
            child: FilledButton.icon(
              onPressed: _save,
              icon: const Icon(Icons.save_outlined),
              label: const Text('Guardar cambios'),
            ),
          ),
          const SizedBox(height: 12),
          // ── Google Calendar ───────────────────────────────────────────────
          _GoogleCalendarSection(bookingDetail: detail),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  String _formatDate(DateTime d) {
    const months = ['', 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    final h = d.hour.toString().padLeft(2, '0');
    final m = d.minute.toString().padLeft(2, '0');
    return '${d.day} ${months[d.month]} ${d.year}  $h:$m';
  }

  String _paymentLabel(String? s) => switch (s) {
    'PAID' => 'Pagado',
    'PARTIALLY_PAID' => 'Parcialmente pagado',
    'REFUNDED' => 'Reembolsado',
    _ => 'Pendiente',
  };

  static const _kStatuses = [
    ('Pendiente', 'PENDING'),
    ('Confirmado', 'CONFIRMED'),
    ('En curso', 'IN_PROGRESS'),
    ('Completado', 'COMPLETED'),
    ('Cancelado', 'CANCELLED'),
    ('No presentó', 'NO_SHOW'),
  ];
}

// ── Widgets auxiliares ────────────────────────────────────────────────────────

class _SectionCard extends StatelessWidget {
  const _SectionCard({this.title, required this.children});
  final String? title;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (title != null) ...[
              Text(title!, style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
            ],
            ...children,
          ],
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({required this.icon, required this.label, required this.value});
  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 18, color: theme.colorScheme.outline),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: theme.textTheme.labelSmall?.copyWith(color: theme.colorScheme.outline)),
                Text(value, style: theme.textTheme.bodyMedium),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── _GoogleCalendarSection ────────────────────────────────────────────────────

/// Botón para exportar la reserva a Google Calendar.
///
/// Muestra "Conectar Google Calendar" si no hay sesión Google activa,
/// o "Añadir a Google Calendar" si el usuario ya tiene cuenta conectada.
class _GoogleCalendarSection extends ConsumerWidget {
  const _GoogleCalendarSection({required this.bookingDetail});

  final BookingDetail bookingDetail;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final gcAsync = ref.watch(googleCalendarProvider);

    return gcAsync.when(
      loading: () => const SizedBox.shrink(),
      error: (_, _) => const SizedBox.shrink(),
      data: (gcState) {
        final isConnected = gcState is GoogleAuthConnected;

        return SizedBox(
          width: double.infinity,
          child: OutlinedButton.icon(
            onPressed: () => _handlePress(context, ref, isConnected),
            icon: Image.asset(
              'assets/images/google_calendar_logo.png',
              width: 20,
              height: 20,
              errorBuilder: (_, _, _) => const Icon(Icons.calendar_month_outlined, size: 20),
            ),
            label: Text(isConnected ? 'Añadir a Google Calendar' : 'Conectar Google Calendar'),
          ),
        );
      },
    );
  }

  Future<void> _handlePress(BuildContext context, WidgetRef ref, bool isConnected) async {
    if (!isConnected) {
      // Conectar cuenta Google primero.
      await ref.read(googleCalendarProvider.notifier).signIn();

      final newState = ref.read(googleCalendarProvider).whenOrNull(data: (v) => v);
      if (newState is! GoogleAuthConnected || !context.mounted) return;
    }

    // Crear evento en Google Calendar.
    final endDate = bookingDetail.endDate ?? bookingDetail.date.add(const Duration(hours: 2));

    final parts = <String>[
      if (bookingDetail.clientPhone != null) 'Teléfono: ${bookingDetail.clientPhone}',
      if (bookingDetail.clientNotes != null && bookingDetail.clientNotes!.isNotEmpty)
        'Notas: ${bookingDetail.clientNotes}',
    ];

    final event = GoogleCalendarEvent(
      title: 'Reserva — ${bookingDetail.service?.name ?? 'Sesión'} — ${bookingDetail.clientName}',
      description: parts.isEmpty ? bookingDetail.clientEmail : parts.join('\n'),
      startDateTime: bookingDetail.date,
      endDateTime: endDate,
      attendeeEmail: bookingDetail.clientEmail,
    );

    try {
      final created = await ref.read(googleCalendarProvider.notifier).createEvent(event);

      if (!context.mounted) return;

      if (created) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Evento añadido a Google Calendar'), behavior: SnackBarBehavior.floating),
        );
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (!context.mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error al crear evento: $e'), behavior: SnackBarBehavior.floating));
    }
  }
}
