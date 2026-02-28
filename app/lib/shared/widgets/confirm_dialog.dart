import 'package:flutter/material.dart';

// ── ConfirmDialog ─────────────────────────────────────────────────────────────

/// Diálogo de confirmación reutilizable para acciones destructivas o críticas.
///
/// Uso:
/// ```dart
/// final confirmed = await ConfirmDialog.show(
///   context,
///   title: 'Eliminar proyecto',
///   message: '¿Estás segura? Esta acción no se puede deshacer.',
///   confirmLabel: 'Eliminar',
///   isDestructive: true,
/// );
/// if (confirmed) { await deleteProject(id); }
/// ```
class ConfirmDialog extends StatelessWidget {
  const ConfirmDialog({
    super.key,
    required this.title,
    required this.message,
    this.confirmLabel = 'Confirmar',
    this.cancelLabel = 'Cancelar',
    this.isDestructive = false,
    this.icon,
  });

  final String title;
  final String message;
  final String confirmLabel;
  final String cancelLabel;
  final bool isDestructive;
  final IconData? icon;

  /// Muestra el diálogo y devuelve `true` si el usuario confirmó, `false` si canceló.
  static Future<bool> show(
    BuildContext context, {
    required String title,
    required String message,
    String confirmLabel = 'Confirmar',
    String cancelLabel = 'Cancelar',
    bool isDestructive = false,
    IconData? icon,
  }) async {
    final result = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (_) => ConfirmDialog(
        title: title,
        message: message,
        confirmLabel: confirmLabel,
        cancelLabel: cancelLabel,
        isDestructive: isDestructive,
        icon: icon,
      ),
    );
    return result ?? false;
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    final iconWidget = icon != null || isDestructive
        ? Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: isDestructive ? colorScheme.errorContainer : colorScheme.primaryContainer,
              shape: BoxShape.circle,
            ),
            child: Icon(
              icon ?? Icons.warning_amber_rounded,
              color: isDestructive ? colorScheme.onErrorContainer : colorScheme.onPrimaryContainer,
              size: 28,
            ),
          )
        : null;

    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      icon: iconWidget,
      title: Text(title, style: textTheme.titleLarge, textAlign: TextAlign.center),
      content: Text(
        message,
        style: textTheme.bodyMedium?.copyWith(color: colorScheme.onSurfaceVariant),
        textAlign: TextAlign.center,
      ),
      actionsAlignment: MainAxisAlignment.center,
      actions: [
        OutlinedButton(onPressed: () => Navigator.of(context).pop(false), child: Text(cancelLabel)),
        const SizedBox(width: 12),
        FilledButton(
          onPressed: () => Navigator.of(context).pop(true),
          style: isDestructive
              ? FilledButton.styleFrom(backgroundColor: colorScheme.error, foregroundColor: colorScheme.onError)
              : null,
          child: Text(confirmLabel),
        ),
      ],
    );
  }
}
