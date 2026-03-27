import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_spacing.dart';

part 'font_picker_field_sheet.dart';

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
