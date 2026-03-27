part of 'app_update_dialog.dart';

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
