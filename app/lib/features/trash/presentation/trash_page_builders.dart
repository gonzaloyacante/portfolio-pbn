part of 'trash_page.dart';

extension _TrashPageBuilders on _TrashPageState {
  Widget _buildContent(
    BuildContext context,
    Map<String, List<TrashItem>> grouped,
  ) {
    final normalizedQuery = _searchQuery.toLowerCase();
    final filteredGrouped = normalizedQuery.isEmpty
        ? grouped
        : Map.fromEntries(
            grouped.entries
                .map(
                  (e) => MapEntry(
                    e.key,
                    e.value
                        .where(
                          (item) => item.displayName.toLowerCase().contains(
                            normalizedQuery,
                          ),
                        )
                        .toList(),
                  ),
                )
                .where((e) => e.value.isNotEmpty),
          );
    final allItems = filteredGrouped.values.expand((list) => list).toList();
    if (allItems.isEmpty) {
      if (normalizedQuery.isNotEmpty) {
        return Column(
          children: [
            AppSearchBar(hint: 'Buscar en papelera...', onChanged: _onSearch),
            const Expanded(
              child: EmptyState(
                icon: Icons.search_off_outlined,
                title: 'Sin resultados',
                subtitle: 'No hay elementos que coincidan con la búsqueda',
              ),
            ),
          ],
        );
      }
      return const EmptyState(
        icon: Icons.delete_outline,
        title: 'Papelera vacía',
        subtitle: 'No hay elementos eliminados',
      );
    }
    final sections = filteredGrouped.entries
        .where((e) => e.value.isNotEmpty)
        .toList();

    return LayoutBuilder(
      builder: (context, constraints) {
        final isWide = constraints.maxWidth > 600;
        final List<Widget> rows = [];

        if (!isWide) {
          // Mobile: secciones apiladas verticalmente
          for (final entry in sections) {
            rows.add(
              TrashSection(
                type: entry.key,
                items: entry.value,
                isNarrow: false,
                onTap: (item) =>
                    context.pushNamed(RouteNames.trashDetail, extra: item),
                onRestore: (item) => _restore(context, item),
                onPurge: (item) => _purge(context, item),
              ),
            );
          }
        } else {
          // Tablet: secciones con 1 item se emparejan (50/50).
          // Secciones con 2+ items ocupan el ancho completo.
          int i = 0;
          while (i < sections.length) {
            final cur = sections[i];
            final curIsNarrow = cur.value.length == 1;
            final hasNext = i + 1 < sections.length;
            final nextIsNarrow = hasNext && sections[i + 1].value.length == 1;

            if (curIsNarrow && hasNext && nextIsNarrow) {
              // Dos secciones de 1 item → lado a lado
              final next = sections[i + 1];
              rows.add(
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: TrashSection(
                        type: cur.key,
                        items: cur.value,
                        isNarrow: true,
                        onTap: (item) => context.pushNamed(
                          RouteNames.trashDetail,
                          extra: item,
                        ),
                        onRestore: (item) => _restore(context, item),
                        onPurge: (item) => _purge(context, item),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TrashSection(
                        type: next.key,
                        items: next.value,
                        isNarrow: true,
                        onTap: (item) => context.pushNamed(
                          RouteNames.trashDetail,
                          extra: item,
                        ),
                        onRestore: (item) => _restore(context, item),
                        onPurge: (item) => _purge(context, item),
                      ),
                    ),
                  ],
                ),
              );
              i += 2;
            } else {
              // Sección con 2+ items (o impar sin par) → ancho completo
              rows.add(
                TrashSection(
                  type: cur.key,
                  items: cur.value,
                  isNarrow: false,
                  onTap: (item) =>
                      context.pushNamed(RouteNames.trashDetail, extra: item),
                  onRestore: (item) => _restore(context, item),
                  onPurge: (item) => _purge(context, item),
                ),
              );
              i++;
            }
          }
        }

        return RefreshIndicator(
          onRefresh: () async => ref.invalidate(trashItemsProvider),
          child: ListView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            children: [
              AppSearchBar(hint: 'Buscar en papelera...', onChanged: _onSearch),
              const SizedBox(height: 8),
              ...rows,
            ],
          ),
        );
      },
    );
  }
}
