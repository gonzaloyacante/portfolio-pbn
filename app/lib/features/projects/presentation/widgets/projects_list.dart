import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../../core/providers/app_preferences_provider.dart';
import '../../../../core/theme/app_breakpoints.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../shared/models/paginated_response.dart';
import '../../../../shared/widgets/fade_slide_in.dart';
import '../../data/project_model.dart';
import '../../data/projects_repository.dart';
import '../../../../shared/widgets/shimmer_loader.dart';
import 'project_grid_card.dart';
import 'project_tile.dart';

class ProjectsList extends ConsumerStatefulWidget {
  const ProjectsList({
    super.key,
    required this.initialPaginated,
    required this.onDelete,
    this.viewMode = ViewMode.grid,
    this.search,
    this.categoryId,
  });

  final PaginatedResponse<ProjectListItem> initialPaginated;
  final Future<void> Function(String id, String title) onDelete;
  final ViewMode viewMode;
  final String? search;
  final String? categoryId;

  @override
  ConsumerState<ProjectsList> createState() => _ProjectsListState();
}

class _ProjectsListState extends ConsumerState<ProjectsList> {
  late List<ProjectListItem> _items;
  late int _page;
  late int _limit;
  late int _totalPages;
  bool _isLoadingMore = false;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _items = List<ProjectListItem>.from(widget.initialPaginated.data);
    _page = widget.initialPaginated.pagination.page;
    _limit = widget.initialPaginated.pagination.limit;
    _totalPages = widget.initialPaginated.pagination.totalPages;
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (!_scrollController.hasClients || _isLoadingMore) return;
    const threshold = 200.0;
    final maxScroll = _scrollController.position.maxScrollExtent;
    final current = _scrollController.position.pixels;
    if (maxScroll - current <= threshold && _page < _totalPages) {
      _loadNextPage();
    }
  }

  Future<void> _loadNextPage() async {
    setState(() => _isLoadingMore = true);
    try {
      final repo = ref.read(projectsRepositoryProvider);
      final nextPage = _page + 1;
      final resp = await repo.getProjects(
        page: nextPage,
        limit: _limit,
        search: widget.search,
        categoryId: widget.categoryId,
      );
      setState(() {
        _items.addAll(resp.data);
        _page = resp.pagination.page;
        _totalPages = resp.pagination.totalPages;
        _isLoadingMore = false;
      });
    } catch (e, st) {
      setState(() => _isLoadingMore = false);
      Sentry.captureException(e, stackTrace: st);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Error cargando más proyectos')),
        );
      }
    }
  }

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

    if (widget.viewMode == ViewMode.grid) {
      return GridView.builder(
        controller: _scrollController,
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
        itemCount: _items.length + (_isLoadingMore ? 1 : 0),
        itemBuilder: (context, index) {
          if (index >= _items.length) {
            return const SkeletonProjectGridCard();
          }
          final item = _items[index];
          return FadeSlideIn(
            delay: Duration(milliseconds: (index * 40).clamp(0, 300)),
            child: ProjectGridCard(item: item, onDelete: widget.onDelete),
          );
        },
      );
    }

    return ListView.separated(
      controller: _scrollController,
      padding: EdgeInsets.symmetric(horizontal: hPad, vertical: AppSpacing.sm),
      itemCount: _items.length + (_isLoadingMore ? 1 : 0),
      separatorBuilder: (_, _) => const SizedBox(height: 8),
      itemBuilder: (context, index) {
        if (index >= _items.length) {
          return const SkeletonProjectTile();
        }
        final item = _items[index];
        return FadeSlideIn(
          delay: Duration(milliseconds: (index * 40).clamp(0, 300)),
          child: ProjectTile(item: item, onDelete: widget.onDelete),
        );
      },
    );
  }
}
