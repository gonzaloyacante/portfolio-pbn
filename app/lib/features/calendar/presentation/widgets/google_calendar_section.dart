import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../../shared/widgets/shimmer_loader.dart';
import '../../data/booking_model.dart';
import '../../data/google_calendar_models.dart';
import '../../providers/google_calendar_provider.dart';

/// Botón para exportar la reserva a Google Calendar.
///
/// Muestra "Conectar Google Calendar" si no hay sesión Google activa,
/// o "Añadir a Google Calendar" si el usuario ya tiene cuenta conectada.
class GoogleCalendarSection extends ConsumerWidget {
  const GoogleCalendarSection({super.key, required this.bookingDetail});

  final BookingDetail bookingDetail;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final gcAsync = ref.watch<AsyncValue<GoogleAuthState>>(
      googleCalendarProvider,
    );

    return gcAsync.when(
      loading: () => const ShimmerBox(
        width: double.infinity,
        height: 40,
        borderRadius: 12,
      ),
      error: (err, st) {
        Sentry.captureException(err, stackTrace: st);
        return const SizedBox.shrink();
      },
      data: (GoogleAuthState gcState) {
        final isConnected = gcState is GoogleAuthConnected;

        return SizedBox(
          width: double.infinity,
          child: OutlinedButton.icon(
            onPressed: () => _handlePress(context, ref, isConnected),
            icon: Image.asset(
              'assets/images/google_calendar_logo.png',
              width: 20,
              height: 20,
              errorBuilder: (_, _, _) =>
                  const Icon(Icons.calendar_month_outlined, size: 20),
            ),
            label: Text(
              isConnected
                  ? 'Añadir a Google Calendar'
                  : 'Conectar Google Calendar',
            ),
          ),
        );
      },
    );
  }

  Future<void> _handlePress(
    BuildContext context,
    WidgetRef ref,
    bool isConnected,
  ) async {
    if (!isConnected) {
      // Conectar cuenta Google primero.
      await ref.read(googleCalendarProvider.notifier).signIn();

      final newState = ref
          .read<AsyncValue<GoogleAuthState>>(googleCalendarProvider)
          .whenOrNull(data: (GoogleAuthState v) => v);
      if (newState is! GoogleAuthConnected || !context.mounted) return;
    }

    // Crear evento en Google Calendar.
    final endDate =
        bookingDetail.endDate ??
        bookingDetail.date.add(const Duration(hours: 2));

    final parts = <String>[
      if (bookingDetail.clientPhone != null)
        'Teléfono: ${bookingDetail.clientPhone}',
      if (bookingDetail.clientNotes != null &&
          bookingDetail.clientNotes!.isNotEmpty)
        'Notas: ${bookingDetail.clientNotes}',
    ];

    final event = GoogleCalendarEvent(
      title:
          'Reserva — ${bookingDetail.service?.name ?? 'Sesión'} — ${bookingDetail.clientName}',
      description: parts.isEmpty ? bookingDetail.clientEmail : parts.join('\n'),
      startDateTime: bookingDetail.date,
      endDateTime: endDate,
      attendeeEmail: bookingDetail.clientEmail,
    );

    try {
      final created = await ref
          .read<GoogleCalendarNotifier>(googleCalendarProvider.notifier)
          .createEvent(event);

      if (!context.mounted) return;

      if (created) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Evento añadido a Google Calendar'),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error al crear evento: $e'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }
}
