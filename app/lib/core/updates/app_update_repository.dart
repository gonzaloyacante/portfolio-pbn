import 'dart:io';

import 'package:crypto/crypto.dart';
import 'package:dio/dio.dart';
import 'package:path_provider/path_provider.dart';

import '../api/endpoints.dart';
import '../config/env_config.dart';
import '../utils/app_logger.dart';
import 'app_release_model.dart';

// ── AppUpdateRepository ────────────────────────────────────────────────────────

/// Repositorio responsable de:
/// 1. Consultar el backend para saber si hay una actualización disponible.
/// 2. Descargar el APK con progreso.
/// 3. Verificar la integridad SHA-256 del APK descargado.
///
/// Nota: La instalación del APK se delega al paquete `open_file`,
/// que gestiona el FileProvider y el intent de instalación de Android.
///
/// Seguridad:
/// - La URL de descarga DEBE ser HTTPS (se valida antes de iniciar).
/// - Si `checksumSha256` está disponible, se verifica SIEMPRE antes de
///   lanzar el instalador. Si no coincide, el archivo se elimina.
/// - El APK se guarda en el directorio externo de la app (accesible por
///   el package manager de Android sin necesidad de acceso amplio a storage).
class AppUpdateRepository {
  AppUpdateRepository({Dio? dio}) : _dio = dio ?? Dio() {
    _dio.options = BaseOptions(connectTimeout: const Duration(seconds: 20), receiveTimeout: const Duration(minutes: 5));
  }

  final Dio _dio;

  // ── checkForUpdate ─────────────────────────────────────────────────────────

  /// Comprueba si hay actualización disponible.
  ///
  /// Pasa la versión instalada como query params para que el backend
  /// calcule directamente `updateAvailable` y `forceUpdate`.
  ///
  /// Retorna [AppUpdateStatus]: [AppUpToDate], [AppUpdateAvailable] o
  /// [AppUpdateCheckFailed] (nunca lanza excepción).
  Future<AppUpdateStatus> checkForUpdate() async {
    // Solo comprobamos en Android (no aplica a iOS: va por App Store)
    if (!Platform.isAndroid) return const AppUpToDate();

    try {
      final (currentVersion, currentCode) = await getInstalledVersion();

      final url =
          '${EnvConfig.apiBaseUrl}${Endpoints.appLatestRelease}'
          '?version=${Uri.encodeQueryComponent(currentVersion)}'
          '&versionCode=$currentCode';

      AppLogger.debug(
        'AppUpdateRepository: consultando $url '
        '(instalada: v$currentVersion build $currentCode)',
      );

      final response = await _dio.get<Map<String, dynamic>>(
        url,
        options: Options(headers: {'Accept': 'application/json'}, receiveTimeout: const Duration(seconds: 15)),
      );

      final body = response.data;
      if (body == null || body['success'] != true) {
        return const AppUpdateCheckFailed(reason: 'Respuesta inesperada del servidor');
      }

      final updateAvailable = body['updateAvailable'] as bool? ?? false;
      if (!updateAvailable) {
        AppLogger.info('AppUpdateRepository: app al día (v$currentVersion)');
        return const AppUpToDate();
      }

      final data = body['data'] as Map<String, dynamic>?;
      if (data == null) {
        return const AppUpdateCheckFailed(reason: 'Datos de release no disponibles');
      }

      final release = AppRelease.fromJson(data);
      final forceUpdate = body['forceUpdate'] as bool? ?? false;

      // Validación extra en cliente: nunca confiar solo en el servidor
      if (release.versionCode <= currentCode) {
        return const AppUpToDate();
      }
      if (!release.downloadUrl.startsWith('https://')) {
        AppLogger.warn('AppUpdateRepository: downloadUrl no es HTTPS — omitiendo update');
        return const AppUpdateCheckFailed(reason: 'URL de descarga no segura');
      }

      AppLogger.info(
        'AppUpdateRepository: actualización disponible '
        'v${release.version} (build ${release.versionCode})'
        '${forceUpdate ? " [FORZADA]" : ""}',
      );

      return AppUpdateAvailable(release: release, forceUpdate: forceUpdate);
    } on DioException catch (e, st) {
      AppLogger.warn(
        'AppUpdateRepository: error de red al comprobar actualización: '
        '${e.type.name} — ${e.message}',
      );
      AppLogger.debug('Stack: $st');
      return AppUpdateCheckFailed(reason: 'Error de red: ${e.type.name}');
    } catch (e, st) {
      AppLogger.warn('AppUpdateRepository: error inesperado: $e');
      AppLogger.debug('Stack: $st');
      return AppUpdateCheckFailed(reason: 'Error: $e');
    }
  }

  // ── downloadApk ───────────────────────────────────────────────────────────

  /// Descarga el APK de [release] con reporte de progreso.
  ///
  /// - [onProgress]: callback `(received, total)` para actualizar la UI.
  ///   Si `total` es -1, el tamaño es desconocido.
  /// - Si tiene [AppRelease.checksumSha256], verifica SHA-256 tras la descarga.
  ///   Si no coincide, elimina el archivo y lanza [AppUpdateException].
  ///
  /// Retorna el [File] descargado, listo para instalar.
  /// Lanza [AppUpdateException] si algo falla.
  Future<File> downloadApk(AppRelease release, {void Function(int received, int total)? onProgress}) async {
    // Verificar URL segura
    if (!release.downloadUrl.startsWith('https://')) {
      throw AppUpdateException('La URL de descarga debe ser HTTPS');
    }

    final savePath = await _apkSavePath(release.version, release.versionCode);
    AppLogger.info('AppUpdateRepository: descargando APK → $savePath');

    try {
      await _dio.download(
        release.downloadUrl,
        savePath,
        onReceiveProgress: (received, total) {
          onProgress?.call(received, total);
          if (total > 0) {
            final pct = (received / total * 100).toStringAsFixed(0);
            AppLogger.debug(
              'AppUpdateRepository: descarga $pct% '
              '($received/$total bytes)',
            );
          }
        },
        options: Options(
          receiveTimeout: const Duration(minutes: 10),
          headers: {'Accept': 'application/vnd.android.package-archive'},
        ),
      );

      final file = File(savePath);
      if (!file.existsSync()) {
        throw AppUpdateException('El archivo descargado no existe en: $savePath');
      }

      final fileSize = file.lengthSync();
      AppLogger.info(
        'AppUpdateRepository: APK descargado '
        '(${(fileSize / 1024 / 1024).toStringAsFixed(1)} MB)',
      );

      // ── Verificar integridad SHA-256 ────────────────────────────────────
      final expectedChecksum = release.checksumSha256;
      if (expectedChecksum != null && expectedChecksum.isNotEmpty) {
        await _verifySha256(file, expectedChecksum);
      } else {
        AppLogger.warn(
          'AppUpdateRepository: no hay checksum SHA-256 — '
          'se omite verificación de integridad',
        );
      }

      return file;
    } on AppUpdateException {
      _tryDelete(savePath);
      rethrow;
    } on DioException catch (e) {
      _tryDelete(savePath);
      throw AppUpdateException('Error de descarga: ${e.type.name} — ${e.message}');
    } catch (e) {
      _tryDelete(savePath);
      throw AppUpdateException('Error inesperado durante la descarga: $e');
    }
  }

  // ── _verifySha256 ─────────────────────────────────────────────────────────

  Future<void> _verifySha256(File file, String expected) async {
    AppLogger.debug('AppUpdateRepository: verificando SHA-256…');
    try {
      final bytes = await file.readAsBytes();
      final digest = sha256.convert(bytes);
      final actual = digest.toString().toLowerCase();
      final normalizedExpected = expected.toLowerCase().trim();

      if (actual != normalizedExpected) {
        AppLogger.error(
          'AppUpdateRepository: SHA-256 NO COINCIDE — '
          'esperado=$normalizedExpected, actual=$actual',
        );
        throw AppUpdateException(
          'Error de integridad: el APK descargado no es válido. '
          'Por favor, inténtalo de nuevo.',
        );
      }
      AppLogger.info('AppUpdateRepository: SHA-256 verificado correctamente ✓');
    } on AppUpdateException {
      rethrow;
    } catch (e) {
      throw AppUpdateException('Error al calcular SHA-256: $e');
    }
  }

  // ── _apkSavePath ──────────────────────────────────────────────────────────

  /// Ruta donde se guarda el APK en el almacenamiento externo de la app.
  ///
  /// Usa el directorio de archivos externos de la app (accesible por el
  /// package manager sin permisos de almacenamiento globales en Android 10+).
  Future<String> _apkSavePath(String version, int versionCode) async {
    try {
      // Android: getExternalStorageDirectory() → /sdcard/Android/data/APP/files
      final dir = Platform.isAndroid ? await getExternalStorageDirectory() : await getApplicationDocumentsDirectory();

      if (dir == null) {
        throw AppUpdateException('No se pudo obtener el directorio de almacenamiento');
      }

      // Subdirectorio para updates
      final updatesDir = Directory('${dir.path}/updates');
      if (!updatesDir.existsSync()) {
        updatesDir.createSync(recursive: true);
      }

      return '${updatesDir.path}/app-${version.replaceAll('.', '_')}-$versionCode.apk';
    } catch (e) {
      if (e is AppUpdateException) rethrow;
      throw AppUpdateException('Error al preparar directorio: $e');
    }
  }

  // ── cleanOldApks ──────────────────────────────────────────────────────────

  /// Elimina APKs cacheados de versiones anteriores para liberar espacio.
  /// Se llama tras una instalación exitosa o al inicio de una nueva descarga.
  Future<void> cleanOldApks() async {
    try {
      final dir = Platform.isAndroid ? await getExternalStorageDirectory() : await getApplicationDocumentsDirectory();
      if (dir == null) return;

      final updatesDir = Directory('${dir.path}/updates');
      if (!updatesDir.existsSync()) return;

      for (final entity in updatesDir.listSync()) {
        if (entity is File && entity.path.endsWith('.apk')) {
          try {
            entity.deleteSync();
            AppLogger.debug('AppUpdateRepository: eliminado APK antiguo: ${entity.path}');
          } catch (_) {}
        }
      }
    } catch (e) {
      AppLogger.warn('AppUpdateRepository: error limpiando APKs: $e');
    }
  }

  // ── helpers ───────────────────────────────────────────────────────────────

  void _tryDelete(String path) {
    try {
      final f = File(path);
      if (f.existsSync()) f.deleteSync();
    } catch (_) {}
  }
}

// ── AppUpdateException ────────────────────────────────────────────────────────

/// Excepción tipada del flujo de actualización in-app.
class AppUpdateException implements Exception {
  AppUpdateException(this.message);
  final String message;

  @override
  String toString() => 'AppUpdateException: $message';
}
