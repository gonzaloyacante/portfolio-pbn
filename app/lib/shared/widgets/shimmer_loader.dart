import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shimmer/shimmer.dart';

import '../../core/providers/app_preferences_provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_breakpoints.dart';
import '../../core/theme/app_radius.dart';
import '../../core/theme/app_spacing.dart';
import 'app_card.dart';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BASE LAYER — ShimmerLoader + ShimmerBox
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/// Envuelve su hijo con el efecto shimmer.
///
/// Todos los skeleton widgets deben estar dentro de un [ShimmerLoader].
/// Cuando [isLoading] es `false` el hijo se renderiza sin efecto.
/// Cuando las animaciones están deshabilitadas en preferencias, muestra
/// el hijo con un fondo estático en lugar del efecto animado.
class ShimmerLoader extends ConsumerWidget {
  const ShimmerLoader({super.key, required this.child, this.isLoading = true});

  final Widget child;
  final bool isLoading;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (!isLoading) return child;

    final animationsEnabled = ref.watch(animationsEnabledProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    // Sin animaciones: caja estática con el color base del skeleton.
    if (!animationsEnabled) {
      return ColorFiltered(
        colorFilter: ColorFilter.mode(
          isDark ? AppColors.darkMuted : AppColors.lightBorder,
          BlendMode.srcATop,
        ),
        child: child,
      );
    }

    return Shimmer.fromColors(
      baseColor: isDark ? AppColors.darkMuted : AppColors.lightBorder,
      highlightColor: isDark ? const Color(0xFF3A2020) : AppColors.lightMuted,
      child: child,
    );
  }
}

/// Caja rectangular shimmer — el átomo de todo skeleton.
class ShimmerBox extends StatelessWidget {
  const ShimmerBox({
    super.key,
    required this.width,
    required this.height,
    this.borderRadius,
  });

  final double width;
  final double height;
  final double? borderRadius;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkMuted : AppColors.lightCard,
        borderRadius: BorderRadius.circular(borderRadius ?? AppRadius.sm),
      ),
    );
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GENERIC LAYER (backward-compatible)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/// Tarjeta esqueleto genérica — icono circular + 3 líneas de texto.
class SkeletonCard extends StatelessWidget {
  const SkeletonCard({super.key, this.hasImage = true});

  final bool hasImage;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(
        horizontal: AppBreakpoints.pageMargin(context),
        vertical: AppSpacing.xs + 2,
      ),
      child: AppCard(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (hasImage) ...[
              const ShimmerBox(width: 60, height: 60, borderRadius: AppRadius.tile),
              const SizedBox(width: AppSpacing.md),
            ],
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ShimmerBox(width: double.infinity, height: 16),
                  SizedBox(height: AppSpacing.sm),
                  ShimmerBox(width: 200, height: 12),
                  SizedBox(height: AppSpacing.xs + 2),
                  ShimmerBox(width: 140, height: 12),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Tarjeta esqueleto para grids — imagen + título + tags.
class SkeletonGridCard extends StatelessWidget {
  const SkeletonGridCard({super.key, this.hasImage = true});

  final bool hasImage;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: EdgeInsets.zero,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (hasImage) ...[
            Expanded(
              child: ClipRRect(
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(AppRadius.card),
                  topRight: Radius.circular(AppRadius.card),
                ),
                child: Container(width: double.infinity, color: Colors.white),
              ),
            ),
          ],
          const Padding(
            padding: EdgeInsets.all(AppSpacing.md),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                ShimmerBox(width: double.infinity, height: 14),
                SizedBox(height: AppSpacing.xs + 2),
                ShimmerBox(width: 100, height: 11),
                SizedBox(height: AppSpacing.sm),
                Row(
                  children: [
                    ShimmerBox(width: 48, height: 20),
                    SizedBox(width: AppSpacing.xs),
                    ShimmerBox(width: 48, height: 20),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Lista de [SkeletonCard] envuelta en [ShimmerLoader].
class SkeletonListView extends StatelessWidget {
  const SkeletonListView({super.key, this.itemCount = 6, this.hasImage = true});

  final int itemCount;
  final bool hasImage;

  @override
  Widget build(BuildContext context) {
    return ShimmerLoader(
      child: ListView.builder(
        itemCount: itemCount,
        itemBuilder: (_, _) => SkeletonCard(hasImage: hasImage),
      ),
    );
  }
}

/// Grid de [SkeletonGridCard] envuelto en [ShimmerLoader].
class SkeletonGridView extends StatelessWidget {
  const SkeletonGridView({
    super.key,
    this.itemCount = 6,
    this.childAspectRatio = 0.85,
    this.compactCols = 2,
    this.hasImage = true,
  });

  final int itemCount;
  final double childAspectRatio;
  final int compactCols;
  final bool hasImage;

  @override
  Widget build(BuildContext context) {
    final cols = AppBreakpoints.gridColumns(
      context,
      compact: compactCols,
      medium: compactCols + 1,
      expanded: compactCols + 2,
    );
    final spacing = AppBreakpoints.gutter(context);
    final hPad = AppBreakpoints.pageMargin(context);

    return ShimmerLoader(
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        padding: EdgeInsets.symmetric(
          horizontal: hPad,
          vertical: AppSpacing.sm,
        ),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: cols,
          mainAxisSpacing: spacing,
          crossAxisSpacing: spacing,
          childAspectRatio: childAspectRatio,
        ),
        itemCount: itemCount,
        itemBuilder: (_, _) => SkeletonGridCard(hasImage: hasImage),
      ),
    );
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DOMAIN LAYER — Skeletons específicos por dominio
// Cada widget es réplica exacta de la card/tile real.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── Services ─────────────────────────────────────────────────────────────────

/// Réplica exacta de `_ServiceTile`:
/// icono 46×46 + nombre + precio + estado.
class SkeletonServiceTile extends StatelessWidget {
  const SkeletonServiceTile({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      borderRadius: AppRadius.forTile,
      padding: const EdgeInsets.fromLTRB(14, 12, 4, 12),
      child: const Row(
        children: [
          ShimmerBox(width: 46, height: 46, borderRadius: 14),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: ShimmerBox(
                        width: double.infinity,
                        height: 13,
                        borderRadius: 6,
                      ),
                    ),
                    SizedBox(width: 8),
                    ShimmerBox(width: 52, height: 20, borderRadius: 10),
                  ],
                ),
                SizedBox(height: 5),
                ShimmerBox(width: 130, height: 11, borderRadius: 5),
                SizedBox(height: 3),
                ShimmerBox(width: 180, height: 11, borderRadius: 5),
              ],
            ),
          ),
          SizedBox(width: 4),
          ShimmerBox(width: 20, height: 20, borderRadius: 4),
          SizedBox(width: 8),
        ],
      ),
    );
  }
}

/// Réplica exacta de `_ServiceGridCard`:
/// icono + nombre + precio + badge de estado.
class SkeletonServiceGridCard extends StatelessWidget {
  const SkeletonServiceGridCard({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      borderRadius: AppRadius.forTile,
      padding: const EdgeInsets.fromLTRB(12, 14, 4, 12),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              ShimmerBox(width: 46, height: 46, borderRadius: 14),
              Spacer(),
              ShimmerBox(width: 18, height: 18, borderRadius: 4),
              SizedBox(width: 8),
            ],
          ),
          SizedBox(height: 10),
          ShimmerBox(width: double.infinity, height: 13, borderRadius: 6),
          SizedBox(height: 4),
          ShimmerBox(width: 60, height: 11, borderRadius: 5),
          Spacer(),
          ShimmerBox(width: 54, height: 20, borderRadius: 10),
        ],
      ),
    );
  }
}

// ── Categories ────────────────────────────────────────────────────────────────

/// Réplica exacta de `_CategoryTile`:
/// thumbnail 80×80 en full-height + nombre + count.
class SkeletonCategoryTile extends StatelessWidget {
  const SkeletonCategoryTile({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      borderRadius: AppRadius.forTile,
      padding: EdgeInsets.zero,
      child: const SizedBox(
        height: 80,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Thumbnail area
            ClipRRect(
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(AppRadius.tile),
                bottomLeft: Radius.circular(AppRadius.tile),
              ),
              child: ShimmerBox(width: 80, height: 80, borderRadius: 0),
            ),
            Expanded(
              child: Padding(
                padding: EdgeInsets.fromLTRB(14, 12, 4, 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: ShimmerBox(
                            width: double.infinity,
                            height: 13,
                            borderRadius: 6,
                          ),
                        ),
                        SizedBox(width: 8),
                        ShimmerBox(width: 52, height: 20, borderRadius: 10),
                      ],
                    ),
                    SizedBox(height: 5),
                    ShimmerBox(width: 100, height: 11, borderRadius: 5),
                  ],
                ),
              ),
            ),
            ShimmerBox(width: 20, height: 20, borderRadius: 4),
            SizedBox(width: 8),
          ],
        ),
      ),
    );
  }
}

/// Réplica exacta de `_CategoryGridCard`:
/// imagen 100px + nombre + count + badge.
class SkeletonCategoryGridCard extends StatelessWidget {
  const SkeletonCategoryGridCard({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      borderRadius: AppRadius.forTile,
      padding: EdgeInsets.zero,
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.vertical(
              top: Radius.circular(AppRadius.tile),
            ),
            child: ShimmerBox(
              width: double.infinity,
              height: 100,
              borderRadius: 0,
            ),
          ),
          Padding(
            padding: EdgeInsets.fromLTRB(10, 8, 10, 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ShimmerBox(
                  width: double.infinity,
                  height: 13,
                  borderRadius: 6,
                ),
                SizedBox(height: 4),
                ShimmerBox(width: 80, height: 11, borderRadius: 5),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── Projects ──────────────────────────────────────────────────────────────────

/// Réplica exacta de `_ProjectTile`:
/// thumbnail 80×90 + título + categoría + tags.
class SkeletonProjectTile extends StatelessWidget {
  const SkeletonProjectTile({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      borderRadius: AppRadius.forTile,
      padding: EdgeInsets.zero,
      child: const SizedBox(
        height: 90,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Thumbnail
            ClipRRect(
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(AppRadius.tile),
                bottomLeft: Radius.circular(AppRadius.tile),
              ),
              child: ShimmerBox(width: 80, height: 90, borderRadius: 0),
            ),
            Expanded(
              child: Padding(
                padding: EdgeInsets.fromLTRB(14, 10, 4, 10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: ShimmerBox(
                            width: double.infinity,
                            height: 13,
                            borderRadius: 6,
                          ),
                        ),
                        SizedBox(width: 8),
                        ShimmerBox(width: 52, height: 20, borderRadius: 10),
                      ],
                    ),
                    SizedBox(height: 5),
                    ShimmerBox(width: 110, height: 11, borderRadius: 5),
                    SizedBox(height: 6),
                    Row(
                      children: [
                        ShimmerBox(width: 44, height: 18, borderRadius: 9),
                        SizedBox(width: 4),
                        ShimmerBox(width: 44, height: 18, borderRadius: 9),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            ShimmerBox(width: 20, height: 20, borderRadius: 4),
            SizedBox(width: 8),
          ],
        ),
      ),
    );
  }
}

/// Réplica exacta de `_ProjectGridCard`:
/// imagen 140px + nombre + categoría + tags.
class SkeletonProjectGridCard extends StatelessWidget {
  const SkeletonProjectGridCard({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      borderRadius: AppRadius.forTile,
      padding: EdgeInsets.zero,
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.vertical(
              top: Radius.circular(AppRadius.tile),
            ),
            child: ShimmerBox(
              width: double.infinity,
              height: 140,
              borderRadius: 0,
            ),
          ),
          Padding(
            padding: EdgeInsets.fromLTRB(12, 8, 12, 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ShimmerBox(
                  width: double.infinity,
                  height: 13,
                  borderRadius: 6,
                ),
                SizedBox(height: 4),
                ShimmerBox(width: 90, height: 11, borderRadius: 5),
                SizedBox(height: 8),
                Row(
                  children: [
                    ShimmerBox(width: 44, height: 18, borderRadius: 9),
                    SizedBox(width: 4),
                    ShimmerBox(width: 44, height: 18, borderRadius: 9),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── Contacts ──────────────────────────────────────────────────────────────────

/// Réplica exacta de `_ContactTile`:
/// avatar 44×44 + nombre + email + teléfono.
class SkeletonContactTile extends StatelessWidget {
  const SkeletonContactTile({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      borderRadius: AppRadius.forTile,
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
      child: const Row(
        children: [
          ShimmerBox(width: 44, height: 44, borderRadius: 14),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ShimmerBox(width: double.infinity, height: 13, borderRadius: 6),
                SizedBox(height: 5),
                ShimmerBox(width: 160, height: 11, borderRadius: 5),
                SizedBox(height: 4),
                ShimmerBox(width: 220, height: 11, borderRadius: 5),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── Testimonials ──────────────────────────────────────────────────────────────

/// Réplica exacta de `_TestimonialTile`:
/// avatar + nombre + estrellas + cita + badge de estado.
class SkeletonTestimonialCard extends StatelessWidget {
  const SkeletonTestimonialCard({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      borderRadius: AppRadius.forTile,
      padding: const EdgeInsets.fromLTRB(14, 12, 4, 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Avatar circular
          const ShimmerBox(width: 44, height: 44, borderRadius: 22),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Nombre + estrellas
                Row(
                  children: [
                    const Expanded(
                      child: ShimmerBox(
                        width: double.infinity,
                        height: 13,
                        borderRadius: 6,
                      ),
                    ),
                    const SizedBox(width: 8),
                    // 5 estrellitas
                    Row(
                      children: List.generate(
                        5,
                        (_) => const Padding(
                          padding: EdgeInsets.only(left: 2),
                          child: ShimmerBox(
                            width: 12,
                            height: 12,
                            borderRadius: 3,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                // Cargo / empresa
                const ShimmerBox(width: 140, height: 11, borderRadius: 5),
                const SizedBox(height: 8),
                // Cita (2 líneas)
                const ShimmerBox(
                  width: double.infinity,
                  height: 11,
                  borderRadius: 5,
                ),
                const SizedBox(height: 3),
                const ShimmerBox(width: 200, height: 11, borderRadius: 5),
                const SizedBox(height: 8),
                // Badge de estado
                const ShimmerBox(width: 68, height: 20, borderRadius: 10),
              ],
            ),
          ),
          const SizedBox(width: 4),
          const ShimmerBox(width: 20, height: 20, borderRadius: 4),
          const SizedBox(width: 8),
        ],
      ),
    );
  }
}

// ── Trash ─────────────────────────────────────────────────────────────────────

/// Réplica exacta de `_TrashCard`:
/// avatar circular + nombre + tipo + días + botones de acción.
class SkeletonTrashCard extends StatelessWidget {
  const SkeletonTrashCard({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppCard(
      borderRadius: BorderRadius.all(Radius.circular(16)),
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              ShimmerBox(width: 44, height: 44, borderRadius: 22),
              SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ShimmerBox(
                      width: double.infinity,
                      height: 13,
                      borderRadius: 6,
                    ),
                    SizedBox(height: 4),
                    ShimmerBox(width: 80, height: 11, borderRadius: 5),
                  ],
                ),
              ),
              SizedBox(width: 8),
              ShimmerBox(width: 60, height: 20, borderRadius: 10),
            ],
          ),
          SizedBox(height: 12),
          // Acción buttons
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              ShimmerBox(width: 80, height: 30, borderRadius: 12),
              SizedBox(width: 8),
              ShimmerBox(width: 80, height: 30, borderRadius: 12),
            ],
          ),
        ],
      ),
    );
  }
}

// ── Bookings / Calendar ───────────────────────────────────────────────────────

/// Réplica exacta de `_BookingCard`:
/// badge de hora 46×46 + nombre del cliente + servicio + estado.
class SkeletonBookingCard extends StatelessWidget {
  const SkeletonBookingCard({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      borderRadius: AppRadius.forTile,
      padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
      child: const Row(
        children: [
          // Time badge
          ShimmerBox(width: 46, height: 46, borderRadius: 14),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: ShimmerBox(
                        width: double.infinity,
                        height: 13,
                        borderRadius: 6,
                      ),
                    ),
                    SizedBox(width: 8),
                    ShimmerBox(width: 56, height: 20, borderRadius: 10),
                  ],
                ),
                SizedBox(height: 4),
                Row(
                  children: [
                    ShimmerBox(width: 13, height: 13, borderRadius: 4),
                    SizedBox(width: 4),
                    ShimmerBox(width: 140, height: 11, borderRadius: 5),
                  ],
                ),
              ],
            ),
          ),
          SizedBox(width: 8),
          ShimmerBox(width: 20, height: 20, borderRadius: 4),
        ],
      ),
    );
  }
}

/// Sección de calendario: cabecera de día + lista de booking cards.
class SkeletonCalendarSection extends StatelessWidget {
  const SkeletonCalendarSection({super.key, this.bookingsPerSection = 2});

  final int bookingsPerSection;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Day label
        const Padding(
          padding: EdgeInsets.only(bottom: 8),
          child: ShimmerBox(width: 140, height: 14, borderRadius: 6),
        ),
        ...List.generate(
          bookingsPerSection,
          (_) => const Padding(
            padding: EdgeInsets.only(bottom: 8),
            child: SkeletonBookingCard(),
          ),
        ),
      ],
    );
  }
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

/// Réplica exacta de `StatCard`:
/// icono + valor + label.
class SkeletonStatCard extends StatelessWidget {
  const SkeletonStatCard({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppCard(
      padding: EdgeInsets.all(AppSpacing.md),
      child: Row(
        children: [
          ShimmerBox(width: 36, height: 36, borderRadius: 12),
          SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ShimmerBox(
                  width: double.infinity,
                  height: 18,
                  borderRadius: 6,
                ),
                SizedBox(height: 4),
                ShimmerBox(width: 80, height: 11, borderRadius: 5),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Esqueleto de sección de ranking (top projects, top locations).
class SkeletonRankingItem extends StatelessWidget {
  const SkeletonRankingItem({super.key});

  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          ShimmerBox(width: 24, height: 24, borderRadius: 6),
          SizedBox(width: 12),
          Expanded(
            child: ShimmerBox(
              width: double.infinity,
              height: 11,
              borderRadius: 5,
            ),
          ),
          SizedBox(width: 12),
          ShimmerBox(width: 40, height: 11, borderRadius: 5),
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
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ShimmerBox(
                  width: double.infinity,
                  height: 13,
                  borderRadius: 6,
                ),
                SizedBox(height: 5),
                ShimmerBox(width: 180, height: 11, borderRadius: 5),
              ],
            ),
          ),
          SizedBox(width: 12),
          ShimmerBox(width: 44, height: 24, borderRadius: 12),
        ],
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

  /// Si `true` el primero campo es más alto (TextArea).
  final bool hasLargeField;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Card title
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPOSITE LAYER — Listas y Grids completos listos para usar en páginas
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── Services composite ────────────────────────────────────────────────────────

/// Lista shimmer de servicios — replica `_ServiceTile` × N.
class SkeletonServicesList extends StatelessWidget {
  const SkeletonServicesList({super.key, this.itemCount = 6});
  final int itemCount;

  @override
  Widget build(BuildContext context) {
    final hPad = AppBreakpoints.pageMargin(context);
    return ShimmerLoader(
      child: ListView.separated(
        padding: EdgeInsets.symmetric(horizontal: hPad),
        itemCount: itemCount,
        separatorBuilder: (_, _) => const SizedBox(height: 8),
        itemBuilder: (_, _) => const SkeletonServiceTile(),
      ),
    );
  }
}

/// Grid shimmer de servicios — replica `_ServiceGridCard` × N.
class SkeletonServicesGrid extends StatelessWidget {
  const SkeletonServicesGrid({super.key, this.itemCount = 6});
  final int itemCount;

  @override
  Widget build(BuildContext context) {
    final hPad = AppBreakpoints.pageMargin(context);
    final spacing = AppBreakpoints.gutter(context);
    final cols = AppBreakpoints.gridColumns(
      context,
      compact: 2,
      medium: 3,
      expanded: 4,
    );
    return ShimmerLoader(
      child: GridView.builder(
        padding: EdgeInsets.fromLTRB(hPad, 0, hPad, AppSpacing.base),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: cols,
          crossAxisSpacing: spacing,
          mainAxisSpacing: spacing,
          childAspectRatio: 1.05,
        ),
        itemCount: itemCount,
        itemBuilder: (_, _) => const SkeletonServiceGridCard(),
      ),
    );
  }
}

// ── Categories composite ──────────────────────────────────────────────────────

/// Lista shimmer de categorías — replica `_CategoryTile` × N.
class SkeletonCategoriesList extends StatelessWidget {
  const SkeletonCategoriesList({super.key, this.itemCount = 8});
  final int itemCount;

  @override
  Widget build(BuildContext context) {
    final hPad = AppBreakpoints.pageMargin(context);
    return ShimmerLoader(
      child: ListView.separated(
        padding: EdgeInsets.symmetric(horizontal: hPad),
        itemCount: itemCount,
        separatorBuilder: (_, _) => const SizedBox(height: 8),
        itemBuilder: (_, _) => const SkeletonCategoryTile(),
      ),
    );
  }
}

/// Grid shimmer de categorías — replica `_CategoryGridCard` × N.
class SkeletonCategoriesGrid extends StatelessWidget {
  const SkeletonCategoriesGrid({super.key, this.itemCount = 8});
  final int itemCount;

  @override
  Widget build(BuildContext context) {
    final hPad = AppBreakpoints.pageMargin(context);
    final width = MediaQuery.sizeOf(context).width;
    final cols = width >= 900 ? 3 : 2;
    return ShimmerLoader(
      child: GridView.builder(
        padding: EdgeInsets.symmetric(horizontal: hPad),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: cols,
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 1.1,
        ),
        itemCount: itemCount,
        itemBuilder: (_, _) => const SkeletonCategoryGridCard(),
      ),
    );
  }
}

// ── Projects composite ────────────────────────────────────────────────────────

/// Lista shimmer de proyectos — replica `_ProjectTile` × N.
class SkeletonProjectsList extends StatelessWidget {
  const SkeletonProjectsList({super.key, this.itemCount = 8});
  final int itemCount;

  @override
  Widget build(BuildContext context) {
    final hPad = AppBreakpoints.pageMargin(context);
    return ShimmerLoader(
      child: ListView.separated(
        padding: EdgeInsets.symmetric(horizontal: hPad),
        itemCount: itemCount,
        separatorBuilder: (_, _) => const SizedBox(height: 8),
        itemBuilder: (_, _) => const SkeletonProjectTile(),
      ),
    );
  }
}

/// Grid shimmer de proyectos — replica `_ProjectGridCard` × N.
class SkeletonProjectsGrid extends StatelessWidget {
  const SkeletonProjectsGrid({super.key, this.itemCount = 8});
  final int itemCount;

  @override
  Widget build(BuildContext context) {
    final hPad = AppBreakpoints.pageMargin(context);
    final spacing = AppBreakpoints.gutter(context);
    final cols = AppBreakpoints.gridColumns(
      context,
      compact: 2,
      medium: 3,
      expanded: 4,
    );
    return ShimmerLoader(
      child: GridView.builder(
        padding: EdgeInsets.fromLTRB(hPad, 0, hPad, AppSpacing.base),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: cols,
          crossAxisSpacing: spacing,
          mainAxisSpacing: spacing,
          childAspectRatio: 0.78,
        ),
        itemCount: itemCount,
        itemBuilder: (_, _) => const SkeletonProjectGridCard(),
      ),
    );
  }
}

// ── Contacts composite ────────────────────────────────────────────────────────

/// Lista shimmer de contactos — replica `_ContactTile` × N.
class SkeletonContactsList extends StatelessWidget {
  const SkeletonContactsList({super.key, this.itemCount = 8});
  final int itemCount;

  @override
  Widget build(BuildContext context) {
    final hPad = AppBreakpoints.pageMargin(context);
    return ShimmerLoader(
      child: ListView.separated(
        padding: EdgeInsets.symmetric(horizontal: hPad),
        itemCount: itemCount,
        separatorBuilder: (_, _) => const SizedBox(height: 6),
        itemBuilder: (_, _) => const SkeletonContactTile(),
      ),
    );
  }
}

// ── Testimonials composite ────────────────────────────────────────────────────

/// Lista shimmer de testimonios — replica `_TestimonialTile` × N.
class SkeletonTestimonialsList extends StatelessWidget {
  const SkeletonTestimonialsList({super.key, this.itemCount = 6});
  final int itemCount;

  @override
  Widget build(BuildContext context) {
    final hPad = AppBreakpoints.pageMargin(context);
    return ShimmerLoader(
      child: ListView.separated(
        padding: EdgeInsets.symmetric(horizontal: hPad),
        itemCount: itemCount,
        separatorBuilder: (_, _) => const SizedBox(height: 8),
        itemBuilder: (_, _) => const SkeletonTestimonialCard(),
      ),
    );
  }
}

// ── Trash composite ───────────────────────────────────────────────────────────

/// Lista shimmer de papelera — replica `_TrashCard` × N.
class SkeletonTrashList extends StatelessWidget {
  const SkeletonTrashList({super.key, this.itemCount = 6});
  final int itemCount;

  @override
  Widget build(BuildContext context) {
    return ShimmerLoader(
      child: ListView.separated(
        padding: const EdgeInsets.all(AppSpacing.base),
        itemCount: itemCount,
        separatorBuilder: (_, _) => const SizedBox(height: 10),
        itemBuilder: (_, _) => const SkeletonTrashCard(),
      ),
    );
  }
}

// ── Calendar composite ────────────────────────────────────────────────────────

/// Lista shimmer de calendario — varias secciones de días con reservas.
class SkeletonCalendarList extends StatelessWidget {
  const SkeletonCalendarList({super.key, this.sectionCount = 3});
  final int sectionCount;

  @override
  Widget build(BuildContext context) {
    final hPad = AppBreakpoints.pageMargin(context);
    return ShimmerLoader(
      child: ListView.separated(
        padding: EdgeInsets.fromLTRB(hPad, 0, hPad, AppSpacing.xl),
        itemCount: sectionCount,
        separatorBuilder: (_, _) => const SizedBox(height: 16),
        itemBuilder: (_, _) => const SkeletonCalendarSection(),
      ),
    );
  }
}

// ── Social composite ──────────────────────────────────────────────────────────

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

// ── Settings composite ────────────────────────────────────────────────────────

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

// ── Dashboard: Device Usage ───────────────────────────────────────────────────

/// Skeleton del widget `DeviceUsageSection`:
/// 3 columnas con icono + porcentaje + label.
class SkeletonDeviceUsageSection extends StatelessWidget {
  const SkeletonDeviceUsageSection({super.key});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      elevation: 0,
      borderRadius: BorderRadius.circular(16),
      padding: const EdgeInsets.all(AppSpacing.base),
      child: ShimmerLoader(
        child: Row(
          children: List.generate(
            3,
            (_) => const Expanded(
              child: Column(
                children: [
                  ShimmerBox(width: 28, height: 28, borderRadius: 8),
                  SizedBox(height: 6),
                  ShimmerBox(width: 48, height: 20, borderRadius: 4),
                  SizedBox(height: 4),
                  ShimmerBox(width: 56, height: 11, borderRadius: 4),
                  SizedBox(height: 2),
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

// ── Dashboard: Visitors Map ───────────────────────────────────────────────────

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
            borderRadius: BorderRadius.circular(16),
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
              padding: EdgeInsets.only(bottom: 8),
              child: Row(
                children: [
                  ShimmerBox(width: 24, height: 16, borderRadius: 3),
                  SizedBox(width: 10),
                  Expanded(
                    child: ShimmerBox(
                      width: double.infinity,
                      height: 11,
                      borderRadius: 4,
                    ),
                  ),
                  SizedBox(width: 10),
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

// ── Detalle de contacto ───────────────────────────────────────────────────────

/// Skeleton para la página de detalle de contacto: 4 tarjetas apiladas.
class SkeletonContactDetail extends StatelessWidget {
  const SkeletonContactDetail({super.key});

  @override
  Widget build(BuildContext context) {
    final padding = AppBreakpoints.pagePadding(context);
    return ShimmerLoader(
      child: SingleChildScrollView(
        padding: padding,
        child: const Column(
          children: [
            ShimmerBox(width: double.infinity, height: 160, borderRadius: 16),
            SizedBox(height: AppSpacing.base),
            ShimmerBox(width: double.infinity, height: 120, borderRadius: 16),
            SizedBox(height: AppSpacing.base),
            ShimmerBox(width: double.infinity, height: 100, borderRadius: 16),
            SizedBox(height: AppSpacing.base),
            ShimmerBox(width: double.infinity, height: 100, borderRadius: 16),
          ],
        ),
      ),
    );
  }
}
