import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../data/category_model.dart';

class GalleryGridTile extends StatelessWidget {
  const GalleryGridTile({
    super.key,
    required this.item,
    this.position,
    this.onDelete,
    this.onTap,
    this.onToggleFeatured,
  });

  final GalleryImageItem item;
  final int? position;
  final VoidCallback? onDelete;
  final VoidCallback? onTap;
  final VoidCallback? onToggleFeatured;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    final double aspectRatio = item.aspectRatio;

    return AspectRatio(
      aspectRatio: aspectRatio,
      child: Stack(
        fit: StackFit.expand,
        children: [
          GestureDetector(
            onTap: onTap,
            child: CachedNetworkImage(
              imageUrl: item.url,
              fit: BoxFit.cover,
              placeholder: (_, _) => ColoredBox(
                color: scheme.surfaceContainerHighest,
                child: Icon(
                  Icons.image_outlined,
                  color: scheme.outlineVariant,
                  size: 32,
                ),
              ),
              errorWidget: (_, _, _) => ColoredBox(
                color: scheme.surfaceContainerHighest,
                child: Icon(
                  Icons.broken_image_outlined,
                  color: scheme.outlineVariant,
                  size: 32,
                ),
              ),
            ),
          ),
          // Position badge (top-right)
          if (position != null)
            Positioned(
              top: 6,
              right: 6,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.55),
                  borderRadius: const BorderRadius.circular(8),
                ),
                child: Text(
                  '#$position',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.3,
                  ),
                ),
              ),
            ),
          // Featured star (bottom-left)
          if (onToggleFeatured != null)
            Positioned(
              bottom: 6,
              left: 6,
              child: GestureDetector(
                onTap: onToggleFeatured,
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: item.isFeatured
                        ? AppColors.warning.withValues(alpha: 0.9)
                        : Colors.black.withValues(alpha: 0.55),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    item.isFeatured
                        ? Icons.star_rounded
                        : Icons.star_border_rounded,
                    color: item.isFeatured ? Colors.white : Colors.white70,
                    size: 16,
                  ),
                ),
              ),
            ),
          // Delete button (bottom-right)
          if (onDelete != null)
            Positioned(
              bottom: 6,
              right: 6,
              child: GestureDetector(
                onTap: onDelete,
                child: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: AppColors.destructive.withValues(alpha: 0.8),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.delete_outline_rounded,
                    color: Colors.white,
                    size: 16,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
