import 'dart:io';

import 'package:open_file/open_file.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../../core/updates/app_release_model.dart';
import '../../../../core/updates/app_update_provider.dart';
import '../../../../core/utils/app_logger.dart';
import 'app_update_state.dart';

part 'app_update_provider.g.dart';

@riverpod
class AppUpdatePageNotifier extends _$AppUpdatePageNotifier {
  @override
  AppUpdateState build() {
    Future.microtask(_checkForUpdate);
    return const AppUpdateState();
  }

  Future<void> _checkForUpdate() async {
    state = state.copyWith(phase: UpdatePhase.checking, errorMsg: null);

    // Solo Android: en iOS las actualizaciones van por App Store
    if (!Platform.isAndroid) {
      state = state.copyWith(phase: UpdatePhase.upToDate);
      return;
    }

    try {
      final repo = ref.read(appUpdateRepositoryProvider);
      final status = await repo.checkForUpdate();

      if (status is AppUpToDate) {
        state = state.copyWith(phase: UpdatePhase.upToDate);
      } else if (status is AppUpdateAvailable) {
        state = state.copyWith(
          release: status.release,
          isMandatory: status.forceUpdate,
          phase: UpdatePhase.available,
        );

        final existingApk = await repo.getExistingApk(status.release);
        if (existingApk != null) {
          state = state.copyWith(
            downloadedApk: existingApk,
            phase: UpdatePhase.ready,
          );
        }
      } else if (status is AppUpdateCheckFailed) {
        state = state.copyWith(
          phase: UpdatePhase.error,
          errorMsg: status.reason,
        );
      }
    } catch (e, st) {
      AppLogger.error('AppUpdatePageNotifier: error checking update', e, st);
      Sentry.captureException(e, stackTrace: st);
      state = state.copyWith(
        phase: UpdatePhase.error,
        errorMsg: 'Error inesperado al contactar con el servidor.',
      );
    }
  }

  Future<void> startDownload() async {
    final release = state.release;
    if (release == null) return;

    state = state.copyWith(
      phase: UpdatePhase.downloading,
      progress: 0,
      errorMsg: null,
    );

    try {
      final repo = ref.read(appUpdateRepositoryProvider);
      await repo.cleanOldApks();

      final file = await repo.downloadApk(
        release,
        onProgress: (received, total) {
          if (total > 0) {
            state = state.copyWith(progress: received / total);
          }
        },
      );

      state = state.copyWith(phase: UpdatePhase.verifying);
      await Future<void>.delayed(const Duration(milliseconds: 500));

      state = state.copyWith(downloadedApk: file, phase: UpdatePhase.ready);
    } catch (e, st) {
      AppLogger.error('AppUpdatePageNotifier: falló la descarga', e, st);
      state = state.copyWith(
        phase: UpdatePhase.error,
        errorMsg:
            'Error al descargar la actualización.\nComprueba tu conexión.',
      );
    }
  }

  Future<void> install() async {
    final apk = state.downloadedApk;
    if (apk == null) return;

    try {
      // On Android, REQUEST_INSTALL_PACKAGES must be granted at runtime.
      if (Platform.isAndroid) {
        final status = await Permission.requestInstallPackages.status;
        if (!status.isGranted) {
          final result = await Permission.requestInstallPackages.request();
          if (!result.isGranted) {
            state = state.copyWith(
              phase: UpdatePhase.error,
              errorMsg:
                  'Permiso de instalación denegado.\nActívalo en Ajustes > Aplicaciones.',
            );
            return;
          }
        }
      }

      final result = await OpenFile.open(apk.path);
      if (result.type != ResultType.done) {
        state = state.copyWith(
          phase: UpdatePhase.error,
          errorMsg: 'Imposible abrir el instalador: ${result.message}',
        );
        return;
      }

      state = state.copyWith(phase: UpdatePhase.installing);
    } catch (e, st) {
      AppLogger.error('AppUpdatePageNotifier: fallo al instalar', e, st);
      state = state.copyWith(
        phase: UpdatePhase.error,
        errorMsg: 'Ocurrió un error nativo al instalar el APK.',
      );
    }
  }

  void retry() {
    if (state.release != null && state.phase != UpdatePhase.checking) {
      startDownload();
    } else {
      _checkForUpdate();
    }
  }
}
