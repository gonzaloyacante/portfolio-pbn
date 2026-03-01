import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../core/api/api_client.dart';
import '../../../core/api/endpoints.dart';
import '../../../shared/models/api_response.dart';

part 'dashboard_repository.freezed.dart';
part 'dashboard_repository.g.dart';

// ── LocationStat ──────────────────────────────────────────────────────────────

/// Ubicación geográfica con conteo de visitas (para mapa y top países).
@freezed
abstract class LocationStat with _$LocationStat {
  const factory LocationStat({
    required String label,
    required int count,
    double? latitude,
    double? longitude,
  }) = _LocationStat;

  factory LocationStat.fromJson(Map<String, dynamic> json) =>
      _$LocationStatFromJson(json);
}

// ── DashboardStats ────────────────────────────────────────────────────────────

/// Métricas globales del panel de administración.
@freezed
abstract class DashboardStats with _$DashboardStats {
  const factory DashboardStats({
    @Default(0) int totalProjects,
    @Default(0) int totalCategories,
    @Default(0) int totalServices,
    @Default(0) int totalTestimonials,
    @Default(0) int newContacts,
    @Default(0) int pendingBookings,
    @Default(0) int pendingTestimonials,
    @Default(0) int trashCount,
    @Default(0) int pageViews30d,

    /// Visitantes únicos (sesiones distintas, sin contar cada página que navegan).
    @Default(0) int uniqueVisitors30d,

    /// Visitas por tipo de dispositivo: { "mobile": N, "desktop": N, "tablet": N, "unknown": N }
    @Default({}) Map<String, int> deviceUsage,

    /// Top países/ciudades por visitas (últimos 30 días).
    @Default([]) List<LocationStat> topLocations,

    /// Top proyectos más vistos (últimos 30 días).
    @Default([]) List<ChartDataPoint> topProjects,
  }) = _DashboardStats;

  factory DashboardStats.fromJson(Map<String, dynamic> json) =>
      _$DashboardStatsFromJson(json);
}

// ── ChartDataPoint ─────────────────────────────────────────────────────────────

/// Punto de datos para un gráfico (etiqueta + valor).
@freezed
abstract class ChartDataPoint with _$ChartDataPoint {
  const factory ChartDataPoint({required String label, required int count}) =
      _ChartDataPoint;

  factory ChartDataPoint.fromJson(Map<String, dynamic> json) =>
      _$ChartDataPointFromJson(json);
}

// ── DashboardCharts ────────────────────────────────────────────────────────────

/// Datos de tendencias para los gráficos del dashboard.
@freezed
abstract class DashboardCharts with _$DashboardCharts {
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
    final resp = await _client.get<Map<String, dynamic>>(
      Endpoints.analyticsOverview,
    );
    final apiResponse = ApiResponse<DashboardStats>.fromJson(
      resp,
      (json) => DashboardStats.fromJson(json as Map<String, dynamic>),
    );
    if (!apiResponse.success || apiResponse.data == null) {
      throw Exception(apiResponse.error ?? 'Error al obtener métricas');
    }
    return apiResponse.data!;
  }

  /// Obtiene los datos de tendencias para los gráficos del dashboard.
  Future<DashboardCharts> getCharts() async {
    final resp = await _client.get<Map<String, dynamic>>(
      Endpoints.analyticsCharts,
    );
    final apiResponse = ApiResponse<DashboardCharts>.fromJson(
      resp,
      (json) => DashboardCharts.fromJson(json as Map<String, dynamic>),
    );
    if (!apiResponse.success || apiResponse.data == null) {
      throw Exception(apiResponse.error ?? 'Error al obtener gráficos');
    }
    return apiResponse.data!;
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

@Riverpod(keepAlive: true)
DashboardRepository dashboardRepository(Ref ref) {
  // Usamos `read` en lugar de `watch` para evitar que la instancia del
  // `DashboardRepository` se re-cree automáticamente cuando cambia el
  // `ApiClient` (por ejemplo, al cargar async el `serverUrlProvider` en debug).
  // Evita re-fetchs duplicados al arranque.
  final client = ref.read(apiClientProvider);
  return DashboardRepository(client);
}
