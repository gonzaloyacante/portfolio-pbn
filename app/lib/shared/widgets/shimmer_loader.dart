import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

// ── ShimmerLoader ─────────────────────────────────────────────────────────────

/// Skeleton loader con efecto shimmer para estados de carga.
///
/// Uso:
/// ```dart
/// // Lista de tarjetas esqueleto
/// ShimmerLoader(
///   child: ListView.builder(
///     itemCount: 5,
///     itemBuilder: (_, __) => const _SkeletonCard(),
///   ),
/// )
/// ```
class ShimmerLoader extends StatelessWidget {
  const ShimmerLoader({super.key, required this.child, this.isLoading = true});

  final Widget child;
  final bool isLoading;

  @override
  Widget build(BuildContext context) {
    if (!isLoading) return child;

    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Shimmer.fromColors(
      baseColor: isDark ? const Color(0xFF2A1015) : const Color(0xFFE5E5E5),
      highlightColor: isDark
          ? const Color(0xFF3A2020)
          : const Color(0xFFF5F5F5),
      child: child,
    );
  }
}

// ── ShimmerBox ────────────────────────────────────────────────────────────────

/// Caja rectangular shimmer para usar como placeholder.
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
        color: isDark ? const Color(0xFF2A1015) : Colors.white,
        borderRadius: BorderRadius.circular(borderRadius ?? 8),
      ),
    );
  }
}

// ── SkeletonCard ──────────────────────────────────────────────────────────────

/// Tarjeta esqueleto genérica para listas de contenido.
class SkeletonCard extends StatelessWidget {
  const SkeletonCard({super.key, this.hasImage = true});

  final bool hasImage;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (hasImage) ...[
              const ShimmerBox(width: 60, height: 60, borderRadius: 12),
              const SizedBox(width: 12),
            ],
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const ShimmerBox(width: double.infinity, height: 16),
                  const SizedBox(height: 8),
                  const ShimmerBox(width: 200, height: 12),
                  const SizedBox(height: 6),
                  const ShimmerBox(width: 140, height: 12),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── SkeletonListView ──────────────────────────────────────────────────────────

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
