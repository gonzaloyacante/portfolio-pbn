import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../features/app_settings/providers/app_preferences_provider.dart';
import '../../../core/router/route_names.dart';
import '../../../core/theme/app_breakpoints.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../shared/widgets/widgets.dart';

import '../data/service_model.dart';
import '../data/services_repository.dart';
import '../providers/services_provider.dart';
import 'widgets/service_grid_card.dart';
import 'widgets/service_tile.dart';
part 'services_list_page_builders.dart';

class ServicesListPage extends ConsumerStatefulWidget {
  const ServicesListPage({super.key});

  @override
  ConsumerState<ServicesListPage> createState() => _ServicesListPageState();
}

class _ServicesListPageState extends ConsumerState<ServicesListPage> {
  final _searchController = TextEditingController();
  String _search = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearch(String value) => setState(() => _search = value.trim());

  @override
  Widget build(BuildContext context) {
    final viewMode = ref.watch(servicesViewModeProvider);
    final async = ref.watch(
      servicesListProvider(search: _search.isEmpty ? null : _search),
    );
    final hPad = AppBreakpoints.pageMargin(context);

    return AppScaffold(
      title: 'Servicios',
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
          onPressed: () => ref.read(servicesViewModeProvider.notifier).toggle(),
        ),
        IconButton(
          icon: const Icon(Icons.add),
          tooltip: 'Nuevo servicio',
          onPressed: () => context.pushNamed(RouteNames.serviceNew),
        ),
      ],
      body: Column(
        children: [
          Padding(
            padding: EdgeInsets.fromLTRB(
              hPad,
              AppSpacing.base,
              hPad,
              AppSpacing.base,
            ),
            child: AppSearchBar(
              hint: 'Buscar servicios…',
              controller: _searchController,
              onChanged: _onSearch,
            ),
          ),
          Expanded(
            child: async.when(
              loading: () => viewMode == ViewMode.grid
                  ? const SkeletonServicesGrid()
                  : const SkeletonServicesList(),
              error: (e, _) => ErrorState(
                message: e.toString(),
                onRetry: () => ref.invalidate(servicesListProvider),
              ),
              data: (paginated) => paginated.data.isEmpty
                  ? const EmptyState(
                      icon: Icons.design_services_outlined,
                      title: 'Sin servicios',
                      subtitle: 'Crea tu primer servicio',
                    )
                  : RefreshIndicator(
                      onRefresh: () async =>
                          ref.invalidate(servicesListProvider),
                      child: viewMode == ViewMode.grid
                          ? _buildGrid(paginated.data, hPad)
                          : _buildList(paginated.data, hPad),
                    ),
            ),
          ),
        ],
      ),
    );
  }
}
