import 'package:flutter/material.dart';

// ── Status ────────────────────────────────────────────────────────────────────

/// Estados posibles de un recurso (contacto, reserva, proyecto, etc.)
enum AppStatus {
  active,
  inactive,
  pending,
  confirmed,
  cancelled,
  featured,
  draft,
  published,
}

// ── StatusBadge ───────────────────────────────────────────────────────────────

/// Badge de estado con color semántico y etiqueta personalizable.
///
/// Uso:
/// ```dart
/// StatusBadge(status: AppStatus.active)
/// StatusBadge(status: AppStatus.pending, label: 'Pendiente de revisión')
/// ```
class StatusBadge extends StatelessWidget {
  const StatusBadge({
    super.key,
    required this.status,
    this.label,
    this.compact = false,
  });

  final AppStatus status;

  /// Etiqueta personalizada. Si null, se usa la etiqueta por defecto del estado.
  final String? label;

  /// Si `true`, muestra solo el punto de color sin texto.
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final config = _statusConfig[status]!;
    final displayLabel = label ?? config.label;

    if (compact) {
      return Semantics(
        label: displayLabel,
        child: Container(
          width: 10,
          height: 10,
          decoration: BoxDecoration(
            color: config.color,
            shape: BoxShape.circle,
          ),
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: config.color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: config.color.withValues(alpha: 0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(
              color: config.color,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 6),
          Text(
            displayLabel,
            style: Theme.of(context).textTheme.labelSmall?.copyWith(
              color: config.color,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

// ── Status Config ─────────────────────────────────────────────────────────────

class _StatusConfig {
  const _StatusConfig({required this.label, required this.color});

  final String label;
  final Color color;
}

const _statusConfig = {
  AppStatus.active: _StatusConfig(label: 'Activo', color: Color(0xFF10B981)),
  AppStatus.inactive: _StatusConfig(
    label: 'Inactivo',
    color: Color(0xFF6B7280),
  ),
  AppStatus.pending: _StatusConfig(
    label: 'Pendiente',
    color: Color(0xFFF59E0B),
  ),
  AppStatus.confirmed: _StatusConfig(
    label: 'Confirmada',
    color: Color(0xFF10B981),
  ),
  AppStatus.cancelled: _StatusConfig(
    label: 'Cancelada',
    color: Color(0xFFEF4444),
  ),
  AppStatus.featured: _StatusConfig(
    label: 'Destacado',
    color: Color(0xFF8B5CF6),
  ),
  AppStatus.draft: _StatusConfig(label: 'Borrador', color: Color(0xFF6B7280)),
  AppStatus.published: _StatusConfig(
    label: 'Publicado',
    color: Color(0xFF10B981),
  ),
};
