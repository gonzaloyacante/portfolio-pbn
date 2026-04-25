import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/paginated_response.dart';
import 'feedback/error_state.dart';

/// Widget reutilizable para listas/grids paginados con AsyncValue.
///
/// Maneja el patrón estándar de todas las list-pages:
///   header (search bar / filtros) + loading skeleton + error + empty + datos
///
/// Uso:
/// ```dart
/// PaginatedListView<CategoryItem>(
///   asyncValue: async,
///   loadingWidget: const SkeletonCategoriesList(),
///   emptyState: const EmptyState(...),
///   onRetry: () => ref.invalidate(categoriesListProvider),
///   onRefresh: () async => ref.invalidate(categoriesListProvider),
///   headerWidget: Padding(..., child: AppSearchBar(...)),
///   dataBuilder: (items) => _buildList(items, hPad),
/// )
/// ```
class PaginatedListView<T> extends StatelessWidget {
  const PaginatedListView({
    super.key,
    required this.asyncValue,
    required this.loadingWidget,
    required this.emptyState,
    required this.dataBuilder,
    required this.onRetry,
    required this.onRefresh,
    this.headerWidget,
  });

  final AsyncValue<PaginatedResponse<T>> asyncValue;
  final Widget loadingWidget;
  final Widget emptyState;
  final Widget Function(List<T> items) dataBuilder;
  final VoidCallback onRetry;
  final Future<void> Function() onRefresh;

  /// Header opcional (search bar, filtros). Gestiona su propio padding.
  final Widget? headerWidget;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ?headerWidget,
        Expanded(
          child: asyncValue.when(
            loading: () => loadingWidget,
            error: (e, _) =>
                ErrorState(message: e.toString(), onRetry: onRetry),
            data: (paginated) => paginated.data.isEmpty
                ? emptyState
                : RefreshIndicator(
                    onRefresh: onRefresh,
                    child: dataBuilder(paginated.data),
                  ),
          ),
        ),
      ],
    );
  }
}
