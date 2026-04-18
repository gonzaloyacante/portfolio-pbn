import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../shared/widgets/widgets.dart';

/// Layout de dos columnas para pantallas expanded (tablet/desktop).
/// Columna izquierda: panel de marca con gradiente oscuro. Columna derecha: formulario.
class LoginTwoColumnLayout extends StatelessWidget {
  const LoginTwoColumnLayout({super.key, required this.formContent});

  final Widget formContent;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        // Lado izquierdo — panel de marca con gradiente oscuro
        Expanded(
          child: DecoratedBox(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  AppColors.darkBackground,
                  AppColors.darkCard,
                  AppColors.darkSecondary,
                ],
                stops: [0.0, 0.55, 1.0],
              ),
            ),
            child: Stack(
              children: [
                Positioned(
                  top: -60,
                  right: -60,
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.darkPrimary.withValues(alpha: 0.08),
                    ),
                    child: const SizedBox(width: 220, height: 220),
                  ),
                ),
                Positioned(
                  bottom: -80,
                  left: -80,
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.darkPrimary.withValues(alpha: 0.06),
                    ),
                    child: const SizedBox(width: 280, height: 280),
                  ),
                ),
                Center(
                  child: Padding(
                    padding: const EdgeInsets.all(AppSpacing.xxxl),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const PbnSplashLogo(size: 80),
                        const SizedBox(height: AppSpacing.xl),
                        Text(
                          'Paola Bolívar Nievas',
                          style: AppTypography.decorativeTitle(
                            AppColors.darkPrimary,
                            fontSize: 32,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: AppSpacing.sm),
                        Text(
                          'Panel de administración',
                          style: TextStyle(
                            color: AppColors.darkForeground.withValues(
                              alpha: 0.55,
                            ),
                            fontSize: 13,
                            letterSpacing: 1.5,
                            fontWeight: FontWeight.w400,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        // Lado derecho — formulario con scroll
        Expanded(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.xxxl,
                vertical: AppSpacing.xxxl,
              ),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 400),
                child: formContent,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
