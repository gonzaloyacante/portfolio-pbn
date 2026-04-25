import 'package:flutter/material.dart';

import '../../../../core/theme/app_typography.dart';

/// Logo y subtítulo de la marca para la pantalla de login en mobile.
class LoginBrand extends StatelessWidget {
  const LoginBrand({super.key});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Column(
      children: [
        Text(
          'Paola Bolívar',
          style: AppTypography.decorativeTitle(scheme.primary, fontSize: 48),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 4),
        Text(
          'Panel de administración',
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            color: scheme.outline,
            letterSpacing: 0.5,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}
