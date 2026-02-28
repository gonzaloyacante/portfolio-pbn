import 'package:package_info_plus/package_info_plus.dart';

// ── AppRelease ─────────────────────────────────────────────────────────────────

/// Información de una release de la app publicada en el backend.
///
/// Equivale al modelo Prisma `AppRelease` del backend.
/// Se usa para mostrar el diálogo de actualización in-app.
class AppRelease {
  const AppRelease({
    required this.version,
    required this.versionCode,
    required this.releaseNotes,
    required this.downloadUrl,
    this.checksumSha256,
    this.mandatory = false,
    this.minVersion,
    this.fileSizeBytes,
    required this.publishedAt,
  });

  /// Versión semver: ej. "1.2.0"
  final String version;

  /// Build number (versionCode Android): ej. 3
  final int versionCode;

  /// Notas de la versión (texto plano con saltos de línea)
  final String releaseNotes;

  /// URL HTTPS del APK (debe ser pública y descargar sin auth)
  final String downloadUrl;

  /// SHA-256 del APK en hexadecimal minúsculas (para verificar integridad)
  final String? checksumSha256;

  /// Si true → el diálogo no puede cerrarse sin actualizar
  final bool mandatory;

  /// Versión mínima soportada — si la instalada es menor → force update
  final String? minVersion;

  /// Tamaño del APK en bytes (para mostrar en la UI)
  final int? fileSizeBytes;

  /// Fecha de publicación de la release
  final DateTime publishedAt;

  // ── fromJson ─────────────────────────────────────────────────────────────

  factory AppRelease.fromJson(Map<String, dynamic> json) {
    return AppRelease(
      version: json['version'] as String,
      versionCode: (json['versionCode'] as num).toInt(),
      releaseNotes: json['releaseNotes'] as String? ?? '',
      downloadUrl: json['downloadUrl'] as String,
      checksumSha256: json['checksumSha256'] as String?,
      mandatory: json['mandatory'] as bool? ?? false,
      minVersion: json['minVersion'] as String?,
      fileSizeBytes: json['fileSizeBytes'] != null ? (json['fileSizeBytes'] as num).toInt() : null,
      publishedAt: DateTime.tryParse(json['publishedAt'] as String? ?? '') ?? DateTime.now(),
    );
  }

  // ── fromFcmData ──────────────────────────────────────────────────────────

  /// Construye desde el campo `data` de un mensaje FCM (todos strings).
  factory AppRelease.fromFcmData(Map<String, String> data) {
    return AppRelease(
      version: data['version'] ?? '',
      versionCode: int.tryParse(data['versionCode'] ?? '0') ?? 0,
      releaseNotes: data['releaseNotes'] ?? '',
      downloadUrl: data['downloadUrl'] ?? '',
      checksumSha256: data['checksumSha256']?.isEmpty ?? true ? null : data['checksumSha256'],
      mandatory: data['mandatory'] == 'true',
      minVersion: data['minVersion']?.isEmpty ?? true ? null : data['minVersion'],
      fileSizeBytes: int.tryParse(data['fileSizeBytes'] ?? ''),
      publishedAt: DateTime.now(),
    );
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  /// Tamaño formateado para mostrar en UI (ej. "28.1 MB")
  String? get fileSizeFormatted {
    final bytes = fileSizeBytes;
    if (bytes == null) return null;
    if (bytes < 1024) return '$bytes B';
    if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(1)} KB';
    return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
  }

  @override
  String toString() => 'AppRelease(v$version, build $versionCode)';
}

// ── AppUpdateStatus ────────────────────────────────────────────────────────────

/// Resultado de la comprobación de actualizaciones.
sealed class AppUpdateStatus {
  const AppUpdateStatus();
}

/// La app está al día — no hay actualización disponible.
class AppUpToDate extends AppUpdateStatus {
  const AppUpToDate();
}

/// Hay una actualización disponible (opcional o forzada).
class AppUpdateAvailable extends AppUpdateStatus {
  const AppUpdateAvailable({required this.release, required this.forceUpdate});

  /// Información de la nueva release
  final AppRelease release;

  /// Si true → actualización obligatoria (no se puede cerrar el diálogo)
  final bool forceUpdate;
}

/// No se pudo comprobar (sin conexión, error de servidor, etc.)
/// No interrumpe el flujo de la app.
class AppUpdateCheckFailed extends AppUpdateStatus {
  const AppUpdateCheckFailed({required this.reason});
  final String reason;
}

// ── Version helpers ────────────────────────────────────────────────────────────

/// Compara dos versiones semver.
/// Retorna  1 si a > b, -1 si a < b, 0 si iguales.
int compareSemver(String a, String b) {
  // Extrae solo los segmentos numéricos (ej. "1.2.3-beta" → [1, 2, 3])
  List<int> parse(String v) => v
      .split('.')
      .map((s) {
        // Conservar únicamente los dígitos del segmento (ignora sufijos como
        // '-beta', '-rc1', '+build.1', etc.)
        final digits = s.codeUnits
            .where((c) => c >= 48 && c <= 57) // '0'..'9'
            .map(String.fromCharCode)
            .join();
        return int.tryParse(digits);
      })
      .whereType<int>()
      .toList();

  final pa = parse(a);
  final pb = parse(b);
  final len = pa.length > pb.length ? pa.length : pb.length;

  for (var i = 0; i < len; i++) {
    final diff = (i < pa.length ? pa[i] : 0) - (i < pb.length ? pb[i] : 0);
    if (diff != 0) return diff > 0 ? 1 : -1;
  }
  return 0;
}

/// Devuelve la info de versión instalada actualmente.
/// Retorna ('0.0.0', 0) si falla.
Future<(String, int)> getInstalledVersion() async {
  try {
    final info = await PackageInfo.fromPlatform();
    final code = int.tryParse(info.buildNumber) ?? 0;
    return (info.version, code);
  } catch (_) {
    return ('0.0.0', 0);
  }
}
