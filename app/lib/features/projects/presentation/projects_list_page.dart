import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/providers/app_preferences_provider.dart';
import '../../../core/router/route_names.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/app_scaffold.dart';
import '../../../shared/widgets/app_search_bar.dart';
import '../../../shared/widgets/fade_slide_in.dart';
import '../../../shared/widgets/confirm_dialog.dart';
import '../../../shared/widgets/empty_state.dart';
import '../../../shared/widgets/error_state.dart';
import '../../../shared/widgets/shimmer_loader.dart';
import '../../../shared/widgets/status_badge.dart';
import '../data/project_model.dart';
import '../data/projects_repository.dart';
import '../providers/projects_provider.dart';

// ── ProjectsListPage ──────────────────────────────────────────────────────────

class ProjectsListPage extends ConsumerStatefulWidget {
  const ProjectsListPage({super.key});

  @override
  ConsumerState<ProjectsListPage> createState() => _ProjectsListPageState();
}

class _ProjectsListPageState extends ConsumerState<ProjectsListPage> {
  final _searchController = TextEditingController();
  String? _searchQuery;
  String? _selectedCategoryId;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearch(String value) {
    setState(() => _searchQuery = value.isEmpty ? null : value);
  }

  Future<void> _deleteProject(String id, String title) async {
    final confirmed = await ConfirmDialog.show(
      context,
      title: 'Eliminar proyecto',
      message: '¿Eliminar "$title"? Esta acción no se puede deshacer.',
      confirmLabel: 'Eliminar',
      isDestructive: true,
      icon: Icons.delete_forever_outlined,
    );
    if (!confirmed || !mounted) return;

    try {
      await ref.read(projectsRepositoryProvider).deleteProject(id);
      ref.invalidate(projectsListProvider);
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('"$title" eliminado')));
      }
    } catch (e, st) {
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: $e'),
            backgroundColor: AppColors.destructive,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final projectsAsync = ref.watch(
      projectsListProvider(
        search: _searchQuery,
        categoryId: _selectedCategoryId,
      ),
    );

    final viewMode = ref.watch(projectsViewModeProvider);

    return AppScaffold(
      title: 'Proyectos',
      actions: [
        IconButton(
          icon: Icon(
            viewMode == ViewMode.grid
                ? Icons.view_list_rounded
                : Icons.grid_view_rounded,
          ),
          tooltip: viewMode == ViewMode.grid
              ? 'Vista lista'
              : 'Vista cuadrícula',
          onPressed: () => ref.read(projectsViewModeProvider.notifier).toggle(),
        ),
        IconButton(
          icon: const Icon(Icons.add_rounded),
          tooltip: 'Nuevo proyecto',
          onPressed: () => context.pushNamed(RouteNames.projectNew),
        ),
      ],
      body: Column(
        children: [
          AppSearchBar(
            hint: 'Buscar proyectos…',
            controller: _searchController,
            onChanged: _onSearch,
          ),
          Expanded(
            child: RefreshIndicator(
              onRefresh: () async => ref.invalidate(projectsListProvider),
              child: projectsAsync.when(
                loading: () => const SkeletonListView(itemCount: 8),
                error: (err, _) => ErrorState(
                  message: 'No se pudieron cargar los proyectos',
                  onRetry: () => ref.invalidate(projectsListProvider),
                ),
                data: (paginated) => paginated.data.isEmpty
                    ? const EmptyState(
                        icon: Icons.photo_library_outlined,
                        title: 'Sin proyectos',
                        subtitle: 'Crea tu primer proyecto con el botón +',
                      )
                    : _ProjectsList(
                        items: paginated.data,
                        onDelete: _deleteProject,
                        viewMode: viewMode,
                      ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ── _ProjectsList ─────────────────────────────────────────────────────────────

class _ProjectsList extends StatelessWidget {
  const _ProjectsList({
    required this.items,
    required this.onDelete,
    this.viewMode = ViewMode.grid,
  });

  final List<ProjectListItem> items;
  final Future<void> Function(String id, String title) onDelete;
  final ViewMode viewMode;

  @override
  Widget build(BuildContext context) {
    final hPad = AppBreakpoints.pageMargin(context);
    final gutter = AppBreakpoints.gutter(context);
    final cols = AppBreakpoints.gridColumns(
      context,
      compact: 2,
      medium: 3,
      expanded: 4,
    );

    if (viewMode == ViewMode.grid) {
      return GridView.builder(
        padding: EdgeInsets.symmetric(
          horizontal: hPad,
          vertical: AppSpacing.sm,
        ),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: cols,
          crossAxisSpacing: gutter,
          mainAxisSpacing: gutter,
          childAspectRatio: 0.8,
        ),
        itemCount: items.length,
        itemBuilder: (context, index) {
          final item = items[index];
          return FadeSlideIn(
            delay: Duration(milliseconds: (index * 40).clamp(0, 300)),
            child: _ProjectGridCard(item: item, onDelete: onDelete),
          );
        },
      );
    }
    return ListView.separated(
      padding: EdgeInsets.symmetric(horizontal: hPad, vertical: AppSpacing.sm),
      itemCount: items.length,
      separatorBuilder: (_, _) => const SizedBox(height: 8),
      itemBuilder: (context, index) {
        final item = items[index];
        return FadeSlideIn(
          delay: Duration(milliseconds: (index * 40).clamp(0, 300)),
          child: _ProjectTile(item: item, onDelete: onDelete),
        );
      },
    );
  }
}

// ── _ProjectGridCard ──────────────────────────────────────────────────────────

class _ProjectGridCard extends StatelessWidget {
  const _ProjectGridCard({required this.item, required this.onDelete});

  final ProjectListItem item;
  final Future<void> Function(String id, String title) onDelete;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;

    return Card(
      margin: EdgeInsets.zero,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(borderRadius: AppRadius.forTile),
      child: InkWell(
        onTap: () => context.pushNamed(
          RouteNames.projectEdit,
          pathParameters: {'id': item.id},
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Thumbnail
            Expanded(
              child: item.thumbnailUrl != null && item.thumbnailUrl!.isNotEmpty
                  ? CachedNetworkImage(
                      imageUrl: item.thumbnailUrl!,
                      width: double.infinity,
                      fit: BoxFit.cover,
                      placeholder: (_, _) => Container(
                        color: scheme.surfaceContainerHighest,
                        child: Icon(
                          Icons.image_outlined,
                          color: scheme.outlineVariant,
                          size: 36,
                        ),
                      ),
                      errorWidget: (_, _, _) => Container(
                        color: scheme.surfaceContainerHighest,
                        child: Icon(
                          Icons.broken_image_outlined,
                          color: scheme.outlineVariant,
                          size: 36,
                        ),
                      ),
                    )
                  : Container(
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
            // Info
            Padding(
              padding: const EdgeInsets.fromLTRB(10, 8, 4, 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      if (item.isPinned)
                        Padding(
                          padding: const EdgeInsets.only(right: 3),
                          child: Icon(
                            Icons.push_pin_rounded,
                            size: 12,
                            color: scheme.primary,
                          ),
                        ),
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
                      PopupMenuButton<String>(
                        icon: Icon(
                          Icons.more_vert_rounded,
                          size: 16,
                          color: scheme.outline,
                        ),
                        itemBuilder: (_) => const [
                          PopupMenuItem(
                            value: 'edit',
                            child: Row(
                              children: [
                                Icon(Icons.edit_outlined, size: 18),
                                SizedBox(width: 10),
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
                                  color: AppColors.destructive,
                                ),
                                SizedBox(width: 10),
                                Text(
                                  'Eliminar',
                                  style: TextStyle(
                                    color: AppColors.destructive,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                        onSelected: (val) {
                          if (val == 'edit') {
                            context.pushNamed(
                              RouteNames.projectEdit,
                              pathParameters: {'id': item.id},
                            );
                          } else if (val == 'delete') {
                            onDelete(item.id, item.title);
                          }
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      StatusBadge(
                        status: item.isActive
                            ? AppStatus.active
                            : AppStatus.inactive,
                        small: true,
                      ),
                      if (item.isFeatured) ...[
                        const SizedBox(width: 4),
                        StatusBadge(status: AppStatus.featured, small: true),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── _ProjectTile ──────────────────────────────────────────────────────────────

class _ProjectTile extends StatelessWidget {
  const _ProjectTile({required this.item, required this.onDelete});

  final ProjectListItem item;
  final Future<void> Function(String id, String title) onDelete;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scheme = theme.colorScheme;

    return Card(
      margin: EdgeInsets.zero,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(borderRadius: AppRadius.forTile),
      child: InkWell(
        onTap: () => context.pushNamed(
          RouteNames.projectEdit,
          pathParameters: {'id': item.id},
        ),
        child: SizedBox(
          height: 88,
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Thumbnail — full height, wider for portfolio feel
              SizedBox(
                width: 90,
                child:
                    item.thumbnailUrl != null && item.thumbnailUrl!.isNotEmpty
                    ? CachedNetworkImage(
                        imageUrl: item.thumbnailUrl!,
                        fit: BoxFit.cover,
                        placeholder: (_, _) => Container(
                          color: scheme.surfaceContainerHighest,
                          child: Icon(
                            Icons.image_outlined,
                            color: scheme.outlineVariant,
                            size: 28,
                          ),
                        ),
                        errorWidget: (_, _, _) => Container(
                          color: scheme.surfaceContainerHighest,
                          child: Icon(
                            Icons.broken_image_outlined,
                            color: scheme.outlineVariant,
                            size: 28,
                          ),
                        ),
                      )
                    : Container(
                        color: scheme.surfaceContainerHighest,
                        child: Icon(
                          Icons.photo_library_outlined,
                          color: scheme.outlineVariant,
                          size: 28,
                        ),
                      ),
              ),
              // Info
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(14, 12, 4, 12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Title row
                      Row(
                        children: [
                          if (item.isPinned)
                            Padding(
                              padding: const EdgeInsets.only(right: 4),
                              child: Icon(
                                Icons.push_pin_rounded,
                                size: 13,
                                color: scheme.primary,
                              ),
                            ),
                          Expanded(
                            child: Text(
                              item.title,
                              style: theme.textTheme.titleSmall?.copyWith(
                                fontWeight: FontWeight.w700,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 3),
                      // Category
                      Row(
                        children: [
                          Container(
                            width: 6,
                            height: 6,
                            margin: const EdgeInsets.only(right: 5),
                            decoration: BoxDecoration(
                              color: scheme.primary.withValues(alpha: 0.6),
                              shape: BoxShape.circle,
                            ),
                          ),
                          Expanded(
                            child: Text(
                              item.category.name,
                              style: theme.textTheme.bodySmall?.copyWith(
                                color: scheme.outline,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      // Status badges
                      Row(
                        children: [
                          StatusBadge(
                            status: item.isActive
                                ? AppStatus.active
                                : AppStatus.inactive,
                          ),
                          if (item.isFeatured) ...[
                            const SizedBox(width: 6),
                            StatusBadge(status: AppStatus.featured),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              // Actions button
              PopupMenuButton<String>(
                icon: Icon(
                  Icons.more_vert_rounded,
                  size: 20,
                  color: scheme.outline,
                ),
                onSelected: (value) {
                  if (value == 'edit') {
                    context.pushNamed(
                      RouteNames.projectEdit,
                      pathParameters: {'id': item.id},
                    );
                  } else if (value == 'delete') {
                    onDelete(item.id, item.title);
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
                    value: 'delete',
                    child: Row(
                      children: [
                        Icon(
                          Icons.delete_outline,
                          size: 18,
                          color: AppColors.destructive,
                        ),
                        const SizedBox(width: 10),
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
      ),
    );
  }
}
