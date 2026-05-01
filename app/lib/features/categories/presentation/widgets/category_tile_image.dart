import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

/// Imagen de portada de una categoría con fallback a ícono placeholder.
class CategoryTileImage extends StatelessWidget {
  const CategoryTileImage({
    super.key,
    required this.coverImageUrl,
    required this.colorScheme,
  });

  final String? coverImageUrl;
  final ColorScheme colorScheme;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 80,
      child: coverImageUrl != null && coverImageUrl!.isNotEmpty
          ? CachedNetworkImage(
              imageUrl: coverImageUrl!,
              fit: BoxFit.cover,
              placeholder: (_, _) => ShimmerLoader(
                child: ColoredBox(
                  color: colorScheme.surfaceContainerHighest,
                  child: Icon(
                    Icons.image_outlined,
                    color: colorScheme.outlineVariant,
                    size: 28,
                  ),
                ),
              ),
              errorWidget: (_, _, _) => ColoredBox(
                color: colorScheme.surfaceContainerHighest,
                child: Icon(
                  Icons.broken_image_outlined,
                  color: colorScheme.outlineVariant,
                  size: 28,
                ),
              ),
            )
          : ColoredBox(
              color: colorScheme.surfaceContainerHighest,
              child: Icon(
                Icons.photo_library_outlined,
                color: colorScheme.outlineVariant,
                size: 28,
              ),
            ),
    );
  }
}
