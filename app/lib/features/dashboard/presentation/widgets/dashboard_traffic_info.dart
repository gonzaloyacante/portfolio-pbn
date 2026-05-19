import 'package:flutter/material.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';

class DashboardTrafficInfo extends StatelessWidget {
  const DashboardTrafficInfo({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      leading: const Icon(Icons.insights_outlined, color: AppColors.info),
      title: 'Estadísticas de visitas',
      subtitle: 'Se consultan fuera de este panel',
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Text(
        'Para ver cuánta gente entra, desde dónde llega y qué páginas mira, usá la aplicación de Google Analytics. Este panel queda solo para tareas y estado de la web.',
        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
          color: Theme.of(
            context,
          ).colorScheme.onSurface.withValues(alpha: 0.72),
          height: 1.35,
        ),
      ),
    );
  }
}
