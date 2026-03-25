import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_radius.dart';
import '../../../../shared/widgets/app_card.dart';
import '../../../../shared/widgets/status_badge.dart';
import '../../data/testimonial_model.dart';
import 'star_rating.dart';

class TestimonialTile extends StatelessWidget {
  const TestimonialTile({
    super.key,
    required this.item,
    required this.statusOf,
    required this.onDelete,
  });

  final TestimonialItem item;
  final AppStatus Function(String) statusOf;
  final Future<void> Function(BuildContext, TestimonialItem) onDelete;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    return AppCard(
      onTap: () => context.pushNamed(
        RouteNames.testimonialEdit,
        pathParameters: {'id': item.id},
      ),
      borderRadius: AppRadius.forTile,
      padding: const EdgeInsets.fromLTRB(14, 12, 4, 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Avatar ──────────────────────────────────────
          _buildAvatar(colorScheme),
          const SizedBox(width: 12),
          // ── Info ────────────────────────────────────────
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Name + stars
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        item.name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: theme.textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    const SizedBox(width: 6),
                    StarRating(rating: item.rating),
                  ],
                ),
                // Position / Company
                if (item.position != null || item.company != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 2),
                    child: Text(
                      [
                        item.position,
                        item.company,
                      ].where((s) => s != null).join(' · '),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: colorScheme.outline,
                      ),
                    ),
                  ),
                // Excerpt — styled like a quote
                if (item.excerpt != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 6),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Icon(
                          Icons.format_quote_rounded,
                          size: 14,
                          color: colorScheme.primary.withValues(alpha: 0.5),
                        ),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            item.excerpt!,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: theme.textTheme.bodySmall?.copyWith(
                              fontStyle: FontStyle.italic,
                              color: colorScheme.onSurface.withValues(
                                alpha: 0.7,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                // Status + featured badge row
                Padding(
                  padding: const EdgeInsets.only(top: 6),
                  child: Row(
                    children: [
                      StatusBadge(status: statusOf(item.status), small: true),
                      if (item.featured) ...[
                        const SizedBox(width: 6),
                        const Icon(
                          Icons.star_rounded,
                          size: 14,
                          color: AppColors.warning,
                        ),
                        const SizedBox(width: 2),
                        Text(
                          'Destacado',
                          style: theme.textTheme.labelSmall?.copyWith(
                            color: AppColors.warning,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                      if (item.verified) ...[
                        const SizedBox(width: 6),
                        Icon(
                          Icons.verified_rounded,
                          size: 14,
                          color: colorScheme.primary,
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          ),
          // ── Menu ────────────────────────────────────────
          PopupMenuButton<String>(
            iconSize: 20,
            itemBuilder: (_) => [
              const PopupMenuItem(
                value: 'edit',
                child: Row(
                  children: [
                    Icon(Icons.edit_outlined, size: 18),
                    SizedBox(width: 8),
                    Text('Editar'),
                  ],
                ),
              ),
              PopupMenuItem(
                value: 'delete',
                child: Row(
                  children: [
                    Icon(
                      Icons.delete_outline,
                      size: 18,
                      color: colorScheme.error,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Eliminar',
                      style: TextStyle(color: colorScheme.error),
                    ),
                  ],
                ),
              ),
            ],
            onSelected: (action) {
              switch (action) {
                case 'edit':
                  context.pushNamed(
                    RouteNames.testimonialEdit,
                    pathParameters: {'id': item.id},
                  );
                case 'delete':
                  onDelete(context, item);
              }
            },
          ),
        ],
      ),
    );
  }

  Widget _buildAvatar(ColorScheme colorScheme) {
    return Container(
      width: 46,
      height: 46,
      decoration: BoxDecoration(
        color: colorScheme.primary.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(14),
      ),
      clipBehavior: Clip.antiAlias,
      child: item.avatarUrl != null
          ? CachedNetworkImage(
              imageUrl: item.avatarUrl!,
              fit: BoxFit.cover,
              width: 46,
              height: 46,
              placeholder: (_, _) => Center(
                child: SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: colorScheme.primary.withValues(alpha: 0.4),
                  ),
                ),
              ),
              errorWidget: (_, _, _) => _initialsWidget(colorScheme),
            )
          : _initialsWidget(colorScheme),
    );
  }

  Widget _initialsWidget(ColorScheme colorScheme) {
    return Center(
      child: Text(
        item.name.isNotEmpty ? item.name[0].toUpperCase() : '?',
        style: TextStyle(
          fontWeight: FontWeight.w700,
          color: colorScheme.primary,
          fontSize: 18,
        ),
      ),
    );
  }
}
