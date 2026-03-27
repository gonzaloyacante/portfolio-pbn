import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio_pbn/shared/widgets/widgets.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_radius.dart';
import '../../data/project_model.dart';

class ProjectGridCard extends StatelessWidget {
  const ProjectGridCard({
    super.key,
    required this.item,
    required this.onDelete,
  });

  final ProjectListItem item;
  final Future<void> Function(String id, String title) onDelete;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;

    return AppCard(
      borderRadius: AppRadius.forTile,
      padding: EdgeInsets.zero,
      onTap: () => context.pushNamed(
        RouteNames.projectEdit,
        pathParameters: {'id': item.id},
      ),
      child: Stack(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                height: 140,
                width: double.infinity,
                child: Stack(
                  children: [
                    Positioned.fill(
                      child:
                          item.thumbnailUrl != null &&
                              item.thumbnailUrl!.isNotEmpty
                          ? CachedNetworkImage(
                              imageUrl: item.thumbnailUrl!,
                              width: double.infinity,
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
                    Positioned(
                      top: 8,
                      right: 8,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          if (item.isPinned)
                            Container(
                              margin: const EdgeInsets.only(bottom: 6),
                              decoration: BoxDecoration(
                                color:
                                    Theme.of(context).brightness ==
                                        Brightness.light
                                    ? Colors.white
                                    : scheme.surface,
                                borderRadius: BorderRadius.circular(12),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.08),
                                    blurRadius: 6,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: Padding(
                                padding: const EdgeInsets.all(6),
                                child: Icon(
                                  Icons.push_pin_rounded,
                                  size: 14,
                                  color: scheme.primary,
                                ),
                              ),
                            ),
                          Container(
                            margin: const EdgeInsets.only(bottom: 6),
                            decoration: BoxDecoration(
                              color:
                                  Theme.of(context).brightness ==
                                      Brightness.light
                                  ? Colors.white
                                  : scheme.surface,
                              borderRadius: BorderRadius.circular(12),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.06),
                                  blurRadius: 6,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: StatusBadge(
                              status: item.isActive
                                  ? AppStatus.active
                                  : AppStatus.inactive,
                              small: true,
                            ),
                          ),
                          if (item.isFeatured)
                            DecoratedBox(
                              decoration: BoxDecoration(
                                color:
                                    Theme.of(context).brightness ==
                                        Brightness.light
                                    ? Colors.white
                                    : scheme.surface,
                                borderRadius: BorderRadius.circular(12),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.06),
                                    blurRadius: 6,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: const StatusBadge(
                                status: AppStatus.featured,
                                small: true,
                              ),
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(10, 8, 4, 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            item.title,
                            style: theme.textTheme.labelLarge?.copyWith(
                              fontWeight: FontWeight.w700,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            item.category.name,
                            style: theme.textTheme.bodySmall?.copyWith(
                              color: scheme.onSurface,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox.shrink(),
        ],
      ),
    );
  }
}
