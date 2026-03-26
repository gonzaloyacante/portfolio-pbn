import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/providers/app_preferences_provider.dart';
import '../../../core/router/route_names.dart';
import '../../../core/theme/app_colors.dart';
import '../../../shared/widgets/widgets.dart';
import '../data/projects_repository.dart';
import '../providers/projects_provider.dart';
import 'widgets/projects_list.dart';

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
                loading: () => viewMode == ViewMode.grid
                    ? const SkeletonProjectsGrid()
                    : const SkeletonProjectsList(),
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
                    : ProjectsList(
                        initialPaginated: paginated,
                        onDelete: _deleteProject,
                        viewMode: viewMode,
                        search: _searchQuery,
                        categoryId: _selectedCategoryId,
                      ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
