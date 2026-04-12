import 'dart:io';

import '../../../../core/updates/app_release_model.dart';

// ── UpdatePhase ───────────────────────────────────────────────────────────────

enum UpdatePhase {
  checking, // Cargando la info del servidor
  upToDate, // Todo al día
  available, // Hay actualización y el usuario debe aceptarla
  downloading, // En progreso de descarga
  verifying, // Comprobando integridad
  ready, // APK comprobado y listo para instalarse
  needsPermission, // Falta el permiso REQUEST_INSTALL_PACKAGES
  installing, // Instalador nativo lanzado
  error, // Error en cualquier fase
}

// ── AppUpdateState ────────────────────────────────────────────────────────────

class AppUpdateState {
  const AppUpdateState({
    this.phase = UpdatePhase.checking,
    this.release,
    this.isMandatory = false,
    this.errorMsg,
    this.progress = 0.0,
    this.downloadedApk,
  });

  final UpdatePhase phase;
  final AppRelease? release;
  final bool isMandatory;
  final String? errorMsg;
  final double progress;
  final File? downloadedApk;

  AppUpdateState copyWith({
    UpdatePhase? phase,
    AppRelease? release,
    bool? isMandatory,
    String? errorMsg,
    double? progress,
    File? downloadedApk,
  }) {
    return AppUpdateState(
      phase: phase ?? this.phase,
      release: release ?? this.release,
      isMandatory: isMandatory ?? this.isMandatory,
      errorMsg: errorMsg ?? this.errorMsg,
      progress: progress ?? this.progress,
      downloadedApk: downloadedApk ?? this.downloadedApk,
    );
  }
}
