import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

import '../../data/dashboard_repository.dart';

/// Gráfica de visitas diarias (LineChart), extraída para mantener `dashboard_page.dart` limpio.
class PageViewsChart extends StatelessWidget {
  const PageViewsChart({super.key, required this.data});

  final List<ChartDataPoint> data;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final textStyle = Theme.of(context).textTheme.labelSmall?.copyWith(color: scheme.outline, fontSize: 10);

    final spots = data.asMap().entries.map((e) {
      return FlSpot(e.key.toDouble(), e.value.count.toDouble());
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
              'Visitas diarias (7 días)',
              style: Theme.of(context).textTheme.labelMedium?.copyWith(fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 170,
              child: LineChart(
                LineChartData(
                  lineTouchData: LineTouchData(
                    handleBuiltInTouches: true,
                    touchTooltipData: LineTouchTooltipData(
                      getTooltipColor: (_) => scheme.inverseSurface.withValues(alpha: 0.94),
                      getTooltipItems: (spots) => spots
                          .map(
                            (s) => LineTooltipItem(
                              '${s.y.toInt()} visitas',
                              TextStyle(color: scheme.onInverseSurface, fontSize: 12, fontWeight: FontWeight.w600),
                            ),
                          )
                          .toList(),
                    ),
                  ),
                  lineBarsData: [
                    LineChartBarData(
                      spots: spots.isEmpty ? [const FlSpot(0, 0)] : spots,
                      isCurved: true,
                      curveSmoothness: 0.35,
                      color: scheme.primary,
                      barWidth: 3,
                      dotData: FlDotData(
                        show: true,
                        getDotPainter: (spot, percent, bar, index) => FlDotCirclePainter(
                          radius: 3.5,
                          color: scheme.primary,
                          strokeWidth: 1.6,
                          strokeColor: Colors.white,
                        ),
                      ),
                      belowBarData: BarAreaData(
                        show: true,
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [scheme.primary.withValues(alpha: 0.18), scheme.primary.withValues(alpha: 0.0)],
                        ),
                      ),
                    ),
                  ],
                  gridData: FlGridData(
                    show: true,
                    drawVerticalLine: false,
                    horizontalInterval: 1,
                    getDrawingHorizontalLine: (_) =>
                        FlLine(color: scheme.outlineVariant.withValues(alpha: 0.28), strokeWidth: 1),
                  ),
                  borderData: FlBorderData(show: false),
                  titlesData: _buildLineTitles(data, textStyle),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  FlTitlesData _buildLineTitles(List<ChartDataPoint> data, TextStyle? textStyle) {
    return FlTitlesData(
      topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
      rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
      leftTitles: AxisTitles(
        sideTitles: SideTitles(
          showTitles: true,
          reservedSize: 34,
          getTitlesWidget: (value, _) => Text(value.toInt().toString(), style: textStyle),
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
