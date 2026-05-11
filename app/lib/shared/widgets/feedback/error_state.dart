import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

import '../../../core/api/api_exceptions.dart';

// ── ErrorDisplayTone ────────────────────────────────────────────────────────────

enum ErrorDisplayTone { destructive, offline }

// ── ErrorState ────────────────────────────────────────────────────────────────

/// Widget de error para estados de fallo en carga de datos.
///
/// Uso:
/// ```dart
/// ErrorState(
///   message: 'No se pudo cargar las imágenes',
///   onRetry: () => ref.invalidate(galleryProvider),
/// )
/// ```
///
/// Para errores de red desde `AsyncValue`, preferí [ErrorState.forFailure].
class ErrorState extends StatelessWidget {
  const ErrorState({
    super.key,
    required this.message,
    this.onRetry,
    this.icon,
    this.heading = 'Algo salió mal',
    this.tone = ErrorDisplayTone.destructive,
  });

  /// Sin conexión — copys y estilo distintos del error genérico.
  const ErrorState.offline({super.key, this.onRetry})
    : message =
          'No hay conexión a internet o la red no está disponible. Cuando '
          'vuelva la conexión podés actualizar los datos con el botón de abajo.',
      heading = 'Sin conexión',
      icon = Icons.wifi_off_rounded,
      tone = ErrorDisplayTone.offline;

  /// Decide mensaje y estilo según el tipo de excepción (p. ej. [NetworkException]).
  factory ErrorState.forFailure(
    Object error, {
    VoidCallback? onRetry,
    String? fallbackMessage,
  }) {
    if (_isOfflineFailure(error)) {
      return ErrorState.offline(onRetry: onRetry);
    }
    final msg = fallbackMessage ?? _messageFrom(error);
    return ErrorState(message: msg, onRetry: onRetry);
  }

  /// Cubre [NetworkException] directa y la envuelta en [DioException] (interceptores).
  static bool _isOfflineFailure(Object error) {
    if (error is NetworkException) return true;
    if (error is DioException) {
      if (error.error is NetworkException) return true;
      return error.type == DioExceptionType.connectionError;
    }
    return false;
  }

  final String message;
  final VoidCallback? onRetry;
  final IconData? icon;
  final String heading;
  final ErrorDisplayTone tone;

  static String _messageFrom(Object error) {
    if (error is AppException) return error.message;
    return error.toString();
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    final bool offline = tone == ErrorDisplayTone.offline;
    final Color accent = offline ? colorScheme.primary : colorScheme.error;
    final IconData effectiveIcon =
        icon ??
        (offline ? Icons.wifi_off_rounded : Icons.error_outline_rounded);

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
                  colors: [
                    accent.withValues(alpha: 0.15),
                    accent.withValues(alpha: 0.05),
                  ],
                ),
                shape: BoxShape.circle,
              ),
              child: Icon(
                effectiveIcon,
                size: 32,
                color: accent.withValues(alpha: 0.85),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              heading,
              style: textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
                color: accent,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              message,
              style: textTheme.bodyMedium?.copyWith(
                color: colorScheme.onSurfaceVariant,
                height: 1.4,
              ),
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
      decoration: BoxDecoration(
        color: colorScheme.errorContainer,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Icon(
            Icons.error_outline,
            size: 18,
            color: colorScheme.onErrorContainer,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              message,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: colorScheme.onErrorContainer,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
