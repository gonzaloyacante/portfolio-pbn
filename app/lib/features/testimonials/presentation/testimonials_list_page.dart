import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/route_names.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/widgets.dart';
import '../data/testimonial_model.dart';
import '../providers/testimonials_provider.dart';
import 'widgets/testimonial_tile.dart';
import 'widgets/testimonials_list_header.dart';

part 'testimonials_list_page_builders.dart';

class TestimonialsListPage extends ConsumerStatefulWidget {
  const TestimonialsListPage({super.key});

  @override
  ConsumerState<TestimonialsListPage> createState() =>
      _TestimonialsListPageState();
}

class _TestimonialsListPageState extends ConsumerState<TestimonialsListPage> {
  final _searchController = TextEditingController();
  String _search = '';
  String? _statusFilter;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearch(String value) => setState(() => _search = value.trim());

  @override
  Widget build(BuildContext context) {
    final async = ref.watch(
      testimonialsListProvider(
        search: _search.isEmpty ? null : _search,
        status: _statusFilter,
      ),
    );
    final hPad = AppBreakpoints.pageMargin(context);

    return AppScaffold(
      title: 'Testimonios',
      actions: [
        IconButton(
          icon: const Icon(Icons.add),
          tooltip: 'Nuevo testimonio',
          onPressed: () => context.pushNamed(RouteNames.testimonialNew),
        ),
      ],
      body: PaginatedListView<TestimonialItem>(
        asyncValue: async,
        loadingWidget: const SkeletonTestimonialsList(),
        emptyState: const EmptyState(
          icon: Icons.format_quote_outlined,
          title: 'Sin testimonios',
          subtitle: 'Agrega el primer testimonio',
        ),
        onRetry: () => ref.invalidate(testimonialsListProvider),
        onRefresh: () async => ref.invalidate(testimonialsListProvider),
        headerWidget: TestimonialsListHeader(
          controller: _searchController,
          onSearch: _onSearch,
          statusFilter: _statusFilter,
          hPad: hPad,
          onFilterChanged: (s) => setState(() => _statusFilter = s),
        ),
        dataBuilder: (items) => _buildList(items, hPad),
      ),
    );
  }
}
