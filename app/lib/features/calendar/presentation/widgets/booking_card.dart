import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_radius.dart';
import '../../data/booking_model.dart';

class BookingCard extends ConsumerWidget {
  const BookingCard(this.booking, {super.key});

  final BookingItem booking;

  AppStatus _toAppStatus(String s) {
    return switch (s) {
      'CONFIRMED' || 'COMPLETED' => AppStatus.active,
      'CANCELLED' || 'NO_SHOW' => AppStatus.inactive,
      _ => AppStatus.pending,
    };
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final timeStr =
        '${booking.date.hour.toString().padLeft(2, '0')}:'
        '${booking.date.minute.toString().padLeft(2, '0')}';

    return AppCard(
      onTap: () => context.pushNamed(
        RouteNames.bookingDetail,
        pathParameters: {'id': booking.id},
      ),
      borderRadius: AppRadius.forTile,
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
      child: Row(
        children: [
          // ── Time badge ──────────────────────────────────
          Container(
            width: 46,
            height: 46,
            decoration: BoxDecoration(
              color: colorScheme.primary.withValues(alpha: 0.1),
              borderRadius: const BorderRadius.circular(14),
            ),
            alignment: Alignment.center,
            child: Text(
              timeStr,
              style: theme.textTheme.labelSmall?.copyWith(
                color: colorScheme.primary,
                fontWeight: FontWeight.w700,
                fontSize: 12,
              ),
            ),
          ),
          const SizedBox(width: 12),
          // ── Info ────────────────────────────────────────
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        booking.clientName,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: theme.textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    StatusBadge(
                      status: _toAppStatus(booking.status),
                      compact: true,
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                Row(
                  children: [
                    Icon(
                      Icons.spa_outlined,
                      size: 13,
                      color: colorScheme.outline,
                    ),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        booking.service?.name ?? 'Sin servicio',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: colorScheme.outline,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          // ── Chevron ─────────────────────────────────────
          Icon(
            Icons.chevron_right_rounded,
            size: 20,
            color: colorScheme.outline,
          ),
        ],
      ),
    );
  }
}
