import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/auth/auth_provider.dart';
import '../../../../core/auth/auth_state.dart';
import '../../../../core/theme/app_spacing.dart';

/// Banner de bienvenida con saludo horario y fecha actual en español.
///
/// Lee el nombre del usuario autenticado para personalizar el greeting.
class DashboardGreeting extends ConsumerWidget {
  const DashboardGreeting({super.key});

  String _greeting() {
    final hour = DateTime.now().hour;
    if (hour < 13) return 'Buenos días';
    if (hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
  }

  String _formattedDate() {
    const months = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];
    const days = [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ];
    final now = DateTime.now();
    return '${days[now.weekday - 1]} ${now.day} de ${months[now.month - 1]}';
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = colorScheme.primary;

    final authState = ref.watch(authProvider).value;
    final userName = switch (authState) {
      Authenticated(:final user) => user.name.split(' ').first,
      _ => '',
    };

    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.base,
        vertical: AppSpacing.md,
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${_greeting()}${userName.isNotEmpty ? ', $userName' : ''} 👋',
                  style: textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w700,
                    color: colorScheme.onSurface,
                    height: 1.2,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  _formattedDate(),
                  style: textTheme.bodyMedium?.copyWith(
                    color: colorScheme.onSurface.withValues(alpha: 160 / 255),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: AppSpacing.md),
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: primary.withValues(alpha: (isDark ? 70 : 40) / 255),
              borderRadius: const BorderRadius.circular(16),
            ),
            alignment: Alignment.center,
            child: Icon(Icons.spa_outlined, color: primary, size: 28),
          ),
        ],
      ),
    );
  }
}
