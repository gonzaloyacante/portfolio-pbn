part of 'font_picker_field.dart';

// ── Bottom Sheet ────────────────────────────────────────────────────────────

class _FontPickerSheet extends StatefulWidget {
  const _FontPickerSheet({required this.selected, required this.onSelect});

  final String? selected;
  final ValueChanged<String> onSelect;

  @override
  State<_FontPickerSheet> createState() => _FontPickerSheetState();
}

class _FontPickerSheetState extends State<_FontPickerSheet> {
  final _searchCtrl = TextEditingController();
  String _category = 'Todas';
  bool _showAll = false;

  late final List<String> _allFontNames;

  @override
  void initState() {
    super.initState();
    _allFontNames = GoogleFonts.asMap().keys.toList()..sort();
    _searchCtrl.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  List<({String name, String category})> get _filteredCurated {
    final q = _searchCtrl.text.toLowerCase();
    return _curatedFonts.where((f) {
      final matchesSearch = q.isEmpty || f.name.toLowerCase().contains(q);
      final matchesCat = _category == 'Todas' || f.category == _category;
      return matchesSearch && matchesCat;
    }).toList();
  }

  List<String> get _filteredAll {
    final q = _searchCtrl.text.toLowerCase();
    if (q.isEmpty) return _allFontNames;
    return _allFontNames.where((n) => n.toLowerCase().contains(q)).toList();
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final curated = _filteredCurated;
    final all = _showAll ? _filteredAll : <String>[];

    return DraggableScrollableSheet(
      initialChildSize: 0.75,
      minChildSize: 0.5,
      maxChildSize: 0.95,
      expand: false,
      builder: (context, scrollController) {
        return Column(
          children: [
            // ── Handle + Title ──
            Padding(
              padding: const EdgeInsets.only(top: 12, bottom: 4),
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: colorScheme.outline.withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.base,
                vertical: AppSpacing.sm,
              ),
              child: Text(
                'Seleccionar fuente',
                style: Theme.of(
                  context,
                ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
              ),
            ),

            // ── Search ──
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.base),
              child: TextField(
                controller: _searchCtrl,
                decoration: InputDecoration(
                  hintText: 'Buscar fuente...',
                  prefixIcon: const Icon(Icons.search_rounded, size: 20),
                  suffixIcon: _searchCtrl.text.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear_rounded, size: 18),
                          onPressed: () => _searchCtrl.clear(),
                        )
                      : null,
                  isDense: true,
                  contentPadding: const EdgeInsets.symmetric(vertical: 10),
                ),
              ),
            ),
            const SizedBox(height: AppSpacing.sm),

            // ── Category chips ──
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.base),
              child: Row(
                children: _categories.map((cat) {
                  final active = cat == _category;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: FilterChip(
                      label: Text(cat),
                      selected: active,
                      onSelected: (_) => setState(() => _category = cat),
                      showCheckmark: false,
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: AppSpacing.sm),
            const Divider(height: 1),

            // ── Font list ──
            Expanded(
              child: ListView(
                controller: scrollController,
                padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
                children: [
                  // Curated popular fonts
                  if (curated.isNotEmpty) ...[
                    Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.base,
                        vertical: AppSpacing.xs,
                      ),
                      child: Text(
                        'Populares',
                        style: Theme.of(context).textTheme.labelMedium
                            ?.copyWith(
                              color: colorScheme.primary,
                              fontWeight: FontWeight.w600,
                            ),
                      ),
                    ),
                    for (final font in curated)
                      _FontTile(
                        name: font.name,
                        category: font.category,
                        isSelected: widget.selected == font.name,
                        onTap: () => widget.onSelect(font.name),
                      ),
                  ],

                  // Toggle all fonts
                  const SizedBox(height: AppSpacing.sm),
                  Center(
                    child: TextButton.icon(
                      onPressed: () => setState(() => _showAll = !_showAll),
                      icon: Icon(
                        _showAll
                            ? Icons.expand_less_rounded
                            : Icons.expand_more_rounded,
                        size: 18,
                      ),
                      label: Text(
                        _showAll
                            ? 'Ocultar catálogo completo'
                            : 'Ver catálogo completo (${_allFontNames.length}+ fuentes)',
                      ),
                    ),
                  ),

                  // All Google Fonts
                  if (_showAll) ...[
                    Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.base,
                        vertical: AppSpacing.xs,
                      ),
                      child: Text(
                        'Todas las fuentes',
                        style: Theme.of(context).textTheme.labelMedium
                            ?.copyWith(
                              color: colorScheme.primary,
                              fontWeight: FontWeight.w600,
                            ),
                      ),
                    ),
                    for (final name in all)
                      _FontTile(
                        name: name,
                        isSelected: widget.selected == name,
                        onTap: () => widget.onSelect(name),
                      ),
                  ],
                ],
              ),
            ),
          ],
        );
      },
    );
  }
}

// ── Font Tile ───────────────────────────────────────────────────────────────

class _FontTile extends StatelessWidget {
  const _FontTile({
    required this.name,
    required this.isSelected,
    required this.onTap,
    this.category,
  });

  final String name;
  final String? category;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return ListTile(
      dense: true,
      selected: isSelected,
      selectedTileColor: colorScheme.primaryContainer.withValues(alpha: 0.3),
      onTap: onTap,
      title: Text(
        name,
        style: GoogleFonts.getFont(
          name,
          textStyle: TextStyle(
            fontSize: 18,
            color: isSelected ? colorScheme.primary : colorScheme.onSurface,
          ),
        ),
      ),
      subtitle: category != null
          ? Text(
              category!,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: colorScheme.onSurface.withValues(alpha: 0.5),
              ),
            )
          : null,
      trailing: isSelected
          ? Icon(Icons.check_circle_rounded, color: colorScheme.primary)
          : null,
    );
  }
}
