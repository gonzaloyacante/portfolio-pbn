import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../../core/theme/app_breakpoints.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../shared/widgets/error_state.dart';
import '../../../../shared/widgets/shimmer_loader.dart';
import '../../providers/dashboard_provider.dart';
import 'bookings_bar_chart.dart';
import 'page_views_chart.dart';

/// Sección de gráficos de tendencias del dashboard.
///
/// Muestra:
/// - Visitas diarias de los últimos 7 días (LineChart).
/// - Reservas mensuales de los últimos 6 meses (BarChart).
/// En pantallas expanded (≥840px), los gráficos se muestran lado a lado.
class DashboardChartsSection extends ConsumerWidget {
  const DashboardChartsSection({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final chartsAsync = ref.watch(dashboardChartsProvider);
    final isExpanded = AppBreakpoints.isExpanded(context);

    return chartsAsync.when(
      loading: () => _buildSkeleton(isExpanded),
      error: (err, st) {
        Sentry.captureException(err, stackTrace: st);
        return ErrorState(
          message: 'No se pudieron cargar los gráficos',
          onRetry: () => ref.invalidate(dashboardChartsProvider),
        );
      },
      data: (charts) {
        final pageViewsChart = PageViewsChart(data: charts.dailyPageViews);
        final bookingsChart = BookingsBarChart(data: charts.monthlyBookings);

        if (isExpanded) {
          return IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Expanded(child: pageViewsChart),
                const SizedBox(width: AppSpacing.base),
                Expanded(child: bookingsChart),
              ],
            ),
          );
        }

        return Column(
          children: [
            pageViewsChart,
            const SizedBox(height: AppSpacing.base),
            bookingsChart,
          ],
        );
      },
    );
  }

  Widget _buildSkeleton(bool isExpanded) {
    if (isExpanded) {
      return const Row(
        children: [
          Expanded(
            child: ShimmerBox(
              width: double.infinity,
              height: 180,
              borderRadius: 16,
            ),
          ),
          SizedBox(width: AppSpacing.base),
          Expanded(
            child: ShimmerBox(
              width: double.infinity,
              height: 180,
              borderRadius: 16,
            ),
          ),
        ],
      );
    }
    return const Column(
      children: [
        ShimmerBox(width: double.infinity, height: 180, borderRadius: 16),
        SizedBox(height: AppSpacing.base),
        ShimmerBox(width: double.infinity, height: 180, borderRadius: 16),
      ],
    );
  }
}
