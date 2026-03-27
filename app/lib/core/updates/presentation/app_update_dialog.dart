import 'dart:io';

import 'package:flutter/material.dart';
import 'package:open_file/open_file.dart';

import '../app_release_model.dart';
import '../app_update_repository.dart';
import '../../utils/app_logger.dart';

part 'app_update_dialog_phases.dart';

// ── AppUpdateDialog ────────────────────────────────────────────────────────────

/// Diálogo completo de actualización in-app.
///
/// Fases del diálogo:
/// 1. [_Phase.info]       → Información de la release con notas y botón "Instalar"
/// 2. [_Phase.downloading] → Progreso de descarga con porcentaje y velocidad
/// 3. [_Phase.verifying]  → Verificación SHA-256 de integridad
/// 4. [_Phase.ready]      → APK descargado — botón "Abrir instalador"
/// 5. [_Phase.error]      → Error con mensaje y opción de reintentar
///
/// Uso:
/// ```dart
/// AppUpdateDialog.show(context, release: release, forceUpdate: false);
/// ```
class AppUpdateDialog extends StatefulWidget {
  const AppUpdateDialog({
    super.key,
    required this.release,
    this.forceUpdate = false,
  });

  final AppRelease release;

  /// Si true: el diálogo no puede cerrarse hasta iniciar la instalación.
  final bool forceUpdate;

  /// Muestra el diálogo con animación de entrada suave.
  ///
  /// Retorna `true` si el usuario inició la instalación, `false` si canceló.
  static Future<bool?> show(
    BuildContext context, {
    required AppRelease release,
    bool forceUpdate = false,
  }) {
    return showGeneralDialog<bool>(
      context: context,
      barrierDismissible: !forceUpdate,
      barrierLabel: forceUpdate ? null : 'Cerrar',
      barrierColor: Colors.black54,
      transitionDuration: const Duration(milliseconds: 400),
      pageBuilder: (ctx, animation, secondaryAnimation) =>
          AppUpdateDialog(release: release, forceUpdate: forceUpdate),
      transitionBuilder: (ctx, animation, secondary, child) {
        final curved = CurvedAnimation(
          parent: animation,
          curve: Curves.easeOutBack,
        );
        return ScaleTransition(
          scale: Tween<double>(begin: 0.85, end: 1.0).animate(curved),
          child: FadeTransition(opacity: animation, child: child),
        );
      },
    );
  }

  @override
  State<AppUpdateDialog> createState() => _AppUpdateDialogState();
}

// ── _Phase ────────────────────────────────────────────────────────────────────

enum _Phase { info, downloading, verifying, ready, error }

// ── _AppUpdateDialogState ─────────────────────────────────────────────────────

class _AppUpdateDialogState extends State<AppUpdateDialog>
    with SingleTickerProviderStateMixin {
  _Phase _phase = _Phase.info;
  int _received = 0;
  int _total = 0;
  String? _errorMessage;
  File? _downloadedFile;
  late AnimationController _progressController;
  late Animation<double> _progressAnimation;

  // Para calcular velocidad de descarga
  DateTime? _downloadStart;
  double _speedBytesPerSec = 0;

  @override
  void initState() {
    super.initState();
    _progressController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    _progressAnimation = _progressController;
  }

  @override
  void dispose() {
    _progressController.dispose();
    super.dispose();
  }

  // ── download ───────────────────────────────────────────────────────────────

  Future<void> _startDownload() async {
    final repo = AppUpdateRepository();

    // Limpiar APKs anteriores para liberar espacio
    await repo.cleanOldApks();

    setState(() {
      _phase = _Phase.downloading;
      _received = 0;
      _total = widget.release.fileSizeBytes ?? 0;
      _errorMessage = null;
      _downloadStart = DateTime.now();
    });

    try {
      final file = await repo.downloadApk(
        widget.release,
        onProgress: (received, total) {
          if (!mounted) return;
          // Calcular velocidad (bytes/s)
          final elapsed = DateTime.now()
              .difference(_downloadStart!)
              .inMilliseconds;
          final speed = elapsed > 0 ? received / elapsed * 1000.0 : 0.0;

          setState(() {
            _received = received;
            _total = total > 0 ? total : (widget.release.fileSizeBytes ?? 0);
            _speedBytesPerSec = speed;
          });
          // Animar la barra de progreso
          if (_total > 0) {
            final pct = (received / _total).clamp(0.0, 1.0);
            _progressController.animateTo(pct);
          }
        },
      );

      if (!mounted) return;

      // Fase de verificación (se muestra brevemente)
      setState(() => _phase = _Phase.verifying);
      // La repo ya verificó en downloadApk — esta fase es solo visual
      await Future<void>.delayed(const Duration(milliseconds: 800));

      if (!mounted) return;

      setState(() {
        _phase = _Phase.ready;
        _downloadedFile = file;
      });

      AppLogger.info('AppUpdateDialog: APK listo para instalar — ${file.path}');
    } on AppUpdateException catch (e) {
      if (!mounted) return;
      setState(() {
        _phase = _Phase.error;
        _errorMessage = e.message;
      });
      AppLogger.error('AppUpdateDialog: error al descargar APK', e);
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _phase = _Phase.error;
        _errorMessage = 'Error inesperado: $e';
      });
      AppLogger.error('AppUpdateDialog: error inesperado', e);
    }
  }

  // ── install ────────────────────────────────────────────────────────────────

  Future<void> _launchInstaller() async {
    final file = _downloadedFile;
    if (file == null || !file.existsSync()) {
      setState(() {
        _phase = _Phase.error;
        _errorMessage =
            'El archivo de instalación no está disponible. '
            'Por favor, descárgalo de nuevo.';
      });
      return;
    }

    try {
      AppLogger.info('AppUpdateDialog: abriendo instalador → ${file.path}');
      final result = await OpenFile.open(
        file.path,
        type: 'application/vnd.android.package-archive',
      );

      if (result.type == ResultType.done) {
        if (mounted) Navigator.of(context).pop(true);
      } else {
        // El instalador fue abierto pero el usuario no ha completado la
        // instalación todavía — no hacemos nada el dialog seguirá visible.
        AppLogger.warn('OpenFile result: ${result.type} — ${result.message}');
        if (result.type == ResultType.noAppToOpen ||
            result.type == ResultType.permissionDenied) {
          _showInstallPermissionGuide();
        }
      }
    } catch (e) {
      AppLogger.error('AppUpdateDialog: error al abrir instalador', e);
      if (mounted) {
        setState(() {
          _phase = _Phase.error;
          _errorMessage =
              'No se pudo abrir el instalador. '
              'Asegúrate de que la app tiene permiso para instalar apps '
              'desconocidas en Ajustes > Aplicaciones.';
        });
      }
    }
  }

  // ── guide ──────────────────────────────────────────────────────────────────

  void _showInstallPermissionGuide() {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text(
          'Ve a Ajustes → Aplicaciones → PBN Admin → '
          'Instalar apps desconocidas y actívalo',
        ),
        duration: const Duration(seconds: 6),
        behavior: SnackBarBehavior.floating,
        action: SnackBarAction(label: 'Entendido', onPressed: () {}),
      ),
    );
  }

  // ── UI ─────────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: !widget.forceUpdate && _phase != _Phase.downloading,
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 400),
          child: Material(
            color: Colors.transparent,
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 24),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                borderRadius: BorderRadius.circular(28),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.25),
                    blurRadius: 32,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(28),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // ── Header con gradiente ───────────────────────────────
                    _UpdateHeader(
                      version: widget.release.version,
                      mandatory: widget.forceUpdate,
                      phase: _phase,
                    ),
                    // ── Contenido según fase ───────────────────────────────
                    Flexible(
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.fromLTRB(24, 20, 24, 8),
                        child: AnimatedSwitcher(
                          duration: const Duration(milliseconds: 350),
                          transitionBuilder: (child, anim) => FadeTransition(
                            opacity: anim,
                            child: SlideTransition(
                              position: Tween<Offset>(
                                begin: const Offset(0, 0.05),
                                end: Offset.zero,
                              ).animate(anim),
                              child: child,
                            ),
                          ),
                          child: _buildPhaseContent(),
                        ),
                      ),
                    ),
                    // ── Botones de acción ─────────────────────────────────
                    _buildActions(),
                    const SizedBox(height: 4),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPhaseContent() {
    return switch (_phase) {
      _Phase.info => _InfoPhase(
        key: const ValueKey('info'),
        release: widget.release,
      ),
      _Phase.downloading => _DownloadPhase(
        key: const ValueKey('downloading'),
        received: _received,
        total: _total,
        speedBytesPerSec: _speedBytesPerSec,
        progressAnimation: _progressAnimation,
      ),
      _Phase.verifying => _VerifyingPhase(
        key: const ValueKey('verifying'),
        hasChecksum: widget.release.checksumSha256 != null,
      ),
      _Phase.ready => const _ReadyPhase(key: ValueKey('ready')),
      _Phase.error => _ErrorPhase(
        key: const ValueKey('error'),
        message: _errorMessage ?? 'Error desconocido',
      ),
    };
  }

  Widget _buildActions() {
    final colors = Theme.of(context).colorScheme;

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 16),
      child: switch (_phase) {
        _Phase.info => Column(
          children: [
            FilledButton.icon(
              onPressed: _startDownload,
              icon: const Icon(Icons.download_rounded),
              label: Text(
                widget.release.fileSizeFormatted != null
                    ? 'Descargar (${widget.release.fileSizeFormatted})'
                    : 'Descargar actualización',
              ),
              style: FilledButton.styleFrom(
                minimumSize: const Size(double.infinity, 48),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
            ),
            if (!widget.forceUpdate) ...[
              const SizedBox(height: 8),
              TextButton(
                onPressed: () => Navigator.of(context).pop(false),
                child: const Text('Ahora no'),
              ),
            ],
          ],
        ),
        _Phase.downloading => TextButton(
          onPressed: null,
          child: Text(
            'Descargando…',
            style: TextStyle(color: colors.onSurface.withValues(alpha: 0.5)),
          ),
        ),
        _Phase.verifying => TextButton(
          onPressed: null,
          child: Text(
            'Verificando integridad…',
            style: TextStyle(color: colors.onSurface.withValues(alpha: 0.5)),
          ),
        ),
        _Phase.ready => FilledButton.icon(
          onPressed: _launchInstaller,
          icon: const Icon(Icons.install_mobile_rounded),
          label: const Text('Instalar ahora'),
          style: FilledButton.styleFrom(
            backgroundColor: Colors.green.shade600,
            minimumSize: const Size(double.infinity, 48),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14),
            ),
          ),
        ),
        _Phase.error => Column(
          children: [
            FilledButton.icon(
              onPressed: _startDownload,
              icon: const Icon(Icons.refresh_rounded),
              label: const Text('Reintentar'),
              style: FilledButton.styleFrom(
                minimumSize: const Size(double.infinity, 48),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
            ),
            if (!widget.forceUpdate) ...[
              const SizedBox(height: 8),
              TextButton(
                onPressed: () => Navigator.of(context).pop(false),
                child: const Text('Cancelar'),
              ),
            ],
          ],
        ),
      },
    );
  }
}
