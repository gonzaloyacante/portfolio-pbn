import 'package:flutter/material.dart';

// ── EmojiIconPicker ───────────────────────────────────────────────────────────

/// Campo de selección de emoji/icono para categorías y servicios.
///
/// Muestra el emoji seleccionado como preview y abre un sheet con
/// emojis organizados por categorías al tocar.
///
/// Uso:
/// ```dart
/// EmojiIconPicker(
///   value: _selectedEmoji,
///   onChanged: (emoji) => setState(() => _selectedEmoji = emoji),
///   label: 'Icono',
/// )
/// ```
part 'emoji_icon_picker_sheet.dart';

// ── EmojiIconPicker ──────────────────────────────────────────────────────────────

class EmojiIconPicker extends StatelessWidget {
  const EmojiIconPicker({
    super.key,
    required this.value,
    required this.onChanged,
    this.label = 'Icono',
    this.hint = 'Toca para elegir',
  });

  final String? value;
  final ValueChanged<String> onChanged;
  final String label;
  final String hint;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        GestureDetector(
          onTap: () => _showPicker(context),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            decoration: BoxDecoration(
              border: Border.all(color: scheme.outline.withValues(alpha: 0.38)),
              borderRadius: BorderRadius.circular(12),
              color: scheme.surfaceContainerLowest,
            ),
            child: Row(
              children: [
                Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    color: scheme.primaryContainer,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Center(
                    child: Text(
                      value ?? '📁',
                      style: const TextStyle(fontSize: 22),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        label,
                        style: Theme.of(context).textTheme.labelMedium
                            ?.copyWith(color: scheme.onSurfaceVariant),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        value != null ? 'Emoji: $value' : hint,
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: value != null
                              ? scheme.onSurface
                              : scheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(Icons.expand_more, color: scheme.onSurfaceVariant),
              ],
            ),
          ),
        ),
      ],
    );
  }

  void _showPicker(BuildContext context) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (_) => _EmojiPickerSheet(
        currentValue: value,
        onSelected: (emoji) {
          Navigator.of(context).pop();
          onChanged(emoji);
        },
      ),
    );
  }
}
