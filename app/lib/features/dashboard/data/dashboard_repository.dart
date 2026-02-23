import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../core/api/api_client.dart';
import '../../../core/api/endpoints.dart';
import '../../../shared/models/api_response.dart';

part 'dashboard_repository.freezed.dart';
part 'dashboard_repository.g.dart';

// ── DashboardStats ────────────────────────────────────────────────────────────

/// Métricas globales del panel de administración.
@freezed
class DashboardStats with _$DashboardStats {
  const factory DashboardStats({
    @Default(0) int totalProjects,
    @Default(0) int totalCategories,
    @Default(0) int totalServices,
    @Default(0) int totalTestimonials,
    @Default(0) int newContacts,
    @Default(0) int pendingBookings,
    @Default(0) int pageViews30d,
  }) = _DashboardStats;

  factory DashboardStats.fromJson(Map<String, dynamic> json) =>
      _$DashboardStatsFromJson(json);
}

// ── ChartDataPoint ─────────────────────────────────────────────────────────────

/// Punto de datos para un gráfico (etiqueta + valor).
@freezed
class ChartDataPoint with _$ChartDataPoint {
  const factory ChartDataPoint({required String label, required int count}) =
      _ChartDataPoint;

  factory ChartDataPoint.fromJson(Map<String, dynamic> json) =>
      _$ChartDataPointFromJson(json);
}

// ── DashboardCharts ────────────────────────────────────────────────────────────

/// Datos de tendencias para los gráficos del dashboard.
@freezed
class DashboardCharts with _$DashboardCharts {
  const factory DashboardCharts({
    @Default([]) List<ChartDataPoint> dailyPageViews,
    @Default([]) List<ChartDataPoint> monthlyBookings,
  }) = _DashboardCharts;

  factory DashboardCharts.fromJson(Map<String, dynamic> json) =>
      _$DashboardChartsFromJson(json);
}

// ── DashboardRepository ────────────────────────────────────────────────────────

/// Accede a los endpoints de analytics del panel de administración.
class DashboardRepository {
  const DashboardRepository(this._client);

  final ApiClient _client;

  /// Obtiene el resumen de métricas del panel.
  Future<DashboardStats> getOverview() async {
    final resp = await _client.get(Endpoints.analyticsOverview);
    final apiResponse = ApiResponse<DashboardStats>.fromJson(
      resp.data as Map<String, dynamic>,
      (json) => DashboardStats.fromJson(json as Map<String, dynamic>),
    );
    if (!apiResponse.success || apiResponse.data == null) {
      throw Exception(apiResponse.error ?? 'Error al obtener métricas');
    }
    return apiResponse.data!;
  }

  /// Obtiene los datos de tendencias para los gráficos del dashboard.
  Future<DashboardCharts> getCharts() async {
    final resp = await _client.get(Endpoints.analyticsCharts);
    final apiResponse = ApiResponse<DashboardCharts>.fromJson(
      resp.data as Map<String, dynamic>,
      (json) => DashboardCharts.fromJson(json as Map<String, dynamic>),
    );
    if (!apiResponse.success || apiResponse.data == null) {
      throw Exception(apiResponse.error ?? 'Error al obtener gráficos');
    }
    return apiResponse.data!;
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

@riverpod
DashboardRepository dashboardRepository(Ref ref) {
  return DashboardRepository(ref.watch(apiClientProvider));
}
