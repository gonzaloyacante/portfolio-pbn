import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import '../../data/category_model.dart';

class GalleryGridTile extends StatelessWidget {
  const GalleryGridTile({super.key, required this.item, this.position});

  final GalleryImageItem item;
  final int? position;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    const double aspectRatio = 0.8;

    return AspectRatio(
      aspectRatio: aspectRatio,
      child: Stack(
        fit: StackFit.expand,
        children: [
          CachedNetworkImage(
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
