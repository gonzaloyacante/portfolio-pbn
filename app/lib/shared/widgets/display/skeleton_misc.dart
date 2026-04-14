import 'package:flutter/material.dart';

import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../app_card.dart';
import 'shimmer_loader.dart';

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
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ShimmerBox(width: double.infinity, height: 13, borderRadius: 6),
                const SizedBox(height: 5),
                ShimmerBox(width: 160, height: 11, borderRadius: 5),
                const SizedBox(height: 4),
                ShimmerBox(width: 220, height: 11, borderRadius: 5),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

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
            const SizedBox(height: AppSpacing.base),
            ShimmerBox(width: double.infinity, height: 120, borderRadius: 16),
            const SizedBox(height: AppSpacing.base),
            ShimmerBox(width: double.infinity, height: 100, borderRadius: 16),
            const SizedBox(height: AppSpacing.base),
            ShimmerBox(width: double.infinity, height: 100, borderRadius: 16),
          ],
        ),
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
          const ShimmerBox(width: 44, height: 44, borderRadius: 22),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
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
                    Row(
                      children: List.generate(
                        5,
                        (_) => const Padding(
                          padding: const EdgeInsets.only(left: 2),
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
                const ShimmerBox(width: 140, height: 11, borderRadius: 5),
                const SizedBox(height: 8),
                const ShimmerBox(
                  width: double.infinity,
                  height: 11,
                  borderRadius: 5,
                ),
                const SizedBox(height: 3),
                const ShimmerBox(width: 200, height: 11, borderRadius: 5),
                const SizedBox(height: 8),
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

// ── Trash ─────────────────────────────────────────────────────────────────────

/// Réplica exacta de `_TrashCard`:
/// avatar circular + nombre + tipo + días + botones de acción.
class SkeletonTrashCard extends StatelessWidget {
  const SkeletonTrashCard({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppCard(
      borderRadius: BorderRadius.all(Radius.circular(16)),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              ShimmerBox(width: 44, height: 44, borderRadius: 22),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ShimmerBox(
                      width: double.infinity,
                      height: 13,
                      borderRadius: 6,
                    ),
                    const SizedBox(height: 4),
                    ShimmerBox(width: 80, height: 11, borderRadius: 5),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              ShimmerBox(width: 60, height: 20, borderRadius: 10),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              ShimmerBox(width: 80, height: 30, borderRadius: 12),
              const SizedBox(width: 8),
              ShimmerBox(width: 80, height: 30, borderRadius: 12),
            ],
          ),
        ],
      ),
    );
  }
}

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
          ShimmerBox(width: 46, height: 46, borderRadius: 14),
          const SizedBox(width: 12),
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
                    const SizedBox(width: 8),
                    ShimmerBox(width: 56, height: 20, borderRadius: 10),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    ShimmerBox(width: 13, height: 13, borderRadius: 4),
                    const SizedBox(width: 4),
                    ShimmerBox(width: 140, height: 11, borderRadius: 5),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
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
        const Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: ShimmerBox(width: 140, height: 14, borderRadius: 6),
        ),
        ...List.generate(
          bookingsPerSection,
          (_) => const Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: SkeletonBookingCard(),
          ),
        ),
      ],
    );
  }
}

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
