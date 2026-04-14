import 'package:flutter/material.dart';

import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../app_card.dart';
import 'shimmer_loader.dart';

// ── Dashboard stats ───────────────────────────────────────────────────────────

/// Réplica exacta de `StatCard`:
/// icono + valor + label.
class SkeletonStatCard extends StatelessWidget {
  const SkeletonStatCard({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppCard(
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Row(
        children: [
          ShimmerBox(width: 36, height: 36, borderRadius: 12),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ShimmerBox(width: double.infinity, height: 18, borderRadius: 6),
                const SizedBox(height: 4),
                ShimmerBox(width: 80, height: 11, borderRadius: 5),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Esqueleto de sección de ranking (top images, top locations).
class SkeletonRankingItem extends StatelessWidget {
  const SkeletonRankingItem({super.key});

  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          ShimmerBox(width: 24, height: 24, borderRadius: 6),
          const SizedBox(width: 12),
          Expanded(
            child: ShimmerBox(
              width: double.infinity,
              height: 11,
              borderRadius: 5,
            ),
          ),
          const SizedBox(width: 12),
          ShimmerBox(width: 40, height: 11, borderRadius: 5),
        ],
      ),
    );
  }
}

/// Skeleton del widget `DeviceUsageSection`:
/// 3 columnas con icono + porcentaje + label.
class SkeletonDeviceUsageSection extends StatelessWidget {
  const SkeletonDeviceUsageSection({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      elevation: 0,
      borderRadius: const BorderRadius.circular(16),
      padding: const EdgeInsets.all(AppSpacing.base),
      child: ShimmerLoader(
        child: Row(
          children: List.generate(
            3,
            (_) => const Expanded(
              child: Column(
                children: [
                  ShimmerBox(width: 28, height: 28, borderRadius: 8),
                  const SizedBox(height: 6),
                  ShimmerBox(width: 48, height: 20, borderRadius: 4),
                  const SizedBox(height: 4),
                  ShimmerBox(width: 56, height: 11, borderRadius: 4),
                  const SizedBox(height: 2),
                  ShimmerBox(width: 64, height: 10, borderRadius: 4),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Skeleton del widget `VisitorsMapWidget`:
/// caja de mapa + lista de países.
class SkeletonVisitorsMap extends StatelessWidget {
  const SkeletonVisitorsMap({super.key});

  @override
  Widget build(BuildContext context) {
    return ShimmerLoader(
      child: Column(
        children: [
          AppCard(
            elevation: 0,
            borderRadius: const BorderRadius.circular(16),
            padding: EdgeInsets.zero,
            child: const ShimmerBox(
              width: double.infinity,
              height: 220,
              borderRadius: 16,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          ...List.generate(
            4,
            (_) => const Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                children: [
                  ShimmerBox(width: 24, height: 16, borderRadius: 3),
                  const SizedBox(width: 10),
                  Expanded(
                    child: ShimmerBox(
                      width: double.infinity,
                      height: 11,
                      borderRadius: 4,
                    ),
                  ),
                  const SizedBox(width: 10),
                  ShimmerBox(width: 36, height: 11, borderRadius: 4),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ── Social Links ──────────────────────────────────────────────────────────────

/// Réplica de un tile de red social:
/// icono + nombre de plataforma + URL input y switch.
class SkeletonSocialTile extends StatelessWidget {
  const SkeletonSocialTile({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      borderRadius: AppRadius.forTile,
      padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
      child: const Row(
        children: [
          ShimmerBox(width: 40, height: 40, borderRadius: 12),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ShimmerBox(width: double.infinity, height: 13, borderRadius: 6),
                const SizedBox(height: 5),
                ShimmerBox(width: 180, height: 11, borderRadius: 5),
              ],
            ),
          ),
          const SizedBox(width: 12),
          ShimmerBox(width: 44, height: 24, borderRadius: 12),
        ],
      ),
    );
  }
}

/// Lista shimmer de redes sociales — replica tiles de plataformas × N.
class SkeletonSocialList extends StatelessWidget {
  const SkeletonSocialList({super.key, this.itemCount = 6});
  final int itemCount;

  @override
  Widget build(BuildContext context) {
    return ShimmerLoader(
      child: ListView.separated(
        padding: AppBreakpoints.pagePadding(context),
        itemCount: itemCount,
        separatorBuilder: (_, _) => const SizedBox(height: AppSpacing.sm),
        itemBuilder: (_, _) => const SkeletonSocialTile(),
      ),
    );
  }
}

// ── Settings Forms ────────────────────────────────────────────────────────────

/// Réplica de `SettingsFormCard`:
/// título de sección + N campos de input.
class SkeletonSettingsFormCard extends StatelessWidget {
  const SkeletonSettingsFormCard({
    super.key,
    this.fieldCount = 3,
    this.hasLargeField = false,
  });

  /// Número de campos input a mostrar.
  final int fieldCount;

  /// Si `true` el último campo es más alto (TextArea).
  final bool hasLargeField;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const ShimmerBox(width: 120, height: 14, borderRadius: 6),
          const SizedBox(height: AppSpacing.base),
          ...List.generate(fieldCount, (i) {
            final height = (hasLargeField && i == fieldCount - 1) ? 80.0 : 48.0;
            return Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const ShimmerBox(width: 80, height: 11, borderRadius: 5),
                  const SizedBox(height: 6),
                  ShimmerBox(
                    width: double.infinity,
                    height: height,
                    borderRadius: 10,
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}

/// Página de settings skeleton — N form cards apiladas.
class SkeletonSettingsPage extends StatelessWidget {
  const SkeletonSettingsPage({
    super.key,
    this.cardCount = 3,
    this.fieldsPerCard = 3,
  });

  final int cardCount;
  final int fieldsPerCard;

  @override
  Widget build(BuildContext context) {
    final padding = AppBreakpoints.pagePadding(context);
    return ShimmerLoader(
      child: ListView.separated(
        padding: padding,
        itemCount: cardCount,
        separatorBuilder: (_, _) => const SizedBox(height: AppSpacing.md),
        itemBuilder: (_, i) => SkeletonSettingsFormCard(
          fieldCount: fieldsPerCard,
          hasLargeField: i == cardCount - 1,
        ),
      ),
    );
  }
}
