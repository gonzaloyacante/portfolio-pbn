import 'package:flutter/material.dart';

/// Banner shown at the top of a form when a saved draft is detected.
/// Offers "Restore" and "Discard" actions.
class DraftRestoreBanner extends StatelessWidget {
  const DraftRestoreBanner({
    super.key,
    required this.onRestore,
    required this.onDiscard,
  });

  final VoidCallback onRestore;
  final VoidCallback onDiscard;

  @override
  Widget build(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    return Material(
      color: cs.secondaryContainer,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        child: Row(
          children: [
            Icon(Icons.restore, size: 18, color: cs.onSecondaryContainer),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                'Tienes un borrador guardado',
                style: TextStyle(
                  fontSize: 13,
                  color: cs.onSecondaryContainer,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            TextButton(
              onPressed: onDiscard,
              style: TextButton.styleFrom(
                foregroundColor: cs.onSecondaryContainer,
                visualDensity: VisualDensity.compact,
                padding: const EdgeInsets.symmetric(horizontal: 8),
              ),
              child: const Text('Descartar'),
            ),
            const SizedBox(width: 4),
            FilledButton(
              onPressed: onRestore,
              style: FilledButton.styleFrom(
                backgroundColor: cs.secondary,
                foregroundColor: cs.onSecondary,
                visualDensity: VisualDensity.compact,
                padding: const EdgeInsets.symmetric(horizontal: 12),
              ),
              child: const Text('Restaurar'),
            ),
          ],
        ),
      ),
    );
  }
}
