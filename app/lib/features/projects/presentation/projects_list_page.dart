import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/router/route_names.dart';
import '../../../core/theme/app_colors.dart';
import '../../../shared/widgets/app_scaffold.dart';
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

    return AppScaffold(
      title: 'Proyectos',
      actions: [
        IconButton(
          icon: const Icon(Icons.add_rounded),
          tooltip: 'Nuevo proyecto',
          onPressed: () => context.pushNamed(RouteNames.projectNew),
        ),
      ],
      body: Column(
        children: [
          _SearchBar(controller: _searchController, onSearch: _onSearch),
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
                      ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ── _SearchBar ────────────────────────────────────────────────────────────────

class _SearchBar extends StatelessWidget {
  const _SearchBar({required this.controller, required this.onSearch});

  final TextEditingController controller;
  final void Function(String) onSearch;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
      child: SearchBar(
        controller: controller,
        hintText: 'Buscar proyectos…',
        leading: const Icon(Icons.search_rounded),
        trailing: [
          if (controller.text.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.clear_rounded),
              onPressed: () {
                controller.clear();
                onSearch('');
              },
            ),
        ],
        onChanged: onSearch,
        elevation: const WidgetStatePropertyAll(0),
      ),
    );
  }
}

// ── _ProjectsList ─────────────────────────────────────────────────────────────

class _ProjectsList extends StatelessWidget {
  const _ProjectsList({required this.items, required this.onDelete});

  final List<ProjectListItem> items;
  final Future<void> Function(String id, String title) onDelete;

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
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
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
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
                      children: const [
                        Icon(Icons.delete_outline, size: 18, color: Colors.red),
                        SizedBox(width: 10),
                        Text('Eliminar', style: TextStyle(color: Colors.red)),
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
