import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../data/dashboard_repository.dart';
import '../../../../core/theme/app_radius.dart';

/// Gráfica de visitas diarias (LineChart), extraída para mantener `dashboard_page.dart` limpio.
class PageViewsChart extends StatelessWidget {
  const PageViewsChart({super.key, required this.data});

  final List<ChartDataPoint> data;

  /// Calcula un intervalo "bonito" para el eje Y en función del valor máximo.
  double _niceInterval(double maxVal) {
    if (maxVal <= 0) return 1;
    if (maxVal <= 5) return 1;
    if (maxVal <= 20) return 5;
    if (maxVal <= 50) return 10;
    if (maxVal <= 100) return 25;
    if (maxVal <= 500) return 50;
    if (maxVal <= 1000) return 100;
    if (maxVal <= 5000) return 500;
    return 1000;
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final textStyle = Theme.of(
      context,
    ).textTheme.labelSmall?.copyWith(color: scheme.outline, fontSize: 10);

    final spots = data.asMap().entries.map((e) {
      return FlSpot(e.key.toDouble(), e.value.count.toDouble());
    }).toList();

    final maxCount = data.fold<double>(
      0,
      (prev, e) => e.count > prev ? e.count.toDouble() : prev,
    );
    final interval = _niceInterval(maxCount);

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
              'Visitas diarias (${data.length} días)',
              style: Theme.of(
                context,
              ).textTheme.labelMedium?.copyWith(fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 170,
              child: LineChart(
                LineChartData(
                  lineTouchData: LineTouchData(
                    handleBuiltInTouches: true,
                    touchTooltipData: LineTouchTooltipData(
                      getTooltipColor: (_) =>
                          scheme.inverseSurface.withValues(alpha: 0.94),
                      getTooltipItems: (spots) => spots
                          .map(
                            (s) => LineTooltipItem(
                              '${s.y.toInt()} visitas',
                              TextStyle(
                                color: scheme.onInverseSurface,
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                              ),
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
                        getDotPainter: (spot, percent, bar, index) =>
                            FlDotCirclePainter(
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
                          colors: [
                            scheme.primary.withValues(alpha: 0.18),
                            scheme.primary.withValues(alpha: 0.0),
                          ],
                        ),
                      ),
                    ),
                  ],
                  gridData: FlGridData(
                    show: true,
                    drawVerticalLine: false,
                    horizontalInterval: interval,
                    getDrawingHorizontalLine: (_) => FlLine(
                      color: scheme.outlineVariant.withValues(alpha: 0.28),
                      strokeWidth: 1,
                    ),
                  ),
                  borderData: FlBorderData(show: false),
                  titlesData: _buildLineTitles(data, textStyle, interval),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  FlTitlesData _buildLineTitles(
    List<ChartDataPoint> data,
    TextStyle? textStyle,
    double interval,
  ) {
    return FlTitlesData(
      topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
      rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
      leftTitles: AxisTitles(
        sideTitles: SideTitles(
          showTitles: true,
          reservedSize: 38,
          interval: interval,
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
