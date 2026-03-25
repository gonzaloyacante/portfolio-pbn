import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/theme/app_spacing.dart';

/// Curated list of popular Google Fonts organized by category.
const _curatedFonts = <({String name, String category})>[
  // Script
  (name: 'Great Vibes', category: 'Script'),
  (name: 'Dancing Script', category: 'Script'),
  (name: 'Pacifico', category: 'Script'),
  (name: 'Sacramento', category: 'Script'),
  (name: 'Satisfy', category: 'Script'),
  (name: 'Allura', category: 'Script'),
  // Sans Serif
  (name: 'Poppins', category: 'Sans Serif'),
  (name: 'Open Sans', category: 'Sans Serif'),
  (name: 'Montserrat', category: 'Sans Serif'),
  (name: 'Raleway', category: 'Sans Serif'),
  (name: 'Inter', category: 'Sans Serif'),
  (name: 'Roboto', category: 'Sans Serif'),
  (name: 'Lato', category: 'Sans Serif'),
  (name: 'Nunito', category: 'Sans Serif'),
  (name: 'Oswald', category: 'Sans Serif'),
  (name: 'Quicksand', category: 'Sans Serif'),
  // Serif
  (name: 'Playfair Display', category: 'Serif'),
  (name: 'Lora', category: 'Serif'),
  (name: 'Merriweather', category: 'Serif'),
  (name: 'Crimson Text', category: 'Serif'),
  (name: 'Libre Baskerville', category: 'Serif'),
  (name: 'EB Garamond', category: 'Serif'),
];

const _categories = ['Todas', 'Script', 'Sans Serif', 'Serif'];

/// Builds a Google Fonts CSS URL for the given [fontName].
String _fontUrl(String fontName) {
  final family = fontName.replaceAll(' ', '+');
  return 'https://fonts.googleapis.com/css2?family=$family&display=swap';
}

/// Google Font picker that opens a bottom-sheet with curated fonts and
/// full search across all Google Fonts.
///
/// Usage:
/// ```dart
/// FontPickerField(
///   value: 'Great Vibes',
///   onChanged: (name, url) { ... },
/// )
/// ```
class FontPickerField extends StatelessWidget {
  const FontPickerField({
    super.key,
    required this.value,
    required this.onChanged,
    this.label = 'Fuente',
  });

  final String? value;
  final void Function(String fontName, String fontUrl) onChanged;
  final String label;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final hasValue = value != null && value!.isNotEmpty;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: Theme.of(
            context,
          ).textTheme.labelLarge?.copyWith(color: colorScheme.onSurface),
        ),
        const SizedBox(height: AppSpacing.sm),
        Material(
          color: colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
          borderRadius: BorderRadius.circular(12),
          child: InkWell(
            borderRadius: BorderRadius.circular(12),
            onTap: () => _openPicker(context),
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: colorScheme.outline.withValues(alpha: 0.4),
                ),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Fuente seleccionada',
                          style: Theme.of(context).textTheme.labelSmall
                              ?.copyWith(
                                color: colorScheme.onSurface.withValues(
                                  alpha: 0.6,
                                ),
                                fontWeight: FontWeight.w600,
                                letterSpacing: 0.5,
                              ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          hasValue ? value! : 'Seleccionar fuente',
                          style: hasValue
                              ? GoogleFonts.getFont(
                                  value!,
                                  textStyle: Theme.of(context)
                                      .textTheme
                                      .titleMedium
                                      ?.copyWith(color: colorScheme.onSurface),
                                )
                              : Theme.of(
                                  context,
                                ).textTheme.titleMedium?.copyWith(
                                  color: colorScheme.onSurface.withValues(
                                    alpha: 0.5,
                                  ),
                                ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                  Icon(
                    Icons.unfold_more_rounded,
                    color: colorScheme.onSurface.withValues(alpha: 0.5),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  void _openPicker(BuildContext context) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => _FontPickerSheet(
        selected: value,
        onSelect: (name) {
          onChanged(name, _fontUrl(name));
          Navigator.of(context).pop();
        },
      ),
    );
  }
}

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
