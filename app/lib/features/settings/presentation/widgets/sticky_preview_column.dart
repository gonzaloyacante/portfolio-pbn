import 'package:flutter/material.dart';

import '../../../../core/theme/app_spacing.dart';

/// Columna derecha en layout expandido: preview arriba; scroll independiente del formulario.
class StickyPreviewColumn extends StatelessWidget {
  const StickyPreviewColumn({super.key, required this.preview});
  final Widget preview;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: AppSpacing.xs),
      child: preview,
    );
  }
}
