import 'package:drift/drift.dart';
import 'package:drift_flutter/drift_flutter.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'app_database.g.dart';

// ═══════════════════════════════════════════════════════════════
// TABLES
// ═══════════════════════════════════════════════════════════════

/// Generic JSON cache for any list entity.
/// [id] is the server-side UUID. [dataJson] holds the serialized model.
/// [isDirty] marks rows with local changes pending outbox flush.
class ContactsCache extends Table {
  TextColumn get id => text()();
  TextColumn get dataJson => text()();
  TextColumn get status => text().withDefault(const Constant('NEW'))();
  TextColumn get priority => text().withDefault(const Constant('MEDIUM'))();
  BoolColumn get isRead => boolean().withDefault(const Constant(false))();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();
  DateTimeColumn get syncedAt => dateTime().nullable()();
  BoolColumn get isDirty => boolean().withDefault(const Constant(false))();

  @override
  Set<Column> get primaryKey => {id};
}

class BookingsCache extends Table {
  TextColumn get id => text()();
  TextColumn get dataJson => text()();
  TextColumn get status => text().withDefault(const Constant('PENDING'))();
  DateTimeColumn get date => dateTime()();
  DateTimeColumn get endDate => dateTime().nullable()();
  TextColumn get clientName => text()();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();
  DateTimeColumn get syncedAt => dateTime().nullable()();
  BoolColumn get isDirty => boolean().withDefault(const Constant(false))();

  @override
  Set<Column> get primaryKey => {id};
}

class CategoriesCache extends Table {
  TextColumn get id => text()();
  TextColumn get dataJson => text()();
  BoolColumn get isActive => boolean().withDefault(const Constant(true))();
  IntColumn get sortOrder => integer().withDefault(const Constant(0))();
  DateTimeColumn get syncedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

class ServicesCache extends Table {
  TextColumn get id => text()();
  TextColumn get dataJson => text()();
  BoolColumn get isActive => boolean().withDefault(const Constant(true))();
  IntColumn get sortOrder => integer().withDefault(const Constant(0))();
  DateTimeColumn get syncedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

class TestimonialsCache extends Table {
  TextColumn get id => text()();
  TextColumn get dataJson => text()();
  BoolColumn get isActive => boolean().withDefault(const Constant(true))();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get syncedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

/// Pending mutations waiting to be flushed to the server.
class OutboxQueue extends Table {
  @override
  String get tableName => 'outbox_queue';

  IntColumn get id => integer().autoIncrement()();
  TextColumn get operationId => text().unique()();
  TextColumn get method => text()(); // PATCH | POST | DELETE
  TextColumn get endpoint => text()();
  TextColumn get bodyJson => text().withDefault(const Constant('{}'))();
  IntColumn get retryCount => integer().withDefault(const Constant(0))();
  IntColumn get maxRetries => integer().withDefault(const Constant(3))();
  // pending | failed (permanent failures are kept for observability)
  TextColumn get status => text().withDefault(const Constant('pending'))();
  TextColumn get lastError => text().nullable()();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get lastAttemptAt => dateTime().nullable()();
}

/// Tracks last successful sync per entity type so we can skip unnecessary polls.
class SyncMetadata extends Table {
  TextColumn get entity => text()();
  DateTimeColumn get lastSyncAt => dateTime()();
  IntColumn get totalCount => integer().withDefault(const Constant(0))();

  @override
  Set<Column> get primaryKey => {entity};
}

// ═══════════════════════════════════════════════════════════════
// DAOs
// ═══════════════════════════════════════════════════════════════

@DriftAccessor(tables: [ContactsCache])
class ContactsDao extends DatabaseAccessor<AppDatabase>
    with _$ContactsDaoMixin {
  ContactsDao(super.db);

  Future<List<ContactsCacheData>> getAll() => (select(
    contactsCache,
  )..orderBy([(t) => OrderingTerm.desc(t.createdAt)])).get();

  Stream<List<ContactsCacheData>> watchAll({String? status}) {
    final query = select(contactsCache)
      ..orderBy([(t) => OrderingTerm.desc(t.createdAt)]);
    if (status != null) query.where((t) => t.status.equals(status));
    return query.watch();
  }

  Future<bool> hasData() async {
    final count = await (selectOnly(
      contactsCache,
    )..addColumns([contactsCache.id])).get();
    return count.isNotEmpty;
  }

  Future<void> upsertMany(List<ContactsCacheCompanion> rows) =>
      batch((b) => b.insertAllOnConflictUpdate(contactsCache, rows));

  Future<void> markDirty(String id, String dataJson) =>
      (update(contactsCache)..where((t) => t.id.equals(id))).write(
        ContactsCacheCompanion(
          dataJson: Value(dataJson),
          isDirty: const Value(true),
          updatedAt: Value(DateTime.now()),
        ),
      );

  Future<void> clearAll() => delete(contactsCache).go();
}

@DriftAccessor(tables: [BookingsCache])
class BookingsDao extends DatabaseAccessor<AppDatabase>
    with _$BookingsDaoMixin {
  BookingsDao(super.db);

  Future<List<BookingsCacheData>> getAll() => (select(
    bookingsCache,
  )..orderBy([(t) => OrderingTerm.desc(t.date)])).get();

  Stream<List<BookingsCacheData>> watchAll({String? status}) {
    final query = select(bookingsCache)
      ..orderBy([(t) => OrderingTerm.desc(t.date)]);
    if (status != null) query.where((t) => t.status.equals(status));
    return query.watch();
  }

  Future<bool> hasData() async {
    final count = await (selectOnly(
      bookingsCache,
    )..addColumns([bookingsCache.id])).get();
    return count.isNotEmpty;
  }

  Future<void> upsertMany(List<BookingsCacheCompanion> rows) =>
      batch((b) => b.insertAllOnConflictUpdate(bookingsCache, rows));

  Future<void> markDirty(String id, String dataJson) =>
      (update(bookingsCache)..where((t) => t.id.equals(id))).write(
        BookingsCacheCompanion(
          dataJson: Value(dataJson),
          isDirty: const Value(true),
          updatedAt: Value(DateTime.now()),
        ),
      );

  Future<void> clearAll() => delete(bookingsCache).go();
}

@DriftAccessor(tables: [CategoriesCache])
class CategoriesDao extends DatabaseAccessor<AppDatabase>
    with _$CategoriesDaoMixin {
  CategoriesDao(super.db);

  Future<List<CategoriesCacheData>> getAll() => (select(
    categoriesCache,
  )..orderBy([(t) => OrderingTerm.asc(t.sortOrder)])).get();

  Future<bool> hasData() async {
    final count = await (selectOnly(
      categoriesCache,
    )..addColumns([categoriesCache.id])).get();
    return count.isNotEmpty;
  }

  Future<void> upsertMany(List<CategoriesCacheCompanion> rows) =>
      batch((b) => b.insertAllOnConflictUpdate(categoriesCache, rows));

  Future<void> clearAll() => delete(categoriesCache).go();
}

@DriftAccessor(tables: [ServicesCache])
class ServicesDao extends DatabaseAccessor<AppDatabase>
    with _$ServicesDaoMixin {
  ServicesDao(super.db);

  Future<List<ServicesCacheData>> getAll() => (select(
    servicesCache,
  )..orderBy([(t) => OrderingTerm.asc(t.sortOrder)])).get();

  Future<bool> hasData() async {
    final count = await (selectOnly(
      servicesCache,
    )..addColumns([servicesCache.id])).get();
    return count.isNotEmpty;
  }

  Future<void> upsertMany(List<ServicesCacheCompanion> rows) =>
      batch((b) => b.insertAllOnConflictUpdate(servicesCache, rows));

  Future<void> clearAll() => delete(servicesCache).go();
}

@DriftAccessor(tables: [TestimonialsCache])
class TestimonialsDao extends DatabaseAccessor<AppDatabase>
    with _$TestimonialsDaoMixin {
  TestimonialsDao(super.db);

  Future<List<TestimonialsCacheData>> getAll() => (select(
    testimonialsCache,
  )..orderBy([(t) => OrderingTerm.desc(t.createdAt)])).get();

  Future<bool> hasData() async {
    final count = await (selectOnly(
      testimonialsCache,
    )..addColumns([testimonialsCache.id])).get();
    return count.isNotEmpty;
  }

  Future<void> upsertMany(List<TestimonialsCacheCompanion> rows) =>
      batch((b) => b.insertAllOnConflictUpdate(testimonialsCache, rows));

  Future<void> clearAll() => delete(testimonialsCache).go();
}

@DriftAccessor(tables: [OutboxQueue])
class OutboxDao extends DatabaseAccessor<AppDatabase> with _$OutboxDaoMixin {
  OutboxDao(super.db);

  Future<List<OutboxQueueData>> getPending() =>
      (select(outboxQueue)
            ..where((t) => t.status.equals('pending'))
            ..orderBy([(t) => OrderingTerm.asc(t.createdAt)]))
          .get();

  Future<int> enqueue(OutboxQueueCompanion entry) =>
      into(outboxQueue).insert(entry);

  Future<void> removeById(int id) =>
      (delete(outboxQueue)..where((t) => t.id.equals(id))).go();

  Future<void> incrementRetryOrFail(int id, String error) async {
    final row = await (select(
      outboxQueue,
    )..where((t) => t.id.equals(id))).getSingleOrNull();
    if (row == null) return;
    final newCount = row.retryCount + 1;
    final newStatus = newCount >= row.maxRetries ? 'failed' : 'pending';
    await (update(outboxQueue)..where((t) => t.id.equals(id))).write(
      OutboxQueueCompanion(
        retryCount: Value(newCount),
        status: Value(newStatus),
        lastError: Value(error),
        lastAttemptAt: Value(DateTime.now()),
      ),
    );
  }
}

@DriftAccessor(tables: [SyncMetadata])
class SyncMetadataDao extends DatabaseAccessor<AppDatabase>
    with _$SyncMetadataDaoMixin {
  SyncMetadataDao(super.db);

  Future<SyncMetadataData?> getFor(String entity) => (select(
    syncMetadata,
  )..where((t) => t.entity.equals(entity))).getSingleOrNull();

  Future<void> upsert(String entity, DateTime at, {int count = 0}) =>
      into(syncMetadata).insertOnConflictUpdate(
        SyncMetadataCompanion.insert(
          entity: entity,
          lastSyncAt: at,
          totalCount: Value(count),
        ),
      );
}

// ═══════════════════════════════════════════════════════════════
// DATABASE
// ═══════════════════════════════════════════════════════════════

@DriftDatabase(
  tables: [
    ContactsCache,
    BookingsCache,
    CategoriesCache,
    ServicesCache,
    TestimonialsCache,
    OutboxQueue,
    SyncMetadata,
  ],
  daos: [
    ContactsDao,
    BookingsDao,
    CategoriesDao,
    ServicesDao,
    TestimonialsDao,
    OutboxDao,
    SyncMetadataDao,
  ],
)
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;

  static QueryExecutor _openConnection() {
    return driftDatabase(name: 'pbn_admin_cache');
  }
}

// ── Riverpod Provider ─────────────────────────────────────────────────────────

@Riverpod(keepAlive: true)
AppDatabase appDatabase(Ref ref) {
  final db = AppDatabase();
  ref.onDispose(db.close);
  return db;
}
