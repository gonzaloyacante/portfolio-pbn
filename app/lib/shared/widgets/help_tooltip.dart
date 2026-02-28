import 'package:flutter/material.dart';

// ── HelpTooltip ───────────────────────────────────────────────────────────────

/// Icono `?` pequeño que muestra un popup con texto de ayuda al presionarlo.
///
/// Uso:
/// ```dart
/// Row(children: [
///   Text('Nombre'),
///   HelpTooltip('El nombre público del proyecto.'),
/// ])
/// ```
class HelpTooltip extends StatelessWidget {
  const HelpTooltip(this.message, {super.key, this.iconSize = 16});

  final String message;
  final double iconSize;

  @override
  Widget build(BuildContext context) {
    return Tooltip(
      message: message,
      triggerMode: TooltipTriggerMode.tap,
      preferBelow: false,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.inverseSurface,
        borderRadius: BorderRadius.circular(10),
      ),
      textStyle: TextStyle(color: Theme.of(context).colorScheme.onInverseSurface, fontSize: 12, height: 1.5),
      child: Icon(Icons.help_outline_rounded, size: iconSize, color: Theme.of(context).colorScheme.outline),
    );
  }
}

// ── FormLabel con HelpTooltip integrado ─────────────────────────────────────

/// Label para un campo de formulario con tooltip de ayuda opcional.
///
/// Uso:
/// ```dart
/// FormFieldLabel('Nombre', help: 'El nombre público del proyecto.')
/// Column(children: [
///   FormFieldLabel('Slug', help: 'Identificador único en la URL.'),
///   TextFormField(...),
/// ])
/// ```
class FormFieldLabel extends StatelessWidget {
  const FormFieldLabel(this.label, {super.key, this.help, this.required = false});

  final String label;
  final String? help;
  final bool required;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            label,
            style: theme.textTheme.labelLarge?.copyWith(
              fontWeight: FontWeight.w600,
              color: theme.colorScheme.onSurface,
            ),
          ),
          if (required) ...[
            const SizedBox(width: 2),
            Text(
              ' *',
              style: TextStyle(color: theme.colorScheme.error, fontWeight: FontWeight.bold),
            ),
          ],
          if (help != null) ...[const SizedBox(width: 6), HelpTooltip(help!)],
        ],
      ),
    );
  }
}
