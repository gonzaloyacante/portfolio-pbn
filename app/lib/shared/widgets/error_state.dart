import 'package:flutter/material.dart';

// ── ErrorState ────────────────────────────────────────────────────────────────

/// Widget de error para estados de fallo en carga de datos.
///
/// Uso:
/// ```dart
/// ErrorState(
///   message: 'No se pudo cargar los proyectos',
///   onRetry: () => ref.invalidate(projectsProvider),
/// )
/// ```
class ErrorState extends StatelessWidget {
  const ErrorState({super.key, required this.message, this.onRetry, this.icon});

  final String message;
  final VoidCallback? onRetry;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 72,
              height: 72,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [colorScheme.error.withValues(alpha: 0.15), colorScheme.error.withValues(alpha: 0.05)],
                ),
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon ?? Icons.error_outline_rounded,
                size: 32,
                color: colorScheme.error.withValues(alpha: 0.8),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Algo salió mal',
              style: textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700, color: colorScheme.error),
            ),
            const SizedBox(height: 6),
            Text(
              message,
              style: textTheme.bodyMedium?.copyWith(color: colorScheme.onSurfaceVariant, height: 1.4),
              textAlign: TextAlign.center,
            ),
            if (onRetry != null) ...[
              const SizedBox(height: 24),
              FilledButton.tonalIcon(
                onPressed: onRetry,
                icon: const Icon(Icons.refresh_rounded, size: 18),
                label: const Text('Intentar de nuevo'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

// ── InlineError ───────────────────────────────────────────────────────────────

/// Mensaje de error inline para usar dentro de formularios o secciones.
class InlineError extends StatelessWidget {
  const InlineError({super.key, required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(color: colorScheme.errorContainer, borderRadius: BorderRadius.circular(12)),
      child: Row(
        children: [
          Icon(Icons.error_outline, size: 18, color: colorScheme.onErrorContainer),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              message,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(color: colorScheme.onErrorContainer),
            ),
          ),
        ],
      ),
    );
  }
}
