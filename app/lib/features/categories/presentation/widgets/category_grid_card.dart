import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_radius.dart';
import '../../data/category_model.dart';

class CategoryGridCard extends StatelessWidget {
  const CategoryGridCard({super.key, required this.item});

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
      child: Stack(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                height: 100,
                width: double.infinity,
                child: ClipRRect(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(8),
                  ),
                  child:
                      item.coverImageUrl != null &&
                          item.coverImageUrl!.isNotEmpty
                      ? CachedNetworkImage(
                          imageUrl: item.coverImageUrl!,
                          width: double.infinity,
                          height: double.infinity,
                          fit: BoxFit.cover,
                          placeholder: (context, url) => ColoredBox(
                            color: scheme.surfaceContainerHighest,
                            child: Icon(
                              Icons.image_outlined,
                              color: scheme.outlineVariant,
                              size: 36,
                            ),
                          ),
                          errorWidget: (context, url, error) => ColoredBox(
                            color: scheme.surfaceContainerHighest,
                            child: Icon(
                              Icons.broken_image_outlined,
                              color: scheme.outlineVariant,
                              size: 36,
                            ),
                          ),
                        )
                      : ColoredBox(
                          color: scheme.surfaceContainerHighest,
                          child: Center(
                            child: Icon(
                              Icons.photo_library_outlined,
                              color: scheme.outlineVariant,
                              size: 36,
                            ),
                          ),
                        ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(10, 8, 10, 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.name,
                      style: theme.textTheme.labelLarge?.copyWith(
                        fontWeight: FontWeight.w700,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
          Positioned(
            top: 8,
            right: 8,
            child: Container(
              padding: EdgeInsets.zero,
              decoration: BoxDecoration(
                color: scheme.surface,
                borderRadius: BorderRadius.circular(12),
              ),
              child: StatusBadge(
                status: item.isActive ? AppStatus.active : AppStatus.inactive,
                small: true,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
