part of 'emoji_icon_picker.dart';

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
  String _search = '';

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

  /// Todos los emojis de todas las categorías, filtrados por búsqueda.
  List<String> get _allFiltered {
    final query = _search.toLowerCase();
    final all = <String>[];
    for (final cat in _categories) {
      if (cat.name.toLowerCase().contains(query)) {
        all.addAll(cat.emojis);
      } else {
        all.addAll(cat.emojis.where((e) => e.toLowerCase().contains(query)));
      }
    }
    return all.toSet().toList(); // dedup
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final isSearching = _search.isNotEmpty;

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
          // Search bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Buscar por categoría...',
                prefixIcon: const Icon(Icons.search, size: 20),
                isDense: true,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 10,
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(
                    color: scheme.outline.withValues(alpha: 0.3),
                  ),
                ),
              ),
              onChanged: (v) => setState(() => _search = v),
            ),
          ),
          const SizedBox(height: 4),
          // Tabs (hidden during search)
          if (!isSearching)
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
            child: isSearching
                ? _buildSearchResults(scrollController, scheme)
                : TabBarView(
                    controller: _tab,
                    children: _categories.map((cat) {
                      return _buildEmojiGrid(
                        scrollController,
                        cat.emojis,
                        scheme,
                      );
                    }).toList(),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchResults(
    ScrollController scrollController,
    ColorScheme scheme,
  ) {
    final results = _allFiltered;
    if (results.isEmpty) {
      return Center(
        child: Text(
          'No se encontraron emojis',
          style: TextStyle(color: scheme.onSurfaceVariant),
        ),
      );
    }
    return _buildEmojiGrid(scrollController, results, scheme);
  }

  Widget _buildEmojiGrid(
    ScrollController scrollController,
    List<String> emojis,
    ColorScheme scheme,
  ) {
    return GridView.builder(
      controller: scrollController,
      padding: const EdgeInsets.all(12),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 6,
        mainAxisSpacing: 6,
        crossAxisSpacing: 6,
        childAspectRatio: 1,
      ),
      itemCount: emojis.length,
      itemBuilder: (_, i) {
        final emoji = emojis[i];
        final isSelected = emoji == widget.currentValue;
        return RepaintBoundary(
          child: GestureDetector(
            onTap: () => widget.onSelected(emoji),
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: isSelected
                    ? scheme.primaryContainer
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(10),
                border: isSelected
                    ? Border.all(
                        color: scheme.primary.withValues(alpha: 120 / 255),
                        width: 1.5,
                      )
                    : null,
              ),
              child: Center(
                child: Text(emoji, style: const TextStyle(fontSize: 28)),
              ),
            ),
          ),
        );
      },
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
