import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

import '../../data/dashboard_repository.dart';
import '../../../../core/theme/app_colors.dart';

/// Gráfica de reservas mensuales (BarChart), extraída para mantener `dashboard_page.dart` limpio.
class BookingsBarChart extends StatelessWidget {
  const BookingsBarChart({super.key, required this.data});

  final List<ChartDataPoint> data;

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
            color: AppColors.darkPrimary,
            width: 18,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(6)),
          ),
        ],
      );
    }).toList();

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: scheme.outlineVariant.withValues(alpha: 0.28)),
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(12, 16, 16, 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Reservas mensuales (6 meses)',
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
          reservedSize: 34,
          getTitlesWidget: (value, _) =>
              Text(value.toInt().toString(), style: textStyle),
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
