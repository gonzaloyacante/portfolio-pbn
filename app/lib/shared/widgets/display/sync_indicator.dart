import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';

// ── OfflineBanner ─────────────────────────────────────────────────────────────

/// Banner animado que se muestra cuando no hay conexión a internet.
class OfflineBanner extends StatelessWidget {
  const OfflineBanner({super.key, required this.isVisible});

  final bool isVisible;

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 350),
      curve: Curves.easeInOut,
      height: isVisible ? 40 : 0,
      color: AppColors.warning,
      child: isVisible
          ? Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  Icons.wifi_off_rounded,
                  size: 16,
                  color: Colors.white,
                ),
                const SizedBox(width: AppSpacing.sm),
                Flexible(
                  child: Text(
                    'Sin conexión — los cambios se sincronizarán al reconectar',
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                    overflow: TextOverflow.ellipsis,
                    maxLines: 1,
                  ),
                ),
              ],
            )
          : const SizedBox.shrink(),
    );
  }
}
