import 'dart:convert';

import 'package:drift/drift.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'app_database.dart';
import 'tables/cache_table.dart';

part 'cache_manager.g.dart';

// ── CacheManager ─────────────────────────────────────────────────────────────

/// Abstracción sobre la [CacheTable] de Drift para get/set/invalidate con TTL.
///
/// Uso típico:
/// ```dart
/// final cache = ref.read(cacheManagerProvider);
/// final json = await cache.get('projects_list');
/// await cache.set('projects_list', payload: jsonEncode(data));
/// await cache.invalidate('projects_list');
/// ```
class CacheManager {
  const CacheManager(this._db);

  final AppDatabase _db;

  /// TTL por defecto: 30 minutos.
  static const Duration defaultTtl = Duration(minutes: 30);

  // ── Lectura ──────────────────────────────────────────────────────────────

  /// Retorna el payload JSON si existe y no ha caducado, sino `null`.
  Future<String?> get(String key) async {
    final now = _nowSeconds();
    final row = await (_db.select(
      _db.cacheTable,
    )..where((t) => t.cacheKey.equals(key) & t.expiresAt.isBiggerThanValue(now))).getSingleOrNull();
    return row?.payload;
  }

  /// Convenience: `get` + `jsonDecode` en un solo paso.
  Future<dynamic> getJson(String key) async {
    final raw = await get(key);
    if (raw == null) return null;
    return jsonDecode(raw);
  }

  // ── Escritura ────────────────────────────────────────────────────────────

  /// Guarda `payload` JSON bajo `key` con TTL opcional.
  Future<void> set(String key, {required String payload, Duration ttl = defaultTtl}) async {
    final now = _nowSeconds();
    await _db
        .into(_db.cacheTable)
        .insertOnConflictUpdate(
          CacheTableCompanion.insert(cacheKey: key, payload: payload, expiresAt: now + ttl.inSeconds, updatedAt: now),
        );
  }

  /// Convenience: serializa `data` con `jsonEncode` y llama a [set].
  Future<void> setJson(String key, {required dynamic data, Duration ttl = defaultTtl}) =>
      set(key, payload: jsonEncode(data), ttl: ttl);

  // ── Invalidación ─────────────────────────────────────────────────────────

  /// Invalida una entrada específica por clave exacta.
  Future<void> invalidate(String key) async {
    await (_db.delete(_db.cacheTable)..where((t) => t.cacheKey.equals(key))).go();
  }

  /// Invalida todas las entradas cuya clave contenga [prefix].
  Future<void> invalidatePrefix(String prefix) async {
    await (_db.delete(_db.cacheTable)..where((t) => t.cacheKey.like('$prefix%'))).go();
  }

  /// Elimina todas las entradas caducadas (limpieza periódica).
  Future<int> purgeExpired() async {
    final now = _nowSeconds();
    return (_db.delete(_db.cacheTable)..where((t) => t.expiresAt.isSmallerOrEqualValue(now))).go();
  }

  /// Vacía toda la caché.
  Future<void> clearAll() => _db.delete(_db.cacheTable).go();

  // ── Helpers ──────────────────────────────────────────────────────────────

  int _nowSeconds() => DateTime.now().millisecondsSinceEpoch ~/ 1000;
}

// ── Provider ─────────────────────────────────────────────────────────────────

@Riverpod(keepAlive: true)
CacheManager cacheManager(Ref ref) {
  final db = ref.watch(appDatabaseProvider);
  return CacheManager(db);
}

// ── Cache keys ───────────────────────────────────────────────────────────────

/// Constantes de claves de caché para evitar strings mágicos.
abstract class CacheKeys {
  static const String projectsList = 'projects_list';
  static const String categoriesList = 'categories_list';
  static const String servicesList = 'services_list';
  static const String testimonialsList = 'testimonials_list';
  static const String socialLinksList = 'social_links_list';
  static const String settingsHome = 'settings_home';
  static const String settingsAbout = 'settings_about';
  static const String settingsContact = 'settings_contact';
  static const String settingsSite = 'settings_site';
  static const String settingsTheme = 'settings_theme';
  static const String dashboardStats = 'dashboard_stats';

  static String projectDetail(String id) => 'projects_detail_$id';
  static String categoryDetail(String id) => 'categories_detail_$id';
  static String serviceDetail(String id) => 'services_detail_$id';
}
