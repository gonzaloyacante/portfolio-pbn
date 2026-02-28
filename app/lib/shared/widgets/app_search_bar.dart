import 'dart:async';

import 'package:flutter/material.dart';

import '../../core/theme/app_radius.dart';
import '../../core/theme/app_spacing.dart';

/// Barra de búsqueda reutilizable con debounce y botón de limpiar.
/// Reemplaza las implementaciones duplicadas en cada list page.
///
/// Uso:
/// ```dart
/// AppSearchBar(
///   hint: 'Buscar proyectos...',
///   onChanged: (q) => ref.read(searchQueryProvider.notifier).state = q,
/// )
/// ```
class AppSearchBar extends StatefulWidget {
  const AppSearchBar({
    super.key,
    this.hint = 'Buscar...',
    this.onChanged,
    this.onSubmitted,
    this.controller,
    this.autofocus = false,
    this.debounceDuration = const Duration(milliseconds: 300),
    this.padding,
    this.enabled = true,
  });

  final String hint;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final TextEditingController? controller;
  final bool autofocus;
  final Duration debounceDuration;
  final EdgeInsetsGeometry? padding;
  final bool enabled;

  @override
  State<AppSearchBar> createState() => _AppSearchBarState();
}

class _AppSearchBarState extends State<AppSearchBar> {
  late final TextEditingController _ctrl;
  bool _owns = false;
  Timer? _debounce;
  bool _hasText = false;

  @override
  void initState() {
    super.initState();
    if (widget.controller == null) {
      _ctrl = TextEditingController();
      _owns = true;
    } else {
      _ctrl = widget.controller!;
    }
    _ctrl.addListener(_onTextChanged);
    _hasText = _ctrl.text.isNotEmpty;
  }

  void _onTextChanged() {
    final hasText = _ctrl.text.isNotEmpty;
    if (hasText != _hasText) {
      setState(() => _hasText = hasText);
    }
    _debounce?.cancel();
    _debounce = Timer(widget.debounceDuration, () {
      widget.onChanged?.call(_ctrl.text);
    });
  }

  void _clear() {
    _ctrl.clear();
    widget.onChanged?.call('');
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _ctrl.removeListener(_onTextChanged);
    if (_owns) _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Padding(
      padding: widget.padding ?? EdgeInsets.symmetric(horizontal: AppSpacing.base, vertical: AppSpacing.sm),
      child: TextField(
        controller: _ctrl,
        autofocus: widget.autofocus,
        enabled: widget.enabled,
        onSubmitted: widget.onSubmitted,
        style: textTheme.bodyMedium,
        decoration: InputDecoration(
          hintText: widget.hint,
          prefixIcon: Icon(Icons.search_rounded, color: colorScheme.onSurface.withAlpha(120), size: 20),
          suffixIcon: _hasText
              ? IconButton(
                  onPressed: _clear,
                  icon: Icon(Icons.close_rounded, color: colorScheme.onSurface.withAlpha(160), size: 18),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(minWidth: 36, minHeight: 36),
                )
              : null,
          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          border: OutlineInputBorder(
            borderRadius: AppRadius.forChip,
            borderSide: BorderSide(color: colorScheme.outline.withAlpha(120)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: AppRadius.forChip,
            borderSide: BorderSide(color: colorScheme.outline.withAlpha(80)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: AppRadius.forChip,
            borderSide: BorderSide(color: colorScheme.primary, width: 1.5),
          ),
        ),
      ),
    );
  }
}
