import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../data/dashboard_repository.dart';
import '../../../../core/theme/app_radius.dart';

/// Gráfica de reservas mensuales (BarChart), extraída para mantener `dashboard_page.dart` limpio.
class BookingsBarChart extends StatelessWidget {
  const BookingsBarChart({super.key, required this.data});

  final List<ChartDataPoint> data;

  /// Calcula un intervalo "bonito" para el eje Y.
  double _niceInterval(double maxVal) {
    if (maxVal <= 0) return 1;
    if (maxVal <= 5) return 1;
    if (maxVal <= 20) return 5;
    if (maxVal <= 50) return 10;
    if (maxVal <= 100) return 25;
    if (maxVal <= 500) return 50;
    return 100;
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final textStyle = Theme.of(
      context,
    ).textTheme.labelSmall?.copyWith(color: scheme.outline, fontSize: 10);

    final barGroups = data.asMap().entries.map((e) {
      return BarChartGroupData(
        x: e.key,
        barRods: [
          BarChartRodData(
            toY: e.value.count.toDouble(),
            color: scheme.primary,
            width: 18,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(6)),
          ),
        ],
      );
    }).toList();

    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: AppRadius.forTile,
        border: Border.all(
          color: scheme.outlineVariant.withValues(alpha: 0.28),
        ),
      ),
      child: AppCard(
        elevation: 0,
        borderRadius: AppRadius.forTile,
        padding: const EdgeInsets.fromLTRB(12, 16, 16, 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Reservas mensuales (${data.length} meses)',
              style: Theme.of(
                context,
              ).textTheme.labelMedium?.copyWith(fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 170,
              child: BarChart(
                BarChartData(
                  barTouchData: BarTouchData(
                    handleBuiltInTouches: true,
                    touchTooltipData: BarTouchTooltipData(
                      getTooltipColor: (_) =>
                          scheme.inverseSurface.withValues(alpha: 0.94),
                      getTooltipItem: (group, groupIndex, rod, rodIndex) =>
                          BarTooltipItem(
                            '${rod.toY.toInt()} reservas',
                            TextStyle(
                              color: scheme.onInverseSurface,
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                    ),
                  ),
                  barGroups: barGroups,
                  borderData: FlBorderData(show: false),
                  gridData: FlGridData(
                    show: true,
                    drawVerticalLine: false,
                    horizontalInterval: _niceInterval(
                      data.fold<double>(
                        0,
                        (prev, e) => e.count > prev ? e.count.toDouble() : prev,
                      ),
                    ),
                    getDrawingHorizontalLine: (_) => FlLine(
                      color: scheme.outlineVariant.withValues(alpha: 0.28),
                      strokeWidth: 1,
                    ),
                  ),
                  titlesData: _buildBarTitles(data, textStyle),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  FlTitlesData _buildBarTitles(
    List<ChartDataPoint> data,
    TextStyle? textStyle,
  ) {
    return FlTitlesData(
      topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
      rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
      leftTitles: AxisTitles(
        sideTitles: SideTitles(
          showTitles: true,
          reservedSize: 38,
          interval: _niceInterval(
            data.fold<double>(
              0,
              (prev, e) => e.count > prev ? e.count.toDouble() : prev,
            ),
          ),
          getTitlesWidget: (value, _) {
            if (value == value.roundToDouble()) {
              return Text(value.toInt().toString(), style: textStyle);
            }
            return const SizedBox.shrink();
          },
        ),
      ),
      bottomTitles: AxisTitles(
        sideTitles: SideTitles(
          showTitles: true,
          interval: 1,
          reservedSize: 28,
          getTitlesWidget: (value, _) {
            final idx = value.toInt();
            if (idx < 0 || idx >= data.length) return const SizedBox.shrink();
            return Padding(
              padding: const EdgeInsets.only(top: 6),
              child: Text(data[idx].label, style: textStyle),
            );
          },
        ),
      ),
    );
  }
}
