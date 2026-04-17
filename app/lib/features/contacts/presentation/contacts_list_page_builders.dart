part of 'contacts_list_page.dart';

extension _ContactsListPageBuilders on _ContactsListPageState {
  Widget _buildList(List<ContactItem> items, double hPad) {
    return RefreshIndicator(
      onRefresh: () async => ref.invalidate(contactsListProvider),
      child: ListView.separated(
        padding: EdgeInsets.symmetric(horizontal: hPad),
        itemCount: items.length,
        separatorBuilder: (_, _) => const SizedBox(height: 6),
        itemBuilder: (ctx, i) {
          final item = items[i];
          return RepaintBoundary(
            child: FadeSlideIn(
              delay: Duration(milliseconds: (i * 40).clamp(0, 300)),
              child: ContactTile(
                item: item,
                priorityColor: _priorityColor(ctx, item.priority),
                statusIcon: _statusIcon(item.status),
                onDelete: _delete,
              ),
            ),
          );
        },
      ),
    );
  }
}
