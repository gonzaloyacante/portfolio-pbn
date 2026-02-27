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

// ── Sheet interna ────────────────────────────────────────────────────────────

class _EmojiPickerSheet extends StatefulWidget {
  const _EmojiPickerSheet({this.currentValue, required this.onSelected});

  final String? currentValue;
  final ValueChanged<String> onSelected;

  @override
  State<_EmojiPickerSheet> createState() => _EmojiPickerSheetState();
}

class _EmojiPickerSheetState extends State<_EmojiPickerSheet>
    with SingleTickerProviderStateMixin {
  late final TabController _tab;

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: _categories.length, vsync: this);
  }

  @override
  void dispose() {
    _tab.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return DraggableScrollableSheet(
      initialChildSize: 0.65,
      minChildSize: 0.4,
      maxChildSize: 0.92,
      expand: false,
      builder: (_, scrollController) => Column(
        children: [
          // Handle
          Padding(
            padding: const EdgeInsets.only(top: 12, bottom: 4),
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: scheme.outline.withValues(alpha: 0.3),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          // Title
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            child: Text(
              'Seleccionar emoji',
              style: Theme.of(
                context,
              ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
            ),
          ),
          // Tabs
          TabBar(
            controller: _tab,
            isScrollable: true,
            tabAlignment: TabAlignment.start,
            tabs: _categories
                .map((c) => Tab(text: '${c.icon} ${c.name}'))
                .toList(),
          ),
          // Grid
          Expanded(
            child: TabBarView(
              controller: _tab,
              children: _categories.map((cat) {
                return GridView.builder(
                  controller: scrollController,
                  padding: const EdgeInsets.all(12),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 7,
                    mainAxisSpacing: 4,
                    crossAxisSpacing: 4,
                    childAspectRatio: 1,
                  ),
                  itemCount: cat.emojis.length,
                  itemBuilder: (_, i) {
                    final emoji = cat.emojis[i];
                    final isSelected = emoji == widget.currentValue;
                    return GestureDetector(
                      onTap: () => widget.onSelected(emoji),
                      child: Container(
                        decoration: BoxDecoration(
                          color: isSelected
                              ? scheme.primaryContainer
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Center(
                          child: Text(
                            emoji,
                            style: const TextStyle(fontSize: 22),
                          ),
                        ),
                      ),
                    );
                  },
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}

// ── Categorías de emojis ──────────────────────────────────────────────────────

class _EmojiCategory {
  const _EmojiCategory({
    required this.name,
    required this.icon,
    required this.emojis,
  });
  final String name;
  final String icon;
  final List<String> emojis;
}

const _categories = [
  _EmojiCategory(
    name: 'Arte',
    icon: '🎨',
    emojis: [
      '🎨',
      '🖼️',
      '✏️',
      '🖊️',
      '🖋️',
      '📷',
      '🎭',
      '🎬',
      '🎤',
      '🎼',
      '🎵',
      '🎶',
      '🎸',
      '🎹',
      '🎺',
      '🎻',
      '🥁',
      '🪘',
      '🖌️',
      '🎪',
      '🎠',
      '🎡',
      '🎢',
      '🪄',
      '🎯',
      '🎲',
    ],
  ),
  _EmojiCategory(
    name: 'Trabajo',
    icon: '💼',
    emojis: [
      '💼',
      '📁',
      '📂',
      '📌',
      '📍',
      '📎',
      '🖇️',
      '✂️',
      '🗃️',
      '🗂️',
      '📊',
      '📈',
      '📉',
      '📋',
      '📅',
      '📆',
      '🗒️',
      '🖥️',
      '💻',
      '🖨️',
      '⌨️',
      '🖱️',
      '📱',
      '☎️',
      '📞',
      '📠',
    ],
  ),
  _EmojiCategory(
    name: 'Naturaleza',
    icon: '🌿',
    emojis: [
      '🌿',
      '🌱',
      '🌲',
      '🌳',
      '🌴',
      '🌵',
      '🌾',
      '🍀',
      '🍁',
      '🍂',
      '🍃',
      '🌸',
      '🌺',
      '🌻',
      '🌹',
      '💐',
      '🌷',
      '🌼',
      '🍄',
      '🌍',
      '🌊',
      '🔥',
      '⭐',
      '🌟',
      '💫',
      '☀️',
      '🌙',
    ],
  ),
  _EmojiCategory(
    name: 'Comida',
    icon: '🍽️',
    emojis: [
      '🍎',
      '🍊',
      '🍋',
      '🍇',
      '🍓',
      '🫐',
      '🍑',
      '🥭',
      '🍍',
      '🥝',
      '🍔',
      '🍕',
      '🌮',
      '🌯',
      '🥗',
      '🍰',
      '🎂',
      '🍩',
      '☕',
      '🍵',
      '🧃',
      '🍷',
      '🍸',
      '🎁',
      '🛒',
      '🏪',
    ],
  ),
  _EmojiCategory(
    name: 'Personas',
    icon: '👤',
    emojis: [
      '👤',
      '👥',
      '👩‍🎨',
      '👨‍🎨',
      '👩‍💼',
      '👨‍💼',
      '👩‍🏫',
      '👨‍🏫',
      '👩‍💻',
      '👨‍💻',
      '🤝',
      '👋',
      '✌️',
      '🤞',
      '👍',
      '❤️',
      '🎀',
      '💌',
      '🏆',
      '🥇',
      '⭐',
      '💎',
      '🌟',
      '✨',
    ],
  ),
  _EmojiCategory(
    name: 'Símbolos',
    icon: '💠',
    emojis: [
      '💠',
      '🔵',
      '🔴',
      '🟡',
      '🟢',
      '🟣',
      '⚫',
      '⚪',
      '❤️',
      '🧡',
      '💛',
      '💚',
      '💙',
      '💜',
      '🖤',
      '🤍',
      '♾️',
      '🔱',
      '⚜️',
      '🔰',
      '💯',
      '✅',
      '❌',
      '⭕',
      '🔔',
      '💡',
    ],
  ),
];
