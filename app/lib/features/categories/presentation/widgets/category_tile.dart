import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_radius.dart';
import '../../data/category_model.dart';

class CategoryTile extends StatelessWidget {
  const CategoryTile({super.key, required this.item, required this.onDelete});

  final CategoryItem item;
  final Future<void> Function(BuildContext, CategoryItem) onDelete;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;

    return AppCard(
      borderRadius: AppRadius.forTile,
      padding: EdgeInsets.zero,
      onTap: () => context.pushNamed(
        RouteNames.categoryEdit,
        pathParameters: {'id': item.id},
      ),
      child: SizedBox(
        height: 80,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            SizedBox(
              width: 80,
              child:
                  (item.thumbnailUrl ?? item.coverImageUrl) != null &&
                      (item.thumbnailUrl ?? item.coverImageUrl)!.isNotEmpty
                  ? CachedNetworkImage(
                      imageUrl: (item.thumbnailUrl ?? item.coverImageUrl)!,
                      fit: BoxFit.cover,
                      placeholder: (context, url) => ColoredBox(
                        color: scheme.surfaceContainerHighest,
                        child: Icon(
                          Icons.image_outlined,
                          color: scheme.outlineVariant,
                          size: 28,
                        ),
                      ),
                      errorWidget: (context, url, error) => ColoredBox(
                        color: scheme.surfaceContainerHighest,
                        child: Icon(
                          Icons.broken_image_outlined,
                          color: scheme.outlineVariant,
                          size: 28,
                        ),
                      ),
                    )
                  : ColoredBox(
                      color: scheme.surfaceContainerHighest,
                      child: Icon(
                        Icons.photo_library_outlined,
                        color: scheme.outlineVariant,
                        size: 28,
                      ),
                    ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(14, 12, 4, 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            item.name,
                            style: theme.textTheme.titleSmall?.copyWith(
                              fontWeight: FontWeight.w700,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 4),
                        StatusBadge(
                          small: true,
                          status: item.isActive
                              ? AppStatus.active
                              : AppStatus.inactive,
                        ),
                      ],
                    ),
                    const SizedBox(height: 3),
                    Row(
                      children: [
                        Icon(
                          Icons.photo_library_outlined,
                          size: 13,
                          color: scheme.onSurface,
                        ),
                        const SizedBox(width: 3),
                        Text(
                          '${item.projectCount} proyectos',
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: scheme.onSurface,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            PopupMenuButton<String>(
              icon: Icon(
                Icons.more_vert_rounded,
                size: 20,
                color: scheme.onSurface,
              ),
              onSelected: (action) {
                if (action == 'edit') {
                  context.pushNamed(
                    RouteNames.categoryEdit,
                    pathParameters: {'id': item.id},
                  );
                } else if (action == 'gallery') {
                  context.pushNamed(
                    RouteNames.categoryGallery,
                    pathParameters: {'id': item.id},
                    queryParameters: {'name': item.name},
                  );
                } else if (action == 'delete') {
                  onDelete(context, item);
                }
              },
              itemBuilder: (_) => [
                PopupMenuItem(
                  value: 'edit',
                  child: Row(
                    children: [
                      Icon(
                        Icons.edit_outlined,
                        size: 18,
                        color: scheme.onSurface,
                      ),
                      const SizedBox(width: 10),
                      const Text('Editar'),
                    ],
                  ),
                ),
                if (item.projectCount > 0)
                  PopupMenuItem(
                    value: 'gallery',
                    child: Row(
                      children: [
                        Icon(
                          Icons.photo_library_outlined,
                          size: 18,
                          color: scheme.onSurface,
                        ),
                        const SizedBox(width: 10),
                        const Text('Ver galería'),
                      ],
                    ),
                  ),
                const PopupMenuItem(
                  value: 'delete',
                  child: Row(
                    children: [
                      Icon(
                        Icons.delete_outline,
                        size: 18,
                        color: AppColors.destructive,
                      ),
                      SizedBox(width: 10),
                      Text(
                        'Eliminar',
                        style: TextStyle(color: AppColors.destructive),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
