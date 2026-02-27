import 'dart:io';

import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'tables/cache_table.dart';
import 'tables/sync_operations_table.dart';

part 'app_database.g.dart';

// ── AppDatabase ───────────────────────────────────────────────────────────────

/// Base de datos SQLite local usando Drift.
///
/// Tablas incluidas:
/// - [SyncOperationsTable]: cola de operaciones offline pendientes de sincronizar.
/// - [CacheTable]: caché genérica key/value con TTL para reducir llamadas API.
@DriftDatabase(tables: [SyncOperationsTable, CacheTable])
class AppDatabase extends _$AppDatabase {
  AppDatabase([QueryExecutor? executor]) : super(executor ?? _openConnection());

  @override
  int get schemaVersion => 2;

  @override
  MigrationStrategy get migration => MigrationStrategy(
    onCreate: (m) => m.createAll(),
    onUpgrade: (m, from, to) async {
      if (from < 2) {
        // v2: añade tabla de caché genérica
        await m.createTable(cacheTable);
      }
    },
  );
}

// ── Connection ────────────────────────────────────────────────────────────────

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(p.join(dbFolder.path, 'portfolio_pbn.db'));
    return NativeDatabase.createInBackground(file);
  });
}

// ── Provider ──────────────────────────────────────────────────────────────────

@Riverpod(keepAlive: true)
AppDatabase appDatabase(Ref ref) {
  final db = AppDatabase();
  ref.onDispose(db.close);
  return db;
}
