import 'dart:io';

import 'package:flutter/material.dart';
import 'package:open_file/open_file.dart';

import '../../core/updates/app_release_model.dart';
import '../../core/updates/app_update_repository.dart';
import '../../core/utils/app_logger.dart';

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
      _Phase.ready => _ReadyPhase(key: const ValueKey('ready')),
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

// ── _UpdateHeader ─────────────────────────────────────────────────────────────

class _UpdateHeader extends StatelessWidget {
  const _UpdateHeader({
    required this.version,
    required this.mandatory,
    required this.phase,
  });

  final String version;
  final bool mandatory;
  final _Phase phase;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    Color headerColor1;
    Color headerColor2;
    IconData icon;
    String title;
    String subtitle;

    switch (phase) {
      case _Phase.downloading:
        headerColor1 = Colors.blue.shade700;
        headerColor2 = Colors.blue.shade400;
        icon = Icons.cloud_download_rounded;
        title = 'Descargando…';
        subtitle = 'No cierres la aplicación';
      case _Phase.verifying:
        headerColor1 = Colors.teal.shade700;
        headerColor2 = Colors.teal.shade400;
        icon = Icons.verified_rounded;
        title = 'Verificando';
        subtitle = 'Comprobando integridad del archivo';
      case _Phase.ready:
        headerColor1 = Colors.green.shade700;
        headerColor2 = Colors.green.shade400;
        icon = Icons.check_circle_rounded;
        title = '¡Listo para instalar!';
        subtitle = 'La actualización está preparada';
      case _Phase.error:
        headerColor1 = Colors.red.shade700;
        headerColor2 = Colors.red.shade400;
        icon = Icons.error_rounded;
        title = 'Error de descarga';
        subtitle = 'Algo salió mal';
      default:
        headerColor1 = isDark ? colors.primary : const Color(0xFF6C0A0A);
        headerColor2 = isDark ? colors.secondary : const Color(0xFFB71C1C);
        icon = mandatory
            ? Icons.system_update_rounded
            : Icons.system_update_alt_rounded;
        title = 'Nueva versión $version';
        subtitle = mandatory
            ? '⚠ Actualización obligatoria'
            : 'Actualización disponible';
    }

    return Container(
      padding: const EdgeInsets.fromLTRB(24, 28, 24, 24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [headerColor1, headerColor2],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.18),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, color: Colors.white, size: 28),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    letterSpacing: -0.2,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: TextStyle(
                    color: Colors.white.withValues(alpha: 0.85),
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── _InfoPhase ────────────────────────────────────────────────────────────────

class _InfoPhase extends StatelessWidget {
  const _InfoPhase({super.key, required this.release});
  final AppRelease release;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final lines = release.releaseNotes
        .split('\n')
        .map((l) => l.trim())
        .where((l) => l.isNotEmpty)
        .toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Novedades',
          style: Theme.of(context).textTheme.titleSmall?.copyWith(
            color: colors.primary,
            fontWeight: FontWeight.w700,
          ),
        ),
        const SizedBox(height: 10),
        ...lines.map(
          (line) => Padding(
            padding: const EdgeInsets.only(bottom: 6),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(
                  Icons.check_circle_outline_rounded,
                  size: 16,
                  color: colors.primary,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    // Strip leading bullet/dash prefix if present
                    (line.startsWith('- ') || line.startsWith('• '))
                        ? line.substring(2)
                        : line,
                    style: Theme.of(
                      context,
                    ).textTheme.bodyMedium?.copyWith(height: 1.4),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),
        // Fecha y tamaño
        Row(
          children: [
            _MetaChip(
              icon: Icons.calendar_today_outlined,
              label: _formatDate(release.publishedAt),
            ),
            if (release.fileSizeFormatted != null) ...[
              const SizedBox(width: 8),
              _MetaChip(
                icon: Icons.storage_outlined,
                label: release.fileSizeFormatted!,
              ),
            ],
            if (release.checksumSha256 != null) ...[
              const SizedBox(width: 8),
              _MetaChip(
                icon: Icons.security_outlined,
                label: 'SHA-256',
                color: Colors.green.shade700,
              ),
            ],
          ],
        ),
        const SizedBox(height: 4),
      ],
    );
  }

  String _formatDate(DateTime dt) {
    final months = [
      'ene',
      'feb',
      'mar',
      'abr',
      'may',
      'jun',
      'jul',
      'ago',
      'sep',
      'oct',
      'nov',
      'dic',
    ];
    return '${dt.day} ${months[dt.month - 1]} ${dt.year}';
  }
}

// ── _MetaChip ─────────────────────────────────────────────────────────────────

class _MetaChip extends StatelessWidget {
  const _MetaChip({required this.icon, required this.label, this.color});

  final IconData icon;
  final String label;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final effectiveColor = color ?? colors.onSurface.withValues(alpha: 0.7);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: effectiveColor.withValues(alpha: 0.09),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: effectiveColor),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              color: effectiveColor,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

// ── _DownloadPhase ────────────────────────────────────────────────────────────

class _DownloadPhase extends StatelessWidget {
  const _DownloadPhase({
    super.key,
    required this.received,
    required this.total,
    required this.speedBytesPerSec,
    required this.progressAnimation,
  });

  final int received;
  final int total;
  final double speedBytesPerSec;
  final Animation<double> progressAnimation;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final pct = total > 0 ? (received / total * 100).toStringAsFixed(0) : '?';
    final receivedMb = (received / 1024 / 1024).toStringAsFixed(1);
    final totalMb = total > 0 ? (total / 1024 / 1024).toStringAsFixed(1) : '?';
    final speed = speedBytesPerSec > 0
        ? '${(speedBytesPerSec / 1024).toStringAsFixed(0)} KB/s'
        : '';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 4),
        Row(
          children: [
            Text(
              '$pct%',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w800,
                color: colors.primary,
              ),
            ),
            const Spacer(),
            if (speed.isNotEmpty)
              Text(
                speed,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: colors.onSurface.withValues(alpha: 0.6),
                ),
              ),
          ],
        ),
        const SizedBox(height: 10),
        // Barra de progreso animada
        AnimatedBuilder(
          animation: progressAnimation,
          builder: (ctx, _) {
            return ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: LinearProgressIndicator(
                value: total > 0 ? progressAnimation.value : null,
                minHeight: 10,
                backgroundColor: colors.primaryContainer.withValues(alpha: 0.3),
                valueColor: AlwaysStoppedAnimation<Color>(colors.primary),
              ),
            );
          },
        ),
        const SizedBox(height: 8),
        Text(
          '$receivedMb MB de $totalMb MB',
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: colors.onSurface.withValues(alpha: 0.6),
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Icon(
              Icons.info_outline_rounded,
              size: 14,
              color: colors.onSurface.withValues(alpha: 0.5),
            ),
            const SizedBox(width: 6),
            Text(
              'No cierres la aplicación durante la descarga',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: colors.onSurface.withValues(alpha: 0.5),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
      ],
    );
  }
}

// ── _VerifyingPhase ───────────────────────────────────────────────────────────

class _VerifyingPhase extends StatelessWidget {
  const _VerifyingPhase({super.key, required this.hasChecksum});
  final bool hasChecksum;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 12),
        Center(
          child: SizedBox(
            width: 48,
            height: 48,
            child: CircularProgressIndicator(
              strokeWidth: 3,
              color: Colors.teal.shade600,
            ),
          ),
        ),
        const SizedBox(height: 16),
        Text(
          hasChecksum
              ? 'Verificando integridad SHA-256…'
              : 'Preparando instalación…',
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.bodyMedium,
        ),
        if (hasChecksum) ...[
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.teal.shade600.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.lock_rounded, size: 14, color: Colors.teal.shade600),
                const SizedBox(width: 6),
                Text(
                  'Comprobando autenticidad del archivo',
                  style: Theme.of(
                    context,
                  ).textTheme.bodySmall?.copyWith(color: Colors.teal.shade600),
                ),
              ],
            ),
          ),
        ],
        const SizedBox(height: 12),
      ],
    );
  }
}

// ── _ReadyPhase ───────────────────────────────────────────────────────────────

class _ReadyPhase extends StatelessWidget {
  const _ReadyPhase({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 8),
        Center(
          child: Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: Colors.green.shade600.withValues(alpha: 0.12),
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.check_rounded,
              size: 36,
              color: Colors.green.shade600,
            ),
          ),
        ),
        const SizedBox(height: 14),
        Text(
          'Descarga completada',
          style: Theme.of(
            context,
          ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 6),
        Text(
          'Pulsa "Instalar ahora" para continuar.\n'
          'Android te pedirá confirmación antes de instalar.',
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: Theme.of(
              context,
            ).colorScheme.onSurface.withValues(alpha: 0.6),
            height: 1.5,
          ),
        ),
        const SizedBox(height: 12),
      ],
    );
  }
}

// ── _ErrorPhase ───────────────────────────────────────────────────────────────

class _ErrorPhase extends StatelessWidget {
  const _ErrorPhase({super.key, required this.message});
  final String message;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 8),
        Center(
          child: Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: Colors.red.shade600.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.cloud_off_rounded,
              size: 30,
              color: Colors.red.shade600,
            ),
          ),
        ),
        const SizedBox(height: 14),
        Text(
          'No se pudo descargar',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w600,
            color: Colors.red.shade700,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.red.shade600.withValues(alpha: 0.07),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Text(
            message,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: Colors.red.shade700,
              height: 1.5,
            ),
          ),
        ),
        const SizedBox(height: 12),
      ],
    );
  }
}
