import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';

/// Retorna la etiqueta legible de un estado de contacto.
String contactStatusLabel(String status) => switch (status) {
  'IN_PROGRESS' => 'En curso',
  'REPLIED' => 'Respondido',
  'CLOSED' => 'Cerrado',
  'SPAM' => 'Spam',
  _ => 'Nuevo',
};

/// Retorna el color asociado al estado de un contacto.
Color contactStatusColor(String status, ColorScheme scheme) => switch (status) {
  'IN_PROGRESS' => AppColors.warning,
  'REPLIED' => AppColors.success,
  'CLOSED' => AppColors.priorityLow,
  'SPAM' => AppColors.destructive,
  _ => scheme.primary,
};

/// Badge de estado o prioridad para un contacto.
class ContactBadge extends StatelessWidget {
  const ContactBadge({super.key, required this.label, required this.color});

  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: color.withValues(alpha: 0.35), width: 0.5),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.w600,
          color: color,
        ),
      ),
    );
  }
}
