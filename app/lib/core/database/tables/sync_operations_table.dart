import 'package:drift/drift.dart';

// ── SyncOperationsTable ───────────────────────────────────────────────────────

/// Tabla de operaciones pendientes de sincronización con el servidor.
///
/// Cuando la app está offline y el usuario realiza una acción (ej: crear
/// un proyecto), la operación se guarda aquí. Al recuperar la conexión,
/// [SyncManager] procesa la cola en orden FIFO.
class SyncOperationsTable extends Table {
  @override
  String get tableName => 'sync_operations';

  /// Identificador único de la operación (UUID v4).
  TextColumn get id => text()();

  /// Tipo de operación: create | update | delete | upload.
  TextColumn get operation => text()();

  /// Recurso afectado: projects | categories | services | testimonials | etc.
  TextColumn get resource => text()();

  /// ID del recurso en el servidor (null para creaciones).
  TextColumn get resourceId => text().nullable()();

  /// Payload de la operación serializado como JSON.
  TextColumn get payload => text()();

  /// Número de intentos fallidos de sincronización.
  IntColumn get attempts => integer().withDefault(const Constant(0))();

  /// Si la operación fue marcada permanentemente como fallida.
  BoolColumn get failed => boolean().withDefault(const Constant(false))();

  /// Timestamp de creación (para ordenar FIFO).
  DateTimeColumn get createdAt => dateTime()();

  /// Timestamp del último intento de sincronización.
  DateTimeColumn get lastAttemptAt => dateTime().nullable()();

  @override
  Set<Column<Object>> get primaryKey => {id};
}
