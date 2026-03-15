import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import '../../data/category_model.dart';
import 'gallery_badge.dart';

class GalleryGridTile extends StatelessWidget {
  const GalleryGridTile({super.key, required this.item, this.position});

  final GalleryImageItem item;
  final int? position;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    final aspectRatio =
        (item.width != null && item.height != null && item.height! > 0)
        ? item.width! / item.height!
        : 0.8;

    return AspectRatio(
      aspectRatio: aspectRatio,
      child: Stack(
        fit: StackFit.expand,
        children: [
          CachedNetworkImage(
            imageUrl: item.thumbnailUrl,
            fit: BoxFit.cover,
            placeholder: (_, _) => Container(
              color: scheme.surfaceContainerHighest,
              child: Icon(
                Icons.image_outlined,
                color: scheme.outlineVariant,
                size: 32,
              ),
            ),
            errorWidget: (_, _, _) => Container(
              color: scheme.surfaceContainerHighest,
              child: Icon(
                Icons.broken_image_outlined,
                color: scheme.outlineVariant,
                size: 32,
              ),
            ),
          ),
          if (item.isCover || item.isHero)
            Positioned(
              bottom: 6,
              left: 6,
              child: Wrap(
                spacing: 3,
                children: [
                  if (item.isCover)
                    GalleryBadge(label: 'Portada', color: scheme.primary),
                  if (item.isHero)
                    GalleryBadge(label: 'Hero', color: scheme.tertiary),
                ],
              ),
            ),
          if (position != null)
            Positioned(
              top: 6,
              right: 6,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.55),
                  borderRadius: BorderRadius.circular(8),
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
        ],
      ),
    );
  }
}
