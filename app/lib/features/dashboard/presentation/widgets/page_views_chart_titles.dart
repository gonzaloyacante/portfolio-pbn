import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

import '../../data/dashboard_repository.dart';

/// Configura los ejes de la gráfica de visitas diarias.
FlTitlesData buildPageViewsLineTitles(
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
