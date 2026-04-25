import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/theme/app_radius.dart';
import '../../../../shared/widgets/widgets.dart';
import '../../../calendar/data/google_calendar_models.dart';
import '../../../calendar/providers/google_calendar_provider.dart';

class AccountGoogleCalendarCard extends ConsumerWidget {
  const AccountGoogleCalendarCard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final gcAsync = ref.watch(googleCalendarProvider);
    final colorScheme = Theme.of(context).colorScheme;

    return gcAsync.when(
      loading: () => AppCard(
        borderRadius: AppRadius.forCard,
        padding: EdgeInsets.zero,
        child: const ShimmerLoader(
          child: ListTile(
            leading: ShimmerBox(width: 24, height: 24, borderRadius: 4),
            title: ShimmerBox(width: 180, height: 14, borderRadius: 4),
            subtitle: ShimmerBox(width: 120, height: 12, borderRadius: 4),
          ),
        ),
      ),
      error: (_, _) => AppCard(
        borderRadius: AppRadius.forCard,
        padding: EdgeInsets.zero,
        child: ListTile(
          leading: const Icon(Icons.calendar_month_outlined),
          title: const Text(
            'Google Calendar',
            style: TextStyle(fontWeight: FontWeight.w600),
          ),
          subtitle: const Text('No se pudo cargar el estado'),
          trailing: IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: () => ref.invalidate(googleCalendarProvider),
          ),
        ),
      ),
      data: (gcState) {
        final isConnected = gcState is GoogleAuthConnected;
        final isConnecting = gcState is GoogleAuthConnecting;
        final email = switch (gcState) {
          GoogleAuthConnected(:final email) => email,
          _ => null,
        };

        return AppCard(
          borderRadius: AppRadius.forCard,
          padding: EdgeInsets.zero,
          onTap: isConnected || isConnecting
              ? null
              : () => ref.read(googleCalendarProvider.notifier).signIn(),
          child: ListTile(
            leading: const Icon(Icons.calendar_month_outlined),
            title: Text(
              isConnected
                  ? 'Google Calendar conectado'
                  : 'Conectar Google Calendar',
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
            subtitle: email != null ? Text(email) : null,
            trailing: isConnecting
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : isConnected
                ? TextButton(
                    onPressed: () =>
                        ref.read(googleCalendarProvider.notifier).signOut(),
                    style: TextButton.styleFrom(
                      foregroundColor: colorScheme.error,
                    ),
                    child: const Text('Desconectar'),
                  )
                : null,
          ),
        );
      },
    );
  }
}
