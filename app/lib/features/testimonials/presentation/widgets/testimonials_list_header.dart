import 'package:flutter/material.dart';

import '../../../../core/theme/app_spacing.dart';
import '../../../../shared/widgets/widgets.dart';

class TestimonialsListHeader extends StatelessWidget {
  const TestimonialsListHeader({
    super.key,
    required this.controller,
    required this.onSearch,
    required this.statusFilter,
    required this.onFilterChanged,
    required this.hPad,
  });

  final TextEditingController controller;
  final ValueChanged<String> onSearch;
  final String? statusFilter;
  final ValueChanged<String?> onFilterChanged;
  final double hPad;

  static const _filterOptions = <String?>[
    null,
    'PENDING',
    'APPROVED',
    'REJECTED',
  ];

  static String _filterLabel(String? s) => switch (s) {
    'APPROVED' => 'Aprobados',
    'REJECTED' => 'Rechazados',
    'PENDING' => 'Pendientes',
    _ => 'Todos',
  };

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(hPad, AppSpacing.base, hPad, 0),
      child: Column(
        children: [
          AppSearchBar(
            hint: 'Buscar testimonios…',
            controller: controller,
            onChanged: onSearch,
          ),
          const SizedBox(height: AppSpacing.sm),
          AppFilterChips<String?>(
            options: _filterOptions,
            selected: statusFilter,
            labelBuilder: _filterLabel,
            onSelected: onFilterChanged,
          ),
        ],
      ),
    );
  }
}
