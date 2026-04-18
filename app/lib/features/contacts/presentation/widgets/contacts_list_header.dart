import 'package:flutter/material.dart';

import '../../../../core/theme/app_spacing.dart';
import '../../../../shared/widgets/widgets.dart';

class ContactsListHeader extends StatelessWidget {
  const ContactsListHeader({
    super.key,
    required this.controller,
    required this.onSearch,
    required this.statusFilter,
    required this.unreadOnly,
    required this.onFilterChanged,
    required this.hPad,
  });

  final TextEditingController controller;
  final ValueChanged<String> onSearch;
  final String? statusFilter;
  final bool unreadOnly;
  final ValueChanged<String?> onFilterChanged;
  final double hPad;

  static const _filterOptions = <String?>[
    null,
    'UNREAD',
    'NEW',
    'IN_PROGRESS',
    'REPLIED',
    'CLOSED',
    'SPAM',
  ];

  static String _filterLabel(String? s) => switch (s) {
    null => 'Todos',
    'UNREAD' => 'No leídos',
    'IN_PROGRESS' => 'En curso',
    'REPLIED' => 'Respondidos',
    'CLOSED' => 'Cerrados',
    'SPAM' => 'Spam',
    _ => 'Nuevos',
  };

  @override
  Widget build(BuildContext context) {
    final selected = unreadOnly ? 'UNREAD' : statusFilter;
    return Padding(
      padding: EdgeInsets.fromLTRB(hPad, AppSpacing.base, hPad, 0),
      child: Column(
        children: [
          AppSearchBar(
            hint: 'Buscar por nombre, email…',
            controller: controller,
            onChanged: onSearch,
          ),
          const SizedBox(height: AppSpacing.sm),
          AppFilterChips<String?>(
            options: _filterOptions,
            selected: selected,
            labelBuilder: _filterLabel,
            onSelected: onFilterChanged,
          ),
        ],
      ),
    );
  }
}
