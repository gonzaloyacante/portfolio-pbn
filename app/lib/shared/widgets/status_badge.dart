import 'package:flutter/material.dart';

// ── Status ────────────────────────────────────────────────────────────────────

/// Estados posibles de un recurso (contacto, reserva, proyecto, etc.)
enum AppStatus { active, inactive, pending, confirmed, cancelled, featured, draft, published, approved, rejected }

// ── StatusBadge ───────────────────────────────────────────────────────────────

/// Badge de estado con icono, color semántico y etiqueta.
///
/// Uso:
/// ```dart
/// StatusBadge(status: AppStatus.active)
/// StatusBadge(status: AppStatus.pending, label: 'Revisión pendiente')
/// StatusBadge(status: AppStatus.active, compact: true) // Solo punto de color
/// ```
class StatusBadge extends StatelessWidget {
  const StatusBadge({super.key, required this.status, this.label, this.compact = false, this.small = false});

  final AppStatus status;

  /// Etiqueta personalizada. Si null, se usa la etiqueta por defecto del estado.
  final String? label;

  /// Si `true`, muestra solo el punto de color sin texto ni icono.
  final bool compact;

  /// Si `true`, usa fuente y padding más reducidos.
  final bool small;

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
          decoration: BoxDecoration(color: config.color, shape: BoxShape.circle),
        ),
      );
    }

    return Container(
      padding: EdgeInsets.symmetric(horizontal: small ? 7 : 10, vertical: small ? 3 : 5),
      decoration: BoxDecoration(
        color: config.color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: config.color.withValues(alpha: 0.25)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(config.icon, size: small ? 10 : 13, color: config.color),
          SizedBox(width: small ? 3 : 5),
          Text(
            displayLabel,
            style: TextStyle(
              color: config.color,
              fontSize: small ? 10 : 12,
              fontWeight: FontWeight.w700,
              letterSpacing: 0.2,
            ),
          ),
        ],
      ),
    );
  }
}

// ── Status Config ─────────────────────────────────────────────────────────────

class _StatusConfig {
  const _StatusConfig({required this.label, required this.color, required this.icon});

  final String label;
  final Color color;
  final IconData icon;
}

const _statusConfig = {
  AppStatus.active: _StatusConfig(label: 'Activo', color: Color(0xFF10B981), icon: Icons.check_circle_outline),
  AppStatus.inactive: _StatusConfig(label: 'Inactivo', color: Color(0xFF6B7280), icon: Icons.cancel_outlined),
  AppStatus.pending: _StatusConfig(label: 'Pendiente', color: Color(0xFFF59E0B), icon: Icons.hourglass_empty_outlined),
  AppStatus.confirmed: _StatusConfig(label: 'Confirmada', color: Color(0xFF10B981), icon: Icons.check_circle_outline),
  AppStatus.cancelled: _StatusConfig(label: 'Cancelada', color: Color(0xFFEF4444), icon: Icons.close),
  AppStatus.featured: _StatusConfig(label: 'Destacado', color: Color(0xFF8B5CF6), icon: Icons.star_outline),
  AppStatus.draft: _StatusConfig(label: 'Borrador', color: Color(0xFF6B7280), icon: Icons.edit_outlined),
  AppStatus.published: _StatusConfig(label: 'Publicado', color: Color(0xFF10B981), icon: Icons.public),
  AppStatus.approved: _StatusConfig(label: 'Aprobado', color: Color(0xFF10B981), icon: Icons.verified_outlined),
  AppStatus.rejected: _StatusConfig(label: 'Rechazado', color: Color(0xFFEF4444), icon: Icons.block_outlined),
};

// ── Helper: string → AppStatus ───────────────────────────────────────────────

/// Convierte un string de status API a [AppStatus].
AppStatus appStatusFromString(String? s) {
  switch ((s ?? '').toUpperCase()) {
    case 'ACTIVE':
      return AppStatus.active;
    case 'INACTIVE':
      return AppStatus.inactive;
    case 'PENDING':
      return AppStatus.pending;
    case 'APPROVED':
      return AppStatus.approved;
    case 'REJECTED':
      return AppStatus.rejected;
    case 'CONFIRMED':
      return AppStatus.confirmed;
    case 'CANCELLED':
    case 'CANCELED':
      return AppStatus.cancelled;
    case 'FEATURED':
      return AppStatus.featured;
    case 'DRAFT':
      return AppStatus.draft;
    case 'PUBLISHED':
    case 'TRUE':
      return AppStatus.published;
    default:
      return AppStatus.pending;
  }
}

// ── Helper: string → AppStatus ───────────────────────────────────────────────
