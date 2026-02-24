import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:package_info_plus/package_info_plus.dart';

import '../config/env_config.dart';

// ── Modelo de info del build ──────────────────────────────────────────────────

/// Información del build de la app (versión, entorno, API URL, etc.).
/// Solo disponible después de que [PackageInfo] carga (async).
class AppBuildInfo {
  const AppBuildInfo({
    required this.appName,
    required this.packageName,
    required this.version,
    required this.buildNumber,
    required this.environment,
    required this.apiBaseUrl,
    required this.sentryDsn,
  });

  final String appName;
  final String packageName;
  final String version;
  final String buildNumber;
  final String environment;
  final String apiBaseUrl;
  final String sentryDsn;

  String get fullVersion => '$version+$buildNumber';
  bool get hasActiveSentry => sentryDsn.isNotEmpty;
}

// ── Provider ──────────────────────────────────────────────────────────────────

/// Provider que carga [AppBuildInfo] una sola vez al inicio.
/// Usa [package_info_plus] para obtener datos del manifest/Info.plist.
final appBuildInfoProvider = FutureProvider<AppBuildInfo>((ref) async {
  final packageInfo = await PackageInfo.fromPlatform();
  return AppBuildInfo(
    appName: packageInfo.appName,
    packageName: packageInfo.packageName,
    version: packageInfo.version,
    buildNumber: packageInfo.buildNumber,
    environment: EnvConfig.environment,
    apiBaseUrl: EnvConfig.apiBaseUrl,
    sentryDsn: EnvConfig.sentryDsn,
  );
});
