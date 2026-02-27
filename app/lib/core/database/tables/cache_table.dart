import 'package:drift/drift.dart';

// ── CacheTable ──────────────────────────────────────────────────────────────

/// Tabla genérica de caché local.
///
/// Cada fila es un par clave/valor JSON con timestamp de caducidad.
/// La clave debe ser única (p.ej. "projects_list", "projects_detail_:id").
class CacheTable extends Table {
  /// Identificador único de la entrada de caché.
  TextColumn get cacheKey => text()();

  /// Contenido serializado como JSON string.
  TextColumn get payload => text()();

  /// Timestamp Unix en segundos de cuando caduca esta entrada.
  IntColumn get expiresAt => integer()();

  /// Timestamp Unix en segundos de la última actualización.
  IntColumn get updatedAt => integer()();

  @override
  Set<Column> get primaryKey => {cacheKey};
}
