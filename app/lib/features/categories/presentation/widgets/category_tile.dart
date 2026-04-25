import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_radius.dart';
import '../../data/category_model.dart';
import 'category_tile_image.dart';

class CategoryTile extends StatelessWidget {
  const CategoryTile({super.key, required this.item});

  final CategoryItem item;

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
              child: CategoryTileImage(
                coverImageUrl: item.coverImageUrl,
                colorScheme: Theme.of(context).colorScheme,
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
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
              ],
            ),
          ],
        ),
      ),
    );
  }
}
