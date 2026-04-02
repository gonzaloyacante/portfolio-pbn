import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/theme/app_radius.dart';
import '../../data/category_model.dart';

class GalleryTile extends StatelessWidget {
  const GalleryTile({
    super.key,
    required this.item,
    required this.index,
    required this.total,
  });

  final GalleryImageItem item;
  final int index;
  final int total;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: AppCard(
        borderRadius: AppRadius.asRounded(AppRadius.sm),
        padding: EdgeInsets.zero,
        child: Row(
          children: [
            SizedBox(
              width: 36,
              child: Center(
                child: Text(
                  '${index + 1}',
                  style: theme.textTheme.labelMedium?.copyWith(
                    color: scheme.onSurface.withValues(alpha: 0.5),
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
            ClipRRect(
              borderRadius: BorderRadius.circular(6),
              child: SizedBox(
                width: 72,
                height: 72,
                child: CachedNetworkImage(
                  imageUrl: item.url,
                  fit: BoxFit.cover,
                  placeholder: (ctx2, url) => ColoredBox(
                    color: scheme.surfaceContainerHighest,
                    child: Icon(
                      Icons.image_outlined,
                      color: scheme.outlineVariant,
                      size: 28,
                    ),
                  ),
                  errorWidget: (ctx2, url, err) => ColoredBox(
                    color: scheme.surfaceContainerHighest,
                    child: Icon(
                      Icons.broken_image_outlined,
                      color: scheme.outlineVariant,
                      size: 28,
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Imagen #${item.order}',
                      style: theme.textTheme.labelLarge?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Icon(
                Icons.drag_handle_rounded,
                color: scheme.onSurface.withValues(alpha: 0.3),
                size: 22,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
