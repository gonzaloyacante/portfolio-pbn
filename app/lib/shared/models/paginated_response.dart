import 'package:freezed_annotation/freezed_annotation.dart';

part 'paginated_response.freezed.dart';
part 'paginated_response.g.dart';

// ── PaginatedResponse ─────────────────────────────────────────────────────────

/// Respuesta paginada genérica de la API.
///
/// Forma del JSON:
/// ```json
/// {
///   "data": [...],
///   "pagination": { "page": 1, "limit": 10, "total": 50, "totalPages": 5 }
/// }
/// ```
@Freezed(genericArgumentFactories: true)
abstract class PaginatedResponse<T> with _$PaginatedResponse<T> {
  const factory PaginatedResponse({
    required List<T> data,
    required PaginationMeta pagination,
  }) = _PaginatedResponse<T>;

  factory PaginatedResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Object?) fromJsonT,
  ) => _$PaginatedResponseFromJson(json, fromJsonT);
}

// ── PaginationMeta ────────────────────────────────────────────────────────────

@freezed
abstract class PaginationMeta with _$PaginationMeta {
  const factory PaginationMeta({
    required int page,
    required int limit,
    required int total,
    required int totalPages,
    @Default(false) bool hasNext,
    @Default(false) bool hasPrev,
  }) = _PaginationMeta;

  factory PaginationMeta.fromJson(Map<String, dynamic> json) =>
      _$PaginationMetaFromJson(json);
}

// ── PaginationParams ──────────────────────────────────────────────────────────

/// Parámetros de paginación para requests.
class PaginationParams {
  const PaginationParams({this.page = 1, this.limit = 10});

  final int page;
  final int limit;

  Map<String, String> toQueryParams() => {'page': '$page', 'limit': '$limit'};
}
