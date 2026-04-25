part of 'contacts_list_page.dart';

extension _ContactsListPageBuilders on _ContactsListPageState {
  Widget _buildList(List<ContactItem> items, double hPad) {
    return ListView.separated(
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
            ),
          ),
        );
      },
    );
  }

  Color _priorityColor(BuildContext context, String priority) =>
      switch (priority) {
        'URGENT' => AppColors.priorityHigh,
        'HIGH' => AppColors.priorityMedium,
        'LOW' => AppColors.priorityLow,
        _ => Theme.of(context).colorScheme.secondary,
      };

  IconData _statusIcon(String status) => switch (status) {
    'REPLIED' => Icons.reply,
    'CLOSED' => Icons.check_circle_outline,
    'SPAM' => Icons.block,
    'IN_PROGRESS' => Icons.pending_outlined,
    _ => Icons.mail_outline,
  };
}
