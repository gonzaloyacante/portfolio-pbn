import 'dart:io';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

/// Miniatura de galería (red o archivo local) con botón de eliminar.
class GalleryThumb extends StatelessWidget {
  const GalleryThumb.network({
    super.key,
    required String url,
    required this.onRemove,
    this.onSetCover,
    this.isCover = false,
  }) : _url = url,
       _file = null;

  const GalleryThumb.file({
    super.key,
    required File file,
    required this.onRemove,
    this.onSetCover,
    this.isCover = false,
  }) : _url = null,
       _file = file;

  final String? _url;
  final File? _file;
  final VoidCallback onRemove;
  final VoidCallback? onSetCover;
  final bool isCover;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    Widget img;
    if (_url != null) {
      img = CachedNetworkImage(
        imageUrl: _url,
        width: 100,
        height: 100,
        fit: BoxFit.cover,
        placeholder: (context, url) =>
            Container(color: scheme.surfaceContainerHighest),
        errorWidget: (context, url, error) => Container(
          color: scheme.surfaceContainerHighest,
          child: Icon(
            Icons.broken_image_outlined,
            color: scheme.outlineVariant,
          ),
        ),
      );
    } else {
      img = Image.file(_file!, width: 100, height: 100, fit: BoxFit.cover);
    }

    return Stack(
      children: [
        ClipRRect(borderRadius: BorderRadius.circular(10), child: img),
        if (onSetCover != null)
          Positioned(
            top: 3,
            left: 3,
            child: GestureDetector(
              onTap: onSetCover,
              child: Container(
                width: 26,
                height: 26,
                decoration: BoxDecoration(
                  color: isCover
                      ? Colors.amber
                      : Colors.black.withValues(alpha: 0.55),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  isCover ? Icons.star : Icons.star_border,
                  size: 14,
                  color: isCover ? Colors.black : Colors.white,
                ),
              ),
            ),
          ),
        Positioned(
          top: 3,
          right: 3,
          child: GestureDetector(
            onTap: onRemove,
            child: Container(
              width: 22,
              height: 22,
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.65),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.close_rounded,
                size: 14,
                color: Colors.white,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
