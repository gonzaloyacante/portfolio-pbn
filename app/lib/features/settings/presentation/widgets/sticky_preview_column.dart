import 'package:flutter/material.dart';

import '../../../../core/theme/app_spacing.dart';

/// Mantiene el preview visible mientras el usuario scrollea el formulario.
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
